
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  Send,
  User,
  HelpCircle,
  LogOut,
  Menu,
  Shield,
  Settings,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserRole } from "@/hooks/useUserRole";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'buy', label: 'Acheter USDT', icon: TrendingUp },
  { id: 'sell', label: 'Vendre USDT', icon: TrendingDown },
  { id: 'transfer', label: 'Virement International', icon: Send },
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'faq', label: 'FAQ & Support', icon: HelpCircle },
];

const adminMenuItems = [
  { id: 'kyc-admin', label: 'KYC Admin', icon: Shield },
  { id: 'orders-admin', label: 'Gestion Commandes', icon: BarChart3 },
  { id: 'admin-portal', label: 'Portail Admin', icon: Settings },
];

export function AppSidebar({ activeSection, setActiveSection, onLogout }: AppSidebarProps) {
  const isMobile = useIsMobile();
  const { isKYCReviewer, isAdmin } = useUserRole();
  
  const showAdminSection = isKYCReviewer() || isAdmin();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-terex-darker border-r border-terex-gray">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Terex</h1>
            <p className="text-sm text-gray-400">Teranga Exchange</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full justify-start text-left h-12 px-4",
                activeSection === item.id
                  ? "bg-terex-accent text-white"
                  : "text-gray-300 hover:bg-terex-gray hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
          
          {showAdminSection && (
            <>
              <Separator className="my-4 bg-terex-gray" />
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administration
                </p>
              </div>
              {adminMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full justify-start text-left h-12 px-4",
                    activeSection === item.id
                      ? "bg-terex-accent text-white"
                      : "text-gray-300 hover:bg-terex-gray hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                  <Badge variant="secondary" className="ml-auto bg-red-500/20 text-red-400">
                    Admin
                  </Badge>
                </Button>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-terex-gray">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-300 h-12"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return null; // Mobile menu is handled separately
  }

  return (
    <div className="w-64 h-screen">
      <SidebarContent />
    </div>
  );
}

export function MobileMenu({ activeSection, setActiveSection, onLogout }: AppSidebarProps) {
  const { isKYCReviewer, isAdmin } = useUserRole();
  const showAdminSection = isKYCReviewer() || isAdmin();

  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="bg-terex-darker border-terex-gray text-white hover:bg-terex-gray"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-terex-darker border-terex-gray">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Terex</h1>
                  <p className="text-sm text-gray-400">Teranga Exchange</p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full justify-start text-left h-12 px-4",
                      activeSection === item.id
                        ? "bg-terex-accent text-white"
                        : "text-gray-300 hover:bg-terex-gray hover:text-white"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
                
                {showAdminSection && (
                  <>
                    <Separator className="my-4 bg-terex-gray" />
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Administration
                      </p>
                    </div>
                    {adminMenuItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          "w-full justify-start text-left h-12 px-4",
                          activeSection === item.id
                            ? "bg-terex-accent text-white"
                            : "text-gray-300 hover:bg-terex-gray hover:text-white"
                        )}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                        <Badge variant="secondary" className="ml-auto bg-red-500/20 text-red-400">
                          Admin
                        </Badge>
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-terex-gray">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-300 h-12"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
