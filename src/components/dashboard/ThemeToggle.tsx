import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Floating light/dark toggle for the whole platform. Fixed top-left, mirroring
 * the profile button on the right. Shows a sun in dark mode (tap to go light)
 * and a moon in light mode (tap to go dark).
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="fixed z-50 bg-terex-darker/95 backdrop-blur-sm border border-terex-gray/50 text-foreground hover:bg-terex-gray/80 rounded-xl w-12 h-12"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        left: 'max(16px, calc((100vw - 1000px) / 2 + 8px))',
      }}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
