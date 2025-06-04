
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
import { Menu, Home, HelpCircle, User, Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const TetherIcon = ({ className, color }: { className?: string, color?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill={color || "#26A17B"} />
    <path
      d="M12.8 7.5H16V5.2H8V7.5H11.2V8.1C8.9 8.2 7.2 8.7 7.2 9.3S8.9 10.4 11.2 10.5V16.8H12.8V10.5C15.1 10.4 16.8 9.9 16.8 9.3S15.1 8.2 12.8 8.1V7.5Z"
      fill="white"
    />
  </svg>
);

const menuItems = [
  { id: 'home', label: 'Accueil', icon: Home },
  { 
    id: 'buy', 
    label: 'Acheter USDT', 
    icon: TetherIcon,
    iconColor: '#26A17B',
    isCustomIcon: true
  },
  { 
    id: 'sell', 
    label: 'Vendre USDT', 
    icon: TetherIcon,
    iconColor: '#ef4444',
    isCustomIcon: true
  },
  { id: 'transfer', label: 'Virement International', icon: Globe },
  { id: 'profile', label: 'Mon Profil', icon: User },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

const AppSidebarContent = ({ activeSection, setActiveSection, onLogout, onItemClick }: AppSidebarProps & { onItemClick?: () => void }) => (
  <>
    <SidebarHeader className="p-6">
      <div className="flex items-center space-x-1">
        <img 
          src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
          alt="Terex Logo" 
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
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
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
                    {item.isCustomIcon ? (
                      <IconComponent 
                        className="mr-3 h-5 w-5"
                        color={activeSection === item.id ? 'white' : item.iconColor}
                      />
                    ) : (
                      <IconComponent 
                        className={`mr-3 h-5 w-5 ${
                          activeSection === item.id ? 'text-white' : ''
                        }`} 
                      />
                    )}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
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
