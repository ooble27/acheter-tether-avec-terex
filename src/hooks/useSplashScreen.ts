
import { useState, useEffect } from 'react';

export const useSplashScreen = (minDuration: number = 2000) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Marquer l'application comme prête après un court délai
    const readyTimer = setTimeout(() => {
      setIsAppReady(true);
    }, 500);

    return () => clearTimeout(readyTimer);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return {
    showSplash: showSplash && !isAppReady,
    handleSplashComplete,
    isAppReady
  };
};
