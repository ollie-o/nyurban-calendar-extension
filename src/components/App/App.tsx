import React, { useEffect, useState } from 'react';
import { parseSchedule } from '../../content/parser';
import { generateICS, downloadICS } from '../../lib/ics-generator';
import { sanitizeFilename } from '../../lib/helpers/sanitizeFilename';
import { Game } from '../../lib/types';
import { GamesContainer } from './components/GamesContainer/GamesContainer';
import { EmptyState } from './components/EmptyState';
import { Error as ErrorComponent } from './components/Error';
import { generateAndDownloadICS } from './helpers/generateAndDownloadICS';
import { waitForScheduleToLoad } from './helpers/waitForScheduleToLoad';

/**
 * Main app component that handles all business logic for the extension.
 */
export const App: React.FC = () => {
  const [games, setGames] = useState<Game[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Wait for schedule to load.
    await waitForScheduleToLoad();

    // Parse the schedule.
    const gamesResult = parseSchedule(document);
    if (gamesResult.isErr()) {
      setError(gamesResult.error);
      setIsLoading(false);
      return;
    }

    const parsedGames = gamesResult.value;
    setGames(parsedGames);
    setIsLoading(false);
  };

  const handleDownload = (selectedGames: Game[]) => {
    const result = generateAndDownloadICS(
      selectedGames,
      generateICS,
      downloadICS,
      sanitizeFilename
    );
    if (result.isErr()) {
      setError(result.error);
    }
  };

  // WaitForScheduleToLoad is implemented in a helper to keep the component small.
  // See src/components/App/helpers/waitForScheduleToLoad.ts.

  if (isLoading) {
    return <div />;
  }

  if (error) {
    return <ErrorComponent error={error} onDismiss={() => setError(null)} />;
  }

  if (!games) {
    return <EmptyState />;
  }

  if (games.length === 0) {
    return <EmptyState />;
  }

  return <GamesContainer games={games} onDownload={handleDownload} onError={(e) => setError(e)} />;
};
