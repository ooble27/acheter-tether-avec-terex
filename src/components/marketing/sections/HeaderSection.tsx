import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ArrowRight, User, LogOut,
  Coins, HandCoins, Handshake, Building2, Boxes,
  Newspaper, BookOpen, HelpCircle, Shield, Info, Briefcase, LifeBuoy, Phone,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const ROW = '#242424';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.42)';

type Item = { icon: any; title: string; desc: string; href: string };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: 'Produit',
    items: [
      { icon: Coins,     title: 'Acheter des USDT', desc: 'Via Wave & Orange Money',    href: '/auth' },
      { icon: HandCoins, title: 'Vendre des USDT',  desc: 'Vos CFA en quelques minutes', href: '/auth' },
      { icon: Handshake, title: 'OTC · Gros volumes', desc: 'Taux préférentiels',        href: '/otc' },
      { icon: Building2, title: 'Terex Business',    desc: 'Trésorerie & paiements pro',  href: '/business' },
      { icon: Boxes,     title: 'Réseaux',           desc: 'Blockchains supportées',      href: '/blockchain' },
    ],
  },
  {
    label: 'Ressources',
    items: [
      { icon: Newspaper,  title: 'Blog',     desc: 'Articles & actualités',  href: '/blog' },
      { icon: BookOpen,   title: 'Guide',    desc: 'Bien démarrer',          href: '/guide' },
      { icon: HelpCircle, title: 'FAQ',      desc: 'Questions fréquentes',   href: '/faq' },
      { icon: Shield,     title: 'Sécurité', desc: 'Vos fonds protégés',     href: '/security' },
    ],
  },
  {
    label: 'Entreprise',
    items: [
      { icon: Info,      title: 'À propos',  desc: 'Notre mission',        href: '/about' },
      { icon: Briefcase, title: 'Carrières', desc: "Rejoignez l'équipe",   href: '/careers' },
      { icon: LifeBuoy,  title: 'Support',   desc: "Centre d'aide",        href: '/support' },
      { icon: Phone,     title: 'Contact',   desc: 'Nous écrire',          href: '/contact' },
    ],
  },
];

export function HeaderSection({ user, onShowDashboard, onLogout }: HeaderSectionProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isCompact = isMobile || isTablet;

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<any>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => { setOpen(null); navigate(href); };
  const primary = () => (user ? onShowDashboard?.() : navigate('/auth'));
  const handleLogout = async () => { try { await onLogout(); } catch { window.location.reload(); } };

  const enter = (label: string) => { clearTimeout(closeTimer.current); setOpen(label); };
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(null), 130); };

  const activeGroup = GROUPS.find(g => g.label === open);

  const primaryBtn = (
    <button onClick={primary}
      style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 11, height: 40, padding: '0 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
      {user ? 'Tableau de bord' : 'Commencer'} <ArrowRight size={15} />
    </button>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: 'rgba(26,26,26,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}` }}
    >
      <style>{`
        @keyframes hs-drop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .hs-panel { animation: hs-drop 0.18s cubic-bezier(0.22,1,0.36,1) both; }
        .hs-trig { transition: color 0.15s ease; }
        .hs-item { transition: background 0.15s ease, border-color 0.15s ease; }
        .hs-item:hover { background: ${ROW}; }
        .hs-item:hover .hs-chev { transform: translateX(3px); opacity: 1; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
        <div style={{ height: isScrolled ? 58 : 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'height 0.25s ease' }}>

          {/* Logo */}
          <button onClick={() => go('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <img src="/terex-logo.png" alt="Terex" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em' }}>Terex</span>
          </button>

          {/* Desktop : menus déroulants façon Attio */}
          {!isCompact && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }} onMouseLeave={leave}>
              {GROUPS.map((g) => (
                <div key={g.label} onMouseEnter={() => enter(g.label)} style={{ position: 'relative' }}>
                  <button
                    className="hs-trig"
                    onClick={() => setOpen(open === g.label ? null : g.label)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: open === g.label ? '#fff' : MUTED, fontSize: 14.5, fontWeight: 500, padding: '8px 12px', borderRadius: 9 }}
                  >
                    {g.label}
                    <ChevronDown size={15} style={{ transform: open === g.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.7 }} />
                  </button>
                </div>
              ))}

              {/* Panneau déroulant */}
              {activeGroup && (
                <div
                  className="hs-panel"
                  onMouseEnter={() => enter(activeGroup.label)}
                  style={{ position: 'absolute', top: 'calc(100% + 12px)', left: 0, width: 560, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 12, boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}
                >
                  {activeGroup.items.map((it) => {
                    const Icon = it.icon;
                    return (
                      <button key={it.title} className="hs-item" onClick={() => go(it.href)}
                        style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 12px', borderRadius: 12, background: 'transparent', border: '1px solid transparent', cursor: 'pointer', textAlign: 'left' }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={18} strokeWidth={1.7} color="rgba(255,255,255,0.9)" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 650, color: '#fff', letterSpacing: '-0.01em' }}>{it.title}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED2 }}>{it.desc}</p>
                        </div>
                        <ArrowRight className="hs-chev" size={15} style={{ color: MUTED2, opacity: 0, transition: 'transform 0.15s ease, opacity 0.15s ease', flexShrink: 0 }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </nav>
          )}

          {/* Actions à droite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {user ? (
              <>
                {!isCompact && (
                  <button onClick={handleLogout}
                    style={{ background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 11, height: 40, padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <LogOut size={15} /> Déconnexion
                  </button>
                )}
                <button onClick={() => onShowDashboard?.()}
                  style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 11, height: 40, padding: '0 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <User size={15} /> Tableau de bord
                </button>
              </>
            ) : (
              <>
                {!isCompact && (
                  <button onClick={() => navigate('/auth')}
                    style={{ background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 11, height: 40, padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Connexion
                  </button>
                )}
                {primaryBtn}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
