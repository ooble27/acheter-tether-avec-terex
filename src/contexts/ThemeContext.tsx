
import React, { createContext, useContext, useEffect, useState } from 'react';

console.log('ThemeContext.tsx: File loaded, React:', React);

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  console.log('ThemeProvider: Component rendering, React:', React);
  console.log('ThemeProvider: useState available:', typeof useState);
  
  const [theme, setTheme] = useState<Theme>('dark');
  console.log('ThemeProvider: useState called successfully, theme:', theme);

  useEffect(() => {
    console.log('ThemeProvider: useEffect running, theme:', theme);
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  console.log('ThemeProvider: Rendering with value:', value);

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
