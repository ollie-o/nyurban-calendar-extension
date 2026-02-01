import { parseSchedule } from './parser';
import { isValidGame } from './helpers/isValidGame';
import { getEasternOffset } from './helpers/getEasternOffset';
import { extractTeamName } from './helpers/extractTeamName';
import { Game } from '../lib/types';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

/**
 * Helper to load an HTML fixture file
 * Extracts the real HTML from Chrome's view-source wrapper if present
 */
const loadHTMLFixture = (filename: string): Document => {
  const filePath = path.join(process.cwd(), 'src', 'content', 'fixtures', filename);
  const html = fs.readFileSync(filePath, 'utf8');

  // Check if this is a view-source HTML (has .line-content spans).
  const wrapperDom = new JSDOM(html);
  const lineContents = wrapperDom.window.document.querySelectorAll('.line-content');

  if (lineContents.length > 0) {
    // Extract the real HTML from line-content spans.
    let realHtml = '';
    lineContents.forEach((span) => {
      realHtml += span.textContent; // textContent decodes HTML entities.
    });

    // Parse and return the real HTML.
    const realDom = new JSDOM(realHtml);
    return realDom.window.document;
  }

  // Not a view-source wrapper, return as-is.
  return wrapperDom.window.document;
};

describe('Error Handling', () => {
  it('should return error when team name not found', () => {
    const emptyDoc = new JSDOM('<html><body></body></html>').window.document;
    const result = extractTeamName(emptyDoc);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe('Team name not found on page');
    }
  });

  it('should return error for invalid document', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = parseSchedule(null as any);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe('Invalid document provided to parseSchedule');
    }
  });
});

describe('Timezone Offset', () => {
  const testCases = [
    {
      name: 'January (EST)',
      input: { year: 2026, month: 1, day: 15, hour: 18, minute: 30 },
      expected: '-05:00',
    },
    {
      name: 'July (EDT)',
      input: { year: 2026, month: 7, day: 15, hour: 19, minute: 0 },
      expected: '-04:00',
    },
    {
      name: 'Early November after DST ends (EST)',
      input: { year: 2026, month: 11, day: 5, hour: 20, minute: 0 },
      expected: '-05:00',
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const offset = getEasternOffset(input.year, input.month, input.day, input.hour, input.minute);
      expect(offset).toBe(expected);
    });
  });

describe('Parser fixtures', () => {
  const cases = [
    { fixture: 'ollie_vollies.html', team: 'Ollie Vollies', count: 9 },
    { fixture: 'ball_bumping_losers.html', team: 'Ball Bumping Losers', count: 8 },
    { fixture: 'beach_trash.html', team: 'BEACH TRASH VOL. 2', count: 9 },
    { fixture: 'empty_page.html', team: '', count: 0 },
  ];

  cases.forEach(({ fixture, team, count }) => {
    it(`parses ${fixture}`, () => {
      const doc = loadHTMLFixture(fixture);
      const result = parseSchedule(doc);
      expect(result.isOk()).toBe(true);
      if (!result.isOk()) return;
      const games = result.value;
      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBe(count);
      if (team) {
        expect(games.length).toBeGreaterThan(0);
        expect(games[0].teamName).toBe(team);
      }
    });
  });

  it('should validate game objects correctly', () => {
    const validGame: Game = {
      gameNumber: 1,
      teamName: 'Test Team',
      opponent: 'Opponent',
      date: '2026-02-15T19:00:00-05:00',
      location: 'Gym',
      locationDetails: '123 Main St\nNotes about location',
    };

    const incompleteGame = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gameNumber: 1,
      teamName: 'Test Team',
    } as any;

    expect(isValidGame(validGame)).toBe(true);
    expect(isValidGame(incompleteGame)).toBe(false);
  });
});