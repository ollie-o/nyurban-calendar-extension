import { Game } from '../lib/types';
import { CONFIG, SELECTORS } from '../lib/constants';

/**
 * Parses the NY Urban schedule page and extracts game information
 * @param doc - The HTML document to parse
 * @returns Array of Game objects
 * @throws Error if document is invalid
 */
export const parseSchedule = (doc: Document): Game[] => {
  if (!doc || !doc.querySelector) {
    throw new Error('Invalid document provided to parseSchedule');
  }
  const games: Game[] = [];

  // Extract team name.
  const teamName = extractTeamName(doc);

  // Find the schedule table (table with "Date | Location | Time | Opponent | Results" header).
  const scheduleTable = findScheduleTable(doc);
  if (!scheduleTable) {
    return games;
  }

  // Get all rows.
  const rows = Array.from(scheduleTable.querySelectorAll('tbody tr'));

  // Filter to game rows (rows with 5+ cells, excluding header).
  const gameRows = rows.filter((row) => {
    const cells = row.querySelectorAll('td');
    return cells.length >= 5;
  });

  // Skip first row (header).
  let gameNumber = 1;
  for (let i = 1; i < gameRows.length; i++) {
    const row = gameRows[i];
    const game = parseGameRow(row, teamName, gameNumber);

    if (game && isValidGame(game)) {
      games.push(game);
      gameNumber++;
    }
  }

  return games;
};

/**
 * Finds the schedule table in the document
 * The schedule is split into two tables: a header table and a data table
 */
const findScheduleTable = (doc: Document): HTMLTableElement | null => {
  const tables = Array.from(doc.querySelectorAll('table'));

  // Find table with header row containing "Date", "Location", "Time", "Opponent".
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const firstRow = table.querySelector('tbody tr');
    if (!firstRow) {
      continue;
    }

    const cells = Array.from(firstRow.querySelectorAll('td'));
    if (cells.length < 4) {
      continue;
    }

    const headerText = cells.map((c) => c.textContent?.trim().toLowerCase()).join(' ');
    if (
      headerText.includes('date') &&
      headerText.includes('location') &&
      headerText.includes('time') &&
      headerText.includes('opponent')
    ) {
      // The actual game data is usually in the NEXT table.
      if (i + 1 < tables.length) {
        const dataTable = tables[i + 1];
        const dataRows = dataTable.querySelectorAll('tbody tr');

        if (dataRows.length > 1) {
          return dataTable as HTMLTableElement;
        }
      }

      // Fall back to header table if next table doesn't have data.
      return table as HTMLTableElement;
    }
  }

  return null;
};

/**
 * Parses a single game row
 */
const parseGameRow = (row: Element, teamName: string, gameNumber: number): Partial<Game> | null => {
  const cells = Array.from(row.querySelectorAll('td'));

  if (cells.length < 5) {
    return null;
  }

  // Extract date (cell 0) - format: "Wed 01/14" or "Thu 01/29".
  const dateText = cells[0]?.textContent?.trim() || '';
  if (dateText.includes('No Game')) {
    return null; // Skip "No Game This Week" rows.
  }

  // Extract time (cell 3).
  const timeText = cells[3]?.textContent?.trim() || '';
  if (!timeText) {
    return null;
  }

  // Parse date and time.
  const { date, time } = parseDateAndTime(dateText, timeText);
  if (!date || !time) {
    return null;
  }

  // Extract location from cell 2 (has full location name and address).
  const cell2Text = cells[2]?.textContent?.trim() || '';
  // Split by tabs and newlines, filter out empty strings and unwanted text.
  const locationParts = cell2Text
    .split(/[\t\n]+/)
    .map((l) => l.trim())
    .filter((l) => l && !l.includes('arrow') && !l.includes('Map') && !l.includes('Directions'));
  // First part is the location name.
  const location = locationParts[0] || '';
  // Remaining parts (address, notes, etc.) go into details.
  const locationDetails = locationParts.slice(1).join('\n');

  // Extract opponent from cell 4.
  // Cell 4 contains opponent name followed by whitespace/tabs, then "arrow" and popup data.
  const cell4Text = cells[4]?.textContent?.trim() || '';
  const opponent = cell4Text.split(/[\t\n]{3,}|\s{10,}/)[0]?.trim() || '';

  if (!opponent || opponent.includes('No Game')) {
    return null;
  }

  return {
    gameNumber,
    teamName,
    opponent,
    date,
    time,
    location,
    locationDetails,
    duration: CONFIG.DEFAULT_GAME_DURATION_MINUTES,
  };
};

/**
 * Parses date and time from NY Urban format
 * Date format: "Wed 01/14" (month/day, current year assumed)
 * Time format: "6:30" or "9:15" (24-hour or AM/PM)
 * Returns ISO8601 format with Eastern timezone
 */
const parseDateAndTime = (dateText: string, timeText: string): { date: string; time: string } => {
  // Extract month and day from "Wed 01/14".
  const dateMatch = dateText.match(/(\d{1,2})\/(\d{1,2})/);
  if (!dateMatch) {
    return { date: '', time: '' };
  }

  const month = parseInt(dateMatch[1]);
  const day = parseInt(dateMatch[2]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid date values: month=${month}, day=${day}`);
  }

  // Determine the correct year (current or next year).
  const year = getCurrentOrNextYear(month, day);

  // Parse time - convert to 24-hour format if needed.
  let time = timeText.trim();

  // If time doesn't have AM/PM, assume it's already in 24-hour format or PM for evening times.
  if (!time.match(/am|pm/i)) {
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return { date: '', time: '' }; // Invalid time format.
    }

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (isNaN(hours) || isNaN(minutes)) {
      return { date: '', time: '' }; // Invalid numbers.
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
  const date = `${year}-${monthStr}-${dayStr}T${time}:00${tzOffset}`;

  return { date, time };
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
 * @returns The team name
 */
export const extractTeamName = (doc: Document): string => {
  // Look for the team name in the green_block team div.
  const teamHeader = doc.querySelector(SELECTORS.TEAM_NAME);

  if (teamHeader) {
    const teamName = teamHeader.textContent?.trim() || '';
    if (!teamName) {
      throw new Error('Team name element found but contains no text');
    }
    // Remove any prefixes like "***zwl-" that might appear.
    return teamName.replace(/^\*+[a-z]+-/i, '').trim();
  }

  throw new Error('Team name not found on page');
};

/**
 * Validates that a game object has all required fields
 * @param game - The game object to validate
 * @returns True if valid, false otherwise
 */
export const isValidGame = (game: Partial<Game>): game is Game => {
  return !!(
    game.gameNumber &&
    game.teamName &&
    game.opponent &&
    game.date &&
    game.time &&
    game.location
  );
};
