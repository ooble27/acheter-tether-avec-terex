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
      { id: 'overview',    label: "Vue d'ensemble",     icon: LayoutDashboard },
      { id: 'payment',     label: 'Paiements',           icon: Send },
      { id: 'treasury',    label: 'Trésorerie',          icon: Wallet },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { id: 'history',     label: 'Historique & Reçus',  icon: Clock },
      { id: 'suppliers',   label: 'Fournisseurs',        icon: Users2 },
      { id: 'batch',       label: 'Lots & Planification',icon: CalendarClock },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'analytics',   label: 'Analytique',          icon: BarChart2 },
      { id: 'team',        label: 'Équipe & Accès',      icon: UserCog },
      { id: 'compliance',  label: 'Conformité KYC',      icon: ShieldCheck },
    ],
  },
  {
    label: 'Paramètres',
    items: [
      { id: 'profile',     label: 'Profil entreprise',   icon: Building2 },
      { id: 'support',     label: 'Support',             icon: LifeBuoy },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
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

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: FONT, userSelect: 'none' }}>

      {/* ── Header ── */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, #3B968F, #2a6b65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1px rgba(59,150,143,0.3)',
            }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '-0.02em' }}>TB</span>
            </div>
            <div>
              <p style={{ color: C.t1, fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>Terex Business</p>
              <p style={{ color: C.t3, fontSize: 10, margin: 0 }}>Portail B2B</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              width: 26, height: 26, borderRadius: 6, border: 'none',
              background: 'transparent', color: C.t3, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.l2; e.currentTarget.style.color = C.t1; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.t3; }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginTop: 12 }}>
          <Search style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            width: 13, height: 13, color: C.t3, pointerEvents: 'none',
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            style={{
              width: '100%', background: C.l2, border: `1px solid ${C.bds}`,
              borderRadius: 7, paddingLeft: 30, paddingRight: 36,
              paddingTop: 7, paddingBottom: 7,
              color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT,
              boxSizing: 'border-box', transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,150,143,0.4)')}
            onBlur={e => (e.currentTarget.style.borderColor = C.bds)}
          />
          <span style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            fontSize: 9, color: C.t3, background: C.l3, border: `1px solid ${C.bds}`,
            borderRadius: 4, padding: '1px 5px', letterSpacing: '0.02em',
            fontFamily: MONO,
          }}>⌘K</span>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
        {filteredItems ? (
          /* Search results */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {filteredItems.length === 0 && (
              <p style={{ color: C.t3, fontSize: 12, textAlign: 'center', marginTop: 20 }}>Aucun résultat</p>
            )}
            {filteredItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarOpen(false); setSearchQuery(''); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
                    color: isActive ? C.t1 : C.t2, fontSize: 13, fontWeight: isActive ? 500 : 400,
                    fontFamily: FONT, textAlign: 'left', transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = C.t1; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = C.t2; } }}
                >
                  <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Normal grouped nav */
          NAV_SECTIONS.map((section, sIdx) => (
            <div key={section.label} style={{ marginTop: sIdx === 0 ? 4 : 16 }}>
              <p style={{
                color: '#484848', fontSize: 10, fontWeight: 600, letterSpacing: '0.09em',
                textTransform: 'uppercase', margin: '0 0 4px', paddingLeft: 10,
              }}>
                {section.label}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
                        color: isActive ? C.t1 : C.t2, fontSize: 13, fontWeight: isActive ? 500 : 400,
                        fontFamily: FONT, textAlign: 'left', transition: 'all 0.1s',
                      }}
                      onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = C.t1; } }}
                      onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = C.t2; } }}
                    >
                      <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* ── Footer ── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, padding: '10px 10px 10px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontSize: 11.5, color: C.t3, background: 'transparent',
            fontFamily: FONT, marginBottom: 8, textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.t2; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = 'transparent'; }}
        >
          <ArrowLeft style={{ width: 12, height: 12 }} />
          Espace personnel
        </button>

        {/* User card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${C.bds}`,
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
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bds}`,
              borderRadius: 6, cursor: 'pointer', color: C.t3, padding: '4px 5px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <LogOut style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', background: C.bg, overflow: 'hidden', position: 'relative' }}>

      {/* Bouton hamburger flottant */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          left: 24,
          zIndex: 40,
          width: 36, height: 36, borderRadius: 8,
          background: C.l2, border: `1px solid ${C.bds}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.t2, cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      >
        <Menu style={{ width: 16, height: 16 }} />
      </button>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside style={{
            position: 'relative', zIndex: 10,
            width: 248,
            background: C.sidebarBg,
            borderRight: `1px solid ${C.bds}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenu scrollable */}
      <main style={{ height: '100%', overflowY: 'auto', background: C.bg }}>
        <div
          className="p-4 md:p-8"
          style={{
            maxWidth: 1040, margin: '0 auto', width: '100%',
            paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 68px), 68px)',
          }}
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
