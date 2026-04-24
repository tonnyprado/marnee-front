/**
 * useChat Hook
 *
 * Handles chat message state and sending logic.
 * Extracted from ChatPage.jsx to separate business logic from UI.
 */

import { useState, useCallback } from 'react';
import { api } from '../../../services/api';

export function useChat({ founderId, sessionId, conversationId, setConversationId, playSound }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Send message to AI
   */
  const sendMessage = useCallback(async (userMessage, onConversationUpdate) => {
    if (!userMessage.trim() || isLoading) return;

    // Play send sound
    if (playSound) {
      playSound('send');
    }

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
      console.log('[useChat] Sending message...');

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

      console.log('[useChat] Response received:', response);

      // Update conversation ID if new
      const finalConvId = response.conversationId || conversationId;
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
        console.log('[useChat] Conversation created:', response.conversationId);
      }

      // Add AI response
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      // Play receive sound
      if (playSound) {
        playSound('receive');
      }

      // Replace temp message with confirmed ones
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
        return [
          ...withoutTemp,
          { ...tempUserMsg, id: `user-${Date.now()}` }, // Replace temp ID
          aiMessage,
        ];
      });

      console.log('[useChat] Messages updated successfully');

      // Notify parent to update conversations list
      if (onConversationUpdate && finalConvId) {
        onConversationUpdate(finalConvId);
      }

    } catch (error) {
      console.error('[useChat] Send error:', error);

      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));

      throw error; // Re-throw to allow parent to handle
    } finally {
      setIsLoading(false);
    }
  }, [founderId, sessionId, conversationId, setConversationId, messages, isLoading, playSound]);

  /**
   * Load messages from a conversation
   */
  const loadMessages = useCallback((conversationMessages) => {
    if (conversationMessages && conversationMessages.length > 0) {
      const loadedMessages = conversationMessages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt,
      }));
      setMessages(loadedMessages);
    } else {
      setMessages([]);
    }
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    loadMessages,
    clearMessages,
    setMessages, // Expose for advanced usage
  };
}
