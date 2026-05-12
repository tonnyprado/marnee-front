// src/services/googleApi.js
import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

/**
 * Google Services API
 * Handles Google OAuth for YouTube, Analytics, Ads, and MyBusiness
 */

/**
 * Get Google connection status
 */
export const getGoogleStatus = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/google/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Google status:', error);
    throw error;
  }
};

/**
 * Initiate Google connection (OAuth)
 * @param {Array<string>} services - Array of services to connect: ['youtube', 'analytics', 'ads', 'mybusiness']
 * @param {string} redirectTo - Optional redirect URL after OAuth
 */
export const connectGoogle = (services = ['youtube'], redirectTo = null) => {
  const servicesParam = services.join(',');
  const redirect = redirectTo || `${window.location.origin}/settings`;
  const redirectParam = encodeURIComponent(redirect);
  window.location.href = `${API_BASE_URL}/google/connect?services=${servicesParam}&redirect_to=${redirectParam}`;
};

/**
 * Add an additional Google service without disconnecting existing ones
 * @param {string} service - Service to add: 'youtube' | 'analytics' | 'ads' | 'mybusiness'
 */
export const addGoogleService = (service, redirectTo = null) => {
  const redirect = redirectTo || `${window.location.origin}/settings`;
  const redirectParam = encodeURIComponent(redirect);
  window.location.href = `${API_BASE_URL}/google/add-service?service=${service}&redirect_to=${redirectParam}`;
};

/**
 * Disconnect all Google services
 */
export const disconnectGoogle = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/google/disconnect`);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting Google:', error);
    throw error;
  }
};

/**
 * Disconnect specific Google service
 * @param {string} service - Service to disconnect: 'youtube' | 'analytics' | 'ads' | 'mybusiness'
 */
export const disconnectGoogleService = async (service) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/google/disconnect/${service}`);
    return response.data;
  } catch (error) {
    console.error(`Error disconnecting Google ${service}:`, error);
    throw error;
  }
};

/**
 * Refresh Google access token
 */
export const refreshGoogleToken = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/google/refresh-token`);
    return response.data;
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    throw error;
  }
};

// ============================================
// YouTube Data APIs
// ============================================

/**
 * Get YouTube channel data
 */
export const getYouTubeChannel = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/channel`);
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube channel:', error);
    throw error;
  }
};

/**
 * Get YouTube analytics
 * @param {number} days - Number of days to analyze (7-90)
 */
export const getYouTubeAnalytics = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/analytics`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube analytics:', error);
    throw error;
  }
};

/**
 * Get YouTube audience demographics
 */
export const getYouTubeDemographics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/demographics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube demographics:', error);
    throw error;
  }
};

/**
 * Get YouTube traffic sources
 * @param {number} days - Number of days to analyze (7-90)
 */
export const getYouTubeTrafficSources = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/traffic-sources`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube traffic sources:', error);
    throw error;
  }
};

/**
 * Get YouTube videos
 * @param {number} limit - Number of videos to fetch (1-50)
 */
export const getYouTubeVideos = async (limit = 25) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/videos`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
};

/**
 * Get Marnee's AI analysis of YouTube channel
 * @param {number} days - Number of days to analyze (7-90)
 */
export const getYouTubeAnalysis = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/analysis`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching YouTube analysis:', error);
    throw error;
  }
};
