
import * as React from "react";

// Considérer les appareils entre 768px et 1180px comme des tablettes
const MIN_TABLET_WIDTH = 768;
const MAX_TABLET_WIDTH = 1180;

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkIsTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MIN_TABLET_WIDTH && width <= MAX_TABLET_WIDTH);
    };
    
    // Vérifier au chargement
    checkIsTablet();
    
    // Écouter les changements de taille d'écran
    window.addEventListener("resize", checkIsTablet);
    
    return () => window.removeEventListener("resize", checkIsTablet);
  }, []);

  return !!isTablet;
}
