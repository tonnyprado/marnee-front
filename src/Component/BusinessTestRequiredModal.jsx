import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BusinessTestRequiredModal - Modal that blocks the app until user completes business test
 *
 * This modal appears when a user hasn't completed the mandatory business test.
 * It prevents access to the app and guides users to complete the test first.
 */
export default function BusinessTestRequiredModal({ isOpen }) {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/business-test/questions');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-50"
            style={{ backdropFilter: 'blur(8px)' }}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="w-20 h-20 bg-gradient-to-br from-[#40086d] to-[#6b21a8] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-[#40086d] via-[#6b21a8] to-[#9333ea] bg-clip-text text-transparent">
                Welcome to Marnee!
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Before we begin creating your personalized marketing strategy, we need to learn about your business.
              </p>

              {/* Info box */}
              <div className="bg-gradient-to-r from-[#ede0f8] to-purple-50 border border-[#dccaf4] rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#40086d] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-[#40086d] mb-1">Business Test Required</p>
                    <p>
                      The Business Test helps Marnee understand your brand, goals, and target audience.
                      This enables her to create a tailored content strategy just for you.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartTest}
                className="w-full bg-gradient-to-r from-[#40086d] to-[#6b21a8] hover:from-[#2d0550] hover:to-[#40086d] text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Business Test
              </motion.button>

              {/* Footer note */}
              <p className="text-xs text-gray-400 text-center mt-4">
                Takes approximately 5-10 minutes to complete
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
