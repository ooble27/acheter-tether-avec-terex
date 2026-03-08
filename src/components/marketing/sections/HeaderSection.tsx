
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
                    className="rounded-xl border-terex-accent/30 text-gray-300 hover:bg-terex-accent/10 hover:text-white px-5"
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
              <SheetContent side="right" className="w-full bg-white border-none p-0">
                <ScrollArea className="h-full">
                  <div className="flex flex-col min-h-full pt-safe">
                    {/* Header Attio-style */}
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                          alt="Terex Logo" 
                          className="w-8 h-8 rounded-lg"
                        />
                        <span className="text-lg font-semibold text-gray-900">Terex</span>
                      </div>
                    </div>

                    {/* Navigation Section - Attio clean list */}
                    <div className="px-6 pt-6">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.15em] mb-3">Navigation</p>
                      <div className="space-y-1">
                        {navigationItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <button
                              key={item.href}
                              onClick={() => navigate(item.href)}
                              className="w-full flex items-center space-x-4 py-3 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900">{item.label}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Support Section - Attio clean list */}
                    <div className="px-6 pt-6">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.15em] mb-3">Support</p>
                      <div className="space-y-1">
                        {supportItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <button
                              key={item.href}
                              onClick={() => navigate(item.href)}
                              className="w-full flex items-center space-x-4 py-3 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900">{item.label}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer - clean CTA */}
                    <div className="px-6 pt-8 mt-auto pb-safe pb-6">
                      {user ? (
                        <div className="space-y-1">
                          <button
                            onClick={onShowDashboard}
                            className="w-full flex items-center space-x-4 py-3 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-sm text-gray-900">Mon Dashboard</div>
                              <div className="text-xs text-gray-500">Accéder à mon compte</div>
                            </div>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-4 py-3 px-1 rounded-lg hover:bg-red-50 transition-colors duration-150"
                          >
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                              <LogOut className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-sm text-red-600">Déconnexion</div>
                              <div className="text-xs text-red-400">Se déconnecter</div>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => navigate('/auth')}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 rounded-xl"
                        >
                          Se Connecter
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
