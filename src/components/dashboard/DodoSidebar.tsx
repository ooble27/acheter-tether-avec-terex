import {
  Home, History, User, HelpCircle, Send, TrendingDown,
  Shield, ShoppingCart, UserCheck, ChevronDown, LogOut, Settings,
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

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
    { id: 'kyc-admin',        label: 'KYC',          icon: Shield },
    { id: 'orders-admin',     label: 'Commandes',    icon: ShoppingCart },
    { id: 'job-applications', label: 'Candidatures', icon: UserCheck },
  ];

  const renderItem = (it: Item) => {
    const Icon = it.icon;
    const active = activeSection === it.id;
    return (
      <SidebarMenuItem key={it.id}>
        <SidebarMenuButton
          isActive={active}
          onClick={() => onSectionChange(it.id)}
          className={cn(
            'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer h-auto',
            active
              ? '!bg-[#252525] !text-white font-medium'
              : '!text-[#888] hover:!bg-[#1f1f1f] hover:!text-[#ccc] font-normal'
          )}
        >
          <span className={cn('flex items-center justify-center w-4 h-4 shrink-0', active ? 'text-white' : 'text-[#555]')}>
            {it.custom ? <Icon className="w-4 h-4" /> : <Icon className="w-4 h-4" strokeWidth={1.8} />}
          </span>
          <span className="truncate">{it.label}</span>
          {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B968F] shrink-0" />}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      className="hidden md:flex border-r"
      style={{ '--sidebar-width': '240px', borderColor: '#2e2e2e', background: '#1a1a1a' } as React.CSSProperties}
    >
      <SidebarHeader className="px-4 py-4 border-b" style={{ borderColor: '#2e2e2e', background: '#1a1a1a' }}>
        <button onClick={() => onSectionChange('home')} className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
              alt="Terex"
              className="w-7 h-7 rounded-md"
            />
            <span className="text-[15px] font-semibold text-white tracking-tight">Terex</span>
          </div>
          <span className="text-[9px] border rounded-full px-2 py-0.5" style={{ color: '#444', borderColor: '#2e2e2e' }}>v2.4</span>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-0" style={{ background: '#1a1a1a' }}>
        <SidebarGroup className="p-0 pb-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {primary.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator style={{ background: '#2e2e2e' }} />

        <SidebarGroup className="p-0 pt-4 pb-4">
          <SidebarGroupLabel className="px-2.5 mb-1 text-[10px] uppercase tracking-[0.15em] font-medium h-auto pb-1" style={{ color: '#444' }}>
            Compte
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {account.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isKYCReviewer() || isAdmin()) && (
          <>
            <SidebarSeparator style={{ background: '#2e2e2e' }} />
            <SidebarGroup className="p-0 pt-4">
              <button
                onClick={() => setAdminOpen(o => !o)}
                className="w-full flex items-center justify-between px-2.5 mb-1"
              >
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: '#444' }}>Admin</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform', !adminOpen && '-rotate-90')} style={{ color: '#444' }} />
              </button>
              {adminOpen && (
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {adminItems.map(renderItem)}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 border-t space-y-1" style={{ borderColor: '#2e2e2e', background: '#1a1a1a' }}>
        <button
          onClick={() => onSectionChange('profile')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#888] hover:bg-[#1f1f1f] hover:text-[#ccc] transition-all"
        >
          <Settings className="w-4 h-4 shrink-0 text-[#555]" strokeWidth={1.8} />
          <span>Paramètres</span>
        </button>

        <SidebarSeparator style={{ background: '#2e2e2e' }} />

        <button
          onClick={() => onSectionChange('profile')}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border hover:border-[#3a3a3a] transition-colors"
          style={{ borderColor: '#2e2e2e' }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(59,150,143,0.15)' }}>
            <span className="text-[11px] font-medium" style={{ color: '#3B968F' }}>AD</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[12px] font-medium text-white truncate">Mon compte</p>
            <p className="text-[10px]" style={{ color: '#555' }}>Vérifié · Niveau 2</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#666] hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.8} />
          <span>Déconnexion</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
