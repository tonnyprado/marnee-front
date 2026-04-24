/**
 * MessageItem Component
 *
 * Individual message bubble with:
 * - User/AI styling
 * - Markdown rendering
 * - Hover actions (copy, favorite)
 * - Search highlighting
 * - WhatsApp-style grouping
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Star } from 'lucide-react';

// Markdown components for AI messages (formatted text)
const aiMarkdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-2 text-gray-900" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-1.5 mt-2 text-gray-900" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1.5 mt-2 text-gray-900" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mb-1 mt-1.5 text-gray-800" {...props} />,
  p: ({ node, ...props }) => <p className="mb-1 last:mb-0 leading-relaxed text-sm" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 space-y-0.5 ml-1 text-sm" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 space-y-0.5 ml-1 text-sm" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-sm" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  a: ({ node, ...props }) => <a className="text-[#40086d] hover:text-[#40086d] underline font-medium" {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800" {...props} />
    ) : (
      <code className="block bg-gray-100 p-2 rounded-lg text-xs font-mono overflow-x-auto mb-1 text-gray-800" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-violet-300 pl-3 italic my-1.5 text-gray-700 text-sm" {...props} />
  ),
};

// Markdown components for user messages (white text on gradient)
const userMarkdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-2 text-white" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-1.5 mt-2 text-white" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1.5 mt-2 text-white" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mb-1 mt-1.5 text-white" {...props} />,
  p: ({ node, ...props }) => <p className="mb-1 last:mb-0 leading-relaxed text-white text-sm" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 space-y-0.5 ml-1 text-white text-sm" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 space-y-0.5 ml-1 text-white text-sm" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-white text-sm" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-white" {...props} />,
  a: ({ node, ...props }) => <a className="text-white underline hover:text-gray-100 font-medium" {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono text-white" {...props} />
    ) : (
      <code className="block bg-white/20 p-2 rounded-lg text-xs font-mono overflow-x-auto mb-1 text-white" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-white/50 pl-3 italic my-1.5 text-white text-sm" {...props} />
  ),
};

export default function MessageItem({
  message,
  prevMessage,
  nextMessage,
  isSearchResult,
  isCurrentResult,
  isFavorite,
  onCopy,
  onToggleFavorite,
  highlightText,
  searchResultRef,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const handleCopy = () => {
    onCopy(message.id, message.content);
    setCopiedMessageId(message.id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Check if previous/next message is from same sender
  const isSameSenderAsPrev = prevMessage && prevMessage.role === message.role;
  const isSameSenderAsNext = nextMessage && nextMessage.role === message.role;

  // Determine position in group
  const isFirstInGroup = !isSameSenderAsPrev;
  const isLastInGroup = !isSameSenderAsNext;
  const isSingleMessage = isFirstInGroup && isLastInGroup;

  // Dynamic border radius - WhatsApp style
  let roundedClass = 'rounded-2xl';
  if (!isSingleMessage) {
    if (message.role === 'user') {
      if (isFirstInGroup) roundedClass = 'rounded-2xl rounded-br-md';
      else if (isLastInGroup) roundedClass = 'rounded-2xl rounded-tr-md';
      else roundedClass = 'rounded-2xl rounded-tr-md rounded-br-md';
    } else {
      if (isFirstInGroup) roundedClass = 'rounded-2xl rounded-bl-md';
      else if (isLastInGroup) roundedClass = 'rounded-2xl rounded-tl-md';
      else roundedClass = 'rounded-2xl rounded-tl-md rounded-bl-md';
    }
  }

  const isUser = message.role === 'user';
  const contentToDisplay = highlightText ? highlightText(message.content) : message.content;

  return (
    <motion.div
      ref={searchResultRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${
        !isSameSenderAsPrev ? 'mt-4' : 'mt-1'
      } px-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`max-w-[80%] lg:max-w-[70%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 group relative`}
      >
        <motion.div
          className={`relative ${roundedClass} px-4 py-2.5 shadow-sm border transition-all ${
            isSearchResult
              ? isCurrentResult
                ? 'ring-2 ring-yellow-400 bg-yellow-50 border-yellow-300'
                : 'ring-1 ring-yellow-200 border-yellow-200'
              : isUser
              ? 'bg-gradient-to-r from-[#40086d] to-[#2d0550] text-white border-transparent'
              : 'bg-white border-gray-200'
          }`}
          style={{
            maxWidth: '100%',
            wordBreak: 'break-word',
          }}
        >
          <ReactMarkdown
            components={isUser ? userMarkdownComponents : aiMarkdownComponents}
          >
            {contentToDisplay}
          </ReactMarkdown>

          {/* Action buttons - appear on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute ${
                  isUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
                } top-1/2 -translate-y-1/2 flex items-center gap-1 px-2`}
              >
                {/* Favorite button */}
                <motion.button
                  onClick={() => onToggleFavorite(message.id)}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    className={`w-3 h-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                  />
                </motion.button>

                {/* Copy button */}
                <motion.button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title={copiedMessageId === message.id ? 'Copied!' : 'Copy message'}
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
