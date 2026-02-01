import { createEvents } from 'ics';
import { Result, ok, err } from 'neverthrow';
import { Game } from './types';
import { convertGamesToEvents } from './helpers/convertGamesToEvents';

export class ICSGenerationError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'ICSGenerationError';
  }
}

/**
 * Generates an ICS calendar file content from an array of games.
 */
export const generateICS = (games: Game[]): Result<string, ICSGenerationError> => {
  if (!Array.isArray(games)) {
    return err(new ICSGenerationError('Games must be an array'));
  }

  if (games.length === 0) {
    return err(new ICSGenerationError('Cannot generate ICS file: no games provided'));
  }

  const eventsResult = convertGamesToEvents(games);
  if (eventsResult.isErr()) {
    return err(eventsResult.error);
  }

  const events = eventsResult.value;

  const { error: icsError, value } = createEvents(events);

  if (icsError) {
    return err(
      new ICSGenerationError(
        'ICS library error: ' + (icsError.message || String(icsError)),
        icsError
      )
    );
  }

  if (!value) {
    return err(new ICSGenerationError('ICS generation returned empty result'));
  }

  return ok(value);
};

/**
 * Triggers a browser download of the ICS file.
 */
export const downloadICS = (icsContent: string, filename = 'nyurban-schedule.ics'): void => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
