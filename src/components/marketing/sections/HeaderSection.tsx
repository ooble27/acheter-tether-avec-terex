import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ArrowRight, User, LogOut, Menu, X,
  Coins, HandCoins, Handshake, Building2, Boxes,
  Newspaper, BookOpen, HelpCircle, Shield, Info, Briefcase, LifeBuoy, Phone,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';

interface HeaderSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
  onLogout: () => void;
}

const BG = 'hsl(var(--terex-dark))';
const CARD = 'hsl(var(--terex-darker))';
const ROW = 'hsl(var(--terex-darker))';
const BORDER = 'hsl(var(--terex-accent) / 0.07)';
const ICON_BG = 'hsl(var(--terex-accent) / 0.06)';
const MUTED = 'hsl(var(--terex-accent) / 0.55)';
const MUTED2 = 'hsl(var(--terex-accent) / 0.42)';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<any>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setMobileGroup(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const go = (href: string) => { setOpen(null); setMobileMenuOpen(false); navigate(href); };
  const primary = () => (user ? onShowDashboard?.() : navigate('/auth'));

  const handleLogout = async () => { try { await onLogout(); } catch { window.location.reload(); } };

  const enter = (label: string) => { clearTimeout(closeTimer.current); setOpen(label); };
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(null), 130); };

  const activeGroup = GROUPS.find(g => g.label === open);

  const primaryBtn = (
    <button onClick={primary}
      style={{ background: 'hsl(var(--terex-accent))', color: 'hsl(var(--terex-accent-fg))', border: 'none', borderRadius: 11, height: 40, padding: '0 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
      {user ? 'Tableau de bord' : 'Commencer'} <ArrowRight size={15} />
    </button>
  );

  return (
    <>
      <header
        style={{
          position: isCompact ? 'absolute' : 'fixed',
          top: 0, left: 0, right: 0, zIndex: 50,
          backgroundColor: BG, borderBottom: `1px solid ${BORDER}`,
        }}
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
              <span style={{ color: 'hsl(var(--foreground))', fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em' }}>Terex</span>
            </button>

            {/* Desktop : menus déroulants */}
            {!isCompact && (
              <nav style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }} onMouseLeave={leave}>
                {GROUPS.map((g) => (
                  <div key={g.label} onMouseEnter={() => enter(g.label)} style={{ position: 'relative' }}>
                    <button
                      className="hs-trig"
                      onClick={() => setOpen(open === g.label ? null : g.label)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: open === g.label ? 'hsl(var(--foreground))' : MUTED, fontSize: 14.5, fontWeight: 500, padding: '8px 12px', borderRadius: 9 }}
                    >
                      {g.label}
                      <ChevronDown size={15} style={{ transform: open === g.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.7 }} />
                    </button>
                  </div>
                ))}

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
                            <Icon size={18} strokeWidth={1.7} color="hsl(var(--terex-accent) / 0.9)" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 650, color: 'hsl(var(--foreground))', letterSpacing: '-0.01em' }}>{it.title}</p>
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
              {!isCompact && <ThemeToggle />}
              {user ? (
                <>
                  {!isCompact && (
                    <button onClick={handleLogout}
                      style={{ background: 'hsl(var(--terex-gray))', color: 'hsl(var(--foreground))', border: `1px solid ${BORDER}`, borderRadius: 11, height: 40, padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <LogOut size={15} /> Déconnexion
                    </button>
                  )}
                  {!isCompact && (
                    <button onClick={() => onShowDashboard?.()}
                      style={{ background: 'hsl(var(--terex-accent))', color: 'hsl(var(--terex-accent-fg))', border: 'none', borderRadius: 11, height: 40, padding: '0 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                      <User size={15} /> Tableau de bord
                    </button>
                  )}
                </>
              ) : (
                <>
                  {!isCompact && (
                    <button onClick={() => navigate('/auth')}
                      style={{ background: 'hsl(var(--terex-gray))', color: 'hsl(var(--foreground))', border: `1px solid ${BORDER}`, borderRadius: 11, height: 40, padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      Connexion
                    </button>
                  )}
                  {!isCompact && primaryBtn}
                </>
              )}

              {isCompact && (
                <button
                  onClick={() => setMobileMenuOpen(v => !v)}
                  aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'hsl(var(--foreground))' }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Full-page mobile overlay menu */}
      {isCompact && mobileMenuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: BG,
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          paddingTop: isScrolled ? 58 : 64,
        }}>
          <style>{`
            @keyframes hm-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            .hm-stagger { animation: hm-fade 0.3s cubic-bezier(0.22,1,0.36,1) both; }
          `}</style>

          <div style={{ flex: 1, padding: '24px clamp(20px, 5vw, 32px)' }}>
            {/* Navigation groups */}
            {GROUPS.map((g, gi) => (
              <div key={g.label} className="hm-stagger" style={{ animationDelay: `${gi * 60}ms`, marginBottom: 8 }}>
                <button
                  onClick={() => setMobileGroup(mobileGroup === g.label ? null : g.label)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '16px 0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <span style={{ color: 'hsl(var(--foreground))', fontSize: 18, fontWeight: 600 }}>{g.label}</span>
                  <ChevronDown size={18} color={MUTED} style={{ transform: mobileGroup === g.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {mobileGroup === g.label && (
                  <div style={{ padding: '8px 0 12px' }}>
                    {g.items.map((it) => {
                      const Icon = it.icon;
                      return (
                        <button
                          key={it.title}
                          onClick={() => go(it.href)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            width: '100%', padding: '12px 8px', borderRadius: 12,
                            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                          }}
                        >
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={18} strokeWidth={1.7} color="hsl(var(--terex-accent) / 0.9)" />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'hsl(var(--foreground))' }}>{it.title}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: MUTED2 }}>{it.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Theme toggle row */}
            <div className="hm-stagger" style={{ animationDelay: `${GROUPS.length * 60}ms`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: MUTED, fontSize: 14, fontWeight: 500 }}>Mode d'affichage</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Bottom CTA buttons */}
          <div style={{ padding: '16px clamp(20px, 5vw, 32px) 32px', borderTop: `1px solid ${BORDER}` }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => { setMobileMenuOpen(false); onShowDashboard?.(); }}
                  style={{ width: '100%', background: 'hsl(var(--terex-accent))', color: 'hsl(var(--terex-accent-fg))', border: 'none', borderRadius: 12, height: 48, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <User size={16} /> Tableau de bord
                </button>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  style={{ width: '100%', background: 'hsl(var(--terex-gray))', color: 'hsl(var(--foreground))', border: `1px solid ${BORDER}`, borderRadius: 12, height: 48, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => go('/auth')}
                  style={{ width: '100%', background: 'hsl(var(--terex-accent))', color: 'hsl(var(--terex-accent-fg))', border: 'none', borderRadius: 12, height: 48, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Commencer <ArrowRight size={16} />
                </button>
                <button onClick={() => go('/auth')}
                  style={{ width: '100%', background: 'hsl(var(--terex-gray))', color: 'hsl(var(--foreground))', border: `1px solid ${BORDER}`, borderRadius: 12, height: 48, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  Connexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
