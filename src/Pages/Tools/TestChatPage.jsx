import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';
import { Send, Loader2, MessageCircle, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../Component/PageTransition';

// Markdown components for AI messages (formatted text)
// eslint-disable-next-line jsx-a11y/heading-has-content
const aiMarkdownComponents = {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2 mt-3 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-3 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-base font-semibold mb-2 mt-2 text-gray-800" {...props} />,
  p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  a: ({ node, ...props }) => <a className="text-[#40086d] hover:text-[#40086d] underline font-medium" {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
    ) : (
      <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3 text-gray-800" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-violet-300 pl-4 italic my-3 text-gray-700" {...props} />
  ),
};

// Markdown components for user messages (white text on gradient)
const userMarkdownComponents = {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2 mt-3 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-3 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-base font-semibold mb-2 mt-2 text-white" {...props} />,
  p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-white" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2 text-white" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2 text-white" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-white" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  a: ({ node, ...props }) => <a className="text-white underline hover:text-gray-100 font-medium" {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-white/20 px-1.5 py-0.5 rounded text-sm font-mono text-white" {...props} />
    ) : (
      <code className="block bg-white/20 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3 text-white" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-white/50 pl-4 italic my-3 text-white" {...props} />
  ),
};

/**
 * TestChatPage - Chat with clean architecture
 *
 * Simple chat that saves messages to database and persists between sessions.
 */
export default function TestChatPage() {
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [founderId, setFounderId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const messagesEndRef = useRef(null);
  const searchResultRefs = useRef([]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = messages
      .map((msg, index) => ({
        messageIndex: index,
        messageId: msg.id,
        matches: msg.content.toLowerCase().includes(term),
      }))
      .filter(result => result.matches);

    setSearchResults(results);
    setCurrentResultIndex(0);

    // Scroll to first result
    if (results.length > 0) {
      setTimeout(() => {
        const firstResultElement = searchResultRefs.current[0];
        if (firstResultElement) {
          firstResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [searchTerm, messages]);

  // Navigate between search results
  const goToNextResult = () => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIndex);

    const resultElement = searchResultRefs.current[nextIndex];
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goToPrevResult = () => {
    if (searchResults.length === 0) return;
    const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentResultIndex(prevIndex);

    const resultElement = searchResultRefs.current[prevIndex];
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Highlight text function
  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase()
        ? `**${part}**`
        : part
    ).join('');
  };

  // Initialize: Load founder, conversation, and messages
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('[TestChat] Initializing...');

        // 1. Get founder
        const founder = await api.getMeFounder();
        setFounderId(founder.id);
        console.log('[TestChat] Founder loaded:', founder.id);

        // 2. Get or create session
        const sessions = await api.getMeSessions();
        const latestSession = sessions && sessions.sessions && sessions.sessions.length > 0
          ? sessions.sessions[0]
          : null;

        if (latestSession) {
          setSessionId(latestSession.id);
          console.log('[TestChat] Session loaded:', latestSession.id);
        }

        // 3. Get conversations
        const conversationsResponse = await api.getConversations();
        console.log('[TestChat] Conversations response:', conversationsResponse);

        let conversationData = null;
        if (conversationsResponse && conversationsResponse.conversations && conversationsResponse.conversations.length > 0) {
          // Load most recent conversation
          const latestConv = conversationsResponse.conversations[0];
          console.log('[TestChat] Loading conversation:', latestConv.id);

          conversationData = await api.getConversation(latestConv.id);
          console.log('[TestChat] Conversation data:', conversationData);

          setConversationId(conversationData.id);

          // Load messages
          if (conversationData.messages && conversationData.messages.length > 0) {
            const loadedMessages = conversationData.messages.map(msg => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: msg.createdAt,
            }));

            setMessages(loadedMessages);
            console.log('[TestChat] Loaded', loadedMessages.length, 'messages from DB');
          }
        } else {
          console.log('[TestChat] No existing conversations found');
        }

      } catch (error) {
        console.error('[TestChat] Initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Optimistic UI update
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    setIsLoading(true);

    try {
      console.log('[TestChat] Sending message...');

      // Build messages history for API
      const messagesForApi = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      // Send to API
      const response = await api.sendMessage({
        founderId: founderId,
        sessionId: sessionId,
        conversationId: conversationId,
        message: userMessage,
        messages: messagesForApi,
      });

      console.log('[TestChat] Response received:', response);

      // Update conversation ID if new
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
        console.log('[TestChat] Conversation created:', response.conversationId);
      }

      // Add AI response
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      // Replace temp message with confirmed ones
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
        return [
          ...withoutTemp,
          { ...tempUserMsg, id: `user-${Date.now()}` }, // Replace temp ID
          aiMessage,
        ];
      });

      console.log('[TestChat] Messages updated successfully');

    } catch (error) {
      console.error('[TestChat] Send error:', error);

      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f6f6]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#40086d] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Initializing Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50">
      {/* Main chat area */}
      <div className="flex flex-col h-full backdrop-blur-sm">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-white to-purple-50/30 border-b border-gray-200 shadow-sm px-4 py-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40086d] to-[#2d0550] flex items-center justify-center shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-bold text-gray-900"
                >
                  Chat with Marnee
                </motion.h1>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-gray-600"
                >
                  Your AI content strategist
                </motion.p>
              </div>
            </div>

            {/* Search box */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in chat..."
                  className="w-full sm:w-48 pl-8 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search navigation */}
              {searchResults.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 mr-1">
                    {currentResultIndex + 1}/{searchResults.length}
                  </span>
                  <button
                    onClick={goToPrevResult}
                    className="p-1 hover:bg-gray-100 rounded transition"
                    title="Previous result"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextResult}
                    className="p-1 hover:bg-gray-100 rounded transition"
                    title="Next result"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQwMDg2ZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center text-gray-400 py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#40086d] opacity-30" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base font-medium mb-1"
              >
                No messages yet
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm"
              >
                Start chatting with Marnee
              </motion.p>
            </motion.div>
          )}

          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, index) => {
                const isSearchResult = searchResults.some(result => result.messageIndex === index);
                const resultIndex = searchResults.findIndex(result => result.messageIndex === index);
                const isCurrentResult = resultIndex === currentResultIndex;

                // Check if previous/next message is from same sender
                const prevMsg = index > 0 ? messages[index - 1] : null;
                const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
                const isSameSenderAsPrev = prevMsg && prevMsg.role === msg.role;
                const isSameSenderAsNext = nextMsg && nextMsg.role === msg.role;

                // Determine position in group
                const isFirstInGroup = !isSameSenderAsPrev;
                const isLastInGroup = !isSameSenderAsNext;
                const isSingleMessage = isFirstInGroup && isLastInGroup;

                // Dynamic border radius - WhatsApp style
                let roundedClass = 'rounded-2xl';
                if (!isSingleMessage) {
                  if (msg.role === 'user') {
                    if (isFirstInGroup) roundedClass = 'rounded-2xl rounded-br-sm';
                    else if (isLastInGroup) roundedClass = 'rounded-2xl rounded-tr-sm';
                    else roundedClass = 'rounded-2xl rounded-tr-sm rounded-br-sm';
                  } else {
                    if (isFirstInGroup) roundedClass = 'rounded-2xl rounded-bl-sm';
                    else if (isLastInGroup) roundedClass = 'rounded-2xl rounded-tl-sm';
                    else roundedClass = 'rounded-2xl rounded-tl-sm rounded-bl-sm';
                  }
                }

                // Spacing
                const marginTop = isSameSenderAsPrev ? 'mt-0.5' : 'mt-6';

                // Animation variants for incoming messages
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

                return (
                  <motion.div
                    key={msg.id}
                    ref={isSearchResult ? (el) => { searchResultRefs.current[resultIndex] = el; } : null}
                    custom={msg.role}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${marginTop}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`relative max-w-[75%] sm:max-w-md ${roundedClass} px-4 py-2.5 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-[#40086d] to-[#2d0550] text-white shadow-lg shadow-purple-900/20'
                          : 'bg-white border border-gray-200 text-gray-900 shadow-md'
                      } ${
                        isSearchResult
                          ? isCurrentResult
                            ? 'ring-2 ring-yellow-400 shadow-xl'
                            : 'ring-1 ring-yellow-200'
                          : ''
                      }`}
                    >
                      {/* Show sender label only on first message of group */}
                      {isFirstInGroup && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          transition={{ delay: 0.1 }}
                          className="text-[10px] font-semibold mb-1 tracking-wide"
                          style={{
                            color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#40086d'
                          }}
                        >
                          {msg.role === 'user' ? 'YOU' : 'MARNEE'}
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        <ReactMarkdown
                          components={msg.role === 'user' ? userMarkdownComponents : aiMarkdownComponents}
                        >
                          {isSearchResult ? highlightText(msg.content, searchTerm) : msg.content}
                        </ReactMarkdown>
                      </motion.div>

                      {/* Timestamp on last message of group */}
                      {isLastInGroup && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          transition={{ delay: 0.2 }}
                          className="text-[9px] mt-1 text-right"
                          style={{
                            color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'
                          }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

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
              className="flex justify-start mt-6"
            >
              <motion.div
                className="bg-white border border-gray-200 rounded-2xl px-5 py-3.5 shadow-md"
                animate={{
                  boxShadow: [
                    "0 4px 6px -1px rgba(0,0,0,0.1)",
                    "0 6px 12px -1px rgba(64,8,109,0.15)",
                    "0 4px 6px -1px rgba(0,0,0,0.1)"
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
                    className="w-2.5 h-2.5 bg-gradient-to-br from-[#40086d] to-[#2d0550] rounded-full"
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
                    className="w-2.5 h-2.5 bg-gradient-to-br from-[#40086d] to-[#2d0550] rounded-full"
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
                    className="w-2.5 h-2.5 bg-gradient-to-br from-[#40086d] to-[#2d0550] rounded-full"
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

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-gradient-to-r from-white to-purple-50/30 border-t border-gray-200 shadow-lg px-4 py-4"
        >
          <div className="flex items-end gap-3 max-w-5xl mx-auto">
            <motion.div
              className="flex-1 relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-5 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent resize-none shadow-sm transition-all"
                style={{
                  minHeight: '44px',
                  maxHeight: '120px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-[#40086d] to-[#2d0550] flex items-center justify-center text-white shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <motion.div
                animate={isLoading ? { rotate: 360 } : {}}
                transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
