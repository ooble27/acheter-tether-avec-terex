
import * as React from "react";

// Considérer les appareils entre 768px et 1180px comme des tablettes
const MIN_TABLET_WIDTH = 768;
const MAX_TABLET_WIDTH = 1180;

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(
    typeof window !== 'undefined'
      ? window.innerWidth >= MIN_TABLET_WIDTH && window.innerWidth <= MAX_TABLET_WIDTH
      : false
  );

  React.useEffect(() => {
    const checkIsTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MIN_TABLET_WIDTH && width <= MAX_TABLET_WIDTH);
    };

    // Vérifier au chargement + après le premier rendu (stabilise iPad/PWA)
    checkIsTablet();
    const raf = requestAnimationFrame(checkIsTablet);

    window.addEventListener("resize", checkIsTablet);
    window.addEventListener("orientationchange", checkIsTablet);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", checkIsTablet);
      window.removeEventListener("orientationchange", checkIsTablet);
    };
  }, []);

  return !!isTablet;
}
