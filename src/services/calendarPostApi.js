import API from '../config';
import { getAuthHeader } from './api';

/**
 * Calendar Post API Service
 * Handles calendar post specific operations including generated images.
 */

const calendarPostApi = {
  /**
   * Save or update generated image for a calendar post.
   *
   * @param {string} postId - Calendar post ID
   * @param {Object} imageData - Image data
   * @param {string} imageData.svg - SVG content
   * @param {string} imageData.pngBase64 - PNG as base64
   * @param {string} imageData.template - Template used
   * @param {Object} imageData.dimensions - {width, height}
   * @param {Array<string>} imageData.contextUsed - Context sources
   * @returns {Promise<Object>} Response with success message
   */
  saveGeneratedImage: async (postId, imageData) => {
    const authHeader = getAuthHeader();
    const baseUrl = API.MARNEE;
    const url = `${baseUrl}/calendar/posts/${postId}/generated-image`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({
        svg: imageData.svg,
        pngBase64: imageData.pngBase64,
        template: imageData.templateUsed || imageData.template,
        dimensions: imageData.dimensions,
        contextUsed: imageData.contextUsed || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get generated image for a calendar post.
   *
   * @param {string} postId - Calendar post ID
   * @returns {Promise<Object|null>} Image data or null if no image exists
   */
  getGeneratedImage: async (postId) => {
    const authHeader = getAuthHeader();
    const baseUrl = API.MARNEE;
    const url = `${baseUrl}/calendar/posts/${postId}/generated-image`;

    const response = await fetch(url, {
      headers: authHeader,
    });

    if (response.status === 404) {
      return null; // No image exists
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  },
};

export default calendarPostApi;
