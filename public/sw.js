
const CACHE_NAME = 'terex-v2';
const STATIC_CACHE = 'terex-static-v2';
const DATA_CACHE = 'terex-data-v2';

// Ressources statiques critiques
const staticUrlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
  '/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// URLs de données critiques à mettre en cache
const criticalDataUrls = [
  'https://api.coingecko.com/api/v3/simple/price',
  '/api/rates',
  '/api/user-profile'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('SW: Installation en cours...');
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('SW: Cache statique ouvert');
        return cache.addAll(staticUrlsToCache);
      }),
      // Cache des données critiques
      caches.open(DATA_CACHE).then((cache) => {
        console.log('SW: Cache données ouvert');
        return Promise.all(
          criticalDataUrls.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                cache.put(url, response.clone());
              }
            }).catch(() => {
              console.log(`SW: Impossible de pré-cacher ${url}`);
            })
          )
        );
      })
    ])
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activation en cours...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE && cacheName !== CACHE_NAME) {
            console.log('SW: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache intelligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Stratégie Cache First pour les ressources statiques
  if (staticUrlsToCache.some(staticUrl => request.url.includes(staticUrl))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Stratégie Network First avec fallback pour l'API
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request).then((response) => {
        // Si la réponse est OK, la mettre en cache
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DATA_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // En cas d'erreur réseau, utiliser le cache
        return caches.match(request).then((response) => {
          if (response) {
            console.log('SW: Utilisation du cache pour:', request.url);
            return response;
          }
          // Retourner une réponse d'erreur JSON si pas de cache
          return new Response(
            JSON.stringify({ error: 'Pas de connexion réseau', offline: true }),
            { 
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
      })
    );
    return;
  }

  // Stratégie Network First pour les autres requêtes
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        // Page hors ligne pour les routes de l'app
        if (request.destination === 'document') {
          return caches.match('/');
        }
      });
    })
  );
});

// Gestion des notifications push améliorée
self.addEventListener('push', (event) => {
  console.log('SW: Push notification reçue:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('SW: Données push:', data);
      
      const options = {
        body: data.body,
        icon: data.icon || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
        badge: data.badge || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: data.actions || [
          {
            action: 'open',
            title: 'Ouvrir Terex',
            icon: '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png'
          },
          {
            action: 'dismiss',
            title: 'Ignorer'
          }
        ],
        requireInteraction: true,
        silent: false,
        tag: data.tag || 'terex-notification',
        timestamp: Date.now(),
        renotify: true
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'Terex', options)
      );
    } catch (error) {
      console.error('SW: Erreur traitement push notification:', error);
      
      // Notification de fallback améliorée
      event.waitUntil(
        self.registration.showNotification('Terex - Nouvelle notification', {
          body: 'Vous avez une nouvelle notification importante',
          icon: '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
          badge: '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          tag: 'terex-fallback'
        })
      );
    }
  }
});

// Gestion des clics sur notifications améliorée
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Clic sur notification:', event);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Chercher une fenêtre Terex ouverte
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Envoyer un message pour naviguer vers l'URL
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              url: urlToOpen,
              data: event.notification.data,
              timestamp: Date.now()
            });
            return client.focus();
          }
        }
        
        // Ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Synchronisation en arrière-plan pour les données critiques
self.addEventListener('sync', (event) => {
  console.log('SW: Synchronisation:', event.tag);
  
  if (event.tag === 'background-sync-rates') {
    event.waitUntil(
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd,eur,xof')
        .then(response => response.json())
        .then(data => {
          return caches.open(DATA_CACHE).then(cache => {
            cache.put('https://api.coingecko.com/api/v3/simple/price', new Response(JSON.stringify(data)));
          });
        })
        .catch(error => {
          console.log('SW: Erreur sync rates:', error);
        })
    );
  }
});

// Gestion des messages du client améliorée
self.addEventListener('message', (event) => {
  console.log('SW: Message reçu:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.keys().then(cacheNames => {
      event.ports[0].postMessage({
        type: 'CACHE_STATUS',
        caches: cacheNames,
        timestamp: Date.now()
      });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    Promise.all([
      caches.delete(STATIC_CACHE),
      caches.delete(DATA_CACHE)
    ]).then(() => {
      event.ports[0].postMessage({
        type: 'CACHE_CLEARED',
        timestamp: Date.now()
      });
    });
  }
});
