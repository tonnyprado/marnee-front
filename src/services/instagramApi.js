// src/services/instagramApi.js
import apiClient from '../core/services/ApiClient';
import {
  isInstagramDemoMode,
  MOCK_INSTAGRAM_STATUS,
  MOCK_INSTAGRAM_INSIGHTS,
  MOCK_INSTAGRAM_MEDIA,
  MOCK_INSTAGRAM_PROFILE,
  MOCK_AUDIENCE_DEMOGRAPHICS,
  MOCK_CONTENT_PERFORMANCE,
  MOCK_INSTAGRAM_ANALYSIS
} from './mockData/instagramMockData';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

// Helper para simular delay de API
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

/**
 * Instagram API service
 * Handles Instagram connection, insights, and analysis
 */

/**
 * Get Instagram connection status
 */
export const getInstagramStatus = async () => {
  // Modo demo para review de Meta
  if (isInstagramDemoMode()) {
    await mockDelay();
    return MOCK_INSTAGRAM_STATUS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta/status`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram status:', error.message);
    throw error;
  }
};

/**
 * Initiate Instagram connection (OAuth)
 * This will redirect to Meta OAuth page
 */
export const connectInstagram = async () => {
  try {
    const redirectTo = encodeURIComponent(window.location.origin + '/settings');

    // Use new POST endpoint that accepts authenticated requests
    const endpoint = `${API_BASE_URL}/meta/get-connect-url?redirect_to=${redirectTo}`;
    const response = await apiClient.post(endpoint, null, {
      baseUrl: '',
      auth: true
    });

    // Redirect to OAuth URL
    if (response && response.oauthUrl) {
      window.location.href = response.oauthUrl;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error getting Instagram OAuth URL:', error.message);
    throw error;
  }
};

/**
 * Disconnect Instagram account
 */
export const disconnectInstagram = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/meta/disconnect`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error disconnecting Instagram:', error.message);
    throw error;
  }
};

/**
 * Refresh Instagram access token
 */
export const refreshInstagramToken = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/meta/refresh-token`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error refreshing Instagram token:', error.message);
    throw error;
  }
};

/**
 * Get Instagram profile data
 */
export const getInstagramProfile = async () => {
  // Modo demo para review de Meta
  if (isInstagramDemoMode()) {
    await mockDelay();
    return MOCK_INSTAGRAM_PROFILE;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/profile`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram profile:', error.message);
    throw error;
  }
};

/**
 * Get Instagram insights
 */
export const getInstagramInsights = async (period = 'day') => {
  // Modo demo para review de Meta
  if (isInstagramDemoMode()) {
    await mockDelay();
    return MOCK_INSTAGRAM_INSIGHTS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/insights`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram insights:', error.message);
    throw error;
  }
};

/**
 * Get audience demographics
 */
export const getAudienceDemographics = async () => {
  // Modo demo para review de Meta
  if (isInstagramDemoMode()) {
    await mockDelay();
    return MOCK_AUDIENCE_DEMOGRAPHICS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/demographics`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching audience demographics:', error.message);
    throw error;
  }
};

/**
 * Get recent Instagram media
 */
export const getInstagramMedia = async (limit = 25) => {
  // Modo demo para review de Meta
  if (isInstagramDemoMode()) {
    await mockDelay();
    return MOCK_INSTAGRAM_MEDIA;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/media`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram media:', error.message);
    throw error;
  }
};

/**
 * Get Marnee's AI analysis of Instagram account
 */
export const getInstagramAnalysis = async (days = 30) => {
  // Modo demo para review de Meta
  if (isInstagramDemoMode()) {
    await mockDelay();
    return MOCK_INSTAGRAM_ANALYSIS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/analysis`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram analysis:', error.message);
    throw error;
  }
};

/**
 * Get content performance analysis
 */
export const getContentPerformance = async (limit = 10) => {
  // Modo demo para review de Meta
  if (isInstagramDemoMode()) {
    await mockDelay();
    return MOCK_CONTENT_PERFORMANCE;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/content-performance`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching content performance:', error.message);
    throw error;
  }
};

/**
 * Get Instagram Stories with insights
 * Note: Stories are only available for 24 hours
 */
export const getInstagramStories = async (limit = 10) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/stories`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram stories:', error.message);
    throw error;
  }
};

/**
 * Get Instagram Reels with enhanced metrics
 */
export const getInstagramReels = async (limit = 10) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/reels`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram reels:', error.message);
    throw error;
  }
};
