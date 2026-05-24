/**
 * NodeTooltip Component
 * Tooltip que aparece al hacer hover sobre un nodo
 */

import React from 'react';
import { CATEGORY_LABELS } from '../../../constants/graphConstants';

export default function NodeTooltip({ node, position }) {
  if (!node || node.category === 'user') return null;

  const categoryLabel = CATEGORY_LABELS[node.category] || node.category;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 15,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-[#dccaf4] p-3 min-w-[150px] max-w-[250px]">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: node.color }}
          />
          <span className="text-[11px] font-['DM_Sans'] text-[rgba(30,30,30,0.6)] uppercase">
            {categoryLabel}
          </span>
        </div>
        <p className="text-[13px] font-['DM_Sans'] font-medium text-[#1e1e1e]">
          {node.label}
        </p>
        {node.metadata?.mentionCount && (
          <p className="text-[11px] text-[rgba(30,30,30,0.5)] mt-1">
            Mencionado {node.metadata.mentionCount} veces
          </p>
        )}
      </div>
    </div>
  );
}
