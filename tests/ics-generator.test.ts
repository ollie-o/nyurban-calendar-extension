import { generateICS, ICSGenerationError } from '../src/lib/ics-generator';
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
    const ics = generateICS([mockGame]);

    expect(ics).toBeTruthy();
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('Test Team game 1 vs. Opponent');
  });

  it('should generate ICS with multiple games', () => {
    const games = [
      mockGame,
      { ...mockGame, gameNumber: 2, opponent: 'Team 2', date: '2026-02-22T19:00:00-05:00' },
    ];
    const ics = generateICS(games);

    expect(ics).toBeTruthy();
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');

    const eventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
    expect(eventCount).toBe(2);
    expect(ics).toContain('Test Team game 1 vs. Opponent');
    expect(ics).toContain('Test Team game 2 vs. Team 2');
  });

  it('should throw error for empty games array', () => {
    expect(() => generateICS([])).toThrow(ICSGenerationError);
    expect(() => generateICS([])).toThrow('Cannot generate ICS file: no games provided');
  });
});
