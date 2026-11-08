/**
 * KnowledgeGraphSection Component
 * Sección principal del grafo de conocimiento "Marnee Brain"
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, RefreshCw, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { useKnowledgeGraph } from '../../../hooks/useKnowledgeGraph';
import { ForceGraph, GraphSidebar, EmptyGraphState, NodeTooltip } from '../../../Component/Dashboard/KnowledgeGraph';

export default function KnowledgeGraphSection() {
  const navigate = useNavigate();
  const graphRef = useRef();
  const containerRef = useRef();
  const sectionRef = useRef();

  const { graph, loading, error, hasData, refresh } = useKnowledgeGraph();

  const [activeCategories, setActiveCategories] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Actualizar dimensiones del contenedor
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: isFullscreen ? window.innerHeight - 80 : 500
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  // Toggle de categoría
  const handleCategoryToggle = useCallback((category) => {
    setActiveCategories(prev => {
      if (prev === null) {
        return [category];
      }
      if (prev.includes(category)) {
        const newCats = prev.filter(c => c !== category);
        return newCats.length === 0 ? null : newCats;
      }
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
      graphRef.current.zoom(currentZoom * 1.4, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.4, 300);
    }
  };

  const handleResetView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 80);
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      sectionRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Escuchar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Actualizar dimensiones cuando cambia fullscreen
  useEffect(() => {
    if (containerRef.current) {
      const timeout = setTimeout(() => {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: isFullscreen ? window.innerHeight - 80 : 500
        });
        // Re-center graph after resize
        if (graphRef.current) {
          graphRef.current.zoomToFit(400, 80);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isFullscreen]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <div className="w-16 h-16 rounded-full bg-[#fafafa] flex items-center justify-center mb-4 animate-pulse border border-[#e5e5e5]">
          <Brain className="w-8 h-8 text-[#1e1e1e]" />
        </div>
        <p className="text-[13px] font-['DM_Sans'] text-[#666]">
          Cargando tu Marnee Brain...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-200">
          <Brain className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-[16px] font-['DM_Sans'] font-semibold text-red-600 mb-2">
          Error al cargar
        </h3>
        <p className="text-[13px] text-[#666] mb-4">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e1e1e] text-white text-[13px] hover:bg-[#333] transition-colors"
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

  const controlButtonClass = `
    p-2 rounded-lg bg-white border border-[#e5e5e5] text-[#1e1e1e]
    hover:bg-[#fafafa] hover:border-[#ccc] transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-[#1e1e1e] focus:ring-opacity-20
  `;

  return (
    <div
      ref={sectionRef}
      className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${isFullscreen ? 'p-4 border-b border-[#e5e5e5]' : 'mb-4'}`}>
        <div>
          <h2 className="text-[18px] font-semibold text-[#1e1e1e] font-['DM_Sans']">
            Marnee Brain
          </h2>
          <p className="text-[12px] text-[#666] font-['DM_Sans']">
            {graph.nodes.length - 1} conceptos conectados
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-[#e5e5e5] p-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded hover:bg-[#fafafa] text-[#1e1e1e] transition-colors"
              title="Alejar"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-[#fafafa] text-[#1e1e1e] transition-colors"
              title="Acercar"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded hover:bg-[#fafafa] text-[#1e1e1e] transition-colors"
              title="Centrar vista"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className={controlButtonClass}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Refresh */}
          <button
            onClick={refresh}
            className={controlButtonClass}
            title="Actualizar datos"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex ${isFullscreen ? '' : 'gap-0'} overflow-hidden`}>
        {/* Graph Container */}
        <div
          ref={containerRef}
          className={`flex-1 bg-[#fafafa] ${isFullscreen ? '' : 'rounded-xl border border-[#e5e5e5]'} overflow-hidden relative`}
          style={{ minHeight: isFullscreen ? 'calc(100vh - 80px)' : '500px' }}
        >
          <ForceGraph
            ref={graphRef}
            graph={graph}
            width={dimensions.width}
            height={dimensions.height}
            showLabels={true}
            highlightedCategories={activeCategories}
            onNodeHover={(node) => handleNodeHover(node, window.event)}
            onNodeClick={handleNodeClick}
          />

          {/* Tooltip */}
          {hoveredNode && (
            <NodeTooltip node={hoveredNode} position={tooltipPos} />
          )}

          {/* Reset filters button */}
          {activeCategories && (
            <button
              onClick={handleResetFilters}
              className="absolute bottom-4 left-4 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full text-[11px] text-[#666] hover:text-[#1e1e1e] hover:border-[#ccc] transition-colors shadow-sm"
            >
              Mostrar todas las categorías
            </button>
          )}
        </div>

        {/* Sidebar */}
        <GraphSidebar
          graph={graph}
          activeCategories={activeCategories}
          onCategoryToggle={handleCategoryToggle}
        />
      </div>
    </div>
  );
}
