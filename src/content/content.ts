import { parseSchedule } from './parser';
import { injectCalendarButton, showGameSelectionModal } from './ui';
import { generateICS, downloadICS } from '../lib/ics-generator';

/**
 * Main content script entry point
 * Runs when the page is loaded
 */
const init = async () => {
  console.log('NY Urban Calendar Extension loaded');

  // Check if we're on a team details page.
  if (!isTeamDetailsPage()) {
    console.log('Not a team details page, extension inactive');
    return;
  }

  // Wait for schedule to load (it's populated dynamically).
  console.log('[NY Urban Extension] Waiting for schedule to load...');
  await waitForScheduleToLoad();

  // Inject the calendar button.
  injectCalendarButton(() => {
    // Parse the schedule when button is clicked (in case it loads later).
    const games = parseSchedule(document);

    if (games.length === 0) {
      alert(
        "No games found on this page. Make sure you're viewing a team schedule with published games."
      );
      return;
    }

    console.log(`[NY Urban Extension] Found ${games.length} games`);

    // Show the game selection modal.
    showGameSelectionModal(games, (selectedGames) => {
      // Generate ICS file.
      const icsContent = generateICS(selectedGames);

      if (icsContent) {
        // Trigger download.
        const teamName = selectedGames[0]?.teamName || 'team';
        const filename = `${teamName.toLowerCase().replace(/\s+/g, '-')}-schedule.ics`;
        downloadICS(icsContent, filename);

        console.log(`Downloaded ${selectedGames.length} games to ${filename}`);
      } else {
        alert('Error generating calendar file. Please try again.');
      }
    });
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
        console.log(`[NY Urban Extension] Schedule loaded with ${rows.length} rows`);
        return;
      }
    }

    // Wait 500ms before checking again.
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('[NY Urban Extension] Timeout waiting for schedule, proceeding anyway');
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
