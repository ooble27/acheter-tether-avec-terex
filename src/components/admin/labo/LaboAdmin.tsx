import { useState } from 'react';
import { ArrowLeft, Receipt, ChevronRight } from 'lucide-react';
import { BillPaymentLab } from './BillPaymentLab';

/**
 * Labo — zone d'expérimentation admin-only, isolée de la plateforme
 * de production. Chaque idée de nouvelle fonctionnalité (vision produit)
 * obtient sa propre page ici, testable sans impact sur les commandes
 * réelles ni les fonds des clients, avant toute intégration définitive.
 */

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

interface Experiment {
  id: string;
  label: string;
  desc: string;
  icon: any;
  status: 'draft' | 'testing';
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'bill_payment',
    label: 'Paiement de factures en USDT',
    desc: 'Senelec, Woyofal, SDE, Canal+, crédit téléphone — réglé en stablecoin, payé en CFA côté fournisseur.',
    icon: Receipt,
    status: 'testing',
  },
];

export function LaboAdmin() {
  const [active, setActive] = useState<string | null>(null);

  if (active === 'bill_payment') {
    return (
      <div>
        <button
          onClick={() => setActive(null)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: CARD, color: '#fff',
            border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', marginBottom: 16,
          }}
        >
          <ArrowLeft size={15} /> Retour au labo
        </button>
        <BillPaymentLab />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {EXPERIMENTS.map(({ id, label, desc, icon: Icon, status }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%',
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 16, cursor: 'pointer',
          }}
        >
          <div style={{ width: 42, height: 42, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={19} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{label}</p>
              <span style={{
                fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                background: status === 'testing' ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.06)',
                color: status === 'testing' ? '#f97316' : '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {status === 'testing' ? 'En test' : 'Brouillon'}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, margin: '3px 0 0', lineHeight: 1.5 }}>{desc}</p>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
}
