
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: File loaded, React:', React);
console.log('main.tsx: React version:', React.version);
console.log('main.tsx: createRoot:', createRoot);

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

console.log('main.tsx: About to render App');
const rootElement = document.getElementById("root");
console.log('main.tsx: Root element:', rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log('main.tsx: Root created successfully');
  root.render(<App />);
  console.log('main.tsx: App rendered successfully');
} else {
  console.error('main.tsx: Root element not found');
}
