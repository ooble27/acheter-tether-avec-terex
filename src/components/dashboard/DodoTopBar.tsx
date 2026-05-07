import { Bell, Menu } from 'lucide-react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Button } from '@/components/ui/button';

interface DodoTopBarProps {
  user: { email: string; name: string } | null;
  onOpenMenu?: () => void;
  showMenuButton?: boolean;
}

export function DodoTopBar({ user, onOpenMenu, showMenuButton }: DodoTopBarProps) {
  const { usdtToCfa, loading } = useCryptoRates();
  const initials = (user?.name || 'U')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenMenu}
              className="lg:hidden text-white hover:bg-white/5 h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-terex-accent animate-pulse" />
            <span className="text-[11px] text-gray-400 font-mono">
              USDT/XOF
            </span>
            <span className="text-[11px] text-white font-mono font-medium">
              {loading ? '—' : Math.round(usdtToCfa)}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-white/5 h-9 w-9"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <div className="hidden sm:flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-full bg-white/[0.03] border border-white/5">
            <span className="text-xs text-gray-400 font-light max-w-[120px] truncate">
              {user?.name?.split(' ')[0] || 'Compte'}
            </span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-terex-accent to-terex-accent/60 flex items-center justify-center text-white text-[11px] font-medium">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
