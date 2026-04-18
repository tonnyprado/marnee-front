import React from "react";

const STEPS = [
  { step: 1, name: "Involvement Level" },
  { step: 2, name: "Core Niche" },
  { step: 3, name: "Posting Cadence" },
  { step: 4, name: "Content Pillars" },
  { step: 5, name: "Calendar" },
  { step: 6, name: "Script Generation" },
];

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-[#f6f6f6] border-b border-[rgba(30,30,30,0.1)]">
      {STEPS.map((s, idx) => {
        const isCompleted = currentStep > s.step;
        const isActive    = currentStep === s.step;
        const isLast      = idx === STEPS.length - 1;

        return (
          <React.Fragment key={s.step}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-all ${
                  isCompleted
                    ? "bg-[#40086d] text-[#dccaf4]"
                    : isActive
                    ? "bg-[#40086d] text-white ring-2 ring-[#dccaf4] ring-offset-2 ring-offset-[#f6f6f6]"
                    : "bg-[rgba(30,30,30,0.06)] text-gray-400"
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
                  isActive    ? "text-[#40086d]"  :
                  isCompleted ? "text-[#40086d]"  :
                                "text-gray-400"
                }`}
              >
                {s.name}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`flex-1 h-px max-w-[60px] ${
                  isCompleted ? "bg-[#40086d]" : "bg-[rgba(30,30,30,0.1)]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
