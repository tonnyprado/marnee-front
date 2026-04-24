/**
 * useConversations Hook
 *
 * Manages conversations list: loading, selection, creation, deletion.
 * Extracted from ChatPage.jsx to separate conversation management logic.
 */

import { useState, useCallback } from 'react';
import { api } from '../../../services/api';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load all conversations from API
   */
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('[useConversations] Loading conversations...');

      const conversationsResponse = await api.getConversations();

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
              console.error('[useConversations] Error loading conversation:', conv.id, err);
              return { ...conv, messages: [] };
            }
          })
        );

        // Sort by most recent first
        conversationsWithMessages.sort((a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

        setConversations(conversationsWithMessages);
        console.log('[useConversations] Loaded', conversationsWithMessages.length, 'conversations');

        return conversationsWithMessages;
      } else {
        console.log('[useConversations] No existing conversations found');
        setConversations([]);
        return [];
      }
    } catch (error) {
      console.error('[useConversations] Load error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select a conversation
   */
  const selectConversation = useCallback((conversationId) => {
    console.log('[useConversations] Selecting conversation:', conversationId);
    setActiveConversationId(conversationId);

    // Find and return conversation
    const conversation = conversations.find(c => c.id === conversationId);
    return conversation || null;
  }, [conversations]);

  /**
   * Create new conversation (reset state)
   */
  const createNewConversation = useCallback(() => {
    console.log('[useConversations] Creating new conversation');
    setActiveConversationId(null);
  }, []);

  /**
   * Delete a conversation
   */
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      console.log('[useConversations] Deleting conversation:', conversationId);

      // Call API to delete
      await api.deleteConversation(conversationId);

      // Remove from local state
      setConversations(prevConvs => prevConvs.filter(c => c.id !== conversationId));

      // If deleted conversation was active, clear
      if (conversationId === activeConversationId) {
        setActiveConversationId(null);
      }

      console.log('[useConversations] Conversation deleted successfully');
      return true;
    } catch (error) {
      console.error('[useConversations] Delete error:', error);
      throw error;
    }
  }, [activeConversationId]);

  /**
   * Update conversations list after sending a message
   */
  const updateConversationAfterMessage = useCallback(async (conversationId) => {
    try {
      console.log('[useConversations] Updating conversation after message:', conversationId);

      // Reload the conversation that was just updated
      const updatedConv = await api.getConversation(conversationId);

      setConversations(prevConvs => {
        // Check if conversation already exists
        const existingIndex = prevConvs.findIndex(c => c.id === conversationId);

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
              id: conversationId,
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
      console.error('[useConversations] Update error:', error);
    }
  }, []);

  /**
   * Get active conversation object
   */
  const getActiveConversation = useCallback(() => {
    if (!activeConversationId) return null;
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [activeConversationId, conversations]);

  return {
    conversations,
    activeConversationId,
    isLoading,
    loadConversations,
    selectConversation,
    createNewConversation,
    deleteConversation,
    updateConversationAfterMessage,
    getActiveConversation,
    setActiveConversationId, // For external control
  };
}
