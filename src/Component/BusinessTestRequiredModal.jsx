import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BusinessTestRequiredModal - Full screen takeover that blocks the app until user completes business test
 *
 * Features:
 * - Circle expansion animation from center covering the entire screen
 * - Content fades in after the circle animation
 * - Smooth fade out transition when navigating to the test
 */
export default function BusinessTestRequiredModal({ isOpen }) {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleStartTest = () => {
    setIsExiting(true);
    // Wait for fade out animation before navigating
    setTimeout(() => {
      navigate('/business-test/questions');
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Expanding circle background */}
          <motion.div
            className="absolute bg-mn-purple"
            initial={{
              width: 0,
              height: 0,
              borderRadius: '50%',
            }}
            animate={{
              width: '300vmax',
              height: '300vmax',
              borderRadius: '50%',
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1], // Custom easing for smooth expansion
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Content container */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.6, // Start after circle animation
              ease: 'easeOut',
            }}
          >
            {/* Animated icon */}
            <motion.div
              className="mb-8"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-display font-semibold text-white mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Welcome to Marnee
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-white/80 mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Before we create your personalized marketing strategy, we need to learn about your business.
            </motion.p>

            {/* Info text */}
            <motion.p
              className="text-sm text-mn-lilac mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              This quick assessment helps Marnee understand your brand, goals, and audience.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              onClick={handleStartTest}
              className="group relative bg-white text-mn-purple font-semibold py-4 px-10 rounded-full shadow-lg shadow-mn-night/30 transition-all duration-300 flex items-center gap-3 hover:shadow-xl hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span>Start Business Test</span>
            </motion.button>

            {/* Time estimate */}
            <motion.p
              className="text-xs text-white/50 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              Takes approximately 5-10 minutes
            </motion.p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mn-lilac/10 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
