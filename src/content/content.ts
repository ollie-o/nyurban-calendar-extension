import { Result, ok, err } from 'neverthrow';
import { parseSchedule } from './parser';
import { injectGamesList } from './ui';
import { generateICS, downloadICS } from '../lib/ics-generator';
import { CONFIG, URL_PATTERNS, SELECTORS } from '../lib/constants';
import { sanitizeFilename } from '../lib/formatters';

const init = async (): Promise<Result<void, Error>> => {
  if (!isTeamDetailsPage()) {
    return ok(undefined);
  }

  await waitForScheduleToLoad();

  const gamesResult = parseSchedule(document);
  if (gamesResult.isErr()) {
    return err(gamesResult.error);
  }

  const games = gamesResult.value;
  if (games.length === 0) {
    injectEmptyMessage();
    return ok(undefined);
  }

  injectGamesList(games, (selectedGames) => {
    if (selectedGames.length === 0) {
      alert('Please select at least one game to download.');
      return;
    }

    const icsResult = generateICS(selectedGames);

    icsResult.match(
      (icsContent) => {
        const teamName = selectedGames[0]?.teamName || 'team';
        const filename = `${sanitizeFilename(teamName)}-schedule.ics`;
        downloadICS(icsContent, filename);
      },
      (error) => {
        alert(
          `Failed to generate calendar file: ${error.message}\n\nPlease try again or contact support if the problem persists.`
        );
      }
    );
  });

  return ok(undefined);
};

const initWithErrorHandling = async (): Promise<void> => {
  const result = await init();
  result.mapErr((error) => {
    alert(`Extension failed to load: ${error.message}\n\nPlease refresh the page.`);
  });
};

const waitForScheduleToLoad = async (): Promise<void> => {
  for (let i = 0; i < CONFIG.LOAD_MAX_ATTEMPTS; i++) {
    const tables = Array.from(document.querySelectorAll('table'));
    for (const table of tables) {
      const rows = table.querySelectorAll('tbody tr');
      if (rows.length > CONFIG.SCHEDULE_MIN_ROWS) {
        return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, CONFIG.LOAD_RETRY_DELAY_MS));
  }
};

const injectEmptyMessage = (): void => {
  const existingMessage = document.getElementById('nyurban-calendar-empty');
  if (existingMessage) {
    return;
  }

  const messageDiv = document.createElement('div');
  messageDiv.id = 'nyurban-calendar-empty';
  messageDiv.style.cssText = `
    padding: 20px;
    margin: 20px auto;
    max-width: 600px;
    text-align: center;
    background: white;
    border: 2px solid #007bff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    color: #333;
    font-size: 16px;
  `;
  messageDiv.textContent = 'No games found on this page.';

  const teamDiv = document.querySelector(SELECTORS.TEAM_DIV);
  if (teamDiv && teamDiv.parentElement) {
    teamDiv.parentElement.insertBefore(messageDiv, teamDiv.nextSibling);
  } else {
    document.body.insertBefore(messageDiv, document.body.firstChild);
  }
};

const isTeamDetailsPage = (): boolean => {
  return (
    window.location.pathname.includes(URL_PATTERNS.TEAM_DETAILS_PATH) &&
    window.location.search.includes(URL_PATTERNS.TEAM_ID_PARAM)
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWithErrorHandling);
} else {
  initWithErrorHandling();
}
