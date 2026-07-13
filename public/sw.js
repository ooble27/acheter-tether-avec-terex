
const CACHE_NAME = 'terex-v5'; // v5 : purge du cache (nouvelle page carrière, pointage déplacé). Force le rafraîchissement des bundles côté clients.
const urlsToCache = [
  '/'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('SW: Installation en cours...');
  // Force l'activation immédiate du nouveau service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('SW: Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Prendre le contrôle immédiatement de tous les clients
      self.clients.claim()
    ])
  );
  
  // Notifier tous les clients qu'une nouvelle version est disponible
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        message: 'Nouvelle version installée'
      });
    });
  });
});

// Stratégie Network First avec cache fallback pour les ressources dynamiques
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // NE JAMAIS intercepter : autre origine (Supabase / API externes), requêtes non-GET,
  // ou endpoints d'auth/api. On laisse le navigateur gérer nativement — sinon le
  // Service Worker peut bloquer le rafraîchissement de session et figer la PWA sur « Chargement… ».
  if (url.origin !== self.location.origin ||
      event.request.method !== 'GET' ||
      url.pathname.includes('/auth/') ||
      url.pathname.includes('/api/')) {
    return;
  }

  // Pour les autres ressources (HTML, CSS, JS, images), utiliser Network First avec cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier si nous avons reçu une réponse valide
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Cloner la réponse pour la mettre en cache
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // En cas d'erreur réseau, utiliser le cache
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          
          // Si pas de cache et c'est une requête de document, retourner la page d'accueil
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Vérification périodique des mises à jour
self.addEventListener('message', (event) => {
  console.log('SW: Message reçu:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Forcer une vérification de mise à jour
    self.registration.update();
  }
});

// Gestion des notifications push (conservé tel quel)
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

// Gestion des clics sur notifications (conservé tel quel)
self.addEventListener('notificationclick', (event) => {
  console.log('Clic sur notification:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              url: urlToOpen,
              data: event.notification.data
            });
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Vérification automatique des mises à jour toutes les 30 secondes
setInterval(() => {
  self.registration.update();
}, 30000);
