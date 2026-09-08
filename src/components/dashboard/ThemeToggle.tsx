import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Light/dark theme switch — a flat horizontal slider (no shadow), meant to sit
 * directly in the page flow (it scrolls with the content, it is not fixed).
 * The knob slides left (dark) ↔ right (light); the sun/moon icon rides on it.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const light = theme === 'light';
  const W = 58, H = 30, KNOB = 24, PAD = 3;
  return (
    <button
      onClick={toggleTheme}
      aria-label={light ? 'Passer en mode sombre' : 'Passer en mode clair'}
      style={{
        position: 'relative',
        width: W, height: H,
        borderRadius: 999,
        border: '1px solid hsl(var(--terex-accent) / 0.14)',
        background: 'hsl(var(--terex-accent) / 0.06)',
        padding: 0,
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: PAD,
          left: light ? W - KNOB - PAD : PAD,
          width: KNOB, height: KNOB,
          borderRadius: '50%',
          background: 'hsl(var(--terex-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {light
          ? <Moon size={13} color="hsl(var(--terex-accent-fg))" />
          : <Sun size={13} color="hsl(var(--terex-accent-fg))" />}
      </span>
    </button>
  );
}
