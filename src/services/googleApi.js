// src/services/googleApi.js
import apiClient from '../core/services/ApiClient';
import {
  isYouTubeDemoMode,
  MOCK_YOUTUBE_STATUS,
  MOCK_YOUTUBE_ANALYTICS,
  MOCK_YOUTUBE_VIDEOS,
  MOCK_YOUTUBE_DEMOGRAPHICS,
  MOCK_YOUTUBE_ANALYSIS
} from './mockData/youtubeMockData';
import {
  isAnalyticsDemoMode,
  MOCK_ANALYTICS_STATUS,
  MOCK_ANALYTICS_DATA,
  MOCK_ANALYTICS_DEMOGRAPHICS,
  MOCK_ANALYTICS_ANALYSIS
} from './mockData/analyticsMockData';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

// Helper para simular delay de API
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

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
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Google status:', error.message);
    throw error;
  }
};

/**
 * Initiate Google connection (OAuth)
 * @param {Array<string>} services - Array of services to connect: ['youtube', 'analytics', 'ads', 'mybusiness']
 * @param {string} redirectTo - Optional redirect URL after OAuth
 */
export const connectGoogle = async (services = ['youtube'], redirectTo = null) => {
  try {
    const servicesParam = services.join(',');
    const redirect = redirectTo || `${window.location.origin}/settings`;
    const redirectParam = encodeURIComponent(redirect);

    // Use new POST endpoint that accepts authenticated requests
    const endpoint = `${API_BASE_URL}/google/get-connect-url?services=${servicesParam}&redirect_to=${redirectParam}`;
    const response = await apiClient.post(endpoint, null, {
      baseUrl: '',
      auth: true
    });

    // Redirect to OAuth URL
    if (response && response.oauthUrl) {
      window.location.href = response.oauthUrl;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error getting Google OAuth URL:', error.message);
    throw error;
  }
};

/**
 * Add an additional Google service without disconnecting existing ones
 * @param {string} service - Service to add: 'youtube' | 'analytics' | 'ads' | 'mybusiness'
 */
export const addGoogleService = async (service, redirectTo = null) => {
  try {
    const redirect = redirectTo || `${window.location.origin}/settings`;
    const redirectParam = encodeURIComponent(redirect);

    // Use the same endpoint with a single service
    const endpoint = `${API_BASE_URL}/google/get-connect-url?services=${service}&redirect_to=${redirectParam}`;
    const response = await apiClient.post(endpoint, null, {
      baseUrl: '',
      auth: true
    });

    // Redirect to OAuth URL
    if (response && response.oauthUrl) {
      window.location.href = response.oauthUrl;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error getting Google OAuth URL:', error.message);
    throw error;
  }
};

/**
 * Disconnect all Google services
 */
export const disconnectGoogle = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/google/disconnect`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error disconnecting Google:', error.message);
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
    if (process.env.NODE_ENV === 'development') console.error(`Error disconnecting Google ${service}:`, error.message);
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
    if (process.env.NODE_ENV === 'development') console.error('Error refreshing Google token:', error.message);
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
  // Modo demo para review
  if (isYouTubeDemoMode()) {
    await mockDelay();
    return MOCK_YOUTUBE_STATUS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/channel`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching YouTube channel:', error.message);
    throw error;
  }
};

/**
 * Get YouTube analytics
 * @param {number} days - Number of days to analyze (7-90)
 */
export const getYouTubeAnalytics = async (days = 30) => {
  // Modo demo para review
  if (isYouTubeDemoMode()) {
    await mockDelay();
    return MOCK_YOUTUBE_ANALYTICS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/analytics`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching YouTube analytics:', error.message);
    throw error;
  }
};

/**
 * Get YouTube audience demographics
 */
export const getYouTubeDemographics = async () => {
  // Modo demo para review
  if (isYouTubeDemoMode()) {
    await mockDelay();
    return MOCK_YOUTUBE_DEMOGRAPHICS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/demographics`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching YouTube demographics:', error.message);
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
    if (process.env.NODE_ENV === 'development') console.error('Error fetching YouTube traffic sources:', error.message);
    throw error;
  }
};

/**
 * Get YouTube videos
 * @param {number} limit - Number of videos to fetch (1-50)
 */
export const getYouTubeVideos = async (limit = 25) => {
  // Modo demo para review
  if (isYouTubeDemoMode()) {
    await mockDelay();
    return MOCK_YOUTUBE_VIDEOS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/videos`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching YouTube videos:', error.message);
    throw error;
  }
};

/**
 * Get Marnee's AI analysis of YouTube channel
 * @param {number} days - Number of days to analyze (7-90)
 */
export const getYouTubeAnalysis = async (days = 30) => {
  // Modo demo para review
  if (isYouTubeDemoMode()) {
    await mockDelay();
    return MOCK_YOUTUBE_ANALYSIS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/youtube/analysis`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching YouTube analysis:', error.message);
    throw error;
  }
};

// ============================================
// Google Analytics Data APIs
// ============================================

/**
 * Get Google Analytics property status
 */
export const getAnalyticsStatus = async () => {
  // Modo demo para review
  if (isAnalyticsDemoMode()) {
    await mockDelay();
    return MOCK_ANALYTICS_STATUS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/analytics/status`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Analytics status:', error.message);
    throw error;
  }
};

/**
 * Get Google Analytics data
 * @param {number} days - Number of days to analyze (7-90)
 */
export const getAnalyticsData = async (days = 30) => {
  // Modo demo para review
  if (isAnalyticsDemoMode()) {
    await mockDelay();
    return MOCK_ANALYTICS_DATA;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/analytics/data`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Analytics data:', error.message);
    throw error;
  }
};

/**
 * Get Google Analytics demographics
 */
export const getAnalyticsDemographics = async () => {
  // Modo demo para review
  if (isAnalyticsDemoMode()) {
    await mockDelay();
    return MOCK_ANALYTICS_DEMOGRAPHICS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/analytics/demographics`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Analytics demographics:', error.message);
    throw error;
  }
};

/**
 * Get Marnee's AI analysis of Google Analytics
 * @param {number} days - Number of days to analyze (7-90)
 */
export const getAnalyticsAnalysis = async (days = 30) => {
  // Modo demo para review
  if (isAnalyticsDemoMode()) {
    await mockDelay();
    return MOCK_ANALYTICS_ANALYSIS;
  }

  try {
    const response = await apiClient.get(`${API_BASE_URL}/analytics/analysis`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Analytics analysis:', error.message);
    throw error;
  }
};
