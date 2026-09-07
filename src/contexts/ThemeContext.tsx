import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';

/**
 * Global light/dark theme for the whole platform.
 *
 * The app is dark by default. When the theme is "light" we add the `.light`
 * class to <html>; index.css redefines every colour token under that class,
 * so the entire UI reskins with no component re-render. The choice is stored
 * in localStorage and re-applied before first paint by a tiny inline script
 * in index.html (so there is no dark→light flash on reload).
 */

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'terex-theme';

function readStored(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('light', theme === 'light');
}

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStored());

  // Keep <html> and storage in sync whenever the theme changes.
  useEffect(() => {
    apply(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(t => (t === 'dark' ? 'light' : 'dark')), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback so a stray consumer never crashes the app.
    return {
      theme: 'dark',
      toggleTheme: () => { /* no-op outside provider */ },
      setTheme: () => { /* no-op outside provider */ },
    };
  }
  return ctx;
}
