/**
 * ApiClient
 *
 * Unified API client for all HTTP requests.
 * Replaces duplicated request() functions across service files.
 *
 * Features:
 * - Centralized request/response handling
 * - Automatic authentication header injection
 * - Unified error handling
 * - Request/response logging
 * - Support for different base URLs
 * - Configurable timeouts
 * - Request retries (optional)
 */

import { getAuthHeader } from '../utils/auth';
import errorHandler from './ErrorHandler';
import logger from '../utils/logger';

const log = logger.createContextLogger('ApiClient');

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 0,
  retryDelay: 1000,
};

class ApiClient {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Make HTTP request
   *
   * @param {string} endpoint - API endpoint (e.g., '/users/me')
   * @param {Object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {Object} options.body - Request body (will be JSON stringified)
   * @param {Object} options.headers - Additional headers
   * @param {string} options.baseUrl - Base URL (overrides default)
   * @param {boolean} options.auth - Whether to include auth header (default: true)
   * @param {boolean} options.debug - Enable debug logging (default: false)
   * @param {number} options.timeout - Request timeout in ms
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      baseUrl = '',
      auth = true,
      debug = false,
      timeout = this.config.timeout,
    } = options;

    // Build full URL
    const url = `${baseUrl}${endpoint}`;

    // Build headers
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add auth header if required
    if (auth) {
      const authHeader = getAuthHeader();

      if (!authHeader.Authorization) {
        const message = 'Sesión no válida. Inicia sesión de nuevo.';
        errorHandler.handleAuthError(message);
        throw new Error(message);
      }

      Object.assign(requestHeaders, authHeader);
    }

    // Build fetch options
    const fetchOptions = {
      method,
      headers: requestHeaders,
    };

    // Add body if present
    if (body) {
      if (body instanceof FormData) {
        // For FormData, remove Content-Type to let browser set it with boundary
        delete fetchOptions.headers['Content-Type'];
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    // Debug logging
    if (debug) {
      log.debug('Request', {
        url,
        method,
        headers: requestHeaders,
        body: body instanceof FormData ? '[FormData]' : body,
      });
    }

    try {
      // Make request with timeout
      const response = await this.fetchWithTimeout(url, fetchOptions, timeout);

      // Handle error responses
      if (!response.ok) {
        const error = await errorHandler.handleHttpError(response, { debug, url });
        throw error;
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (debug) {
        log.debug('Response', { url, data });
      }

      return data;

    } catch (error) {
      // If error is already an AppError from errorHandler, re-throw it
      if (error.name === 'AppError') {
        throw error;
      }

      // Handle network errors
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        log.error('Request timeout', { url, timeout });
        throw errorHandler.handleNetworkError(new Error('La solicitud tardó demasiado. Inténtalo de nuevo.'));
      }

      // Handle other errors
      throw errorHandler.handleNetworkError(error);
    }
  }

  /**
   * Fetch with timeout
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @param {number} timeout - Timeout in ms
   * @returns {Promise<Response>}
   */
  async fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Convenience method for GET requests
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Convenience method for POST requests
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * Convenience method for PUT requests
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * Convenience method for PATCH requests
   */
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * Convenience method for DELETE requests
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Upload file with FormData
   */
  upload(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export both class and instance
export { ApiClient };
export default apiClient;
