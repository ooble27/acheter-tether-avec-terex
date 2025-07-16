
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeSwitchProps {
  className?: string;
  variant?: 'default' | 'icon' | 'minimal';
}

export function ThemeSwitch({ className = '', variant = 'default' }: ThemeSwitchProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <Button 
        onClick={toggleTheme}
        variant="ghost"
        size="icon"
        className={`transition-all duration-200 hover:bg-accent/50 ${className}`}
        aria-label={`Basculer vers le mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-blue-600" />
        )}
      </Button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-accent/50 ${className}`}
        aria-label={`Basculer vers le mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-blue-600" />
        )}
      </button>
    );
  }

  return (
    <Button 
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 transition-all duration-200 ${className}`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4 text-yellow-500" />
          <span>Mode Clair</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-blue-600" />
          <span>Mode Sombre</span>
        </>
      )}
    </Button>
  );
}
