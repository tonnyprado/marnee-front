import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';

/**
 * TestChatPage - Chat prototype with clean architecture
 *
 * Simple chat that ACTUALLY saves messages to database and persists between sessions.
 * If this works, we'll migrate this architecture to the main chat.
 */
export default function TestChatPage() {
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [founderId, setFounderId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Debugging info
  const [debugInfo, setDebugInfo] = useState({
    messagesInState: 0,
    messagesInDb: 0,
    conversationIdStatus: 'unknown',
    founderIdStatus: 'unknown',
  });

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

        // Update debug info
        setDebugInfo({
          messagesInState: messages.length,
          messagesInDb: conversationData?.messages?.length || 0,
          conversationIdStatus: conversationId ? 'exists' : 'will be created',
          founderIdStatus: founder.id ? 'exists' : 'missing',
        });

      } catch (error) {
        console.error('[TestChat] Initialization error:', error);
        setError(`Init error: ${error.message}`);
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
    setError(null);

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

      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        messagesInState: messages.length + 2,
        conversationIdStatus: response.conversationId ? 'exists' : 'missing',
      }));

    } catch (error) {
      console.error('[TestChat] Send error:', error);
      setError(`Send failed: ${error.message}`);

      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  // Reload messages from DB
  const handleReload = async () => {
    if (!conversationId) {
      setError('No conversation to reload');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[TestChat] Reloading from DB...');
      const conversationData = await api.getConversation(conversationId);

      const loadedMessages = conversationData.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt,
      }));

      setMessages(loadedMessages);
      console.log('[TestChat] Reloaded', loadedMessages.length, 'messages');

      setDebugInfo(prev => ({
        ...prev,
        messagesInState: loadedMessages.length,
        messagesInDb: loadedMessages.length,
      }));

    } catch (error) {
      console.error('[TestChat] Reload error:', error);
      setError(`Reload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Test Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with debug info */}
      <div className="w-80 bg-gray-900 text-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-green-400">🧪 Test Chat</h2>
        <p className="text-sm text-gray-400 mb-6">
          Clean architecture prototype. If this works, we migrate to main chat.
        </p>

        <div className="space-y-4">
          {/* Status */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Status</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Messages in State:</span>
                <span className="text-cyan-400 font-mono">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Conversation ID:</span>
                <span className="text-cyan-400 font-mono text-xs">
                  {conversationId ? conversationId.substring(0, 8) + '...' : 'null'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Founder ID:</span>
                <span className="text-cyan-400 font-mono text-xs">
                  {founderId ? founderId.substring(0, 8) + '...' : 'null'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Session ID:</span>
                <span className="text-cyan-400 font-mono text-xs">
                  {sessionId ? sessionId.substring(0, 8) + '...' : 'null'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleReload}
                disabled={!conversationId || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm"
              >
                🔄 Reload from DB
              </button>
              <button
                onClick={() => {
                  console.group('🐛 Debug Info');
                  console.log('messages:', messages);
                  console.log('conversationId:', conversationId);
                  console.log('founderId:', founderId);
                  console.log('sessionId:', sessionId);
                  console.groupEnd();
                  alert('Check console for debug info');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
              >
                📋 Log to Console
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Test Instructions</h3>
            <ol className="text-xs space-y-2 text-gray-300">
              <li>1. Send a few messages</li>
              <li>2. Click "Reload from DB" to verify they're saved</li>
              <li>3. Refresh the page (F5) - messages should persist</li>
              <li>4. Close browser, reopen - messages should still be there</li>
            </ol>
          </div>

          {/* Error Display */}
          {error && (
            <div className="border-t border-red-700 pt-4 mt-4">
              <h3 className="text-xs font-semibold text-red-400 uppercase mb-2">Error</h3>
              <p className="text-xs text-red-300 font-mono">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Test Chat with Marnee</h1>
          <p className="text-sm text-gray-600">
            All messages are saved to database and persist between sessions
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg mb-2">👋 No messages yet</p>
              <p className="text-sm">Send a message to start chatting with Marnee</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {msg.role === 'user' ? 'You' : 'Marnee'}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white hover:from-violet-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
