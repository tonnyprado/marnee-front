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
 * GET /founder/{founderId}/strategy - Get strategy by founder ID
 * Auto-generates if doesn't exist
 */
export const getStrategyByFounder = (founderId) =>
  request(`/founder/${founderId}/strategy`);

/**
 * POST /strategy/generate - Generate/regenerate complete strategy
 */
export const generateStrategy = ({ founderId, sessionId }) =>
  request('/strategy/generate', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      sessionId,
    }),
  });

/**
 * POST /strategy/regenerate-section - Regenerate specific section
 * Sections: pillars, video_ideas, calendar, goals
 */
export const regenerateStrategySection = ({ founderId, section }) =>
  request('/strategy/regenerate-section', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      section,
    }),
  });

/**
 * PUT /founder/{founderId}/strategy - Update strategy manually
 */
export const updateStrategy = (founderId, data) =>
  request(`/founder/${founderId}/strategy`, {
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
