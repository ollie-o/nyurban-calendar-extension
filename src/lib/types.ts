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

  /** Game date in ISO format (YYYY-MM-DD) */
  date: string;

  /** Game time in 24-hour format (HH:MM) */
  time: string;

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
