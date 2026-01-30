import { Result, ok, err } from 'neverthrow';
import { Game } from '../lib/types';
import { CONFIG, SELECTORS } from '../lib/constants';

/**
 * Parses the NY Urban schedule page and extracts game information
 * @param doc - The HTML document to parse
 * @returns Result containing array of Game objects or Error
 */
export const parseSchedule = (doc: Document): Result<Game[], Error> => {
  if (!doc || !doc.querySelector) {
    return err(new Error('Invalid document provided to parseSchedule'));
  }

  // Extract team name.
  const teamNameResult = extractTeamName(doc);
  if (teamNameResult.isErr()) {
    return err(teamNameResult.error);
  }

  const teamName = teamNameResult.value;

  // Find schedule table.
  const tables = Array.from(doc.querySelectorAll(SELECTORS.SCHEDULE_TABLE));
  const scheduleTable = tables.find((table) => {
    const rows = table.querySelectorAll('tbody tr');
    return rows.length > CONFIG.SCHEDULE_MIN_ROWS;
  });

  if (!scheduleTable) {
    return ok([]);
  }

  // Parse each game row, skipping the first row (header).
  const allRows = Array.from(scheduleTable.querySelectorAll('tbody tr'));
  const rows = allRows.slice(1); // Skip header row
  const games: Game[] = [];
  let gameNumber = 1;

  for (const row of rows) {
    const gameDataResult = parseGameRow(row, teamName, gameNumber);

    // If parsing failed with an error (not just null/empty), return the error.
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

/**
 * Parses a single game row
 */
const parseGameRow = (
  row: Element,
  teamName: string,
  gameNumber: number
): Result<Partial<Game> | null, Error> => {
  const cells = Array.from(row.querySelectorAll('td'));

  if (cells.length < 5) {
    return ok(null);
  }

  // Extract date (cell 0) - format: "Wed 01/14" or "Thu 01/29".
  const dateText = cells[0]?.textContent?.trim() || '';
  if (dateText.includes('No Game')) {
    return ok(null); // Skip "No Game This Week" rows.
  }

  // Extract time (cell 3).
  const timeText = cells[3]?.textContent?.trim() || '';
  if (!timeText) {
    return ok(null);
  }

  // Parse date and time.
  const dateResult = parseDateAndTime(dateText, timeText);
  if (dateResult.isErr()) {
    return err(dateResult.error);
  }

  const date = dateResult.value;
  if (!date) {
    return ok(null);
  }

  // Extract location code from cell 2 (e.g., "LAG-F", "JJC-A").
  // The code is in the direct link text, not in the popup.
  const locationLink = cells[2]?.querySelector('a');
  const locationCode = locationLink?.textContent?.trim() || '';

  // Extract full location name from the popup (inside the <strong> tag).
  const locationPopup = cells[2]?.querySelector('#popup strong');
  const locationFullName = locationPopup?.textContent?.trim() || '';

  // Set location to the code, and locationDetails to the full name.
  const location = locationCode;
  const locationDetails = locationFullName;

  // Extract opponent from cell 4.
  // Cell 4 contains opponent name followed by whitespace/tabs, then "arrow" and popup data.
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

/**
 * Parses date and time from NY Urban format into ISO8601 datetime string.
 * Date format: "Wed 01/14" (month/day, current year assumed)
 * Time format: "6:30" or "9:15" (24-hour or AM/PM)
 * @returns Result containing ISO8601 datetime string or Error
 */
const parseDateAndTime = (dateText: string, timeText: string): Result<string, Error> => {
  // Extract month and day from "Wed 01/14".
  const dateMatch = dateText.match(/(\d{1,2})\/(\d{1,2})/);
  if (!dateMatch) {
    return ok('');
  }

  const month = parseInt(dateMatch[1]);
  const day = parseInt(dateMatch[2]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return err(new Error(`Invalid date values: month=${month}, day=${day}`));
  }

  // Determine the correct year (current or next year).
  const year = getCurrentOrNextYear(month, day);

  // Parse time - convert to 24-hour format if needed.
  let time = timeText.trim();

  // If time doesn't have AM/PM, assume it's already in 24-hour format or PM for evening times.
  if (!time.match(/am|pm/i)) {
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return ok(''); // Invalid time format.
    }

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (isNaN(hours) || isNaN(minutes)) {
      return ok(''); // Invalid numbers.
    }

    if (hours < 12 && hours >= 6) {
      // Likely PM for evening games (6:00-11:59).
      time = `${(hours + 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  } else {
    // Convert AM/PM to 24-hour.
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

  // Determine timezone offset (EST vs EDT) accurately.
  const [hours, minutes] = time.split(':').map(Number);
  const tzOffset = getEasternOffset(year, month, day, hours, minutes);

  // Combine into ISO8601 format with timezone.
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return ok(`${year}-${monthStr}-${dayStr}T${time}:00${tzOffset}`);
};

/**
 * Determines the correct year for a given month/day.
 * If the date is more than YEAR_ROLLOVER_THRESHOLD_DAYS in the past, assumes next year.
 * @param month - The month (1-12)
 * @param day - The day of month (1-31)
 * @returns The year (e.g., 2026, 2027)
 */
const getCurrentOrNextYear = (month: number, day: number): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const testDate = new Date(currentYear, month - 1, day);

  // Calculate days difference.
  const daysDiff = (testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  // If date is more than threshold days in the past, assume it's next year.
  return daysDiff < -CONFIG.YEAR_ROLLOVER_THRESHOLD_DAYS ? currentYear + 1 : currentYear;
};

/**
 * Determines the correct Eastern timezone offset (EST or EDT) for a given date/time.
 * Uses JavaScript's Intl API to accurately determine if DST is in effect.
 * @param year - The year
 * @param month - The month (1-12)
 * @param day - The day of month
 * @param hour - The hour (0-23)
 * @param minute - The minute (0-59)
 * @returns The timezone offset string (either '-05:00' for EST or '-04:00' for EDT)
 */
export const getEasternOffset = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): string => {
  // Create a date object for this specific moment.
  // The local timezone doesn't matter; we just need a reference date.
  const date = new Date(year, month - 1, day, hour, minute);

  // Use Intl to format with America/New_York timezone and get the timezone name.
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  });

  const parts = formatter.formatToParts(date);
  const tzName = parts.find((part) => part.type === 'timeZoneName')?.value;

  // EDT (Eastern Daylight Time) = -04:00, EST (Eastern Standard Time) = -05:00.
  return tzName === 'EDT' ? '-04:00' : '-05:00';
};

/**
 * Extracts the team name from the page
 * @param doc - The HTML document
 * @returns Result containing the team name or Error
 */
export const extractTeamName = (doc: Document): Result<string, Error> => {
  // Look for the team name in the green_block team div.
  const teamHeader = doc.querySelector(SELECTORS.TEAM_NAME);

  if (teamHeader) {
    const teamName = teamHeader.textContent?.trim() || '';
    if (!teamName) {
      return err(new Error('Team name element found but contains no text'));
    }
    // Remove any prefixes like "***zwl-" that might appear.
    return ok(teamName.replace(/^\*+[a-z]+-/i, '').trim());
  }

  return err(new Error('Team name not found on page'));
};

/**
 * Validates that a game object has all required fields
 * @param game - The game object to validate
 * @returns True if valid, false otherwise
 */
export const isValidGame = (game: Partial<Game>): game is Game => {
  return !!(game.gameNumber && game.teamName && game.opponent && game.date && game.location);
};
