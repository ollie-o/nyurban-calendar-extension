import { generateICS } from '../src/lib/ics-generator';
import { Game } from '../src/lib/types';

describe('ICS Generator', () => {
  const mockGame: Game = {
    gameNumber: 1,
    teamName: 'Test Team',
    opponent: 'Opponent',
    date: '2026-02-15T19:00:00-05:00',
    time: '19:00',
    location: 'Gym',
    locationDetails: '123 Main St\nPlease arrive early',
    duration: 60,
  };

  const testCases = [
    {
      name: 'should generate ICS with single game',
      games: [mockGame],
      expectedEvents: 1,
      expectedTitle: 'Test Team game 1 vs. Opponent',
    },
    {
      name: 'should generate ICS with multiple games',
      games: [
        mockGame,
        { ...mockGame, gameNumber: 2, opponent: 'Team 2', date: '2026-02-22T19:00:00-05:00' },
      ],
      expectedEvents: 2,
      expectedTitle: 'Test Team game 1 vs. Opponent',
    },
    {
      name: 'should handle empty games array',
      games: [],
      expectedEvents: 0,
      expectedTitle: null,
    },
  ];

  testCases.forEach(({ name, games, expectedEvents, expectedTitle }) => {
    it(name, () => {
      const ics = generateICS(games);

      expect(ics).toBeTruthy();
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('END:VCALENDAR');

      const eventCount = (ics?.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(expectedEvents);

      if (expectedTitle) {
        expect(ics).toContain(expectedTitle);
      }
    });
  });
});
