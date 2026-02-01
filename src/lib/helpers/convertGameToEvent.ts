import { EventAttributes } from 'ics';
import { Result, ok, err } from 'neverthrow';
import { Game } from '../types';
import { CONFIG } from '../constants';
import { ICSGenerationError } from '../ics-generator';

/**
 * Converts a single game to an ICS event.
 */
export const convertGameToEvent = (
  game: Game,
  index: number
): Result<EventAttributes, ICSGenerationError> => {
  const dateObj = new Date(game.date);

  if (isNaN(dateObj.getTime())) {
    return err(new ICSGenerationError(`Invalid date for game ${index + 1}: ${game.date}`));
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();

  const duration = game.duration || CONFIG.DEFAULT_GAME_DURATION_MINUTES;

  return ok({
    start: [year, month, day, hour, minute],
    duration: { minutes: duration },
    title: `${game.teamName} game ${game.gameNumber} vs. ${game.opponent}`,
    location: game.location,
    description: game.locationDetails,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  });
};
