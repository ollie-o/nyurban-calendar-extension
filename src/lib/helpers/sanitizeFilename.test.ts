import { sanitizeFilename } from './sanitizeFilename';

describe('sanitizeFilename', () => {
  it('should convert to lowercase', () => {
    const result = sanitizeFilename('Schedule 2024');
    expect(result).toBe('schedule-2024');
  });

  it('should replace spaces with dashes', () => {
    const result = sanitizeFilename('NY Urban Schedule');
    expect(result).toBe('ny-urban-schedule');
  });

  it('should remove special characters', () => {
    const result = sanitizeFilename('Schedule (2024) @Latest');
    expect(result).toBe('schedule-2024-latest');
  });

  it('should keep alphanumeric characters and dashes', () => {
    const result = sanitizeFilename('test-123-abc');
    expect(result).toBe('test-123-abc');
  });

  it('should handle multiple consecutive spaces', () => {
    const result = sanitizeFilename('NY    Urban   Schedule');
    expect(result).toBe('ny-urban-schedule');
  });
});
