/**
 * AuthContext - User Authentication and Session Management
 *
 * Responsibility: Only authentication and user session state
 * Extracted from MarneeContext to follow Single Responsibility Principle
 *
 * This context manages:
 * - User authentication state
 * - Session tokens (founderId, sessionId)
 * - Login/logout operations
 *
 * What it does NOT manage (delegated to other contexts/hooks):
 * - Chat messages (handled by useChat hook)
 * - Conversations (handled by useConversations hook)
 * - Calendar (handled by useCalendar hook or MarneeContext)
 * - App state/steps (handled by AppStateContext)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../core/services/StorageService';
import { isAuthenticated as checkIsAuthenticated, getAuthSession } from '../core/utils/auth';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  FOUNDER_ID: 'marnee_founderId',
  SESSION_ID: 'marnee_sessionId',
  AUTH_SESSION: 'authSession',
};

export function AuthProvider({ children }) {
  // Initialize from storage
  const [founderId, setFounderId] = useState(() =>
    storage.getItem(STORAGE_KEYS.FOUNDER_ID)
  );

  const [sessionId, setSessionId] = useState(() =>
    storage.getItem(STORAGE_KEYS.SESSION_ID)
  );

  const [user, setUser] = useState(() => {
    const authSession = getAuthSession();
    return authSession?.user || null;
  });

  // Persist to storage
  useEffect(() => {
    if (founderId) {
      storage.setItem(STORAGE_KEYS.FOUNDER_ID, founderId);
    }
  }, [founderId]);

  useEffect(() => {
    if (sessionId) {
      storage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    }
  }, [sessionId]);

  /**
   * Initialize or update user session
   * @param {Object} session - Session data
   * @param {string} session.founderId - Founder ID
   * @param {string} session.sessionId - Session ID
   * @param {Object} [session.user] - User object (optional)
   */
  const login = ({ founderId: fId, sessionId: sId, user: userData }) => {
    console.log('[AuthContext] Login:', { founderId: fId, sessionId: sId, hasUser: !!userData });

    setFounderId(fId);
    setSessionId(sId);

    if (userData) {
      setUser(userData);
    }
  };

  /**
   * Clear user session and authentication
   */
  const logout = () => {
    console.log('[AuthContext] Logout - clearing session');

    storage.removeMultiple([
      STORAGE_KEYS.FOUNDER_ID,
      STORAGE_KEYS.SESSION_ID,
      STORAGE_KEYS.AUTH_SESSION,
    ]);

    setFounderId(null);
    setSessionId(null);
    setUser(null);

    // Emit global logout event for other contexts
    window.dispatchEvent(new Event('app-logout'));
  };

  // Listen for logout events from other parts of the app
  useEffect(() => {
    const handleLogout = () => {
      setFounderId(null);
      setSessionId(null);
      setUser(null);
    };

    window.addEventListener('app-logout', handleLogout);
    return () => window.removeEventListener('app-logout', handleLogout);
  }, []);

  const value = {
    // State
    user,
    founderId,
    sessionId,
    isAuthenticated: checkIsAuthenticated(),
    hasSession: Boolean(founderId && sessionId),

    // Methods
    login,
    logout,
    setFounderId,
    setSessionId,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
