
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forcer le scroll immédiatement et de façon synchrone
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Exécuter immédiatement
    scrollToTop();

    // Exécuter après un court délai pour s'assurer que le DOM est mis à jour
    const timeoutId = setTimeout(scrollToTop, 10);

    // Exécuter après le rendu complet
    const animationFrameId = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pathname]);

  return null;
}
