import React from "react";

export default function BrandPurposeCard({ purposeStatement, marketPosition = [], onRegenerate }) {
  const defaultPurpose = '"To empower creative professionals with innovative tools that transform ideas into impactful digital experiences, fostering authentic connections in an increasingly digital world."';
  const defaultPositions = ["Premium Creative Tools", "Innovation Leader", "Community-Focused"];

  const displayPurpose = purposeStatement || defaultPurpose;
  const displayPositions = marketPosition.length > 0 ? marketPosition : defaultPositions;

  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#ede0f8] flex items-center justify-center text-xs font-semibold text-[#40086d]">
            BP
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            Brand Purpose &amp; Position
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#ede0f8] text-[#40086d]">
            AI GENERATED
          </span>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate('purpose')}
              className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#ede0f8] text-[#40086d] hover:bg-[#ede0f8] transition"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-600">Purpose Statement</p>
        <p className="text-sm text-gray-600 mt-2 italic">
          {displayPurpose}
        </p>
        <p className="text-xs font-semibold text-gray-600 mt-4">Market Position</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {displayPositions.map((item, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
