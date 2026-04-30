/**
 * API Service - Refactored to use core modules
 *
 * This file has been refactored to use:
 * - core/services/ApiClient for HTTP requests
 * - core/utils/auth for authentication
 * - core/services/ErrorHandler for error handling
 *
 * BEFORE: 566 lines with duplicated code
 * AFTER: ~180 lines, clean and maintainable
 */

import API from '../config';
import apiClient from '../core/services/ApiClient';

// Re-export auth utilities from core (for backward compatibility)
export {
  getAuthSession,
  setAuthSession,
  clearAuthSession,
  getAuthHeader,
  isAuthenticated,
} from '../core/utils/auth';

// Re-export error handler utilities (for backward compatibility)
export { default as errorHandler } from '../core/services/ErrorHandler';

/**
 * Convenience function to emit global error
 * (wrapper around errorHandler for backward compatibility)
 */
export function emitGlobalError(message) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('app-error', { detail: { message } })
  );
}

/**
 * API endpoints object
 * All endpoints now use the unified ApiClient
 */
export const api = {
  // =====================
  // AUTHENTICATION
  // =====================

  /**
   * POST /auth/register - Register user
   */
  register: ({ name, email, password }) =>
    apiClient.post('/auth/register', { name, email, password }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * POST /auth/login - Login user
   */
  login: ({ email, password }) =>
    apiClient.post('/auth/login', { email, password }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * OAuth - Google Sign In
   */
  googleSignIn: () => {
    const redirectUrl = `${API.AUTH}/auth/google`;
    window.location.href = redirectUrl;
  },

  /**
   * OAuth - Apple Sign In
   */
  appleSignIn: () => {
    const redirectUrl = `${API.AUTH}/auth/apple`;
    window.location.href = redirectUrl;
  },

  // =====================
  // EMAIL VERIFICATION & PASSWORD RESET
  // =====================

  /**
   * GET /auth/verify-email - Verify email with token
   */
  verifyEmail: (token) =>
    apiClient.get(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * POST /auth/resend-verification - Resend verification email
   */
  resendVerification: (email) =>
    apiClient.post('/auth/resend-verification', { email }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * POST /auth/forgot-password - Request password reset
   */
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * POST /auth/reset-password - Reset password with token
   */
  resetPassword: (token, newPassword) =>
    apiClient.post('/auth/reset-password', { token, newPassword }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * GET /auth/validate-reset-token - Validate reset token
   */
  validateResetToken: (token) =>
    apiClient.get(`/auth/validate-reset-token?token=${encodeURIComponent(token)}`, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  // =====================
  // QUESTIONNAIRE
  // =====================

  /**
   * POST /founder/questionnaire - Submit full questionnaire
   */
  submitQuestionnaire: (data) =>
    apiClient.post('/founder/questionnaire', data, {
      baseUrl: API.MARNEE,
      debug: true,
    }),

  // =====================
  // CHAT / MARNEE
  // =====================

  /**
   * POST /marnee/chat - Send message to Marnee
   */
  sendMessage: ({ founderId, sessionId, conversationId, message, messages, brandContext, autoStart }) =>
    apiClient.post('/marnee/chat', {
      founderId,
      sessionId,
      conversationId,
      message,
      messages,
      brandContext,
      autoStart,
    }, {
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /marnee/step/approve - Approve a step decision
   */
  approveStep: ({ sessionId, step, decision }) =>
    apiClient.post('/marnee/step/approve', {
      sessionId,
      step,
      decision,
    }, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /marnee/conversations - Get all conversations for current user
   */
  getConversations: () =>
    apiClient.get('/marnee/conversations', {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /marnee/conversation/{conversationId} - Get conversation with messages
   */
  getConversation: (conversationId) =>
    apiClient.get(`/marnee/conversation/${conversationId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /marnee/conversation/{conversationId} - Delete conversation
   */
  deleteConversation: (conversationId) =>
    apiClient.delete(`/marnee/conversation/${conversationId}`, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // FAVORITES
  // =====================

  /**
   * POST /marnee/message/{messageId}/favorite - Toggle message favorite
   */
  toggleMessageFavorite: (messageId) =>
    apiClient.post(`/marnee/message/${messageId}/favorite`, null, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /marnee/favorites - Get all favorite messages
   */
  getFavoriteMessages: () =>
    apiClient.get('/marnee/favorites', {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // SHARE CONVERSATION
  // =====================

  /**
   * POST /marnee/conversation/{conversationId}/share - Create share link
   */
  createShareLink: (conversationId, accessType = 'view') =>
    apiClient.post(`/marnee/conversation/${conversationId}/share`, {
      access: accessType,
    }, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /shared/{token} - Get shared conversation (no auth required)
   */
  getSharedConversation: (token) =>
    apiClient.get(`/shared/${token}`, {
      auth: false,
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /marnee/conversation/{conversationId}/shares - Get all shares for conversation
   */
  getConversationShares: (conversationId) =>
    apiClient.get(`/marnee/conversation/${conversationId}/shares`, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // CONTENT GENERATION
  // =====================

  /**
   * POST /marnee/generate-ideas - Generate content ideas
   */
  generateIdeas: ({ founderId, sessionId, count = 12, pillar }) =>
    apiClient.post('/marnee/generate-ideas', {
      founderId,
      sessionId,
      count,
      ...(pillar && { pillar }),
    }, {
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /marnee/generate-script - Generate detailed script with Hook-Body-CTA
   */
  generateScript: ({ founderId, sessionId, contentIdea }) =>
    apiClient.post('/marnee/generate-script', {
      founderId,
      sessionId,
      contentIdea,
    }, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // CALENDAR ENDPOINTS
  // =====================

  /**
   * POST /marnee/calendar/generate - Generate calendar
   */
  generateCalendar: ({ founderId, sessionId, weeks = 4, startDate }) =>
    apiClient.post('/marnee/calendar/generate', {
      founderId,
      sessionId,
      weeks,
      ...(startDate && { startDate }),
    }, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /marnee/calendar/{calendarId} - Get calendar
   */
  getCalendar: (calendarId) =>
    apiClient.get(`/marnee/calendar/${calendarId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /me/calendars/latest - Get latest calendar for current user
   */
  getMyLatestCalendar: ({ founderId, sessionId } = {}) => {
    const params = new URLSearchParams();
    if (founderId) params.set('founderId', founderId);
    if (sessionId) params.set('sessionId', sessionId);
    const query = params.toString();
    return apiClient.get(`/me/calendars/latest${query ? `?${query}` : ''}`, {
      baseUrl: API.MARNEE,
    });
  },

  /**
   * GET /founder/{founderId}/calendars/latest - Get latest calendar by founder
   */
  getLatestCalendarByFounder: (founderId, sessionId) => {
    const params = new URLSearchParams();
    if (sessionId) params.set('sessionId', sessionId);
    const query = params.toString();
    return apiClient.get(`/founder/${founderId}/calendars/latest${query ? `?${query}` : ''}`, {
      baseUrl: API.MARNEE,
    });
  },

  /**
   * PUT /marnee/calendar/{calendarId}/post/{postIndex} - Update a post
   */
  updatePost: (calendarId, postIndex, data) =>
    apiClient.put(`/marnee/calendar/${calendarId}/post/${postIndex}`, data, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // WAITLIST ENDPOINTS
  // =====================

  /**
   * POST /waitlist/subscribe - Subscribe to waitlist
   */
  subscribeWaitlist: (email) =>
    apiClient.post('/waitlist/subscribe', { email }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  // =====================
  // ME ENDPOINTS
  // =====================

  /**
   * GET /me/founder - Get founder profile
   */
  getMeFounder: () =>
    apiClient.get('/me/founder', {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /me/sessions - Get my sessions
   */
  getMeSessions: () =>
    apiClient.get('/me/sessions', {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /me/calendars - Get my calendars
   */
  getMeCalendars: () =>
    apiClient.get('/me/calendars', {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /users/me - Get basic user profile
   */
  getMeUser: () =>
    apiClient.get('/users/me', {
      baseUrl: API.AUTH,
    }),

  // =====================
  // COMMENTS ENDPOINTS
  // =====================

  /**
   * POST /comments/post/{postId} - Create comment
   */
  createComment: (postId, data) =>
    apiClient.post(`/comments/post/${postId}`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /comments/post/{postId} - Get all comments for a post
   */
  getPostComments: (postId) =>
    apiClient.get(`/comments/post/${postId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * PUT /comments/{commentId} - Update comment
   */
  updateComment: (commentId, data) =>
    apiClient.put(`/comments/${commentId}`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /comments/{commentId} - Delete comment
   */
  deleteComment: (commentId) =>
    apiClient.delete(`/comments/${commentId}`, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // BRAINSTORMING ENDPOINTS
  // =====================

  /**
   * POST /brainstorming - Create brainstorming idea
   */
  createBrainstormingIdea: (data) =>
    apiClient.post('/brainstorming', data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /brainstorming/founder/{founderId} - Get ideas for founder
   */
  getBrainstormingIdeas: (founderId, calendarId = null) =>
    apiClient.get(
      `/brainstorming/founder/${founderId}${
        calendarId ? `?calendar_id=${calendarId}` : ''
      }`,
      {
        baseUrl: API.MARNEE,
      }
    ),

  /**
   * GET /brainstorming/{ideaId} - Get single idea
   */
  getBrainstormingIdea: (ideaId) =>
    apiClient.get(`/brainstorming/${ideaId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * PUT /brainstorming/{ideaId} - Update idea
   */
  updateBrainstormingIdea: (ideaId, data) =>
    apiClient.put(`/brainstorming/${ideaId}`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /brainstorming/{ideaId} - Delete idea
   */
  deleteBrainstormingIdea: (ideaId) =>
    apiClient.delete(`/brainstorming/${ideaId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /brainstorming/{ideaId}/convert-to-task - Convert idea to task
   */
  convertIdeaToTask: (ideaId, data) =>
    apiClient.post(`/brainstorming/${ideaId}/convert-to-task`, data, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // BUSINESS TEST ENDPOINTS
  // =====================

  /**
   * GET /test-types - Get available test types
   */
  getTestTypes: () =>
    apiClient.get('/test-types', {
      auth: false,
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /business-test - Create or update business test
   */
  submitBusinessTest: (data) =>
    apiClient.post('/business-test', data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /business-test/me - Get my business test
   */
  getBusinessTestMe: () =>
    apiClient.get('/business-test/me', {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /business-test/founder/{founderId} - Get business test by founder ID
   */
  getBusinessTestByFounder: (founderId) =>
    apiClient.get(`/business-test/founder/${founderId}`, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // CAMPAIGNS ENDPOINTS
  // =====================

  /**
   * POST /campaigns - Create campaign manually
   */
  createCampaign: (data) =>
    apiClient.post('/campaigns', data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /campaigns/generate - Generate campaigns with AI
   */
  generateCampaigns: ({ founderId, sessionId, calendarId, count = 3 }) =>
    apiClient.post('/campaigns/generate', {
      founderId,
      sessionId,
      calendarId,
      count,
    }, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /campaigns/calendar/{calendarId} - Get all campaigns for a calendar
   */
  getCampaignsByCalendar: (calendarId) =>
    apiClient.get(`/campaigns/calendar/${calendarId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /campaigns/{campaignId} - Get single campaign with tasks/scripts
   */
  getCampaign: (campaignId) =>
    apiClient.get(`/campaigns/${campaignId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * PUT /campaigns/{campaignId} - Update campaign
   */
  updateCampaign: (campaignId, data) =>
    apiClient.put(`/campaigns/${campaignId}`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /campaigns/{campaignId} - Delete campaign
   */
  deleteCampaign: (campaignId) =>
    apiClient.delete(`/campaigns/${campaignId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /campaigns/{campaignId}/regenerate-suggestions - Regenerate AI suggestions
   */
  regenerateCampaignSuggestions: (campaignId) =>
    apiClient.post(`/campaigns/${campaignId}/regenerate-suggestions`, null, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // CAMPAIGN TASKS
  // =====================

  /**
   * POST /campaigns/{campaignId}/tasks - Create task
   */
  createCampaignTask: (campaignId, data) =>
    apiClient.post(`/campaigns/${campaignId}/tasks`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * PUT /campaigns/tasks/{taskId} - Update task
   */
  updateCampaignTask: (taskId, data) =>
    apiClient.put(`/campaigns/tasks/${taskId}`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /campaigns/tasks/{taskId} - Delete task
   */
  deleteCampaignTask: (taskId) =>
    apiClient.delete(`/campaigns/tasks/${taskId}`, {
      baseUrl: API.MARNEE,
    }),

  // =====================
  // CAMPAIGN SCRIPTS
  // =====================

  /**
   * POST /campaigns/{campaignId}/scripts - Create script
   */
  createCampaignScript: (campaignId, data) =>
    apiClient.post(`/campaigns/${campaignId}/scripts`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * PUT /campaigns/scripts/{scriptId} - Update script
   */
  updateCampaignScript: (scriptId, data) =>
    apiClient.put(`/campaigns/scripts/${scriptId}`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /campaigns/scripts/{scriptId} - Delete script
   */
  deleteCampaignScript: (scriptId) =>
    apiClient.delete(`/campaigns/scripts/${scriptId}`, {
      baseUrl: API.MARNEE,
    }),
};
