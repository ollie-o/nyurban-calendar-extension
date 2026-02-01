import { Result, ok, err } from 'neverthrow';
import { Game } from '../lib/types';
import { CONFIG, SELECTORS } from '../lib/constants';
import { parseGameRow } from './helpers/parseGameRow';
import { extractTeamName } from './helpers/extractTeamName';
import { isValidGame } from './helpers/isValidGame';

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
