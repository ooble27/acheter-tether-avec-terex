
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
  console.log('Push notification reçue:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('Données push:', data);
      
      const options = {
        body: data.body,
        icon: data.icon || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
        badge: data.badge || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
        vibrate: [100, 50, 100],
        data: data.data || {},
        actions: data.actions || [
          {
            action: 'open',
            title: 'Ouvrir',
            icon: '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png'
          }
        ],
        requireInteraction: false,
        silent: false,
        tag: data.tag || 'terex-notification'
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (error) {
      console.error('Erreur traitement push notification:', error);
      
      // Notification de fallback
      event.waitUntil(
        self.registration.showNotification('Terex', {
          body: 'Vous avez une nouvelle notification',
          icon: '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
          badge: '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png'
        })
      );
    }
  }
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Clic sur notification:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Vérifier si l'application est déjà ouverte
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Naviguer vers l'URL de la notification
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              url: urlToOpen,
              data: event.notification.data
            });
            return client.focus();
          }
        }
        
        // Ouvrir une nouvelle fenêtre si l'application n'est pas ouverte
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('Message reçu dans SW:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
