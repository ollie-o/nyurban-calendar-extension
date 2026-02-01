import { formatTime } from './formatTime';

describe('formatTime', () => {
  it('should format a time string correctly', () => {
    const result = formatTime('2024-01-15T18:30:00');
    expect(result).toBe('6:30 PM');
  });

  it('should handle morning times', () => {
    const result = formatTime('2024-01-15T09:15:00');
    expect(result).toBe('9:15 AM');
  });

  it('should handle noon', () => {
    const result = formatTime('2024-01-15T12:00:00');
    expect(result).toBe('12:00 PM');
  });

  it('should handle midnight', () => {
    const result = formatTime('2024-01-15T00:30:00');
    expect(result).toBe('12:30 AM');
  });

  it('should pad minutes with leading zero', () => {
    const result = formatTime('2024-01-15T14:05:00');
    expect(result).toBe('2:05 PM');
  });
});
