
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  console.log('ThemeProvider: Initializing...');
  
  // Add defensive check to ensure we're in a React context
  if (!React || typeof React.useState !== 'function') {
    console.error('ThemeProvider: React hooks not available');
    return <>{children}</>;
  }

  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    } catch (error) {
      console.error('ThemeProvider: Error applying theme:', error);
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
