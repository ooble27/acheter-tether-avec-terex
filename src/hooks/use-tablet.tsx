import * as React from "react";

// Tablette : entre 768px et 1180px de large.
const QUERY = "(min-width: 768px) and (max-width: 1180px)";

/**
 * Comme useIsMobile : on s'appuie sur `matchMedia` (viewport de MISE EN PAGE)
 * et non sur `window.innerWidth` (viewport VISUEL), qui suivait le zoom pincé
 * sur iPad/PWA et provoquait des flashs de mise en page au chargement.
 */
function query(): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  return window.matchMedia(QUERY);
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(() => query()?.matches ?? false);

  React.useEffect(() => {
    const mql = query();
    if (!mql) return;
    const onChange = () => setIsTablet(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    window.addEventListener('orientationchange', onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
      window.removeEventListener('orientationchange', onChange);
    };
  }, []);

  return isTablet;
}
