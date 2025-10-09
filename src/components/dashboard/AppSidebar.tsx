
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, Home, HelpCircle, User, Globe, TrendingDown, Shield, ShoppingCart, LogOut, History, ExternalLink, UserCheck, Phone, Star, Gift, Share2, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { useUserRole } from '@/hooks/useUserRole';
import { useState } from 'react';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
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
              <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex Logo" className="w-10 h-10 rounded-lg shadow-lg" />
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
                }} className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${activeSection === 'job-applications' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'}`}>
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${activeSection === 'job-applications' ? 'bg-white/20' : 'bg-terex-gray/30 group-hover:bg-emerald-500/20'}`}>
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
  onLogout
}: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isKYCReviewer, isAdmin } = useUserRole();
  
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
    { id: 'feedback', label: 'Avis & Suggestions', icon: Star, description: 'Donnez votre avis' },
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
  ];

  const renderMenuSection = (title: string, items: any[]) => (
    <>
      <div className="pt-4 pb-2">
        <div className="flex items-center space-x-2 px-4">
          <div className="h-px bg-terex-gray/40 flex-1"></div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
          <div className="h-px bg-terex-gray/40 flex-1"></div>
        </div>
      </div>
      
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => handleItemClick(item.id)}
            className={`w-full justify-start p-4 h-auto rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-r from-terex-accent to-terex-accent/80 text-white shadow-lg shadow-terex-accent/25' 
                : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-terex-gray/30'}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </div>
          </Button>
        );
      })}
    </>
  );

  return (
    <>
      {/* Hamburger Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-terex-darker backdrop-blur-sm border border-terex-gray/50 text-white hover:bg-terex-gray/80 shadow-lg rounded-xl w-12 h-12 mt-safe"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Full Screen Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-terex-dark animate-in fade-in duration-200">
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header with Back Button */}
            <div className="flex items-center justify-start p-4 bg-terex-dark border-b border-terex-gray/30">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full hover:bg-terex-gray/30 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-terex-dark">
              <div className="p-4 space-y-2">
                {/* Section Profil */}
                {renderMenuSection('Profil', profileItems)}

                {/* Section Support */}
                {renderMenuSection('Support', supportItems)}

                {/* Section Plus */}
                {renderMenuSection('Plus', moreItems)}

                {/* Section Administration */}
                {isKYCReviewer() && renderMenuSection('Administration', adminItems)}

                {/* Bouton de déconnexion */}
                <div className="pt-4 pb-2">
                  <div className="flex items-center space-x-2 px-4">
                    <div className="h-px bg-terex-gray/40 flex-1"></div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Compte</span>
                    <div className="h-px bg-terex-gray/40 flex-1"></div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start p-4 h-auto rounded-xl transition-all duration-200 text-red-400 hover:bg-red-600/20 hover:text-red-300"
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-2 rounded-lg bg-red-600/20">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">Déconnexion</div>
                      <div className="text-xs opacity-75">Quitter votre session</div>
                    </div>
                  </div>
                </Button>
                
                <div className="pb-4"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
