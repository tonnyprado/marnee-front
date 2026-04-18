import React from "react";

export default function ProgressBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
