
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, LogOut, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

export function HeaderSection({ user, onShowDashboard, onLogout }: HeaderSectionProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Force reload on error to ensure clean state
      window.location.reload();
    }
  };

  const navigationItems = [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/about' },
    { label: 'Carrières', href: '/careers' },
    { label: 'Support', href: '/support' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' }
  ];

  return (
    <header className={`${isMobile ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' : 'bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-50'} pt-safe`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo seul */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-10 h-10 rounded-lg cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          
          {/* Desktop Navigation - Navigation étalée */}
          {!isMobile && (
            <div className="flex items-center space-x-8">
              {/* Navigation Links */}
              <nav className="flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="text-gray-300 hover:text-terex-accent transition-colors duration-200 text-sm font-light"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* User Actions */}
              <div className="flex items-center space-x-4 ml-8 border-l border-terex-gray/30 pl-8">
                {user ? (
                  <>
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
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
                  >
                    Se Connecter
                  </Button>
                )}
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
                  {user && (
                    <div className="p-6 border-b border-terex-accent/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-terex-accent rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-light">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="flex-1 p-6 space-y-4">
                    {user && (
                      <Button
                        onClick={onShowDashboard}
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-terex-accent/20 h-14 text-lg"
                      >
                        <User className="w-6 h-6 mr-3" />
                        Dashboard
                      </Button>
                    )}

                    {/* Navigation Items */}
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-light px-3">Navigation</p>
                      {navigationItems.map((item) => (
                        <Button
                          key={item.href}
                          onClick={() => navigate(item.href)}
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-terex-accent/20 h-12"
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>

                    {!user && (
                      <Button
                        onClick={() => navigate('/auth')}
                        className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-light h-14 text-lg"
                      >
                        Se Connecter
                      </Button>
                    )}
                  </div>

                  {/* Footer avec déconnexion */}
                  {user && (
                    <div className="p-6 border-t border-terex-accent/20 pb-safe">
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:bg-red-600/20 h-14 text-lg"
                      >
                        <LogOut className="w-6 h-6 mr-3" />
                        Déconnexion
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
