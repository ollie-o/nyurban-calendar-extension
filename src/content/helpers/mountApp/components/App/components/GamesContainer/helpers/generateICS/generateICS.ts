import { createEvents } from 'ics';
import { Result, ok, err } from 'neverthrow';
import { Game } from '../../../../shared/types/Game/Game';
import { convertGamesToEvents } from './helpers/convertGamesToEvents/convertGamesToEvents';

/**
 * Generates an ICS calendar file content from an array of games.
 */
export const generateICS = (games: Game[]): Result<string, Error> => {
  if (games.length === 0) {
    return err(new Error('Cannot generate ICS file: no games provided'));
  }

  const eventsResult = convertGamesToEvents(games);
  if (eventsResult.isErr()) {
    return err(eventsResult.error);
  }

  const { error: icsError, value } = createEvents(eventsResult.value);

  if (icsError) {
    return err(new Error('ICS library error: ' + (icsError.message || String(icsError))));
  }

  if (!value) {
    return err(new Error('ICS generation returned empty result'));
  }

  return ok(value);
};
