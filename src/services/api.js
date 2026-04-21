import API from '../config';
const AUTH_STORAGE_KEY = 'marnee_auth';

export function getAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function setAuthSession(session) {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthHeader() {
  const session = getAuthSession();
  if (!session || !session.token) return {};
  const type = session.type || 'Bearer';
  return { Authorization: `${type} ${session.token}` };
}

export function emitGlobalError(message) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('app-error', { detail: { message } })
  );
}

function emitGlobalLogout() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('app-logout'));
}

function redirectToAuth() {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/auth') {
    window.location.href = '/auth';
  }
}

async function request(endpoint, options = {}) {
  const requiresAuth = options.auth !== false;
  const authHeader = requiresAuth ? getAuthHeader() : {};
  if (requiresAuth && !authHeader.Authorization) {
    const message = 'Sesión no válida. Inicia sesión de nuevo.';
    emitGlobalError(message);
    setAuthSession(null);
    emitGlobalLogout();
    redirectToAuth();
    throw new Error(message);
  }
  const baseUrl = options.baseUrl || API.MARNEE;
  const url = `${baseUrl}${endpoint}`;
  if (options.debug) {
    console.debug('[API] Request', {
      url,
      method: options.method || 'GET',
      body: options.body,
    });
  }
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const rawText = await response.text().catch(() => '');
    let error = {};
    if (rawText) {
      try {
        error = JSON.parse(rawText);
      } catch (parseError) {
        error = { message: rawText };
      }
    }
    const message = error.message || `HTTP ${response.status}`;
    if (options.debug) {
      console.error('[API] Error', {
        url,
        status: response.status,
        body: rawText,
      });
    }
    if (response.status === 401 || response.status === 403) {
      emitGlobalError(
        'Tu sesión expiró o no es válida. Vuelve a iniciar sesión.'
      );
      setAuthSession(null);
      emitGlobalLogout();
      redirectToAuth();
    }
    const requestError = new Error(message);
    requestError.status = response.status;
    requestError.body = error;
    throw requestError;
  }

  return response.json();
}

export const api = {
  // POST /auth/register - Register user
  register: ({ name, email, password }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      auth: false,
      baseUrl: API.AUTH,
    }),

  // POST /auth/login - Login user
  login: ({ email, password }) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
      baseUrl: API.AUTH,
    }),

  // OAuth - Google Sign In
  // Redirects to backend OAuth endpoint which handles Google authentication
  googleSignIn: () => {
    const redirectUrl = `${API.AUTH}/auth/google`;
    window.location.href = redirectUrl;
  },

  // OAuth - Apple Sign In
  // Redirects to backend OAuth endpoint which handles Apple authentication
  appleSignIn: () => {
    const redirectUrl = `${API.AUTH}/auth/apple`;
    window.location.href = redirectUrl;
  },

  // POST /founder/questionnaire - Submit full questionnaire
  submitQuestionnaire: (data) =>
    request('/founder/questionnaire', {
      method: 'POST',
      body: JSON.stringify(data),
      debug: true,
    }),

  // POST /marnee/chat - Send message to Marnee
  sendMessage: ({ founderId, sessionId, conversationId, message, messages, brandContext }) =>
    request('/marnee/chat', {
      method: 'POST',
      body: JSON.stringify({
        founderId,
        sessionId,
        conversationId,
        message,
        messages,
        brandContext,
      }),
    }),

  // POST /marnee/step/approve - Approve a step decision
  approveStep: ({ sessionId, step, decision }) =>
    request('/marnee/step/approve', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        step,
        decision,
      }),
    }),

  // GET /marnee/conversations - Get all conversations for current user
  getConversations: () =>
    request('/marnee/conversations'),

  // GET /marnee/conversation/{conversationId} - Get conversation with messages
  getConversation: (conversationId) =>
    request(`/marnee/conversation/${conversationId}`),

  // DELETE /marnee/conversation/{conversationId} - Delete conversation
  deleteConversation: (conversationId) =>
    request(`/marnee/conversation/${conversationId}`, {
      method: 'DELETE',
    }),

  // =====================
  // FAVORITES
  // =====================

  // POST /marnee/message/{messageId}/favorite - Toggle message favorite
  toggleMessageFavorite: (messageId) =>
    request(`/marnee/message/${messageId}/favorite`, {
      method: 'POST',
    }),

  // GET /marnee/favorites - Get all favorite messages
  getFavoriteMessages: () =>
    request('/marnee/favorites'),

  // =====================
  // SHARE CONVERSATION
  // =====================

  // POST /marnee/conversation/{conversationId}/share - Create share link
  createShareLink: (conversationId, accessType = 'view') =>
    request(`/marnee/conversation/${conversationId}/share`, {
      method: 'POST',
      body: JSON.stringify({ access: accessType }),
    }),

  // GET /shared/{token} - Get shared conversation (no auth required)
  getSharedConversation: (token) =>
    request(`/shared/${token}`, {
      auth: false,
    }),

  // GET /marnee/conversation/{conversationId}/shares - Get all shares for conversation
  getConversationShares: (conversationId) =>
    request(`/marnee/conversation/${conversationId}/shares`),

  // POST /marnee/generate-ideas - Generate content ideas
  generateIdeas: ({ founderId, sessionId, count = 12, pillar }) =>
    request('/marnee/generate-ideas', {
      method: 'POST',
      body: JSON.stringify({
        founderId,
        sessionId,
        count,
        ...(pillar && { pillar }),
      }),
    }),

  // POST /marnee/generate-script - Generate detailed script with Hook-Body-CTA
  generateScript: ({ founderId, sessionId, contentIdea }) =>
    request('/marnee/generate-script', {
      method: 'POST',
      body: JSON.stringify({
        founderId,
        sessionId,
        contentIdea,
      }),
    }),

  // =====================
  // CALENDAR ENDPOINTS
  // =====================

  // POST /marnee/calendar/generate - Generate calendar
  generateCalendar: ({ founderId, sessionId, weeks = 4, startDate }) =>
    request('/marnee/calendar/generate', {
      method: 'POST',
      body: JSON.stringify({
        founderId,
        sessionId,
        weeks,
        ...(startDate && { startDate }),
      }),
    }),

  // GET /marnee/calendar/{calendarId} - Get calendar
  getCalendar: (calendarId) =>
    request(`/marnee/calendar/${calendarId}`),

  // GET /me/calendars/latest - Get latest calendar for current user
  getMyLatestCalendar: ({ founderId, sessionId } = {}) => {
    const params = new URLSearchParams();
    if (founderId) params.set('founderId', founderId);
    if (sessionId) params.set('sessionId', sessionId);
    const query = params.toString();
    return request(`/me/calendars/latest${query ? `?${query}` : ''}`, {
      baseUrl: API.MARNEE,
    });
  },

  // GET /founder/{founderId}/calendars/latest - Get latest calendar by founder
  getLatestCalendarByFounder: (founderId, sessionId) => {
    const params = new URLSearchParams();
    if (sessionId) params.set('sessionId', sessionId);
    const query = params.toString();
    return request(`/founder/${founderId}/calendars/latest${query ? `?${query}` : ''}`, {
      baseUrl: API.MARNEE,
    });
  },

  // PUT /marnee/calendar/{calendarId}/post/{postIndex} - Update a post
  updatePost: (calendarId, postIndex, data) =>
    request(`/marnee/calendar/${calendarId}/post/${postIndex}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // =====================
  // WAITLIST ENDPOINTS
  // =====================

  // POST /waitlist/subscribe - Subscribe to waitlist
  subscribeWaitlist: (email) =>
    request('/waitlist/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
      auth: false,
      baseUrl: API.AUTH,
    }),

  // =====================
  // ME ENDPOINTS
  // =====================

  // GET /me/founder - Get founder profile
  getMeFounder: () => request('/me/founder', { baseUrl: API.MARNEE }),

  // GET /me/sessions - Get my sessions
  getMeSessions: () => request('/me/sessions', { baseUrl: API.MARNEE }),

  // GET /me/calendars - Get my calendars
  getMeCalendars: () => request('/me/calendars', { baseUrl: API.MARNEE }),

  // GET /users/me - Get basic user profile
  getMeUser: () => request('/users/me', { baseUrl: API.AUTH }),

  // =====================
  // COMMENTS ENDPOINTS
  // =====================

  // POST /comments/post/{postId} - Create comment
  createComment: (postId, data) =>
    request(`/comments/post/${postId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /comments/post/{postId} - Get all comments for a post
  getPostComments: (postId) =>
    request(`/comments/post/${postId}`),

  // PUT /comments/{commentId} - Update comment
  updateComment: (commentId, data) =>
    request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE /comments/{commentId} - Delete comment
  deleteComment: (commentId) =>
    request(`/comments/${commentId}`, {
      method: 'DELETE',
    }),

  // =====================
  // BRAINSTORMING ENDPOINTS
  // =====================

  // POST /brainstorming - Create brainstorming idea
  createBrainstormingIdea: (data) =>
    request('/brainstorming', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /brainstorming/founder/{founderId} - Get ideas for founder
  getBrainstormingIdeas: (founderId, calendarId = null) =>
    request(
      `/brainstorming/founder/${founderId}${
        calendarId ? `?calendar_id=${calendarId}` : ''
      }`
    ),

  // GET /brainstorming/{ideaId} - Get single idea
  getBrainstormingIdea: (ideaId) =>
    request(`/brainstorming/${ideaId}`),

  // PUT /brainstorming/{ideaId} - Update idea
  updateBrainstormingIdea: (ideaId, data) =>
    request(`/brainstorming/${ideaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE /brainstorming/{ideaId} - Delete idea
  deleteBrainstormingIdea: (ideaId) =>
    request(`/brainstorming/${ideaId}`, {
      method: 'DELETE',
    }),

  // POST /brainstorming/{ideaId}/convert-to-task - Convert idea to task
  convertIdeaToTask: (ideaId, data) =>
    request(`/brainstorming/${ideaId}/convert-to-task`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // =====================
  // BUSINESS TEST ENDPOINTS
  // =====================

  // GET /test-types - Get available test types
  getTestTypes: () =>
    request('/test-types', {
      auth: false,
    }),

  // POST /business-test - Create or update business test
  submitBusinessTest: (data) =>
    request('/business-test', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /business-test/me - Get my business test
  getBusinessTestMe: () =>
    request('/business-test/me'),

  // GET /business-test/founder/{founderId} - Get business test by founder ID
  getBusinessTestByFounder: (founderId) =>
    request(`/business-test/founder/${founderId}`),

  // =====================
  // CAMPAIGNS ENDPOINTS
  // =====================

  // POST /campaigns - Create campaign manually
  createCampaign: (data) =>
    request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // POST /campaigns/generate - Generate campaigns with AI
  generateCampaigns: ({ founderId, sessionId, calendarId, count = 3 }) =>
    request('/campaigns/generate', {
      method: 'POST',
      body: JSON.stringify({
        founderId,
        sessionId,
        calendarId,
        count,
      }),
    }),

  // GET /campaigns/calendar/{calendarId} - Get all campaigns for a calendar
  getCampaignsByCalendar: (calendarId) =>
    request(`/campaigns/calendar/${calendarId}`),

  // GET /campaigns/{campaignId} - Get single campaign with tasks/scripts
  getCampaign: (campaignId) =>
    request(`/campaigns/${campaignId}`),

  // PUT /campaigns/{campaignId} - Update campaign
  updateCampaign: (campaignId, data) =>
    request(`/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE /campaigns/{campaignId} - Delete campaign
  deleteCampaign: (campaignId) =>
    request(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    }),

  // POST /campaigns/{campaignId}/regenerate-suggestions - Regenerate AI suggestions
  regenerateCampaignSuggestions: (campaignId) =>
    request(`/campaigns/${campaignId}/regenerate-suggestions`, {
      method: 'POST',
    }),

  // =====================
  // CAMPAIGN TASKS
  // =====================

  // POST /campaigns/{campaignId}/tasks - Create task
  createCampaignTask: (campaignId, data) =>
    request(`/campaigns/${campaignId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // PUT /campaigns/tasks/{taskId} - Update task
  updateCampaignTask: (taskId, data) =>
    request(`/campaigns/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE /campaigns/tasks/{taskId} - Delete task
  deleteCampaignTask: (taskId) =>
    request(`/campaigns/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  // =====================
  // CAMPAIGN SCRIPTS
  // =====================

  // POST /campaigns/{campaignId}/scripts - Create script
  createCampaignScript: (campaignId, data) =>
    request(`/campaigns/${campaignId}/scripts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // PUT /campaigns/scripts/{scriptId} - Update script
  updateCampaignScript: (scriptId, data) =>
    request(`/campaigns/scripts/${scriptId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE /campaigns/scripts/{scriptId} - Delete script
  deleteCampaignScript: (scriptId) =>
    request(`/campaigns/scripts/${scriptId}`, {
      method: 'DELETE',
    }),
};
