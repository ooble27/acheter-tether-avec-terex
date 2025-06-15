
const CACHE_NAME = 'terex-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
  '/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retourner la réponse
        if (response) {
          return response;
        }
        
        // Cloner la requête
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Vérifier si nous avons reçu une réponse valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Cloner la réponse
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // En cas d'erreur réseau, retourner une page hors ligne basique
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (event.data) {
    const data = event.data.json();
    console.log('Push notification data:', data);
    
    const options = {
      body: data.body,
      icon: data.icon || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
      badge: data.badge || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: 'Ouvrir Terex'
        },
        {
          action: 'close',
          title: 'Fermer'
        }
      ],
      requireInteraction: true,
      silent: false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Ouvrir ou focuser l'application
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si l'app est déjà ouverte, la focuser
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Sinon ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          const url = event.notification.data?.url || '/';
          return clients.openWindow(url);
        }
      })
  );
});

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});
