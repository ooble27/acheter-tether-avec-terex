
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function PWASessionSync() {
  const { user } = useAuth();

  useEffect(() => {
    // Vérifier si on est en mode PWA (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      console.log('PWA Mode détecté - Synchronisation des sessions activée');
      
      // Vérifier immédiatement si une session est disponible
      const checkForSession = async () => {
        try {
          // Vérifier d'abord dans localStorage si une connexion récente a eu lieu
          const sessionActive = localStorage.getItem('terex-session-active');
          const lastUpdate = localStorage.getItem('terex-last-session-update');
          
          if (sessionActive === 'true' && lastUpdate) {
            const timeDiff = Date.now() - parseInt(lastUpdate);
            // Si la session a été mise à jour il y a moins de 5 minutes
            if (timeDiff < 5 * 60 * 1000) {
              console.log('Session récente détectée, tentative de récupération...');
              
              // Forcer la récupération de la session
              const { data: { session }, error } = await supabase.auth.getSession();
              
              if (session && !user) {
                console.log('Session récupérée avec succès dans PWA');
                // La session sera automatiquement mise à jour par le AuthContext
                return;
              }
              
              if (error) {
                console.error('Erreur lors de la récupération de session:', error);
              }
            }
          }
          
          // Si pas de session récente, essayer de rafraîchir
          await supabase.auth.refreshSession();
        } catch (error) {
          console.error('Erreur lors de la vérification de session:', error);
        }
      };

      // Vérifier immédiatement
      checkForSession();

      // Écouter les changements dans localStorage d'autres onglets/navigateurs
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'terex-session-active' && e.newValue === 'true') {
          console.log('Nouvelle session détectée dans un autre onglet');
          setTimeout(checkForSession, 1000); // Attendre un peu avant de vérifier
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Vérifier périodiquement (plus fréquent les premières minutes)
      let checkCount = 0;
      const intervalId = setInterval(() => {
        checkCount++;
        // Vérifier toutes les 3 secondes les 20 premières fois (1 minute)
        // puis toutes les 30 secondes
        if (checkCount <= 20) {
          checkForSession();
        } else if (checkCount % 10 === 0) { // Toutes les 30 secondes après
          checkForSession();
        }
      }, 3000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(intervalId);
      };
    }
  }, [user]);

  // Synchroniser la session vers localStorage quand l'utilisateur se connecte/déconnecte
  useEffect(() => {
    if (user) {
      console.log('Utilisateur connecté - Marquage de session active');
      localStorage.setItem('terex-session-active', 'true');
      localStorage.setItem('terex-last-session-update', Date.now().toString());
      localStorage.setItem('terex-user-email', user.email || '');
    } else {
      console.log('Utilisateur déconnecté - Nettoyage localStorage');
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
      localStorage.removeItem('terex-user-email');
    }
  }, [user]);

  return null; // Ce composant n'affiche rien
}
