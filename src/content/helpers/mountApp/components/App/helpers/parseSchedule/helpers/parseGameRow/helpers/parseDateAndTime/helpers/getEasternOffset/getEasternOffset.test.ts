import { getEasternOffset } from './getEasternOffset';

describe('getEasternOffset', () => {
  const testCases = [
    {
      name: 'January (EST)',
      input: { year: 2026, month: 1, day: 15, hour: 18, minute: 30 },
      expected: '-05:00',
    },
    {
      name: 'July (EDT)',
      input: { year: 2026, month: 7, day: 15, hour: 19, minute: 0 },
      expected: '-04:00',
    },
    {
      name: 'Early November after DST ends (EST)',
      input: { year: 2026, month: 11, day: 5, hour: 20, minute: 0 },
      expected: '-05:00',
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const offset = getEasternOffset(input.year, input.month, input.day, input.hour, input.minute);
      expect(offset).toBe(expected);
    });
  });
});
