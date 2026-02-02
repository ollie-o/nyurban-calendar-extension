import { Result, err, ok } from 'neverthrow';

import { CONFIG, SELECTORS } from '../../../../shared/constants/constants';
import { Game } from '../../shared/types/Game/Game';

import { parseGameRow } from './helpers/parseGameRow/parseGameRow';

/**
 * Parses a NY Urban schedule page and extracts all game data.
 */
export const parseSchedule = (doc: Document): Result<Game[], Error> => {
  if (!doc || !doc.querySelector) {
    return err(new Error('Invalid document provided to parseSchedule'));
  }

  const teamNameRaw = doc.querySelector(SELECTORS.TEAM_NAME);
  if (!teamNameRaw) {
    return err(new Error('Team name not found on page'));
  }

  const teamName = teamNameRaw.textContent?.trim() || '';
  const tables = Array.from(doc.querySelectorAll(SELECTORS.SCHEDULE_TABLE));
  const scheduleTable = tables.find((table) => {
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length <= CONFIG.SCHEDULE_MIN_ROWS) {
      return false;
    }

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
    if (gameData) {
      games.push(gameData);
      gameNumber++;
    }
  }

  return ok(games);
};
