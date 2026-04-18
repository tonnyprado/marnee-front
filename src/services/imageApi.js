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
   *
   * @param {Object} params - Generation parameters
   * @param {string} params.founderId - Founder ID
   * @param {Object} params.postData - Post data (hook, body, cta, pillar, platform, contentType)
   * @param {string} [params.templateType] - Specific template to use (optional)
   * @param {boolean} [params.optimizeCopy=false] - Whether to optimize copy with AI
   * @param {string} [params.outputFormat='both'] - Output format: 'svg', 'png', or 'both'
   * @returns {Promise<Object>} Generated image response
   */
  generateImage: (params) =>
    request('/images/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  /**
   * Get available templates.
   *
   * @param {string} [platform] - Filter by platform (optional)
   * @returns {Promise<Object>} List of available templates
   */
  getTemplates: (platform) =>
    request(`/images/templates${platform ? `?platform=${platform}` : ''}`),
};

export default imageApi;
