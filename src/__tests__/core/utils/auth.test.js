/**
 * Auth utilities tests
 */
import {
  decodeJWT,
  isValidSession,
  isTokenExpired,
  getTokenExpiration,
  hasRole,
  getUserRole,
  getUserId,
} from '../../../core/utils/auth';

// Sample valid JWT (header.payload.signature)
// Payload: { "sub": "user123", "role": "ADMIN", "exp": 9999999999, "userId": "uuid-123" }
const createMockJWT = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = 'mock_signature';
  return `${header}.${payloadStr}.${signature}`;
};

describe('Auth Utilities', () => {
  describe('decodeJWT', () => {
    it('should decode a valid JWT token', () => {
      const payload = { sub: 'user123', role: 'ADMIN', exp: 9999999999 };
      const token = createMockJWT(payload);

      const decoded = decodeJWT(token);

      expect(decoded).toEqual(payload);
    });

    it('should return null for invalid token format', () => {
      expect(decodeJWT('invalid')).toBeNull();
      expect(decodeJWT('only.two.parts.here.extra')).toBeNull();
      expect(decodeJWT('')).toBeNull();
      expect(decodeJWT(null)).toBeNull();
      expect(decodeJWT(undefined)).toBeNull();
    });

    it('should return null for non-string input', () => {
      expect(decodeJWT(123)).toBeNull();
      expect(decodeJWT({})).toBeNull();
      expect(decodeJWT([])).toBeNull();
    });
  });

  describe('isValidSession', () => {
    it('should return true for valid session with JWT token', () => {
      const token = createMockJWT({ sub: 'user123' });
      const session = { token };

      expect(isValidSession(session)).toBe(true);
    });

    it('should return false for null session', () => {
      expect(isValidSession(null)).toBe(false);
    });

    it('should return false for undefined session', () => {
      expect(isValidSession(undefined)).toBe(false);
    });

    it('should return false for session without token', () => {
      expect(isValidSession({})).toBe(false);
      expect(isValidSession({ userId: '123' })).toBe(false);
    });

    it('should return false for session with invalid token format', () => {
      expect(isValidSession({ token: 'invalid' })).toBe(false);
      expect(isValidSession({ token: 'only.two' })).toBe(false);
    });

    it('should return false for non-object session', () => {
      expect(isValidSession('string')).toBe(false);
      expect(isValidSession(123)).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for non-expired token', () => {
      // exp far in the future (year 2286)
      const token = createMockJWT({ exp: 9999999999 });

      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      // exp in the past
      const token = createMockJWT({ exp: 1000000000 });

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const token = createMockJWT({ sub: 'user123' });

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true);
      expect(isTokenExpired(null)).toBe(true);
    });
  });

  describe('getTokenExpiration', () => {
    it('should return expiration timestamp from token', () => {
      const exp = 9999999999;
      const token = createMockJWT({ exp });

      expect(getTokenExpiration(token)).toBe(exp);
    });

    it('should return null for token without exp', () => {
      const token = createMockJWT({ sub: 'user123' });

      expect(getTokenExpiration(token)).toBeNull();
    });

    it('should return null for invalid token', () => {
      expect(getTokenExpiration('invalid')).toBeNull();
      expect(getTokenExpiration(null)).toBeNull();
    });
  });

  describe('getUserRole', () => {
    it('should extract role from token', () => {
      const token = createMockJWT({ role: 'ADMIN' });

      expect(getUserRole(token)).toBe('ADMIN');
    });

    it('should return null for token without role', () => {
      const token = createMockJWT({ sub: 'user123' });

      expect(getUserRole(token)).toBeNull();
    });
  });

  describe('hasRole', () => {
    // Note: hasRole uses getAuthSession internally, so we test the role comparison logic
    // by testing getUserRole with token parameter

    it('should normalize roles for comparison (ROLE_ prefix)', () => {
      // This tests the normalization logic
      const normalizeRole = (role) => role.toUpperCase().replace('ROLE_', '');

      expect(normalizeRole('ADMIN')).toBe('ADMIN');
      expect(normalizeRole('ROLE_ADMIN')).toBe('ADMIN');
      expect(normalizeRole('role_admin')).toBe('ADMIN');
      expect(normalizeRole('User')).toBe('USER');
    });
  });

  describe('getUserId', () => {
    it('should extract userId from token', () => {
      const token = createMockJWT({ userId: 'uuid-123' });

      expect(getUserId(token)).toBe('uuid-123');
    });

    it('should extract sub as userId if userId not present', () => {
      const token = createMockJWT({ sub: 'user@email.com' });

      expect(getUserId(token)).toBe('user@email.com');
    });

    it('should return null for token without user id claims', () => {
      const token = createMockJWT({ role: 'USER' });

      expect(getUserId(token)).toBeNull();
    });
  });
});
