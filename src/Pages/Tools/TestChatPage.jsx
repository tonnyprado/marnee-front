import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="h-screen bg-[#f6f6f6]">
      {/* Main chat area */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-[rgba(30,30,30,0.1)] px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Chat with Marnee</h1>
          <p className="text-sm text-gray-600">
            Your AI content strategist - all messages are saved and persist
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-400 py-12"
            >
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#40086d] opacity-40" />
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start chatting with Marnee</p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded px-5 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#1e1e1e] text-white'
                      : 'bg-white border border-[rgba(30,30,30,0.1)] text-gray-900'
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {msg.role === 'user' ? 'You' : 'Marnee'}
                  </div>
                  <ReactMarkdown
                    components={msg.role === 'user' ? userMarkdownComponents : aiMarkdownComponents}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded px-5 py-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-[#40086d] rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[#40086d] rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[#40086d] rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-[rgba(30,30,30,0.1)] px-6 py-4 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading}
            placeholder="Type your message..."
            className="flex-1 bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded bg-[#40086d] flex items-center justify-center text-white hover:bg-[#1a0530] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
