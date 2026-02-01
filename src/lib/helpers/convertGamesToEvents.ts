import { EventAttributes } from 'ics';
import { Result, ok, err } from 'neverthrow';
import { Game } from '../types';
import { ICSGenerationError } from '../ics-generator';
import { convertGameToEvent } from './convertGameToEvent';

/**
 * Converts an array of games to ICS event attributes.
 */
export const convertGamesToEvents = (
  games: Game[]
): Result<EventAttributes[], ICSGenerationError> => {
  const events: EventAttributes[] = [];

  for (let index = 0; index < games.length; index++) {
    const game = games[index];
    const eventResult = convertGameToEvent(game, index);

    if (eventResult.isErr()) {
      return err(eventResult.error);
    }

    events.push(eventResult.value);
  }

  return ok(events);
};
