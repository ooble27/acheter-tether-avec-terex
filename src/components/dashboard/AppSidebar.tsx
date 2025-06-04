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
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'home', label: 'Accueil', icon: '🏠' },
  { id: 'buy', label: 'Acheter USDT', icon: '💰' },
  { id: 'sell', label: 'Vendre USDT', icon: '💸' },
  { id: 'transfer', label: 'Virement International', icon: '🌍' },
  { id: 'profile', label: 'Mon Profil', icon: '👤' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
];

const AppSidebarContent = ({ activeSection, setActiveSection, onLogout, onItemClick }: AppSidebarProps & { onItemClick?: () => void }) => (
  <>
    <SidebarHeader className="p-6">
      <div className="flex items-center space-x-3">
        <img 
          src="https://cryptologos.cc/logos/tether-usdt-logo.svg"
          alt="Tether USDT Logo" 
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold text-white">
          <span className="text-terex-accent">Terex</span>
        </h1>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                  onClick={() => {
                    setActiveSection(item.id);
                    onItemClick?.();
                  }}
                  className={`w-full justify-start text-left p-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-terex-accent text-white'
                      : 'text-gray-300 hover:bg-terex-gray hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <div className="p-4 border-t border-terex-gray">
      <Button 
        onClick={onLogout}
        variant="outline" 
        className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
      >
        Déconnexion
      </Button>
    </div>
  </>
);

export function AppSidebar({ activeSection, setActiveSection, onLogout }: AppSidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null; // Le menu mobile sera géré par MobileMenu
  }

  return (
    <Sidebar className="bg-terex-darker border-r border-terex-gray">
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
          className="md:hidden fixed top-4 left-4 z-50 bg-terex-darker border border-terex-gray text-white hover:bg-terex-gray"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-terex-darker border-r border-terex-gray p-0">
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
