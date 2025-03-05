import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { reportWebVitals } from './lib/performance';
import App from './App.tsx';
import './index.css';

// Create root with error boundary
const root = createRoot(document.getElementById('root')!);

// Render app
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Report performance metrics
reportWebVitals(console.log);