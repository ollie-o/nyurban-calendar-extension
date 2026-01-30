import { Game } from '../lib/types';
import { UI_IDS, SELECTORS } from '../lib/constants';
import { createControlsRow, createEmptyState } from '../lib/ui-helpers';
import { formatDate, formatTime } from '../lib/formatters';

/**
 * Creates and injects the game selection panel on the page
 * @param games - Array of games to display
 * @param onDownload - Callback when download button is clicked, receives selected games
 */
export const injectGamesList = (
  games: Game[],
  onDownload: (selectedGames: Game[]) => void
): void => {
  // Check if container already exists.
  if (document.getElementById(UI_IDS.CONTAINER)) {
    return;
  }

  // Create white container div.
  const container = document.createElement('div');
  container.id = UI_IDS.CONTAINER;
  container.style.cssText = `
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    margin: 20px auto;
    max-width: 900px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `;

  // Title.
  const title = document.createElement('h3');
  title.textContent = 'Select games to add to calendar';
  title.style.cssText = `
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  `;
  container.appendChild(title);

  // Game list.
  const gameList = createGameList(games, onDownload);
  container.appendChild(gameList);

  // Find the team name div and insert container below it.
  const findAndInsertContainer = (): boolean => {
    // Look for div with class "green_block team".
    const teamDiv = document.querySelector(SELECTORS.TEAM_DIV);

    if (teamDiv) {
      teamDiv.insertAdjacentElement('afterend', container);
      return true;
    }

    return false;
  };

  // Try to insert at the specific location, fallback to body if not found.
  if (!findAndInsertContainer()) {
    document.body.insertBefore(container, document.body.firstChild);
  }
};

/**
 * Creates the game list with checkboxes
 */
const createGameList = (
  games: Game[],
  onDownload: (selectedGames: Game[]) => void
): HTMLElement => {
  const container = document.createElement('div');

  if (games.length === 0) {
    return createEmptyState();
  }

  // Add download handler with validation.
  const handleDownload = () => {
    const selectedGames = getSelectedGames(games);
    if (selectedGames.length === 0) {
      alert('Please select at least one game');
      return;
    }
    onDownload(selectedGames);
  };

  // Control buttons row.
  const controlsRow = createControlsRow(handleDownload, toggleAllCheckboxes);
  container.appendChild(controlsRow);

  // Create table.
  const table = document.createElement('table');
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: #000;
  `;

  // Table header.
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.cssText = `
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  `;

  const headers = ['', 'Game', 'Opponent', 'Date & Time', 'Location', 'Details'];
  headers.forEach((headerText) => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.cssText = `
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      color: #000;
    `;
    if (headerText === '') {
      th.style.width = '40px';
      th.style.textAlign = 'center';
    }
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Table body.
  const tbody = document.createElement('tbody');
  games.forEach((game, index) => {
    const row = createGameItem(game, index);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  return container;
};

/**
 * Creates a single game list item with checkbox
 */
const createGameItem = (game: Game, index: number): HTMLTableRowElement => {
  const row = document.createElement('tr');
  row.setAttribute('role', 'row');
  row.setAttribute('tabindex', '0');
  row.setAttribute(
    'aria-label',
    `Game ${game.gameNumber}: ${game.teamName} vs ${game.opponent} on ${formatDate(game.date)} at ${formatTime(game.time)}`
  );
  row.style.cssText = `
    border-bottom: 1px solid #e9ecef;
    cursor: pointer;
    color: #000;
  `;

  // Hover effect.
  row.addEventListener('mouseenter', () => {
    row.style.background = '#f8f9fa';
  });
  row.addEventListener('mouseleave', () => {
    row.style.background = 'white';
  });

  // Checkbox cell.
  const checkboxCell = document.createElement('td');
  checkboxCell.style.cssText = `
    padding: 12px 8px;
    text-align: center;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.className = UI_IDS.GAME_CHECKBOX;
  checkbox.dataset.gameIndex = String(index);
  checkbox.setAttribute('aria-label', `Select game ${game.gameNumber} vs ${game.opponent}`);
  checkbox.setAttribute('id', `game-checkbox-${index}`);
  checkbox.style.cssText = `
    width: 18px;
    height: 18px;
    cursor: pointer;
  `;

  checkboxCell.appendChild(checkbox);
  row.appendChild(checkboxCell);

  // Game number cell.
  const gameCell = document.createElement('td');
  gameCell.style.cssText = `
    padding: 12px 8px;
    font-weight: 500;
    color: #000;
  `;
  gameCell.textContent = `#${game.gameNumber}`;
  row.appendChild(gameCell);

  // Opponent cell.
  const opponentCell = document.createElement('td');
  opponentCell.style.cssText = `
    padding: 12px 8px;
    color: #000;
  `;
  opponentCell.textContent = game.opponent;
  row.appendChild(opponentCell);

  // Date & time cell.
  const dateTimeCell = document.createElement('td');
  dateTimeCell.style.cssText = `
    padding: 12px 8px;
  `;
  const dateDiv = document.createElement('div');
  dateDiv.textContent = formatDate(game.date);
  dateDiv.style.cssText = `
    font-weight: 500;
    color: #000;
  `;
  const timeDiv = document.createElement('div');
  timeDiv.textContent = formatTime(game.time);
  timeDiv.style.cssText = `
    font-size: 12px;
    color: #000;
    margin-top: 2px;
  `;
  dateTimeCell.appendChild(dateDiv);
  dateTimeCell.appendChild(timeDiv);
  row.appendChild(dateTimeCell);

  // Location cell.
  const locationCell = document.createElement('td');
  locationCell.style.cssText = `
    padding: 12px 8px;
    font-size: 13px;
    color: #000;
  `;
  locationCell.textContent = game.location;
  row.appendChild(locationCell);

  // Details cell.
  const detailsCell = document.createElement('td');
  detailsCell.style.cssText = `
    padding: 12px 8px;
    font-size: 12px;
    color: #555;
    max-width: 200px;
    white-space: pre-wrap;
  `;
  detailsCell.textContent = game.locationDetails || '';
  row.appendChild(detailsCell);

  // Toggle checkbox on row click or keyboard interaction.
  row.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  });

  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
    }
  });

  return row;
};

/**
 * Gets the selected games based on checkboxes
 * @param games - All available games
 * @returns Array of selected games
 */
const getSelectedGames = (games: Game[]): Game[] => {
  const checkboxes = document.querySelectorAll<HTMLInputElement>(
    `.${UI_IDS.GAME_CHECKBOX}:checked`
  );
  return Array.from(checkboxes)
    .map((cb) => {
      const index = parseInt(cb.dataset.gameIndex || '0');
      return games[index];
    })
    .filter((game): game is Game => Boolean(game));
};

/**
 * Toggles all checkboxes
 * @param checked - True to check all, false to uncheck all
 */
const toggleAllCheckboxes = (checked: boolean): void => {
  const checkboxes = document.querySelectorAll<HTMLInputElement>(`.${UI_IDS.GAME_CHECKBOX}`);
  checkboxes.forEach((cb) => {
    cb.checked = checked;
  });
};
