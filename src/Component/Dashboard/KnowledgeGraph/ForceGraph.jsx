/**
 * ForceGraph Component
 * Grafo de fuerza con nodos de diferentes formas
 */

import React, { useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GRAPH_CONFIG, NODE_SHAPES } from '../../../constants/graphConstants';

// Funciones para dibujar diferentes formas
const drawShapes = {
  // Estrella (nodo central)
  star: (ctx, x, y, size, color, isHovered) => {
    const spikes = 8;
    const outerRadius = size;
    const innerRadius = size * 0.5;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / spikes - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Círculo interior
    ctx.beginPath();
    ctx.arc(x, y, size * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  },

  // Hexágono
  hexagon: (ctx, x, y, size, color, isHovered, label) => {
    const sides = 6;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fafafa';
    ctx.fill();
  },

  // Cuadrado
  square: (ctx, x, y, size, color, isHovered) => {
    const s = size * 1.4;
    ctx.beginPath();
    ctx.rect(x - s/2, y - s/2, s, s);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fafafa';
    ctx.fill();
  },

  // Círculo
  circle: (ctx, x, y, size, color, isHovered) => {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  },

  // Triángulo
  triangle: (ctx, x, y, size, color, isHovered) => {
    const s = size * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.866, y + s * 0.5);
    ctx.lineTo(x - s * 0.866, y + s * 0.5);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fafafa';
    ctx.fill();
  },

  // Rombo/Diamante
  diamond: (ctx, x, y, size, color, isHovered) => {
    const s = size * 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s, y);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fafafa';
    ctx.fill();
  }
};

const ForceGraph = forwardRef(function ForceGraph({
  graph,
  onNodeClick,
  onNodeHover,
  width,
  height,
  showLabels = true,
  highlightedCategories = null
}, ref) {
  const graphRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  // Exponer métodos del grafo al padre
  useImperativeHandle(ref, () => ({
    zoom: (level, duration) => {
      if (level === undefined) {
        return graphRef.current?.zoom();
      }
      return graphRef.current?.zoom(level, duration);
    },
    zoomToFit: (duration, padding) => graphRef.current?.zoomToFit(duration, padding),
    centerAt: (x, y, duration) => graphRef.current?.centerAt(x, y, duration)
  }));

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
        graphRef.current.zoomToFit(300, 80);
      }, 300);
    }
  }, [filteredGraph.nodes.length]);

  // Configurar fuerzas del grafo
  useEffect(() => {
    if (graphRef.current) {
      const fg = graphRef.current;
      fg.d3Force('charge')?.strength(GRAPH_CONFIG.chargeStrength);
      fg.d3Force('link')?.distance(GRAPH_CONFIG.linkDistance);
      fg.d3Force('center')?.strength(GRAPH_CONFIG.centerStrength);
    }
  }, []);

  const handleNodeHover = useCallback((node) => {
    setHoveredNode(node);
    onNodeHover?.(node);
    document.body.style.cursor = node ? 'pointer' : 'default';
  }, [onNodeHover]);

  const handleNodeClick = useCallback((node) => {
    if (node && graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 400);
      graphRef.current.zoom(2.5, 400);
    }
    onNodeClick?.(node);
  }, [onNodeClick]);

  // Dibujar nodos con diferentes formas
  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const isHovered = hoveredNode?.id === node.id;
    const isUser = node.category === 'user';
    const shape = NODE_SHAPES[node.category] || 'circle';
    const size = isHovered ? node.size * 1.15 : node.size;
    const color = node.color;

    // Sombra para hover
    if (isHovered) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
    }

    // Dibujar la forma
    const drawFn = drawShapes[shape] || drawShapes.circle;
    drawFn(ctx, node.x, node.y, size, color, isHovered, node.label);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Número dentro del hexágono para expertise
    if ((node.category === 'expertise' || node.category === 'audience_interest') && node.index !== undefined) {
      const idx = node.index || '';
      ctx.font = `500 ${10 / globalScale}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1e1e1e';
      ctx.fillText(idx, node.x, node.y);
    }

    // Label debajo del nodo
    if (showLabels && globalScale > 0.4) {
      const label = node.label || '';
      const displayLabel = label.length > 20 ? label.slice(0, 18) + '...' : label;
      const fontSize = isUser ? 11 / globalScale : 10 / globalScale;

      ctx.font = `${isUser ? '600' : '400'} ${fontSize}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#1e1e1e';

      // Fondo semi-transparente para legibilidad
      const textWidth = ctx.measureText(displayLabel).width;
      const padding = 4 / globalScale;
      ctx.fillStyle = 'rgba(250, 250, 250, 0.85)';
      ctx.fillRect(
        node.x - textWidth / 2 - padding,
        node.y + size + 4 / globalScale,
        textWidth + padding * 2,
        fontSize + padding
      );

      ctx.fillStyle = '#1e1e1e';
      ctx.fillText(displayLabel, node.x, node.y + size + 6 / globalScale);

      // Subtítulo para nodo central
      if (isUser && node.subtitle) {
        ctx.font = `300 ${8 / globalScale}px "DM Sans", sans-serif`;
        ctx.fillStyle = '#666';
        ctx.fillText(node.subtitle, node.x, node.y + size + 18 / globalScale);
      }
    }
  }, [hoveredNode, showLabels]);

  // Dibujar links con estilo elegante
  const linkCanvasObject = useCallback((link, ctx, globalScale) => {
    const start = link.source;
    const end = link.target;

    if (!start.x || !end.x) return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = GRAPH_CONFIG.linkColorLight;
    ctx.lineWidth = 1 / globalScale;
    ctx.stroke();
  }, []);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={filteredGraph}
      width={width}
      height={height}
      backgroundColor={GRAPH_CONFIG.backgroundColor}
      nodeCanvasObject={nodeCanvasObject}
      linkCanvasObject={linkCanvasObject}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 8, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }}
      d3VelocityDecay={GRAPH_CONFIG.d3VelocityDecay}
      d3AlphaDecay={GRAPH_CONFIG.d3AlphaDecay}
      cooldownTicks={GRAPH_CONFIG.cooldownTicks}
      warmupTicks={GRAPH_CONFIG.warmupTicks}
      onNodeHover={handleNodeHover}
      onNodeClick={handleNodeClick}
      enableZoomInteraction={true}
      enablePanInteraction={true}
      minZoom={0.3}
      maxZoom={5}
    />
  );
});

export default ForceGraph;
