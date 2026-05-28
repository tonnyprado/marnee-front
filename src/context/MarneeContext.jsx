/**
 * MarneeContext - Refactored to use StorageService and AuthContext
 *
 * MIGRATION NOTES:
 * - Now uses AuthContext for founderId/sessionId (backward compatible)
 * - Still manages messages/calendar/steps for legacy support
 * - Components should gradually migrate to:
 *   - useAuth() for founderId/sessionId
 *   - useChat() for messages
 *   - useConversations() for conversations
 *   - This context for app-level state only (steps, calendar)
 *
 * BEFORE: Direct localStorage usage (15+ calls)
 * AFTER: Uses StorageService from core + AuthContext (React Native ready)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import storage from '../core/services/StorageService';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const MarneeContext = createContext(null);

const STORAGE_KEYS = {
  FOUNDER_ID: 'marnee_founderId',
  SESSION_ID: 'marnee_sessionId',
  CALENDAR_ID: 'marnee_calendarId',
  CONVERSATION_ID: 'marnee_conversationId',
  MESSAGES_BACKUP: 'marnee_messages_backup',
  CALENDAR_BACKUP: 'marnee_calendar_backup',
};

const STEP_NAMES = {
  1: 'involvement_level',
  2: 'core_niche',
  3: 'posting_cadence',
  4: 'content_pillars',
  5: 'calendar',
  6: 'script_generation',
};

export function MarneeProvider({ children }) {
  // Use AuthContext for session management
  const auth = useAuth();

  // App state
  const [conversationId, setConversationId] = useState(() =>
    storage.getItem(STORAGE_KEYS.CONVERSATION_ID)
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [stepName, setStepName] = useState(STEP_NAMES[1]);

  const [messages, setMessages] = useState(() => {
    const backup = storage.getItem(STORAGE_KEYS.MESSAGES_BACKUP, []);
    console.log('[MarneeContext] Restored', backup.length, 'messages from storage backup');
    return backup;
  });

  const [welcomeMessage, setWelcomeMessage] = useState(null);

  const [calendarId, setCalendarId] = useState(() => {
    const storedId = storage.getItem(STORAGE_KEYS.CALENDAR_ID);
    console.log('[MarneeContext] Initial calendarId from storage:', storedId);
    return storedId;
  });

  const [calendar, setCalendar] = useState(() => {
    const backup = storage.getItem(STORAGE_KEYS.CALENDAR_BACKUP);
    if (backup) {
      console.log('[MarneeContext] Restored calendar from storage backup:', {
        postsCount: backup?.posts?.length || 0,
        startDate: backup?.startDate,
        endDate: backup?.endDate,
      });
    }
    return backup;
  });

  // Brainstorming notification state
  const [brainstormingNotification, setBrainstormingNotification] = useState({
    show: false,
    count: 0,
  });

  // Script notification state
  const [scriptNotification, setScriptNotification] = useState({
    show: false,
    title: null,
  });

  // Refs for notification timeout cleanup (prevent memory leaks)
  const brainstormingTimeoutRef = useRef(null);
  const scriptTimeoutRef = useRef(null);

  // Chat state - persists across navigation
  const [chatIsLoading, setChatIsLoading] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState(null);
  const abortControllerRef = useRef(null);

  // Persist to storage
  useEffect(() => {
    if (calendarId) {
      console.log('[MarneeContext] Saving calendarId to storage:', calendarId);
      storage.setItem(STORAGE_KEYS.CALENDAR_ID, calendarId);
    } else {
      console.log('[MarneeContext] calendarId is null/undefined, not saving to storage');
    }
  }, [calendarId]);

  useEffect(() => {
    if (conversationId) {
      storage.setItem(STORAGE_KEYS.CONVERSATION_ID, conversationId);
    }
  }, [conversationId]);

  // Persist messages to storage as backup
  useEffect(() => {
    if (messages.length > 0) {
      storage.setItem(STORAGE_KEYS.MESSAGES_BACKUP, messages);
      console.log('[MarneeContext] Backed up', messages.length, 'messages to storage');
    }
  }, [messages]);

  // Persist calendar to storage as backup
  useEffect(() => {
    if (calendar && calendar.posts && calendar.posts.length > 0) {
      storage.setItem(STORAGE_KEYS.CALENDAR_BACKUP, calendar);
      console.log('[MarneeContext] Backed up calendar to storage:', {
        postsCount: calendar.posts.length,
        startDate: calendar.startDate,
        endDate: calendar.endDate,
      });
    }
  }, [calendar]);

  // Initialize session after questionnaire
  const initSession = useCallback(({ founderId: fId, sessionId: sId, welcomeMessage: wMsg, conversationId: cId, clearMessages = true }) => {
    // Use AuthContext for session
    auth.login({ founderId: fId, sessionId: sId });

    setConversationId(cId || null);
    setWelcomeMessage(wMsg);
    setCurrentStep(1);
    setStepName(STEP_NAMES[1]);
    // Only clear messages if explicitly requested (default true for backward compatibility)
    if (clearMessages) {
      setMessages([]);
    }
  }, [auth]);

  // Generate unique ID for messages
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  // Add message to chat
  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, { ...message, id: message.id || generateUniqueId() }]);
  }, []);

  // Update step
  const updateStep = useCallback((step) => {
    setCurrentStep(step);
    setStepName(STEP_NAMES[step] || '');
  }, []);

  // Load conversation from backend
  const loadConversation = useCallback(async (conversation) => {
    console.log('[MarneeContext] Loading conversation:', conversation.id);
    console.log('[MarneeContext] Conversation has', conversation.messages?.length || 0, 'messages');

    setConversationId(conversation.id);
    // Update auth context
    auth.login({
      founderId: conversation.founderId,
      sessionId: conversation.sessionId,
    });

    // Convert backend messages to UI format
    const uiMessages = conversation.messages.map((msg) => ({
      id: msg.id,
      from: msg.role === 'assistant' ? 'ai' : 'user',
      text: msg.content,
      step: msg.step || currentStep,
      stepName: msg.stepName || null,
      primaryAction: msg.primaryAction || null,
      uiActions: msg.uiActions || [],
      needsApproval: false,
    }));

    console.log('[MarneeContext] Converted', uiMessages.length, 'messages to UI format');

    // CRITICAL: Only update messages if we actually have messages to load
    // This prevents accidentally clearing messages if the API returns empty
    if (uiMessages.length > 0) {
      setMessages(uiMessages);
      console.log('[MarneeContext] Messages updated successfully');
    } else {
      console.warn('[MarneeContext] WARNING: Conversation has no messages, keeping existing messages');
    }
  }, [auth, currentStep]);

  // Clear Marnee-specific data (called when logout event is received)
  const clearMarneeData = useCallback(() => {
    console.log('[MarneeContext] Clearing Marnee data');

    // Clear app-specific storage
    storage.removeMultiple([
      STORAGE_KEYS.CALENDAR_ID,
      STORAGE_KEYS.CONVERSATION_ID,
      STORAGE_KEYS.MESSAGES_BACKUP,
      STORAGE_KEYS.CALENDAR_BACKUP,
    ]);

    setCalendarId(null);
    setConversationId(null);
    setCurrentStep(1);
    setStepName(STEP_NAMES[1]);
    setMessages([]);
    setWelcomeMessage(null);
    setCalendar(null);
  }, []);

  // Full session clear (triggers logout)
  const clearSession = useCallback(() => {
    console.log('[MarneeContext] Clearing session and triggering logout');
    clearMarneeData();
    auth.logout();
  }, [auth, clearMarneeData]);

  // Listen for logout events - only clear Marnee data, don't call logout again
  useEffect(() => {
    const handleLogout = () => {
      clearMarneeData();
    };
    window.addEventListener('app-logout', handleLogout);
    return () => window.removeEventListener('app-logout', handleLogout);
  }, [clearMarneeData]);

  // Get messages in API format
  const getMessagesForApi = useCallback(() => {
    return messages.map((m) => ({
      role: m.from === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }));
  }, [messages]);

  // Brainstorming notification methods
  const showBrainstormingNotification = useCallback((count) => {
    // Clear any existing timeout to prevent memory leaks
    if (brainstormingTimeoutRef.current) {
      clearTimeout(brainstormingTimeoutRef.current);
    }
    setBrainstormingNotification({ show: true, count });
    // Auto-dismiss after 5 seconds
    brainstormingTimeoutRef.current = setTimeout(() => {
      setBrainstormingNotification({ show: false, count: 0 });
    }, 5000);
  }, []);

  const hideBrainstormingNotification = useCallback(() => {
    if (brainstormingTimeoutRef.current) {
      clearTimeout(brainstormingTimeoutRef.current);
      brainstormingTimeoutRef.current = null;
    }
    setBrainstormingNotification({ show: false, count: 0 });
  }, []);

  // Script notification methods
  const showScriptNotification = useCallback((title) => {
    // Clear any existing timeout to prevent memory leaks
    if (scriptTimeoutRef.current) {
      clearTimeout(scriptTimeoutRef.current);
    }
    setScriptNotification({ show: true, title });
    // Auto-dismiss after 5 seconds
    scriptTimeoutRef.current = setTimeout(() => {
      setScriptNotification({ show: false, title: null });
    }, 5000);
  }, []);

  const hideScriptNotification = useCallback(() => {
    if (scriptTimeoutRef.current) {
      clearTimeout(scriptTimeoutRef.current);
      scriptTimeoutRef.current = null;
    }
    setScriptNotification({ show: false, title: null });
  }, []);

  // Cleanup notification timeouts on unmount
  useEffect(() => {
    return () => {
      if (brainstormingTimeoutRef.current) {
        clearTimeout(brainstormingTimeoutRef.current);
      }
      if (scriptTimeoutRef.current) {
        clearTimeout(scriptTimeoutRef.current);
      }
    };
  }, []);

  // Send chat message - persists across navigation
  const sendChatMessage = useCallback(async ({
    userMessage,
    messagesHistory,
    onSuccess,
    onError,
  }) => {
    if (chatIsLoading || !userMessage?.trim()) return null;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setChatIsLoading(true);
    setPendingUserMessage(userMessage);

    try {
      console.log('[MarneeContext] Sending chat message...');

      const response = await api.sendMessage({
        founderId: auth.founderId,
        sessionId: auth.sessionId,
        conversationId,
        message: userMessage,
        messages: messagesHistory,
      });

      console.log('[MarneeContext] Response received:', response);

      // Success callback
      if (onSuccess) {
        onSuccess(response);
      }

      setChatIsLoading(false);
      setPendingUserMessage(null);

      return response;
    } catch (error) {
      // Don't report aborted requests as errors
      if (error.name === 'AbortError') {
        console.log('[MarneeContext] Request aborted');
        return null;
      }

      console.error('[MarneeContext] Chat error:', error);

      if (onError) {
        onError(error);
      }

      setChatIsLoading(false);
      setPendingUserMessage(null);

      throw error;
    }
  }, [auth.founderId, auth.sessionId, conversationId, chatIsLoading]);

  // Cancel pending chat request
  const cancelChatRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setChatIsLoading(false);
    setPendingUserMessage(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    // Session (delegated to AuthContext, kept for backward compatibility)
    founderId: auth.founderId,
    setFounderId: auth.setFounderId,
    sessionId: auth.sessionId,
    setSessionId: auth.setSessionId,
    hasSession: auth.hasSession,

    // App state
    conversationId,
    calendarId,
    calendar,
    currentStep,
    stepName,

    // Messages (legacy support - should use useChat hook instead)
    messages,
    welcomeMessage,

    // Brainstorming notifications
    brainstormingNotification,
    showBrainstormingNotification,
    hideBrainstormingNotification,

    // Script notifications
    scriptNotification,
    showScriptNotification,
    hideScriptNotification,

    // Chat state (persists across navigation)
    chatIsLoading,
    pendingUserMessage,
    sendChatMessage,
    cancelChatRequest,

    // Methods
    initSession,
    addMessage,
    setMessages,
    updateStep,
    setCalendarId,
    setCalendar,
    setConversationId,
    loadConversation,
    clearSession,
    getMessagesForApi,
  }), [
    auth.founderId, auth.setFounderId, auth.sessionId, auth.setSessionId, auth.hasSession,
    conversationId, calendarId, calendar, currentStep, stepName,
    messages, welcomeMessage,
    brainstormingNotification, showBrainstormingNotification, hideBrainstormingNotification,
    scriptNotification, showScriptNotification, hideScriptNotification,
    chatIsLoading, pendingUserMessage, sendChatMessage, cancelChatRequest,
    initSession, addMessage, updateStep, loadConversation, clearSession, getMessagesForApi,
  ]);

  return (
    <MarneeContext.Provider value={value}>
      {children}
    </MarneeContext.Provider>
  );
}

export function useMarnee() {
  const context = useContext(MarneeContext);
  if (!context) {
    throw new Error('useMarnee must be used within a MarneeProvider');
  }
  return context;
}
