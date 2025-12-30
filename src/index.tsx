import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import index.css from parent directory since this file is in src/
import '../index.css'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);