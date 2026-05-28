/**
 * Transformers Tests
 */
import {
  generateUniqueId,
  transformMessageToUI,
  transformMessageToAPI,
  transformMessagesToUI,
  transformMessagesToAPI,
  transformConversationToUI,
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  sanitizeInput,
  truncateText,
  parseQueryString,
  buildQueryString,
  deepClone,
  isEmpty,
  debounce,
  throttle,
  textWithLineBreaks,
  textWithHighlight,
} from '../../../core/utils/transformers';

// Mock logger
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

describe('transformers', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();

      expect(id1).toBeDefined();
      expect(typeof id1).toBe('string');
      expect(id1).not.toBe(id2);
    });

    it('should contain timestamp', () => {
      const before = Date.now();
      const id = generateUniqueId();
      const after = Date.now();

      const timestamp = parseInt(id.split('-')[0], 10);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('transformMessageToUI', () => {
    it('should transform assistant message', () => {
      const message = {
        id: '123',
        role: 'assistant',
        content: 'Hello!',
        createdAt: '2024-01-15T12:00:00Z',
      };

      const result = transformMessageToUI(message);

      expect(result.id).toBe('123');
      expect(result.from).toBe('ai');
      expect(result.text).toBe('Hello!');
      expect(result.timestamp).toBe('2024-01-15T12:00:00Z');
    });

    it('should transform user message', () => {
      const message = {
        id: '456',
        role: 'user',
        content: 'Hi there',
      };

      const result = transformMessageToUI(message);

      expect(result.from).toBe('user');
      expect(result.text).toBe('Hi there');
    });

    it('should generate ID if missing', () => {
      const message = { role: 'user', content: 'Test' };
      const result = transformMessageToUI(message);

      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('should handle step and stepName', () => {
      const message = {
        role: 'assistant',
        content: 'Step message',
        step: 3,
        stepName: 'Analysis',
      };

      const result = transformMessageToUI(message);

      expect(result.step).toBe(3);
      expect(result.stepName).toBe('Analysis');
    });

    it('should handle primaryAction and uiActions', () => {
      const message = {
        role: 'assistant',
        content: 'Action message',
        primaryAction: { type: 'confirm' },
        uiActions: [{ id: 1 }, { id: 2 }],
      };

      const result = transformMessageToUI(message);

      expect(result.primaryAction).toEqual({ type: 'confirm' });
      expect(result.uiActions).toHaveLength(2);
    });

    it('should default needsApproval to false', () => {
      const result = transformMessageToUI({ role: 'user', content: 'Test' });
      expect(result.needsApproval).toBe(false);
    });
  });

  describe('transformMessageToAPI', () => {
    it('should transform ai message to assistant role', () => {
      const message = { from: 'ai', text: 'Hello' };
      const result = transformMessageToAPI(message);

      expect(result.role).toBe('assistant');
      expect(result.content).toBe('Hello');
    });

    it('should transform user message to user role', () => {
      const message = { from: 'user', text: 'Hi' };
      const result = transformMessageToAPI(message);

      expect(result.role).toBe('user');
      expect(result.content).toBe('Hi');
    });
  });

  describe('transformMessagesToUI', () => {
    it('should transform array of messages', () => {
      const messages = [
        { id: '1', role: 'user', content: 'Hi' },
        { id: '2', role: 'assistant', content: 'Hello' },
      ];

      const result = transformMessagesToUI(messages);

      expect(result).toHaveLength(2);
      expect(result[0].from).toBe('user');
      expect(result[1].from).toBe('ai');
    });

    it('should return empty array for non-array input', () => {
      expect(transformMessagesToUI(null)).toEqual([]);
      expect(transformMessagesToUI(undefined)).toEqual([]);
      expect(transformMessagesToUI('string')).toEqual([]);
      expect(transformMessagesToUI({})).toEqual([]);
    });
  });

  describe('transformMessagesToAPI', () => {
    it('should transform array of UI messages', () => {
      const messages = [
        { from: 'user', text: 'Hi' },
        { from: 'ai', text: 'Hello' },
      ];

      const result = transformMessagesToAPI(messages);

      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('user');
      expect(result[1].role).toBe('assistant');
    });

    it('should return empty array for non-array input', () => {
      expect(transformMessagesToAPI(null)).toEqual([]);
      expect(transformMessagesToAPI(undefined)).toEqual([]);
    });
  });

  describe('transformConversationToUI', () => {
    it('should transform conversation object', () => {
      const conversation = {
        id: 'conv-123',
        title: 'Test Conversation',
        founderId: 'founder-1',
        sessionId: 'session-1',
        messages: [{ id: '1', role: 'user', content: 'Hi' }],
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T13:00:00Z',
      };

      const result = transformConversationToUI(conversation);

      expect(result.id).toBe('conv-123');
      expect(result.title).toBe('Test Conversation');
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].from).toBe('user');
    });

    it('should use default title if missing', () => {
      const conversation = { id: '1' };
      const result = transformConversationToUI(conversation);

      expect(result.title).toBe('Untitled Conversation');
    });

    it('should handle missing messages', () => {
      const conversation = { id: '1' };
      const result = transformConversationToUI(conversation);

      expect(result.messages).toEqual([]);
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2024-01-15T12:00:00Z');
      expect(result).toContain('2024');
    });

    it('should format Date object', () => {
      const date = new Date('2024-06-15T12:00:00');
      const result = formatDate(date);
      expect(result).toContain('2024');
    });

    it('should return "Invalid date" for invalid input', () => {
      expect(formatDate('not-a-date')).toBe('Invalid date');
      expect(formatDate(null)).toBe('Invalid date');
    });

    it('should accept custom options', () => {
      const result = formatDate('2024-01-15T12:00:00', { month: 'long' });
      expect(result).toBeDefined();
    });
  });

  describe('formatTime', () => {
    it('should format time from date', () => {
      const result = formatTime('2024-01-15T14:30:00');
      expect(result).toBeDefined();
    });
  });

  describe('formatDateTime', () => {
    it('should format both date and time', () => {
      const result = formatDateTime('2024-01-15T14:30:00');
      expect(result).toContain('2024');
    });
  });

  describe('getRelativeTime', () => {
    it('should return "Ahora mismo" for recent times', () => {
      const now = new Date();
      const result = getRelativeTime(now);
      expect(result).toBe('Ahora mismo');
    });

    it('should return minutes for times less than an hour ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = getRelativeTime(fiveMinutesAgo);
      expect(result).toContain('minuto');
    });

    it('should return hours for times less than a day ago', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      const result = getRelativeTime(threeHoursAgo);
      expect(result).toContain('hora');
    });

    it('should return days for times less than a week ago', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const result = getRelativeTime(twoDaysAgo);
      expect(result).toContain('día');
    });

    it('should return formatted date for older times', () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const result = getRelativeTime(twoWeeksAgo);
      expect(result).not.toContain('día');
    });

    it('should return "Invalid date" for invalid input', () => {
      expect(getRelativeTime('not-a-date')).toBe('Invalid date');
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeInput(input);

      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should escape quotes', () => {
      const result = sanitizeInput('Hello "world" and \'test\'');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });

    it('should escape forward slashes', () => {
      const result = sanitizeInput('path/to/file');
      expect(result).toContain('&#x2F;');
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);

      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);

      expect(result).toBe('Short text');
    });

    it('should use default maxLength of 100', () => {
      const longText = 'a'.repeat(150);
      const result = truncateText(longText);

      expect(result.length).toBe(103); // 100 + '...'
    });

    it('should return empty string for non-string input', () => {
      expect(truncateText(null)).toBe('');
      expect(truncateText(123)).toBe('');
    });
  });

  describe('parseQueryString', () => {
    it('should parse query string with ?', () => {
      const result = parseQueryString('?foo=bar&baz=qux');

      expect(result.foo).toBe('bar');
      expect(result.baz).toBe('qux');
    });

    it('should parse query string without ?', () => {
      const result = parseQueryString('foo=bar&baz=qux');

      expect(result.foo).toBe('bar');
      expect(result.baz).toBe('qux');
    });

    it('should handle empty string', () => {
      const result = parseQueryString('');
      expect(result).toEqual({});
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from object', () => {
      const result = buildQueryString({ foo: 'bar', baz: 'qux' });

      expect(result).toContain('foo=bar');
      expect(result).toContain('baz=qux');
    });

    it('should skip null and undefined values', () => {
      const result = buildQueryString({ foo: 'bar', baz: null, qux: undefined });

      expect(result).toContain('foo=bar');
      expect(result).not.toContain('baz');
      expect(result).not.toContain('qux');
    });

    it('should handle empty object', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });
  });

  describe('deepClone', () => {
    it('should deep clone object', () => {
      const original = { a: 1, b: { c: 2, d: [1, 2, 3] } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should clone arrays', () => {
      const original = [1, 2, { a: 3 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should return original for non-clonable objects', () => {
      const circular = { a: 1 };
      circular.self = circular;

      // Should not throw, returns original
      const result = deepClone(circular);
      expect(result).toBe(circular);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return false for non-empty primitives', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(123)).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 300);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 300);

      debouncedFunc('arg1', 'arg2');
      jest.advanceTimersByTime(300);

      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should throttle function calls', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 300);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(300);
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('textWithLineBreaks', () => {
    it('should split text by newlines', () => {
      const result = textWithLineBreaks('Line 1\nLine 2\nLine 3');

      expect(result).toHaveLength(5); // 3 lines + 2 br elements
      expect(result[0]).toBe('Line 1');
      expect(result[1]).toEqual({ type: 'br', key: 'br-0' });
      expect(result[2]).toBe('Line 2');
    });

    it('should handle text without newlines', () => {
      const result = textWithLineBreaks('No newlines here');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('No newlines here');
    });

    it('should return empty string for non-string input', () => {
      expect(textWithLineBreaks(null)).toBe('');
      expect(textWithLineBreaks(123)).toBe('');
    });
  });

  describe('textWithHighlight', () => {
    it('should highlight word in text', () => {
      const result = textWithHighlight('Hello world, world!', 'world');

      // 'Hello world, world!' split by 'world' = ['Hello ', ', ', '!']
      // Interleaved: ['Hello ', {strong}, ', ', {strong}, '!']
      expect(result).toHaveLength(5);
      expect(result[0]).toBe('Hello ');
      expect(result[1]).toEqual({ type: 'strong', content: 'world', key: 'hl-0' });
      expect(result[2]).toBe(', ');
      expect(result[3]).toEqual({ type: 'strong', content: 'world', key: 'hl-1' });
      expect(result[4]).toBe('!');
    });

    it('should return original text if no highlight', () => {
      const result = textWithHighlight('Hello world', '');
      expect(result).toEqual(['Hello world']);
    });

    it('should handle non-string text', () => {
      expect(textWithHighlight(null, 'test')).toEqual([null]);
    });
  });
});
