
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-3 px-3 py-2">
      <Sun className={`h-4 w-4 transition-colors ${theme === 'light' ? 'text-terex-accent' : 'text-gray-400'}`} />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-terex-accent data-[state=unchecked]:bg-gray-300"
      />
      <Moon className={`h-4 w-4 transition-colors ${theme === 'dark' ? 'text-terex-accent' : 'text-gray-400'}`} />
    </div>
  );
}
