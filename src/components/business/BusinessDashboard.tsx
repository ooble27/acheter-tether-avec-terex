import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Send, Clock, Users2,
  Building2, LifeBuoy, LogOut, Bell,
  Plus, ArrowLeft, Menu, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessOverview } from './BusinessOverview';
import { BusinessPayments } from './BusinessPayments';
import { BusinessSuppliers } from './BusinessSuppliers';
import { BusinessHistory } from './BusinessHistory';
import { BusinessProfile } from './BusinessProfile';
import { BusinessSupport } from './BusinessSupport';

interface BusinessDashboardProps {
  user: { email: string; name: string } | null;
}

const NAV = [
  { id: 'overview',   label: 'Tableau de bord',  icon: LayoutDashboard },
  { id: 'payment',    label: 'Nouveau paiement',  icon: Send },
  { id: 'history',    label: 'Historique',        icon: Clock },
  { id: 'suppliers',  label: 'Fournisseurs',      icon: Users2 },
  { id: 'profile',    label: 'Profil entreprise', icon: Building2 },
  { id: 'support',    label: 'Support',           icon: LifeBuoy },
];

const PAGE_SUBTITLES: Record<string, string> = {
  overview:  "Vue d'ensemble de votre activité",
  payment:   'Transfert USDT vers un fournisseur',
  history:   'Toutes vos transactions',
  suppliers: 'Gérez vos contacts fournisseurs',
  profile:   'Informations de votre société',
  support:   'Aide et assistance dédiée B2B',
};

// Design tokens
const C = {
  bg: '#0e0e0e', l1: '#141414', l2: '#191919', l3: '#1f1f1f', l4: '#242424',
  bd: '#2a2a2a', bds: '#1f1f1f',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555',
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
      case 'overview':  return <BusinessOverview user={user} onNavigate={setActiveSection} />;
      case 'payment':   return <BusinessPayments user={user} onBack={() => setActiveSection('overview')} />;
      case 'history':   return <BusinessHistory user={user} />;
      case 'suppliers': return <BusinessSuppliers user={user} />;
      case 'profile':   return <BusinessProfile user={user} />;
      case 'support':   return <BusinessSupport />;
      default:          return <BusinessOverview user={user} onNavigate={setActiveSection} />;
    }
  };

  const currentPage = NAV.find(n => n.id === activeSection);

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none', fontFamily: FONT }}>
      {/* Logo area */}
      <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.teal}, ${C.tealH})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '-0.02em' }}>TB</span>
          </div>
          <div>
            <p style={{ color: C.t1, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', lineHeight: 1, margin: 0 }}>
              TEREX BUSINESS
            </p>
            <p style={{ color: C.teal, fontSize: 9, letterSpacing: '0.14em', marginTop: 3, margin: '3px 0 0' }}>
              PORTAIL B2B PRO
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 9, paddingLeft: 10, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                borderRadius: 7, border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? C.t1 : C.t3,
                background: isActive ? C.l4 : 'transparent',
                transition: 'all 0.1s',
                fontFamily: FONT,
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.t2;
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.t3;
              }}
            >
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: `1px solid ${C.bds}`, padding: '12px 8px 8px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontSize: 11, color: C.t3, background: 'transparent',
            fontFamily: FONT, marginBottom: 6,
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
        width: 220, minWidth: 220,
        background: C.l1,
        borderRight: `1px solid ${C.bds}`,
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
            position: 'relative', zIndex: 10, width: 220,
            background: C.l1, borderRight: `1px solid ${C.bds}`,
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
        {/* Header */}
        <header style={{
          height: 56, background: C.l1,
          borderBottom: `1px solid ${C.bds}`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{
                width: 32, height: 32, borderRadius: 7,
                background: 'transparent', border: `1px solid ${C.bd}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.t3, cursor: 'pointer',
              }}
            >
              <Menu style={{ width: 16, height: 16 }} />
            </button>
            <div>
              <h1 style={{
                color: C.t1, fontSize: 14, fontWeight: 600,
                letterSpacing: '-0.01em', lineHeight: 1.2,
                fontFamily: FONT, margin: 0,
              }}>
                {currentPage?.label || 'Tableau de bord'}
              </h1>
              <p style={{ color: C.t3, fontSize: 11, marginTop: 1, fontFamily: FONT, margin: '1px 0 0' }}>
                {PAGE_SUBTITLES[activeSection] || ''}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setActiveSection('payment')}
              className="hidden sm:flex"
              style={{
                height: 32, paddingLeft: 12, paddingRight: 12,
                background: C.teal, border: 'none', borderRadius: 7,
                color: '#fff', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: FONT,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
              onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
            >
              <Plus style={{ width: 13, height: 13 }} />
              Nouveau paiement
            </button>

            {/* Vertical divider */}
            <div style={{ width: 1, height: 20, background: C.bds }} className="hidden sm:block" />

            <button
              style={{
                width: 32, height: 32, borderRadius: 7,
                background: 'transparent', border: `1px solid ${C.bds}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.t3, cursor: 'pointer', position: 'relative',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}
            >
              <Bell style={{ width: 15, height: 15 }} />
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 6, height: 6, borderRadius: '50%',
                background: '#ef4444',
              }} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
          <div style={{ padding: '20px 24px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
            {renderContent()}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden" style={{
          height: 56, background: C.l1, borderTop: `1px solid ${C.bds}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          flexShrink: 0,
        }}>
          {NAV.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  padding: '6px 8px', borderRadius: 7, border: 'none', background: 'transparent',
                  color: isActive ? C.teal : C.t3, cursor: 'pointer',
                }}
              >
                <Icon style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400, fontFamily: FONT }}>
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
