/**
 * GraphLegend Component
 * Leyenda de colores del grafo
 */

import React from 'react';
import { NODE_COLORS, CATEGORY_LABELS, LEGEND_CATEGORIES } from '../../../constants/graphConstants';

export default function GraphLegend({
  activeCategories,
  onCategoryToggle,
  compact = false
}) {
  return (
    <div className={`bg-white rounded-xl border border-[#dccaf4] ${compact ? 'p-3' : 'p-4'}`}>
      <h4 className="text-[12px] font-['DM_Sans'] font-semibold text-[#40086d] mb-3 uppercase tracking-wide">
        Categorías
      </h4>
      <div className={`flex flex-wrap gap-2 ${compact ? 'gap-1.5' : 'gap-2'}`}>
        {LEGEND_CATEGORIES.map(category => {
          const isActive = !activeCategories || activeCategories.includes(category);
          const color = NODE_COLORS[category];
          const label = CATEGORY_LABELS[category];

          return (
            <button
              key={category}
              onClick={() => onCategoryToggle?.(category)}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-['DM_Sans']
                border transition-all duration-150
                ${isActive
                  ? 'bg-white border-[#dccaf4] text-[#1e1e1e]'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
                }
                hover:border-[#40086d] hover:shadow-sm
              `}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: isActive ? color : '#d1d5db' }}
              />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
