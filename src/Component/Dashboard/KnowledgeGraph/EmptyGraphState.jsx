/**
 * EmptyGraphState Component
 * Estado vacío cuando no hay datos para el grafo
 */

import React from 'react';
import { Brain, MessageSquare, Sparkles } from 'lucide-react';

export default function EmptyGraphState({ onStartChat }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#ede0f8] flex items-center justify-center">
          <Brain className="w-12 h-12 text-[#40086d]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#40086d] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <h3 className="text-[20px] font-['Noto_Serif'] font-bold text-[#40086d] mb-2">
        Tu Marnee Brain está vacío
      </h3>

      <p className="text-[13.5px] font-['DM_Sans'] text-[rgba(30,30,30,0.6)] max-w-md mb-6 leading-relaxed">
        Conforme interactúes con Marnee, este grafo se irá llenando con todo lo que ella aprende sobre ti:
        tus expertise, valores, pasiones, pilares de contenido y más.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onStartChat}
          className="
            flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
            bg-[#40086d] text-white font-['DM_Sans'] text-[13px] font-medium
            hover:bg-[#2d0550] transition-colors duration-150
          "
        >
          <MessageSquare size={16} />
          Conversar con Marnee
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { label: 'Expertise', icon: '🎯' },
          { label: 'Valores', icon: '💎' },
          { label: 'Pilares', icon: '📊' },
          { label: 'Pasiones', icon: '🔥' }
        ].map(item => (
          <div key={item.label} className="p-3 rounded-lg bg-white border border-[#dccaf4]">
            <span className="text-xl mb-1 block">{item.icon}</span>
            <span className="text-[11px] font-['DM_Sans'] text-[rgba(30,30,30,0.5)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
