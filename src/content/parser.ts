import { Result, ok, err } from 'neverthrow';
import { Game } from '../lib/types';
import { CONFIG, SELECTORS } from '../lib/constants';

/**
 * Parses a NY Urban schedule page and extracts all game data.
 */
export const parseSchedule = (doc: Document): Result<Game[], Error> => {
  if (!doc || !doc.querySelector) {
    return err(new Error('Invalid document provided to parseSchedule'));
  }

  const teamNameResult = extractTeamName(doc);
  if (teamNameResult.isErr()) {
    return err(teamNameResult.error);
  }

  const teamName = teamNameResult.value;

  const tables = Array.from(doc.querySelectorAll(SELECTORS.SCHEDULE_TABLE));
  const scheduleTable = tables.find((table) => {
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length <= CONFIG.SCHEDULE_MIN_ROWS) {
      return false;
    }

    // Check if first row looks like a schedule header (has "Date" in first cell).
    const firstRow = rows[0];
    const firstCell = firstRow?.querySelector('td');
    const headerText = firstCell?.textContent?.trim().toLowerCase();
    return headerText === 'date';
  });

  if (!scheduleTable) {
    return ok([]);
  }

  const allRows = Array.from(scheduleTable.querySelectorAll('tbody tr'));
  const rows = allRows.slice(1);
  const games: Game[] = [];
  let gameNumber = 1;

  for (const row of rows) {
    const gameDataResult = parseGameRow(row, teamName, gameNumber);

    if (gameDataResult.isErr()) {
      return err(gameDataResult.error);
    }

    const gameData = gameDataResult.value;
    if (gameData && isValidGame(gameData)) {
      games.push(gameData);
      gameNumber++;
    }
  }

  return ok(games);
};

const parseGameRow = (
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

const parseDateAndTime = (dateText: string, timeText: string): Result<string, Error> => {
  const dateMatch = dateText.match(/(\d{1,2})\/(\d{1,2})/);
  if (!dateMatch) {
    return ok('');
  }

  const month = parseInt(dateMatch[1]);
  const day = parseInt(dateMatch[2]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return err(new Error(`Invalid date values: month=${month}, day=${day}`));
  }

  const year = getCurrentOrNextYear(month, day);

  let time = timeText.trim();

  if (!time.match(/am|pm/i)) {
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return ok('');
    }

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (isNaN(hours) || isNaN(minutes)) {
      return ok('');
    }

    // Assume PM for evening games (6:00-11:59).
    if (hours < 12 && hours >= 6) {
      time = `${(hours + 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  } else {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const meridian = match[3].toLowerCase();

      if (meridian === 'pm' && hours !== 12) {
        hours += 12;
      }
      if (meridian === 'am' && hours === 12) {
        hours = 0;
      }

      time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  const [hours, minutes] = time.split(':').map(Number);
  const tzOffset = getEasternOffset(year, month, day, hours, minutes);

  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return ok(`${year}-${monthStr}-${dayStr}T${time}:00${tzOffset}`);
};

const getCurrentOrNextYear = (month: number, day: number): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const testDate = new Date(currentYear, month - 1, day);

  const daysDiff = (testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  return daysDiff < -CONFIG.YEAR_ROLLOVER_THRESHOLD_DAYS ? currentYear + 1 : currentYear;
};

/**
 * Returns EST (-05:00) or EDT (-04:00) based on DST for the given date/time.
 */
export const getEasternOffset = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): string => {
  const date = new Date(year, month - 1, day, hour, minute);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  });

  const parts = formatter.formatToParts(date);
  const tzName = parts.find((part) => part.type === 'timeZoneName')?.value;

  return tzName === 'EDT' ? '-04:00' : '-05:00';
};

/**
 * Extracts the team name from the page header.
 */
export const extractTeamName = (doc: Document): Result<string, Error> => {
  const teamHeader = doc.querySelector(SELECTORS.TEAM_NAME);

  if (teamHeader) {
    const teamName = teamHeader.textContent?.trim() || '';
    if (!teamName) {
      return err(new Error('Team name element found but contains no text'));
    }
    return ok(teamName.replace(/^\*+[a-z]+-/i, '').trim());
  }

  return err(new Error('Team name not found on page'));
};

/**
 * Type guard to validate that a game object has all required fields.
 */
export const isValidGame = (game: Partial<Game>): game is Game => {
  return !!(game.gameNumber && game.teamName && game.opponent && game.date && game.location);
};
