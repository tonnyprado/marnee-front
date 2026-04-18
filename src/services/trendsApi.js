/**
 * Trends API Service
 * All trends-related API endpoints
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
// TRENDS ENDPOINTS
// =====================

/**
 * GET /api/v1/founder/{founderId}/trends - Get trends by founder ID
 * Auto-generates if doesn't exist
 */
export const getTrendsByFounder = (founderId) =>
  request(`/api/v1/founder/${founderId}/trends`);

/**
 * POST /api/v1/trends/generate - Generate/regenerate complete trends
 */
export const generateTrends = ({ founderId, sessionId }) =>
  request('/api/v1/trends/generate', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      sessionId,
    }),
  });

/**
 * POST /api/v1/trends/regenerate-section - Regenerate specific section
 * Sections: keywords, viral_topics, main_trends, market_insights
 */
export const regenerateTrendsSection = ({ founderId, section }) =>
  request('/api/v1/trends/regenerate-section', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      section,
    }),
  });

/**
 * PUT /api/v1/founder/{founderId}/trends - Update trends manually
 */
export const updateTrends = (founderId, data) =>
  request(`/api/v1/founder/${founderId}/trends`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

const trendsApi = {
  getTrendsByFounder,
  generateTrends,
  regenerateTrendsSection,
  updateTrends,
};

export default trendsApi;
