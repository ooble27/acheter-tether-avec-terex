import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, FileCheck, UserCheck, ArrowLeft, Calculator, Mail, Sparkles, Shield, Inbox, Trophy, Users, Clock, BookOpen,
} from 'lucide-react';
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { OpsQueue } from '@/components/admin/orders/OpsQueue';
import { TeamPerformance } from '@/components/admin/TeamPerformance';
import { TeamAdmin } from '@/components/admin/TeamAdmin';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { StaffPunch } from '@/components/admin/StaffPunch';
import { StaffAttendance } from '@/components/admin/StaffAttendance';
import { KnowledgeBase } from '@/components/admin/KnowledgeBase';
import { OrdersDataProvider } from '@/components/admin/OrdersDataProvider';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { AccountingAdmin } from '@/components/admin/AccountingAdmin';
import { NewsletterAdmin } from '@/components/admin/NewsletterAdmin';
import { NeobankVision } from '@/components/admin/neobank/NeobankVision';
import { useUserRole } from '@/hooks/useUserRole';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

interface NavItem { id: string; label: string; desc: string; icon: any; roles: string[] }

// Accès PAR MÉTIER : chaque onglet liste les rôles qui le voient.
// L'admin complet (owner) voit tout ; un opérateur ne voit que les opérations ;
// le marketing ne voit que les campagnes ; la RH que les candidatures, etc.
const NAV: NavItem[] = [
  { id: 'queue',        label: "File d'attente", desc: 'Commandes à traiter — prise en charge', icon: Inbox,        roles: ['admin', 'operator'] },
  { id: 'orders',       label: 'Commandes',      desc: 'Toutes les commandes et archives',      icon: ShoppingCart, roles: ['admin', 'operator'] },
  { id: 'kyc',          label: 'KYC',            desc: "Vérifications d'identité",              icon: FileCheck,    roles: ['admin', 'kyc_reviewer'] },
  { id: 'performance',  label: 'Performance',    desc: "Activité et volumes par membre de l'équipe", icon: Trophy,  roles: ['admin'] },
  { id: 'attendance',   label: 'Présences',      desc: 'Pointage horaire de l\'équipe — pour la paie', icon: Clock,  roles: ['admin'] },
  { id: 'accounting',   label: 'Comptabilité',   desc: 'Revenus et marges',                     icon: Calculator,   roles: ['admin'] },
  { id: 'newsletter',   label: 'Campagnes',      desc: 'Emails marketing aux clients',          icon: Mail,         roles: ['admin', 'marketing'] },
  { id: 'applications', label: 'Candidatures',   desc: 'Recrutement',                           icon: UserCheck,    roles: ['admin', 'hr'] },
  { id: 'team',         label: 'Équipe',         desc: "Membres et rôles du back-office",       icon: Users,        roles: ['admin'] },
  { id: 'neobank',      label: 'Vision',         desc: 'Néobanque Terex',                       icon: Sparkles,     roles: ['admin'] },
  { id: 'kb',           label: 'Guide',          desc: "Base de connaissances de l'équipe",     icon: BookOpen,     roles: ['admin', 'operator', 'kyc_reviewer', 'marketing', 'hr', 'support'] },
];

export function AdminPortal() {
  const { isAdmin, isStaff, roles, loading: rolesLoading } = useUserRole();
  const navigate = useNavigate();

  // Onglets visibles selon MES rôles
  const visibleNav = NAV.filter(n => n.roles.some(r => roles.includes(r)));
  const [activeTab, setActiveTab] = useState<string>('');
  const currentTab = visibleNav.some(n => n.id === activeTab) ? activeTab : (visibleNav[0]?.id ?? '');

  // Tant que les rôles se chargent, on n'affiche RIEN (fond neutre) — surtout
  // pas « Accès non autorisé », qui provoquait le flash rouge avant l'arrivée
  // des permissions. Le message n'apparaît que si, une fois chargé, l'utilisateur
  // n'est réellement pas membre du staff.
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
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const active = visibleNav.find(n => n.id === currentTab) ?? visibleNav[0];

  return (
    <OrdersDataProvider>
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: '80px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 18px) 16px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')}
          style={{ width: '38px', height: '38px', borderRadius: '50%', background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={17} color="#fff" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ color: '#fff', fontSize: '19px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Administration</h1>
          <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pilotez la plateforme Terex</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '999px', padding: '6px 12px', flexShrink: 0 }}>
          <Shield size={13} color="rgba(255,255,255,0.6)" />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600 }}>{isAdmin() ? 'Admin' : roles.includes('operator') ? 'Opérateur' : roles.includes('marketing') ? 'Marketing' : roles.includes('hr') ? 'RH' : roles.includes('kyc_reviewer') ? 'KYC' : 'Staff'}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px', width: '100%', boxSizing: 'border-box' }}>
        {/* Pointage — barre dédiée, pleine largeur (ne surcharge plus l'en-tête mobile) */}
        <StaffPunch />

        {/* Nav pills — défilables horizontalement */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '20px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {visibleNav.map(({ id, label, icon: Icon }) => {
            const isOn = id === currentTab;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                  padding: '10px 16px', borderRadius: '12px', cursor: 'pointer',
                  background: isOn ? '#ffffff' : CARD,
                  border: `1px solid ${isOn ? '#ffffff' : BORDER}`,
                  color: isOn ? '#141414' : '#9ca3af',
                  fontSize: '13px', fontWeight: 600, transition: 'all 0.15s ease', whiteSpace: 'nowrap',
                }}>
                <Icon size={16} color={isOn ? '#141414' : 'rgba(255,255,255,0.6)'} strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Section title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <active.icon size={19} color="rgba(255,255,255,0.85)" strokeWidth={1.9} />
          </div>
          <div>
            <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 600, margin: 0 }}>{active.label}</h2>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '1px 0 0' }}>{active.desc}</p>
          </div>
        </div>

        {/* Section content — sécurisé : seul un onglet autorisé peut être actif.
            Données partagées (OrdersDataProvider) → changement d'onglet instantané. */}
        <div>
          {currentTab === 'queue' && <OpsQueue />}
          {currentTab === 'orders' && <OrdersDashboardNew />}
          {currentTab === 'kyc' && <KYCAdmin />}
          {currentTab === 'performance' && <TeamPerformance />}
          {currentTab === 'attendance' && <StaffAttendance />}
          {currentTab === 'accounting' && <AccountingAdmin />}
          {currentTab === 'newsletter' && <NewsletterAdmin />}
          {currentTab === 'applications' && <JobApplicationsAdmin />}
          {currentTab === 'team' && <TeamAdmin />}
          {currentTab === 'neobank' && <NeobankVision />}
          {currentTab === 'kb' && <KnowledgeBase />}
        </div>
      </div>
    </div>
    </OrdersDataProvider>
  );
}
