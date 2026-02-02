import * as fs from 'fs';
import * as path from 'path';

import { JSDOM } from 'jsdom';

import { Game } from '../../shared/types/Game/Game';

import { parseSchedule } from './parseSchedule';

/**
 * Helper to load an HTML fixture file
 * Extracts the real HTML from Chrome's view-source wrapper if present
 */
const loadHTMLFixture = (filename: string): Document => {
  const filePath = path.join(__dirname, 'helpers/fixtures', filename);
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

/**
 * Helper to load expected games from a JSON fixture file
 */
const loadExpectedGames = (filename: string): { teamName: string; games: Game[] } => {
  const filePath = path.join(__dirname, 'helpers/fixtures', filename);
  const json = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(json);
};

describe('Error Handling', () => {
  const errorCases = [
    {
      name: 'returns error when team name not found',
      getInput: () => new JSDOM('<html><body></body></html>').window.document,
      expectedError: 'Team name not found on page',
    },
    {
      name: 'returns error for invalid document',
      getInput: () => null as unknown as Document,
      expectedError: 'Invalid document provided to parseSchedule',
    },
  ];

  errorCases.forEach(({ name, getInput, expectedError }) => {
    it(name, () => {
      const result = parseSchedule(getInput());
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result._unsafeUnwrapErr().message).toBe(expectedError);
      }
    });
  });
});

describe('Parser fixtures', () => {
  const fixtureCases = [
    { htmlFile: 'ollie_vollies.html', jsonFile: 'ollie_vollies.json' },
    { htmlFile: 'ball_bumping_losers.html', jsonFile: 'ball_bumping_losers.json' },
    { htmlFile: 'beach_trash.html', jsonFile: 'beach_trash.json' },
    { htmlFile: 'empty_page.html', jsonFile: 'empty_page.json' },
  ];

  fixtureCases.forEach(({ htmlFile, jsonFile }) => {
    it(`parses ${htmlFile}`, () => {
      const doc = loadHTMLFixture(htmlFile);
      const { games: expectedGames } = loadExpectedGames(jsonFile);
      const result = parseSchedule(doc);

      expect(result.isErr()).toBe(false);
      const games = result._unsafeUnwrap();

      // We want to assert that both of these are of type `Game[]`.
      expect(games).toEqual(expectedGames);
    });
  });
});
