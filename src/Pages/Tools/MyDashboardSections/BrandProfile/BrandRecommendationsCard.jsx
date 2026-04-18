import React from "react";

export default function BrandRecommendationsCard({ recommendations = {}, onRegenerate }) {
  const defaultRecommendations = {
    colorPalette: {
      primary: ["#9AA7FF", "#D6B4FF", "#FF4DB8"],
      secondary: ["#FFFFFF", "#E5E7EB", "#111827"]
    },
    typography: [
      { font: "SORA BOLD", usage: "Headlines & Titles" },
      { font: "INTER REGULAR", usage: "Body text and descriptions" },
      { font: "INTER SEMIBOLD", usage: "Buttons and CTAs" }
    ],
    visualStyle: [
      { aspect: "Border Radius", value: "8px - 12px (Modern, friendly)" },
      { aspect: "Shadows", value: "Subtle, soft shadows for depth" },
      { aspect: "Gradients", value: "Linear gradients with brand colors" },
      { aspect: "Icons", value: "Outlined style, consistent stroke width" }
    ],
    logoDesigns: ["A", "B", "C"]
  };

  const displayRecommendations = Object.keys(recommendations).length > 0
    ? recommendations
    : defaultRecommendations;

  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#ede0f8] flex items-center justify-center text-xs font-semibold text-[#40086d]">
            BR
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            Brand Guidelines Recommendations
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#ede0f8] text-[#40086d]">
            AI GENERATED
          </span>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate('guidelines')}
              className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#ede0f8] text-[#40086d] hover:bg-[#ede0f8] transition"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {/* Color Palette */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">Color Palette</p>
          <p className="text-xs text-gray-500 mb-2">Primary</p>
          <div className="flex gap-2 mb-3">
            {displayRecommendations.colorPalette?.primary?.map((color, index) => (
              <span
                key={index}
                className="h-7 w-7 rounded-md border border-[rgba(30,30,30,0.1)]"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-2">Secondary</p>
          <div className="flex gap-2">
            {displayRecommendations.colorPalette?.secondary?.map((color, index) => (
              <span
                key={index}
                className="h-7 w-7 rounded-md border border-[rgba(30,30,30,0.1)]"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Typography */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">Typography</p>
          <div className="space-y-2 text-sm text-gray-600">
            {displayRecommendations.typography?.map((typo, index) => (
              <div key={index}>
                <p className="text-xs text-[#40086d] font-semibold">{typo.font}</p>
                <p>{typo.usage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Style */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">Visual Style</p>
          <div className="space-y-2 text-sm text-gray-600">
            {displayRecommendations.visualStyle?.map((style, index) => (
              <p key={index}>
                <span className="text-[#40086d] font-semibold">{style.aspect}:</span>{" "}
                {style.value}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Logo Design Suggestions */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          Logo Design Suggestions
        </p>
        <div className="flex gap-3">
          {displayRecommendations.logoDesigns?.map((key, index) => (
            <div
              key={key}
              className={`h-14 w-14 rounded flex items-center justify-center border ${
                index === 2
                  ? "bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 text-white border-transparent"
                  : "bg-white border-[rgba(30,30,30,0.1)] text-gray-700"
              }`}
            >
              DN
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
