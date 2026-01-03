
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface SpiceHeaderProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

export function SpiceHeader({ user, onShowDashboard, onLogout }: SpiceHeaderProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'À propos', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
              </div>
            </div>
            <span className="text-white font-medium text-lg sm:text-xl tracking-tight">
              Terex<sup className="text-[8px] sm:text-[10px] ml-0.5">®</sup>
            </span>
          </div>
          
          {/* Desktop Navigation - Centered */}
          {!isMobile && (
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={onShowDashboard}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Dashboard
                  </button>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 border-0 rounded-full px-6 text-sm font-medium"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Connexion
                  </button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-white text-black hover:bg-gray-100 border-0 rounded-full px-6 text-sm font-medium"
                  >
                    Commencer
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-black border-none p-0">
                <div className="flex flex-col h-full pt-safe">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
                        </div>
                      </div>
                      <span className="text-white font-medium text-lg">Terex</span>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-6 space-y-2">
                    {navigationItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="block w-full text-left text-2xl text-white hover:text-gray-300 py-3 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="p-6 border-t border-white/10 space-y-3 pb-safe">
                    {user ? (
                      <>
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            onShowDashboard?.();
                          }}
                          className="w-full bg-white text-black hover:bg-gray-100 rounded-full py-6 text-base font-medium"
                        >
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            onLogout();
                          }}
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 rounded-full py-6 text-base"
                        >
                          Déconnexion
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/auth');
                          }}
                          className="w-full bg-white text-black hover:bg-gray-100 rounded-full py-6 text-base font-medium"
                        >
                          Commencer
                        </Button>
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/auth');
                          }}
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 rounded-full py-6 text-base"
                        >
                          Connexion
                        </Button>
                      </>
                    )}
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
