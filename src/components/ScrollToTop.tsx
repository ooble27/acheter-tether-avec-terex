
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Fonction améliorée pour un scroll vers le haut plus fiable
    const scrollToTop = () => {
      // Méthode 1: Scroll immédiat vers le haut
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Changé de 'smooth' à 'instant' pour éviter les bugs
      });
      
      // Méthode 2: Force le scroll sur les éléments HTML
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Méthode 3: Assurer le scroll avec requestAnimationFrame
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
      
      // Méthode 4: Double vérification après un délai très court
      setTimeout(() => {
        if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
          });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, 10);
    };

    // Exécution immédiate
    scrollToTop();

    // Double vérification après le rendu
    const timeoutId = setTimeout(scrollToTop, 50);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
