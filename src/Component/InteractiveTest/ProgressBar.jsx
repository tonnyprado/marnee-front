import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export default function ProgressBar({
  total,
  current,
  completed,
  questions,
  onNavigate,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // For many questions, we might want to show a condensed view
  const showAllNumbers = total <= 15;

  return (
    <div className="relative">
      {/* Progress indicator text */}
      <div className="text-center mb-3">
        <span className="text-sm text-gray-500">
          Question {current + 1} of {total}
        </span>
      </div>

      {/* Progress circles */}
      <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = completed[index];
          const isCurrent = index === current;
          const isHovered = hoveredIndex === index;
          const question = questions[index];

          return (
            <div key={index} className="relative">
              <motion.button
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => onNavigate(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isCurrent
                    ? "bg-violet-100 border-3 border-violet-500 shadow-lg shadow-violet-200"
                    : isCompleted
                    ? "bg-violet-500 border-2 border-violet-500"
                    : "bg-white border-2 border-gray-200 hover:border-violet-300"
                }`}
                style={{
                  borderWidth: isCurrent ? "3px" : "2px",
                }}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                ) : (
                  <span
                    className={`text-xs md:text-sm font-semibold ${
                      isCurrent
                        ? "text-violet-600"
                        : isCompleted
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {showAllNumbers ? index + 1 : ""}
                  </span>
                )}

                {/* Pulse animation for current */}
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-violet-400"
                  />
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && question && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none"
                  >
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl max-w-[200px]">
                      <div className="font-semibold text-violet-300 mb-0.5">
                        Q{index + 1}
                      </div>
                      <div className="truncate">
                        {question.title || question.question?.slice(0, 40) + "..."}
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Progress bar (linear) */}
      <div className="mt-4 max-w-md mx-auto">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
