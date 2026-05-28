/**
 * ErrorHandler Service Tests
 */

import { ErrorTypes, AppError } from '../../../core/services/ErrorHandler';

describe('ErrorHandler', () => {
  describe('ErrorTypes', () => {
    it('should have all expected error types', () => {
      expect(ErrorTypes.NETWORK).toBe('NETWORK_ERROR');
      expect(ErrorTypes.AUTH).toBe('AUTH_ERROR');
      expect(ErrorTypes.VALIDATION).toBe('VALIDATION_ERROR');
      expect(ErrorTypes.NOT_FOUND).toBe('NOT_FOUND_ERROR');
      expect(ErrorTypes.SERVER).toBe('SERVER_ERROR');
      expect(ErrorTypes.UNKNOWN).toBe('UNKNOWN_ERROR');
    });
  });

  describe('AppError', () => {
    it('should create error with message', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('AppError');
    });

    it('should create error with type', () => {
      const error = new AppError('Auth failed', ErrorTypes.AUTH);

      expect(error.type).toBe(ErrorTypes.AUTH);
    });

    it('should create error with status code', () => {
      const error = new AppError('Not found', ErrorTypes.NOT_FOUND, 404);

      expect(error.statusCode).toBe(404);
    });

    it('should create error with original error', () => {
      const originalError = new Error('Original');
      const error = new AppError('Wrapped', ErrorTypes.UNKNOWN, null, originalError);

      expect(error.originalError).toBe(originalError);
    });

    it('should have timestamp', () => {
      const before = new Date().toISOString();
      const error = new AppError('Test');
      const after = new Date().toISOString();

      expect(error.timestamp).toBeDefined();
      expect(error.timestamp >= before).toBe(true);
      expect(error.timestamp <= after).toBe(true);
    });

    it('should default to UNKNOWN type', () => {
      const error = new AppError('Test');

      expect(error.type).toBe(ErrorTypes.UNKNOWN);
    });

    it('should default statusCode to null', () => {
      const error = new AppError('Test');

      expect(error.statusCode).toBeNull();
    });

    it('should be instanceof Error', () => {
      const error = new AppError('Test');

      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    it('should work with try/catch', () => {
      let caught = null;

      try {
        throw new AppError('Test error', ErrorTypes.VALIDATION, 400);
      } catch (error) {
        caught = error;
      }

      expect(caught).toBeInstanceOf(AppError);
      expect(caught.message).toBe('Test error');
      expect(caught.type).toBe(ErrorTypes.VALIDATION);
      expect(caught.statusCode).toBe(400);
    });
  });

  describe('Error categorization', () => {
    it('should categorize network errors correctly', () => {
      const networkError = new AppError('Network unavailable', ErrorTypes.NETWORK);
      expect(networkError.type).toBe('NETWORK_ERROR');
    });

    it('should categorize auth errors correctly', () => {
      const authError = new AppError('Unauthorized', ErrorTypes.AUTH, 401);
      expect(authError.type).toBe('AUTH_ERROR');
      expect(authError.statusCode).toBe(401);
    });

    it('should categorize validation errors correctly', () => {
      const validationError = new AppError('Invalid input', ErrorTypes.VALIDATION, 400);
      expect(validationError.type).toBe('VALIDATION_ERROR');
      expect(validationError.statusCode).toBe(400);
    });

    it('should categorize not found errors correctly', () => {
      const notFoundError = new AppError('Resource not found', ErrorTypes.NOT_FOUND, 404);
      expect(notFoundError.type).toBe('NOT_FOUND_ERROR');
      expect(notFoundError.statusCode).toBe(404);
    });

    it('should categorize server errors correctly', () => {
      const serverError = new AppError('Internal server error', ErrorTypes.SERVER, 500);
      expect(serverError.type).toBe('SERVER_ERROR');
      expect(serverError.statusCode).toBe(500);
    });
  });

  describe('Error handling patterns', () => {
    it('should support error chaining', () => {
      const originalError = new TypeError('Cannot read property');
      const appError = new AppError(
        'Failed to process data',
        ErrorTypes.UNKNOWN,
        null,
        originalError
      );

      expect(appError.message).toBe('Failed to process data');
      expect(appError.originalError.message).toBe('Cannot read property');
    });

    it('should support HTTP error mapping', () => {
      const httpStatusToErrorType = (status) => {
        if (status === 401 || status === 403) return ErrorTypes.AUTH;
        if (status === 404) return ErrorTypes.NOT_FOUND;
        if (status === 400 || status === 422) return ErrorTypes.VALIDATION;
        if (status >= 500) return ErrorTypes.SERVER;
        return ErrorTypes.UNKNOWN;
      };

      expect(httpStatusToErrorType(401)).toBe(ErrorTypes.AUTH);
      expect(httpStatusToErrorType(403)).toBe(ErrorTypes.AUTH);
      expect(httpStatusToErrorType(404)).toBe(ErrorTypes.NOT_FOUND);
      expect(httpStatusToErrorType(400)).toBe(ErrorTypes.VALIDATION);
      expect(httpStatusToErrorType(422)).toBe(ErrorTypes.VALIDATION);
      expect(httpStatusToErrorType(500)).toBe(ErrorTypes.SERVER);
      expect(httpStatusToErrorType(503)).toBe(ErrorTypes.SERVER);
      expect(httpStatusToErrorType(418)).toBe(ErrorTypes.UNKNOWN);
    });
  });

  describe('Error message formatting', () => {
    it('should preserve error message', () => {
      const messages = [
        'Session expired',
        'Invalid credentials',
        'Network request failed',
        'Resource not found',
      ];

      messages.forEach((msg) => {
        const error = new AppError(msg);
        expect(error.message).toBe(msg);
      });
    });

    it('should support empty message', () => {
      const error = new AppError('');
      expect(error.message).toBe('');
    });

    it('should convert to string correctly', () => {
      const error = new AppError('Test error');
      expect(error.toString()).toContain('Test error');
    });
  });
});
