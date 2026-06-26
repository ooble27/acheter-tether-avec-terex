
import React from 'react';

interface AppLoaderProps {
  children: React.ReactNode;
  loading?: boolean;
}

// Splash screen retiré — l'application s'affiche directement.
export const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  return <>{children}</>;
};
