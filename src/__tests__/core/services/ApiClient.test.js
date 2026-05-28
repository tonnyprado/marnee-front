/**
 * ApiClient Tests
 */
import { ApiClient } from '../../../core/services/ApiClient';

// Mock dependencies
jest.mock('../../../core/utils/auth', () => ({
  getAuthHeader: jest.fn(),
}));

jest.mock('../../../core/services/ErrorHandler', () => ({
  handleAuthError: jest.fn(),
  handleHttpError: jest.fn(),
  handleNetworkError: jest.fn(),
  getTranslation: jest.fn((key) => key),
  default: {
    handleAuthError: jest.fn(),
    handleHttpError: jest.fn(),
    handleNetworkError: jest.fn(),
    getTranslation: jest.fn((key) => key),
  },
}));

jest.mock('../../../core/utils/logger', () => ({
  createContextLogger: () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
  default: {
    createContextLogger: () => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }),
  },
}));

jest.mock('../../../core/services/RateLimiter', () => ({
  checkLimit: jest.fn(() => ({ allowed: true })),
  recordRequest: jest.fn(),
  handleTooManyRequests: jest.fn(),
  default: {
    checkLimit: jest.fn(() => ({ allowed: true })),
    recordRequest: jest.fn(),
    handleTooManyRequests: jest.fn(),
  },
}));

import { getAuthHeader } from '../../../core/utils/auth';
import errorHandler from '../../../core/services/ErrorHandler';
import rateLimiter from '../../../core/services/RateLimiter';

describe('ApiClient', () => {
  let client;
  let mockFetch;

  beforeEach(() => {
    client = new ApiClient();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Reset mocks
    jest.clearAllMocks();

    // Default mock implementations
    getAuthHeader.mockReturnValue({ Authorization: 'Bearer test-token' });
    rateLimiter.checkLimit.mockReturnValue({ allowed: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      const client = new ApiClient();
      expect(client.config.timeout).toBe(30000);
      expect(client.config.retries).toBe(0);
    });

    it('should merge custom config', () => {
      const client = new ApiClient({ timeout: 60000 });
      expect(client.config.timeout).toBe(60000);
    });
  });

  describe('request', () => {
    it('should make GET request by default', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ data: 'test' }),
      });

      const result = await client.request('/api/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should include auth header by default', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({}),
      });

      await client.request('/api/test');

      expect(getAuthHeader).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should skip auth header when auth: false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({}),
      });

      await client.request('/api/test', { auth: false });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });

    it('should throw error when no auth token and auth required', async () => {
      getAuthHeader.mockReturnValue({});

      await expect(client.request('/api/test')).rejects.toThrow();
      expect(errorHandler.handleAuthError).toHaveBeenCalled();
    });

    it('should check rate limit before request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({}),
      });

      await client.request('/api/test');

      expect(rateLimiter.checkLimit).toHaveBeenCalledWith('/api/test', 'GET');
    });

    it('should throw RateLimitError when rate limited', async () => {
      rateLimiter.checkLimit.mockReturnValue({
        allowed: false,
        reason: 'Too many requests',
        retryAfter: 60,
      });

      await expect(client.request('/api/test')).rejects.toMatchObject({
        name: 'RateLimitError',
        retryAfter: 60,
      });
    });

    it('should record request for rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({}),
      });

      await client.request('/api/test', { method: 'POST' });

      expect(rateLimiter.recordRequest).toHaveBeenCalledWith('/api/test', 'POST');
    });

    it('should handle 429 response from server', async () => {
      // Create mock headers with get method
      const mockHeaders = {
        get: jest.fn((name) => name === 'Retry-After' ? '120' : null),
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: mockHeaders,
      });

      // handleNetworkError is called for rate limit errors - return the error to re-throw it
      const rateLimitError = new Error('Too many requests. Please try again later.');
      rateLimitError.name = 'RateLimitError';
      rateLimitError.retryAfter = 120;
      errorHandler.handleNetworkError.mockReturnValueOnce(rateLimitError);

      await expect(client.request('/api/test')).rejects.toThrow('Too many requests');
      expect(rateLimiter.handleTooManyRequests).toHaveBeenCalledWith('/api/test', 'GET', 120);
    });

    it('should handle non-ok response', async () => {
      const mockError = new Error('Not found');
      mockError.name = 'AppError';

      errorHandler.handleHttpError.mockResolvedValue(mockError);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers(),
      });

      await expect(client.request('/api/test')).rejects.toThrow('Not found');
      expect(errorHandler.handleHttpError).toHaveBeenCalled();
    });

    it('should parse JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ id: 1, name: 'Test' }),
      });

      const result = await client.request('/api/test');

      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('should parse text response when not JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('Plain text response'),
      });

      const result = await client.request('/api/test');

      expect(result).toBe('Plain text response');
    });

    it('should handle POST request with body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true }),
      });

      await client.request('/api/test', {
        method: 'POST',
        body: { name: 'Test' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
        })
      );
    });

    it('should handle FormData body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true }),
      });

      const formData = new FormData();
      formData.append('file', 'test');

      await client.request('/api/upload', {
        method: 'POST',
        body: formData,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/upload',
        expect.objectContaining({
          method: 'POST',
          body: formData,
          headers: expect.not.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should use custom base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({}),
      });

      await client.request('/endpoint', { baseUrl: 'https://api.example.com' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/endpoint',
        expect.any(Object)
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network failed');
      errorHandler.handleNetworkError.mockReturnValue(networkError);

      mockFetch.mockRejectedValueOnce(new Error('Network failed'));

      await expect(client.request('/api/test')).rejects.toThrow();
      expect(errorHandler.handleNetworkError).toHaveBeenCalled();
    });
  });

  describe('convenience methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true }),
      });
    });

    it('get() should make GET request', async () => {
      await client.get('/api/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('post() should make POST request with body', async () => {
      await client.post('/api/test', { data: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ data: 'test' }),
        })
      );
    });

    it('put() should make PUT request with body', async () => {
      await client.put('/api/test', { data: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ data: 'test' }),
        })
      );
    });

    it('patch() should make PATCH request with body', async () => {
      await client.patch('/api/test', { data: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ data: 'test' }),
        })
      );
    });

    it('delete() should make DELETE request', async () => {
      await client.delete('/api/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('upload() should make POST request with FormData', async () => {
      const formData = new FormData();

      await client.upload('/api/upload', formData);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/upload',
        expect.objectContaining({
          method: 'POST',
          body: formData,
        })
      );
    });
  });

  describe('fetchWithTimeout', () => {
    it('should return response before timeout', async () => {
      const mockResponse = {
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await client.fetchWithTimeout('/api/test', {}, 5000);

      expect(result).toBe(mockResponse);
    });

    it('should clear timeout on successful response', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await client.fetchWithTimeout('/api/test', {}, 5000);

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('should clear timeout on fetch error', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        client.fetchWithTimeout('/api/test', {}, 5000)
      ).rejects.toThrow('Network error');

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });
});
