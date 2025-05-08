import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles/index.css';
import './assets/styles/App.css';

// Debug printout for entry
console.debug('[index.tsx] Rendering App');

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('[index.tsx] Root element not found');
} 