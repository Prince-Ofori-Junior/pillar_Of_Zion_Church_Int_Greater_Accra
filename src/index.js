import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// React 18 root render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
