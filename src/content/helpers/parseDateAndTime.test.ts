import { parseDateAndTime } from './parseDateAndTime';

describe('parseDateAndTime', () => {
  it('should parse date and time with am/pm', () => {
    const result = parseDateAndTime('1/14', '6:30 pm');
    expect(result.isErr()).toBe(false);
    if (!result.isErr()) {
      expect(result.value).toContain('T18:30:00');
    }
  });

  it('should parse date and time without am/pm (evening games)', () => {
    const result = parseDateAndTime('1/14', '6:30');
    expect(result.isErr()).toBe(false);
    if (!result.isErr()) {
      expect(result.value).toContain('T18:30:00');
    }
  });

  it('should return error for invalid date values', () => {
    const result = parseDateAndTime('13/50', '6:30 pm');
    expect(result.isErr()).toBe(true);
  });

  it('should return empty string for invalid time format', () => {
    const result = parseDateAndTime('1/14', 'invalid');
    expect(result.isErr()).toBe(false);
    if (!result.isErr()) {
      expect(result.value).toBe('');
    }
  });
});
