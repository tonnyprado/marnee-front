/**
 * ChatInput Component
 *
 * Handles user input with support for:
 * - Text input (multiline textarea)
 * - Voice recognition
 * - Send button
 * - Loading state
 */

import React from 'react';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatInput({
  input,
  onInputChange,
  onSend,
  isLoading,
  isVoiceMode,
  onVoiceToggle,
  placeholder = "Type your message...",
  disabled = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isLoading) {
        onSend();
      }
    }
  };

  const handleSendClick = () => {
    if (!disabled && !isLoading) {
      onSend();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-gradient-to-r from-white to-purple-50/30 border-t border-gray-200 shadow-lg px-4 py-4"
    >
      <div className="flex items-end gap-3 max-w-5xl mx-auto">
        {/* Text input */}
        <motion.div
          className="flex-1 relative"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isVoiceMode ? "Listening..." : placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 pr-28 bg-white border ${
              isVoiceMode ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200'
            } rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition-all min-h-[52px] max-h-32 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '52px',
            }}
          />

          {/* Voice and Send buttons inside textarea */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {/* Voice button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onVoiceToggle}
              disabled={disabled}
              className={`p-2 rounded-xl transition-all ${
                isVoiceMode
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                  : 'hover:bg-gray-100 text-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isVoiceMode ? "Stop recording" : "Start voice input"}
            >
              {isVoiceMode ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </motion.button>

            {/* Send button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSendClick}
              disabled={disabled || isLoading || !input.trim()}
              className={`p-2 rounded-xl transition-all ${
                isLoading || !input.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#40086d] to-[#2d0550] text-white hover:shadow-lg hover:shadow-purple-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Voice mode indicator */}
      {isVoiceMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs text-red-600">
            <motion.div
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            Listening... Speak now
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
