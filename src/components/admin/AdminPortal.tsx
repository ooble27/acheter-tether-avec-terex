import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, FileCheck, UserCheck, ArrowLeft, Calculator, Mail, Sparkles, Shield, Inbox,
} from 'lucide-react';
import { OrdersDashboardNew } from '@/components/admin/orders/OrdersDashboardNew';
import { OpsQueue } from '@/components/admin/orders/OpsQueue';
import { KYCAdmin } from '@/components/admin/KYCAdmin';
import { JobApplicationsAdmin } from '@/components/admin/JobApplicationsAdmin';
import { AccountingAdmin } from '@/components/admin/AccountingAdmin';
import { NewsletterAdmin } from '@/components/admin/NewsletterAdmin';
import { NeobankVision } from '@/components/admin/neobank/NeobankVision';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

interface NavItem { id: string; label: string; desc: string; icon: any }
interface NavGroup { title: string; items: NavItem[] }

// Organisation CRM : les sections sont groupées par métier,
// comme sur les back-offices des grandes plateformes.
const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Opérations',
    items: [
      { id: 'queue',  label: "File d'attente", desc: 'Commandes à traiter — prise en charge', icon: Inbox },
      { id: 'orders', label: 'Commandes',      desc: 'Toutes les commandes et archives',      icon: ShoppingCart },
    ],
  },
  {
    title: 'Conformité',
    items: [
      { id: 'kyc', label: 'KYC', desc: "Vérifications d'identité", icon: FileCheck },
    ],
  },
  {
    title: 'Finance',
    items: [
      { id: 'accounting', label: 'Comptabilité', desc: 'Revenus et marges', icon: Calculator },
    ],
  },
  {
    title: 'Croissance',
    items: [
      { id: 'newsletter',   label: 'Campagnes',    desc: 'Emails marketing aux clients', icon: Mail },
      { id: 'applications', label: 'Candidatures', desc: 'Recrutement',                  icon: UserCheck },
    ],
  },
  {
    title: 'Stratégie',
    items: [
      { id: 'neobank', label: 'Vision', desc: 'Néobanque Terex', icon: Sparkles },
    ],
  },
];

const ALL_ITEMS: NavItem[] = NAV_GROUPS.flatMap(g => g.items);

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState('queue');
  const { isAdmin, isKYCReviewer } = useUserRole();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [operatorName, setOperatorName] = useState('');

  // Nom de l'opérateur connecté — affiché dans la barre latérale (qui suis-je ?)
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      setOperatorName((data as any)?.full_name || user.email?.split('@')[0] || '');
    })();
  }, [user?.id, user?.email]);

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

  const active = ALL_ITEMS.find(n => n.id === activeTab) ?? ALL_ITEMS[0];

  const content = (
    <>
      {activeTab === 'queue' && <OpsQueue />}
      {activeTab === 'orders' && <OrdersDashboardNew />}
      {activeTab === 'accounting' && <AccountingAdmin />}
      {activeTab === 'kyc' && <KYCAdmin />}
      {activeTab === 'applications' && <JobApplicationsAdmin />}
      {activeTab === 'newsletter' && <NewsletterAdmin />}
      {activeTab === 'neobank' && <NeobankVision />}
    </>
  );

  return (
    <div style={{ minHeight: '100vh', background: BG, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <style>{`
        .adm-sidebar { display: none; }
        .adm-pills { display: flex; }
        .adm-back-mobile { display: flex; }
        @media (min-width: 1024px) {
          .adm-sidebar { display: flex; }
          .adm-pills { display: none !important; }
          .adm-back-mobile { display: none !important; }
          .adm-main { margin-left: 248px; }
        }
      `}</style>

      {/* ── BARRE LATÉRALE (desktop) — organisation CRM par métier ── */}
      <aside className="adm-sidebar" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 248, zIndex: 40,
        background: '#161616', borderRight: `1px solid ${BORDER}`,
        flexDirection: 'column',
      }}>
        {/* Marque */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 18px 14px', borderBottom: `1px solid ${BORDER}` }}>
          <img src="/terex-logo.png" alt="Terex" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <div>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Terex Ops</p>
            <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>Back-office</p>
          </div>
        </div>

        {/* Navigation groupée */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.title} style={{ marginBottom: 16 }}>
              <p style={{ color: '#4b5563', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 10px' }}>{group.title}</p>
              {group.items.map(({ id, label, icon: Icon }) => {
                const isOn = id === activeTab;
                return (
                  <button key={id} onClick={() => setActiveTab(id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 10, cursor: 'pointer', marginBottom: 2,
                      background: isOn ? 'rgba(255,255,255,0.08)' : 'transparent',
                      border: `1px solid ${isOn ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                      color: isOn ? '#fff' : '#9ca3af', fontSize: 13.5, fontWeight: isOn ? 600 : 500,
                      textAlign: 'left', transition: 'all 0.15s ease',
                    }}>
                    <Icon size={16} color={isOn ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth={1.9} />
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Opérateur connecté + retour */}
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2d2d2d', border: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {(operatorName || 'A').slice(0, 1).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{operatorName || '…'}</p>
              <p style={{ color: '#6b7280', fontSize: 10.5, margin: 0 }}>{isAdmin() ? 'Administrateur' : 'Vérificateur KYC'}</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#2d2d2d', color: '#9ca3af', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
            <ArrowLeft size={13} /> Quitter le back-office
          </button>
        </div>
      </aside>

      {/* ── CONTENU ── */}
      <div className="adm-main" style={{ paddingBottom: 80 }}>
        {/* Top bar */}
        <div style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 18px) 16px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={() => navigate('/dashboard')} className="adm-back-mobile"
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: ICON_BG, border: `1px solid ${BORDER}`, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={17} color="#fff" />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ color: '#fff', fontSize: '19px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>{active.label}</h1>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{active.desc}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '999px', padding: '6px 12px', flexShrink: 0 }}>
            <Shield size={13} color="rgba(255,255,255,0.6)" />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600 }}>{isAdmin() ? 'Admin' : 'Reviewer'}</span>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px', width: '100%', boxSizing: 'border-box' }}>
          {/* Nav pills — mobile/tablette uniquement */}
          <div className="adm-pills" style={{ gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '20px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {ALL_ITEMS.map(({ id, label, icon: Icon }) => {
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

          {/* Section content */}
          <div>{content}</div>
        </div>
      </div>
    </div>
  );
}
