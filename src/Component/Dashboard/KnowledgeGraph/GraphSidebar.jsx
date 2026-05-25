/**
 * GraphSidebar Component
 * Panel lateral con categorías expandibles mostrando items del grafo
 */

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NODE_COLORS, NODE_SHAPES, CATEGORY_LABELS, LEGEND_CATEGORIES } from '../../../constants/graphConstants';

// Iconos de formas por categoría
const ShapeIcon = ({ shape, color, size = 12 }) => {
  const style = { width: size, height: size, display: 'inline-block', flexShrink: 0 };

  switch (shape) {
    case 'star':
      return (
        <svg style={style} viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
        </svg>
      );
    case 'hexagon':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M12 2L22 8V16L12 22L2 16V8L12 2Z"/>
        </svg>
      );
    case 'square':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <rect x="4" y="4" width="16" height="16"/>
        </svg>
      );
    case 'triangle':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M12 3L22 21H2L12 3Z"/>
        </svg>
      );
    case 'diamond':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M12 2L22 12L12 22L2 12L12 2Z"/>
        </svg>
      );
    case 'circle':
    default:
      return (
        <svg style={style} viewBox="0 0 24 24" fill={color}>
          <circle cx="12" cy="12" r="6"/>
        </svg>
      );
  }
};

// Descripciones de cada categoría
const CATEGORY_DESCRIPTIONS = {
  expertise: 'Temas en los que tienes experiencia y confianza para enseñar.',
  audience_interest: 'Lo que tu audiencia te pregunta frecuentemente.',
  value: 'Tus valores fundamentales que guían tus decisiones.',
  passion: 'Actividades y temas que te apasionan.',
  business_keyword: 'Palabras clave asociadas a tu negocio.',
  content_pillar: 'Pilares principales de tu estrategia de contenido.',
  niche_keyword: 'Palabras clave específicas de tu nicho.',
  benefit: 'El beneficio principal que ofreces.',
  differentiator: 'Lo que te hace único en el mercado.',
  conversation_topic: 'Temas extraídos de tus conversaciones con Marnee.',
  brainstorming: 'Ideas de contenido guardadas en tu brainstorming.'
};

export default function GraphSidebar({ graph, activeCategories, onCategoryToggle }) {
  const [expandedCategories, setExpandedCategories] = useState(['expertise', 'content_pillar']);

  // Agrupar nodos por categoría
  const nodesByCategory = useMemo(() => {
    const grouped = {};
    graph.nodes.forEach(node => {
      if (node.category !== 'user') {
        if (!grouped[node.category]) {
          grouped[node.category] = [];
        }
        grouped[node.category].push(node);
      }
    });
    return grouped;
  }, [graph]);

  // Categorías que tienen nodos
  const categoriesWithNodes = useMemo(() => {
    return LEGEND_CATEGORIES.filter(cat => nodesByCategory[cat]?.length > 0);
  }, [nodesByCategory]);

  const toggleExpand = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isActive = (category) => {
    return !activeCategories || activeCategories.includes(category);
  };

  return (
    <div className="w-[300px] flex-shrink-0 bg-white border-l border-[#e5e5e5] overflow-y-auto">
      <div className="p-4 border-b border-[#e5e5e5]">
        <h3 className="text-[11px] font-semibold text-[#1e1e1e] uppercase tracking-wider">
          Index
        </h3>
      </div>

      <div className="divide-y divide-[#e5e5e5]">
        {categoriesWithNodes.map(category => {
          const nodes = nodesByCategory[category] || [];
          const isExpanded = expandedCategories.includes(category);
          const active = isActive(category);
          const shape = NODE_SHAPES[category];
          const color = active ? NODE_COLORS[category] : '#9ca3af';

          return (
            <div key={category} className={`${active ? '' : 'opacity-50'}`}>
              {/* Category Header */}
              <button
                onClick={() => toggleExpand(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShapeIcon shape={shape} color={color} size={14} />
                  <span className="text-[11px] font-semibold text-[#1e1e1e] uppercase tracking-wider">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="text-[10px] text-[#666] ml-1">
                    ({nodes.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={14} className="text-[#666]" />
                ) : (
                  <ChevronDown size={14} className="text-[#666]" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  {/* Description */}
                  <p className="text-[10px] text-[#666] mb-3 leading-relaxed border-l-2 border-[#e5e5e5] pl-3">
                    {CATEGORY_DESCRIPTIONS[category]}
                  </p>

                  {/* Toggle visibility */}
                  <button
                    onClick={() => onCategoryToggle?.(category)}
                    className={`text-[10px] mb-3 ${
                      active ? 'text-[#E85D04]' : 'text-[#666]'
                    } hover:underline`}
                  >
                    {active ? 'Ocultar en grafo' : 'Mostrar en grafo'}
                  </button>

                  {/* Items list */}
                  <div className="space-y-2">
                    {nodes.map((node, idx) => (
                      <div key={node.id} className="flex items-start gap-2">
                        {node.index && (
                          <span className="text-[10px] text-[#999] font-mono w-4 flex-shrink-0">
                            {node.index}.
                          </span>
                        )}
                        {!node.index && (
                          <span className="text-[10px] text-[#999] w-4 flex-shrink-0">
                            -
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-[#1e1e1e] font-medium leading-tight">
                            {node.label}
                          </p>
                          {node.metadata?.mentionCount && (
                            <p className="text-[10px] text-[#999] mt-0.5">
                              {node.metadata.mentionCount} menciones
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {categoriesWithNodes.length === 0 && (
        <div className="p-4 text-center">
          <p className="text-[12px] text-[#666]">
            No hay datos para mostrar
          </p>
        </div>
      )}
    </div>
  );
}
