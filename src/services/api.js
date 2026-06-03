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
  register: ({ name, email, password, fbEventId }) =>
    apiClient.post('/auth/register', { name, email, password, fbEventId }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * POST /auth/login - Login user
   */
  login: ({ email, password, fbEventId }) =>
    apiClient.post('/auth/login', { email, password, fbEventId }, {
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
   * GET /marnee/conversations - Get all conversations for current user (basic info only)
   */
  getConversations: () =>
    apiClient.get('/marnee/conversations', {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /marnee/conversations/with-messages - Get conversations WITH messages in one request
   * This is the optimized endpoint that avoids N+1 queries.
   * @param {number} limit - Max conversations to return (default 20, max 50)
   */
  getConversationsWithMessages: (limit = 20) =>
    apiClient.get(`/marnee/conversations/with-messages?limit=${limit}`, {
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
   * Uses longer timeout (90s) because AI generation can take time
   */
  generateCalendar: ({ founderId, sessionId, weeks = 4, startDate }) =>
    apiClient.post('/marnee/calendar/generate', {
      founderId,
      sessionId,
      weeks,
      ...(startDate && { startDate }),
    }, {
      baseUrl: API.MARNEE,
      timeout: 90000, // 90 seconds for AI generation
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

  /**
   * GET /calendar/suggest-time - Get Marnee's suggested posting time
   * Returns optimal time based on platform and date
   */
  getSuggestedPostingTime: (platform, date) =>
    apiClient.get(`/calendar/suggest-time?platform=${encodeURIComponent(platform)}&date=${date}`, {
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
   * GET /brainstorming/founder/{founderId} - Get ideas for founder with pagination
   * @param {string} founderId - The founder ID
   * @param {Object} options - Optional parameters
   * @param {string} options.calendarId - Optional calendar filter
   * @param {number} options.limit - Number of items per page (default 100, max 500)
   * @param {number} options.offset - Pagination offset
   */
  getBrainstormingIdeas: (founderId, { calendarId = null, limit = 100, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (calendarId) params.append('calendar_id', calendarId);
    if (limit !== 100) params.append('limit', limit);
    if (offset > 0) params.append('offset', offset);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/brainstorming/founder/${founderId}${queryString}`, {
      baseUrl: API.MARNEE,
    });
  },

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
  // SCRIPTS ENDPOINTS
  // =====================

  /**
   * POST /scripts - Create script manually
   */
  createScript: (data) =>
    apiClient.post('/scripts', data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /scripts/founder/{founderId} - Get scripts for founder with pagination
   * @param {string} founderId - The founder ID
   * @param {Object} options - Optional parameters
   * @param {string} options.status - Filter by status (draft, ready, used)
   * @param {number} options.limit - Number of items per page (default 100, max 500)
   * @param {number} options.offset - Pagination offset
   */
  getScripts: (founderId, { status = null, limit = 100, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit !== 100) params.append('limit', limit);
    if (offset > 0) params.append('offset', offset);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/scripts/founder/${founderId}${queryString}`, {
      baseUrl: API.MARNEE,
    });
  },

  /**
   * GET /scripts/founder/{founderId}/unlinked - Get scripts not linked to any post
   */
  getUnlinkedScripts: (founderId) =>
    apiClient.get(`/scripts/founder/${founderId}/unlinked`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /scripts/{scriptId} - Get single script
   */
  getScript: (scriptId) =>
    apiClient.get(`/scripts/${scriptId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * PUT /scripts/{scriptId} - Update script
   */
  updateScript: (scriptId, data) =>
    apiClient.put(`/scripts/${scriptId}`, data, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /scripts/{scriptId} - Delete script
   */
  deleteScript: (scriptId) =>
    apiClient.delete(`/scripts/${scriptId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /scripts/{scriptId}/link-post - Link script to calendar post
   */
  linkScriptToPost: (scriptId, postId) =>
    apiClient.post(`/scripts/${scriptId}/link-post`, { postId }, {
      baseUrl: API.MARNEE,
    }),

  /**
   * DELETE /scripts/{scriptId}/unlink-post - Unlink script from post
   */
  unlinkScriptFromPost: (scriptId) =>
    apiClient.delete(`/scripts/${scriptId}/unlink-post`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /scripts/post/{postId} - Get scripts for a specific post
   */
  getScriptsForPost: (postId) =>
    apiClient.get(`/scripts/post/${postId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * GET /scripts/calendar/{calendarId} - Get scripts for a calendar
   */
  getScriptsForCalendar: (calendarId) =>
    apiClient.get(`/scripts/calendar/${calendarId}`, {
      baseUrl: API.MARNEE,
    }),

  /**
   * POST /scripts/generate-from-post - Generate script from calendar post using AI
   */
  generateScriptFromPost: (postId, founderId) =>
    apiClient.post('/scripts/generate-from-post', { postId, founderId }, {
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
   * POST /business-test/process-brand-guidelines - Process brand guidelines file with AI
   * @param {File} file - The file to process (PDF, PNG, JPG)
   * @returns {Promise<{content: string, filename: string, contentType: string, processed: boolean}>}
   */
  processBrandGuidelines: async (file) => {
    const { getAuthHeader } = await import('../core/utils/auth');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API.MARNEE}/business-test/process-brand-guidelines`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  },

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
  // MARNEE BRAIN ENDPOINTS
  // =====================

  /**
   * GET /marnee/brain/topics - Get ML-extracted topics for Marnee Brain
   * Uses KeyBERT to extract keywords without OpenAI tokens
   */
  getBrainTopics: () =>
    apiClient.get('/marnee/brain/topics', {
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

  // =====================
  // WAITLIST
  // =====================

  /**
   * POST /waitlist - Submit email to waitlist (public endpoint, no auth)
   */
  submitWaitlist: (email) =>
    apiClient.post('/waitlist', { email }, {
      auth: false,
      baseUrl: API.AUTH,
    }),

  /**
   * GET /admin/waitlist - Get all waitlist emails (admin only)
   */
  getWaitlistEmails: (page = 0, size = 50) =>
    apiClient.get(`/admin/waitlist?page=${page}&size=${size}`, {
      baseUrl: API.AUTH,
    }),

  /**
   * DELETE /admin/waitlist/{id} - Delete waitlist entry (admin only)
   */
  deleteWaitlistEntry: (id) =>
    apiClient.delete(`/admin/waitlist/${id}`, {
      baseUrl: API.AUTH,
    }),

  /**
   * GET /admin/waitlist/export - Export waitlist as CSV (admin only)
   */
  exportWaitlist: () =>
    apiClient.get('/admin/waitlist/export', {
      baseUrl: API.AUTH,
      responseType: 'blob',
    }),
};
