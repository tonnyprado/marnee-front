// src/services/instagramApi.js
import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_MARNEE_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Instagram API service
 * Handles Instagram connection, insights, and analysis
 */

/**
 * Get Instagram connection status
 */
export const getInstagramStatus = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram status:', error);
    throw error;
  }
};

/**
 * Initiate Instagram connection (OAuth)
 * This will redirect to Meta OAuth page
 */
export const connectInstagram = () => {
  const redirectTo = encodeURIComponent(window.location.origin + '/settings');
  window.location.href = `${API_BASE_URL}/meta/connect?redirect_to=${redirectTo}`;
};

/**
 * Disconnect Instagram account
 */
export const disconnectInstagram = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/meta/disconnect`);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting Instagram:', error);
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
    console.error('Error refreshing Instagram token:', error);
    throw error;
  }
};

/**
 * Get Instagram profile data
 */
export const getInstagramProfile = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    throw error;
  }
};

/**
 * Get Instagram insights
 */
export const getInstagramInsights = async (period = 'day') => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/insights`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram insights:', error);
    throw error;
  }
};

/**
 * Get audience demographics
 */
export const getAudienceDemographics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/demographics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audience demographics:', error);
    throw error;
  }
};

/**
 * Get recent Instagram media
 */
export const getInstagramMedia = async (limit = 25) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/media`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
};

/**
 * Get Marnee's AI analysis of Instagram account
 */
export const getInstagramAnalysis = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/analysis`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram analysis:', error);
    throw error;
  }
};

/**
 * Get content performance analysis
 */
export const getContentPerformance = async (limit = 10) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/content-performance`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content performance:', error);
    throw error;
  }
};
