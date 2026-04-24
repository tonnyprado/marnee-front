/**
 * Authentication Utilities
 *
 * Centralized authentication logic including:
 * - Session management (get/set/clear)
 * - JWT parsing and validation
 * - Auth header generation
 * - Token expiration checking
 *
 * This replaces duplicated auth logic across multiple service files.
 */

import storage from '../services/StorageService';
import logger from './logger';

const log = logger.createContextLogger('Auth');

/**
 * Storage key for authentication session
 */
export const AUTH_STORAGE_KEY = 'marnee_auth';

/**
 * Get authentication session from storage
 * @returns {Object|null} Session object or null
 */
export function getAuthSession() {
  try {
    const session = storage.getItem(AUTH_STORAGE_KEY, null);
    return session;
  } catch (error) {
    log.error('Failed to get auth session', error);
    return null;
  }
}

/**
 * Set authentication session in storage
 * @param {Object|null} session - Session object or null to clear
 */
export function setAuthSession(session) {
  try {
    if (!session) {
      storage.removeItem(AUTH_STORAGE_KEY);
      log.info('Auth session cleared');
      return;
    }

    storage.setItem(AUTH_STORAGE_KEY, session);
    log.info('Auth session saved');
  } catch (error) {
    log.error('Failed to set auth session', error);
  }
}

/**
 * Clear authentication session
 */
export function clearAuthSession() {
  setAuthSession(null);
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const session = getAuthSession();
  return !!(session && session.token);
}

/**
 * Safely decode JWT payload without verification
 * Note: This does NOT verify the signature. Only use for reading claims.
 *
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function decodeJWT(token) {
  if (!token || typeof token !== 'string') {
    log.warn('Invalid token provided to decodeJWT');
    return null;
  }

  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      log.warn('Invalid JWT format');
      return null;
    }

    // Decode base64 payload
    const payload = parts[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);

    return parsed;
  } catch (error) {
    log.error('Failed to decode JWT', error);
    return null;
  }
}

/**
 * Get user role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} User role or null
 */
export function getUserRole(token = null) {
  const session = token ? { token } : getAuthSession();

  if (!session || !session.token) {
    return null;
  }

  const payload = decodeJWT(session.token);
  return payload?.role || null;
}

/**
 * Check if user has specific role
 * @param {string} role - Role to check (e.g., 'ADMIN', 'ROLE_ADMIN')
 * @returns {boolean}
 */
export function hasRole(role) {
  const userRole = getUserRole();

  if (!userRole) {
    return false;
  }

  // Normalize roles for comparison
  const normalizedUserRole = userRole.toUpperCase().replace('ROLE_', '');
  const normalizedCheckRole = role.toUpperCase().replace('ROLE_', '');

  return normalizedUserRole === normalizedCheckRole;
}

/**
 * Check if user is admin
 * @returns {boolean}
 */
export function isAdmin() {
  return hasRole('ADMIN');
}

/**
 * Get JWT expiration timestamp
 * @param {string} token - JWT token
 * @returns {number|null} Unix timestamp (seconds) or null
 */
export function getTokenExpiration(token = null) {
  const session = token ? { token } : getAuthSession();

  if (!session || !session.token) {
    return null;
  }

  const payload = decodeJWT(session.token);
  return payload?.exp || null;
}

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export function isTokenExpired(token = null) {
  const exp = getTokenExpiration(token);

  if (!exp) {
    // If no expiration, consider it expired for safety
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const now = Math.floor(Date.now() / 1000);
  return now >= exp;
}

/**
 * Get authorization header for API requests
 * @returns {Object} Authorization header object or empty object
 */
export function getAuthHeader() {
  const session = getAuthSession();

  if (!session || !session.token) {
    return {};
  }

  // Check if token is expired
  if (isTokenExpired(session.token)) {
    log.warn('Token is expired');
    clearAuthSession();
    return {};
  }

  const type = session.type || 'Bearer';

  return {
    Authorization: `${type} ${session.token}`
  };
}

/**
 * Get user ID from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} User ID or null
 */
export function getUserId(token = null) {
  const session = token ? { token } : getAuthSession();

  if (!session || !session.token) {
    return null;
  }

  const payload = decodeJWT(session.token);
  return payload?.sub || payload?.userId || payload?.id || null;
}

/**
 * Get all user claims from JWT
 * @param {string} token - JWT token
 * @returns {Object|null} All claims or null
 */
export function getUserClaims(token = null) {
  const session = token ? { token } : getAuthSession();

  if (!session || !session.token) {
    return null;
  }

  return decodeJWT(session.token);
}

/**
 * Validate session structure
 * @param {Object} session - Session object to validate
 * @returns {boolean}
 */
export function isValidSession(session) {
  if (!session || typeof session !== 'object') {
    return false;
  }

  if (!session.token || typeof session.token !== 'string') {
    return false;
  }

  // Check if token is properly formatted JWT
  const parts = session.token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  return true;
}
