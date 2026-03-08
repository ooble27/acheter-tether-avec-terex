
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Home, Building2, Briefcase, HelpCircle, Phone, MessageCircle } from 'lucide-react';
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

            {/* Animated Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-10 h-10 flex items-center justify-center focus:outline-none z-[60]"
              aria-label="Menu"
            >
              <div className="flex flex-col items-end gap-[5px]">
                <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ease-out ${menuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'}`} />
                <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ease-out ${menuOpen ? 'w-0 opacity-0' : 'w-4'}`} />
                <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ease-out ${menuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-5'}`} />
              </div>
            </button>

            {/* Fullscreen overlay menu */}
            <div className={`fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
              {/* Backdrop blur */}
              <div className="absolute inset-0 bg-terex-darker/98 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
              
              <div className="relative h-full flex flex-col justify-between px-8 py-24 pb-safe overflow-y-auto">
                {/* Nav items - large, staggered */}
                <nav className="space-y-1">
                  {[...navigationItems, ...supportItems].map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); setMenuOpen(false); }}
                        className={`group w-full flex items-center gap-4 py-4 border-b border-white/5 transition-all duration-500 ease-out ${
                          menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                        style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms' }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-terex-accent/20 transition-colors duration-300">
                          <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-terex-accent transition-colors" />
                        </div>
                        <div className="text-left">
                          <span className="text-xl font-light text-white group-hover:text-terex-accent transition-colors">{item.label}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Footer CTA */}
                <div className={`pt-8 transition-all duration-500 ease-out ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{ transitionDelay: menuOpen ? '500ms' : '0ms' }}>
                  {user ? (
                    <div className="space-y-3">
                      <Button
                        onClick={() => { onShowDashboard?.(); setMenuOpen(false); }}
                        className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-medium py-6 rounded-2xl"
                      >
                        <User className="w-5 h-5 mr-2" />
                        Mon Dashboard
                      </Button>
                      <button
                        onClick={() => { handleLogout(); setMenuOpen(false); }}
                        className="w-full text-center text-sm text-gray-500 hover:text-red-400 transition-colors py-2"
                      >
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                      className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-medium py-6 rounded-2xl shadow-lg shadow-terex-accent/20"
                    >
                      Se Connecter
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
