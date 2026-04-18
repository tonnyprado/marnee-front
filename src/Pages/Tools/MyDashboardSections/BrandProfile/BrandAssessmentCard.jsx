import React from "react";
import ProgressBar from "./ProgressBar";

export default function BrandAssessmentCard({ score = 87, metrics = [], message }) {
  const defaultMessage = "Your brand shows strong potential with clear positioning and authentic voice. AI recommendations generated based on your responses.";
  const defaultMetrics = [
    { label: "Purpose Clarity", value: 92 },
    { label: "Voice Consistency", value: 85 },
    { label: "Visual Identity", value: 78 },
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;
  const displayMessage = message || defaultMessage;

  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-6 shadow-sm">
      <div className="flex items-start gap-6">
        <div className="h-24 w-24 rounded-full bg-[conic-gradient(#7c3aed_0deg,_#4f46e5_120deg,_#06b6d4_210deg,_#e5e7eb_0deg)] p-2">
          <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{score}</p>
              <p className="text-xs text-gray-500">Brand Score</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Brand Assessment Complete
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {displayMessage}
          </p>
          <div className="mt-4 space-y-3">
            {displayMetrics.map((metric, index) => (
              <ProgressBar
                key={index}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
