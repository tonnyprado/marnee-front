import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';
import { Send, Loader2, MessageCircle, Search, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../Component/PageTransition';
import ConversationSidebar from '../../Component/ConversationSidebar';
import QuickActionsBar from '../../Component/QuickActionsBar';
import { ChatThemeProvider, useChatTheme } from '../../context/ChatThemeContext';

// Markdown components for AI messages (formatted text)
// eslint-disable-next-line jsx-a11y/heading-has-content
const aiMarkdownComponents = {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-2 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-1.5 mt-2 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1.5 mt-2 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mb-1 mt-1.5 text-gray-800" {...props} />,
  p: ({ node, ...props }) => <p className="mb-1 last:mb-0 leading-relaxed text-sm" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 space-y-0.5 ml-1 text-sm" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 space-y-0.5 ml-1 text-sm" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-sm" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
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
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-2 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-1.5 mt-2 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1.5 mt-2 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mb-1 mt-1.5 text-white" {...props} />,
  p: ({ node, ...props }) => <p className="mb-1 last:mb-0 leading-relaxed text-white text-sm" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 space-y-0.5 ml-1 text-white text-sm" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 space-y-0.5 ml-1 text-white text-sm" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-white text-sm" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
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

/**
 * ChatPage - Multi-conversation chat
 *
 * Full-featured chat with multiple conversations that saves messages to database.
 * Marnee has access to all conversation history for context.
 */
function ChatPageContent() {
  // Theme context
  const { theme, playSound } = useChatTheme();

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

  // New state for multiple conversations
  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });
  const [isActionsBarCollapsed, setIsActionsBarCollapsed] = useState(() => {
    const saved = localStorage.getItem('actions_bar_collapsed');
    return saved === 'true';
  });

  const messagesEndRef = useRef(null);
  const searchResultRefs = useRef([]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Save actions bar state
  useEffect(() => {
    localStorage.setItem('actions_bar_collapsed', isActionsBarCollapsed);
  }, [isActionsBarCollapsed]);

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

  // Initialize: Load founder, conversations
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('[Chat] Initializing...');

        // 1. Get founder
        const founder = await api.getMeFounder();
        setFounderId(founder.id);
        console.log('[Chat] Founder loaded:', founder.id);

        // 2. Get or create session
        const sessions = await api.getMeSessions();
        const latestSession = sessions && sessions.sessions && sessions.sessions.length > 0
          ? sessions.sessions[0]
          : null;

        if (latestSession) {
          setSessionId(latestSession.id);
          console.log('[Chat] Session loaded:', latestSession.id);
        }

        // 3. Load all conversations
        const conversationsResponse = await api.getConversations();
        console.log('[Chat] Conversations response:', conversationsResponse);

        if (conversationsResponse && conversationsResponse.conversations && conversationsResponse.conversations.length > 0) {
          // Load full conversation data for each
          const conversationsWithMessages = await Promise.all(
            conversationsResponse.conversations.map(async (conv) => {
              try {
                const fullConv = await api.getConversation(conv.id);
                return {
                  ...conv,
                  messages: fullConv.messages || [],
                };
              } catch (err) {
                console.error('[Chat] Error loading conversation:', conv.id, err);
                return { ...conv, messages: [] };
              }
            })
          );

          // Sort by most recent first
          conversationsWithMessages.sort((a, b) =>
            new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
          );

          setConversations(conversationsWithMessages);
          console.log('[Chat] Loaded', conversationsWithMessages.length, 'conversations');

          // Auto-select most recent conversation
          if (conversationsWithMessages.length > 0) {
            const mostRecent = conversationsWithMessages[0];
            setConversationId(mostRecent.id);

            if (mostRecent.messages && mostRecent.messages.length > 0) {
              const loadedMessages = mostRecent.messages.map(msg => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: msg.createdAt,
              }));
              setMessages(loadedMessages);
              console.log('[Chat] Loaded', loadedMessages.length, 'messages from most recent conversation');
            }
          }
        } else {
          console.log('[Chat] No existing conversations found');
          setConversations([]);
        }

      } catch (error) {
        console.error('[Chat] Initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Handle conversation selection
  const handleSelectConversation = async (convId) => {
    console.log('[Chat] Selecting conversation:', convId);

    // Find conversation in state
    const conversation = conversations.find(c => c.id === convId);

    if (conversation) {
      setConversationId(convId);

      // Load messages from conversation
      if (conversation.messages && conversation.messages.length > 0) {
        const loadedMessages = conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
        }));
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }

      // Close sidebar on mobile
      setIsSidebarOpen(false);
    }
  };

  // Handle new conversation
  const handleNewConversation = () => {
    console.log('[Chat] Creating new conversation');

    // Reset current conversation
    setConversationId(null);
    setMessages([]);

    // Close sidebar on mobile
    setIsSidebarOpen(false);
  };

  // Handle delete conversation
  const handleDeleteConversation = async (convId) => {
    try {
      console.log('[Chat] Deleting conversation:', convId);

      // Call API to delete
      await api.deleteConversation(convId);

      // Remove from local state
      setConversations(prevConvs => prevConvs.filter(c => c.id !== convId));

      // If deleted conversation was active, clear current chat
      if (convId === conversationId) {
        setConversationId(null);
        setMessages([]);
      }

      console.log('[Chat] Conversation deleted successfully');
    } catch (error) {
      console.error('[Chat] Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  // Handle quick actions from sidebar
  const handleQuickAction = (actionId) => {
    console.log('[Chat] Quick action triggered:', actionId);

    switch (actionId) {
      case 'ideas':
        setInput('Generate 5 fresh content ideas for this week');
        break;
      case 'calendar':
        setInput('Create a 7-day content calendar');
        break;
      case 'script':
        setInput('Write a script for my next video');
        break;
      case 'analyze':
        setInput('Analyze my current content strategy');
        break;
      case 'resume':
        setInput('Summarize our conversation so far');
        break;
      case 'export':
        // TODO: Open export modal
        alert('Export feature coming soon!');
        break;
      case 'share':
        // TODO: Open share modal
        alert('Share feature coming soon!');
        break;
      case 'voice':
        // TODO: Toggle voice mode
        alert('Voice mode feature coming soon!');
        break;
      default:
        break;
    }
  };

  // Update conversations list after sending message
  const updateConversationsAfterMessage = async (convId) => {
    try {
      // Reload the conversation that was just updated
      const updatedConv = await api.getConversation(convId);

      setConversations(prevConvs => {
        // Check if conversation already exists
        const existingIndex = prevConvs.findIndex(c => c.id === convId);

        let updated;
        if (existingIndex >= 0) {
          // Update existing conversation
          updated = [...prevConvs];
          updated[existingIndex] = {
            ...updated[existingIndex],
            messages: updatedConv.messages || [],
            updatedAt: new Date().toISOString(),
          };
        } else {
          // Add new conversation to the list
          updated = [
            {
              id: convId,
              founderId: founderId,
              sessionId: sessionId,
              messages: updatedConv.messages || [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...prevConvs,
          ];
        }

        // Sort by most recent
        updated.sort((a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

        return updated;
      });
    } catch (error) {
      console.error('[Chat] Error updating conversations list:', error);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Play send sound
    playSound('send');

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
      console.log('[Chat] Sending message...');

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

      console.log('[Chat] Response received:', response);

      // Update conversation ID if new
      const finalConvId = response.conversationId || conversationId;
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
        console.log('[Chat] Conversation created:', response.conversationId);
      }

      // Add AI response
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      // Play receive sound
      playSound('receive');

      // Replace temp message with confirmed ones
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
        return [
          ...withoutTemp,
          { ...tempUserMsg, id: `user-${Date.now()}` }, // Replace temp ID
          aiMessage,
        ];
      });

      console.log('[Chat] Messages updated successfully');

      // Update conversations list
      if (finalConvId) {
        await updateConversationsAfterMessage(finalConvId);
      }

    } catch (error) {
      console.error('[Chat] Send error:', error);

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
    <PageTransition className={`h-screen ${theme.background}`}>
      {/* Main layout with sidebar */}
      <div className="flex h-full relative">
        {/* Sidebar - Always rendered, controls its own collapsed state */}
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full backdrop-blur-sm">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-white to-purple-50/30 border-b border-gray-200 shadow-sm px-4 py-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-3">
              {/* Hamburger menu for mobile */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </motion.button>

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
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQwMDg2ZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat">
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

          <div>
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
                    if (isFirstInGroup) roundedClass = 'rounded-2xl rounded-br-md';
                    else if (isLastInGroup) roundedClass = 'rounded-2xl rounded-tr-md';
                    else roundedClass = 'rounded-2xl rounded-tr-md rounded-br-md';
                  } else {
                    if (isFirstInGroup) roundedClass = 'rounded-2xl rounded-bl-md';
                    else if (isLastInGroup) roundedClass = 'rounded-2xl rounded-tl-md';
                    else roundedClass = 'rounded-2xl rounded-tl-md rounded-bl-md';
                  }
                }

                // Spacing - muy poco espacio entre mensajes consecutivos
                const marginTop = isSameSenderAsPrev ? 'mt-1' : 'mt-4';

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
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${marginTop} px-1`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`relative inline-block max-w-[80%] ${roundedClass} px-3 py-2 ${
                        msg.role === 'user'
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
                          components={msg.role === 'user' ? userMarkdownComponents : aiMarkdownComponents}
                        >
                          {isSearchResult ? highlightText(msg.content, searchTerm) : msg.content}
                        </ReactMarkdown>
                      </motion.div>

                      {/* Timestamp on every message */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.15 }}
                        className="text-[8px] mt-1 text-right"
                        style={{
                          color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)'
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </motion.div>
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

        {/* Quick Actions Bar - Right side */}
        <QuickActionsBar
          onAction={handleQuickAction}
          isVoiceActive={false}
          isCollapsed={isActionsBarCollapsed}
          onToggleCollapse={() => setIsActionsBarCollapsed(!isActionsBarCollapsed)}
        />
      </div>
    </PageTransition>
  );
}

// Export wrapped with ChatThemeProvider
export default function ChatPage() {
  return (
    <ChatThemeProvider>
      <ChatPageContent />
    </ChatThemeProvider>
  );
}
