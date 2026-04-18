import React from "react";

export default function BrandVoiceCard({ tone, style, personality, onRegenerate }) {
  const defaultTone = "Confident yet approachable";
  const defaultStyle = "Clear, inspiring, solution-focused";
  const defaultPersonality = "Innovative mentor and creative catalyst";

  const displayTone = tone || defaultTone;
  const displayStyle = style || defaultStyle;
  const displayPersonality = personality || defaultPersonality;

  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#ede0f8] flex items-center justify-center text-xs font-semibold text-[#40086d]">
            BV
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            Personality &amp; Brand Voice
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#ede0f8] text-[#40086d]">
            AI GENERATED
          </span>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate('voice')}
              className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#ede0f8] text-[#40086d] hover:bg-[#ede0f8] transition"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[140px_1fr] gap-4 items-center">
        <svg viewBox="0 0 120 120" className="w-32 h-32">
          <polygon
            points="60,10 100,35 100,85 60,110 20,85 20,35"
            fill="#f5f3ff"
            stroke="#c4b5fd"
            strokeWidth="1"
          />
          <polygon
            points="60,25 88,42 88,78 60,95 32,78 32,42"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2"
          />
          <line x1="60" y1="10" x2="60" y2="110" stroke="#e5e7eb" />
          <line x1="20" y1="35" x2="100" y2="85" stroke="#e5e7eb" />
          <line x1="20" y1="85" x2="100" y2="35" stroke="#e5e7eb" />
        </svg>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex gap-2">
            <span className="text-[#40086d] font-semibold">Tone:</span>
            <span>{displayTone}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#40086d] font-semibold">Style:</span>
            <span>{displayStyle}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#40086d] font-semibold">Personality:</span>
            <span>{displayPersonality}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
