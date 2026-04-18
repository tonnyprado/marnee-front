import React from "react";

export default function PillarCard({ title, description, percent }) {
  return (
    <div className="border border-[rgba(30,30,30,0.1)] rounded p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="h-8 w-8 rounded-lg bg-[#ede0f8] flex items-center justify-center text-xs font-semibold text-[#40086d]">
          CP
        </div>
        <span className="text-xs font-semibold text-gray-500">{percent}%</span>
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
