
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
  { id: 'faq', label: 'FAQ', icon: '❓' },
];

export function AppSidebar({ activeSection, setActiveSection, onLogout }: AppSidebarProps) {
  return (
    <Sidebar className="bg-terex-darker border-r border-terex-gray">
      <SidebarHeader className="p-6">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-terex-accent">Terex</span>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection(item.id)}
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
    </Sidebar>
  );
}
