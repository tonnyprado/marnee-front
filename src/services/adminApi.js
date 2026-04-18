import API from '../config';
import { getAuthHeader } from './api';

/**
 * Admin API Service
 *
 * All endpoints require ADMIN role.
 * Uses auth backend for user/subscription/SEO management.
 * Uses AI backend for analytics and metrics.
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

  return response.json();
};

const aiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API.MARNEE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// ==================== USER MANAGEMENT ====================

export const getUsers = async (page = 0, size = 20) => {
  return authRequest(`/admin/users?page=${page}&size=${size}`);
};

export const getUserById = async (id) => {
  return authRequest(`/admin/users/${id}`);
};

export const searchUsers = async (query) => {
  return authRequest(`/admin/users/search?query=${encodeURIComponent(query)}`);
};

export const updateUser = async (id, data) => {
  return authRequest(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const updateUserRole = async (id, role) => {
  return authRequest(`/admin/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
};

export const changeUserPassword = async (id, newPassword) => {
  return authRequest(`/admin/users/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify({ newPassword }),
  });
};

export const deleteUser = async (id) => {
  return authRequest(`/admin/users/${id}`, {
    method: 'DELETE',
  });
};

// ==================== SUBSCRIPTION MANAGEMENT ====================

export const getSubscriptionPlans = async () => {
  return authRequest('/admin/subscriptions/plans');
};

export const createSubscriptionPlan = async (data) => {
  return authRequest('/admin/subscriptions/plans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateSubscriptionPlan = async (id, data) => {
  return authRequest(`/admin/subscriptions/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getUserSubscriptions = async () => {
  return authRequest('/admin/subscriptions/users');
};

export const getUserSubscription = async (userId) => {
  return authRequest(`/admin/subscriptions/users/${userId}`);
};

export const assignSubscription = async (userId, data) => {
  return authRequest(`/admin/subscriptions/users/${userId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ==================== SEO MANAGEMENT ====================

export const getSeoSettings = async () => {
  return authRequest('/admin/seo');
};

export const getSeoByPath = async (path) => {
  return authRequest(`/admin/seo/page?path=${encodeURIComponent(path)}`);
};

export const createSeoSettings = async (data) => {
  return authRequest('/admin/seo', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateSeoSettings = async (id, data) => {
  return authRequest(`/admin/seo/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteSeoSettings = async (id) => {
  return authRequest(`/admin/seo/${id}`, {
    method: 'DELETE',
  });
};

// ==================== DASHBOARD & STATS ====================

export const getDashboardStats = async () => {
  return authRequest('/admin/dashboard/stats');
};

export const getAuditLogs = async (page = 0, size = 50) => {
  return authRequest(`/admin/audit-logs?page=${page}&size=${size}`);
};

// ==================== ANALYTICS (AI Backend) ====================

export const getAnalyticsOverview = async (days = 30) => {
  return aiRequest(`/admin/analytics/overview?days=${days}`);
};

export const getUserAnalytics = async (days = 30) => {
  return aiRequest(`/admin/analytics/users?days=${days}`);
};

export const getContentAnalytics = async (days = 30) => {
  return aiRequest(`/admin/analytics/content?days=${days}`);
};

export const getDailySummaries = async (days = 30) => {
  return aiRequest(`/admin/analytics/daily?days=${days}`);
};

export const getAllCalendars = async (limit = 100, offset = 0) => {
  return aiRequest(`/admin/calendars?limit=${limit}&offset=${offset}`);
};

export const getAllFounders = async (limit = 100, offset = 0) => {
  return aiRequest(`/admin/founders?limit=${limit}&offset=${offset}`);
};

export const getUserActivity = async (userId) => {
  return aiRequest(`/admin/users/${userId}/activity`);
};

export const getUserCalendars = async (userId) => {
  return aiRequest(`/admin/users/${userId}/calendars`);
};

export const getUserConversations = async (userId) => {
  return aiRequest(`/admin/users/${userId}/conversations`);
};

const adminApiService = {
  // Users
  getUsers,
  getUserById,
  searchUsers,
  updateUser,
  updateUserRole,
  changeUserPassword,
  deleteUser,

  // Subscriptions
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  getUserSubscriptions,
  getUserSubscription,
  assignSubscription,

  // SEO
  getSeoSettings,
  getSeoByPath,
  createSeoSettings,
  updateSeoSettings,
  deleteSeoSettings,

  // Dashboard
  getDashboardStats,
  getAuditLogs,

  // Analytics
  getAnalyticsOverview,
  getUserAnalytics,
  getContentAnalytics,
  getDailySummaries,
  getAllCalendars,
  getAllFounders,
  getUserActivity,
  getUserCalendars,
  getUserConversations,
};

export default adminApiService;
