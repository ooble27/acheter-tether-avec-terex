
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, Home, HelpCircle, User, Globe, TrendingDown, Shield, ShoppingCart, LogOut, History, ExternalLink, UserCheck, Phone, Star, Gift, Share2, FileText, Briefcase, ChevronRight, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { useUserRole } from '@/hooks/useUserRole';
import { useState } from 'react';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const TetherLogo = ({
  className,
  isActive,
  color
}: {
  className?: string;
  isActive?: boolean;
  color?: string;
}) => <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="Tether Logo" className={`${className} ${isActive ? 'brightness-0 invert' : ''} usdt-icon-force-visible`} style={color === 'red' && !isActive ? {
  filter: 'hue-rotate(0deg) saturate(0) brightness(0) invert(27%) sepia(98%) saturate(7465%) hue-rotate(0deg) brightness(98%) contrast(118%)'
} : {}} />;

const menuItems = [{
  id: 'home',
  label: 'Accueil',
  icon: Home,
  description: 'Tableau de bord'
}, {
  id: 'buy',
  label: 'Acheter USDT',
  icon: TetherLogo,
  isCustomIcon: true,
  description: 'Acquérir des USDT'
}, {
  id: 'sell',
  label: 'Vendre USDT',
  icon: TrendingDown,
  description: 'Échanger vos USDT'
}, {
  id: 'transfer',
  label: 'Virement International',
  icon: Globe,
  description: 'Transferts mondiaux'
}, {
  id: 'history',
  label: 'Historique',
  icon: History,
  description: 'Mes transactions'
}, {
  id: 'profile',
  label: 'Mon Profil',
  icon: User,
  description: 'Gérer votre compte'
}, {
  id: 'faq',
  label: 'FAQ',
  icon: HelpCircle,
  description: 'Centre d\'aide'
}];

const AppSidebarContent = ({
  activeSection,
  setActiveSection,
  onLogout,
  onItemClick
}: AppSidebarProps & {
  onItemClick?: () => void;
}) => {
  const {
    isKYCReviewer
  } = useUserRole();
  const isTablet = useIsTablet();

  // Vérifier si on est en mode PWA (standalone)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  const handleExternalNavigation = (url: string) => {
    window.location.href = url;
  };

  return <div className="flex flex-col h-full min-h-0">
      <style>
        {`
          .usdt-icon-force-visible {
            filter: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: inline-block !important;
            background: none !important;
            -webkit-filter: none !important;
            backdrop-filter: none !important;
          }
        `}
      </style>
      
      <SidebarHeader className="p-6 border-b border-terex-gray/30 pt-safe bg-[terex-gray-light] bg-terex-darker">
        {/* Logo Header Style Binance dans la Sidebar */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center gap-3 p-3 bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 rounded-xl border border-terex-accent/20">
            <div className="relative">
              <img src="/terex-logo.png" alt="Terex Logo" className="w-10 h-10 rounded-lg shadow-lg" />
              <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-lg blur opacity-40"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight text-white">
                <span className="bg-gradient-to-r from-terex-accent to-terex-accent/80 bg-clip-text text-transparent">
                  TEREX
                </span>
              </h1>
              <p className="text-[10px] font-medium text-terex-accent/70 uppercase tracking-wider">Teranga Exchange</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 px-4 py-6 overflow-y-auto bg-terex-darker">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map(item => {
              const IconComponent = item.icon;
              return <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton onClick={() => {
                  setActiveSection(item.id);
                  onItemClick?.();
                }} className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${activeSection === item.id ? item.id === 'ai-assistant' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'bg-gradient-to-r from-terex-accent to-terex-accent/80 text-white shadow-lg shadow-terex-accent/25' : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'}`}>
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${activeSection === item.id ? 'bg-white/20' : item.id === 'ai-assistant' ? 'bg-terex-gray/30 group-hover:bg-purple-500/20' : 'bg-terex-gray/30 group-hover:bg-terex-accent/20'}`}>
                          {item.isCustomIcon ? <IconComponent className="h-6 w-6" isActive={activeSection === item.id} /> : <IconComponent className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">{item.label}</div>
                          <div className="text-xs opacity-75 truncate">{item.description}</div>
                        </div>
                        {activeSection === item.id && <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}

              {/* Section Navigation externe - uniquement si pas en mode PWA */}
              {!isPWA && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center space-x-2 px-4">
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Navigation</span>
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                    </div>
                  </div>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => {
                    handleExternalNavigation('/');
                    onItemClick?.();
                  }} className="group relative w-full p-4 h-auto rounded-xl transition-all duration-200 text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md">
                      <div className="flex items-center space-x-4 w-full">
                        <div className="flex-shrink-0 p-2 rounded-lg transition-colors bg-terex-gray/30 group-hover:bg-terex-accent/20">
                          <Globe className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">Landing Page</div>
                          <div className="text-xs opacity-75 truncate">Accueil & Informations</div>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {/* Section Administration */}
              {isKYCReviewer() && <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center space-x-2 px-4">
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Administration</span>
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                    </div>
                  </div>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => {
                  setActiveSection('kyc-admin');
                  onItemClick?.();
                }} className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${activeSection === 'kyc-admin' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'}`}>
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${activeSection === 'kyc-admin' ? 'bg-white/20' : 'bg-terex-gray/30 group-hover:bg-orange-500/20'}`}>
                          <Shield className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">Administration KYC</div>
                          <div className="text-xs opacity-75 truncate">Vérifications d'identité</div>
                        </div>
                        {activeSection === 'kyc-admin' && <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => {
                  setActiveSection('orders-admin');
                  onItemClick?.();
                }} className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${activeSection === 'orders-admin' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'}`}>
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${activeSection === 'orders-admin' ? 'bg-white/20' : 'bg-terex-gray/30 group-hover:bg-purple-500/20'}`}>
                          <ShoppingCart className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">Gestion Commandes</div>
                          <div className="text-xs opacity-75 truncate">Ordres et transactions</div>
                        </div>
                        {activeSection === 'orders-admin' && <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => {
                  setActiveSection('job-applications');
                  onItemClick?.();
                }} className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${activeSection === 'job-applications' ? 'bg-gradient-to-r from-white/10 to-white/10 text-white shadow-lg shadow-emerald-500/25' : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'}`}>
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${activeSection === 'job-applications' ? 'bg-white/20' : 'bg-terex-gray/30 group-hover:bg-white/20'}`}>
                          <UserCheck className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">Candidatures</div>
                          <div className="text-xs opacity-75 truncate">Gestion des candidatures</div>
                        </div>
                        {activeSection === 'job-applications' && <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => {
                  setActiveSection('b2b');
                  onItemClick?.();
                }} className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${activeSection === 'b2b' ? 'bg-gradient-to-r from-[#ffffff] to-[#2d7870] text-white shadow-lg shadow-[#ffffff]/25' : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'}`}>
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${activeSection === 'b2b' ? 'bg-white/20' : 'bg-terex-gray/30 group-hover:bg-[#ffffff]/20'}`}>
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">Portail Business</div>
                          <div className="text-xs opacity-75 truncate">Gestion comptes B2B</div>
                        </div>
                        {activeSection === 'b2b' && <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Bouton de déconnexion - masqué sur tablette */}
      {!isTablet && <div className="p-4 border-t border-terex-gray/30 mt-auto flex-shrink-0 pb-safe bg-terex-darker">
          <Button onClick={onLogout} className="w-full h-14 bg-red-600/20 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white transition-all duration-200 rounded-xl font-medium text-sm">
            <LogOut className="mr-2 h-5 w-5" />
            Déconnexion
          </Button>
        </div>}
    </div>;
};

export function AppSidebar({
  activeSection,
  setActiveSection,
  onLogout
}: AppSidebarProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null; // Le menu mobile sera géré par MobileMenu
  }
  return <Sidebar className="bg-terex-darker border-r border-terex-gray/30 shadow-2xl fixed left-0 top-0 h-screen z-50">
      <AppSidebarContent activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} />
    </Sidebar>;
}

export function MobileMenu({
  activeSection,
  setActiveSection,
  onLogout,
  isOpen: externalIsOpen,
  onClose: externalOnClose
}: AppSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { isKYCReviewer, isAdmin } = useUserRole();
  const isMobile = useIsMobile();
  
  // Utiliser l'état externe si fourni, sinon utiliser l'état interne
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose ? (open: boolean) => {
    if (!open) externalOnClose();
  } : setInternalIsOpen;
  
  const handleItemClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const profileItems = [
    { id: 'profile', label: 'Mon Profil', icon: User, description: 'Informations personnelles' },
    { id: 'history', label: 'Historique', icon: History, description: 'Mes transactions' },
  ];

  const supportItems = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Questions fréquentes' },
    { id: 'contact', label: 'Nous Contacter', icon: Phone, description: 'Support client 24/7' },
  ];

  const moreItems = [
    { id: 'referral', label: 'Parrainage', icon: Gift, description: 'Invitez vos amis' },
    { id: 'share-app', label: 'Partager l\'App', icon: Share2, description: 'Partager Terex' },
    { id: 'terms', label: 'Conditions d\'Utilisation', icon: FileText, description: 'CGU et politique' },
  ];

  const adminItems = [
    { id: 'kyc-admin', label: 'Administration KYC', icon: Shield, description: 'Vérifications d\'identité' },
    { id: 'orders-admin', label: 'Gestion Commandes', icon: Shield, description: 'Ordres et transactions' },
    { id: 'job-applications', label: 'Candidatures', icon: UserCheck, description: 'Gestion des candidatures' },
    { id: 'b2b', label: 'Portail Business', icon: Briefcase, description: 'Gestion comptes B2B' },
  ];

  const renderMenuSection = (title: string, items: any[]) => (
    <div className="mb-1">
      <div className="px-3 pt-5 pb-2">
        <span className="text-[11px] font-semibold text-white/35 uppercase tracking-[0.12em]">{title}</span>
      </div>

      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
              isActive
                ? 'bg-white/[0.08] border border-white/10'
                : 'border border-transparent hover:bg-white/[0.04]'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${isActive ? 'bg-white/[0.12]' : 'bg-white/[0.05]'}`}>
              <IconComponent className="h-[18px] w-[18px] text-white/85" strokeWidth={1.9} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-[14px] text-white">{item.label}</div>
              <div className="text-[11.5px] text-white/40 truncate">{item.description}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/25 flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );

  // Mobile : panneau latéral premium (glassmorphism)
  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100]">
        {/* Backdrop flouté */}
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-in fade-in duration-300"
        />

        {/* Panneau */}
        <div
          className="absolute top-0 right-0 h-full w-[86%] max-w-[380px] flex flex-col animate-in slide-in-from-right duration-300 ease-out"
          style={{
            background: 'rgba(22,22,22,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '-30px 0 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 18px)', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <img src="/terex-logo.png" alt="Terex" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-white font-bold text-[16px] tracking-tight">Terex</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.1] transition-colors active:scale-95"
            >
              <X className="h-[18px] w-[18px] text-white/80" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
            {renderMenuSection('Profil', profileItems)}
            {renderMenuSection('Support', supportItems)}
            {renderMenuSection('Plus', moreItems)}
            {isKYCReviewer() && renderMenuSection('Administration', adminItems)}

            <div className="px-3 pt-5 pb-2">
              <span className="text-[11px] font-semibold text-white/35 uppercase tracking-[0.12em]">Compte</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-transparent hover:bg-red-500/[0.08] transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/[0.1]">
                <LogOut className="h-[18px] w-[18px] text-red-400" strokeWidth={1.9} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-[14px] text-red-400">Déconnexion</div>
                <div className="text-[11.5px] text-white/40">Quitter votre session</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Popover dropdown
  return null;
}