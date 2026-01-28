import React from "react";

const STEPS = [
  { step: 1, name: "Involvement Level" },
  { step: 2, name: "Core Niche" },
  { step: 3, name: "Posting Cadence" },
  { step: 4, name: "Content Pillars" },
  { step: 5, name: "Calendar" },
];

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 border-b border-white/10">
      {STEPS.map((s, idx) => {
        const isCompleted = currentStep > s.step;
        const isActive = currentStep === s.step;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={s.step}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-black"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.step
                )}
              </div>
              <span
                className={`text-xs mt-1 whitespace-nowrap ${
                  isActive ? "text-blue-400" : isCompleted ? "text-green-400" : "text-gray-500"
                }`}
              >
                {s.name}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`flex-1 h-0.5 max-w-[60px] ${
                  isCompleted ? "bg-green-500" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
