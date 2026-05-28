/**
 * RateLimiter
 *
 * Client-side rate limiting to prevent API abuse and improve UX.
 * Complements server-side rate limiting for defense in depth.
 *
 * Features:
 * - Per-endpoint rate limiting
 * - Configurable limits and windows
 * - Automatic retry-after handling
 * - Request queuing (optional)
 * - LocalStorage persistence for cross-tab coordination
 *
 * SECURITY:
 * - Client-side rate limiting is for UX improvement only
 * - Server MUST still enforce rate limits (this is defense in depth)
 * - Prevents accidental spam clicking and reduces server load
 */

// Default rate limit configurations per endpoint category
const DEFAULT_LIMITS = {
  // Auth endpoints - very strict
  auth: {
    maxRequests: 5,
    windowMs: 60000, // 1 minute
    blockDurationMs: 300000, // 5 minutes if exceeded
  },
  // Write operations (POST, PUT, DELETE)
  write: {
    maxRequests: 30,
    windowMs: 60000, // 1 minute
    blockDurationMs: 60000, // 1 minute if exceeded
  },
  // Read operations (GET)
  read: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    blockDurationMs: 30000, // 30 seconds if exceeded
  },
  // Default for unclassified endpoints
  default: {
    maxRequests: 60,
    windowMs: 60000, // 1 minute
    blockDurationMs: 60000, // 1 minute if exceeded
  },
};

// Endpoint patterns to classify requests
const ENDPOINT_PATTERNS = {
  auth: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
  ],
  write: [
    { method: 'POST' },
    { method: 'PUT' },
    { method: 'PATCH' },
    { method: 'DELETE' },
  ],
  read: [
    { method: 'GET' },
  ],
};

class RateLimiter {
  constructor() {
    this.requests = new Map(); // endpoint -> { timestamps: [], blockedUntil: null }
    this.storageKey = 'marnee_rate_limits';
    this.loadFromStorage();
  }

  /**
   * Load rate limit state from localStorage
   * Enables cross-tab coordination
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Only load if data is recent (within last hour)
        if (data.timestamp && Date.now() - data.timestamp < 3600000) {
          Object.entries(data.endpoints || {}).forEach(([key, value]) => {
            this.requests.set(key, {
              timestamps: value.timestamps || [],
              blockedUntil: value.blockedUntil || null,
            });
          });
        }
      }
    } catch (error) {
      // Ignore storage errors
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RateLimiter] Failed to load from storage:', error.message);
      }
    }
  }

  /**
   * Save rate limit state to localStorage
   */
  saveToStorage() {
    try {
      const endpoints = {};
      this.requests.forEach((value, key) => {
        endpoints[key] = {
          timestamps: value.timestamps,
          blockedUntil: value.blockedUntil,
        };
      });
      localStorage.setItem(this.storageKey, JSON.stringify({
        timestamp: Date.now(),
        endpoints,
      }));
    } catch (error) {
      // Ignore storage errors
    }
  }

  /**
   * Get rate limit category for an endpoint
   */
  getCategory(endpoint, method = 'GET') {
    // Check auth patterns first (highest priority)
    if (ENDPOINT_PATTERNS.auth.some(pattern => endpoint.includes(pattern))) {
      return 'auth';
    }

    // Check by method
    const upperMethod = method.toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(upperMethod)) {
      return 'write';
    }
    if (upperMethod === 'GET') {
      return 'read';
    }

    return 'default';
  }

  /**
   * Get rate limit config for an endpoint
   */
  getConfig(endpoint, method = 'GET') {
    const category = this.getCategory(endpoint, method);
    return DEFAULT_LIMITS[category] || DEFAULT_LIMITS.default;
  }

  /**
   * Generate a key for tracking requests
   */
  getKey(endpoint, method = 'GET') {
    // Normalize endpoint (remove query params, trailing slashes)
    const normalizedEndpoint = endpoint.split('?')[0].replace(/\/+$/, '');
    return `${method.toUpperCase()}:${normalizedEndpoint}`;
  }

  /**
   * Check if a request is allowed
   * @returns {{ allowed: boolean, retryAfter?: number, reason?: string }}
   */
  checkLimit(endpoint, method = 'GET') {
    const key = this.getKey(endpoint, method);
    const config = this.getConfig(endpoint, method);
    const now = Date.now();

    // Get or create request tracking
    if (!this.requests.has(key)) {
      this.requests.set(key, { timestamps: [], blockedUntil: null });
    }

    const state = this.requests.get(key);

    // Check if currently blocked
    if (state.blockedUntil && state.blockedUntil > now) {
      const retryAfter = Math.ceil((state.blockedUntil - now) / 1000);
      return {
        allowed: false,
        retryAfter,
        reason: 'Too many requests. Please wait before trying again.',
      };
    }

    // Clear block if expired
    if (state.blockedUntil && state.blockedUntil <= now) {
      state.blockedUntil = null;
      state.timestamps = [];
    }

    // Remove old timestamps outside the window
    const windowStart = now - config.windowMs;
    state.timestamps = state.timestamps.filter(t => t > windowStart);

    // Check if limit exceeded
    if (state.timestamps.length >= config.maxRequests) {
      state.blockedUntil = now + config.blockDurationMs;
      this.saveToStorage();

      const retryAfter = Math.ceil(config.blockDurationMs / 1000);
      return {
        allowed: false,
        retryAfter,
        reason: 'Rate limit exceeded. Please wait before trying again.',
      };
    }

    return { allowed: true };
  }

  /**
   * Record a request
   * Call this AFTER checkLimit returns allowed: true
   */
  recordRequest(endpoint, method = 'GET') {
    const key = this.getKey(endpoint, method);

    if (!this.requests.has(key)) {
      this.requests.set(key, { timestamps: [], blockedUntil: null });
    }

    this.requests.get(key).timestamps.push(Date.now());
    this.saveToStorage();
  }

  /**
   * Handle 429 response from server
   * Updates local state to respect server's retry-after
   */
  handleTooManyRequests(endpoint, method = 'GET', retryAfterSeconds = 60) {
    const key = this.getKey(endpoint, method);

    if (!this.requests.has(key)) {
      this.requests.set(key, { timestamps: [], blockedUntil: null });
    }

    const state = this.requests.get(key);
    state.blockedUntil = Date.now() + (retryAfterSeconds * 1000);
    this.saveToStorage();
  }

  /**
   * Clear rate limit state for an endpoint
   * Useful after successful operations that should reset limits
   */
  clearLimit(endpoint, method = 'GET') {
    const key = this.getKey(endpoint, method);
    this.requests.delete(key);
    this.saveToStorage();
  }

  /**
   * Clear all rate limit state
   */
  clearAll() {
    this.requests.clear();
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      // Ignore storage errors
    }
  }

  /**
   * Get remaining requests for an endpoint
   * Useful for UI feedback
   */
  getRemainingRequests(endpoint, method = 'GET') {
    const key = this.getKey(endpoint, method);
    const config = this.getConfig(endpoint, method);
    const state = this.requests.get(key);

    if (!state) {
      return config.maxRequests;
    }

    // Clean old timestamps
    const windowStart = Date.now() - config.windowMs;
    const recentRequests = state.timestamps.filter(t => t > windowStart).length;

    return Math.max(0, config.maxRequests - recentRequests);
  }

  /**
   * Check if currently blocked
   */
  isBlocked(endpoint, method = 'GET') {
    const key = this.getKey(endpoint, method);
    const state = this.requests.get(key);

    if (!state || !state.blockedUntil) {
      return false;
    }

    return state.blockedUntil > Date.now();
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Export both class and instance
export { RateLimiter, DEFAULT_LIMITS };
export default rateLimiter;
