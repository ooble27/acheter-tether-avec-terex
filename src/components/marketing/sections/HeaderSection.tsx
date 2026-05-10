
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

const NAV_LINKS = [
  { label: 'Acheter',    href: '/auth' },
  { label: 'Vendre',     href: '/auth' },
  { label: 'Transferts', href: '/auth' },
  { label: 'Blog',       href: '/blog' },
  { label: 'À propos',   href: '/about' },
];

const SUPPORT_LINKS = [
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ',     href: '/faq' },
  { label: 'Support', href: '/support' },
];

export function HeaderSection({ user, onShowDashboard, onLogout }: HeaderSectionProps) {
  const navigate   = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center"
      style={{ background: '#0f0f0f', borderBottom: '1px solid #1f1f1f' }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png"
            alt="Terex"
            className="h-7 w-7 rounded-md"
          />
          <span className="text-[15px] font-semibold text-white tracking-tight">Terex</span>
        </button>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <button
              key={l.href}
              onClick={() => navigate(l.href)}
              className="text-[13px] font-medium transition-colors"
              style={{ color: '#a1a1a1' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a1a1a1')}
            >
              {l.label}
            </button>
          ))}
          <Separator orientation="vertical" className="h-4 opacity-20" />
          {SUPPORT_LINKS.slice(0, 2).map(l => (
            <button
              key={l.href}
              onClick={() => navigate(l.href)}
              className="text-[13px] font-medium transition-colors"
              style={{ color: '#a1a1a1' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a1a1a1')}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button
                onClick={onShowDashboard}
                variant="ghost"
                size="sm"
                className="text-[13px] text-[#a1a1a1] hover:text-white hover:bg-white/5 h-8 px-3"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Dashboard
              </Button>
              <Button
                onClick={onLogout}
                size="sm"
                className="h-8 px-4 rounded-full text-[13px] font-medium text-black"
                style={{ background: '#3b968f' }}
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate('/auth')}
                variant="ghost"
                size="sm"
                className="text-[13px] text-[#a1a1a1] hover:text-white hover:bg-white/5 h-8 px-3"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="h-8 px-4 rounded-full text-[13px] font-medium text-white border border-white/20 bg-transparent hover:bg-white/5"
              >
                Commencer
              </Button>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <div className="md:hidden relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-white/5"
          >
            {open ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>

          {open && (
            <div
              className="absolute top-full right-0 mt-2 w-64 rounded-xl overflow-hidden shadow-2xl"
              style={{ background: '#111', border: '1px solid #2a2a2a' }}
            >
              <div className="p-2">
                {[...NAV_LINKS, ...SUPPORT_LINKS].map(l => (
                  <button
                    key={l.href}
                    onClick={() => { navigate(l.href); setOpen(false); }}
                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#a1a1a1] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #2a2a2a' }} className="p-3 space-y-2">
                <Button
                  onClick={() => { navigate('/auth'); setOpen(false); }}
                  className="w-full h-9 rounded-full text-[13px] font-medium text-black"
                  style={{ background: '#3b968f' }}
                >
                  Commencer
                </Button>
                <Button
                  onClick={() => { navigate('/auth'); setOpen(false); }}
                  variant="ghost"
                  className="w-full h-9 rounded-full text-[13px] text-[#a1a1a1] hover:text-white hover:bg-white/5"
                >
                  Se connecter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
