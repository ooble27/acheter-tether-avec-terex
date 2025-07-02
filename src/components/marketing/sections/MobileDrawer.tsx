
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu, User, LogOut, ShoppingCart } from 'lucide-react';

interface MobileDrawerProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onMarketplace: () => void;
  onLogout: () => void;
}

export function MobileDrawer({ user, onShowDashboard, onMarketplace, onLogout }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);

  const handleNavigation = (action: () => void) => {
    action();
    setOpen(false);
  };

  if (!user) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white hover:text-terex-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-terex-darker border-terex-accent/20">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-white">
            <span className="text-terex-accent">Terex</span> Navigation
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          <Button
            onClick={() => handleNavigation(onMarketplace)}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-terex-gray/50"
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Boutique
          </Button>
          <Button
            onClick={() => handleNavigation(onShowDashboard!)}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-terex-gray/50"
          >
            <User className="w-5 h-5 mr-3" />
            Dashboard
          </Button>
          <div className="border-t border-terex-gray/30 pt-3 mt-3">
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-300 text-sm">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
            </div>
            <Button
              onClick={() => handleNavigation(onLogout)}
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-600/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
