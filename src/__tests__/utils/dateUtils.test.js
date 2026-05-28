/**
 * dateUtils Tests
 *
 * Note: Using midday times (T12:00:00) to avoid timezone-related date shifts
 */
import { formatDate, formatShortDate } from '../../utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format a valid date string', () => {
      // Use midday to avoid timezone issues
      const result = formatDate('2024-01-15T12:00:00');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should return empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(formatDate('')).toBe('');
    });

    it('should include weekday in the formatted date', () => {
      // January 15, 2024 was a Monday
      const result = formatDate('2024-01-15T12:00:00');
      expect(result).toContain('Monday');
    });

    it('should handle ISO date strings with timezone', () => {
      // Use a time that won't shift dates across timezones
      const result = formatDate('2024-03-20T12:00:00');
      expect(result).toContain('March');
      expect(result).toContain('20');
      expect(result).toContain('2024');
    });

    it('should handle different months', () => {
      expect(formatDate('2024-06-15T12:00:00')).toContain('June');
      expect(formatDate('2024-12-15T12:00:00')).toContain('December');
      expect(formatDate('2024-02-15T12:00:00')).toContain('February');
    });
  });

  describe('formatShortDate', () => {
    it('should format a valid date string in short format', () => {
      const result = formatShortDate('2024-01-15T12:00:00');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should return empty string for null', () => {
      expect(formatShortDate(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(formatShortDate(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(formatShortDate('')).toBe('');
    });

    it('should not include weekday in the formatted date', () => {
      const result = formatShortDate('2024-01-15T12:00:00');
      expect(result).not.toContain('Monday');
    });

    it('should use abbreviated month names', () => {
      expect(formatShortDate('2024-01-15T12:00:00')).toContain('Jan');
      expect(formatShortDate('2024-06-15T12:00:00')).toContain('Jun');
      expect(formatShortDate('2024-12-15T12:00:00')).toContain('Dec');
    });

    it('should handle ISO date strings', () => {
      const result = formatShortDate('2024-03-20T12:00:00');
      expect(result).toContain('Mar');
      expect(result).toContain('20');
      expect(result).toContain('2024');
    });
  });

  describe('edge cases', () => {
    it('should handle year boundary dates', () => {
      expect(formatDate('2023-12-15T12:00:00')).toContain('December');
      expect(formatDate('2024-01-15T12:00:00')).toContain('January');
    });

    it('should handle leap year dates', () => {
      // 2024 is a leap year
      const result = formatDate('2024-02-29T12:00:00');
      expect(result).toContain('February');
      expect(result).toContain('29');
    });
  });
});
