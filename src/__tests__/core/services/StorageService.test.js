/**
 * StorageService Tests
 */
import { StorageService } from '../../../core/services/StorageService';

describe('StorageService', () => {
  let storage;
  let mockStorage;

  beforeEach(() => {
    // Create a mock storage object
    mockStorage = {
      store: {},
      getItem: jest.fn((key) => mockStorage.store[key] || null),
      setItem: jest.fn((key, value) => { mockStorage.store[key] = value; }),
      removeItem: jest.fn((key) => { delete mockStorage.store[key]; }),
      clear: jest.fn(() => { mockStorage.store = {}; }),
    };

    // Create StorageService with mock storage
    storage = new StorageService(mockStorage);
  });

  describe('getItem', () => {
    it('should return parsed JSON value', () => {
      mockStorage.store['test'] = JSON.stringify({ name: 'John' });

      const result = storage.getItem('test');

      expect(result).toEqual({ name: 'John' });
    });

    it('should return default value when key does not exist', () => {
      const result = storage.getItem('nonexistent', 'default');

      expect(result).toBe('default');
    });

    it('should return null as default when key does not exist', () => {
      const result = storage.getItem('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle primitive values', () => {
      mockStorage.store['number'] = JSON.stringify(42);
      mockStorage.store['string'] = JSON.stringify('hello');
      mockStorage.store['boolean'] = JSON.stringify(true);

      expect(storage.getItem('number')).toBe(42);
      expect(storage.getItem('string')).toBe('hello');
      expect(storage.getItem('boolean')).toBe(true);
    });

    it('should handle arrays', () => {
      mockStorage.store['array'] = JSON.stringify([1, 2, 3]);

      expect(storage.getItem('array')).toEqual([1, 2, 3]);
    });
  });

  describe('setItem', () => {
    it('should store JSON stringified value', () => {
      const result = storage.setItem('test', { name: 'John' });

      expect(result).toBe(true);
      expect(mockStorage.setItem).toHaveBeenCalledWith('test', '{"name":"John"}');
    });

    it('should handle primitive values', () => {
      storage.setItem('number', 42);
      storage.setItem('string', 'hello');
      storage.setItem('boolean', true);

      expect(mockStorage.setItem).toHaveBeenCalledWith('number', '42');
      expect(mockStorage.setItem).toHaveBeenCalledWith('string', '"hello"');
      expect(mockStorage.setItem).toHaveBeenCalledWith('boolean', 'true');
    });

    it('should reject values exceeding size limit', () => {
      // Create a very large string
      const largeValue = 'x'.repeat(6 * 1024 * 1024); // 6MB

      const result = storage.setItem('large', largeValue);

      expect(result).toBe(false);
      expect(mockStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should remove item from storage', () => {
      mockStorage.store['test'] = JSON.stringify('value');

      const result = storage.removeItem('test');

      expect(result).toBe(true);
      expect(mockStorage.removeItem).toHaveBeenCalledWith('test');
    });
  });

  describe('clear', () => {
    it('should clear all items from storage', () => {
      mockStorage.store['a'] = '1';
      mockStorage.store['b'] = '2';

      const result = storage.clear();

      expect(result).toBe(true);
      expect(mockStorage.clear).toHaveBeenCalled();
    });
  });

  describe('hasItem', () => {
    it('should return true when item exists', () => {
      mockStorage.store['exists'] = 'value';

      expect(storage.hasItem('exists')).toBe(true);
    });

    it('should return false when item does not exist', () => {
      expect(storage.hasItem('nonexistent')).toBe(false);
    });
  });

  describe('getMultiple', () => {
    it('should return multiple items', () => {
      mockStorage.store['a'] = JSON.stringify(1);
      mockStorage.store['b'] = JSON.stringify(2);

      const result = storage.getMultiple(['a', 'b', 'c']);

      expect(result).toEqual({
        a: 1,
        b: 2,
        c: null,
      });
    });
  });

  describe('setMultiple', () => {
    it('should set multiple items', () => {
      const result = storage.setMultiple({
        a: 1,
        b: 'two',
        c: { three: 3 },
      });

      expect(result).toBe(true);
      expect(mockStorage.setItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('removeMultiple', () => {
    it('should remove multiple items', () => {
      mockStorage.store['a'] = '1';
      mockStorage.store['b'] = '2';

      const result = storage.removeMultiple(['a', 'b']);

      expect(result).toBe(true);
      expect(mockStorage.removeItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('when storage is not available', () => {
    let noStorage;

    beforeEach(() => {
      // Create a StorageService with an explicitly undefined storage
      // We need to force the storage to be null by passing an object that simulates
      // unavailable storage (all operations throw errors)
      const brokenStorage = {
        getItem: () => { throw new Error('Storage unavailable'); },
        setItem: () => { throw new Error('Storage unavailable'); },
        removeItem: () => { throw new Error('Storage unavailable'); },
        clear: () => { throw new Error('Storage unavailable'); },
        key: () => null,
        length: 0,
      };
      noStorage = new StorageService(brokenStorage);
    });

    it('getItem should return default value on error', () => {
      expect(noStorage.getItem('test', 'default')).toBe('default');
    });

    it('setItem should return false on error', () => {
      expect(noStorage.setItem('test', 'value')).toBe(false);
    });

    it('removeItem should return false on error', () => {
      expect(noStorage.removeItem('test')).toBe(false);
    });

    it('clear should return false on error', () => {
      expect(noStorage.clear()).toBe(false);
    });

    it('hasItem should return false on error', () => {
      expect(noStorage.hasItem('test')).toBe(false);
    });

    it('getAllKeys should handle storage with no stored items', () => {
      // The mock storage has methods as properties, but no actual stored items
      // getAllKeys iterates over storage keys, which includes method names
      // This tests that getAllKeys doesn't throw when storage operations fail
      const keys = noStorage.getAllKeys();
      expect(Array.isArray(keys)).toBe(true);
    });
  });
});
