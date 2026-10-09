/**
 * SessionService
 *
 * Manages JWT session lifecycle with backend:
 * - Logout (revoke current session)
 * - Logout all devices
 * - Get active sessions
 * - Revoke specific session
 */

import apiClient from './ApiClient';
import logger from '../utils/logger';

const log = logger.createContextLogger('SessionService');

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://dnhubai-production.up.railway.app';

class SessionService {
  /**
   * Logout from current session
   * Revokes the JWT token on the backend
   *
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async logout() {
    try {
      log.info('Logging out (revoking session)');

      const response = await apiClient.post(
        '/api/v1/auth/logout',
        {},
        {
          baseUrl: API_BASE_URL,
          auth: true,
        }
      );

      log.info('Logout successful', response);
      return response;
    } catch (error) {
      log.error('Logout failed', error);
      // Still throw to let caller handle
      throw error;
    }
  }

  /**
   * Logout from all devices
   * Revokes all JWT sessions for the current user
   *
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async logoutAll() {
    try {
      log.info('Logging out from all devices');

      const response = await apiClient.post(
        '/api/v1/auth/logout-all',
        {},
        {
          baseUrl: API_BASE_URL,
          auth: true,
        }
      );

      log.info('Logout all successful', response);
      return response;
    } catch (error) {
      log.error('Logout all failed', error);
      throw error;
    }
  }

  /**
   * Get all active sessions for current user
   *
   * @returns {Promise<{sessions: Array, total: number}>}
   */
  async getActiveSessions() {
    try {
      log.info('Fetching active sessions');

      const response = await apiClient.get('/api/v1/auth/sessions', {
        baseUrl: API_BASE_URL,
        auth: true,
      });

      log.info('Active sessions retrieved', {
        total: response.total,
        count: response.sessions?.length,
      });

      return response;
    } catch (error) {
      log.error('Failed to get active sessions', error);
      throw error;
    }
  }

  /**
   * Revoke a specific session by JTI
   *
   * @param {string} jti - JWT ID to revoke
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async revokeSession(jti) {
    try {
      log.info('Revoking session', { jti });

      const response = await apiClient.post(
        `/api/v1/auth/sessions/${jti}/revoke`,
        {},
        {
          baseUrl: API_BASE_URL,
          auth: true,
        }
      );

      log.info('Session revoked successfully', response);
      return response;
    } catch (error) {
      log.error('Failed to revoke session', { jti, error });
      throw error;
    }
  }

  /**
   * Parse user agent string to extract device and browser info
   *
   * @param {string} userAgent - User agent string
   * @returns {{device: string, browser: string, os: string}}
   */
  parseUserAgent(userAgent) {
    if (!userAgent) {
      return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
    }

    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS X')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

    // Detect device
    let device = 'Desktop';
    if (/iPhone|iPod/.test(userAgent)) device = 'iPhone';
    else if (/iPad/.test(userAgent)) device = 'iPad';
    else if (/Android.*Mobile/.test(userAgent)) device = 'Android Phone';
    else if (/Android/.test(userAgent)) device = 'Android Tablet';

    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Edg/')) browser = 'Edge';
    else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';

    return { device, browser, os };
  }

  /**
   * Get device icon based on device type
   *
   * @param {string} device - Device type
   * @returns {string} Emoji icon
   */
  getDeviceIcon(device) {
    if (device.includes('iPhone') || device.includes('Android Phone')) return '📱';
    if (device.includes('iPad') || device.includes('Tablet')) return '📲';
    return '💻';
  }
}

// Create singleton instance
const sessionService = new SessionService();

export default sessionService;
