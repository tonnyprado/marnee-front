/**
 * Strategy API Service
 * All strategy-related API endpoints
 */

/**
 * Helper to get auth header from localStorage
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Helper to make API requests with proper error handling
 */
const request = async (endpoint, options = {}) => {
  const baseUrl = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000';
  const url = `${baseUrl}${endpoint}`;

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
