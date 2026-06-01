import { mountApp } from './ui/app.js';

const rootElement = document.querySelector('#app');

if (rootElement) {
  mountApp(rootElement);
}
