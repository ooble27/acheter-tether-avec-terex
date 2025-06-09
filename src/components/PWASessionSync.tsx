
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
      // Écouter les changements de session depuis d'autres onglets/sources
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'supabase.auth.token') {
          // La session a changé dans un autre onglet/navigateur
          console.log('Session changed in another tab, refreshing...');
          supabase.auth.refreshSession();
        }
      };

      // Écouter les changements dans localStorage
      window.addEventListener('storage', handleStorageChange);

      // Vérifier périodiquement si une nouvelle session est disponible
      const checkSession = async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session && !user) {
            console.log('New session found, user should be logged in');
            // La session sera automatiquement mise à jour par le AuthContext
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
      };

      // Vérifier toutes les 5 secondes si une session est disponible
      const intervalId = setInterval(checkSession, 5000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(intervalId);
      };
    }
  }, [user]);

  // Synchroniser la session vers localStorage pour que PWA puisse la détecter
  useEffect(() => {
    if (user) {
      // Marquer qu'une session active existe
      localStorage.setItem('terex-session-active', 'true');
      localStorage.setItem('terex-last-session-update', Date.now().toString());
    } else {
      localStorage.removeItem('terex-session-active');
      localStorage.removeItem('terex-last-session-update');
    }
  }, [user]);

  return null; // Ce composant n'affiche rien
}
