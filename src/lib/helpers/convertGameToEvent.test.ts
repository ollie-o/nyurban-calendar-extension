import { convertGameToEvent } from './convertGameToEvent';
import { Game } from '../types';

describe('convertGameToEvent', () => {
  const mockGame: Game = {
    gameNumber: 1,
    opponent: 'Team A',
    teamName: 'Team B',
    date: '2024-01-15T18:30:00',
    location: 'Park',
    locationDetails: 'Main field',
    duration: 90,
  };

  it('should convert a game to an event', () => {
    const result = convertGameToEvent(mockGame, 0);

    if (result.isErr()) {
      throw result.error;
    }

    const event = result.value;
    expect(event.title).toBe('Team B game 1 vs. Team A');
    expect(event.location).toBe('Park');
    expect(event.description).toBe('Main field');
    expect(event.status).toBe('CONFIRMED');
    expect(event.busyStatus).toBe('BUSY');
    expect(event.start).toEqual([2024, 1, 15, 18, 30]);
  });

  it('should return error for invalid date', () => {
    const gameWithBadDate = { ...mockGame, date: 'invalid-date' };
    const result = convertGameToEvent(gameWithBadDate, 0);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain('Invalid date for game 1');
    }
  });

  it('should include game index in error message', () => {
    const gameWithBadDate = { ...mockGame, date: 'bad' };
    const result = convertGameToEvent(gameWithBadDate, 5);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain('game 6');
    }
  });
});
