
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, LogOut, Menu, Home, Building2, Briefcase, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { useNavigate } from 'react-router-dom';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

export function HeaderSection({ user, onShowDashboard, onLogout }: HeaderSectionProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { label: 'Accueil', href: '/', icon: Home, description: 'Page d\'accueil' },
    { label: 'À propos', href: '/about', icon: Building2, description: 'Découvrez Terex' },
    { label: 'Carrières', href: '/careers', icon: Briefcase, description: 'Rejoignez l\'équipe' },
  ];

  const supportItems = [
    { label: 'Support', href: '/support', icon: HelpCircle, description: 'Centre d\'aide' },
    { label: 'Contact', href: '/contact', icon: Phone, description: 'Nous contacter' },
    { label: 'FAQ', href: '/faq', icon: MessageCircle, description: 'Questions fréquentes' }
  ];

  // Use hamburger menu for mobile and tablet
  const useHamburgerMenu = isMobile || isTablet;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'pt-2' : 'pt-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating navbar container */}
        {!useHamburgerMenu ? (
          <div className={`backdrop-blur-md rounded-2xl border shadow-lg transition-all duration-300 px-6 flex items-center justify-between ${
            isScrolled 
              ? 'bg-terex-darker/95 border-white/30 shadow-black/30 py-2' 
              : 'bg-terex-darker/80 border-white/20 shadow-black/20 py-3'
          }`}>
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-9 h-9 rounded-lg cursor-pointer"
                onClick={() => navigate('/')}
              />
              <span className="ml-2 text-lg font-semibold text-white">Terex</span>
            </div>

            {/* Navigation Links - Center */}
            <nav className="flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="text-gray-300 hover:text-terex-accent transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
              {supportItems.slice(0, 2).map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="text-gray-300 hover:text-terex-accent transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Actions - Right */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    onClick={onShowDashboard}
                    variant="outline"
                    className="rounded-xl border-terex-accent/30 text-gray-300 hover:bg-terex-accent/10 hover:text-white px-5"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="rounded-xl bg-terex-accent hover:bg-terex-accent/90 text-black px-5"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="rounded-xl border-terex-gray/30 text-gray-300 hover:bg-terex-gray/15 hover:text-white px-5"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="rounded-xl bg-terex-accent hover:bg-terex-accent/90 text-black px-5"
                  >
                    Commencer
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={`backdrop-blur-md rounded-2xl border shadow-lg transition-all duration-300 px-4 flex items-center justify-between ${
            isScrolled 
              ? 'bg-terex-darker/95 border-white/30 shadow-black/30 py-2' 
              : 'bg-terex-darker/80 border-white/20 shadow-black/20 py-3'
          }`}>
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-9 h-9 rounded-lg cursor-pointer"
                onClick={() => navigate('/')}
              />
              <span className="ml-2 text-lg font-semibold text-white">Terex</span>
            </div>

            {/* Hamburger Menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Ouvrir le menu"
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 ${menuOpen ? 'w-6 translate-y-2 rotate-45' : 'w-6'}`} />
                    <span className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-4 opacity-100'}`} />
                    <span className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 ${menuOpen ? 'w-6 -translate-y-2 -rotate-45' : 'w-5'}`} />
                  </div>
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full bg-terex-darker/95 border-white/10 backdrop-blur-xl p-0">
                <ScrollArea className="h-full">
                  <div className="flex min-h-full flex-col pt-safe">
                    <div className="px-6 py-5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <img
                          src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
                          alt="Terex Logo"
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Menu</p>
                          <h2 className="text-lg text-foreground font-medium">Navigation</h2>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      {[...navigationItems, ...supportItems].map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <Button
                            key={item.href}
                            variant="ghost"
                            onClick={() => {
                              navigate(item.href);
                              setMenuOpen(false);
                            }}
                            className="w-full justify-start p-4 h-auto rounded-2xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-300"
                            style={{ animationDelay: `${index * 40}ms` }}
                          >
                            <div className="flex items-center gap-4 w-full">
                              <div className="p-2.5 rounded-xl bg-white/5">
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium text-sm">{item.label}</p>
                                <p className="text-xs opacity-70">{item.description}</p>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>

                    <div className="p-4 border-t border-white/10 mt-auto pb-safe">
                      {user ? (
                        <div className="space-y-2">
                          <Button
                            onClick={() => {
                              onShowDashboard?.();
                              setMenuOpen(false);
                            }}
                            className="w-full bg-terex-accent hover:bg-terex-accent/90 text-terex-dark py-6 rounded-2xl"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Mon Dashboard
                          </Button>
                          <Button
                            onClick={() => {
                              handleLogout();
                              setMenuOpen(false);
                            }}
                            variant="ghost"
                            className="w-full text-muted-foreground hover:text-foreground"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            navigate('/auth');
                            setMenuOpen(false);
                          }}
                          className="w-full bg-terex-accent hover:bg-terex-accent/90 text-terex-dark py-6 rounded-2xl"
                        >
                          Se connecter
                        </Button>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
