
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  let location;
  
  // Safely get location with error handling
  try {
    location = useLocation();
  } catch (error) {
    // If we're outside router context, just return null
    console.warn('ScrollToTop: Router context not available', error);
    return null;
  }

  const { pathname } = location;

  useEffect(() => {
    // Multiple methods to ensure reliable scroll to top
    const scrollToTop = () => {
      // Method 1: Immediate scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      // Method 2: Force scroll on HTML elements
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: Ensure scroll after a short delay
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    };

    scrollToTop();

    // Ensure scroll even if component remounts after render
    const timeoutId = setTimeout(scrollToTop, 50);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
