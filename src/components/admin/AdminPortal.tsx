import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, FileCheck, UserCheck, ArrowLeft, Calculator, Mail, Sparkles, Shield, Inbox, Trophy,
} from 'lucide-react';
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { OpsQueue } from '@/components/admin/orders/OpsQueue';
import { TeamPerformance } from '@/components/admin/TeamPerformance';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { AccountingAdmin } from '@/components/admin/AccountingAdmin';
import { NewsletterAdmin } from '@/components/admin/NewsletterAdmin';
import { NeobankVision } from '@/components/admin/neobank/NeobankVision';
import { useUserRole } from '@/hooks/useUserRole';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

interface NavItem { id: string; label: string; desc: string; icon: any; adminOnly?: boolean }

// Ordre pensé opérations d'abord ; les sections sensibles (finance, campagnes,
// performance de l'équipe) sont réservées à l'administrateur complet.
const NAV: NavItem[] = [
  { id: 'queue',        label: "File d'attente", desc: 'Commandes à traiter — prise en charge', icon: Inbox },
  { id: 'orders',       label: 'Commandes',      desc: 'Toutes les commandes et archives',      icon: ShoppingCart },
  { id: 'kyc',          label: 'KYC',            desc: "Vérifications d'identité",              icon: FileCheck },
  { id: 'performance',  label: 'Performance',    desc: "Activité et volumes par membre de l'équipe", icon: Trophy, adminOnly: true },
  { id: 'accounting',   label: 'Comptabilité',   desc: 'Revenus et marges',                     icon: Calculator, adminOnly: true },
  { id: 'newsletter',   label: 'Campagnes',      desc: 'Emails marketing aux clients',          icon: Mail, adminOnly: true },
  { id: 'applications', label: 'Candidatures',   desc: 'Recrutement',                           icon: UserCheck, adminOnly: true },
  { id: 'neobank',      label: 'Vision',         desc: 'Néobanque Terex',                       icon: Sparkles, adminOnly: true },
];

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState('queue');
  const { isAdmin, isKYCReviewer } = useUserRole();
  const navigate = useNavigate();

  if (!isAdmin() && !isKYCReviewer()) {
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

  // Les sections sensibles n'apparaissent que pour l'administrateur complet.
  const visibleNav = NAV.filter(n => !n.adminOnly || isAdmin());
  const active = visibleNav.find(n => n.id === activeTab) ?? visibleNav[0];

  return (
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
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600 }}>{isAdmin() ? 'Admin' : 'Reviewer'}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px', width: '100%', boxSizing: 'border-box' }}>
        {/* Nav pills — défilables horizontalement */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '20px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {visibleNav.map(({ id, label, icon: Icon }) => {
            const isOn = id === activeTab;
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

        {/* Section content */}
        <div>
          {activeTab === 'queue' && <OpsQueue />}
          {activeTab === 'orders' && <OrdersDashboardNew />}
          {activeTab === 'kyc' && <KYCAdmin />}
          {activeTab === 'performance' && isAdmin() && <TeamPerformance />}
          {activeTab === 'accounting' && isAdmin() && <AccountingAdmin />}
          {activeTab === 'newsletter' && isAdmin() && <NewsletterAdmin />}
          {activeTab === 'applications' && isAdmin() && <JobApplicationsAdmin />}
          {activeTab === 'neobank' && isAdmin() && <NeobankVision />}
        </div>
      </div>
    </div>
  );
}
