/**
 * Represents a single game extracted from the schedule
 */
export interface Game {
  /** Sequential game number for the season (e.g., 1, 2, 3) */
  gameNumber: number;

  /** The user's team name */
  teamName: string;

  /** The opposing team's name */
  opponent: string;

  /** Game date and time in ISO8601 format with timezone (e.g., "2026-01-13T18:30:00-05:00") */
  date: string;

  /** Venue name (e.g., "BRANDEIS H.S.") */
  location: string;

  /** Full venue address and details */
  locationDetails: string;

  /** Game duration in minutes (default: 60) */
  duration?: number;
}

/**
 * Options for ICS file generation
 */
export interface ICSOptions {
  /** Timezone for events (default: "America/New_York") */
  timezone?: string;

  /** Product identifier for the calendar */
  prodId?: string;
}
