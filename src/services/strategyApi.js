/**
 * Strategy API Service
 * All strategy-related API endpoints
 */
import API from '../config';

const AUTH_STORAGE_KEY = 'marnee_auth';

/**
 * Helper to get auth header from localStorage
 */
function getAuthHeader() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};
    const session = JSON.parse(raw);
    if (!session || !session.token) return {};
    const type = session.type || 'Bearer';
    return { Authorization: `${type} ${session.token}` };
  } catch (error) {
    return {};
  }
}

/**
 * Helper to make API requests with proper error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API.MARNEE}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// =====================
// STRATEGY ENDPOINTS
// =====================

/**
 * GET /api/v1/founder/{founderId}/strategy - Get strategy by founder ID
 * Auto-generates if doesn't exist
 */
export const getStrategyByFounder = (founderId) =>
  request(`/api/v1/founder/${founderId}/strategy`);

/**
 * POST /api/v1/strategy/generate - Generate/regenerate complete strategy
 */
export const generateStrategy = ({ founderId, sessionId }) =>
  request('/api/v1/strategy/generate', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      sessionId,
    }),
  });

/**
 * POST /api/v1/strategy/regenerate-section - Regenerate specific section
 * Sections: pillars, video_ideas, calendar, goals
 */
export const regenerateStrategySection = ({ founderId, section }) =>
  request('/api/v1/strategy/regenerate-section', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      section,
    }),
  });

/**
 * PUT /api/v1/founder/{founderId}/strategy - Update strategy manually
 */
export const updateStrategy = (founderId, data) =>
  request(`/api/v1/founder/${founderId}/strategy`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

const strategyApi = {
  getStrategyByFounder,
  generateStrategy,
  regenerateStrategySection,
  updateStrategy,
};

export default strategyApi;
