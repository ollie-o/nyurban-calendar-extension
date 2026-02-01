import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format a date string correctly', () => {
    const result = formatDate('2024-01-15T00:00:00');
    expect(result).toBe('Mon, Jan 15');
  });

  it('should format a different date', () => {
    const result = formatDate('2024-12-25T00:00:00');
    expect(result).toContain('Dec 25');
  });

  it('should include weekday, month, and day', () => {
    const result = formatDate('2024-06-21T00:00:00');
    const parts = result.split(', ');
    expect(parts.length).toBe(2);
  });

  it('should handle edge dates', () => {
    const result = formatDate('2024-01-01T00:00:00');
    expect(result).toContain('Jan 1');
  });

  it('should format correctly for different years', () => {
    const result = formatDate('2025-03-15T00:00:00');
    expect(result).toContain('Mar 15');
  });
});
