
import { useState } from 'react';

export const useSplashScreen = (minDuration: number = 3500) => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return {
    showSplash,
    handleSplashComplete,
    isAppReady: !showSplash,
  };
};
