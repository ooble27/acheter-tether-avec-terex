import { useState, useEffect } from 'react';
import { Search, Download, X, Copy, Check, ExternalLink, FileText, Calendar, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import usdtLogo from '@/assets/usdt-logo.png';

interface Props { user: { email: string; name: string } | null; }

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868', t4: '#333333',
  amber: '#f59e0b', em: '#22c55e', blue: '#3b82f6', red: '#ef4444',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

const NET_LOGOS: Record<string, string> = {
  TRC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  POLYGON: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: 'En attente', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)' },
  processing: { label: 'En cours',   color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.22)' },
  completed:  { label: 'Complété',   color: '#22c55e', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.22)'  },
  failed:     { label: 'Échoué',     color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.22)'  },
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', processing: 'En cours', completed: 'Complété', failed: 'Échoué',
};

const DEMO_PAYMENTS = [
  {
    id: 'TRX-SHZ001', reference: 'TRX-SHZ001', amount: 8500, fee: 212.5, total: 8712.5,
    network: 'TRC20', supplierName: 'Shenzhen Electronics Co.', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7',
    note: 'Facture #2025-089 — Lot composants Q1', status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: 'facture_089.pdf', recurrence: null, scheduled: false,
  },
  {
    id: 'TRX-LAG002', reference: 'TRX-LAG002', amount: 3200, fee: 80, total: 3280,
    network: 'BEP20', supplierName: 'Lagos Imports Ltd', wallet: '0xd3e8b4f6c2a1f9e5c7b0a3d2e1f8c4b6a5d9e2f7',
    note: 'Acompte contrat textile mars', status: 'processing',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), invoiceFile: null, recurrence: 'Mensuel', scheduled: false,
  },
  {
    id: 'TRX-DUB003', reference: 'TRX-DUB003', amount: 15000, fee: 375, total: 15375,
    network: 'TRC20', supplierName: 'Dubai Trade Co.', wallet: '0x9a4f2c3b1e6d7a8f5c2b4e1d9f3a6c7b2e8d5f1',
    note: 'Règlement définitif commande #DTC-2025-11', status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), invoiceFile: 'facture_dtc_2025_11.pdf', recurrence: null, scheduled: false,
  },
  {
    id: 'TRX-TUR004', reference: 'TRX-TUR004', amount: 2100, fee: 52.5, total: 2152.5,
    network: 'ERC20', supplierName: 'Istanbul Fabrics', wallet: '0xf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    note: 'Paiement tissu synthétique', status: 'failed',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: null, recurrence: null, scheduled: false,
  },
  {
    id: 'TRX-SHZ005', reference: 'TRX-SHZ005', amount: 4750, fee: 118.75, total: 4868.75,
    network: 'TRC20', supplierName: 'Shenzhen Electronics Co.', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7',
    note: 'Composants PCB — Facture #2025-077', status: 'completed',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: 'facture_077.pdf', recurrence: null, scheduled: false,
  },
  {
    id: 'TRX-IND006', reference: 'TRX-IND006', amount: 6300, fee: 157.5, total: 6457.5,
    network: 'BEP20', supplierName: 'Mumbai Textiles Pvt Ltd', wallet: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    note: 'Commande coton bio BIO-2025-03', status: 'completed',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: 'facture_bio_03.pdf', recurrence: null, scheduled: false,
  },
];

function getDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const txDay = new Date(d); txDay.setHours(0, 0, 0, 0);
  if (txDay.getTime() === today.getTime()) return "Aujourd'hui";
  if (txDay.getTime() === yesterday.getTime()) return 'Hier';
  if (d >= weekAgo) return 'Cette semaine';
  return 'Ce mois';
}

function groupByDate(items: any[]): { label: string; items: any[] }[] {
  const buckets: Record<string, any[]> = {};
  for (const p of items) {
    const label = getDateLabel(p.createdAt);
    if (!buckets[label]) buckets[label] = [];
    buckets[label].push(p);
  }
  return ["Aujourd'hui", 'Hier', 'Cette semaine', 'Ce mois']
    .filter(l => buckets[l])
    .map(l => ({ label: l, items: buckets[l] }));
}

function HeroSvg() {
  const rows = [
    { color: '#22c55e', w1: 36, w2: 22 },
    { color: '#3b82f6', w1: 28, w2: 18 },
    { color: '#22c55e', w1: 40, w2: 24 },
    { color: '#f59e0b', w1: 22, w2: 14 },
  ];
  return (
    <svg width="148" height="106" viewBox="0 0 148 106" fill="none">
      <ellipse cx="74" cy="53" rx="54" ry="40" fill="rgba(59,150,143,0.05)" />
      <rect x="16" y="8" width="116" height="90" rx="14" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      {/* Card header bar */}
      <rect x="26" y="17" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />
      <rect x="26" y="17" width="20" height="5" rx="2.5" fill="rgba(255,255,255,0.10)" />
      <rect x="110" y="16" width="14" height="7" rx="3.5" fill="rgba(59,150,143,0.40)" />
      <line x1="16" y1="29" x2="132" y2="29" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      {rows.map((row, i) => (
        <g key={i}>
          <circle cx="32" cy={43 + i * 17} r="7" fill={`${row.color}18`} stroke={`${row.color}35`} strokeWidth="1" />
          <circle cx="32" cy={43 + i * 17} r="3" fill={`${row.color}90`} />
          <rect x="45" y={39 + i * 17} width={row.w1} height="4" rx="2" fill="rgba(255,255,255,0.10)" />
          <rect x="45" y={45 + i * 17} width={row.w2} height="3" rx="1.5" fill="rgba(255,255,255,0.05)" />
          <rect x="96" y={39 + i * 17} width="22" height="4" rx="2" fill="rgba(255,255,255,0.07)" />
          <circle cx="124" cy={41 + i * 17} r="4" fill={`${row.color}55`} />
          {i < 3 && <line x1="26" y1={34 + i * 17} x2="128" y2={34 + i * 17} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />}
        </g>
      ))}
    </svg>
  );
}

function EmptyStateSvg() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="32" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="22" y="18" width="28" height="36" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <rect x="28" y="25" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
      <rect x="28" y="31" width="11" height="3" rx="1.5" fill="rgba(255,255,255,0.07)" />
      <rect x="28" y="37" width="13" height="3" rx="1.5" fill="rgba(255,255,255,0.07)" />
      <rect x="28" y="43" width="9" height="3" rx="1.5" fill="rgba(255,255,255,0.07)" />
      <circle cx="50" cy="50" r="9" fill="#1a1a1a" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <path d="M46 50 L50 54 L56 46" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] || { label: status, color: C.t3, bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
      fontFamily: FONT, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? C.em : C.t3, padding: '2px 4px', display: 'inline-flex', alignItems: 'center', borderRadius: 4, transition: 'color 0.15s' }}
      onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = C.t1; }}
      onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}
    >
      {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
    </button>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${C.bds}` }}>
      <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT, flexShrink: 0, marginRight: 12 }}>{label}</span>
      <span style={{ fontSize: 12, color: C.t1, fontFamily: FONT, textAlign: 'right', wordBreak: 'break-all' }}>{children}</span>
    </div>
  );
}

function TransactionDrawer({ tx, onClose }: { tx: any; onClose: () => void }) {
  const xofAmount = tx.amount * 620.5;
  const eurAmount = tx.amount * 0.9245;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, background: '#141414', borderLeft: `1px solid ${C.bds}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, background: '#141414', zIndex: 2 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, fontFamily: FONT }}>{tx.supplierName}</div>
            <div style={{ fontSize: 11, color: C.t3, fontFamily: MONO, marginTop: 2 }}>{tx.reference}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: C.l3, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.t2, cursor: 'pointer' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div style={{ padding: '28px 24px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={usdtLogo} alt="USDT" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            <span style={{ fontSize: 32, fontWeight: 700, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em' }}>{tx.amount.toLocaleString('fr-FR')}</span>
            <span style={{ fontSize: 16, color: C.t3, fontWeight: 500 }}>USDT</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: C.t3, fontFamily: MONO }}>≈ {xofAmount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XOF</span>
            <span style={{ fontSize: 12, color: C.t3 }}>·</span>
            <span style={{ fontSize: 12, color: C.t3, fontFamily: MONO }}>≈ {eurAmount.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} EUR</span>
          </div>
          <div style={{ marginTop: 4 }}><StatusBadge status={tx.status} /></div>
        </div>
        <div style={{ padding: '0 24px', flex: 1 }}>
          <DetailRow label="Réseau">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {NET_LOGOS[tx.network] && <img src={NET_LOGOS[tx.network]} alt={tx.network} style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />}
              <span style={{ color: C.t2 }}>{tx.network}</span>
            </span>
          </DetailRow>
          <DetailRow label="Wallet destinataire">
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.t2 }}>
              {tx.wallet ? `${tx.wallet.slice(0, 12)}...${tx.wallet.slice(-6)}` : '—'}
              {tx.wallet && <CopyBtn text={tx.wallet} />}
            </span>
          </DetailRow>
          <DetailRow label="Frais (2.5%)"><span style={{ fontFamily: MONO }}>{(tx.fee || tx.amount * 0.025).toFixed(2)} USDT</span></DetailRow>
          <DetailRow label="Total prélevé"><span style={{ fontFamily: MONO, color: C.teal, fontWeight: 600 }}>{(tx.total || tx.amount * 1.025).toFixed(2)} USDT</span></DetailRow>
          <DetailRow label="Date"><span>{new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></DetailRow>
          {tx.note && <DetailRow label="Note"><span style={{ color: C.t2 }}>{tx.note}</span></DetailRow>}
          {tx.recurrence && (
            <DetailRow label="Récurrence">
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <RefreshCw style={{ width: 11, height: 11, color: C.teal }} />
                <span style={{ color: C.teal }}>{tx.recurrence}</span>
              </span>
            </DetailRow>
          )}
          {tx.scheduled && (
            <DetailRow label="Planifié">
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar style={{ width: 11, height: 11, color: C.amber }} />
                <span style={{ color: C.amber }}>Oui</span>
              </span>
            </DetailRow>
          )}
        </div>
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.bds}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          {tx.invoiceFile && (
            <button style={{ flex: 1, height: 36, borderRadius: 8, fontSize: 12, fontWeight: 500, background: C.l2, border: `1px solid ${C.bds}`, color: C.t2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: FONT }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t1; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t2; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; }}>
              <FileText style={{ width: 13, height: 13 }} /> {tx.invoiceFile}
            </button>
          )}
          <button style={{ flex: 1, height: 36, borderRadius: 8, fontSize: 12, fontWeight: 500, background: C.tealT, border: `1px solid ${C.tealB}`, color: C.teal, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: FONT }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,150,143,0.14)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.tealT; }}>
            <ExternalLink style={{ width: 13, height: 13 }} /> Blockchain
          </button>
        </div>
      </div>
    </div>
  );
}

function TxRow({ tx, onClick, isLast }: { tx: any; onClick: () => void; isLast: boolean }) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: isLast ? 'none' : `1px solid ${C.bds}`, cursor: 'pointer', transition: 'background 0.1s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Network logo */}
      <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {NET_LOGOS[tx.network]
          ? <img src={NET_LOGOS[tx.network]} alt={tx.network} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          : <span style={{ fontSize: 10, color: C.t3 }}>{tx.network?.slice(0, 3)}</span>
        }
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.supplierName}
        </p>
        <p style={{ fontSize: 11, color: C.t3, margin: '3px 0 0', fontFamily: MONO }}>
          {tx.reference} · {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </p>
      </div>
      {/* Amount + Status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <img src={usdtLogo} alt="USDT" style={{ width: 14, height: 14, borderRadius: '50%' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>
            {(tx.amount || 0).toLocaleString('fr-FR')}
          </span>
        </div>
        <StatusBadge status={tx.status} />
      </div>
    </div>
  );
}

const STATUS_FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'completed', label: 'Complétés' },
  { value: 'failed', label: 'Échoués' },
];

const PERIOD_FILTERS = [
  { value: '7j', label: '7 jours' },
  { value: '30j', label: '30 jours' },
  { value: 'tout', label: 'Tout' },
];

export function BusinessHistory({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = `terex_b2b_${userId}_payments`;

  const [rawPayments, setRawPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('tout');
  const [selectedTx, setSelectedTx] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      setRawPayments(stored);
    } catch {}
  }, [userId]);

  const payments = rawPayments.length > 0 ? rawPayments : DEMO_PAYMENTS;
  const isDemo = rawPayments.length === 0;

  const filtered = payments
    .filter(p => {
      if (periodFilter === '7j') return new Date(p.createdAt) >= new Date(Date.now() - 7 * 86400000);
      if (periodFilter === '30j') return new Date(p.createdAt) >= new Date(Date.now() - 30 * 86400000);
      return true;
    })
    .filter(p => !statusFilter || p.status === statusFilter)
    .filter(p =>
      !search ||
      (p.supplierName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.reference || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.note || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const groups = groupByDate(filtered);

  const exportCSV = () => {
    const csv = [
      ['Référence', 'Date', 'Fournisseur', 'Réseau', 'Montant USDT', 'Montant XOF', 'Frais', 'Statut', 'Note'],
      ...filtered.map(p => [
        p.reference || '', new Date(p.createdAt).toLocaleDateString('fr-FR'),
        p.supplierName || '', p.network || '', p.amount || '',
        Math.round((p.amount || 0) * 620.5), (p.fee || (p.amount || 0) * 0.025).toFixed(2),
        STATUS_LABEL[p.status] || p.status, p.note || '',
      ]),
    ].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `terex_transactions_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontFamily: FONT, paddingTop: 8 }}>
      {selectedTx && <TransactionDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)',
        border: `1px solid ${C.bds}`, borderRadius: 16,
        padding: '24px 28px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', overflow: 'hidden', gap: 16,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            {/* Clock SVG icon box */}
            <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h2 style={{ color: C.t1, fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>
                Historique & Reçus
              </h2>
              <p style={{ color: C.t3, fontSize: 12, margin: '3px 0 0' }}>
                {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
                {isDemo && <span style={{ color: C.amber }}> · Données de démonstration</span>}
              </p>
            </div>
          </div>
          <button
            onClick={exportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.t3, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bds}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t1; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t3; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; }}
          >
            <Download style={{ width: 13, height: 13 }} /> Exporter CSV
          </button>
        </div>
        <div className="hidden sm:block" style={{ flexShrink: 0, opacity: 0.85 }}>
          <HeroSvg />
        </div>
      </div>

      {/* ── Filtres ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.t3, pointerEvents: 'none' }} />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Rechercher par fournisseur, référence…"
            style={{ width: '100%', background: C.l1, border: `1px solid ${searchFocused ? 'rgba(255,255,255,0.18)' : C.bds}`, borderRadius: 10, paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', transition: 'border-color 0.15s' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${statusFilter === f.value ? 'rgba(255,255,255,0.20)' : C.bds}`, background: statusFilter === f.value ? 'rgba(255,255,255,0.08)' : C.l1, color: statusFilter === f.value ? C.t1 : C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s', flexShrink: 0 }}
              onMouseEnter={e => { if (statusFilter !== f.value) (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
              onMouseLeave={e => { if (statusFilter !== f.value) (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}
            >{f.label}</button>
          ))}
          <div style={{ width: 1, height: 18, background: C.bds, flexShrink: 0, margin: '0 4px' }} />
          {PERIOD_FILTERS.map(f => (
            <button key={f.value} onClick={() => setPeriodFilter(f.value)}
              style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${periodFilter === f.value ? C.tealB : C.bds}`, background: periodFilter === f.value ? C.tealT : C.l1, color: periodFilter === f.value ? C.teal : C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s', flexShrink: 0 }}
              onMouseEnter={e => { if (periodFilter !== f.value) (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
              onMouseLeave={e => { if (periodFilter !== f.value) (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* ── Liste groupée ─────────────────────────────────────────── */}
      {groups.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, gap: 14 }}>
          <EmptyStateSvg />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: C.t2, fontSize: 14, fontWeight: 500, margin: 0 }}>Aucune transaction trouvée</p>
            <p style={{ color: C.t3, fontSize: 12, margin: '6px 0 0' }}>Essayez d'ajuster vos filtres</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.map(group => (
            <div key={group.label}>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 2px' }}>
                {group.label}
              </p>
              <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>
                {group.items.map((tx, i) => (
                  <TxRow key={tx.id} tx={tx} onClick={() => setSelectedTx(tx)} isLast={i === group.items.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
