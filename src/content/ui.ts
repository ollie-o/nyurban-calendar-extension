import { Game } from '../lib/types';
import { UI_IDS, SELECTORS } from '../lib/constants';
import { createControlsRow, createEmptyState } from '../lib/ui-helpers';
import { formatDate, formatTime } from '../lib/formatters';

/**
 * Injects the games list UI into the page with checkboxes and download functionality.
 */
export const injectGamesList = (
  games: Game[],
  onDownload: (selectedGames: Game[]) => void
): void => {
  if (document.getElementById(UI_IDS.CONTAINER)) {
    return;
  }

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
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;

  const title = document.createElement('h3');
  title.textContent = 'Select games to add to calendar';
  title.style.cssText = `
    margin: 0 0 20px 0;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  `;
  container.appendChild(title);

  const gameList = createGameList(games, onDownload);
  container.appendChild(gameList);

  const findAndInsertContainer = (): boolean => {
    const teamDiv = document.querySelector(SELECTORS.TEAM_DIV);

    if (teamDiv) {
      teamDiv.insertAdjacentElement('afterend', container);
      return true;
    }

    return false;
  };

  if (!findAndInsertContainer()) {
    document.body.insertBefore(container, document.body.firstChild);
  }
};

const createGameList = (
  games: Game[],
  onDownload: (selectedGames: Game[]) => void
): HTMLElement => {
  const container = document.createElement('div');

  if (games.length === 0) {
    return createEmptyState();
  }

  const handleDownload = () => {
    const selectedGames = getSelectedGames(games);
    if (selectedGames.length === 0) {
      alert('Please select at least one game');
      return;
    }
    onDownload(selectedGames);
  };

  const controlsRow = createControlsRow(handleDownload, toggleAllCheckboxes);
  container.appendChild(controlsRow);

  const table = document.createElement('table');
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    color: #000;
  `;

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
      font-weight: bold;
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

  const tbody = document.createElement('tbody');
  games.forEach((game, index) => {
    const row = createGameItem(game, index);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  return container;
};

const createGameItem = (game: Game, index: number): HTMLTableRowElement => {
  const row = document.createElement('tr');
  row.setAttribute('role', 'row');
  row.setAttribute('tabindex', '0');
  row.setAttribute(
    'aria-label',
    `Game ${game.gameNumber}: ${game.teamName} vs ${game.opponent} on ${formatDate(game.date)} at ${formatTime(game.date)}`
  );
  row.style.cssText = `
    border-bottom: 1px solid #e9ecef;
    cursor: pointer;
    color: #000;
  `;

  row.addEventListener('mouseenter', () => {
    row.style.background = '#f8f9fa';
  });
  row.addEventListener('mouseleave', () => {
    row.style.background = 'white';
  });

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

  const gameCell = document.createElement('td');
  gameCell.style.cssText = `
    padding: 12px 8px;
    color: #000;
  `;
  gameCell.textContent = `#${game.gameNumber}`;
  row.appendChild(gameCell);

  const opponentCell = document.createElement('td');
  opponentCell.style.cssText = `
    padding: 12px 8px;
    color: #000;
  `;
  opponentCell.textContent = game.opponent;
  row.appendChild(opponentCell);

  const dateTimeCell = document.createElement('td');
  dateTimeCell.style.cssText = `
    padding: 12px 8px;
  `;
  const dateDiv = document.createElement('div');
  dateDiv.textContent = formatDate(game.date);
  dateDiv.style.cssText = `
    color: #000;
  `;
  const timeDiv = document.createElement('div');
  timeDiv.textContent = formatTime(game.date);
  timeDiv.style.cssText = `
    color: #000;
    margin-top: 2px;
  `;
  dateTimeCell.appendChild(dateDiv);
  dateTimeCell.appendChild(timeDiv);
  row.appendChild(dateTimeCell);

  const locationCell = document.createElement('td');
  locationCell.style.cssText = `
    padding: 12px 8px;
    color: #000;
  `;
  locationCell.textContent = game.location;
  row.appendChild(locationCell);

  const detailsCell = document.createElement('td');
  detailsCell.style.cssText = `
    padding: 12px 8px;
    color: #555;
    max-width: 200px;
    white-space: pre-wrap;
  `;
  detailsCell.textContent = game.locationDetails || '';
  row.appendChild(detailsCell);

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

const toggleAllCheckboxes = (checked: boolean): void => {
  const checkboxes = document.querySelectorAll<HTMLInputElement>(`.${UI_IDS.GAME_CHECKBOX}`);
  checkboxes.forEach((cb) => {
    cb.checked = checked;
  });
};
