import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Floating light/dark toggle for the whole platform. Sits top-right, just left
 * of the profile button (or in the profile button's slot when that button is
 * hidden). Uses a clearly-contrasting surface so it stays visible on both the
 * dark and the light ground. Sun in dark mode (tap → light), moon in light
 * mode (tap → dark).
 */
export function ThemeToggle({ offset = false }: { offset?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  // Same right anchor as the profile button; shift 56px further in when the
  // profile button is present so the two sit side by side.
  const baseRight = 'max(16px, calc((100vw - 1000px) / 2 + 8px))';
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="fixed z-50 bg-terex-gray/90 backdrop-blur-sm border border-terex-gray-light text-foreground hover:bg-terex-gray-light rounded-xl w-12 h-12 shadow-lg"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        right: offset ? `calc(${baseRight} + 56px)` : baseRight,
      }}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
