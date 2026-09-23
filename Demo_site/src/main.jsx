// main.jsx — React root.
//
// Stylesheets are imported here, in cascade order. tokens.css must come first
// because everything after it resolves against those custom properties.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/charts.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
