import { createEvents, EventAttributes } from 'ics';
import { Game, ICSOptions } from './types';

/**
 * Generates an ICS file content from an array of games
 * @param games - Array of Game objects to convert
 * @param options - Optional ICS generation options
 * @returns ICS file content as a string, or null if generation fails
 */
export const generateICS = (games: Game[], _options: ICSOptions = {}): string | null => {
  // Note: timezone and prodId options are currently unused as the ics library
  // Doesn't support these options in the way we need. Keeping for future enhancement.

  // Convert Game objects to ICS EventAttributes.
  const events: EventAttributes[] = games.map((game) => {
    // Parse ISO8601 date (e.g., "2026-01-14T18:30:00-05:00").
    const dateObj = new Date(game.date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();

    const duration = game.duration || 60; // Default to 1 hour

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
  });

  // Generate ICS content.
  const { error, value } = createEvents(events);

  if (error) {
    console.error('Error generating ICS:', error);
    return null;
  }

  return value || null;
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
