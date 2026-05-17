import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Send, Clock, Users2,
  Building2, LifeBuoy, LogOut,
  ArrowLeft, Menu, X,
  Wallet, CalendarClock, BarChart2, UserCog, ShieldCheck,
  Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessOverview } from './BusinessOverview';
import { BusinessPayments } from './BusinessPayments';
import { BusinessSuppliers } from './BusinessSuppliers';
import { BusinessHistory } from './BusinessHistory';
import { BusinessProfile } from './BusinessProfile';
import { BusinessSupport } from './BusinessSupport';
import { BusinessTreasury } from './BusinessTreasury';
import { BusinessAnalytics } from './BusinessAnalytics';
import { BusinessBatch } from './BusinessBatch';
import { BusinessTeam } from './BusinessTeam';
import { BusinessCompliance } from './BusinessCompliance';

interface BusinessDashboardProps {
  user: { id?: string; email: string; name: string } | null;
}

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { id: 'overview',    label: "Vue d'ensemble",      icon: LayoutDashboard },
      { id: 'payment',     label: 'Paiements',            icon: Send },
      { id: 'treasury',    label: 'Trésorerie',           icon: Wallet },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { id: 'history',     label: 'Historique & Reçus',   icon: Clock },
      { id: 'suppliers',   label: 'Fournisseurs',         icon: Users2 },
      { id: 'batch',       label: 'Lots & Planification', icon: CalendarClock },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'analytics',   label: 'Analytique',           icon: BarChart2 },
      { id: 'team',        label: 'Équipe & Accès',       icon: UserCog },
      { id: 'compliance',  label: 'Conformité KYC',       icon: ShieldCheck },
    ],
  },
  {
    label: 'Paramètres',
    items: [
      { id: 'profile',     label: 'Profil entreprise',    icon: Building2 },
      { id: 'support',     label: 'Support',              icon: LifeBuoy },
    ],
  },
];

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bds: '#252525', bd: '#383838', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.10)',
  t1: '#f0f0f0', t2: '#a0a0a0', t3: '#606060',
  sidebarBg: '#111111',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

function InitialAvatar({ name, size = 28 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 7,
      background: 'rgba(59,150,143,0.22)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0, fontFamily: FONT,
    }}>
      {initials}
    </div>
  );
}

export function BusinessDashboard({ user }: BusinessDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [navOpen, setNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    setNavOpen(false);
    setSearchQuery('');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':    return <BusinessOverview user={user} onNavigate={setActiveSection} />;
      case 'payment':     return <BusinessPayments user={user} onBack={() => setActiveSection('overview')} />;
      case 'treasury':    return <BusinessTreasury user={user} />;
      case 'history':     return <BusinessHistory user={user} />;
      case 'suppliers':   return <BusinessSuppliers user={user} />;
      case 'batch':       return <BusinessBatch user={user} />;
      case 'analytics':   return <BusinessAnalytics user={user} />;
      case 'team':        return <BusinessTeam user={user} />;
      case 'compliance':  return <BusinessCompliance user={user} />;
      case 'profile':     return <BusinessProfile user={user} />;
      case 'support':     return <BusinessSupport />;
      default:            return <BusinessOverview user={user} onNavigate={setActiveSection} />;
    }
  };

  const allItems = NAV_SECTIONS.flatMap(s => s.items);
  const filteredItems = searchQuery.trim()
    ? allItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const activeItem = allItems.find(i => i.id === activeSection);

  const NavItem = ({ item }: { item: typeof allItems[0] }) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    return (
      <button
        onClick={() => handleNavigate(item.id)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '5px 6px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: isActive ? 'rgba(59,150,143,0.12)' : 'transparent',
          fontFamily: FONT, textAlign: 'left',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: isActive ? 'rgba(59,150,143,0.22)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isActive ? 'rgba(59,150,143,0.35)' : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s',
        }}>
          <Icon style={{ width: 14, height: 14, color: isActive ? C.teal : C.t3 }} />
        </div>
        <span style={{
          color: isActive ? C.t1 : C.t2, fontSize: 13,
          fontWeight: isActive ? 500 : 400, flex: 1,
          transition: 'color 0.12s',
        }}>
          {item.label}
        </span>
        {isActive && (
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal, flexShrink: 0 }} />
        )}
      </button>
    );
  };

  return (
    <div style={{ height: '100vh', background: C.bg, overflow: 'hidden', position: 'relative' }}>

      {/* Animation CSS */}
      <style>{`
        @keyframes navPanelIn {
          from { opacity: 0; transform: translateX(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes navBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Hamburger button ─────────────────────────────────────── */}
      <button
        onClick={() => setNavOpen(v => !v)}
        style={{
          position: 'fixed',
          top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          left: 20,
          zIndex: 60,
          width: 36, height: 36, borderRadius: 10,
          background: navOpen ? C.tealT : C.l2,
          border: `1px solid ${navOpen ? 'rgba(59,150,143,0.35)' : C.bds}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: navOpen ? C.teal : C.t2, cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          transition: 'all 0.15s',
        }}
      >
        {navOpen
          ? <X style={{ width: 16, height: 16 }} />
          : <Menu style={{ width: 16, height: 16 }} />
        }
      </button>

      {/* ── Floating nav panel ────────────────────────────────────── */}
      {navOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.42)',
              backdropFilter: 'blur(3px)',
              animation: 'navBackdropIn 0.18s ease-out',
            }}
            onClick={() => setNavOpen(false)}
          />

          {/* Floating panel — détaché du bord */}
          <aside style={{
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top, 0px) + 62px)',
            left: 16,
            width: 262,
            maxHeight: 'calc(100vh - 90px)',
            zIndex: 55,
            background: '#0f0f0f',
            border: `1px solid rgba(255,255,255,0.09)`,
            borderRadius: 18,
            boxShadow: '0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04) inset',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'navPanelIn 0.18s cubic-bezier(0.16,1,0.3,1)',
            fontFamily: FONT,
            userSelect: 'none',
          }}>

            {/* Header */}
            <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                  background: 'linear-gradient(135deg, #3B968F, #2a6b65)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 1px rgba(59,150,143,0.4), 0 4px 12px rgba(59,150,143,0.2)',
                }}>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '-0.02em' }}>TB</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: C.t1, fontSize: 12, fontWeight: 700, margin: 0, letterSpacing: '0.01em' }}>Terex Business</p>
                  <p style={{ color: C.t3, fontSize: 10, margin: 0 }}>Portail B2B</p>
                </div>
              </div>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 12, height: 12, color: C.t3, pointerEvents: 'none',
                }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher…"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: `1px solid rgba(255,255,255,0.09)`,
                    borderRadius: 9, paddingLeft: 30, paddingRight: 10,
                    paddingTop: 7, paddingBottom: 7,
                    color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT,
                    boxSizing: 'border-box', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,150,143,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
                />
              </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
              {filteredItems ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredItems.length === 0 && (
                    <p style={{ color: C.t3, fontSize: 12, textAlign: 'center', marginTop: 20 }}>Aucun résultat</p>
                  )}
                  {filteredItems.map(item => <NavItem key={item.id} item={item} />)}
                </div>
              ) : (
                NAV_SECTIONS.map((section, sIdx) => (
                  <div key={section.label} style={{ marginTop: sIdx === 0 ? 0 : 14 }}>
                    <p style={{
                      color: 'rgba(255,255,255,0.22)', fontSize: 9.5, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      margin: '0 0 4px', paddingLeft: 8,
                    }}>
                      {section.label}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {section.items.map(item => <NavItem key={item.id} item={item} />)}
                    </div>
                  </div>
                ))
              )}
            </nav>

            {/* Footer */}
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.07)`, padding: '10px 8px 10px' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 11.5, color: C.t3, background: 'transparent',
                  fontFamily: FONT, marginBottom: 8, textAlign: 'left', transition: 'all 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.t2; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowLeft style={{ width: 12, height: 12 }} />
                Espace personnel
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 10px', borderRadius: 11,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(255,255,255,0.07)`,
              }}>
                <InitialAvatar name={user?.name || 'U'} size={30} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ color: C.t1, fontSize: 12, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || 'Utilisateur'}
                  </p>
                  <p style={{ color: C.t3, fontSize: 10.5, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.09)`,
                    borderRadius: 7, cursor: 'pointer', color: C.t3, padding: '5px 6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.12s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <LogOut style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ── Contenu scrollable ────────────────────────────────────── */}
      <main style={{ height: '100%', overflowY: 'auto', background: C.bg }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'rgba(26,26,26,0.92)', backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.bds}`,
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}>
          <div style={{
            maxWidth: 1040, margin: '0 auto',
            padding: '0 20px',
            height: 56,
            display: 'flex', alignItems: 'center',
            paddingLeft: 72,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {activeItem && (() => {
                const Icon = activeItem.icon;
                return (
                  <div style={{
                    width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                    background: 'rgba(59,150,143,0.15)',
                    border: '1px solid rgba(59,150,143,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 13, height: 13, color: C.teal }} />
                  </div>
                );
              })()}
              <span style={{ color: C.t1, fontSize: 14, fontWeight: 600, fontFamily: FONT }}>
                {activeItem?.label || "Vue d'ensemble"}
              </span>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '5px 10px', borderRadius: 7,
                background: 'rgba(59,150,143,0.08)',
                border: '1px solid rgba(59,150,143,0.20)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, flexShrink: 0 }} />
                <span style={{ color: C.teal, fontSize: 10.5, fontFamily: MONO, fontWeight: 600 }}>
                  {user?.name?.split(' ')[0] || 'Business'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-4 md:p-8"
          style={{ maxWidth: 1040, margin: '0 auto', width: '100%' }}
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
