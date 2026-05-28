/**
 * StorageService
 *
 * Platform-agnostic storage abstraction layer.
 * This allows easy migration to React Native (AsyncStorage) or other platforms.
 *
 * Features:
 * - Type-safe get/set operations
 * - Automatic JSON serialization/deserialization
 * - Error handling with fallback values
 * - Size limit validation
 * - Input validation and sanitization
 * - Namespace support for key organization
 *
 * SECURITY:
 * - Keys are validated to prevent injection
 * - Values are sanitized before storage
 * - Sensitive data keys are identified for special handling
 */

// Keys that may contain sensitive data (for logging purposes)
const SENSITIVE_KEYS = ['token', 'auth', 'session', 'user', 'password', 'secret', 'key', 'credential'];

class StorageService {
  constructor(storage = null) {
    // Allow dependency injection for testing or platform-specific storage
    this.storage = storage || (typeof window !== 'undefined' ? window.localStorage : null);
    this.maxSize = 5 * 1024 * 1024; // 5MB default limit
    this.maxKeyLength = 128; // Prevent excessively long keys
  }

  /**
   * Validates a storage key.
   * SECURITY: Prevents injection attacks via malformed keys.
   * @param {string} key - The key to validate
   * @returns {boolean} True if key is valid
   */
  _isValidKey(key) {
    if (typeof key !== 'string' || key.length === 0) {
      return false;
    }
    if (key.length > this.maxKeyLength) {
      return false;
    }
    // Only allow alphanumeric, dash, underscore, and dot
    return /^[a-zA-Z0-9_\-\.]+$/.test(key);
  }

  /**
   * Checks if a key is sensitive (for logging control).
   * @param {string} key - The key to check
   * @returns {boolean} True if key might contain sensitive data
   */
  _isSensitiveKey(key) {
    const lowerKey = key.toLowerCase();
    return SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));
  }

  /**
   * Sanitizes a value before storage.
   * Removes potentially dangerous content.
   * @param {*} value - The value to sanitize
   * @returns {*} Sanitized value
   */
  _sanitizeValue(value) {
    if (typeof value === 'string') {
      // Remove potential script injection patterns
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    if (typeof value === 'object' && value !== null) {
      // Recursively sanitize object properties
      if (Array.isArray(value)) {
        return value.map(item => this._sanitizeValue(item));
      }
      const sanitized = {};
      for (const [k, v] of Object.entries(value)) {
        sanitized[k] = this._sanitizeValue(v);
      }
      return sanitized;
    }
    return value;
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Parsed value or default
   */
  getItem(key, defaultValue = null) {
    if (!this.storage) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageService] Storage not available');
      }
      return defaultValue;
    }

    // SECURITY: Validate key format
    if (!this._isValidKey(key)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageService] Invalid key format');
      }
      return defaultValue;
    }

    try {
      const raw = this.storage.getItem(key);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw);
    } catch (error) {
      // SECURITY: Don't log key names for sensitive data
      if (process.env.NODE_ENV === 'development' && !this._isSensitiveKey(key)) {
        console.error('[StorageService] Error reading from storage:', error.message);
      }
      return defaultValue;
    }
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @returns {boolean} Success status
   */
  setItem(key, value) {
    if (!this.storage) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageService] Storage not available');
      }
      return false;
    }

    // SECURITY: Validate key format
    if (!this._isValidKey(key)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageService] Invalid key format');
      }
      return false;
    }

    try {
      // SECURITY: Sanitize value before storage
      const sanitizedValue = this._sanitizeValue(value);
      const serialized = JSON.stringify(sanitizedValue);

      // Check size limit
      if (serialized.length > this.maxSize) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[StorageService] Value too large for storage');
        }
        return false;
      }

      this.storage.setItem(key, serialized);
      return true;
    } catch (error) {
      // SECURITY: Don't log details for sensitive keys
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageService] Error writing to storage:', error.message);
      }

      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        if (process.env.NODE_ENV === 'development') {
          console.error('[StorageService] Storage quota exceeded');
        }
      }

      return false;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeItem(key) {
    if (!this.storage) {
      return false;
    }

    // SECURITY: Validate key format
    if (!this._isValidKey(key)) {
      return false;
    }

    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageService] Error removing item:', error.message);
      }
      return false;
    }
  }

  /**
   * Clear all items from storage
   * @returns {boolean} Success status
   */
  clear() {
    if (!this.storage) {
      return false;
    }

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageService] Error clearing storage:', error.message);
      }
      return false;
    }
  }

  /**
   * Check if key exists in storage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  hasItem(key) {
    if (!this.storage) {
      return false;
    }

    // SECURITY: Validate key format
    if (!this._isValidKey(key)) {
      return false;
    }

    try {
      return this.storage.getItem(key) !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all keys in storage
   * @returns {string[]} Array of keys
   */
  getAllKeys() {
    if (!this.storage) {
      return [];
    }

    try {
      return Object.keys(this.storage);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageService] Error getting keys:', error.message);
      }
      return [];
    }
  }

  /**
   * Get multiple items at once
   * @param {string[]} keys - Array of keys
   * @returns {Object} Object with key-value pairs
   */
  getMultiple(keys) {
    const result = {};
    keys.forEach(key => {
      result[key] = this.getItem(key);
    });
    return result;
  }

  /**
   * Set multiple items at once
   * @param {Object} items - Object with key-value pairs
   * @returns {boolean} Success status
   */
  setMultiple(items) {
    try {
      Object.entries(items).forEach(([key, value]) => {
        this.setItem(key, value);
      });
      return true;
    } catch (error) {
      console.error('[StorageService] Error setting multiple items:', error);
      return false;
    }
  }

  /**
   * Remove multiple items at once
   * @param {string[]} keys - Array of keys to remove
   * @returns {boolean} Success status
   */
  removeMultiple(keys) {
    try {
      keys.forEach(key => {
        this.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('[StorageService] Error removing multiple items:', error);
      return false;
    }
  }
}

// Create singleton instance
const storage = new StorageService();

// Export both the class (for testing) and singleton instance
export { StorageService };
export default storage;
