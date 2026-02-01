import { getCurrentOrNextYear } from './getCurrentOrNextYear';

describe('getCurrentOrNextYear', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return current year for dates closer to today in current year', () => {
    // Set mock date to January 15, 2026
    jest.setSystemTime(new Date(2026, 0, 15));

    const result = getCurrentOrNextYear(1, 20);
    expect(result).toBe(2026);
  });

  it('should return next year for dates closer to today in next year', () => {
    // Set mock date to December 20, 2026
    jest.setSystemTime(new Date(2026, 11, 20));

    const result = getCurrentOrNextYear(1, 15);
    expect(result).toBe(2027);
  });

  it('should return current year for dates in the same month', () => {
    // Set mock date to February 10, 2026
    jest.setSystemTime(new Date(2026, 1, 10));

    const result = getCurrentOrNextYear(2, 20);
    expect(result).toBe(2026);
  });
});
