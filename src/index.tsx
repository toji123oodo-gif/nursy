import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

console.log("React Entry Point: Starting...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("CRITICAL ERROR: Element with id 'root' not found in DOM.");
  throw new Error("Failed to find the root element");
}

try {
  console.log("React Entry Point: Mounting App...");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React Entry Point: App Mounted Successfully.");
} catch (error) {
  console.error("CRITICAL ERROR: React failed to mount.", error);
}