import React from "react";
import PillarCard from "./PillarCard";

export default function ContentPillarsCard({ pillars = [], onRegenerate }) {
  const defaultPillars = [
    {
      title: "Innovation Showcase",
      description: "Latest features, creative techniques, and cutting-edge design trends",
      percent: 30
    },
    {
      title: "Community Stories",
      description: "User success stories, behind-the-scenes content, and creator spotlights",
      percent: 25
    },
    {
      title: "Educational Content",
      description: "Tutorials, tips, best practices, and creative inspiration",
      percent: 25
    },
    {
      title: "Industry Insights",
      description: "Market trends, industry analysis, and thought leadership",
      percent: 20
    }
  ];

  const displayPillars = pillars.length > 0 ? pillars : defaultPillars;

  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#ede0f8] flex items-center justify-center text-xs font-semibold text-[#40086d]">
            CP
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Content Pillars</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#ede0f8] text-[#40086d]">
            AI GENERATED
          </span>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate('pillars')}
              className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#ede0f8] text-[#40086d] hover:bg-[#ede0f8] transition"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {displayPillars.map((pillar, index) => (
          <PillarCard
            key={index}
            title={pillar.title}
            description={pillar.description}
            percent={pillar.percent}
          />
        ))}
      </div>
    </div>
  );
}
