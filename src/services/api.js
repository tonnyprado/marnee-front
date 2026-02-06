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
    throw new Error(message);
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

  // POST /founder/questionnaire - Submit full questionnaire
  submitQuestionnaire: (data) =>
    request('/founder/questionnaire', {
      method: 'POST',
      body: JSON.stringify(data),
      debug: true,
    }),

  // POST /marnee/chat - Send message to Marnee
  sendMessage: ({ founderId, sessionId, message, messages, brandContext }) =>
    request('/marnee/chat', {
      method: 'POST',
      body: JSON.stringify({
        founderId,
        sessionId,
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
};
