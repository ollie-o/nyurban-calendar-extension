import {
  parseSchedule,
  isValidGame,
  getEasternOffset,
  extractTeamName,
} from '../src/content/parser';
import { Game } from '../src/lib/types';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

/**
 * Helper to load an HTML fixture file
 * Extracts the real HTML from Chrome's view-source wrapper if present
 */
const loadHTMLFixture = (filename: string): Document => {
  const filePath = path.join(process.cwd(), 'tests', 'fixtures', filename);
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
});

describe('Parser', () => {
  const testCases = [
    {
      name: 'ollie_vollies.html',
      fixture: 'ollie_vollies.html',
      expectedTeamName: 'Ollie Vollies',
      expectedGameCount: 9,
      expectedGames: [
        {
          gameNumber: 1,
          opponent: 'Sloppy Sets',
          date: '2026-01-13T18:30:00-05:00',
          location: 'AOS',
          description:
            'Adolph Ochs School 440 West 53rd St btw 9th&10th Gym is in the basement. NO spectators',
        },
        {
          gameNumber: 2,
          opponent: 'Grass-roots Effort',
          date: '2026-01-28T18:30:00-05:00',
          location: 'D2P',
          description:
            'District 2 Pre K 355 E. 76th bet 1st & 2nd Do not arrive at school before 6:15 *Special Note* There is only a 5 minute grace period before calling a forfeit at D2P. Please be on time! . Bring ID. Take stairs to the 6th floor gym. No Spectators.',
        },
        {
          gameNumber: 3,
          opponent: 'Googley 1',
          date: '2026-02-04T20:10:00-05:00',
          location: 'BRN-N',
          description:
            'Brandeis H.S. (Near Court) 84th bet Columbus & Amsterdam Players may not enter the school before 8 PM. No Spectators. No Children. No Bikes.',
        },
        {
          gameNumber: 4,
          opponent: 'Serves you Right',
          date: '2026-02-19T21:10:00-05:00',
          location: 'CHL',
          description: 'Chelsea School 281 9th Ave.(bet 26th & 27th)',
        },
        {
          gameNumber: 5,
          opponent: 'NPH',
          date: '2026-02-25T19:00:00-05:00',
          location: 'LAG-F',
          description: 'LaGuardia H.S. (Far Court) 65th St & Amsterdam No Bikes! NO SPECTATORS!',
        },
        {
          gameNumber: 6,
          opponent: 'Overcooked',
          date: '2026-03-04T19:00:00-05:00',
          location: 'CHL',
          description: 'Chelsea School 281 9th Ave.(bet 26th & 27th)',
        },
        {
          gameNumber: 7,
          opponent: 'INTERVOL',
          date: '2026-03-19T20:10:00-04:00',
          location: 'BRN-N',
          description:
            'Brandeis H.S. (Near Court) 84th bet Columbus & Amsterdam Players may not enter the school before 8 PM. No Spectators. No Children. No Bikes.',
        },
        {
          gameNumber: 8,
          opponent: 'Volley Llamas',
          date: '2026-03-27T21:15:00-04:00',
          location: 'JJC-A',
          description:
            'John Jay College (Auxillary) 59th Street & 10th Ave. JJC-M main gym, JJC-A auxiliary gym. (F= far court, N= near court) NO SPECTATORS!',
        },
        {
          gameNumber: 9,
          opponent: 'Fourmidable',
          date: '2026-03-31T21:15:00-04:00',
          location: 'LAG-N',
          description: 'LaGuardia H.S. (Near Court) 65th St & Amsterdam No Bikes! NO SPECTATORS!',
        },
      ],
    },
    {
      name: 'ball_bumping_losers.html',
      fixture: 'ball_bumping_losers.html',
      expectedTeamName: 'Ball Bumping Losers',
      expectedGameCount: 8,
      expectedGames: [
        {
          gameNumber: 1,
          opponent: 'Limited Edition Release',
          date: '2026-07-16T21:15:00-04:00',
          location: 'JJC-N',
          description:
            'John Jay College (Near Court) 59th Street & 10th Ave. JJC-M main gym, JJC-A auxiliary gym. (F= far court, N= near court) NO SPECTATORS!',
        },
        {
          gameNumber: 2,
          opponent: 'Pineapple Express',
          date: '2026-07-21T19:00:00-04:00',
          location: 'LAG-N',
          description: 'LaGuardia H.S. (Near Court) 65th St & Amsterdam No Bikes! NO SPECTATORS!',
        },
        {
          gameNumber: 3,
          opponent: 'Sandy Cheeks',
          date: '2026-07-31T19:00:00-04:00',
          location: 'BRN-F',
          description:
            'Brandeis H.S. (Far Court) 84th bet Columbus & Amsterdam Players may not enter the school before 8 PM. No Spectators. No Children. No Bikes.',
        },
        {
          gameNumber: 4,
          opponent: 'OnlyMans',
          date: '2026-08-04T21:15:00-04:00',
          location: 'BRN-N',
          description:
            'Brandeis H.S. (Near Court) 84th bet Columbus & Amsterdam Players may not enter the school before 8 PM. No Spectators. No Children. No Bikes.',
        },
        {
          gameNumber: 5,
          opponent: 'McFlurries',
          date: '2026-08-14T19:00:00-04:00',
          location: 'BRN-F',
          description:
            'Brandeis H.S. (Far Court) 84th bet Columbus & Amsterdam Players may not enter the school before 8 PM. No Spectators. No Children. No Bikes.',
        },
        {
          gameNumber: 6,
          opponent: 'Elpha-baddies',
          date: '2026-08-20T19:00:00-04:00',
          location: 'SJN',
          description:
            'St. John Nepomucene 406 E. 67th St (1st/York) Enter via middle set of gray doors on 67th b/w 1st & York. Do not arrive before 8pm, or 7pm on Wednesdays. NO SPECTATORS',
        },
        {
          gameNumber: 7,
          opponent: 'Team Solo Mid',
          date: '2026-08-25T21:15:00-04:00',
          location: 'JJC-N',
          description:
            'John Jay College (Near Court) 59th Street & 10th Ave. JJC-M main gym, JJC-A auxiliary gym. (F= far court, N= near court) NO SPECTATORS!',
        },
        {
          gameNumber: 8,
          opponent: 'Pineapple Express',
          date: '2026-09-11T19:00:00-04:00',
          location: 'JJC-N',
          description:
            'John Jay College (Near Court) 59th Street & 10th Ave. JJC-M main gym, JJC-A auxiliary gym. (F= far court, N= near court) NO SPECTATORS!',
        },
      ],
    },
    {
      name: 'beach_trash.html',
      fixture: 'beach_trash.html',
      expectedTeamName: 'BEACH TRASH VOL. 2',
      expectedGameCount: 9,
      expectedGames: [
        {
          gameNumber: 1,
          opponent: 'Built Assets',
          date: '2026-01-14T18:30:00-05:00',
          location: 'D2P',
          description:
            'District 2 Pre K 355 E. 76th bet 1st & 2nd Do not arrive at school before 6:15 *Special Note* There is only a 5 minute grace period before calling a forfeit at D2P. Please be on time! . Bring ID. Take stairs to the 6th floor gym. No Spectators.',
        },
        {
          gameNumber: 2,
          opponent: 'Tyrannosaurus Sets',
          date: '2026-01-29T19:00:00-05:00',
          location: 'CHL',
          description: 'Chelsea School 281 9th Ave.(bet 26th & 27th)',
        },
        {
          gameNumber: 3,
          opponent: 'Unprotected Sets',
          date: '2026-02-05T21:15:00-05:00',
          location: 'LAG-F',
          description: 'LaGuardia H.S. (Far Court) 65th St & Amsterdam No Bikes! NO SPECTATORS!',
        },
        {
          gameNumber: 4,
          opponent: 'NYC Seniors',
          date: '2026-02-12T21:10:00-05:00',
          location: 'CHL',
          description: 'Chelsea School 281 9th Ave.(bet 26th & 27th)',
        },
        {
          gameNumber: 5,
          opponent: 'fka Dreyfus',
          date: '2026-02-24T20:10:00-05:00',
          location: 'LAG-F',
          description: 'LaGuardia H.S. (Far Court) 65th St & Amsterdam No Bikes! NO SPECTATORS!',
        },
        {
          gameNumber: 6,
          opponent: 'Funky Sets',
          date: '2026-03-05T19:40:00-05:00',
          location: 'D2P',
          description:
            'District 2 Pre K 355 E. 76th bet 1st & 2nd Do not arrive at school before 6:15 *Special Note* There is only a 5 minute grace period before calling a forfeit at D2P. Please be on time! . Bring ID. Take stairs to the 6th floor gym. No Spectators.',
        },
        {
          gameNumber: 7,
          opponent: 'Blockbusters',
          date: '2026-03-11T20:10:00-04:00',
          location: 'BRN-F',
          description:
            'Brandeis H.S. (Far Court) 84th bet Columbus & Amsterdam Players may not enter the school before 8 PM. No Spectators. No Children. No Bikes.',
        },
        {
          gameNumber: 8,
          opponent: 'Googley 3',
          date: '2026-03-17T20:10:00-04:00',
          location: 'LAG-F',
          description: 'LaGuardia H.S. (Far Court) 65th St & Amsterdam No Bikes! NO SPECTATORS!',
        },
        {
          gameNumber: 9,
          opponent: 'Your Neighborhood Spikers',
          date: '2026-03-27T20:10:00-04:00',
          location: 'JJC-A',
          description:
            'John Jay College (Auxillary) 59th Street & 10th Ave. JJC-M main gym, JJC-A auxiliary gym. (F= far court, N= near court) NO SPECTATORS!',
        },
      ],
    },
    {
      name: 'empty_page.html',
      fixture: 'empty_page.html',
      expectedTeamName: '',
      expectedGameCount: 0,
      expectedGames: [],
    },
  ];

  testCases.forEach(({ name, fixture, expectedTeamName, expectedGameCount, expectedGames }) => {
    it(name, () => {
      const doc = loadHTMLFixture(fixture);
      const result = parseSchedule(doc);

      // Check that parsing succeeds.
      expect(result.isOk()).toBe(true);
      if (!result.isOk()) {
        return;
      }

      const games = result.value;

      // Assert team name.
      expect(games).toBeInstanceOf(Array);
      if (expectedTeamName) {
        expect(games.length).toBeGreaterThan(0);
        expect(games[0].teamName).toBe(expectedTeamName);
      }

      // Assert number of games.
      expect(games.length).toBe(expectedGameCount);

      // Assert all games.
      expectedGames.forEach((expected, index) => {
        const game = games[index];
        expect(game.gameNumber).toBe(expected.gameNumber);
        expect(game.teamName).toBe(expectedTeamName);
        expect(game.opponent).toBe(expected.opponent);
        expect(game.date).toBe(expected.date);
        expect(game.location).toBe(expected.location);
        expect(game.locationDetails).toBe(expected.description);
      });
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
      gameNumber: 1,
      teamName: 'Test Team',
    };

    expect(isValidGame(validGame)).toBe(true);
    expect(isValidGame(incompleteGame)).toBe(false);
  });
});
