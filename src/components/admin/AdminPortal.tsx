import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, FileCheck, UserCheck, ArrowLeft, Calculator, Mail, Sparkles, Shield, Inbox, Trophy, Users, Clock, BookOpen, PenTool, ChevronRight,
} from 'lucide-react';
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { OpsQueue } from '@/components/admin/orders/OpsQueue';
import { TeamPerformance } from '@/components/admin/TeamPerformance';
import { TeamAdmin } from '@/components/admin/TeamAdmin';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { StaffPunch } from '@/components/admin/StaffPunch';
import { StaffAttendance } from '@/components/admin/StaffAttendance';
import { KnowledgeBase } from '@/components/admin/KnowledgeBase';
import { ContentStudio } from '@/components/admin/ContentStudio';
import { OrdersDataProvider } from '@/components/admin/OrdersDataProvider';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { AccountingAdmin } from '@/components/admin/AccountingAdmin';
import { NewsletterAdmin } from '@/components/admin/NewsletterAdmin';
import { NeobankVision } from '@/components/admin/neobank/NeobankVision';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';

const BG = '#0f0f0f';
const CARD = '#1a1a1a';
const CARD2 = '#161616';
const BORDER = 'rgba(255,255,255,0.06)';
const BORDER_STRONG = 'rgba(255,255,255,0.12)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.35)';

interface NavItem { id: string; label: string; desc: string; icon: any; roles: string[]; group: string }

const NAV: NavItem[] = [
  // Opérations
  { id: 'queue',        label: "File d'attente", desc: 'Commandes à traiter — prise en charge', icon: Inbox,        roles: ['admin', 'operator'], group: 'Opérations' },
  { id: 'orders',       label: 'Commandes',      desc: 'Toutes les commandes et archives',      icon: ShoppingCart, roles: ['admin', 'operator'], group: 'Opérations' },
  { id: 'kyc',          label: 'KYC',            desc: "Vérifications d'identité",              icon: FileCheck,    roles: ['admin', 'kyc_reviewer'], group: 'Opérations' },
  // Équipe
  { id: 'performance',  label: 'Performance',    desc: "Activité et volumes par membre de l'équipe", icon: Trophy,  roles: ['admin'], group: 'Équipe' },
  { id: 'attendance',   label: 'Présences',      desc: 'Pointage horaire de l\'équipe — pour la paie', icon: Clock,  roles: ['admin'], group: 'Équipe' },
  { id: 'team',         label: 'Membres',        desc: "Membres et rôles du back-office",       icon: Users,        roles: ['admin'], group: 'Équipe' },
  // Marketing
  { id: 'content',      label: 'Studio',         desc: 'Générateur de contenu pour les réseaux',  icon: PenTool,      roles: ['admin', 'marketing'], group: 'Marketing' },
  { id: 'newsletter',   label: 'Campagnes',      desc: 'Emails marketing aux clients',          icon: Mail,         roles: ['admin', 'marketing'], group: 'Marketing' },
  // Finance
  { id: 'accounting',   label: 'Comptabilité',   desc: 'Revenus et marges',                     icon: Calculator,   roles: ['admin'], group: 'Finance' },
  // RH
  { id: 'applications', label: 'Candidatures',   desc: 'Recrutement',                           icon: UserCheck,    roles: ['admin', 'hr'], group: 'RH' },
  // Ressources
  { id: 'neobank',      label: 'Vision',         desc: 'Néobanque Terex',                       icon: Sparkles,     roles: ['admin'], group: 'Ressources' },
  { id: 'kb',           label: 'Guide',          desc: "Base de connaissances de l'équipe",     icon: BookOpen,     roles: ['admin', 'operator', 'kyc_reviewer', 'marketing', 'hr', 'support'], group: 'Ressources' },
];

const GROUP_ORDER = ['Opérations', 'Équipe', 'Marketing', 'Finance', 'RH', 'Ressources'];

export function AdminPortal() {
  const { isAdmin, isStaff, roles, loading: rolesLoading } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const visibleNav = NAV.filter(n => n.roles.some(r => roles.includes(r)));
  const [activeTab, setActiveTab] = useState<string>('');
  const currentTab = visibleNav.some(n => n.id === activeTab) ? activeTab : (visibleNav[0]?.id ?? '');

  if (rolesLoading) {
    return <div style={{ minHeight: '100vh', background: BG }} />;
  }

  if (!isStaff()) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '36px 28px', textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={26} color="#ef4444" />
          </div>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>Accès non autorisé</h2>
          <p style={{ color: MUTED, fontSize: '13px', margin: 0, lineHeight: 1.6 }}>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const active = visibleNav.find(n => n.id === currentTab) ?? visibleNav[0];
  const roleLabel = isAdmin() ? 'Admin' : roles.includes('operator') ? 'Opérateur' : roles.includes('marketing') ? 'Marketing' : roles.includes('hr') ? 'RH' : roles.includes('kyc_reviewer') ? 'KYC' : 'Staff';

  // Groupement par catégorie pour la sidebar desktop
  const grouped = GROUP_ORDER
    .map(g => ({ group: g, items: visibleNav.filter(n => n.group === g) }))
    .filter(g => g.items.length > 0);

  const renderSection = () => (
    <>
      {currentTab === 'queue' && <OpsQueue />}
      {currentTab === 'orders' && <OrdersDashboardNew />}
      {currentTab === 'kyc' && <KYCAdmin />}
      {currentTab === 'performance' && <TeamPerformance />}
      {currentTab === 'attendance' && <StaffAttendance />}
      {currentTab === 'accounting' && <AccountingAdmin />}
      {currentTab === 'content' && <ContentStudio />}
      {currentTab === 'newsletter' && <NewsletterAdmin />}
      {currentTab === 'applications' && <JobApplicationsAdmin />}
      {currentTab === 'team' && <TeamAdmin />}
      {currentTab === 'neobank' && <NeobankVision />}
      {currentTab === 'kb' && <KnowledgeBase />}
    </>
  );

  // ─────────────────────────────────────────────────────────
  // MOBILE : conserve la disposition compacte (pills scrollables)
  // ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <OrdersDataProvider>
        <div style={{ minHeight: '100vh', background: BG, paddingBottom: '80px' }}>
          <div style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 18px) 16px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate('/dashboard')}
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <ArrowLeft size={17} color="#fff" />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ color: '#fff', fontSize: '19px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Administration</h1>
              <p style={{ color: MUTED, fontSize: '12px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pilotez la plateforme Terex</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '999px', padding: '6px 12px', flexShrink: 0 }}>
              <Shield size={13} color={MUTED} />
              <span style={{ color: MUTED, fontSize: '11px', fontWeight: 600 }}>{roleLabel}</span>
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <StaffPunch />
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '20px', scrollbarWidth: 'none' }}>
              {visibleNav.map(({ id, label, icon: Icon }) => {
                const isOn = id === currentTab;
                return (
                  <button key={id} onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                      padding: '10px 16px', borderRadius: '12px', cursor: 'pointer',
                      background: isOn ? '#ffffff' : CARD,
                      border: `1px solid ${isOn ? '#ffffff' : BORDER}`,
                      color: isOn ? '#141414' : MUTED,
                      fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                    <Icon size={16} color={isOn ? '#141414' : MUTED} strokeWidth={2} />
                    {label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <active.icon size={19} color="#fff" strokeWidth={1.9} />
              </div>
              <div>
                <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 600, margin: 0 }}>{active.label}</h2>
                <p style={{ color: MUTED, fontSize: '12px', margin: '1px 0 0' }}>{active.desc}</p>
              </div>
            </div>
            {renderSection()}
          </div>
        </div>
      </OrdersDataProvider>
    );
  }

  // ─────────────────────────────────────────────────────────
  // DESKTOP : layout sidebar + hero + contenu premium
  // ─────────────────────────────────────────────────────────
  return (
    <OrdersDataProvider>
      <div style={{ minHeight: '100vh', background: BG, position: 'relative', overflowX: 'hidden' }}>
        {/* Texture / grille de fond très subtile */}
        <div aria-hidden style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `radial-gradient(circle at 12% 0%, rgba(255,255,255,0.04), transparent 55%),
                            radial-gradient(circle at 92% 90%, rgba(255,255,255,0.03), transparent 45%),
                            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: 'auto, auto, 42px 42px, 42px 42px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', minHeight: '100vh' }}>

          {/* SIDEBAR */}
          <aside style={{
            width: 260, flexShrink: 0, borderRight: `1px solid ${BORDER}`,
            padding: '24px 18px', background: 'rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column', gap: '18px',
            position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
          }}>
            {/* Retour + brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: `1px solid ${BORDER}` }}>
              <button onClick={() => navigate('/dashboard')}
                style={{ width: '34px', height: '34px', borderRadius: '10px', background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <ArrowLeft size={15} color="#fff" />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0, letterSpacing: '-0.2px' }}>Terex Admin</p>
                <p style={{ color: MUTED2, fontSize: '11px', margin: 0 }}>Back-office</p>
              </div>
            </div>

            {/* Rôle badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '10px' }}>
              <Shield size={13} color={MUTED} />
              <span style={{ color: MUTED, fontSize: '12px', fontWeight: 600 }}>{roleLabel}</span>
              <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
            </div>

            {/* Groupes */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {grouped.map(({ group, items }) => (
                <div key={group}>
                  <p style={{ color: MUTED2, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 6px 8px' }}>{group}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {items.map(({ id, label, icon: Icon }) => {
                      const isOn = id === currentTab;
                      return (
                        <button key={id} onClick={() => setActiveTab(id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '11px',
                            padding: '9px 12px', borderRadius: '10px', cursor: 'pointer',
                            background: isOn ? 'rgba(255,255,255,0.08)' : 'transparent',
                            border: `1px solid ${isOn ? BORDER_STRONG : 'transparent'}`,
                            color: isOn ? '#fff' : MUTED,
                            fontSize: '13px', fontWeight: isOn ? 600 : 500, textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => { if (!isOn) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
                          onMouseLeave={e => { if (!isOn) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = MUTED; } }}>
                          <Icon size={15} strokeWidth={1.9} />
                          <span style={{ flex: 1 }}>{label}</span>
                          {isOn && <ChevronRight size={13} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Version en bas */}
            <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: `1px solid ${BORDER}` }}>
              <p style={{ color: MUTED2, fontSize: '10px', margin: 0, textAlign: 'center', letterSpacing: '0.06em' }}>TEREX ADMIN · v1.0</p>
            </div>
          </aside>

          {/* MAIN */}
          <main style={{ flex: 1, minWidth: 0, padding: '32px 40px 60px' }}>
            {/* Hero */}
            <div style={{
              background: `linear-gradient(180deg, ${CARD} 0%, ${CARD2} 100%)`,
              border: `1px solid ${BORDER}`,
              borderRadius: '20px', padding: '28px 32px', marginBottom: '28px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Motif décoratif */}
              <div aria-hidden style={{
                position: 'absolute', top: -80, right: -80, width: 320, height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 65%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: ICON_BG, border: `1px solid ${BORDER_STRONG}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <active.icon size={26} color="#fff" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: MUTED2, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>{active.group}</p>
                  <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.6px' }}>{active.label}</h1>
                  <p style={{ color: MUTED, fontSize: '14px', margin: '4px 0 0', lineHeight: 1.5 }}>{active.desc}</p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <StaffPunch />
                </div>
              </div>
            </div>

            {/* Section content */}
            <div>
              {renderSection()}
            </div>
          </main>

        </div>
      </div>
    </OrdersDataProvider>
  );
}
