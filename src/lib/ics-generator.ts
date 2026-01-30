import { createEvents, EventAttributes } from 'ics';
import { Result, ok, err } from 'neverthrow';
import { Game } from './types';
import { CONFIG } from './constants';

/**
 * Error type for ICS generation failures.
 */
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
 * Generates an ICS file content from an array of games
 * @param games - Array of Game objects to convert
 * @returns Result containing ICS file content or ICSGenerationError
 */
export const generateICS = (games: Game[]): Result<string, ICSGenerationError> => {
  // Validate input.
  if (!Array.isArray(games)) {
    return err(new ICSGenerationError('Games must be an array'));
  }

  if (games.length === 0) {
    return err(new ICSGenerationError('Cannot generate ICS file: no games provided'));
  }

  // Convert Game objects to ICS EventAttributes.
  const eventsResult = convertGamesToEvents(games);
  if (eventsResult.isErr()) {
    return err(eventsResult.error);
  }

  const events = eventsResult.value;

  // Generate ICS content.
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
 * Converts Game objects to ICS EventAttributes.
 * @param games - Array of Game objects
 * @returns Result containing EventAttributes array or ICSGenerationError
 */
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

/**
 * Converts a single Game to an ICS EventAttributes object.
 * @param game - Game object to convert
 * @param index - Game index for error messages
 * @returns Result containing EventAttributes or ICSGenerationError
 */
const convertGameToEvent = (
  game: Game,
  index: number
): Result<EventAttributes, ICSGenerationError> => {
  // Parse ISO8601 date (e.g., "2026-01-14T18:30:00-05:00").
  const dateObj = new Date(game.date);

  // Validate date.
  if (isNaN(dateObj.getTime())) {
    return err(new ICSGenerationError(`Invalid date for game ${index + 1}: ${game.date}`));
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
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
    // Note: ics library handles timezone through start time array format.
  });
};

/**
 * Triggers a browser download of the ICS file
 * @param icsContent - The ICS file content string
 * @param filename - The filename for the download (default: "nyurban-schedule.ics")
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

  // Clean up.
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
