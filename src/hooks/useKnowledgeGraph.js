/**
 * useKnowledgeGraph Hook
 * Carga y transforma datos del usuario para el grafo de conocimiento
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getStrategyByFounder } from '../services/strategyApi';
import { transformToGraph, calculateCompleteness } from '../utils/graphTransformer';
import { extractTopicsFromConversations } from '../utils/topicExtractor';

/**
 * Hook para cargar datos del grafo de conocimiento
 * @returns {Object} - { graph, loading, error, dataCompleteness, refresh }
 */
export function useKnowledgeGraph() {
  const { founderId } = useAuth();
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);

  const loadGraphData = useCallback(async () => {
    if (!founderId) {
      setLoading(false);
      setGraph({ nodes: [], links: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo de todas las fuentes
      const [
        founderResult,
        businessTestResult,
        strategyResult,
        conversationsResult,
        brainstormingResult
      ] = await Promise.allSettled([
        api.getMeFounder(),
        api.getBusinessTestMe(),
        getStrategyByFounder(founderId),
        api.getConversations(),
        api.getBrainstormingIdeas(founderId, { limit: 20 })
      ]);

      // Extraer resultados (manejar errores individuales gracefully)
      const founderData = founderResult.status === 'fulfilled'
        ? founderResult.value
        : null;

      const businessData = businessTestResult.status === 'fulfilled'
        ? businessTestResult.value
        : null;

      // Strategy puede venir con wrapper { strategy: {...} }
      const strategyData = strategyResult.status === 'fulfilled'
        ? (strategyResult.value?.strategy || strategyResult.value)
        : null;

      // Brainstorming ideas
      const brainstormingData = brainstormingResult.status === 'fulfilled'
        ? brainstormingResult.value?.ideas || []
        : [];

      // Intentar obtener temas usando ML del backend (0 tokens)
      // Fallback a extracción básica en frontend si falla
      let conversationTopics = [];
      let mlTopics = null;

      try {
        const brainTopicsResult = await api.getBrainTopics();
        if (brainTopicsResult?.topics) {
          mlTopics = brainTopicsResult.topics;
          // Usar los keywords combinados del ML
          conversationTopics = (mlTopics.combined_keywords || []).map(item => ({
            topic: item.topic,
            count: item.total_count || 1,
            sources: item.sources || ['ml']
          }));
          console.log('[useKnowledgeGraph] ML topics loaded:', conversationTopics.length);
        }
      } catch (mlError) {
        console.warn('[useKnowledgeGraph] ML topics unavailable, using frontend extraction');
      }

      // Fallback: extracción básica en frontend si ML no está disponible
      if (!conversationTopics.length && conversationsResult.status === 'fulfilled' &&
          conversationsResult.value?.conversations?.length > 0) {
        const conversationIds = conversationsResult.value.conversations
          .slice(0, 8)
          .map(c => c.id);

        const fullConversations = await Promise.all(
          conversationIds.map(id =>
            api.getConversation(id).catch(() => null)
          )
        );

        conversationTopics = extractTopicsFromConversations(
          fullConversations.filter(Boolean)
        );
      }

      // Guardar datos raw para debugging
      setRawData({
        founderProfile: founderData,
        businessTest: businessData,
        strategy: strategyData,
        conversationTopics,
        brainstormingIdeas: brainstormingData,
        mlTopics // ML-extracted topics from backend (if available)
      });

      // Transformar a estructura de grafo
      const graphData = transformToGraph({
        founderProfile: founderData,
        businessTest: businessData,
        strategy: strategyData,
        conversationTopics,
        brainstormingIdeas: brainstormingData
      });

      setGraph(graphData);

    } catch (err) {
      console.error('[useKnowledgeGraph] Error loading graph data:', err);
      setError(err.message || 'Error al cargar datos del grafo');
    } finally {
      setLoading(false);
    }
  }, [founderId]);

  // Cargar datos al montar o cuando cambie founderId
  useEffect(() => {
    loadGraphData();
  }, [loadGraphData]);

  // Calcular completitud
  const dataCompleteness = useMemo(() => {
    return calculateCompleteness(graph);
  }, [graph]);

  // Verificar si hay datos
  const hasData = useMemo(() => {
    return graph.nodes.length > 1; // Más que solo el nodo central
  }, [graph]);

  return {
    graph,
    loading,
    error,
    hasData,
    dataCompleteness,
    rawData, // Para debugging
    refresh: loadGraphData
  };
}

export default useKnowledgeGraph;
