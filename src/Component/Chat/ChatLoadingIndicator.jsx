/**
 * ChatLoadingIndicator
 *
 * Animated loading indicator for chat messages.
 * Shows when AI is generating a response.
 */
import React from 'react';
import { motion } from 'framer-motion';

export function ChatLoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, x: -50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className="flex justify-start mt-4 px-1"
    >
      <motion.div
        className="inline-block bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm"
        animate={{
          boxShadow: [
            "0 1px 3px rgba(0,0,0,0.1)",
            "0 2px 6px rgba(64,8,109,0.12)",
            "0 1px 3px rgba(0,0,0,0.1)"
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 0.2, 0.4].map((delay, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gradient-to-br from-[#40086d] to-[#2d0550] rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
                times: [0, 0.5, 1]
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ChatLoadingIndicator;
