
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

export function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Vérifier si on est en mode PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                 (window.navigator as any).standalone ||
                 document.referrer.includes('android-app://');

    if (!isPWA) return;

    console.log('PWA Update: Initialisation du système de mise à jour');

    // Écouter les messages du service worker
    const handleMessage = (event: MessageEvent) => {
      console.log('PWA Update: Message reçu du SW:', event.data);
      
      if (event.data && event.data.type === 'SW_UPDATED') {
        console.log('PWA Update: Nouvelle version détectée');
        setShowUpdatePrompt(true);
        toast.info('Nouvelle version disponible', {
          description: 'Une mise à jour de l\'application est disponible.',
          duration: 5000,
        });
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    // Détecter les mises à jour du service worker
    const handleUpdateFound = () => {
      console.log('PWA Update: Mise à jour du SW détectée');
      setShowUpdatePrompt(true);
    };

    // Vérifier les mises à jour du service worker
    navigator.serviceWorker?.ready.then((registration) => {
      console.log('PWA Update: Service Worker prêt');
      
      // Écouter les nouvelles versions
      registration.addEventListener('updatefound', handleUpdateFound);
      
      // Vérifier immédiatement s'il y a une mise à jour en attente
      if (registration.waiting) {
        console.log('PWA Update: Service Worker en attente détecté');
        setShowUpdatePrompt(true);
      }
      
      // Vérifier périodiquement les mises à jour
      const checkForUpdates = () => {
        console.log('PWA Update: Vérification des mises à jour...');
        registration.update();
        
        // Envoyer un message au SW pour vérifier les mises à jour
        if (registration.active) {
          registration.active.postMessage({ type: 'CHECK_UPDATE' });
        }
      };
      
      // Vérification initiale
      checkForUpdates();
      
      // Vérifier toutes les 10 secondes
      const updateInterval = setInterval(checkForUpdates, 10000);
      
      return () => {
        clearInterval(updateInterval);
        registration.removeEventListener('updatefound', handleUpdateFound);
      };
    });

    // Vérifier quand l'app reprend le focus
    const handleFocus = () => {
      console.log('PWA Update: App a repris le focus - vérification des mises à jour');
      navigator.serviceWorker?.ready.then((registration) => {
        registration.update();
      });
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleFocus();
      }
    });

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleUpdate = async () => {
    console.log('PWA Update: Démarrage de la mise à jour...');
    setIsUpdating(true);
    
    try {
      const registration = await navigator.serviceWorker?.ready;
      
      if (registration?.waiting) {
        console.log('PWA Update: Activation du nouveau SW...');
        // Envoyer un message pour activer le nouveau service worker
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Attendre que le nouveau service worker prenne le contrôle
        navigator.serviceWorker?.addEventListener('controllerchange', () => {
          console.log('PWA Update: Nouveau SW actif - rechargement...');
          window.location.reload();
        });
      } else {
        console.log('PWA Update: Aucun SW en attente - rechargement direct...');
        // Forcer le rechargement avec vidage du cache
        window.location.reload();
      }
    } catch (error) {
      console.error('PWA Update: Erreur lors de la mise à jour:', error);
      // En cas d'erreur, forcer le rechargement
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    console.log('PWA Update: Mise à jour reportée');
    setShowUpdatePrompt(false);
    
    // Reprogrammer une vérification dans 5 minutes
    setTimeout(() => {
      setShowUpdatePrompt(true);
    }, 5 * 60 * 1000);
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <Card className="bg-terex-darker border-terex-accent/30 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-terex-accent/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-terex-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm">
                Mise à jour disponible
              </h3>
              <p className="text-gray-300 text-xs mt-1">
                Une nouvelle version de Terex est disponible. Actualisez pour obtenir les dernières améliorations.
              </p>
              <div className="flex space-x-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="bg-terex-accent text-black hover:bg-terex-accent/90 h-8 px-3 text-xs"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Actualiser
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  disabled={isUpdating}
                  className="text-gray-400 hover:text-white h-8 px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
