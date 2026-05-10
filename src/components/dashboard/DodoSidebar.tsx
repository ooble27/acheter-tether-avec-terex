import { Home, History, User, HelpCircle, Send, TrendingDown, Shield, ShoppingCart, UserCheck, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const TetherIcon = ({ className }: { className?: string }) => (
  <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" className={cn('object-contain', className)} />
);

interface DodoSidebarProps {
  activeSection: string;
  onSectionChange: (s: string) => void;
  onLogout: () => void;
}

interface Item { id: string; label: string; icon: any; custom?: boolean; }

export function DodoSidebar({ activeSection, onSectionChange, onLogout }: DodoSidebarProps) {
  const { isKYCReviewer, isAdmin } = useUserRole();
  const [adminOpen, setAdminOpen] = useState(true);

  const primary: Item[] = [
    { id: 'home',     label: 'Tableau de bord', icon: Home },
    { id: 'buy',      label: 'Acheter USDT',    icon: TetherIcon, custom: true },
    { id: 'sell',     label: 'Vendre USDT',     icon: TrendingDown },
    { id: 'transfer', label: 'Transferts',       icon: Send },
    { id: 'otc',      label: 'OTC Desk',         icon: TrendingDown },
  ];

  const account: Item[] = [
    { id: 'history', label: 'Historique', icon: History },
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'faq',     label: 'Aide & FAQ', icon: HelpCircle },
  ];

  const adminItems: Item[] = [
    { id: 'kyc-admin',        label: 'KYC',         icon: Shield },
    { id: 'orders-admin',     label: 'Commandes',   icon: ShoppingCart },
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
          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer',
          active
            ? 'bg-[#171717] text-white font-medium'
            : 'text-[#a3a3a3] hover:bg-[#171717]/60 hover:text-[#d4d4d4] font-normal'
        )}
      >
        <span className={cn('flex items-center justify-center w-4 h-4 shrink-0', active ? 'text-white' : 'text-[#737373]')}>
          {it.custom ? <Icon className="w-4 h-4" /> : <Icon className="w-4 h-4" strokeWidth={1.8} />}
        </span>
        <span className="truncate">{it.label}</span>
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B968F]" />}
      </button>
    );
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] bg-[#111] border-r border-[#262626] z-40">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#262626]">
        <button onClick={() => onSectionChange('home')} className="flex items-center gap-2 group">
          <img
            src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
            alt="Terex"
            className="w-7 h-7 rounded-md"
          />
          <span className="text-[15px] font-semibold text-white tracking-tight">Terex</span>
        </button>
        <span className="text-[9px] text-[#404040] border border-[#262626] rounded-full px-2 py-0.5">v2.4</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide space-y-5">
        <div className="space-y-0.5">
          {primary.map(renderItem)}
        </div>

        <Separator className="bg-[#262626]" />

        <div>
          <p className="px-2.5 mb-1.5 text-[10px] uppercase tracking-[0.15em] text-[#404040] font-medium">Compte</p>
          <div className="space-y-0.5">{account.map(renderItem)}</div>
        </div>

        {(isKYCReviewer() || isAdmin()) && (
          <div>
            <button
              onClick={() => setAdminOpen(o => !o)}
              className="w-full flex items-center justify-between px-2.5 mb-1.5"
            >
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#404040] font-medium">Admin</span>
              <ChevronDown className={cn('w-3 h-3 text-[#404040] transition-transform', !adminOpen && '-rotate-90')} />
            </button>
            {adminOpen && <div className="space-y-0.5">{adminItems.map(renderItem)}</div>}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#262626] space-y-1">
        <button
          onClick={() => onSectionChange('profile')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#a3a3a3] hover:bg-[#171717]/60 hover:text-[#d4d4d4] transition-all"
        >
          <Settings className="w-4 h-4 text-[#737373]" strokeWidth={1.8} />
          <span>Paramètres</span>
        </button>

        <Separator className="bg-[#262626] my-1" />

        <button
          onClick={() => onSectionChange('profile')}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-[#262626] hover:border-[#404040] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#3B968F]/20 flex items-center justify-center shrink-0">
            <span className="text-[#3B968F] text-[11px] font-medium">AD</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[12px] font-medium text-white truncate">Mon compte</p>
            <p className="text-[10px] text-[#737373]">Vérifié · Niveau 2</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#737373] hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.8} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
