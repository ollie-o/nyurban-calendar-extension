import { CONFIG } from '../../../lib/constants';

/**
 * Waits for the schedule table to appear on the page up to configured attempts.
 */
export const waitForScheduleToLoad = async (): Promise<void> => {
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
