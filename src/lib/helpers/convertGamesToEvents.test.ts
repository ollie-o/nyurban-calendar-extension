import { convertGamesToEvents } from './convertGamesToEvents';
import { Game } from '../types';

describe('convertGamesToEvents', () => {
  const mockGame1: Game = {
    gameNumber: 1,
    opponent: 'Team A',
    teamName: 'Team B',
    date: '2024-01-15T18:30:00',
    location: 'Park 1',
    locationDetails: 'Field 1',
    duration: 90,
  };

  const mockGame2: Game = {
    gameNumber: 2,
    opponent: 'Team C',
    teamName: 'Team B',
    date: '2024-01-16T19:00:00',
    location: 'Park 2',
    locationDetails: 'Field 2',
    duration: 90,
  };

  it('should convert multiple games to events', () => {
    const result = convertGamesToEvents([mockGame1, mockGame2]);

    if (result.isErr()) {
      throw result.error;
    }

    const events = result.value;
    expect(events).toHaveLength(2);
    expect(events[0].title).toBe('Team B game 1 vs. Team A');
    expect(events[1].title).toBe('Team B game 2 vs. Team C');
  });

  it('should return error if one game has invalid date', () => {
    const badGame = { ...mockGame1, date: 'invalid' };
    const result = convertGamesToEvents([mockGame1, badGame, mockGame2]);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain('Invalid date');
    }
  });

  it('should convert empty array', () => {
    const result = convertGamesToEvents([]);

    if (result.isErr()) {
      throw result.error;
    }

    expect(result.value).toHaveLength(0);
  });

  it('should convert single game', () => {
    const result = convertGamesToEvents([mockGame1]);

    if (result.isErr()) {
      throw result.error;
    }

    expect(result.value).toHaveLength(1);
  });
});
