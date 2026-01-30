import { generateICS } from '../src/lib/ics-generator';
import { Game } from '../src/lib/types';

describe('ICS Generator', () => {
  const mockGame: Game = {
    gameNumber: 1,
    teamName: 'Test Team',
    opponent: 'Opponent',
    date: '2026-02-15T19:00:00-05:00',
    location: 'Gym',
    locationDetails: '123 Main St\nPlease arrive early',
    duration: 60,
  };

  it('should generate ICS with single game', () => {
    const result = generateICS([mockGame]);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const ics = result.value;
      expect(ics).toBeTruthy();
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('END:VCALENDAR');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('Test Team game 1 vs. Opponent');
    }
  });

  it('should generate ICS with multiple games', () => {
    const games = [
      mockGame,
      { ...mockGame, gameNumber: 2, opponent: 'Team 2', date: '2026-02-22T19:00:00-05:00' },
    ];
    const result = generateICS(games);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const ics = result.value;
      expect(ics).toBeTruthy();
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('END:VCALENDAR');

      const eventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(2);
      expect(ics).toContain('Test Team game 1 vs. Opponent');
      expect(ics).toContain('Test Team game 2 vs. Team 2');
    }
  });

  it('should return error for empty games array', () => {
    const result = generateICS([]);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe('Cannot generate ICS file: no games provided');
    }
  });
});
