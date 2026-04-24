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
 * - Namespace support for key organization
 */

class StorageService {
  constructor(storage = null) {
    // Allow dependency injection for testing or platform-specific storage
    this.storage = storage || (typeof window !== 'undefined' ? window.localStorage : null);
    this.maxSize = 5 * 1024 * 1024; // 5MB default limit
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Parsed value or default
   */
  getItem(key, defaultValue = null) {
    if (!this.storage) {
      console.warn('[StorageService] Storage not available');
      return defaultValue;
    }

    try {
      const raw = this.storage.getItem(key);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw);
    } catch (error) {
      console.error(`[StorageService] Error reading key "${key}":`, error);
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
      console.warn('[StorageService] Storage not available');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);

      // Check size limit
      if (serialized.length > this.maxSize) {
        console.error(`[StorageService] Value too large for key "${key}". Size: ${serialized.length} bytes`);
        return false;
      }

      this.storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`[StorageService] Error writing key "${key}":`, error);

      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.error('[StorageService] Storage quota exceeded. Consider clearing old data.');
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
      console.warn('[StorageService] Storage not available');
      return false;
    }

    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[StorageService] Error removing key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   * @returns {boolean} Success status
   */
  clear() {
    if (!this.storage) {
      console.warn('[StorageService] Storage not available');
      return false;
    }

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('[StorageService] Error clearing storage:', error);
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

    try {
      return this.storage.getItem(key) !== null;
    } catch (error) {
      console.error(`[StorageService] Error checking key "${key}":`, error);
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
      console.error('[StorageService] Error getting keys:', error);
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
