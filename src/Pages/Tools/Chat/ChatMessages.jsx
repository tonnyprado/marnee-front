/**
 * ChatMessages Component
 *
 * Messages container with:
 * - Message list rendering
 * - Loading indicator
 * - Empty state (prompt suggestions)
 * - Auto-scroll to bottom
 * - Search result refs
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import MessageItem from './MessageItem';
import PromptSuggestions from '../../../Component/PromptSuggestions';

export default function ChatMessages({
  messages,
  isLoading,
  favoriteMessageIds,
  searchResultRefs,
  isSearchResult,
  isCurrentResult,
  highlightText,
  onCopyMessage,
  onToggleFavorite,
  onSelectPrompt,
}) {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQwMDg2ZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat">
      {/* Empty state - Show prompt suggestions */}
      {messages.length === 0 && onSelectPrompt && (
        <PromptSuggestions onSelectPrompt={onSelectPrompt} />
      )}

      {/* Messages list */}
      <div>
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => {
            const resultIndex = searchResultRefs?.current ?
              index :
              -1;

            return (
              <MessageItem
                key={msg.id}
                message={msg}
                prevMessage={index > 0 ? messages[index - 1] : null}
                nextMessage={index < messages.length - 1 ? messages[index + 1] : null}
                isSearchResult={isSearchResult ? isSearchResult(index) : false}
                isCurrentResult={isCurrentResult ? isCurrentResult(index) : false}
                isFavorite={favoriteMessageIds ? favoriteMessageIds.has(msg.id) : false}
                onCopy={onCopyMessage}
                onToggleFavorite={onToggleFavorite}
                highlightText={highlightText}
                searchResultRef={(el) => {
                  if (searchResultRefs?.current && isSearchResult && isSearchResult(index)) {
                    const currentResults = searchResultRefs.current;
                    const resultIdx = messages.slice(0, index + 1).filter((_, i) => isSearchResult(i)).length - 1;
                    if (resultIdx >= 0) {
                      currentResults[resultIdx] = el;
                    }
                  }
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Loading indicator */}
      {isLoading && (
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
              <motion.div
                className="w-2 h-2 bg-gradient-to-br from-[#40086d] to-[#2d0550] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
              />
              <motion.div
                className="w-2 h-2 bg-gradient-to-br from-[#40086d] to-[#2d0550] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                  times: [0, 0.5, 1]
                }}
              />
              <motion.div
                className="w-2 h-2 bg-gradient-to-br from-[#40086d] to-[#2d0550] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                  times: [0, 0.5, 1]
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
