import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';

import { App } from '@/app/App';
import '@/lib/env';
import '@/styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
