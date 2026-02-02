import { mountApp } from './helpers/mountApp/mountApp';

/**
 * Entry point that mounts the app when the DOM is ready.
 */
const content = (): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
  } else {
    mountApp();
  }
};

content();
