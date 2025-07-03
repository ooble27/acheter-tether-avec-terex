
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, LogOut, Menu, ShoppingCart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onMarketplace: () => void;
  onLogout: () => void;
}

export function HeaderSection({ user, onShowDashboard, onMarketplace, onLogout }: HeaderSectionProps) {
  const isMobile = useIsMobile();

  if (!user) return null;

  return (
    <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-50 pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <h1 className="text-xl font-bold text-white">
              <span className="text-terex-accent">Terex</span>
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Button
                onClick={onMarketplace}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Boutique
              </Button>
              <Button
                onClick={onShowDashboard}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="text-sm">{user.name}</span>
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-terex-accent/20"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-80 bg-terex-darker border-l border-terex-accent/20 p-0"
              >
                <div className="flex flex-col h-full pt-safe">
                  {/* Header du menu mobile */}
                  <div className="p-6 border-b border-terex-accent/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-terex-accent rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="flex-1 p-6 space-y-4">
                    <Button
                      onClick={onShowDashboard}
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-terex-accent/20 h-14 text-lg"
                    >
                      <User className="w-6 h-6 mr-3" />
                      Dashboard
                    </Button>
                    
                    <Button
                      onClick={onMarketplace}
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-terex-accent/20 h-14 text-lg"
                    >
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Boutique
                    </Button>
                  </div>

                  {/* Footer avec déconnexion */}
                  <div className="p-6 border-t border-terex-accent/20 pb-safe">
                    <Button
                      onClick={onLogout}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:bg-red-600/20 h-14 text-lg"
                    >
                      <LogOut className="w-6 h-6 mr-3" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
