import React from "react";

export default function BrandStoryCard({ story = {}, onRegenerate }) {
  const defaultStory = {
    beginning: {
      title: "The Beginning",
      content: "Born from the frustration of creative professionals struggling with disconnected tools and complex workflows. We saw a world where creativity was being stifled by technology instead of empowered by it."
    },
    mission: {
      title: "The Mission",
      content: "We set out to bridge the gap between creative vision and digital execution, building tools that feel intuitive and inspire rather than intimidate. Every feature is designed with the creator's journey in mind."
    },
    future: {
      title: "The Future",
      content: "Today, we are not just a platform, we are a creative partner. We are building a community where ideas flourish, connections are authentic, and every creator has the tools to bring their vision to life."
    }
  };

  const displayStory = Object.keys(story).length > 0 ? story : defaultStory;

  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#ede0f8] flex items-center justify-center text-xs font-semibold text-[#40086d]">
            BS
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Brand Story</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#ede0f8] text-[#40086d]">
            AI GENERATED
          </span>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate('story')}
              className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#ede0f8] text-[#40086d] hover:bg-[#ede0f8] transition"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[20px_1fr] gap-4">
        <div className="flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-violet-400" />
          <div className="flex-1 w-px bg-violet-200" />
          <div className="h-3 w-3 rounded-full bg-violet-400" />
          <div className="flex-1 w-px bg-violet-200" />
          <div className="h-3 w-3 rounded-full bg-violet-400" />
        </div>
        <div className="space-y-6 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-800 mb-1">
              {displayStory.beginning?.title || "The Beginning"}
            </p>
            <p>{displayStory.beginning?.content}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">
              {displayStory.mission?.title || "The Mission"}
            </p>
            <p>{displayStory.mission?.content}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">
              {displayStory.future?.title || "The Future"}
            </p>
            <p>{displayStory.future?.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
