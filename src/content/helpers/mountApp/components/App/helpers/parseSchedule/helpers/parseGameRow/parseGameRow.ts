import { Result, ok, err } from 'neverthrow';
import { Game } from '../../../../shared/types/Game/Game';
import { CONFIG } from '../../../../../../shared/constants/constants';
import { parseDateAndTime } from './helpers/parseDateAndTime/parseDateAndTime';

/**
 * Parses a single game row from the schedule table.
 */
export const parseGameRow = (
  row: Element,
  teamName: string,
  gameNumber: number
): Result<Game | null, Error> => {
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

  const dateStringResult = parseDateAndTime(dateText, timeText);

  if (dateStringResult.isErr()) {
    return err(dateStringResult.error);
  }

  const dateString = dateStringResult.value;
  if (!dateString) {
    return ok(null);
  }

  const locationLink = cells[1]?.querySelector('a');
  const locationCode = locationLink?.textContent?.trim() || '';

  let locationFullDetails = cells[2]?.textContent?.trim() || '';
  locationFullDetails = locationFullDetails.replace(/\s*(Map|Map\s+Directions)\s*$/i, '');
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
    date: dateString,
    location,
    locationDetails,
    duration: CONFIG.DEFAULT_GAME_DURATION_MINUTES,
  });
};
