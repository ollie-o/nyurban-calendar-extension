import { isValidGame } from './isValidGame';

describe('isValidGame', () => {
  const testCases = [
    {
      name: 'valid game returns true',
      input: {
        gameNumber: 1,
        teamName: 'Test Team',
        opponent: 'Opponent',
        date: '2026-02-15T19:00:00-05:00',
        location: 'Gym',
        locationDetails: '123 Main St\nNotes about location',
      },
      expected: true,
    },
    {
      name: 'missing opponent returns false',
      input: {
        gameNumber: 1,
        teamName: 'Test Team',
        date: '2026-02-15T19:00:00-05:00',
        location: 'Gym',
        locationDetails: '123 Main St\nNotes about location',
      },
      expected: false,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(isValidGame(input)).toBe(expected);
    });
  });
});
