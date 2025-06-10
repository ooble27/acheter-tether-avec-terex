
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 bg-background/50 hover:bg-background/80 border-border/50"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-terex-accent" />
      ) : (
        <Moon className="h-4 w-4 text-terex-accent" />
      )}
    </Button>
  );
}
