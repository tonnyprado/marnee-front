/**
 * ForceGraph Component
 * Wrapper de react-force-graph-2d con configuración personalizada
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GRAPH_CONFIG } from '../../../constants/graphConstants';

export default function ForceGraph({
  graph,
  onNodeClick,
  onNodeHover,
  width,
  height,
  showLabels = true,
  highlightedCategories = null
}) {
  const graphRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  // Filtrar nodos por categorías
  const filteredGraph = React.useMemo(() => {
    if (!highlightedCategories) return graph;

    const visibleNodes = graph.nodes.filter(
      node => node.category === 'user' || highlightedCategories.includes(node.category)
    );
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    const visibleLinks = graph.links.filter(
      link => visibleNodeIds.has(link.source?.id || link.source) &&
              visibleNodeIds.has(link.target?.id || link.target)
    );

    return { nodes: visibleNodes, links: visibleLinks };
  }, [graph, highlightedCategories]);

  // Centrar grafo al cargar
  useEffect(() => {
    if (graphRef.current && filteredGraph.nodes.length > 0) {
      setTimeout(() => {
        graphRef.current.zoomToFit(400, 50);
      }, 500);
    }
  }, [filteredGraph.nodes.length]);

  const handleNodeHover = useCallback((node) => {
    setHoveredNode(node);
    onNodeHover?.(node);
    document.body.style.cursor = node ? 'pointer' : 'default';
  }, [onNodeHover]);

  const handleNodeClick = useCallback((node) => {
    if (node && graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500);
      graphRef.current.zoom(2, 500);
    }
    onNodeClick?.(node);
  }, [onNodeClick]);

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const isHovered = hoveredNode?.id === node.id;
    const isUser = node.category === 'user';
    const size = isHovered ? node.size * 1.3 : node.size;

    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;

    if (isUser) {
      ctx.shadowColor = 'rgba(64, 8, 109, 0.4)';
      ctx.shadowBlur = 15;
    } else if (isHovered) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
    }

    ctx.fill();
    ctx.shadowBlur = 0;

    if (isUser) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (showLabels && globalScale > 0.5) {
      const label = node.label;
      const fontSize = isUser ? 14 / globalScale : 11 / globalScale;
      ctx.font = `${isUser ? 'bold' : 'normal'} ${fontSize}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#1e1e1e';
      ctx.fillText(label.slice(0, 25), node.x, node.y + size + 4);
    }
  }, [hoveredNode, showLabels]);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={filteredGraph}
      width={width}
      height={height}
      backgroundColor={GRAPH_CONFIG.backgroundColor}
      nodeCanvasObject={nodeCanvasObject}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }}
      linkColor={() => GRAPH_CONFIG.linkColor}
      linkWidth={link => (link.strength || 5) * 0.15}
      d3VelocityDecay={GRAPH_CONFIG.d3VelocityDecay}
      cooldownTicks={GRAPH_CONFIG.cooldownTicks}
      onNodeHover={handleNodeHover}
      onNodeClick={handleNodeClick}
      enableZoomInteraction={true}
      enablePanInteraction={true}
      minZoom={0.3}
      maxZoom={5}
    />
  );
}
