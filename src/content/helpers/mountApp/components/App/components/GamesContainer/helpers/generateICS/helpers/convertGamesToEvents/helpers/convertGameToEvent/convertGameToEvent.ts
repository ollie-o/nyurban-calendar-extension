import { EventAttributes } from 'ics';
import { Result, err, ok } from 'neverthrow';

import { CONFIG } from '../../../../../../../../../../shared/constants/constants';
import { Game } from '../../../../../../../../shared/types/Game/Game';

/**
 * Converts a single game to an ICS event.
 */
export const convertGameToEvent = (game: Game, index: number): Result<EventAttributes, Error> => {
  const dateObj = new Date(game.date);

  if (isNaN(dateObj.getTime())) {
    return err(new Error(`Invalid date for game ${index + 1}: ${game.date}`));
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
