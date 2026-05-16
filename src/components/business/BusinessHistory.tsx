import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, XCircle, Loader2, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
}

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  bg: '#0e0e0e', l1: '#141414', l2: '#191919', l3: '#1f1f1f',
  bd: '#2a2a2a', bds: '#1f1f1f', bdh: '#333333',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555', t4: '#333333',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// ── StatusPill ────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { bg: string; border: string; color: string; label: string; Icon: React.FC<any> }> = {
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

// ── Main component ────────────────────────────────────────────────
export function BusinessHistory({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = `terex_b2b_${userId}_payments`;

  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch {}
  }, [userId]);

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

  const totalAmount = filtered
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + (p.amount || 0), 0);

  const exportCSV = () => {
    const csv = [
      ['Référence', 'Date', 'Fournisseur', 'Réseau', 'Montant', 'Statut', 'Note'],
      ...filtered.map(p => [
        p.reference || '', new Date(p.createdAt).toLocaleDateString('fr-FR'),
        p.supplierName || '', p.network || '', p.amount || '',
        STATUS_LABEL[p.status] || p.status, p.note || '',
      ]),
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT }}>
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </h2>
          <p style={{ color: C.t3, fontSize: 12, marginTop: 4, margin: '4px 0 0' }}>
            Toutes vos transactions
            {totalAmount > 0 && (
              <span> · <span style={{ color: C.em }}>{totalAmount.toLocaleString('fr-FR')} USDT</span> complétés</span>
            )}
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
          onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bdh; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}
        >
          <Download style={{ width: 13, height: 13 }} /> Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Search */}
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
            placeholder="Rechercher par fournisseur, référence…"
            style={{
              width: '100%', background: C.l1, border: `1px solid ${searchFocused ? 'rgba(59,150,143,0.35)' : C.bds}`,
              borderRadius: 8, paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
              color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT,
              boxSizing: 'border-box', transition: 'border-color 0.15s',
            }}
          />
        </div>
        {/* Status pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500,
                border: `1px solid ${statusFilter === f.value ? C.tealB : C.bds}`,
                background: statusFilter === f.value ? C.tealT : C.l1,
                color: statusFilter === f.value ? C.teal : C.t3,
                cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
              }}
              onMouseEnter={e => { if (statusFilter !== f.value) e.currentTarget.style.color = C.t2; }}
              onMouseLeave={e => { if (statusFilter !== f.value) e.currentTarget.style.color = C.t3; }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
        {paginated.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>Aucune transaction trouvée</p>
          </div>
        ) : (
          <>
            {/* Headers */}
            <div className="hidden md:grid" style={{
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: 16, padding: '10px 20px',
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

            {/* Rows */}
            <div>
              {paginated.map((tx, i) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '12px 20px',
                    borderBottom: i < paginated.length - 1 ? `1px solid ${C.bds}` : 'none',
                    gap: 16, transition: 'background 0.1s',
                  }}
                  className="md:grid"
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Vendor + date + note */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p style={{ fontSize: 10, color: C.t3, marginTop: 2, margin: '2px 0 0' }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {tx.note ? ` · ${tx.note}` : ''}
                    </p>
                  </div>
                  {/* Reference mono */}
                  <span className="hidden md:block" style={{ color: C.t3, fontSize: 11, fontFamily: MONO }}>
                    {tx.reference || '—'}
                  </span>
                  {/* Network */}
                  <span className="hidden md:block" style={{ color: C.t2, fontSize: 12 }}>
                    {tx.network || '—'}
                  </span>
                  {/* Amount tnum right */}
                  <p style={{
                    fontSize: 12, fontWeight: 600, color: C.t1, margin: 0,
                    fontVariantNumeric: 'tabular-nums', textAlign: 'right',
                    marginLeft: 'auto',
                  }} className="md:ml-0">
                    {(tx.amount || 0).toLocaleString('fr-FR')}{' '}
                    <span style={{ color: C.t3, fontWeight: 400, fontSize: 11 }}>{tx.currency || 'USDT'}</span>
                  </p>
                  {/* Status pill */}
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
            Page {page} sur {totalPages}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{
                padding: '6px 14px', borderRadius: 7, fontSize: 12, fontFamily: FONT,
                border: `1px solid ${C.bds}`, background: 'transparent',
                color: page === 1 ? C.t4 : C.t3, cursor: page === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => { if (page !== 1) e.currentTarget.style.color = C.t1; }}
              onMouseLeave={e => { if (page !== 1) e.currentTarget.style.color = C.t3; }}
            >
              Précédent
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '6px 14px', borderRadius: 7, fontSize: 12, fontFamily: FONT,
                border: `1px solid ${C.bds}`, background: 'transparent',
                color: page === totalPages ? C.t4 : C.t3, cursor: page === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => { if (page !== totalPages) e.currentTarget.style.color = C.t1; }}
              onMouseLeave={e => { if (page !== totalPages) e.currentTarget.style.color = C.t3; }}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
