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
 * - Reverse circle contraction when navigating to the test (reveals page underneath)
 */
export default function BusinessTestRequiredModal({ isOpen }) {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleStartTest = () => {
    setIsExiting(true);
    // Wait for circle contraction animation before navigating
    setTimeout(() => {
      navigate('/business-test/questions');
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Expanding/Contracting circle background */}
          <motion.div
            className="absolute bg-mn-purple"
            initial={{
              width: 0,
              height: 0,
            }}
            animate={{
              width: isExiting ? 0 : '300vmax',
              height: isExiting ? 0 : '300vmax',
            }}
            transition={{
              duration: 0.8,
              ease: isExiting
                ? [0.36, 0, 0.66, -0.56] // Ease in for contraction (accelerating into center)
                : [0.22, 1, 0.36, 1],     // Ease out for expansion
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
            }}
          />

          {/* Content container - fades out quickly when exiting */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isExiting ? 0 : 1,
              y: isExiting ? -20 : 0,
              scale: isExiting ? 0.9 : 1,
            }}
            transition={{
              duration: isExiting ? 0.3 : 0.6,
              delay: isExiting ? 0 : 0.6,
              ease: 'easeOut',
            }}
          >
            {/* Animated icon */}
            <motion.div
              className="mb-8"
              animate={isExiting ? {} : {
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
              animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -10 : 0 }}
              transition={{ delay: isExiting ? 0 : 0.8, duration: isExiting ? 0.2 : 0.5 }}
            >
              Welcome to Marnee
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-white/80 mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -10 : 0 }}
              transition={{ delay: isExiting ? 0.05 : 0.9, duration: isExiting ? 0.2 : 0.5 }}
            >
              Before we create your personalized marketing strategy, we need to learn about your business.
            </motion.p>

            {/* Info text */}
            <motion.p
              className="text-sm text-mn-lilac mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExiting ? 0 : 1 }}
              transition={{ delay: isExiting ? 0.1 : 1, duration: isExiting ? 0.2 : 0.5 }}
            >
              This quick assessment helps Marnee understand your brand, goals, and audience.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              onClick={handleStartTest}
              disabled={isExiting}
              className="group relative bg-white text-mn-purple font-semibold py-4 px-10 rounded-full shadow-lg shadow-mn-night/30 transition-all duration-300 flex items-center gap-3 hover:shadow-xl hover:scale-105 disabled:pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -20 : 0 }}
              transition={{ delay: isExiting ? 0.15 : 1.1, duration: isExiting ? 0.2 : 0.5 }}
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
              animate={{ opacity: isExiting ? 0 : 1 }}
              transition={{ delay: isExiting ? 0.2 : 1.3, duration: isExiting ? 0.2 : 0.5 }}
            >
              Takes approximately 5-10 minutes
            </motion.p>
          </motion.div>

          {/* Decorative elements - fade out when exiting */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ delay: isExiting ? 0 : 0.8, duration: isExiting ? 0.3 : 1 }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mn-lilac/10 rounded-full blur-3xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ delay: isExiting ? 0 : 1, duration: isExiting ? 0.3 : 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
