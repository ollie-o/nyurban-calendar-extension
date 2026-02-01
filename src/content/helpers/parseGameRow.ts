import { Result, ok, err } from 'neverthrow';
import { Game } from '../../lib/types';
import { CONFIG } from '../../lib/constants';
import { parseDateAndTime } from './parseDateAndTime';

/**
 * Parses a single game row from the schedule table.
 */
export const parseGameRow = (
  row: Element,
  teamName: string,
  gameNumber: number
): Result<Partial<Game> | null, Error> => {
  const cells = Array.from(row.querySelectorAll('td'));

  if (cells.length < 5) {
    return ok(null);
  }

  const dateText = cells[0]?.textContent?.trim() || '';
  if (dateText.includes('No Game')) {
    return ok(null);
  }

  const timeText = cells[3]?.textContent?.trim() || '';
  if (!timeText) {
    return ok(null);
  }

  const dateResult = parseDateAndTime(dateText, timeText);
  if (dateResult.isErr()) {
    return err(dateResult.error);
  }

  const date = dateResult.value;
  if (!date) {
    return ok(null);
  }

  // Location code is in cell 1 (first link).
  const locationLink = cells[1]?.querySelector('a');
  const locationCode = locationLink?.textContent?.trim() || '';

  // Full location details from cell 2 (name, address, and rules).
  let locationFullDetails = cells[2]?.textContent?.trim() || '';
  // Remove "Map" or "Map Directions" link text at the end.
  locationFullDetails = locationFullDetails.replace(/\s*(Map|Map\s+Directions)\s*$/i, '');
  // Clean up excessive whitespace.
  locationFullDetails = locationFullDetails.replace(/\s+/g, ' ').trim();

  const location = locationCode;
  const locationDetails = locationFullDetails;

  const cell4Text = cells[4]?.textContent?.trim() || '';
  const opponent = cell4Text.split(/[\t\n]{3,}|\s{10,}/)[0]?.trim() || '';

  if (!opponent || opponent.includes('No Game')) {
    return ok(null);
  }

  return ok({
    gameNumber,
    teamName,
    opponent,
    date,
    location,
    locationDetails,
    duration: CONFIG.DEFAULT_GAME_DURATION_MINUTES,
  });
};
