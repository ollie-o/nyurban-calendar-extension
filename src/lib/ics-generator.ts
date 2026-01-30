import { createEvents, EventAttributes } from 'ics';
import { Result, ok, err } from 'neverthrow';
import { Game } from './types';
import { CONFIG } from './constants';

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

const convertGamesToEvents = (games: Game[]): Result<EventAttributes[], ICSGenerationError> => {
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

const convertGameToEvent = (
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
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  });
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
