import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Plus, X, Trash2 } from 'lucide-react';

/**
 * ConversationSidebar - Sidebar showing list of conversations
 *
 * Props:
 * - conversations: Array of conversation objects with {id, createdAt, messages, title}
 * - activeConversationId: Currently selected conversation ID
 * - onSelectConversation: (conversationId) => void
 * - onNewConversation: () => void
 * - onDeleteConversation: (conversationId) => void
 * - isOpen: Boolean for mobile sidebar state
 * - onClose: () => void for closing mobile sidebar
 */
export default function ConversationSidebar({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen = true,
  onClose,
}) {
  const [hoveredConvId, setHoveredConvId] = useState(null);
  // Generate title from first message or use default
  const getConversationTitle = (conversation) => {
    if (conversation.title) return conversation.title;

    const firstUserMessage = conversation.messages?.find(m => m.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 40);
      return title.length < firstUserMessage.content.length ? `${title}...` : title;
    }

    return 'New Conversation';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#40086d]" />
            Conversations
          </h2>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* New Conversation Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-[#40086d] to-[#2d0550] text-white rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            <AnimatePresence>
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                const title = getConversationTitle(conv);
                const date = formatDate(conv.createdAt || conv.updatedAt);

                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.01 }}
                    onMouseEnter={() => setHoveredConvId(conv.id)}
                    onMouseLeave={() => setHoveredConvId(null)}
                    className="relative"
                  >
                    <button
                      onClick={() => onSelectConversation(conv.id)}
                      className={`w-full text-left rounded-xl p-3 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#40086d]/10 to-[#2d0550]/10 border-2 border-[#40086d]/30'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-semibold line-clamp-2 pr-6 ${
                          isActive ? 'text-[#40086d]' : 'text-gray-900'
                        }`}>
                          {title}
                        </h3>
                        {isActive && !hoveredConvId && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-[#40086d] rounded-full flex-shrink-0 mt-1"
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{date}</p>
                    </button>

                    {/* Delete button - appears on hover */}
                    <AnimatePresence>
                      {hoveredConvId === conv.id && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this conversation? This action cannot be undone.')) {
                              onDeleteConversation(conv.id);
                            }
                          }}
                          className="absolute top-3 right-3 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <div className="hidden lg:block w-80 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar - Slide in overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
