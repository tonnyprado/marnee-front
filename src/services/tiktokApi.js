// src/services/tiktokApi.js
import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

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
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TikTok status:', error);
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
    console.error('Error disconnecting TikTok:', error);
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
    console.error('Error refreshing TikTok token:', error);
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
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    throw error;
  }
};

/**
 * Get TikTok video analytics
 * @param {number} days - Number of days to analyze (7-30)
 */
export const getTikTokAnalytics = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/analytics`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TikTok analytics:', error);
    throw error;
  }
};

/**
 * Get TikTok video list
 * @param {number} limit - Number of videos to fetch (1-50)
 */
export const getTikTokVideos = async (limit = 25) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/videos`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TikTok videos:', error);
    throw error;
  }
};

/**
 * Get audience demographics
 */
export const getTikTokDemographics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/demographics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TikTok demographics:', error);
    throw error;
  }
};

/**
 * Get Marnee's AI analysis of TikTok account
 * @param {number} days - Number of days to analyze (7-30)
 */
export const getTikTokAnalysis = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tiktok/analysis`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TikTok analysis:', error);
    throw error;
  }
};
