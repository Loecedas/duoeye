import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import LandingHero from '../components/LandingHero';

const container = document.getElementById('landing-root');

if (container) {
  createRoot(container).render(createElement(LandingHero));
}
