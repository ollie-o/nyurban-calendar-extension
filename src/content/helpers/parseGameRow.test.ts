import { parseGameRow } from './parseGameRow';
import { JSDOM } from 'jsdom';

describe('parseGameRow', () => {
  it('should parse a valid game row', () => {
    const html = `
      <tr>
        <td>1/14</td>
        <td><a>D2P</a></td>
        <td>District 2 Pre K 355 E. 76th Map</td>
        <td>6:30 pm</td>
        <td>Tyrannosaurus Sets</td>
      </tr>
    `;
    const dom = new JSDOM(html);
    const row = dom.window.document.querySelector('tr') as Element;

    const result = parseGameRow(row, 'Test Team', 1);
    expect(result.isErr()).toBe(false);
    if (!result.isErr()) {
      expect(result.value).not.toBeNull();
      expect(result.value?.opponent).toBe('Tyrannosaurus Sets');
      expect(result.value?.location).toBe('D2P');
    }
  });

  it('should return null for "No Game" entries', () => {
    const html = `
      <tr>
        <td>No Game</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `;
    const dom = new JSDOM(html);
    const row = dom.window.document.querySelector('tr') as Element;

    const result = parseGameRow(row, 'Test Team', 1);
    expect(result.isErr()).toBe(false);
    if (!result.isErr()) {
      expect(result.value).toBeNull();
    }
  });

  it('should return null for rows with insufficient cells', () => {
    const html = `
      <tr>
        <td>1/14</td>
        <td>D2P</td>
      </tr>
    `;
    const dom = new JSDOM(html);
    const row = dom.window.document.querySelector('tr') as Element;

    const result = parseGameRow(row, 'Test Team', 1);
    expect(result.isErr()).toBe(false);
    if (!result.isErr()) {
      expect(result.value).toBeNull();
    }
  });
});
