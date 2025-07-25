
import React from 'react';
import { SplashScreen } from './SplashScreen';
import { useSplashScreen } from '@/hooks/useSplashScreen';

interface AppLoaderProps {
  children: React.ReactNode;
  loading?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ children, loading = false }) => {
  const { showSplash, handleSplashComplete, isAppReady } = useSplashScreen(1800);

  // Vérifier si on est en mode PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  // Afficher le splash screen uniquement en mode PWA ou si l'app charge
  if ((isPWA && showSplash) || loading) {
    return <SplashScreen onComplete={handleSplashComplete} minDuration={1800} />;
  }

  // Afficher l'application normale
  return <>{children}</>;
};
