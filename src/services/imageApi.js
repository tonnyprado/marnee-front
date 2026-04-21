import API from '../config';
import { getAuthHeader } from './api';

/**
 * Image Generation API Service
 * Handles all image generation related API calls.
 */

async function request(endpoint, options = {}) {
  const authHeader = getAuthHeader();
  const baseUrl = API.MARNEE;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

const imageApi = {
  /**
   * Generate an image for a post.
   * Now uses FormData for consistency with attachment endpoint.
   *
   * @param {Object} params - Generation parameters
   * @param {string} params.founderId - Founder ID
   * @param {Object} params.postData - Post data (hook, body, cta, pillar, platform, contentType)
   * @param {string} [params.templateType] - Specific template to use (optional)
   * @param {boolean} [params.optimizeCopy=false] - Whether to optimize copy with AI
   * @param {string} [params.outputFormat='both'] - Output format: 'svg', 'png', or 'both'
   * @returns {Promise<Object>} Generated image response
   */
  generateImage: async (params) => {
    const authHeader = getAuthHeader();
    const baseUrl = API.MARNEE;
    const url = `${baseUrl}/images/generate`;

    const formData = new FormData();
    // Send params as JSON string
    formData.append('params', JSON.stringify(params));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...authHeader,
        // Don't set Content-Type - browser sets it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get available templates.
   *
   * @param {string} [platform] - Filter by platform (optional)
   * @returns {Promise<Object>} List of available templates
   */
  getTemplates: (platform) =>
    request(`/images/templates${platform ? `?platform=${platform}` : ''}`),

  /**
   * Generate an image with file attachments.
   * Uses FormData to send files along with generation parameters.
   *
   * @param {Object} params - Generation parameters
   * @param {Array<Object>} attachments - Array of attachment objects with .file property
   * @returns {Promise<Object>} Generated image response
   */
  generateImageWithAttachments: async (params, attachments = []) => {
    const authHeader = getAuthHeader();
    const baseUrl = API.MARNEE;
    const url = `${baseUrl}/images/generate`;

    const formData = new FormData();

    // Add JSON params as a string field
    formData.append('params', JSON.stringify(params));

    // Add each attachment - extract the File object from the attachment wrapper
    attachments.forEach((attachment, index) => {
      if (attachment && attachment.file) {
        formData.append(`attachment_${index}`, attachment.file);
      }
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...authHeader,
        // Note: Don't set Content-Type for FormData - browser sets it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },
};

export default imageApi;
