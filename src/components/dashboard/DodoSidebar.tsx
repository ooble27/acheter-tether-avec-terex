import { Home, History, User, HelpCircle, Globe, TrendingDown, Handshake, Shield, ShoppingCart, UserCheck, ChevronDown, LogOut } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const TetherIcon = ({ className }: { className?: string }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={cn('object-contain', className)}
  />
);

interface DodoSidebarProps {
  activeSection: string;
  onSectionChange: (s: string) => void;
  onLogout: () => void;
}

interface Item {
  id: string;
  label: string;
  icon: any;
  custom?: boolean;
}

export function DodoSidebar({ activeSection, onSectionChange, onLogout }: DodoSidebarProps) {
  const { isKYCReviewer, isAdmin } = useUserRole();
  const [moreOpen, setMoreOpen] = useState(true);

  const primary: Item[] = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'buy', label: 'Acheter USDT', icon: TetherIcon, custom: true },
    { id: 'sell', label: 'Vendre USDT', icon: TrendingDown },
    { id: 'transfer', label: 'Virement', icon: Globe },
    { id: 'otc', label: 'OTC Desk', icon: Handshake },
  ];

  const account: Item[] = [
    { id: 'history', label: 'Historique', icon: History },
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'faq', label: 'Aide', icon: HelpCircle },
  ];

  const adminItems: Item[] = [
    { id: 'kyc-admin', label: 'KYC', icon: Shield },
    { id: 'orders-admin', label: 'Commandes', icon: ShoppingCart },
    { id: 'job-applications', label: 'Candidatures', icon: UserCheck },
  ];

  const renderItem = (it: Item) => {
    const Icon = it.icon;
    const active = activeSection === it.id;
    return (
      <button
        key={it.id}
        onClick={() => onSectionChange(it.id)}
        className={cn(
          'group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
          active
            ? 'bg-terex-accent/15 text-white border border-terex-accent/30'
            : 'text-gray-400 hover:bg-white/[0.04] hover:text-white border border-transparent'
        )}
      >
        <span
          className={cn(
            'flex items-center justify-center w-5 h-5 shrink-0',
            active ? 'text-terex-accent' : 'text-gray-500 group-hover:text-gray-300'
          )}
        >
          {it.custom ? <Icon className="w-5 h-5" /> : <Icon className="w-[18px] h-[18px]" />}
        </span>
        <span className="truncate font-light tracking-tight">{it.label}</span>
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-terex-accent" />}
      </button>
    );
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] bg-[#0d0d0d] border-r border-white/5 z-40">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <button
          onClick={() => onSectionChange('home')}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-terex-accent to-terex-accent/70 flex items-center justify-center shadow-lg shadow-terex-accent/20">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <div className="text-left leading-tight">
            <div className="text-white text-base font-semibold tracking-tight">Terex</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em]">Exchange</div>
          </div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-hide space-y-6">
        <div className="space-y-1">
          {primary.map(renderItem)}
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.15em] text-gray-600 font-medium">
            Compte
          </div>
          <div className="space-y-1">{account.map(renderItem)}</div>
        </div>

        {(isKYCReviewer() || isAdmin()) && (
          <div>
            <button
              onClick={() => setMoreOpen(o => !o)}
              className="w-full flex items-center justify-between px-3 mb-2"
            >
              <span className="text-[10px] uppercase tracking-[0.15em] text-gray-600 font-medium">
                Admin
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-gray-600 transition-transform',
                  !moreOpen && '-rotate-90'
                )}
              />
            </button>
            {moreOpen && <div className="space-y-1">{adminItems.map(renderItem)}</div>}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">USDT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-terex-accent animate-pulse" />
          </div>
          <div className="text-white text-sm font-medium mt-0.5">$1.00</div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="font-light">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
