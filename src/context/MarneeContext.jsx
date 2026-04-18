import React, { createContext, useContext, useState, useEffect } from 'react';

const MarneeContext = createContext(null);

const STORAGE_KEYS = {
  FOUNDER_ID: 'marnee_founderId',
  SESSION_ID: 'marnee_sessionId',
  CALENDAR_ID: 'marnee_calendarId',
  CONVERSATION_ID: 'marnee_conversationId',
  MESSAGES_BACKUP: 'marnee_messages_backup', // NEW: Backup messages in localStorage
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
  const [founderId, setFounderId] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.FOUNDER_ID)
  );
  const [sessionId, setSessionId] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.SESSION_ID)
  );
  const [conversationId, setConversationId] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.CONVERSATION_ID)
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [stepName, setStepName] = useState(STEP_NAMES[1]);
  const [messages, setMessages] = useState(() => {
    // Try to load messages from localStorage backup on init
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.MESSAGES_BACKUP);
      if (backup) {
        const parsed = JSON.parse(backup);
        console.log('[MarneeContext] Restored', parsed.length, 'messages from localStorage backup');
        return parsed;
      }
    } catch (error) {
      console.error('[MarneeContext] Failed to restore messages from localStorage:', error);
    }
    return [];
  });
  const [welcomeMessage, setWelcomeMessage] = useState(null);
  const [calendarId, setCalendarId] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.CALENDAR_ID)
  );

  // Persist to localStorage
  useEffect(() => {
    if (founderId) {
      localStorage.setItem(STORAGE_KEYS.FOUNDER_ID, founderId);
    }
  }, [founderId]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (calendarId) {
      localStorage.setItem(STORAGE_KEYS.CALENDAR_ID, calendarId);
    }
  }, [calendarId]);

  useEffect(() => {
    if (conversationId) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATION_ID, conversationId);
    }
  }, [conversationId]);

  // NEW: Persist messages to localStorage as backup
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES_BACKUP, JSON.stringify(messages));
        console.log('[MarneeContext] Backed up', messages.length, 'messages to localStorage');
      } catch (error) {
        console.error('[MarneeContext] Failed to backup messages to localStorage:', error);
      }
    }
  }, [messages]);

  // Initialize session after questionnaire
  const initSession = ({ founderId: fId, sessionId: sId, welcomeMessage: wMsg, conversationId: cId, clearMessages = true }) => {
    setFounderId(fId);
    setSessionId(sId);
    setConversationId(cId || null);
    setWelcomeMessage(wMsg);
    setCurrentStep(1);
    setStepName(STEP_NAMES[1]);
    // Only clear messages if explicitly requested (default true for backward compatibility)
    if (clearMessages) {
      setMessages([]);
    }
  };

  // Generate unique ID for messages
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  // Add message to chat
  const addMessage = (message) => {
    setMessages((prev) => [...prev, { ...message, id: message.id || generateUniqueId() }]);
  };

  // Update step
  const updateStep = (step) => {
    setCurrentStep(step);
    setStepName(STEP_NAMES[step] || '');
  };

  // Load conversation from backend
  const loadConversation = async (conversation) => {
    console.log('[MarneeContext] Loading conversation:', conversation.id);
    console.log('[MarneeContext] Conversation has', conversation.messages?.length || 0, 'messages');

    setConversationId(conversation.id);
    setFounderId(conversation.founderId);
    setSessionId(conversation.sessionId);

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
  };

  // Clear session
  const clearSession = () => {
    console.log('[MarneeContext] Clearing session and all data');
    localStorage.removeItem(STORAGE_KEYS.FOUNDER_ID);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR_ID);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATION_ID);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES_BACKUP); // Also clear messages backup
    setFounderId(null);
    setSessionId(null);
    setCalendarId(null);
    setConversationId(null);
    setCurrentStep(1);
    setStepName(STEP_NAMES[1]);
    setMessages([]);
    setWelcomeMessage(null);
  };

  useEffect(() => {
    const handleLogout = () => {
      clearSession();
    };
    window.addEventListener('app-logout', handleLogout);
    return () => window.removeEventListener('app-logout', handleLogout);
  }, []);

  // Get messages in API format
  const getMessagesForApi = () => {
    return messages.map((m) => ({
      role: m.from === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }));
  };

  const value = {
    founderId,
    sessionId,
    conversationId,
    calendarId,
    currentStep,
    stepName,
    messages,
    welcomeMessage,
    initSession,
    addMessage,
    setMessages,
    updateStep,
    setCalendarId,
    setConversationId,
    loadConversation,
    clearSession,
    getMessagesForApi,
    hasSession: Boolean(founderId && sessionId),
  };

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
