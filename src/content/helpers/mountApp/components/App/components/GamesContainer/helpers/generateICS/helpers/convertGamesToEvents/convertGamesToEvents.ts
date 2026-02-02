import { EventAttributes } from 'ics';
import { Result, err, ok } from 'neverthrow';

import { Game } from '../../../../../../shared/types/Game/Game';

import { convertGameToEvent } from './helpers/convertGameToEvent/convertGameToEvent';

/**
 * Converts an array of games to ICS event attributes.
 */
export const convertGamesToEvents = (games: Game[]): Result<EventAttributes[], Error> => {
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
