// src/services/tiktokApi.js
import apiClient from '../core/services/ApiClient';
import {
  isTikTokDemoMode,
  MOCK_TIKTOK_STATUS,
  MOCK_TIKTOK_ANALYTICS,
  MOCK_TIKTOK_VIDEOS,
  MOCK_TIKTOK_PROFILE,
  MOCK_TIKTOK_DEMOGRAPHICS,
  MOCK_TIKTOK_ANALYSIS
} from './mockData/tiktokMockData';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

// Helper para simular delay de API
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

/**
 * TikTok API service
 * Handles TikTok connection, insights, and analytics
 *
 * NOTE: Backend endpoints are not yet implemented.
 * This service is prepared for future integration.
 */

/**
 * Get TikTok connection status
 */
export const getTikTokStatus = async () => {
  // Modo demo para review
  if (isTikTokDemoMode()) {
    await mockDelay();
    return MOCK_TIKTOK_STATUS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/status`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching TikTok status:', error.message);
    // Return disconnected status if endpoint doesn't exist yet
    if (error.response?.status === 404) {
      return { connected: false };
    }
    throw error;
  }
};

/**
 * Initiate TikTok connection (OAuth)
 * @param {string} redirectTo - Optional redirect URL after OAuth
 */
export const connectTikTok = (redirectTo = null) => {
  const redirect = redirectTo || `${window.location.origin}/settings`;
  const redirectParam = encodeURIComponent(redirect);
  window.location.href = `${API_BASE_URL}/tiktok/connect?redirect_to=${redirectParam}`;
};

/**
 * Disconnect TikTok account
 */
export const disconnectTikTok = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/tiktok/disconnect`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error disconnecting TikTok:', error.message);
    throw error;
  }
};

/**
 * Refresh TikTok access token
 */
export const refreshTikTokToken = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/tiktok/refresh-token`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error refreshing TikTok token:', error.message);
    throw error;
  }
};

// ============================================
// TikTok Data APIs (Future Implementation)
// ============================================

/**
 * Get TikTok user profile data
 */
export const getTikTokProfile = async () => {
  // Modo demo para review
  if (isTikTokDemoMode()) {
    await mockDelay();
    return MOCK_TIKTOK_PROFILE;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/profile`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching TikTok profile:', error.message);
    throw error;
  }
};

/**
 * Get TikTok video analytics
 * @param {number} days - Number of days to analyze (7-30)
 */
export const getTikTokAnalytics = async (days = 30) => {
  // Modo demo para review
  if (isTikTokDemoMode()) {
    await mockDelay();
    return MOCK_TIKTOK_ANALYTICS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/analytics`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching TikTok analytics:', error.message);
    throw error;
  }
};

/**
 * Get TikTok video list
 * @param {number} limit - Number of videos to fetch (1-50)
 */
export const getTikTokVideos = async (limit = 25) => {
  // Modo demo para review
  if (isTikTokDemoMode()) {
    await mockDelay();
    return MOCK_TIKTOK_VIDEOS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/videos`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching TikTok videos:', error.message);
    throw error;
  }
};

/**
 * Get audience demographics
 */
export const getTikTokDemographics = async () => {
  // Modo demo para review
  if (isTikTokDemoMode()) {
    await mockDelay();
    return MOCK_TIKTOK_DEMOGRAPHICS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/demographics`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching TikTok demographics:', error.message);
    throw error;
  }
};

/**
 * Get Marnee's AI analysis of TikTok account
 * @param {number} days - Number of days to analyze (7-30)
 */
export const getTikTokAnalysis = async (days = 30) => {
  // Modo demo para review
  if (isTikTokDemoMode()) {
    await mockDelay();
    return MOCK_TIKTOK_ANALYSIS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/analysis`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching TikTok analysis:', error.message);
    throw error;
  }
};
