/**
 * KnowledgeGraphSection Component
 * Sección principal del grafo de conocimiento "Marnee Brain"
 */

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, RefreshCw } from 'lucide-react';
import { useKnowledgeGraph } from '../../../hooks/useKnowledgeGraph';
import { ForceGraph, GraphLegend, EmptyGraphState, NodeTooltip } from '../../../Component/Dashboard/KnowledgeGraph';
import { PageHeader } from '../../../Component/Dashboard';

export default function KnowledgeGraphSection() {
  const navigate = useNavigate();
  const graphRef = useRef();
  const containerRef = useRef();

  const { graph, loading, error, hasData, dataCompleteness, refresh } = useKnowledgeGraph();

  const [activeCategories, setActiveCategories] = useState(null); // null = todas activas
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Toggle de categoría en filtro
  const handleCategoryToggle = useCallback((category) => {
    setActiveCategories(prev => {
      if (prev === null) {
        // Primera vez: solo mostrar esta categoría
        return [category];
      }
      if (prev.includes(category)) {
        // Quitar categoría
        const newCats = prev.filter(c => c !== category);
        return newCats.length === 0 ? null : newCats;
      }
      // Agregar categoría
      return [...prev, category];
    });
  }, []);

  // Reset filtros
  const handleResetFilters = useCallback(() => {
    setActiveCategories(null);
  }, []);

  // Hover en nodo
  const handleNodeHover = useCallback((node, event) => {
    setHoveredNode(node);
    if (node && event) {
      setTooltipPos({ x: event.clientX, y: event.clientY });
    }
  }, []);

  // Click en nodo
  const handleNodeClick = useCallback((node) => {
    console.log('[MarneeBrain] Node clicked:', node);
  }, []);

  // Ir a chat
  const handleStartChat = useCallback(() => {
    navigate('/app');
  }, [navigate]);

  // Zoom controls
  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.5, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.5, 300);
    }
  };

  const handleResetView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 50);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <div className="w-16 h-16 rounded-full bg-[#ede0f8] flex items-center justify-center mb-4 animate-pulse">
          <Brain className="w-8 h-8 text-[#40086d]" />
        </div>
        <p className="text-[13px] font-['DM_Sans'] text-[rgba(30,30,30,0.6)]">
          Cargando tu Marnee Brain...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-[16px] font-['DM_Sans'] font-semibold text-red-600 mb-2">
          Error al cargar
        </h3>
        <p className="text-[13px] text-[rgba(30,30,30,0.6)] mb-4">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#40086d] text-white text-[13px]"
        >
          <RefreshCw size={14} />
          Reintentar
        </button>
      </div>
    );
  }

  // Empty state
  if (!hasData) {
    return <EmptyGraphState onStartChat={handleStartChat} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Marnee Brain"
          subtitle={`${graph.nodes.length - 1} conceptos conectados • ${dataCompleteness}% completitud`}
        />

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-[#dccaf4] p-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded hover:bg-[#ede0f8] text-[#40086d] transition-colors"
              title="Alejar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-[#ede0f8] text-[#40086d] transition-colors"
              title="Acercar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded hover:bg-[#ede0f8] text-[#40086d] transition-colors"
              title="Centrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={refresh}
            className="p-2 rounded-lg bg-white border border-[#dccaf4] text-[#40086d] hover:bg-[#ede0f8] transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4">
        {/* Graph Container */}
        <div
          ref={containerRef}
          className="flex-1 bg-[#f6f6f6] rounded-xl border border-[#dccaf4] overflow-hidden relative"
          style={{ minHeight: '500px' }}
        >
          <ForceGraph
            ref={graphRef}
            graph={graph}
            width={containerRef.current?.clientWidth || 800}
            height={500}
            showLabels={true}
            highlightedCategories={activeCategories}
            onNodeHover={(node) => handleNodeHover(node, window.event)}
            onNodeClick={handleNodeClick}
          />

          {/* Tooltip */}
          {hoveredNode && (
            <NodeTooltip node={hoveredNode} position={tooltipPos} />
          )}
        </div>

        {/* Sidebar with Legend */}
        <div className="w-[280px] flex-shrink-0">
          <GraphLegend
            activeCategories={activeCategories}
            onCategoryToggle={handleCategoryToggle}
          />

          {activeCategories && (
            <button
              onClick={handleResetFilters}
              className="w-full mt-3 py-2 text-[12px] font-['DM_Sans'] text-[#40086d] hover:underline"
            >
              Mostrar todas las categorías
            </button>
          )}

          {/* Stats Card */}
          <div className="mt-4 p-4 bg-white rounded-xl border border-[#dccaf4]">
            <h4 className="text-[12px] font-['DM_Sans'] font-semibold text-[#40086d] mb-3 uppercase tracking-wide">
              Resumen
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[rgba(30,30,30,0.6)]">Nodos totales</span>
                <span className="text-[13px] font-medium text-[#1e1e1e]">{graph.nodes.length - 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[rgba(30,30,30,0.6)]">Conexiones</span>
                <span className="text-[13px] font-medium text-[#1e1e1e]">{graph.links.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[rgba(30,30,30,0.6)]">Completitud</span>
                <span className="text-[13px] font-medium text-[#40086d]">{dataCompleteness}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
