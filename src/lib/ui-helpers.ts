/**
 * Creates a styled control button with hover effects.
 */
export const createControlButton = (text: string, onClick: () => void): HTMLButtonElement => {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.cssText = `
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
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

/**
 * Creates a styled download button for the calendar export.
 */
export const createDownloadButton = (onClick: () => void): HTMLButtonElement => {
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download calendar file (.ics)';
  downloadBtn.setAttribute('aria-label', 'Download selected games as calendar file');
  downloadBtn.style.cssText = `
    padding: 10px 24px;
    border: none;
    background: #28a745;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.2s;
  `;
  downloadBtn.addEventListener('click', onClick);
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
  return downloadBtn;
};

/**
 * Creates a row with select/deselect controls and download button.
 */
export const createControlsRow = (
  onDownload: () => void,
  toggleAllCheckboxes: (checked: boolean) => void
): HTMLElement => {
  const controlsRow = document.createElement('div');
  controlsRow.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e0e0e0;
  `;

  const selectAllContainer = document.createElement('div');
  selectAllContainer.style.cssText = `
    display: flex;
    gap: 8px;
  `;

  const selectAllBtn = createControlButton('Select all', () => toggleAllCheckboxes(true));
  const deselectAllBtn = createControlButton('Deselect all', () => toggleAllCheckboxes(false));

  selectAllContainer.appendChild(selectAllBtn);
  selectAllContainer.appendChild(deselectAllBtn);
  controlsRow.appendChild(selectAllContainer);

  const downloadBtn = createDownloadButton(onDownload);
  controlsRow.appendChild(downloadBtn);

  return controlsRow;
};

/**
 * Creates an empty state message when no games are found.
 */
export const createEmptyState = (): HTMLElement => {
  const container = document.createElement('div');
  container.textContent = 'No games found on this page.';
  container.style.cssText = `
    padding: 20px;
    text-align: center;
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  return container;
};
