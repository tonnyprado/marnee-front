const API_BASE = 'http://127.0.0.1:8000/api/v1';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // POST /founder/questionnaire - Submit full questionnaire
  submitQuestionnaire: (data) =>
    request('/founder/questionnaire', {
      method: 'POST',
      body: JSON.stringify(data),
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
    }),
};
