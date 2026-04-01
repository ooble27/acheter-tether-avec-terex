
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/i18n/LanguageContext';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

// Attio-style geometric SVG icons
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

export function HeaderSection({ user, onShowDashboard, onLogout }: HeaderSectionProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    { label: t.header.home, href: '/', icon: IconHome, description: t.header.homeDesc },
    { label: t.header.about, href: '/about', icon: IconBuilding, description: t.header.aboutDesc },
    { label: t.header.blog, href: '/blog', icon: IconFAQ, description: t.header.blogDesc },
    { label: t.header.careers, href: '/careers', icon: IconBriefcase, description: t.header.careersDesc },
  ];

  const supportItems = [
    { label: t.header.support, href: '/support', icon: IconSupport, description: t.header.supportDesc },
    { label: t.header.contact, href: '/contact', icon: IconPhone, description: t.header.contactDesc },
    { label: t.header.faq, href: '/faq', icon: IconFAQ, description: t.header.faqDesc },
  ];

  const useHamburgerMenu = isMobile || isTablet;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'pt-2' : 'pt-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!useHamburgerMenu ? (
          <div className={`backdrop-blur-md rounded-2xl border shadow-lg transition-all duration-300 px-6 flex items-center justify-between ${
            isScrolled ? 'bg-terex-darker/95 border-white/30 shadow-black/30 py-2' : 'bg-terex-darker/80 border-white/20 shadow-black/20 py-3'
          }`}>
            <div className="flex items-center">
              <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex Logo" className="w-9 h-9 rounded-lg cursor-pointer" onClick={() => navigate('/')} />
              <span className="ml-2 text-lg font-semibold text-white">Terex</span>
            </div>
            <nav className="flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <button key={item.href} onClick={() => navigate(item.href)} className="text-gray-300 hover:text-terex-accent transition-colors duration-200 text-sm font-medium">
                  {item.label}
                </button>
              ))}
              {supportItems.slice(0, 2).map((item) => (
                <button key={item.href} onClick={() => navigate(item.href)} className="text-gray-300 hover:text-terex-accent transition-colors duration-200 text-sm font-medium">
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-3">
              <LanguageToggle />
              {user ? (
                <>
                  <Button onClick={onShowDashboard} variant="outline" className="rounded-xl border-terex-gray/30 text-gray-300 hover:bg-terex-gray/15 hover:text-white px-5">
                    <User className="w-4 h-4 mr-2" />{t.header.dashboard}
                  </Button>
                  <Button onClick={handleLogout} className="rounded-xl bg-terex-accent hover:bg-terex-accent/90 text-black px-5">
                    <LogOut className="w-4 h-4 mr-2" />{t.header.logout}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => navigate('/auth')} variant="outline" className="rounded-xl border-terex-gray/30 text-gray-300 hover:bg-terex-gray/15 hover:text-white px-5">
                    {t.header.login}
                  </Button>
                  <Button onClick={() => navigate('/auth')} className="rounded-xl bg-terex-accent hover:bg-terex-accent/90 text-black px-5">
                    {t.header.getStarted}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div ref={menuRef} className="relative">
            <div className={`rounded-2xl border shadow-lg transition-all duration-300 px-4 flex items-center justify-between ${
              isScrolled ? 'bg-terex-darker border-white/30 shadow-black/30 py-2' : 'bg-terex-darker border-white/20 shadow-black/20 py-3'
            }`}>
              <div className="flex items-center">
                <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex Logo" className="w-9 h-9 rounded-lg cursor-pointer" onClick={() => navigate('/')} />
                <span className="ml-2 text-lg font-semibold text-white">Terex</span>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors" aria-label="Menu">
                  {menuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </button>
              </div>
            </div>

            {/* Dropdown */}
            <div className={`absolute top-full right-0 mt-2 w-72 transition-all duration-200 origin-top-right ${
              menuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}>
              <div className="bg-terex-darker/98 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Nav section */}
                <div className="p-2 pt-3">
                  <p className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-medium mb-1.5 px-3">{t.header.navigation}</p>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/90 hover:bg-white/[0.08] hover:text-white transition-all duration-150 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/15 flex items-center justify-center group-hover:border-white/25 transition-all">
                          <span className="text-white/70 group-hover:text-terex-accent transition-colors"><Icon /></span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[13px] leading-tight text-white">{item.label}</p>
                          <p className="text-[10px] text-white/50 leading-tight">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-3 h-px bg-white/10" />

                {/* Support section */}
                <div className="p-2">
                  <p className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-medium mb-1.5 px-3">{t.header.support}</p>
                  {supportItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/90 hover:bg-white/[0.08] hover:text-white transition-all duration-150 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/15 flex items-center justify-center group-hover:border-white/25 transition-all">
                          <span className="text-white/70 group-hover:text-terex-accent transition-colors"><Icon /></span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[13px] leading-tight text-white">{item.label}</p>
                          <p className="text-[10px] text-white/50 leading-tight">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-3 h-px bg-white/[0.06]" />

                {/* CTA */}
                <div className="p-3">
                  {user ? (
                    <div className="space-y-1.5">
                      <Button onClick={() => { onShowDashboard?.(); setMenuOpen(false); }} className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black py-4 rounded-xl text-sm font-medium">
                        <User className="w-4 h-4 mr-2" />{t.header.myDashboard}
                      </Button>
                      <Button onClick={() => { handleLogout(); setMenuOpen(false); }} variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 py-3 rounded-xl text-xs">
                        <LogOut className="w-4 h-4 mr-2" />{t.header.logout}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Button onClick={() => { navigate('/auth'); setMenuOpen(false); }} className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black py-4 rounded-xl text-sm font-medium">
                        {t.header.getStarted}<ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button onClick={() => { navigate('/auth'); setMenuOpen(false); }} variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 py-3 rounded-xl text-xs">
                        {t.header.signIn}
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
