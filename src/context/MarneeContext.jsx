import React, { createContext, useContext, useState, useEffect } from 'react';

const MarneeContext = createContext(null);

const STORAGE_KEYS = {
  FOUNDER_ID: 'marnee_founderId',
  SESSION_ID: 'marnee_sessionId',
  CALENDAR_ID: 'marnee_calendarId',
};

const STEP_NAMES = {
  1: 'involvement_level',
  2: 'core_niche',
  3: 'posting_cadence',
  4: 'content_pillars',
  5: 'calendar',
};

export function MarneeProvider({ children }) {
  const [founderId, setFounderId] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.FOUNDER_ID)
  );
  const [sessionId, setSessionId] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.SESSION_ID)
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [stepName, setStepName] = useState(STEP_NAMES[1]);
  const [messages, setMessages] = useState([]);
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

  // Initialize session after questionnaire
  const initSession = ({ founderId: fId, sessionId: sId, welcomeMessage: wMsg }) => {
    setFounderId(fId);
    setSessionId(sId);
    setWelcomeMessage(wMsg);
    setCurrentStep(1);
    setStepName(STEP_NAMES[1]);
    setMessages([]);
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

  // Clear session
  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.FOUNDER_ID);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR_ID);
    setFounderId(null);
    setSessionId(null);
    setCalendarId(null);
    setCurrentStep(1);
    setStepName(STEP_NAMES[1]);
    setMessages([]);
    setWelcomeMessage(null);
  };

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
