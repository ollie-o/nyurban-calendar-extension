import React, { useEffect, useState } from 'react';

import { EmptyState } from './components/EmptyState/EmptyState';
import { Error as ErrorComponent } from './components/Error/Error';
import { GamesContainer } from './components/GamesContainer/GamesContainer';
import { parseSchedule } from './helpers/parseSchedule/parseSchedule';
import { waitForScheduleToLoad } from './helpers/waitForScheduleToLoad/waitForScheduleToLoad';
import { Game } from './shared/types/Game/Game';

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
    await waitForScheduleToLoad();

    const result = parseSchedule(document);
    if (result.isErr()) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setGames(result.value);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div />;
  }

  if (error) {
    return <ErrorComponent error={error} onDismiss={() => setError(null)} />;
  }

  if (!games || games.length === 0) {
    return <EmptyState />;
  }

  return <GamesContainer games={games} onError={(e) => setError(e)} />;
};
