import { createRoot } from 'react-dom/client';
import { App } from './components/App/App';
import { UI_IDS, SELECTORS } from './shared/constants/constants';

/**
 * Mount the React app to the page.
 */
export const mountApp = () => {
  const container = document.createElement('div');
  container.id = UI_IDS.CONTAINER;

  const teamDiv = document.querySelector(SELECTORS.TEAM_DIV);
  if (teamDiv) {
    teamDiv.insertAdjacentElement('afterend', container);
  } else {
    document.body.insertBefore(container, document.body.firstChild);
  }

  const root = createRoot(container);
  root.render(<App />);
};
