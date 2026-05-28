/**
 * RateLimiter Tests
 *
 * Tests for client-side rate limiting functionality
 */

import { RateLimiter, DEFAULT_LIMITS } from '../../../core/services/RateLimiter';

describe('RateLimiter', () => {
  let rateLimiter;
  let mockStorage;

  beforeEach(() => {
    // Mock localStorage
    mockStorage = {
      store: {},
      getItem: jest.fn((key) => mockStorage.store[key] || null),
      setItem: jest.fn((key, value) => { mockStorage.store[key] = value; }),
      removeItem: jest.fn((key) => { delete mockStorage.store[key]; }),
    };

    // Replace global localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    // Create fresh instance for each test
    rateLimiter = new RateLimiter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategory', () => {
    it('should categorize auth endpoints correctly', () => {
      expect(rateLimiter.getCategory('/auth/login')).toBe('auth');
      expect(rateLimiter.getCategory('/auth/register')).toBe('auth');
      expect(rateLimiter.getCategory('/auth/forgot-password')).toBe('auth');
    });

    it('should categorize write operations by method', () => {
      expect(rateLimiter.getCategory('/api/users', 'POST')).toBe('write');
      expect(rateLimiter.getCategory('/api/users', 'PUT')).toBe('write');
      expect(rateLimiter.getCategory('/api/users', 'DELETE')).toBe('write');
      expect(rateLimiter.getCategory('/api/users', 'PATCH')).toBe('write');
    });

    it('should categorize read operations by method', () => {
      expect(rateLimiter.getCategory('/api/users', 'GET')).toBe('read');
    });

    it('should return default for unknown methods', () => {
      expect(rateLimiter.getCategory('/api/users', 'OPTIONS')).toBe('default');
    });
  });

  describe('getKey', () => {
    it('should generate consistent keys', () => {
      expect(rateLimiter.getKey('/api/users', 'GET')).toBe('GET:/api/users');
      expect(rateLimiter.getKey('/api/users', 'POST')).toBe('POST:/api/users');
    });

    it('should normalize endpoints (remove query params and trailing slashes)', () => {
      expect(rateLimiter.getKey('/api/users?page=1', 'GET')).toBe('GET:/api/users');
      expect(rateLimiter.getKey('/api/users/', 'GET')).toBe('GET:/api/users');
      expect(rateLimiter.getKey('/api/users//?foo=bar', 'GET')).toBe('GET:/api/users');
    });

    it('should uppercase method', () => {
      expect(rateLimiter.getKey('/api/users', 'get')).toBe('GET:/api/users');
      expect(rateLimiter.getKey('/api/users', 'post')).toBe('POST:/api/users');
    });
  });

  describe('checkLimit', () => {
    it('should allow requests under the limit', () => {
      const result = rateLimiter.checkLimit('/api/users', 'GET');

      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it('should block requests when limit is exceeded', () => {
      const endpoint = '/auth/login';
      const method = 'POST';
      const limit = DEFAULT_LIMITS.auth.maxRequests;

      // Make requests up to the limit
      for (let i = 0; i < limit; i++) {
        rateLimiter.recordRequest(endpoint, method);
      }

      // Next request should be blocked
      const result = rateLimiter.checkLimit(endpoint, method);

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.reason).toContain('Rate limit exceeded');
    });

    it('should clear block after blockedUntil expires', () => {
      const endpoint = '/auth/login';
      const method = 'POST';

      // Manually set a block that has expired
      const key = rateLimiter.getKey(endpoint, method);
      rateLimiter.requests.set(key, {
        timestamps: [],
        blockedUntil: Date.now() - 1000, // Expired 1 second ago
      });

      const result = rateLimiter.checkLimit(endpoint, method);

      expect(result.allowed).toBe(true);
    });
  });

  describe('recordRequest', () => {
    it('should record timestamps', () => {
      rateLimiter.recordRequest('/api/users', 'GET');
      rateLimiter.recordRequest('/api/users', 'GET');

      const key = rateLimiter.getKey('/api/users', 'GET');
      const state = rateLimiter.requests.get(key);

      expect(state.timestamps).toHaveLength(2);
    });

    it('should save to storage', () => {
      rateLimiter.recordRequest('/api/users', 'GET');

      expect(mockStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('handleTooManyRequests', () => {
    it('should set blockedUntil based on retryAfter', () => {
      const endpoint = '/api/users';
      const method = 'GET';
      const retryAfterSeconds = 60;

      rateLimiter.handleTooManyRequests(endpoint, method, retryAfterSeconds);

      const key = rateLimiter.getKey(endpoint, method);
      const state = rateLimiter.requests.get(key);

      expect(state.blockedUntil).toBeGreaterThan(Date.now());
      expect(state.blockedUntil).toBeLessThanOrEqual(Date.now() + retryAfterSeconds * 1000 + 100);
    });
  });

  describe('clearLimit', () => {
    it('should remove rate limit for endpoint', () => {
      // Record some requests
      rateLimiter.recordRequest('/api/users', 'GET');
      rateLimiter.recordRequest('/api/users', 'GET');

      // Clear the limit
      rateLimiter.clearLimit('/api/users', 'GET');

      const key = rateLimiter.getKey('/api/users', 'GET');
      expect(rateLimiter.requests.has(key)).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('should clear all rate limits', () => {
      // Record requests for multiple endpoints
      rateLimiter.recordRequest('/api/users', 'GET');
      rateLimiter.recordRequest('/api/posts', 'POST');

      // Clear all
      rateLimiter.clearAll();

      expect(rateLimiter.requests.size).toBe(0);
      expect(mockStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('getRemainingRequests', () => {
    it('should return full limit for new endpoints', () => {
      const remaining = rateLimiter.getRemainingRequests('/api/users', 'GET');

      expect(remaining).toBe(DEFAULT_LIMITS.read.maxRequests);
    });

    it('should return reduced count after requests', () => {
      rateLimiter.recordRequest('/api/users', 'GET');
      rateLimiter.recordRequest('/api/users', 'GET');
      rateLimiter.recordRequest('/api/users', 'GET');

      const remaining = rateLimiter.getRemainingRequests('/api/users', 'GET');

      expect(remaining).toBe(DEFAULT_LIMITS.read.maxRequests - 3);
    });

    it('should return 0 when limit exceeded', () => {
      const limit = DEFAULT_LIMITS.read.maxRequests;

      for (let i = 0; i < limit + 5; i++) {
        rateLimiter.recordRequest('/api/users', 'GET');
      }

      const remaining = rateLimiter.getRemainingRequests('/api/users', 'GET');

      expect(remaining).toBe(0);
    });
  });

  describe('isBlocked', () => {
    it('should return false when not blocked', () => {
      expect(rateLimiter.isBlocked('/api/users', 'GET')).toBe(false);
    });

    it('should return true when blocked', () => {
      const endpoint = '/api/users';
      const method = 'GET';

      // Set a block
      rateLimiter.handleTooManyRequests(endpoint, method, 60);

      expect(rateLimiter.isBlocked(endpoint, method)).toBe(true);
    });

    it('should return false when block has expired', () => {
      const endpoint = '/api/users';
      const method = 'GET';
      const key = rateLimiter.getKey(endpoint, method);

      // Set an expired block
      rateLimiter.requests.set(key, {
        timestamps: [],
        blockedUntil: Date.now() - 1000,
      });

      expect(rateLimiter.isBlocked(endpoint, method)).toBe(false);
    });
  });

  describe('loadFromStorage', () => {
    it('should load saved state from localStorage', () => {
      const savedState = {
        timestamp: Date.now(),
        endpoints: {
          'GET:/api/users': {
            timestamps: [Date.now()],
            blockedUntil: null,
          },
        },
      };
      mockStorage.store['marnee_rate_limits'] = JSON.stringify(savedState);

      // Create new instance (which calls loadFromStorage)
      const newLimiter = new RateLimiter();

      expect(newLimiter.requests.has('GET:/api/users')).toBe(true);
    });

    it('should not load stale data (older than 1 hour)', () => {
      const savedState = {
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        endpoints: {
          'GET:/api/users': {
            timestamps: [Date.now()],
            blockedUntil: null,
          },
        },
      };
      mockStorage.store['marnee_rate_limits'] = JSON.stringify(savedState);

      // Create new instance
      const newLimiter = new RateLimiter();

      expect(newLimiter.requests.has('GET:/api/users')).toBe(false);
    });
  });

  describe('DEFAULT_LIMITS', () => {
    it('should have stricter limits for auth endpoints', () => {
      expect(DEFAULT_LIMITS.auth.maxRequests).toBeLessThan(DEFAULT_LIMITS.read.maxRequests);
      expect(DEFAULT_LIMITS.auth.blockDurationMs).toBeGreaterThan(DEFAULT_LIMITS.read.blockDurationMs);
    });

    it('should have reasonable limits for write operations', () => {
      expect(DEFAULT_LIMITS.write.maxRequests).toBeLessThan(DEFAULT_LIMITS.read.maxRequests);
    });
  });
});
