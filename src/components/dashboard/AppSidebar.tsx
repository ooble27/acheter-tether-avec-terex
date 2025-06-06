
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, HelpCircle, User, Globe, TrendingDown, Shield, ShoppingCart, LogOut, Handshake } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserRole } from '@/hooks/useUserRole';
import { useState } from 'react';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const TetherLogo = ({ className, isActive, color }: { className?: string, isActive?: boolean, color?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="Tether Logo"
    className={`${className} ${isActive ? 'brightness-0 invert' : ''}`}
    style={color === 'red' && !isActive ? { 
      filter: 'hue-rotate(0deg) saturate(0) brightness(0) invert(27%) sepia(98%) saturate(7465%) hue-rotate(0deg) brightness(98%) contrast(118%)'
    } : {}}
  />
);

const menuItems = [
  { 
    id: 'home', 
    label: 'Accueil', 
    icon: Home,
    description: 'Tableau de bord'
  },
  { 
    id: 'buy', 
    label: 'Acheter USDT', 
    icon: TetherLogo,
    isCustomIcon: true,
    description: 'Acquérir des USDT'
  },
  { 
    id: 'sell', 
    label: 'Vendre USDT', 
    icon: TrendingDown,
    description: 'Échanger vos USDT'
  },
  { 
    id: 'otc', 
    label: 'Trading OTC', 
    icon: Handshake,
    description: 'Gros volumes & négociation'
  },
  { 
    id: 'transfer', 
    label: 'Virement International', 
    icon: Globe,
    description: 'Transferts mondiaux'
  },
  { 
    id: 'profile', 
    label: 'Mon Profil', 
    icon: User,
    description: 'Gérer votre compte'
  },
  { 
    id: 'faq', 
    label: 'FAQ', 
    icon: HelpCircle,
    description: 'Centre d\'aide'
  },
];

const AppSidebarContent = ({ activeSection, setActiveSection, onLogout, onItemClick }: AppSidebarProps & { onItemClick?: () => void }) => {
  const { isKYCReviewer } = useUserRole();

  return (
    <div className="flex flex-col min-h-screen h-full">
      <SidebarHeader className="p-6 border-b border-terex-gray/30">
        {/* Logo Header Style Binance dans la Sidebar */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center gap-3 p-3 bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 rounded-xl border border-terex-accent/20">
            <div className="relative">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-10 h-10 rounded-lg shadow-lg"
              />
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
      
      <SidebarContent className="flex-1 px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection(item.id);
                        onItemClick?.();
                      }}
                      className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-terex-accent to-terex-accent/80 text-white shadow-lg shadow-terex-accent/25'
                          : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          activeSection === item.id 
                            ? 'bg-white/20' 
                            : 'bg-terex-gray/30 group-hover:bg-terex-accent/20'
                        }`}>
                          {item.isCustomIcon ? (
                            <IconComponent 
                              className="h-6 w-6"
                              isActive={activeSection === item.id}
                            />
                          ) : (
                            <IconComponent 
                              className="h-6 w-6" 
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">{item.label}</div>
                          <div className="text-xs opacity-75 truncate">{item.description}</div>
                        </div>
                        {activeSection === item.id && (
                          <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              {/* Section Administration */}
              {isKYCReviewer() && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center space-x-2 px-4">
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Administration</span>
                      <div className="h-px bg-terex-gray/40 flex-1"></div>
                    </div>
                  </div>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection('kyc-admin');
                        onItemClick?.();
                      }}
                      className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${
                        activeSection === 'kyc-admin'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                          : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          activeSection === 'kyc-admin' 
                            ? 'bg-white/20' 
                            : 'bg-terex-gray/30 group-hover:bg-orange-500/20'
                        }`}>
                          <Shield className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">Administration KYC</div>
                          <div className="text-xs opacity-75 truncate">Vérifications d'identité</div>
                        </div>
                        {activeSection === 'kyc-admin' && (
                          <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection('orders-admin');
                        onItemClick?.();
                      }}
                      className={`group relative w-full p-4 h-auto rounded-xl transition-all duration-200 ${
                        activeSection === 'orders-admin'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'text-gray-300 hover:bg-terex-gray/50 hover:text-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          activeSection === 'orders-admin' 
                            ? 'bg-white/20' 
                            : 'bg-terex-gray/30 group-hover:bg-purple-500/20'
                        }`}>
                          <ShoppingCart className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">Gestion Commandes</div>
                          <div className="text-xs opacity-75 truncate">Ordres et transactions</div>
                        </div>
                        {activeSection === 'orders-admin' && (
                          <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Bouton de déconnexion repositionné plus haut */}
        <div className="mt-6 px-2">
          <Button 
            onClick={onLogout}
            className="w-full h-12 md:h-12 bg-red-600/20 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white transition-all duration-200 rounded-xl font-medium"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </SidebarContent>
    </div>
  );
};

export function AppSidebar({ activeSection, setActiveSection, onLogout }: AppSidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null; // Le menu mobile sera géré par MobileMenu
  }

  return (
    <Sidebar className="bg-terex-darker border-r border-terex-gray/30 shadow-2xl h-screen">
      <AppSidebarContent 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onLogout={onLogout} 
      />
    </Sidebar>
  );
}

export function MobileMenu({ activeSection, setActiveSection, onLogout }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-terex-darker/95 backdrop-blur-sm border border-terex-gray/50 text-white hover:bg-terex-gray/80 shadow-lg rounded-xl w-12 h-12"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-terex-darker border-r border-terex-gray/30 p-0 shadow-2xl h-screen">
        <AppSidebarContent 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          onLogout={onLogout}
          onItemClick={handleItemClick}
        />
      </SheetContent>
    </Sheet>
  );
}
