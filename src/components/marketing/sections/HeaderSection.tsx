
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, Home, Building2, Briefcase, HelpCircle, Phone, MessageCircle, ArrowRight, X } from 'lucide-react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      window.location.reload();
    }
  };

  const navigationItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'À propos', href: '/about', icon: Building2 },
    { label: 'Carrières', href: '/careers', icon: Briefcase },
  ];

  const supportItems = [
    { label: 'Support', href: '/support', icon: HelpCircle },
    { label: 'Contact', href: '/contact', icon: Phone },
    { label: 'FAQ', href: '/faq', icon: MessageCircle },
  ];

  const useHamburgerMenu = isMobile || isTablet;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'pt-2' : 'pt-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="rounded-xl border-terex-gray/30 text-gray-300 hover:bg-terex-gray/15 hover:text-white px-5"
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
          <div ref={menuRef} className="relative">
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

              {/* Hamburger toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Dropdown menu — Attio style */}
            <div className={`absolute top-full left-0 right-0 mt-2 transition-all duration-300 origin-top ${
              menuOpen 
                ? 'opacity-100 scale-y-100 translate-y-0' 
                : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
            }`}>
              <div className="bg-terex-darker/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
                {/* Navigation items */}
                <div className="p-3">
                  {navigationItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 group"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-white/10 transition-all">
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-terex-accent transition-colors" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                      </button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="mx-4 h-px bg-white/[0.06]" />

                {/* Support items */}
                <div className="p-3">
                  {supportItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 group"
                        style={{ animationDelay: `${(navigationItems.length + i) * 40}ms` }}
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-white/10 transition-all">
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-terex-accent transition-colors" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                      </button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="mx-4 h-px bg-white/[0.06]" />

                {/* Bottom CTA */}
                <div className="p-3">
                  {user ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => { onShowDashboard?.(); setMenuOpen(false); }}
                        className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black py-5 rounded-xl text-sm font-medium"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mon Dashboard
                      </Button>
                      <Button
                        onClick={() => { handleLogout(); setMenuOpen(false); }}
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-white hover:bg-white/5 py-4 rounded-xl text-sm"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                        className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black py-5 rounded-xl text-sm font-medium"
                      >
                        Commencer
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-white hover:bg-white/5 py-4 rounded-xl text-sm"
                      >
                        Se connecter
                      </Button>
                    </div>
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
