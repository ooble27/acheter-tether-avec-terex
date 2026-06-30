import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { useNavigate } from 'react-router-dom';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

// Geometric SVG icons (used in mobile menu)
const IconHome = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 12L12 4l9 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="3" width="16" height="18" rx="1.5" strokeLinecap="round" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h6" strokeLinecap="round" />
  </svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" />
    <path d="M3 12h18" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const IconSupport = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeLinecap="round" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const IconFAQ = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <circle cx="12" cy="10" r="0.5" fill="currentColor" stroke="none" />
    <path d="M10 8a2 2 0 114 0c0 1-2 1.5-2 3" strokeLinecap="round" />
  </svg>
);

const SURFACE = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const MUTED = 'rgba(255,255,255,0.55)';

export function HeaderSection({ user, onShowDashboard, onLogout }: HeaderSectionProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    try { await onLogout(); } catch { window.location.reload(); }
  };

  const navigationItems = [
    { label: 'Accueil', href: '/', icon: IconHome, description: 'Page d\'accueil' },
    { label: 'À propos', href: '/about', icon: IconBuilding, description: 'Découvrez Terex' },
    { label: 'Blog', href: '/blog', icon: IconFAQ, description: 'Articles & actualités' },
    { label: 'Carrières', href: '/careers', icon: IconBriefcase, description: 'Rejoignez l\'équipe' },
  ];

  const supportItems = [
    { label: 'Support', href: '/support', icon: IconSupport, description: 'Centre d\'aide' },
    { label: 'Contact', href: '/contact', icon: IconPhone, description: 'Nous contacter' },
    { label: 'FAQ', href: '/faq', icon: IconFAQ, description: 'Questions fréquentes' },
  ];

  const useHamburgerMenu = isMobile || isTablet;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: 'rgba(20,20,20,0.8)',
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!useHamburgerMenu ? (
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex Logo" className="w-8 h-8 rounded-lg" />
              <span className="ml-2 text-lg font-semibold tracking-tight" style={{ color: '#fff' }}>TEREX</span>
            </div>
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: MUTED }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                >
                  {item.label}
                </button>
              ))}
              {supportItems.slice(0, 2).map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: MUTED }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    onClick={onShowDashboard}
                    className="h-11 rounded-xl px-5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
                  >
                    <User className="w-4 h-4 mr-2" />Tableau de bord
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="h-11 rounded-xl px-5"
                    style={{ backgroundColor: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="h-11 rounded-xl px-5"
                    style={{ backgroundColor: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="h-11 rounded-xl px-5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
                  >
                    Commencer
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div ref={menuRef} className="relative">
            <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex Logo" className="w-8 h-8 rounded-lg" />
                <span className="ml-2 text-lg font-semibold tracking-tight" style={{ color: '#fff' }}>TEREX</span>
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-white/5"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5" style={{ color: '#fff' }} /> : <Menu className="w-5 h-5" style={{ color: '#fff' }} />}
              </button>
            </div>

            <div className={`absolute top-full right-0 mt-2 w-72 transition-all duration-200 origin-top-right ${
              menuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}>
              <div
                className="backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
              >
                <div className="p-2 pt-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 px-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Navigation</p>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group hover:bg-white/[0.06]"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: '#2d2d2d', border: `1px solid ${BORDER}` }}
                        >
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}><Icon /></span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[13px] leading-tight" style={{ color: '#fff' }}>{item.label}</p>
                          <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-3 h-px" style={{ backgroundColor: BORDER }} />

                <div className="p-2">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-medium mb-1.5 px-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Support</p>
                  {supportItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group hover:bg-white/[0.06]"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: '#2d2d2d', border: `1px solid ${BORDER}` }}
                        >
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}><Icon /></span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[13px] leading-tight" style={{ color: '#fff' }}>{item.label}</p>
                          <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-3 h-px" style={{ backgroundColor: BORDER }} />

                <div className="p-3">
                  {user ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => { onShowDashboard?.(); setMenuOpen(false); }}
                        className="w-full h-12 rounded-xl text-sm hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
                      >
                        <User className="w-4 h-4 mr-2" />Tableau de bord
                      </Button>
                      <Button
                        onClick={() => { handleLogout(); setMenuOpen(false); }}
                        className="w-full h-11 rounded-xl text-xs"
                        style={{ backgroundColor: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                        className="w-full h-12 rounded-xl text-sm hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
                      >
                        Commencer<ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                        className="w-full h-11 rounded-xl text-xs"
                        style={{ backgroundColor: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
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
