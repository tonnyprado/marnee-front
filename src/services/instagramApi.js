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

// ============ INSTAGRAM CONTENT PUBLISHING ============

/**
 * Publish a single image to Instagram
 * @param {string} imageUrl - Public HTTPS URL to image (JPEG/PNG)
 * @param {string} caption - Optional caption (max 2,200 characters)
 * @param {string} locationId - Optional Facebook Location ID
 * @returns {Promise<{success: boolean, media_id: string, permalink: string}>}
 */
export const publishInstagramImage = async (imageUrl, caption = null, locationId = null) => {
  try {
    const params = new URLSearchParams();
    params.append('image_url', imageUrl);
    if (caption) params.append('caption', caption);
    if (locationId) params.append('location_id', locationId);

    const response = await apiClient.post(
      `${API_BASE_URL}/instagram/publish?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error publishing Instagram image:', error.message);
    throw error;
  }
};

/**
 * Publish a video to Instagram
 * @param {string} videoUrl - Public HTTPS URL to video (MP4, max 100MB)
 * @param {string} caption - Optional caption
 * @param {string} locationId - Optional Facebook Location ID
 * @returns {Promise<{success: boolean, media_id: string, permalink: string, processing_time: number}>}
 */
export const publishInstagramVideo = async (videoUrl, caption = null, locationId = null) => {
  try {
    const params = new URLSearchParams();
    params.append('video_url', videoUrl);
    if (caption) params.append('caption', caption);
    if (locationId) params.append('location_id', locationId);

    const response = await apiClient.post(
      `${API_BASE_URL}/instagram/publish/video?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error publishing Instagram video:', error.message);
    throw error;
  }
};

/**
 * Publish a carousel (multiple images) to Instagram
 * @param {string[]} mediaUrls - Array of 2-10 public image URLs
 * @param {string} caption - Optional carousel caption
 * @param {string} locationId - Optional Facebook Location ID
 * @returns {Promise<{success: boolean, media_id: string, permalink: string, items_count: number}>}
 */
export const publishInstagramCarousel = async (mediaUrls, caption = null, locationId = null) => {
  try {
    if (!Array.isArray(mediaUrls) || mediaUrls.length < 2 || mediaUrls.length > 10) {
      throw new Error('Carousel must have 2-10 images');
    }

    const params = new URLSearchParams();
    mediaUrls.forEach(url => params.append('media_urls', url));
    if (caption) params.append('caption', caption);
    if (locationId) params.append('location_id', locationId);

    const response = await apiClient.post(
      `${API_BASE_URL}/instagram/publish/carousel?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error publishing Instagram carousel:', error.message);
    throw error;
  }
};

// ============ INSTAGRAM COMMENTS ANALYTICS ============

/**
 * Get comments on a specific Instagram post
 * @param {string} mediaId - Instagram Media ID
 * @param {number} limit - Number of comments to fetch (1-100, default 50)
 * @returns {Promise<{comments: Array, count: number}>}
 */
export const getMediaComments = async (mediaId, limit = 50) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/media/${mediaId}/comments`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching Instagram comments:', error.message);
    throw error;
  }
};

/**
 * Get AI-powered analytics of Instagram comments
 * Analyzes comments across recent posts to provide:
 * - Sentiment analysis (positive/negative/neutral/questions)
 * - Key topics and frequently mentioned words
 * - Marnee's AI observations and insights
 * - Actionable recommendations
 *
 * @param {number} limitPosts - Number of recent posts to analyze (5-50, default 20)
 * @returns {Promise<{
 *   summary: {
 *     total_comments: number,
 *     avg_comments_per_post: number,
 *     top_commented_post: object
 *   },
 *   sentiment: {
 *     positive: number,
 *     negative: number,
 *     neutral: number,
 *     questions: number,
 *     positive_percentage: number,
 *     negative_percentage: number,
 *     sentiment_score: number
 *   },
 *   key_topics: Array<{topic: string, mentions: number, percentage: number}>,
 *   marnee_observations: Array<{type: string, category: string, observation: string, impact: string, details: string}>,
 *   action_items: Array<string>
 * }>}
 */
export const getCommentsAnalytics = async (limitPosts = 20) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/instagram/comments/analytics`, {
      params: { limit_posts: limitPosts }
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching comments analytics:', error.message);
    throw error;
  }
};
