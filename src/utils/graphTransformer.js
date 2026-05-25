/**
 * Graph Transformer
 * Transforma datos de las APIs a formato de grafo para react-force-graph
 */

import { NODE_COLORS, NODE_SIZES, NODE_SHAPES } from '../constants/graphConstants';

/**
 * Transforma datos del usuario a estructura de grafo
 * @param {Object} data - Datos de las diferentes fuentes
 * @returns {Object} - { nodes: [], links: [] }
 */
export function transformToGraph({ founderProfile, businessTest, strategy, conversationTopics, brainstormingIdeas }) {
  const nodes = [];
  const links = [];

  // 1. Nodo central del usuario
  const userId = 'user-central';
  const userName = founderProfile?.name || 'Tú';

  nodes.push({
    id: userId,
    label: userName,
    category: 'user',
    source: 'founder_profile',
    importance: 10,
    shape: NODE_SHAPES.user,
    color: NODE_COLORS.user,
    size: NODE_SIZES.user
  });

  // Helper para agregar nodos conectados al usuario
  const addConnectedNode = (id, label, category, source, importance = 6, index = null) => {
    if (!label || typeof label !== 'string') return;

    const trimmedLabel = label.trim();
    if (trimmedLabel.length < 2) return;

    nodes.push({
      id,
      label: trimmedLabel,
      category,
      source,
      importance,
      index, // Para mostrar número en hexágonos
      shape: NODE_SHAPES[category] || 'circle',
      color: NODE_COLORS[category] || '#1e1e1e',
      size: NODE_SIZES[category] || 10
    });

    links.push({
      source: userId,
      target: id,
      strength: importance * 0.8
    });
  };

  // 2. Expertise (topicsConfidentTeaching)
  if (founderProfile?.topicsConfidentTeaching?.length) {
    founderProfile.topicsConfidentTeaching.forEach((topic, i) => {
      addConnectedNode(`expertise-${i}`, topic, 'expertise', 'founder_profile', 8, i + 1);
    });
  }

  // 3. Audience Interest (topicsPeopleAskAbout)
  if (founderProfile?.topicsPeopleAskAbout?.length) {
    founderProfile.topicsPeopleAskAbout.forEach((topic, i) => {
      addConnectedNode(`audience-${i}`, topic, 'audience_interest', 'founder_profile', 7, i + 1);
    });
  }

  // 4. Values (personalValues)
  if (founderProfile?.personalValues?.length) {
    founderProfile.personalValues.forEach((value, i) => {
      addConnectedNode(`value-${i}`, value, 'value', 'founder_profile', 6);
    });
  }

  // 5. Passions (otherPassions)
  if (founderProfile?.otherPassions?.length) {
    founderProfile.otherPassions.forEach((passion, i) => {
      addConnectedNode(`passion-${i}`, passion, 'passion', 'founder_profile', 6);
    });
  }

  // 6. Business Keywords (associatedKeywords)
  if (businessTest?.associatedKeywords?.length) {
    businessTest.associatedKeywords.forEach((keyword, i) => {
      addConnectedNode(`biz-kw-${i}`, keyword, 'business_keyword', 'business_test', 7);
    });
  }

  // 7. Content Pillars
  if (strategy?.contentPillars?.length) {
    strategy.contentPillars.forEach((pillar, i) => {
      // Pillar puede ser string o objeto con name/title
      const pillarName = typeof pillar === 'string'
        ? pillar
        : (pillar?.name || pillar?.title || pillar?.pillar || '');

      if (pillarName) {
        addConnectedNode(`pillar-${i}`, pillarName, 'content_pillar', 'strategy', 9);
      }
    });
  }

  // 8. Niche Keywords
  if (strategy?.nicheKeywords?.length) {
    strategy.nicheKeywords.forEach((keyword, i) => {
      addConnectedNode(`niche-${i}`, keyword, 'niche_keyword', 'strategy', 7);
    });
  }

  // 9. Main Benefit
  if (businessTest?.mainBenefit) {
    // Truncar si es muy largo
    const benefit = businessTest.mainBenefit.length > 40
      ? businessTest.mainBenefit.slice(0, 40) + '...'
      : businessTest.mainBenefit;
    addConnectedNode('benefit-main', benefit, 'benefit', 'business_test', 8);
  }

  // 10. Differentiator
  if (businessTest?.differentiator) {
    const diff = businessTest.differentiator.length > 40
      ? businessTest.differentiator.slice(0, 40) + '...'
      : businessTest.differentiator;
    addConnectedNode('differentiator-main', diff, 'differentiator', 'business_test', 8);
  }

  // 11. Conversation Topics
  if (conversationTopics?.length) {
    conversationTopics.forEach((item, i) => {
      // Tamaño basado en menciones
      const dynamicSize = NODE_SIZES.conversation_topic + Math.min(item.count, 4);
      const importance = Math.min(item.count + 3, 7);

      nodes.push({
        id: `conv-topic-${i}`,
        label: item.topic,
        category: 'conversation_topic',
        source: 'conversations',
        importance,
        metadata: { mentionCount: item.count },
        shape: NODE_SHAPES.conversation_topic,
        color: NODE_COLORS.conversation_topic,
        size: dynamicSize
      });

      links.push({
        source: userId,
        target: `conv-topic-${i}`,
        strength: Math.min(item.count + 2, 6)
      });
    });
  }

  // 12. Brainstorming Ideas
  if (brainstormingIdeas?.length) {
    brainstormingIdeas.forEach((idea, i) => {
      const title = idea.title || idea.description?.slice(0, 30) || 'Idea';

      nodes.push({
        id: `brainstorm-${idea.id || i}`,
        label: title.length > 25 ? title.slice(0, 23) + '...' : title,
        category: 'brainstorming',
        source: 'brainstorming',
        importance: 6,
        metadata: {
          platform: idea.platform,
          status: idea.status,
          fullTitle: idea.title,
          description: idea.description
        },
        shape: NODE_SHAPES.brainstorming,
        color: NODE_COLORS.brainstorming,
        size: NODE_SIZES.brainstorming
      });

      links.push({
        source: userId,
        target: `brainstorm-${idea.id || i}`,
        strength: 5
      });
    });
  }

  return { nodes, links };
}

/**
 * Calcula el porcentaje de completitud del grafo
 * @param {Object} graph - { nodes, links }
 * @returns {number} - Porcentaje 0-100
 */
export function calculateCompleteness(graph) {
  if (!graph?.nodes?.length) return 0;

  const categories = new Set(graph.nodes.map(n => n.category));
  // Excluir 'user' del conteo
  categories.delete('user');

  const possibleCategories = 10; // Total de categorías posibles (sin user)
  return Math.round((categories.size / possibleCategories) * 100);
}

export default transformToGraph;
