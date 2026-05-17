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

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'En attente', color: '#f59e0b' },
  processing: { label: 'En cours',   color: '#3b82f6' },
  completed:  { label: 'Complété',   color: '#22c55e' },
  failed:     { label: 'Échoué',     color: '#ef4444' },
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', processing: 'En cours', completed: 'Complété', failed: 'Échoué',
};

const DEMO_PAYMENTS = [
  { id: 'TRX-SHZ001', reference: 'TRX-SHZ001', amount: 8500, fee: 212.5, total: 8712.5, network: 'TRC20', supplierName: 'Shenzhen Electronics Co.', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7', note: 'Facture #2025-089 — Lot composants Q1', status: 'completed', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), invoiceFile: 'facture_089.pdf', recurrence: null, scheduled: false },
  { id: 'TRX-LAG002', reference: 'TRX-LAG002', amount: 3200, fee: 80, total: 3280, network: 'BEP20', supplierName: 'Lagos Imports Ltd', wallet: '0xd3e8b4f6c2a1f9e5c7b0a3d2e1f8c4b6a5d9e2f7', note: 'Acompte contrat textile mars', status: 'processing', createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), invoiceFile: null, recurrence: 'Mensuel', scheduled: false },
  { id: 'TRX-DUB003', reference: 'TRX-DUB003', amount: 15000, fee: 375, total: 15375, network: 'TRC20', supplierName: 'Dubai Trade Co.', wallet: '0x9a4f2c3b1e6d7a8f5c2b4e1d9f3a6c7b2e8d5f1', note: 'Règlement définitif #DTC-2025-11', status: 'pending', createdAt: new Date(Date.now() - 30 * 60000).toISOString(), invoiceFile: 'facture_dtc.pdf', recurrence: null, scheduled: false },
  { id: 'TRX-TUR004', reference: 'TRX-TUR004', amount: 2100, fee: 52.5, total: 2152.5, network: 'ERC20', supplierName: 'Istanbul Fabrics', wallet: '0xf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', note: 'Paiement tissu synthétique', status: 'failed', createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), invoiceFile: null, recurrence: null, scheduled: false },
  { id: 'TRX-SHZ005', reference: 'TRX-SHZ005', amount: 4750, fee: 118.75, total: 4868.75, network: 'TRC20', supplierName: 'Shenzhen Electronics Co.', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7', note: 'Composants PCB — Facture #2025-077', status: 'completed', createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), invoiceFile: 'facture_077.pdf', recurrence: null, scheduled: false },
  { id: 'TRX-IND006', reference: 'TRX-IND006', amount: 6300, fee: 157.5, total: 6457.5, network: 'BEP20', supplierName: 'Mumbai Textiles Pvt Ltd', wallet: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', note: 'Commande coton bio BIO-2025-03', status: 'completed', createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), invoiceFile: 'facture_bio_03.pdf', recurrence: null, scheduled: false },
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

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? C.em : C.t3, padding: '2px 4px', display: 'inline-flex', alignItems: 'center', borderRadius: 4, transition: 'color 0.15s' }}
      onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = C.t1; }}
      onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}>
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
  const cfg = STATUS_CFG[tx.status] || { label: tx.status, color: C.t3 };
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
        <div style={{ padding: '28px 24px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: C.t2 }}>{cfg.label}</span>
          </div>
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
          {tx.recurrence && <DetailRow label="Récurrence"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><RefreshCw style={{ width: 11, height: 11, color: C.teal }} /><span style={{ color: C.teal }}>{tx.recurrence}</span></span></DetailRow>}
          {tx.scheduled && <DetailRow label="Planifié"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar style={{ width: 11, height: 11, color: C.amber }} /><span style={{ color: C.amber }}>Oui</span></span></DetailRow>}
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

function TxCard({ tx, onClick }: { tx: any; onClick: () => void }) {
  const cfg = STATUS_CFG[tx.status] || { label: tx.status, color: C.t3 };
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 13, cursor: 'pointer', transition: 'all 0.15s' }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.background = C.l2; el.style.borderColor = C.bd; el.style.transform = 'translateX(4px)'; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.background = C.l1; el.style.borderColor = C.bds; el.style.transform = 'translateX(0)'; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {NET_LOGOS[tx.network]
          ? <img src={NET_LOGOS[tx.network]} alt={tx.network} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          : <span style={{ fontSize: 10, color: C.t3 }}>{tx.network?.slice(0, 3)}</span>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.supplierName}</p>
        <p style={{ fontSize: 11, color: C.t3, margin: '3px 0 0', fontFamily: MONO }}>{tx.reference} · {tx.network}</p>
        <p style={{ fontSize: 11, color: C.t3, margin: '2px 0 0' }}>{new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
          <img src={usdtLogo} alt="USDT" style={{ width: 14, height: 14, borderRadius: '50%' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: C.t1, fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>{tx.amount.toLocaleString('fr-FR')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginTop: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: C.t3 }}>{cfg.label}</span>
        </div>
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
  { value: '7j', label: '7j' },
  { value: '30j', label: '30j' },
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
    try { setRawPayments(JSON.parse(localStorage.getItem(key) || '[]')); } catch {}
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
    .filter(p => !search || (p.supplierName || '').toLowerCase().includes(search.toLowerCase()) || (p.reference || '').toLowerCase().includes(search.toLowerCase()) || (p.note || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const groups = groupByDate(filtered);
  const totalAmount = filtered.reduce((s, p) => s + (p.amount || 0), 0);

  const exportCSV = () => {
    const csv = [
      ['Référence', 'Date', 'Fournisseur', 'Réseau', 'Montant USDT', 'Frais', 'Statut', 'Note'],
      ...filtered.map(p => [p.reference || '', new Date(p.createdAt).toLocaleDateString('fr-FR'), p.supplierName || '', p.network || '', p.amount || '', (p.fee || (p.amount || 0) * 0.025).toFixed(2), STATUS_LABEL[p.status] || p.status, p.note || '']),
    ].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `terex_transactions_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: FONT, paddingTop: 8 }}>
      {selectedTx && <TransactionDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '28px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: C.t1, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Historique & Reçus</h2>
            <p style={{ color: C.t3, fontSize: 13, margin: '6px 0 0' }}>
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
              {isDemo && <span style={{ color: C.amber }}> · Données de démonstration</span>}
            </p>
          </div>
          <button onClick={exportCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: C.t3, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bds}`, borderRadius: 9, padding: '8px 16px', cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s', flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t1; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t3; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; }}>
            <Download style={{ width: 13, height: 13 }} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* ── Layout 2 colonnes ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]" style={{ gap: 24, alignItems: 'start' }}>

        {/* ── Sidebar filtres (sticky desktop) ─────────────────── */}
        <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>

            {/* Search */}
            <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.bds}` }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: C.t3, pointerEvents: 'none' }} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                  placeholder="Rechercher…"
                  style={{ width: '100%', background: C.l2, border: `1px solid ${searchFocused ? 'rgba(255,255,255,0.18)' : C.bds}`, borderRadius: 8, paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, color: C.t1, fontSize: 12, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', transition: 'border-color 0.15s' }} />
              </div>
            </div>

            {/* Statut */}
            <div style={{ padding: '14px 14px 10px' }}>
              <p style={{ fontSize: 9.5, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 10px' }}>Statut</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {STATUS_FILTERS.map(f => {
                  const isActive = statusFilter === f.value;
                  return (
                    <button key={f.value} onClick={() => setStatusFilter(f.value)}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 8, border: 'none', background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent', cursor: 'pointer', fontFamily: FONT, textAlign: 'left', width: '100%', transition: 'background 0.1s' }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${isActive ? C.t1 : C.t3}`, background: isActive ? C.t1 : 'transparent', flexShrink: 0, transition: 'all 0.1s' }} />
                      <span style={{ fontSize: 12, color: isActive ? C.t1 : C.t3, fontWeight: isActive ? 500 : 400, transition: 'color 0.1s' }}>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Période */}
            <div style={{ padding: '10px 14px 14px', borderTop: `1px solid ${C.bds}` }}>
              <p style={{ fontSize: 9.5, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 10px' }}>Période</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {PERIOD_FILTERS.map(f => {
                  const isActive = periodFilter === f.value;
                  return (
                    <button key={f.value} onClick={() => setPeriodFilter(f.value)}
                      style={{ flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: isActive ? 600 : 400, border: `1px solid ${isActive ? 'rgba(255,255,255,0.18)' : C.bds}`, background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent', color: isActive ? C.t1 : C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s' }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}>
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Résumé filtré */}
          {filtered.length > 0 && (
            <div style={{ marginTop: 10, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 8px' }}>Résumé</p>
              <p style={{ fontSize: 11, color: C.t3, margin: 0 }}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: MONO, margin: '4px 0 0', letterSpacing: '-0.01em' }}>
                {totalAmount.toLocaleString('fr-FR')} <span style={{ fontSize: 12, color: C.t3, fontWeight: 400 }}>USDT</span>
              </p>
            </div>
          )}
        </div>

        {/* ── Feed transactions ────────────────────────────────── */}
        {groups.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, gap: 12 }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="21" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <path d="M16 24h16M24 16v16" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ color: C.t2, fontSize: 14, fontWeight: 500, margin: 0 }}>Aucune transaction trouvée</p>
            <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Modifiez vos filtres</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {groups.map(group => (
              <div key={group.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}>{group.label}</p>
                  <div style={{ flex: 1, height: 1, background: C.bds }} />
                  <span style={{ fontSize: 10, color: C.t4 }}>{group.items.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {group.items.map(tx => (
                    <TxCard key={tx.id} tx={tx} onClick={() => setSelectedTx(tx)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
