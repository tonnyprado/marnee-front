/**
 * Brand Profile API Service
 * All brand profile-related API endpoints
 *
 * HARDCODED MODE: Using mock data for Diana's testing
 * See MIGRATION.md for reverting to real API calls
 */
import API from '../config';
import { mockBrandProfile } from '../mocks/brandProfileMock';

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
// BRAND PROFILE ENDPOINTS
// =====================

/**
 * GET /brand-profiles/{profileId} - Get brand profile by ID
 */
export const getBrandProfile = (profileId) =>
  request(`/brand-profiles/${profileId}`);

/**
 * GET /founder/{founderId}/brand-profile - Get brand profile by founder ID
 * This will generate brand profile data from:
 * - Completed tests
 * - Chat conversations
 * - Calendar data
 * - Other available data sources
 */
export const getBrandProfileByFounder = (founderId) => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({ brandProfile: mockBrandProfile });
  }
  return request(`/founder/${founderId}/brand-profile`);
};

/**
 * PUT /founder/{founderId}/brand-profile - Update brand profile
 */
export const updateBrandProfile = (founderId, data) =>
  request(`/founder/${founderId}/brand-profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * POST /brand-profile/generate - Generate/regenerate brand profile with AI
 * Uses all available data: tests, chats, calendar, founder profile
 */
export const generateBrandProfile = ({ founderId, sessionId }) => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ brandProfile: mockBrandProfile });
      }, 1500);
    });
  }
  return request('/brand-profile/generate', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      sessionId,
    }),
  });
};

/**
 * POST /brand-profile/regenerate-section - Regenerate specific section
 */
export const regenerateBrandProfileSection = ({ founderId, section }) => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ [section]: mockBrandProfile[section] });
      }, 1500);
    });
  }
  return request('/brand-profile/regenerate-section', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      section, // 'purpose', 'voice', 'story', 'pillars', 'guidelines'
    }),
  });
};

// =====================
// BRAND GUIDELINES
// =====================

/**
 * POST /brand-profile/guidelines/upload - Upload brand guidelines file
 */
export const uploadBrandGuidelines = (founderId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('founderId', founderId);

  return request('/brand-profile/guidelines/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData
      ...getAuthHeader(),
    },
  });
};

/**
 * GET /brand-profile/guidelines/{founderId} - Get uploaded guidelines
 */
export const getBrandGuidelines = (founderId) =>
  request(`/brand-profile/guidelines/${founderId}`);

/**
 * DELETE /brand-profile/guidelines/{guidelineId} - Delete guidelines file
 */
export const deleteBrandGuidelines = (guidelineId) =>
  request(`/brand-profile/guidelines/${guidelineId}`, {
    method: 'DELETE',
  });

const brandProfileApi = {
  getBrandProfile,
  getBrandProfileByFounder,
  updateBrandProfile,
  generateBrandProfile,
  regenerateBrandProfileSection,
  uploadBrandGuidelines,
  getBrandGuidelines,
  deleteBrandGuidelines,
};

export default brandProfileApi;
