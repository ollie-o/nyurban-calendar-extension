import { Result, ok, err } from 'neverthrow';
import { Game } from '../../../../shared/types/Game/Game';

/**
 * Generates and downloads the selected games as an ICS file.
 */
export const handleDownload = (
  selectedGames: Game[],
  generateICS: (games: Game[]) => Result<string, Error>,
  downloadICS: (icsContent: string, filename?: string) => void,
  sanitizeFilename: (value: string) => string
): Result<void, Error> => {
  if (selectedGames.length === 0) {
    return err(new Error('Please select at least one game to download.'));
  }

  const result = generateICS(selectedGames);
  if (result.isErr()) {
    return err(new Error(`Failed to generate calendar file: ${result.error.message}.`));
  }

  const teamName = selectedGames[0]?.teamName || 'team';
  const filename = `${sanitizeFilename(teamName)}-schedule.ics`;
  downloadICS(result.value, filename);
  return ok(undefined);
};
