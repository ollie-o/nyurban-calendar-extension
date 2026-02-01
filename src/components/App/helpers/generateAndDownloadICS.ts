import { Result, ok, err } from 'neverthrow';
import { Game } from '../../../lib/types';

/**
 * Generates an ICS file from selected games and triggers a download.
 */
export const generateAndDownloadICS = (
  selectedGames: Game[],
  generateICS: (games: Game[]) => Result<string, Error>,
  downloadICS: (content: string, filename?: string) => void,
  sanitizeFilename: (s: string) => string
): Result<void, Error> => {
  if (selectedGames.length === 0) {
    return err(new Error('Please select at least one game to download.'));
  }

  const icsResult = generateICS(selectedGames);
  if (icsResult.isErr()) {
    return err(new Error(`Failed to generate calendar file: ${icsResult.error.message}.`));
  }

  const teamName = selectedGames[0]?.teamName || 'team';
  const filename = `${sanitizeFilename(teamName)}-schedule.ics`;
  downloadICS(icsResult.value, filename);
  return ok(undefined);
};
