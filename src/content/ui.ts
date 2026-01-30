import { Game } from '../lib/types';

/**
 * Creates and injects the "Add to Calendar" button on the page
 * @param onClick - Callback function when button is clicked
 */
export const injectCalendarButton = (onClick: () => void): void => {
  console.log('[Button] Attempting to inject calendar button');

  // Check if container already exists.
  if (document.getElementById('nyurban-calendar-container')) {
    console.log('[Button] Container already exists, skipping injection');
    return;
  }

  // Create white container div.
  const container = document.createElement('div');
  container.id = 'nyurban-calendar-container';
  container.style.cssText = `
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    margin: 20px auto;
    max-width: 900px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `;

  // Create button with blue background.
  const button = document.createElement('button');
  button.id = 'nyurban-calendar-btn';
  button.textContent = 'Select games to add to calendar';
  console.log('[Button] Button element created');
  button.style.cssText = `
    display: block;
    margin: 0 auto;
    padding: 12px 32px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
    transition: all 0.2s;
    text-align: center;
  `;

  button.addEventListener('click', onClick);

  // Add hover effects.
  button.addEventListener('mouseenter', () => {
    button.style.background = '#0056b3';
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.background = '#007bff';
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
  });

  // Add button to container.
  container.appendChild(button);

  // Find the team name div and insert container below it.
  const findAndInsertContainer = (): boolean => {
    console.log('[Button] Searching for team name div...');

    // Look for div with class "green_block team".
    const teamDiv = document.querySelector('div.green_block.team');

    if (teamDiv) {
      console.log('[Button] Found team name div, inserting container after it');
      teamDiv.insertAdjacentElement('afterend', container);
      return true;
    }

    console.log('[Button] Team name div not found');
    return false;
  };

  // Try to insert at the specific location, fallback to body if not found.
  if (!findAndInsertContainer()) {
    console.log('[Button] Using fallback: inserting at beginning of body');
    document.body.insertBefore(container, document.body.firstChild);
  }

  console.log('[Button] Button injection complete');
};

/**
 * Creates and toggles an inline game selection panel
 * @param games - Array of games to display
 * @param onDownload - Callback when download button is clicked, receives selected games
 */
export const showGameSelectionModal = (
  games: Game[],
  onDownload: (selectedGames: Game[]) => void
): void => {
  const panelId = 'nyurban-calendar-panel';
  const existingPanel = document.getElementById(panelId);

  // If panel exists, toggle visibility.
  if (existingPanel) {
    const isHidden = existingPanel.style.display === 'none';
    existingPanel.style.display = isHidden ? 'block' : 'none';
    return;
  }

  // Create inline panel (no extra styling, it's inside the white container).
  const panel = document.createElement('div');
  panel.id = panelId;
  panel.style.cssText = `
    margin-top: 24px;
    padding-top: 24px;
    border-top: 2px solid #e0e0e0;
  `;

  // Title.
  const title = document.createElement('h3');
  title.textContent = 'Select Games to Add to Calendar';
  title.style.cssText = `
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  `;
  panel.appendChild(title);

  // Game list.
  const gameList = createGameList(games, onDownload);
  panel.appendChild(gameList);

  // Insert panel inside the container, after the button.
  const container = document.getElementById('nyurban-calendar-container');
  if (container) {
    container.appendChild(panel);
  } else {
    document.body.appendChild(panel);
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
    container.textContent = 'No games found on this page.';
    container.style.cssText = `
      padding: 20px;
      text-align: center;
      color: #666;
    `;
    return container;
  }

  // Control buttons row.
  const controlsRow = document.createElement('div');
  controlsRow.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e0e0e0;
  `;

  // Select All / Deselect All buttons.
  const selectAllContainer = document.createElement('div');
  selectAllContainer.style.cssText = `
    display: flex;
    gap: 8px;
  `;

  const createControlButton = (text: string, onClick: () => void): HTMLButtonElement => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    `;
    btn.addEventListener('click', onClick);
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f5f5f5';
      btn.style.borderColor = '#007bff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'white';
      btn.style.borderColor = '#ddd';
    });
    return btn;
  };

  const selectAllBtn = createControlButton('Select All', () => toggleAllCheckboxes(true));
  const deselectAllBtn = createControlButton('Deselect All', () => toggleAllCheckboxes(false));

  selectAllContainer.appendChild(selectAllBtn);
  selectAllContainer.appendChild(deselectAllBtn);
  controlsRow.appendChild(selectAllContainer);

  // Download button.
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download Calendar File (.ics)';
  downloadBtn.style.cssText = `
    padding: 10px 24px;
    border: none;
    background: #28a745;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.2s;
  `;
  downloadBtn.addEventListener('click', () => {
    const selectedGames = getSelectedGames(games);
    if (selectedGames.length > 0) {
      onDownload(selectedGames);
    } else {
      alert('Please select at least one game');
    }
  });
  downloadBtn.addEventListener('mouseenter', () => {
    downloadBtn.style.background = '#218838';
    downloadBtn.style.transform = 'translateY(-1px)';
    downloadBtn.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
  });
  downloadBtn.addEventListener('mouseleave', () => {
    downloadBtn.style.background = '#28a745';
    downloadBtn.style.transform = 'translateY(0)';
    downloadBtn.style.boxShadow = 'none';
  });

  controlsRow.appendChild(downloadBtn);
  container.appendChild(controlsRow);

  // Create table.
  const table = document.createElement('table');
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  `;

  // Table header.
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.cssText = `
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  `;

  const headers = ['', 'Game', 'Opponent', 'Date & Time', 'Location'];
  headers.forEach((headerText) => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.cssText = `
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      color: #495057;
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
  row.style.cssText = `
    border-bottom: 1px solid #e9ecef;
    cursor: pointer;
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
  checkbox.className = 'game-checkbox';
  checkbox.dataset.gameIndex = String(index);
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
  `;
  gameCell.textContent = `#${game.gameNumber}`;
  row.appendChild(gameCell);

  // Opponent cell.
  const opponentCell = document.createElement('td');
  opponentCell.style.cssText = `
    padding: 12px 8px;
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
  dateDiv.style.fontWeight = '500';
  const timeDiv = document.createElement('div');
  timeDiv.textContent = formatTime(game.time);
  timeDiv.style.cssText = `
    font-size: 12px;
    color: #6c757d;
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
  `;
  locationCell.textContent = game.location;
  row.appendChild(locationCell);

  // Toggle checkbox on row click.
  row.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  });

  return row;
};

/**
 * Gets the selected games based on checkboxes
 */
const getSelectedGames = (games: Game[]): Game[] => {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('.game-checkbox:checked');
  return Array.from(checkboxes)
    .map((cb) => games[parseInt(cb.dataset.gameIndex || '0')])
    .filter(Boolean);
};

/**
 * Toggles all checkboxes
 */
const toggleAllCheckboxes = (checked: boolean): void => {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('.game-checkbox');
  checkboxes.forEach((cb) => {
    cb.checked = checked;
  });
};

/**
 * Formats a date string for display
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a time string for display
 */
const formatTime = (timeStr: string): string => {
  const [hour, minute] = timeStr.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};
