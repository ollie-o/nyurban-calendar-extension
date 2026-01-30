import { Game } from '../lib/types';

/**
 * Creates and injects the "Add to Calendar" button on the page
 * @param onClick - Callback function when button is clicked
 */
export const injectCalendarButton = (onClick: () => void): void => {
  // Check if button already exists.
  if (document.getElementById('nyurban-calendar-btn')) {
    return;
  }

  const button = document.createElement('button');
  button.id = 'nyurban-calendar-btn';
  button.textContent = 'Select games to add to calendar';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
  `;

  button.addEventListener('click', onClick);

  document.body.appendChild(button);
};

/**
 * Creates and displays a modal for game selection
 * @param games - Array of games to display
 * @param onDownload - Callback when download button is clicked, receives selected games
 */
export const showGameSelectionModal = (
  games: Game[],
  onDownload: (selectedGames: Game[]) => void
): void => {
  // Remove existing modal if present.
  const existingModal = document.getElementById('nyurban-calendar-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal overlay.
  const overlay = document.createElement('div');
  overlay.id = 'nyurban-calendar-modal';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  `;

  // Create modal content.
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white;
    color: black;
    padding: 20px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  // Title.
  const title = document.createElement('h2');
  title.textContent = 'Select Games to Add';
  modal.appendChild(title);

  // Game list.
  const gameList = createGameList(games);
  modal.appendChild(gameList);

  // Buttons.
  const buttonContainer = document.createElement('div');

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => overlay.remove());

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download ICS';
  downloadBtn.addEventListener('click', () => {
    const selectedGames = getSelectedGames(games);
    if (selectedGames.length > 0) {
      onDownload(selectedGames);
      overlay.remove();
    } else {
      alert('Please select at least one game');
    }
  });

  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(downloadBtn);
  modal.appendChild(buttonContainer);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click.
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
};

/**
 * Creates the game list with checkboxes
 */
const createGameList = (games: Game[]): HTMLElement => {
  const container = document.createElement('div');

  if (games.length === 0) {
    container.textContent = 'No games found on this page.';
    return container;
  }

  // Select All / Deselect All buttons.
  const selectAllContainer = document.createElement('div');

  const selectAllBtn = document.createElement('button');
  selectAllBtn.textContent = 'Select All';
  selectAllBtn.addEventListener('click', () => toggleAllCheckboxes(true));

  const deselectAllBtn = document.createElement('button');
  deselectAllBtn.textContent = 'Deselect All';
  deselectAllBtn.addEventListener('click', () => toggleAllCheckboxes(false));

  selectAllContainer.appendChild(selectAllBtn);
  selectAllContainer.appendChild(deselectAllBtn);
  container.appendChild(selectAllContainer);

  // Game items.
  games.forEach((game, index) => {
    const item = createGameItem(game, index);
    container.appendChild(item);
  });

  return container;
};

/**
 * Creates a single game list item with checkbox
 */
const createGameItem = (game: Game, index: number): HTMLElement => {
  const item = document.createElement('label');
  item.style.display = 'block';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.className = 'game-checkbox';
  checkbox.dataset.gameIndex = String(index);

  const info = document.createElement('span');
  info.textContent = `${game.teamName} game ${game.gameNumber} vs. ${game.opponent} - ${formatDate(game.date)} at ${formatTime(game.time)} • ${game.location}`;

  item.appendChild(checkbox);
  item.appendChild(info);

  return item;
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
