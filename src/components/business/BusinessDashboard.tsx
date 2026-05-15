import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Send, Clock, Users2,
  Building2, LifeBuoy, LogOut, Bell,
  Plus, ChevronRight, Menu, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessOverview } from './BusinessOverview';
import { BusinessPayments } from './BusinessPayments';
import { BusinessSuppliers } from './BusinessSuppliers';
import { BusinessHistory } from './BusinessHistory';
import { BusinessProfile } from './BusinessProfile';

interface BusinessDashboardProps {
  user: { email: string; name: string } | null;
}

const NAV = [
  { id: 'overview',   label: 'Tableau de bord',   icon: LayoutDashboard },
  { id: 'payment',    label: 'Nouveau paiement',   icon: Send },
  { id: 'history',    label: 'Historique',         icon: Clock },
  { id: 'suppliers',  label: 'Fournisseurs',       icon: Users2 },
  { id: 'profile',    label: 'Profil entreprise',  icon: Building2 },
  { id: 'support',    label: 'Support',            icon: LifeBuoy },
];

function SupportPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#3B968F]/10 flex items-center justify-center mb-4">
        <LifeBuoy className="w-6 h-6 text-[#3B968F]" />
      </div>
      <h2 className="text-white text-lg font-semibold mb-2">Support dédié B2B</h2>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
        Notre équipe dédiée aux entreprises est disponible pour vous accompagner dans vos paiements internationaux.
      </p>
      <a
        href="mailto:business@terex.io"
        className="mt-6 inline-flex items-center gap-2 bg-[#3B968F] hover:bg-[#3B968F]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        Contacter l'équipe B2B
      </a>
    </div>
  );
}

export function BusinessDashboard({ user }: BusinessDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':  return <BusinessOverview user={user} onNavigate={setActiveSection} />;
      case 'payment':   return <BusinessPayments user={user} onBack={() => setActiveSection('overview')} />;
      case 'history':   return <BusinessHistory user={user} />;
      case 'suppliers': return <BusinessSuppliers user={user} />;
      case 'profile':   return <BusinessProfile user={user} />;
      case 'support':   return <SupportPlaceholder />;
      default:          return <BusinessOverview user={user} onNavigate={setActiveSection} />;
    }
  };

  const currentPage = NAV.find(n => n.id === activeSection);

  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      <div className="px-5 pt-6 pb-5 border-b border-[#1c1c1c]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B968F] to-[#2d7870] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3B968F]/20">
            <span className="text-white font-black text-[11px] tracking-tighter">TB</span>
          </div>
          <div>
            <p className="text-white font-bold text-[13px] leading-tight tracking-wide">TEREX BUSINESS</p>
            <p className="text-[#3B968F]/60 text-[9px] tracking-[0.15em] uppercase mt-0.5">Portail B2B Pro</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#3B968F]/10 text-[#3B968F] border border-[#3B968F]/20'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Icon className="w-[15px] h-[15px] flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-2 border-t border-[#1c1c1c] pt-3 space-y-0.5">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 hover:bg-white/[0.03] transition-all border border-transparent"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          Espace personnel
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent"
        >
          <LogOut className="w-3.5 h-3.5" />
          Déconnexion
        </button>
      </div>

      <div className="mx-3 mb-4 mt-2 px-3 py-2.5 rounded-lg bg-[#161616] border border-[#1e1e1e] flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#3B968F]/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[#3B968F] text-[11px] font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-xs font-medium truncate leading-tight">{user?.name || 'Utilisateur'}</p>
          <p className="text-gray-600 text-[10px] truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#141414] overflow-hidden">
      <aside className="hidden md:flex flex-col w-56 lg:w-60 bg-[#0b0b0b] border-r border-[#1c1c1c] flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-64 bg-[#0b0b0b] border-r border-[#1c1c1c] flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-13 bg-[#0f0f0f]/90 backdrop-blur-sm border-b border-[#1c1c1c] flex items-center justify-between px-4 md:px-6 flex-shrink-0 py-3">
          <div className="flex items-center gap-3">
            <button className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white text-sm font-semibold leading-tight">{currentPage?.label || 'Tableau de bord'}</h1>
              <p className="text-gray-600 text-[10px] hidden md:block tracking-widest uppercase mt-0.5">Terex Business Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setActiveSection('payment')} className="bg-[#3B968F] hover:bg-[#3B968F]/85 text-white h-8 text-xs gap-1.5 hidden sm:flex px-3 rounded-lg shadow-sm shadow-[#3B968F]/20">
              <Plus className="w-3 h-3" />
              Nouveau paiement
            </Button>
            <button className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3B968F] shadow-sm shadow-[#3B968F]/50" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
