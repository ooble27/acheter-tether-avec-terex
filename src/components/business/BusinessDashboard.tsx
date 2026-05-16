import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Send, Clock, Users2,
  Building2, LifeBuoy, LogOut,
  ArrowLeft, Menu, X,
  Wallet, CalendarClock, BarChart2, UserCog, ShieldCheck, Code2
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
import { BusinessAPI } from './BusinessAPI';

interface BusinessDashboardProps {
  user: { id?: string; email: string; name: string } | null;
}

const NAV_SECTIONS = [
  {
    label: 'PRINCIPAL',
    items: [
      { id: 'overview',   label: 'Vue d\'ensemble',    icon: LayoutDashboard },
      { id: 'payment',    label: 'Paiements',           icon: Send },
      { id: 'treasury',   label: 'Trésorerie',          icon: Wallet },
    ],
  },
  {
    label: 'GESTION',
    items: [
      { id: 'history',    label: 'Historique & Reçus',  icon: Clock },
      { id: 'suppliers',  label: 'Fournisseurs',        icon: Users2 },
      { id: 'batch',      label: 'Lots & Planification',icon: CalendarClock },
    ],
  },
  {
    label: 'BUSINESS',
    items: [
      { id: 'analytics',  label: 'Analytique',          icon: BarChart2 },
      { id: 'team',       label: 'Équipe & Accès',      icon: UserCog },
      { id: 'compliance', label: 'Conformité KYC',      icon: ShieldCheck },
    ],
  },
  {
    label: 'PARAMÈTRES',
    items: [
      { id: 'profile',    label: 'Profil entreprise',   icon: Building2 },
      { id: 'api',        label: 'Intégrations & API',  icon: Code2 },
      { id: 'support',    label: 'Support',             icon: LifeBuoy },
    ],
  },
];

// Flat list for lookups
const NAV_ALL = NAV_SECTIONS.flatMap(s => s.items);

const PAGE_SUBTITLES: Record<string, string> = {
  overview:   "Vue d'ensemble de votre activité",
  payment:    'Transfert USDT vers un fournisseur',
  treasury:   'Gestion de vos wallets et taux',
  history:    'Toutes vos transactions et reçus',
  suppliers:  'Gérez vos contacts fournisseurs',
  batch:      'Paiements groupés et programmés',
  analytics:  'Performances et insights',
  team:       'Gestion des membres et permissions',
  compliance: 'Documents KYC et conformité',
  profile:    'Informations de votre société',
  api:        'Clés API et webhooks',
  support:    'Aide et assistance dédiée B2B',
};

// Design tokens
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868',
};
const FONT = "'Inter', sans-serif";

function InitialAvatar({ name, size = 26 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: 8,
        background: 'rgba(59,150,143,0.22)',
        color: C.teal,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 600,
        flexShrink: 0,
        fontFamily: FONT,
      }}
    >
      {initials}
    </div>
  );
}

// Placeholder for pages not yet implemented
function ComingSoon({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 320, color: C.t3, fontFamily: FONT, textAlign: 'center',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: C.l2, border: `1px solid ${C.bds}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 20 }}>🔧</span>
      </div>
      <p style={{ color: C.t2, fontSize: 14, fontWeight: 500, margin: '0 0 6px' }}>{title}</p>
      <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Cette section sera disponible prochainement.</p>
    </div>
  );
}

export function BusinessDashboard({ user }: BusinessDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      case 'api':         return <BusinessAPI user={user} />;
      case 'support':     return <BusinessSupport />;
      default:            return <BusinessOverview user={user} onNavigate={setActiveSection} />;
    }
  };

  const currentPage = NAV_ALL.find(n => n.id === activeSection);

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none', fontFamily: FONT }}>
      {/* Logo area */}
      <div style={{ padding: '20px', borderBottom: `1px solid #2a2a2a` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.teal}, ${C.tealH})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '-0.02em' }}>TB</span>
          </div>
          <div>
            <p style={{ color: C.t1, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1.2, margin: 0 }}>
              Terex Business
            </p>
            <span style={{
              display: 'inline-block',
              fontSize: 9, fontWeight: 600, letterSpacing: '0.10em',
              color: C.teal, background: 'rgba(59,150,143,0.12)',
              border: '1px solid rgba(59,150,143,0.25)',
              borderRadius: 4, padding: '1px 5px', marginTop: 3,
              textTransform: 'uppercase',
            }}>
              Portail B2B
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 0 8px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.label}>
            {/* Section label */}
            <p style={{
              color: '#686868',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: 2,
              marginTop: sIdx === 0 ? 12 : 20,
              paddingLeft: 16,
            }}>
              {section.label}
            </p>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: 9, paddingLeft: 13, paddingRight: 12, height: 36,
                      borderRadius: 0, border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontSize: 13,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? '#f0f0f0' : '#686868',
                      background: isActive ? 'rgba(59,150,143,0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid #3B968F' : '3px solid transparent',
                      transition: 'background 0.1s, color 0.1s',
                      fontFamily: FONT,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    <Icon style={{ width: 14, height: 14, flexShrink: 0, color: isActive ? C.teal : '#686868' }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: `1px solid #2a2a2a`, padding: '12px 0 8px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 0, border: 'none', cursor: 'pointer',
            fontSize: 11, color: C.t3, background: 'transparent',
            fontFamily: FONT, marginBottom: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = C.t2)}
          onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
        >
          <ArrowLeft style={{ width: 12, height: 12 }} />
          Espace personnel
        </button>

        {/* User chip */}
        <div style={{
          background: C.l2, border: `1px solid ${C.bds}`,
          borderRadius: 8, padding: '7px 10px',
          display: 'flex', alignItems: 'center', gap: 8,
          margin: '0 10px',
        }}>
          <InitialAvatar name={user?.name || 'U'} size={26} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: C.t1, fontSize: 12, fontWeight: 500, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
              {user?.name || 'Utilisateur'}
            </p>
            <p style={{ color: C.t3, fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 0, display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
          >
            <LogOut style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        display: 'none',
        width: 240, minWidth: 240,
        background: '#111111',
        borderRight: `1px solid #2a2a2a`,
        boxShadow: '2px 0 8px rgba(0,0,0,0.4)',
        flexShrink: 0,
        flexDirection: 'column',
      }} className="md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside style={{
            position: 'relative', zIndex: 10, width: 240,
            background: '#111111', borderRight: `1px solid #2a2a2a`,
            boxShadow: '2px 0 8px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column',
          }}>
            <SidebarContent />
          </aside>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 10,
              background: C.l3, border: `1px solid ${C.bd}`,
              borderRadius: 8, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.t2, cursor: 'pointer',
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Mobile top header bar — sticky, only on mobile */}
        <div
          className="md:hidden"
          style={{
            height: 52, background: '#111111',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center',
            paddingLeft: 12, paddingRight: 12,
            gap: 12, flexShrink: 0,
            position: 'sticky', top: 0, zIndex: 20,
          }}
        >
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'transparent', border: `1px solid #2a2a2a`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.t2, cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Menu style={{ width: 16, height: 16 }} />
          </button>

          {/* Page title */}
          <span style={{
            flex: 1, textAlign: 'center',
            fontSize: 14, fontWeight: 600, color: C.t1, fontFamily: FONT,
          }}>
            {currentPage?.label || 'Vue d\'ensemble'}
          </span>

          {/* User avatar initial */}
          <InitialAvatar name={user?.name || 'U'} size={30} />
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', background: C.bg, position: 'relative' }}>
          <div className="p-4 md:p-8" style={{ maxWidth: 1040, margin: '0 auto', width: '100%' }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Suppress unused warning
void PAGE_SUBTITLES;
void ComingSoon;
