/**
 * Represents a game in the NY Urban schedule.
 */
export interface Game {
  gameNumber: number;
  teamName: string;
  opponent: string;
  date: string;
  location: string;
  locationDetails: string;
  duration?: number;
}
