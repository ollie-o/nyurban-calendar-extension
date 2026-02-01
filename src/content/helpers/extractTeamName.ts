import { Result, ok, err } from 'neverthrow';
import { SELECTORS } from '../../lib/constants';

/**
 * Extracts the team name from the page header.
 */
export const extractTeamName = (doc: Document): Result<string, Error> => {
  const teamHeader = doc.querySelector(SELECTORS.TEAM_NAME);

  if (teamHeader) {
    const teamName = teamHeader.textContent?.trim() || '';
    if (!teamName) {
      return err(new Error('Team name element found but contains no text'));
    }
    return ok(teamName.replace(/^\*+[a-z]+-/i, '').trim());
  }

  return err(new Error('Team name not found on page'));
};
