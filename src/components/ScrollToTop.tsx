
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Méthode multiple pour assurer un scroll fiable vers le haut
    const scrollToTop = () => {
      // Méthode 1: Scroll immédiat
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      
      // Méthode 2: Force le scroll sur les éléments HTML
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Méthode 3: Assurer le scroll après un délai court
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
      
      // Méthode 4: RequestAnimationFrame pour assurer l'exécution
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    };

    scrollToTop();

    // Assurer le scroll même si le composant se remonte après le rendu
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
