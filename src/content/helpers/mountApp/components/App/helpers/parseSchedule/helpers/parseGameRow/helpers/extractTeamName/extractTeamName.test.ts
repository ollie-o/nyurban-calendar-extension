import { JSDOM } from 'jsdom';
import { extractTeamName } from './extractTeamName';

describe('extractTeamName', () => {
  const testCases = [
    {
      name: 'returns team name when present',
      html: '<div class="green_block team"><h1><span>Team Name</span></h1></div>',
      expected: { ok: true, value: 'Team Name' },
    },
    {
      name: 'returns error when team name not found',
      html: '<html><body></body></html>',
      expected: { ok: false, message: 'Team name not found on page' },
    },
  ];

  testCases.forEach(({ name, html, expected }) => {
    it(name, () => {
      const doc = new JSDOM(html).window.document;
      const result = extractTeamName(doc);

      if (expected.ok) {
        expect(result.isErr()).toBe(false);
        if (!result.isErr()) {
          expect(result.value).toBe(expected.value);
        }
      } else {
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.message).toBe(expected.message);
        }
      }
    });
  });
});
