import { mountApp } from '../components/root';

// Mount app when DOM is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
