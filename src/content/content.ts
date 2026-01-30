import { Result, ok, err } from 'neverthrow';
import { parseSchedule } from './parser';
import { injectGamesList } from './ui';
import { generateICS, downloadICS } from '../lib/ics-generator';
import { CONFIG, URL_PATTERNS } from '../lib/constants';
import { sanitizeFilename } from '../lib/formatters';

/**
 * Main content script entry point
 * Runs when the page is loaded
 */
const init = async (): Promise<Result<void, Error>> => {
  // Check if we're on a team details page.
  if (!isTeamDetailsPage()) {
    return ok(undefined);
  }

  // Wait for schedule to load (it's populated dynamically).
  await waitForScheduleToLoad();

  // Parse the schedule.
  const gamesResult = parseSchedule(document);
  if (gamesResult.isErr()) {
    return err(gamesResult.error);
  }

  const games = gamesResult.value;
  if (games.length === 0) {
    return ok(undefined);
  }

  // Inject the games list with download handler.
  injectGamesList(games, (selectedGames) => {
    if (selectedGames.length === 0) {
      alert('Please select at least one game to download.');
      return;
    }

    // Generate ICS file.
    const icsResult = generateICS(selectedGames);

    icsResult.match(
      (icsContent) => {
        // Trigger download.
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

/**
 * Initializes the extension and handles errors.
 */
const initWithErrorHandling = async (): Promise<void> => {
  const result = await init();

  result.mapErr((error) => {
    alert(`Extension failed to load: ${error.message}\n\nPlease refresh the page.`);
  });
};

/**
 * Waits for the schedule table to be populated with game data
 * @throws Error if schedule fails to load after maximum attempts
 */
const waitForScheduleToLoad = async (): Promise<void> => {
  for (let i = 0; i < CONFIG.LOAD_MAX_ATTEMPTS; i++) {
    const tables = Array.from(document.querySelectorAll('table'));
    for (const table of tables) {
      const rows = table.querySelectorAll('tbody tr');
      // Check if we have a table with multiple rows (more than just header).
      if (rows.length > CONFIG.SCHEDULE_MIN_ROWS) {
        return;
      }
    }

    // Wait before checking again.
    await new Promise((resolve) => setTimeout(resolve, CONFIG.LOAD_RETRY_DELAY_MS));
  }

  // Timeout reached, proceed anyway (schedule might be empty).
};

/**
 * Checks if the current page is a team details page
 */
const isTeamDetailsPage = (): boolean => {
  return (
    window.location.pathname.includes(URL_PATTERNS.TEAM_DETAILS_PATH) &&
    window.location.search.includes(URL_PATTERNS.TEAM_ID_PARAM)
  );
};

// Initialize when DOM is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWithErrorHandling);
} else {
  initWithErrorHandling();
}
