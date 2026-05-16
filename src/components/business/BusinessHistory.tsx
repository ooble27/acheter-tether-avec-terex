import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, XCircle, Loader2, Download, X, Copy, Check, ExternalLink, FileText, Calendar, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
}

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868', t4: '#333333',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
  purple: '#a855f7', purpleT: 'rgba(168,85,247,0.08)', purpleB: 'rgba(168,85,247,0.20)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const USDT_LOGO = '/payment-methods/tether-logo.png';

const STATUS_CONFIG: Record<string, { bg: string; border: string; color: string; label: string; Icon: React.FC<{ style?: React.CSSProperties }> }> = {
  pending:    { bg: C.amberT, border: C.amberB, color: C.amber, label: 'En attente',  Icon: Clock },
  processing: { bg: C.blueT,  border: C.blueB,  color: C.blue,  label: 'En cours',    Icon: Loader2 },
  completed:  { bg: C.emT,    border: C.emB,    color: C.em,    label: 'Complété',    Icon: CheckCircle2 },
  failed:     { bg: C.redT,   border: C.redB,   color: C.red,   label: 'Échoué',      Icon: XCircle },
};

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { bg: C.l3, border: C.bd, color: C.t2, label: status, Icon: Clock };
  const { bg, border, color, label, Icon } = cfg;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3,
      borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: bg, border: `1px solid ${border}`, color,
      fontFamily: FONT, whiteSpace: 'nowrap',
    }}>
      <Icon style={{ width: 9, height: 9 }} />
      {label}
    </span>
  );
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', processing: 'En cours',
  completed: 'Complété', failed: 'Échoué',
};

const STATUS_FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'completed', label: 'Complétés' },
  { value: 'failed', label: 'Échoués' },
];

const DEMO_PAYMENTS = [
  {
    id: 'TRX-SHZ001', reference: 'TRX-SHZ001', amount: 8500, fee: 212.5, total: 8712.5, currency: 'USDT',
    network: 'TRC20', supplierName: 'Shenzhen Electronics Co.', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7',
    note: 'Facture #2025-089 — Lot composants Q1', status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: 'facture_089.pdf', scheduled: false, recurrence: null,
  },
  {
    id: 'TRX-LAG002', reference: 'TRX-LAG002', amount: 3200, fee: 80, total: 3280, currency: 'USDT',
    network: 'BEP20', supplierName: 'Lagos Imports Ltd', wallet: '0xd3e8b4f6c2a1f9e5c7b0a3d2e1f8c4b6a5d9e2f7',
    note: 'Acompte contrat textile mars', status: 'processing',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), invoiceFile: null, scheduled: false, recurrence: 'Mensuel',
  },
  {
    id: 'TRX-DUB003', reference: 'TRX-DUB003', amount: 15000, fee: 375, total: 15375, currency: 'USDT',
    network: 'TRC20', supplierName: 'Dubai Trade Co.', wallet: '0x9a4f2c3b1e6d7a8f5c2b4e1d9f3a6c7b2e8d5f1',
    note: 'Règlement définitif commande #DTC-2025-11', status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), invoiceFile: 'facture_dtc_2025_11.pdf', scheduled: false, recurrence: null,
  },
  {
    id: 'TRX-TUR004', reference: 'TRX-TUR004', amount: 2100, fee: 52.5, total: 2152.5, currency: 'USDT',
    network: 'ERC20', supplierName: 'Istanbul Fabrics', wallet: '0xf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    note: 'Paiement tissu synthétique', status: 'failed',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: null, scheduled: false, recurrence: null,
  },
  {
    id: 'TRX-SHZ005', reference: 'TRX-SHZ005', amount: 4750, fee: 118.75, total: 4868.75, currency: 'USDT',
    network: 'TRC20', supplierName: 'Shenzhen Electronics Co.', wallet: 'TQn7hB9kNYX4zCN8e2mJfLp3kQwR5sVd7',
    note: 'Composants PCB — Facture #2025-077', status: 'completed',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: 'facture_077.pdf', scheduled: false, recurrence: null,
  },
  {
    id: 'TRX-IND006', reference: 'TRX-IND006', amount: 6300, fee: 157.5, total: 6457.5, currency: 'USDT',
    network: 'BEP20', supplierName: 'Mumbai Textiles Pvt Ltd', wallet: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    note: 'Commande coton bio BIO-2025-03', status: 'completed',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), invoiceFile: 'facture_bio_03.pdf', scheduled: false, recurrence: null,
  },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: copied ? C.em : C.t3, padding: '2px 4px',
      display: 'inline-flex', alignItems: 'center', borderRadius: 4,
      transition: 'color 0.15s',
    }}
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
  const cfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
  const xofAmount = tx.amount * 620.5;
  const eurAmount = tx.amount * 0.9245;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 440,
        background: '#141414', borderLeft: `1px solid ${C.bds}`,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Drawer header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.bds}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, position: 'sticky', top: 0, background: '#141414', zIndex: 2,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, fontFamily: FONT }}>{tx.supplierName}</div>
            <div style={{ fontSize: 11, color: C.t3, fontFamily: MONO, marginTop: 2 }}>{tx.reference}</div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, background: C.l3, border: `1px solid ${C.bds}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.t2, cursor: 'pointer',
          }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Amount hero */}
        <div style={{
          padding: '28px 24px 24px', borderBottom: `1px solid ${C.bds}`,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={USDT_LOGO} alt="USDT" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            <span style={{ fontSize: 32, fontWeight: 700, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em' }}>
              {tx.amount.toLocaleString('fr-FR')}
            </span>
            <span style={{ fontSize: 16, color: C.t3, fontWeight: 500 }}>USDT</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: C.t3, fontFamily: MONO }}>
              ≈ {xofAmount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XOF
            </span>
            <span style={{ fontSize: 12, color: C.t3 }}>·</span>
            <span style={{ fontSize: 12, color: C.t3, fontFamily: MONO }}>
              ≈ {eurAmount.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} EUR
            </span>
          </div>
          <div style={{ marginTop: 4 }}>
            <StatusPill status={tx.status} />
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '0 24px', flex: 1 }}>
          <DetailRow label="Réseau">
            <span style={{ color: C.t2 }}>{tx.network}</span>
          </DetailRow>
          <DetailRow label="Wallet destinataire">
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.t2 }}>
              {tx.wallet ? `${tx.wallet.slice(0, 12)}...${tx.wallet.slice(-6)}` : '—'}
              {tx.wallet && <CopyBtn text={tx.wallet} />}
            </span>
          </DetailRow>
          <DetailRow label="Frais (2.5%)">
            <span style={{ fontFamily: MONO }}>{(tx.fee || tx.amount * 0.025).toFixed(2)} USDT</span>
          </DetailRow>
          <DetailRow label="Total prélevé">
            <span style={{ fontFamily: MONO, color: C.teal, fontWeight: 600 }}>{(tx.total || tx.amount * 1.025).toFixed(2)} USDT</span>
          </DetailRow>
          <DetailRow label="Date">
            <span>{new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </DetailRow>
          {tx.note && (
            <DetailRow label="Note">
              <span style={{ color: C.t2 }}>{tx.note}</span>
            </DetailRow>
          )}
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

        {/* Footer actions */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.bds}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          {tx.invoiceFile && (
            <button style={{
              flex: 1, height: 36, borderRadius: 8, fontSize: 12, fontWeight: 500,
              background: C.l2, border: `1px solid ${C.bds}`, color: C.t2,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: FONT,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t1; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t2; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; }}
            >
              <FileText style={{ width: 13, height: 13 }} /> {tx.invoiceFile}
            </button>
          )}
          <button style={{
            flex: 1, height: 36, borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: C.tealT, border: `1px solid ${C.tealB}`, color: C.teal,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: FONT,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,150,143,0.14)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.tealT; }}
          >
            <ExternalLink style={{ width: 13, height: 13 }} /> Blockchain
          </button>
        </div>
      </div>
    </div>
  );
}

export function BusinessHistory({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = `terex_b2b_${userId}_payments`;

  const [rawPayments, setRawPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const PER_PAGE = 10;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      setRawPayments(stored);
    } catch {}
  }, [userId]);

  const payments = rawPayments.length > 0 ? rawPayments : DEMO_PAYMENTS;
  const isDemo = rawPayments.length === 0;

  const filtered = payments
    .filter(p => !statusFilter || p.status === statusFilter)
    .filter(p =>
      !search ||
      (p.supplierName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.reference || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.note || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalCompleted = filtered
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + (p.amount || 0), 0);

  const exportCSV = () => {
    const csv = [
      ['Référence', 'Date', 'Fournisseur', 'Réseau', 'Montant USDT', 'Montant XOF', 'Frais', 'Statut', 'Note'],
      ...filtered.map(p => [
        p.reference || '',
        new Date(p.createdAt).toLocaleDateString('fr-FR'),
        p.supplierName || '',
        p.network || '',
        p.amount || '',
        Math.round((p.amount || 0) * 620.5),
        (p.fee || (p.amount || 0) * 0.025).toFixed(2),
        STATUS_LABEL[p.status] || p.status,
        p.note || '',
      ]),
    ].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terex_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT, paddingTop: 8 }}>
      {selectedTx && (
        <TransactionDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            Historique
          </h2>
          <p style={{ color: C.t3, fontSize: 12, marginTop: 4, margin: '4px 0 0' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            {totalCompleted > 0 && (
              <span> · <span style={{ color: C.em }}>{totalCompleted.toLocaleString('fr-FR')} USDT</span> complétés</span>
            )}
            {isDemo && <span style={{ color: C.amber }}> · Données de démonstration</span>}
          </p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: C.t3, background: 'transparent',
            border: `1px solid ${C.bds}`, borderRadius: 7,
            padding: '7px 12px', cursor: 'pointer', fontFamily: FONT,
            flexShrink: 0, transition: 'all 0.1s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t1; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bdh; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.t3; (e.currentTarget as HTMLButtonElement).style.borderColor = C.bds; }}
        >
          <Download style={{ width: 13, height: 13 }} /> Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 14, height: 14, color: C.t3,
          }} />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Rechercher par fournisseur, référence, note…"
            style={{
              width: '100%', background: C.l1, border: `1px solid ${searchFocused ? 'rgba(59,150,143,0.35)' : C.bds}`,
              borderRadius: 8, paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
              color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT,
              boxSizing: 'border-box', transition: 'border-color 0.15s',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              style={{
                flexShrink: 0, padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500,
                border: `1px solid ${statusFilter === f.value ? C.tealB : C.bds}`,
                background: statusFilter === f.value ? C.tealT : C.l1,
                color: statusFilter === f.value ? C.teal : C.t3,
                cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
              }}
              onMouseEnter={e => { if (statusFilter !== f.value) (e.currentTarget as HTMLButtonElement).style.color = C.t2; }}
              onMouseLeave={e => { if (statusFilter !== f.value) (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
        {paginated.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Aucune transaction trouvée</p>
          </div>
        ) : (
          <>
            {/* Headers */}
            <div className="hidden md:grid" style={{
              gridTemplateColumns: '2fr 120px 100px 130px 120px',
              padding: '10px 20px',
              borderBottom: `1px solid ${C.bds}`,
            }}>
              {['Fournisseur', 'Référence', 'Réseau', 'Montant', 'Statut'].map((h, i) => (
                <span key={h} style={{
                  fontSize: 10, fontWeight: 600, color: C.t3,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  textAlign: i >= 3 ? 'right' : 'left',
                }}>
                  {h}
                </span>
              ))}
            </div>

            <div>
              {paginated.map((tx, i) => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '13px 20px',
                    borderBottom: i < paginated.length - 1 ? `1px solid ${C.bds}` : 'none',
                    gap: 12, cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  className="md:grid"
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Vendor + date */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 11, color: C.t3, margin: '2px 0 0' }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {tx.note ? ` · ${tx.note.slice(0, 40)}${tx.note.length > 40 ? '…' : ''}` : ''}
                    </p>
                  </div>
                  <span className="hidden md:block" style={{ color: C.t3, fontSize: 11, fontFamily: MONO }}>
                    {tx.reference || '—'}
                  </span>
                  <span className="hidden md:block" style={{ color: C.t2, fontSize: 12 }}>
                    {tx.network || '—'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginLeft: 'auto' }} className="md:ml-0">
                    <img src={USDT_LOGO} alt="USDT" style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontVariantNumeric: 'tabular-nums' }}>
                      {(tx.amount || 0).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div className="hidden md:flex" style={{ justifyContent: 'flex-end' }}>
                    <StatusPill status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>
            Page {page} sur {totalPages} · {filtered.length} résultats
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Précédent', disabled: page === 1, action: () => setPage(p => p - 1) },
              { label: 'Suivant',   disabled: page === totalPages, action: () => setPage(p => p + 1) },
            ].map(btn => (
              <button
                key={btn.label}
                disabled={btn.disabled}
                onClick={btn.action}
                style={{
                  padding: '6px 14px', borderRadius: 7, fontSize: 12, fontFamily: FONT,
                  border: `1px solid ${C.bds}`, background: 'transparent',
                  color: btn.disabled ? C.t4 : C.t3,
                  cursor: btn.disabled ? 'not-allowed' : 'pointer', transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (!btn.disabled) (e.currentTarget as HTMLButtonElement).style.color = C.t1; }}
                onMouseLeave={e => { if (!btn.disabled) (e.currentTarget as HTMLButtonElement).style.color = C.t3; }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
