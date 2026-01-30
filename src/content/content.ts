import { parseSchedule } from './parser';
import { injectGamesList } from './ui';
import { generateICS, downloadICS } from '../lib/ics-generator';

/**
 * Main content script entry point
 * Runs when the page is loaded
 */
const init = async () => {
  // Check if we're on a team details page.
  if (!isTeamDetailsPage()) {
    return;
  }

  // Wait for schedule to load (it's populated dynamically).
  await waitForScheduleToLoad();

  // Parse the schedule.
  const games = parseSchedule(document);

  if (games.length === 0) {
    return;
  }

  // Inject the games list with download handler.
  injectGamesList(games, (selectedGames) => {
    // Generate ICS file.
    const icsContent = generateICS(selectedGames);

    if (icsContent) {
      // Trigger download.
      const teamName = selectedGames[0]?.teamName || 'team';
      const filename = `${teamName.toLowerCase().replace(/\s+/g, '-')}-schedule.ics`;
      downloadICS(icsContent, filename);
    } else {
      alert('Error generating calendar file. Please try again.');
    }
  });
};

/**
 * Waits for the schedule table to be populated with game data
 */
const waitForScheduleToLoad = async (maxAttempts = 20): Promise<void> => {
  for (let i = 0; i < maxAttempts; i++) {
    const tables = Array.from(document.querySelectorAll('table'));
    for (const table of tables) {
      const rows = table.querySelectorAll('tbody tr');
      // Check if we have a table with multiple rows (more than just header).
      if (rows.length > 5) {
        return;
      }
    }

    // Wait 500ms before checking again.
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Timeout reached, proceed anyway.
};

/**
 * Checks if the current page is a team details page
 */
const isTeamDetailsPage = (): boolean => {
  return (
    window.location.pathname.includes('/team-details/') &&
    window.location.search.includes('team_id=')
  );
};

// Initialize when DOM is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
