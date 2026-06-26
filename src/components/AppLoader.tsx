
import React from 'react';
import { SplashScreen } from './SplashScreen';
import { useSplashScreen } from '@/hooks/useSplashScreen';

interface AppLoaderProps {
  children: React.ReactNode;
  loading?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ children, loading = false }) => {
  // Add error boundary for hook usage
  let hookData;
  try {
    hookData = useSplashScreen(3200);
  } catch (error) {
    console.error('Error in useSplashScreen:', error);
    // Fallback without splash screen
    return <>{children}</>;
  }

  const { showSplash, handleSplashComplete } = hookData;

  // Afficher le splash screen au démarrage (toutes plateformes) ou si l'app charge
  if (showSplash || loading) {
    return <SplashScreen onComplete={handleSplashComplete} minDuration={3200} />;
  }

  // Afficher l'application normale
  return <>{children}</>;
};
