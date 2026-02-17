import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExecuteDashboard } from './pages/ExecuteDashboard';
import './styles/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExecuteDashboard />
  </React.StrictMode>
);
