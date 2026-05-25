import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Notification component for when Marnee saves a script from chat
 * Shows a toast-style notification that auto-dismisses
 */
export default function ScriptSavedNotification({ show, scriptTitle, onClose, onViewScripts }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.9 }}
          animate={{ opacity: 1, y: 20, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full px-4"
        >
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-2xl p-5 flex items-start gap-4">
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 bg-white/20 rounded-xl p-3"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-lg leading-tight">
                    Script Saved!
                  </p>
                  <p className="text-sm text-violet-100 mt-1 truncate">
                    {scriptTitle ? `"${scriptTitle}"` : "Your script has been saved"}
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Action Button */}
              {onViewScripts && (
                <motion.button
                  onClick={onViewScripts}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full bg-white text-violet-600 font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-violet-50 transition-colors shadow-md"
                >
                  View Scripts
                </motion.button>
              )}
            </div>
          </div>

          {/* Pulse effect at the edges */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(139, 92, 246, 0.7)",
                "0 0 0 20px rgba(139, 92, 246, 0)",
                "0 0 0 0 rgba(139, 92, 246, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: 1 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
