import API from '../config';
import { getAuthHeader } from './api';

/**
 * Admin Security API Service
 *
 * Handles all security-related admin endpoints:
 * - Security dashboard stats
 * - Audit logs
 * - Active sessions management
 * - Security alerts
 * - User security details
 */

const authRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API.AUTH}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // For CSV export, return response directly
  if (endpoint.includes('/export')) {
    return response;
  }

  return response.json();
};

// ==================== SECURITY DASHBOARD ====================

export const getSecurityDashboardStats = async () => {
  return authRequest('/api/v1/admin/security/dashboard');
};

export const getLoginStats = async (days = 7) => {
  return authRequest(`/api/v1/admin/security/login-stats?days=${days}`);
};

export const getSecurityAlerts = async () => {
  return authRequest('/api/v1/admin/security/alerts');
};

// ==================== AUDIT LOGS ====================

export const getAuditLogs = async (params = {}) => {
  const {
    userId,
    action,
    ipAddress,
    startDate,
    endDate,
    success,
    page = 0,
    size = 50
  } = params;

  const queryParams = new URLSearchParams({ page, size });

  if (userId) queryParams.append('userId', userId);
  if (action) queryParams.append('action', action);
  if (ipAddress) queryParams.append('ipAddress', ipAddress);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (success !== undefined) queryParams.append('success', success);

  return authRequest(`/api/v1/admin/audit-logs?${queryParams}`);
};

export const exportAuditLogs = async (params = {}) => {
  const {
    userId,
    action,
    ipAddress,
    startDate,
    endDate,
    success
  } = params;

  const queryParams = new URLSearchParams();

  if (userId) queryParams.append('userId', userId);
  if (action) queryParams.append('action', action);
  if (ipAddress) queryParams.append('ipAddress', ipAddress);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (success !== undefined) queryParams.append('success', success);

  const response = await authRequest(`/api/v1/admin/audit-logs/export?${queryParams}`);

  // Download the CSV file
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// ==================== SESSIONS ====================

export const getAllActiveSessions = async (userId = null, page = 0, size = 50) => {
  const queryParams = new URLSearchParams({ page, size });
  if (userId) queryParams.append('userId', userId);

  return authRequest(`/api/v1/admin/sessions/active?${queryParams}`);
};

export const revokeSession = async (sessionId) => {
  return authRequest(`/api/v1/admin/sessions/${sessionId}`, {
    method: 'DELETE',
  });
};

export const revokeAllUserSessions = async (userId) => {
  return authRequest(`/api/v1/admin/sessions/user/${userId}/revoke-all`, {
    method: 'DELETE',
  });
};

// ==================== USER SECURITY ====================

export const getUserSecurityDetails = async (userId) => {
  return authRequest(`/api/v1/admin/users/${userId}/security`);
};

export const forceVerifyEmail = async (userId) => {
  return authRequest(`/api/v1/admin/users/${userId}/force-verify`, {
    method: 'POST',
  });
};

export const getUserAuditLogs = async (userId, page = 0, size = 20) => {
  return authRequest(`/api/v1/admin/users/${userId}/audit-logs?page=${page}&size=${size}`);
};

export const getUserSessions = async (userId, page = 0, size = 20) => {
  return authRequest(`/api/v1/admin/users/${userId}/sessions?page=${page}&size=${size}`);
};
