import { createEvents, EventAttributes } from 'ics';
import { Game, ICSOptions } from './types';
import { CONFIG } from './constants';

/**
 * Error thrown when ICS generation fails.
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
 * @param options - Optional ICS generation options
 * @returns ICS file content as a string
 * @throws ICSGenerationError if generation fails
 */
export const generateICS = (games: Game[], _options: ICSOptions = {}): string => {
  // Validate input.
  if (!Array.isArray(games)) {
    throw new ICSGenerationError('Games must be an array');
  }

  if (games.length === 0) {
    throw new ICSGenerationError('Cannot generate ICS file: no games provided');
  }

  // Note: timezone and prodId options are currently unused as the ics library
  // Doesn't support these options in the way we need. Keeping for future enhancement.

  try {
    // Convert Game objects to ICS EventAttributes.
    const events: EventAttributes[] = games.map((game, index) => {
      try {
        // Parse ISO8601 date (e.g., "2026-01-14T18:30:00-05:00").
        const dateObj = new Date(game.date);

        // Validate date.
        if (isNaN(dateObj.getTime())) {
          throw new Error(`Invalid date for game ${index + 1}: ${game.date}`);
        }

        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
        const day = dateObj.getDate();
        const hour = dateObj.getHours();
        const minute = dateObj.getMinutes();

        const duration = game.duration || CONFIG.DEFAULT_GAME_DURATION_MINUTES;

        return {
          start: [year, month, day, hour, minute],
          duration: { minutes: duration },
          title: `${game.teamName} game ${game.gameNumber} vs. ${game.opponent}`,
          location: game.location,
          description: game.locationDetails,
          status: 'CONFIRMED',
          busyStatus: 'BUSY',
          // Note: ics library handles timezone through start time array format.
        };
      } catch (err) {
        throw new ICSGenerationError(
          `Failed to convert game ${index + 1} (${game.teamName} vs ${game.opponent}): ${err instanceof Error ? err.message : String(err)}`,
          err
        );
      }
    });

    // Generate ICS content.
    const { error, value } = createEvents(events);

    if (error) {
      throw new ICSGenerationError('ICS library error: ' + (error.message || String(error)), error);
    }

    if (!value) {
      throw new ICSGenerationError('ICS generation returned empty result');
    }

    return value;
  } catch (err) {
    if (err instanceof ICSGenerationError) {
      throw err;
    }
    throw new ICSGenerationError(
      'Unexpected error during ICS generation: ' +
        (err instanceof Error ? err.message : String(err)),
      err
    );
  }
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
