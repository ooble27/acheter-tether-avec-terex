import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log('ScrollToTop: Navigation vers', pathname);
    window.scrollTo(0, 0);
    console.log('ScrollToTop: Scroll effectué vers le haut');
  }, [pathname]);

  return null;
}