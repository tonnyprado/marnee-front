/**
 * Trends API Service
 * All trends-related API endpoints
 *
 * HARDCODED MODE: Using mock data for Diana's testing
 * See MIGRATION.md for reverting to real API calls
 */
import API from '../config';
import { mockTrends } from '../mocks/trendsMock';

const AUTH_STORAGE_KEY = 'marnee_auth';
const USE_MOCK_DATA = true; // Set to false to use real API

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
 * GET /founder/{founderId}/trends - Get trends by founder ID
 * Auto-generates if doesn't exist
 */
export const getTrendsByFounder = (founderId) => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({ trends: mockTrends });
  }
  return request(`/founder/${founderId}/trends`);
};

/**
 * POST /trends/generate - Generate/regenerate complete trends
 */
export const generateTrends = ({ founderId, sessionId }) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ trends: mockTrends });
      }, 2000);
    });
  }
  return request('/trends/generate', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      sessionId,
    }),
  });
};

/**
 * POST /trends/regenerate-section - Regenerate specific section
 * Sections: keywords, viral_topics, main_trends, market_insights
 */
export const regenerateTrendsSection = ({ founderId, section }) => {
  if (USE_MOCK_DATA) {
    const sectionKeyMap = {
      'keywords': 'seoKeywords',
      'viral_topics': 'viralTopics',
      'main_trends': 'mainTrends',
      'market_insights': 'marketInsights'
    };
    const key = sectionKeyMap[section] || section;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ [key]: mockTrends[key] });
      }, 1500);
    });
  }
  return request('/trends/regenerate-section', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      section,
    }),
  });
};

/**
 * PUT /founder/{founderId}/trends - Update trends manually
 */
export const updateTrends = (founderId, data) =>
  request(`/founder/${founderId}/trends`, {
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
