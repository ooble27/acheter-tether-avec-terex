
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  console.log('ThemeProvider: Initializing...');
  
  // Add error boundary for useState
  let theme: Theme;
  let setTheme: (theme: Theme) => void;
  
  try {
    const [themeState, setThemeState] = useState<Theme>('dark');
    theme = themeState;
    setTheme = setThemeState;
  } catch (error) {
    console.error('Error in ThemeProvider useState:', error);
    // Fallback values
    theme = 'dark';
    setTheme = () => {};
  }

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [theme, setTheme]);

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
