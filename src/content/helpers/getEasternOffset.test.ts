import { getEasternOffset } from './getEasternOffset';

describe('getEasternOffset', () => {
  it('should return EST (-05:00) for January date', () => {
    const result = getEasternOffset(2026, 1, 15, 18, 30);
    expect(result).toBe('-05:00');
  });

  it('should return EDT (-04:00) for July date', () => {
    const result = getEasternOffset(2026, 7, 15, 18, 30);
    expect(result).toBe('-04:00');
  });

  it('should return EST (-05:00) for early November date (after DST ends)', () => {
    const result = getEasternOffset(2026, 11, 1, 18, 30);
    expect(result).toBe('-05:00');
  });
});
