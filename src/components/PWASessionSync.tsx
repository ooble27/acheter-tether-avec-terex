
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function PWASessionSync() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Vérifier si on est en mode PWA (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      console.log('PWA Mode détecté - Synchronisation des sessions activée');
      
      // Fonction pour forcer la récupération de session
      const forceSessionRefresh = async () => {
        try {
          console.log('PWA: Tentative de récupération de session...');
          
          // Vérifier d'abord le localStorage pour une session active
          const sessionActive = localStorage.getItem('terex-session-active');
          const lastUpdate = localStorage.getItem('terex-last-session-update');
          const userEmail = localStorage.getItem('terex-user-email');
          
          console.log('PWA: État localStorage:', { sessionActive, lastUpdate, userEmail, currentUser: user?.email });
          
          if (sessionActive === 'true' && !user && userEmail) {
            console.log('PWA: Session active détectée sans utilisateur connecté, tentative de récupération...');
            
            // Forcer la récupération de la session depuis Supabase
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('PWA: Erreur lors de la récupération de session:', error);
              
              // Essayer de rafraîchir la session
              const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
              
              if (refreshError) {
                console.error('PWA: Erreur lors du refresh de session:', refreshError);
              } else if (refreshedSession.session) {
                console.log('PWA: Session rafraîchie avec succès');
                return;
              }
            } else if (session) {
              console.log('PWA: Session récupérée avec succès:', session.user?.email);
              return;
            }
            
            // Si aucune session valide, nettoyer le localStorage
            if (!session) {
              console.log('PWA: Aucune session valide trouvée, nettoyage localStorage');
              localStorage.removeItem('terex-session-active');
              localStorage.removeItem('terex-last-session-update');
              localStorage.removeItem('terex-user-email');
            }
          }
        } catch (error) {
          console.error('PWA: Erreur lors de la vérification de session:', error);
        }
      };

      // Vérifier immédiatement si pas d'utilisateur connecté
      if (!loading && !user) {
        forceSessionRefresh();
      }

      // Écouter les changements dans localStorage d'autres onglets/navigateurs
      const handleStorageChange = (e: StorageEvent) => {
        console.log('PWA: Changement localStorage détecté:', e.key, e.newValue);
        
        if (e.key === 'terex-session-active' && e.newValue === 'true' && !user) {
          console.log('PWA: Nouvelle session détectée depuis un autre onglet');
          setTimeout(forceSessionRefresh, 500);
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Vérification périodique plus agressive
      let checkCount = 0;
      const intervalId = setInterval(() => {
        checkCount++;
        
        // Si pas d'utilisateur connecté, vérifier plus souvent
        if (!user) {
          // Vérifier toutes les 2 secondes les 30 premières fois (1 minute)
          if (checkCount <= 30) {
            forceSessionRefresh();
          } 
          // Puis toutes les 10 secondes
          else if (checkCount % 5 === 0) {
            forceSessionRefresh();
          }
        }
        
        // Arrêter après 100 vérifications (environ 10 minutes)
        if (checkCount > 100) {
          clearInterval(intervalId);
        }
      }, 2000);

      // Focus event listener - vérifier quand l'app PWA reprend le focus
      const handleFocus = () => {
        console.log('PWA: App a repris le focus');
        if (!user) {
          setTimeout(forceSessionRefresh, 100);
        }
      };

      window.addEventListener('focus', handleFocus);
      window.addEventListener('visibilitychange', () => {
        if (!document.hidden && !user) {
          console.log('PWA: App redevient visible');
          setTimeout(forceSessionRefresh, 100);
        }
      });

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleFocus);
        clearInterval(intervalId);
      };
    }
  }, [user, loading]);

  // Synchroniser vers localStorage quand l'utilisateur se connecte/déconnecte
  useEffect(() => {
    if (user) {
      console.log('PWA: Utilisateur connecté - Sauvegarde session');
      localStorage.setItem('terex-session-active', 'true');
      localStorage.setItem('terex-last-session-update', Date.now().toString());
      localStorage.setItem('terex-user-email', user.email || '');
    } else if (!loading) {
      console.log('PWA: Utilisateur déconnecté - Nettoyage localStorage');
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
      localStorage.removeItem('terex-user-email');
    }
  }, [user, loading]);

  return null;
}
