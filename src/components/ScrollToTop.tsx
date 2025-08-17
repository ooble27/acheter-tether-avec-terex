
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Scroll immédiat et synchrone pour tous les environnements
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Force supplémentaire pour PWA mobile
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 10);
      }
    };

    scrollToTop();
    
    // Double vérification après un court délai
    setTimeout(scrollToTop, 50);
    
  }, [pathname, search, hash]);

  return null;
}

// Hook personnalisé pour forcer le scroll to top dans les composants
export function useScrollToTop() {
  return () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Force pour PWA
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
  };
}
