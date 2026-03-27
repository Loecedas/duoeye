import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import DuoDashApp from '../components/DuoDashApp';

const container = document.getElementById('dashboard-root');

if (container) {
  createRoot(container).render(createElement(DuoDashApp));
}
