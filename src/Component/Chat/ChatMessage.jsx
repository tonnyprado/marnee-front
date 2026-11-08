/**
 * ChatMessage
 *
 * Individual chat message component with animations.
 * Supports user and AI messages with different styling.
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Star } from 'lucide-react';
import { aiMarkdownComponents, userMarkdownComponents } from './ChatMarkdownComponents';

// Animation variants for messages
const messageVariants = {
  hidden: (role) => ({
    opacity: 0,
    scale: 0.3,
    x: role === 'user' ? 50 : -50,
    y: 20,
  }),
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.5,
      opacity: { duration: 0.2 },
    }
  },
  exit: (role) => ({
    opacity: 0,
    scale: 0.3,
    x: role === 'user' ? 50 : -50,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  })
};

/**
 * Get border radius class based on message position in group
 */
function getMessageRoundedClass(role, isFirstInGroup, isLastInGroup, isSingleMessage) {
  if (isSingleMessage) return 'rounded-2xl';

  if (role === 'user') {
    if (isFirstInGroup) return 'rounded-2xl rounded-br-md';
    if (isLastInGroup) return 'rounded-2xl rounded-tr-md';
    return 'rounded-2xl rounded-tr-md rounded-br-md';
  } else {
    if (isFirstInGroup) return 'rounded-2xl rounded-bl-md';
    if (isLastInGroup) return 'rounded-2xl rounded-tl-md';
    return 'rounded-2xl rounded-tl-md rounded-bl-md';
  }
}

export function ChatMessage({
  message,
  theme,
  isFirstInGroup,
  isLastInGroup,
  isSingleMessage,
  isSearchResult,
  isCurrentResult,
  searchResultRef,
  highlightedContent,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onCopy,
  onToggleFavorite,
  isCopied,
  isFavorite,
}) {
  const { id, role, content, timestamp } = message;

  const roundedClass = getMessageRoundedClass(role, isFirstInGroup, isLastInGroup, isSingleMessage);
  const marginTop = isFirstInGroup ? 'mt-4' : 'mt-1';

  return (
    <motion.div
      ref={searchResultRef}
      custom={role}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} ${marginTop} px-1 group`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
        className={`relative inline-block max-w-[80%] ${roundedClass} px-3 py-2 ${
          role === 'user'
            ? `${theme.userBubble} ${theme.userBubbleShadow}`
            : `${theme.aiBubble} ${theme.aiBubbleShadow}`
        } ${
          isSearchResult
            ? isCurrentResult
              ? 'ring-2 ring-yellow-400 shadow-xl'
              : 'ring-1 ring-yellow-200'
            : ''
        }`}
      >
        {/* Message content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="break-words"
        >
          <ReactMarkdown
            components={role === 'user' ? userMarkdownComponents : aiMarkdownComponents}
          >
            {highlightedContent || content}
          </ReactMarkdown>
        </motion.div>

        {/* Timestamp and action buttons */}
        <div className="flex items-center justify-between mt-1 gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.15 }}
            className="text-[8px]"
            style={{
              color: role === 'user' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)'
            }}
          >
            {new Date(timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </motion.div>

          {/* Action buttons - appear on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                {/* Favorite button */}
                <motion.button
                  onClick={() => onToggleFavorite(id)}
                  className={`p-1 rounded transition-colors ${
                    role === 'user'
                      ? 'hover:bg-white/20 text-white/70 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    className={`w-3 h-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                  />
                </motion.button>

                {/* Copy button */}
                <motion.button
                  onClick={() => onCopy(id, content)}
                  className={`p-1 rounded transition-colors ${
                    role === 'user'
                      ? 'hover:bg-white/20 text-white/70 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  title={isCopied ? 'Copied!' : 'Copy message'}
                >
                  {isCopied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ChatMessage;
