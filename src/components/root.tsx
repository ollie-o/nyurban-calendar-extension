import { createRoot } from 'react-dom/client';
import { App } from './App/App';
import { UI_IDS, SELECTORS } from '../lib/constants';

/**
 * Mount the React app to the page.
 */
export const mountApp = () => {
  // Create container and insert into page.
  const container = document.createElement('div');
  container.id = UI_IDS.CONTAINER;

  const teamDiv = document.querySelector(SELECTORS.TEAM_DIV);
  if (teamDiv) {
    teamDiv.insertAdjacentElement('afterend', container);
  } else {
    document.body.insertBefore(container, document.body.firstChild);
  }

  // Mount React app.
  const root = createRoot(container);
  root.render(<App />);
};
