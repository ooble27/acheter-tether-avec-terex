
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  console.log('ThemeProvider: Starting initialization...');
  
  // Add safety check to ensure React hooks are available
  if (!React.useState) {
    console.error('ThemeProvider: React hooks not available yet');
    return <>{children}</>;
  }
  
  console.log('ThemeProvider: React hooks available, proceeding with initialization...');
  
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    console.log('ThemeProvider: Applying theme:', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const contextValue = React.useMemo(() => {
    console.log('ThemeProvider: Creating context value');
    return {
      theme,
      setTheme,
    };
  }, [theme]);

  console.log('ThemeProvider: Rendering provider with theme:', theme);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
