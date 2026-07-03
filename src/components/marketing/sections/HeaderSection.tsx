import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  User, LogOut, Menu, X, ArrowRight, ChevronRight,
  Home, Info, Newspaper, Briefcase, LifeBuoy, Phone, HelpCircle,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { useNavigate } from 'react-router-dom';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

const SURFACE = '#1e1e1e';
const BG = '#1a1a1a';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.42)';

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

  // Lock body scroll while the full-screen sheet is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    try { await onLogout(); } catch { window.location.reload(); }
  };

  const go = (href: string) => { navigate(href); setMenuOpen(false); };

  const navigationItems = [
    { label: 'Accueil', href: '/', icon: Home, description: "Page d'accueil" },
    { label: 'À propos', href: '/about', icon: Info, description: 'Découvrez Terex' },
    { label: 'Blog', href: '/blog', icon: Newspaper, description: 'Articles & actualités' },
    { label: 'Carrières', href: '/careers', icon: Briefcase, description: "Rejoignez l'équipe" },
  ];

  const supportItems = [
    { label: 'Support', href: '/support', icon: LifeBuoy, description: "Centre d'aide" },
    { label: 'Contact', href: '/contact', icon: Phone, description: 'Nous contacter' },
    { label: 'FAQ', href: '/faq', icon: HelpCircle, description: 'Questions fréquentes' },
  ];

  const useHamburgerMenu = isMobile || isTablet;

  const MenuRow = ({ item, index }: { item: typeof navigationItems[number]; index: number }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => go(item.href)}
        className="hs-row"
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: '13px 14px', borderRadius: 16, background: SURFACE,
          border: `1px solid ${BORDER}`, cursor: 'pointer', textAlign: 'left',
          animationDelay: `${0.04 * index + 0.05}s`,
        }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon className="w-[19px] h-[19px]" strokeWidth={1.7} style={{ color: 'rgba(255,255,255,0.9)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 650, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{item.label}</p>
          <p style={{ fontSize: 12.5, color: MUTED2, margin: 0 }}>{item.description}</p>
        </div>
        <ChevronRight className="hs-chev w-[18px] h-[18px]" style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
      </button>
    );
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300"
      style={{ backgroundColor: 'rgba(26,26,26,0.8)', borderBottom: `1px solid ${BORDER}` }}
    >
      <style>{`
        @keyframes hs-sheet-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hs-panel-in { from { opacity: 0; transform: translateY(10px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes hs-row-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .hs-row { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; animation: hs-row-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .hs-row:hover { border-color: rgba(255,255,255,0.16); background: #242424; }
        .hs-row:active { transform: scale(0.99); }
        .hs-row:hover .hs-chev { color: rgba(255,255,255,0.6); }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!useHamburgerMenu ? (
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/terex-logo.png" alt="Terex Logo" className="w-11 h-11 object-contain" />
              <span className="text-xl font-bold tracking-tight" style={{ color: '#fff', letterSpacing: '-0.03em' }}>Terex</span>
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
          <div ref={menuRef}>
            <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
                <img src="/terex-logo.png" alt="Terex Logo" className="w-11 h-11 object-contain" />
                <span className="text-xl font-bold tracking-tight" style={{ color: '#fff', letterSpacing: '-0.03em' }}>Terex</span>
              </div>
              <button
                onClick={() => setMenuOpen(true)}
                className="w-11 h-11 flex items-center justify-center rounded-xl transition-colors"
                style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5" style={{ color: '#fff' }} />
              </button>
            </div>

            {/* Full-screen navigation sheet */}
            <div
              style={{
                position: 'fixed', inset: 0, zIndex: 60,
                pointerEvents: menuOpen ? 'auto' : 'none',
                opacity: menuOpen ? 1 : 0,
                transition: 'opacity 0.25s ease',
              }}
              aria-hidden={!menuOpen}
            >
              {/* backdrop */}
              <div
                onClick={() => setMenuOpen(false)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.55)', backdropFilter: 'blur(6px)' }}
              />

              {/* panel */}
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute', inset: 0, background: BG,
                    display: 'flex', flexDirection: 'column',
                    animation: 'hs-panel-in 0.32s cubic-bezier(0.22,1,0.36,1) both',
                  }}
                >
                  {/* sheet header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 64, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => go('/')}>
                      <img src="/terex-logo.png" alt="Terex Logo" className="w-10 h-10 object-contain" />
                      <span className="text-lg font-bold tracking-tight" style={{ color: '#fff', letterSpacing: '-0.03em' }}>Terex</span>
                    </div>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl transition-colors"
                      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                      aria-label="Fermer le menu"
                    >
                      <X className="w-5 h-5" style={{ color: '#fff' }} />
                    </button>
                  </div>

                  {/* scrollable content */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 8px' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: MUTED2, margin: '0 0 12px 4px' }}>Navigation</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26 }}>
                      {navigationItems.map((item, i) => <MenuRow key={item.href} item={item} index={i} />)}
                    </div>

                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: MUTED2, margin: '0 0 12px 4px' }}>Support</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {supportItems.map((item, i) => <MenuRow key={item.href} item={item} index={navigationItems.length + i} />)}
                    </div>
                  </div>

                  {/* footer CTA */}
                  <div style={{ padding: '16px 20px calc(20px + env(safe-area-inset-bottom))', borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
                    {user ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Button
                          onClick={() => { onShowDashboard?.(); setMenuOpen(false); }}
                          className="w-full h-12 rounded-xl text-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
                        >
                          <User className="w-4 h-4 mr-2" />Tableau de bord
                        </Button>
                        <Button
                          onClick={() => { handleLogout(); setMenuOpen(false); }}
                          className="w-full h-12 rounded-xl text-sm"
                          style={{ backgroundColor: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />Déconnexion
                        </Button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Button
                          onClick={() => go('/auth')}
                          className="w-full h-12 rounded-xl text-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
                        >
                          Commencer<ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          onClick={() => go('/auth')}
                          className="w-full h-12 rounded-xl text-sm"
                          style={{ backgroundColor: '#2d2d2d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                        >
                          Se connecter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
