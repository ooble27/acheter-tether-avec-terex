
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx: Starting application...');
console.log('Main.tsx: React version:', React.version);

// Enregistrement du service worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration);
      })
      .catch((error) => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

// Initialize the app
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Main.tsx: Creating React root...');

// Ensure React is fully loaded before proceeding
const initializeApp = () => {
  try {
    // Verify React hooks are available
    if (!React.useState) {
      console.error('Main.tsx: React hooks not available, retrying...');
      setTimeout(initializeApp, 100);
      return;
    }
    
    console.log('Main.tsx: React hooks available, creating root...');
    const root = createRoot(rootElement);
    console.log('Main.tsx: Rendering App component...');
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('Main.tsx: App rendered successfully');
  } catch (error) {
    console.error('Main.tsx: Error during app initialization:', error);
    // Retry after a short delay
    setTimeout(initializeApp, 500);
  }
};

// Start initialization
initializeApp();
