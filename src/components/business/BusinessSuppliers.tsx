import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, X, Check, Globe, Send, Copy, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Supplier {
  id: string;
  name: string;
  walletAddress: string;
  network: string;
  country: string;
  category?: string;
  createdAt: string;
  totalPaid?: number;
  lastPaymentDate?: string;
}

interface Props {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const NETWORKS = ['TRC20 (TRON)', 'BEP20 (BSC)', 'ERC20 (Ethereum)', 'Polygon (MATIC)'];

const CATEGORIES = [
  'Textile', 'Électronique', 'Agroalimentaire', 'Maroquinerie',
  'Mode', 'Logistique', 'Services', 'Autre',
];

const COUNTRIES = [
  'Chine', 'Émirats Arabes Unis', 'Turquie', 'Maroc', 'Sénégal',
  'France', 'Inde', 'Pakistan', 'Autre',
];

const COUNTRY_CODE: Record<string, string> = {
  'Chine': 'CN', 'Émirats Arabes Unis': 'AE', 'Turquie': 'TR',
  'Maroc': 'MA', 'Sénégal': 'SN', 'France': 'FR',
  'Inde': 'IN', 'Pakistan': 'PK', 'Autre': '--',
};

const NET_COLOR: Record<string, string> = {
  'TRC20 (TRON)':     '#3B968F',
  'BEP20 (BSC)':      '#2d6b66',
  'ERC20 (Ethereum)': '#5ab5ae',
  'Polygon (MATIC)':  '#1e4a47',
};

const NET_LABEL: Record<string, string> = {
  'TRC20 (TRON)':     'TRC20',
  'BEP20 (BSC)':      'BEP20',
  'ERC20 (Ethereum)': 'ERC20',
  'Polygon (MATIC)':  'MATIC',
};

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868', t4: '#333333',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

function FlagImg({ country }: { country: string }) {
  const cc = COUNTRY_CODE[country];
  if (!cc || cc === '--') return <span style={{ fontSize: 13, marginRight: 4 }}>🌍</span>;
  return (
    <img
      src={`https://flagcdn.com/20x15/${cc.toLowerCase()}.png`}
      alt={cc}
      style={{ width: 20, height: 15, borderRadius: 2, objectFit: 'cover', flexShrink: 0, marginRight: 4, verticalAlign: 'middle', display: 'inline-block' }}
      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

// ── Supplier card (module-level for SWC) ─────────────────────────
function SupplierCard({
  supplier,
  onEdit,
  onDelete,
  onPay,
  onClick,
}: {
  supplier: Supplier;
  onEdit: () => void;
  onDelete: () => void;
  onPay: () => void;
  onClick: () => void;
}) {
  const code = COUNTRY_CODE[supplier.country] || '--';
  const netColor = NET_COLOR[supplier.network] || C.teal;
  const netLabel = NET_LABEL[supplier.network] || supplier.network;

  return (
    <div
      onClick={onClick}
      style={{
        background: C.l1,
        border: `1px solid ${C.bds}`,
        borderRadius: 14,
        padding: '16px 16px 14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        fontFamily: FONT, cursor: 'pointer',
        transition: 'border-color 0.12s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = C.bdh)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = C.bds)}
    >
      {/* Top row: avatar + name + network badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 9, flexShrink: 0,
            background: C.l3, color: C.t2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, fontFamily: MONO,
            border: `1px solid ${C.bd}`,
          }}>
            {code}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {supplier.name}
            </p>
            <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0', display: 'flex', alignItems: 'center' }}>
              <FlagImg country={supplier.country} />{supplier.country}{supplier.category ? ` · ${supplier.category}` : ''}
            </p>
          </div>
        </div>
        <div style={{
          background: `${netColor}1A`,
          border: `1px solid ${netColor}45`,
          color: netColor,
          fontSize: 9.5, fontWeight: 700,
          padding: '3px 9px', borderRadius: 20,
          letterSpacing: '0.04em', flexShrink: 0, marginLeft: 8,
        }}>
          {netLabel}
        </div>
      </div>

      {/* Wallet box */}
      <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 8, padding: '8px 12px', marginBottom: 14 }}>
        <p style={{ color: C.t3, fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 4px' }}>
          Adresse Wallet
        </p>
        <p style={{ color: C.t2, fontSize: 11, fontFamily: MONO, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {supplier.walletAddress.slice(0, 10)}...{supplier.walletAddress.slice(-6)}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <div>
          <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px' }}>Total payé</p>
          <p style={{ color: C.teal, fontSize: 15, fontWeight: 600, margin: 0 }}>
            {(supplier.totalPaid || 0).toLocaleString('fr-FR')} USDT
          </p>
        </div>
        <div>
          <p style={{ color: C.t3, fontSize: 10, margin: '0 0 3px' }}>Dernier paiement</p>
          <p style={{ color: C.t2, fontSize: 12, margin: 0 }}>
            {supplier.lastPaymentDate
              ? new Date(supplier.lastPaymentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Aucun'}
          </p>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.bds}`, marginBottom: 14 }} />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={e => { e.stopPropagation(); onPay(); }}
          style={{
            flex: 1, height: 36, borderRadius: 8,
            background: C.teal, border: 'none',
            color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: FONT,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
          onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
        >
          <Send style={{ width: 13, height: 13 }} />
          Payer
        </button>
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          title="Modifier"
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: C.l2, border: `1px solid ${C.bds}`,
            color: C.t3, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bdh; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}
        >
          <Edit2 style={{ width: 13, height: 13 }} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          title="Supprimer"
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: C.l2, border: `1px solid ${C.bds}`,
            color: C.t3, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redT; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = C.l2; }}
        >
          <Trash2 style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );
}

// ── Supplier Modal ────────────────────────────────────────────────
function SupplierModal({
  supplier,
  onSave,
  onClose,
}: {
  supplier?: Supplier | null;
  onSave: (s: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(supplier?.name || '');
  const [wallet, setWallet] = useState(supplier?.walletAddress || '');
  const [network, setNetwork] = useState(supplier?.network || 'TRC20 (TRON)');
  const [country, setCountry] = useState(supplier?.country || 'Chine');
  const [category, setCategory] = useState(supplier?.category || '');
  const [nameFocused, setNameFocused] = useState(false);
  const [walletFocused, setWalletFocused] = useState(false);

  const valid = name.trim() && wallet.trim();

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%', background: C.l2, border: `1px solid ${focused ? 'rgba(59,150,143,0.35)' : C.bd}`,
    borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
    color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT,
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 600, color: C.t3,
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
    fontFamily: FONT,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 440,
        background: C.l1, border: `1px solid ${C.bd}`,
        borderRadius: 14, padding: 24,
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
        fontFamily: FONT,
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: 0 }}>
            {supplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              color: C.t3, cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.background = C.l3; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = 'transparent'; }}
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Nom</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="Ex : Guangzhou Textiles Ltd"
              style={inputStyle(nameFocused)}
            />
          </div>

          {/* Country */}
          <div>
            <label style={labelStyle}>Pays</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {COUNTRIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  style={{
                    padding: '7px 8px', borderRadius: 7, fontSize: 11, fontWeight: 500,
                    border: `1px solid ${country === c ? C.tealB : C.bd}`,
                    background: country === c ? C.tealT : C.l2,
                    color: country === c ? C.teal : C.t3,
                    cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
                  }}
                >
                  {COUNTRY_FLAG[c]} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Secteur (optionnel)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? '' : cat)}
                  style={{
                    padding: '7px 8px', borderRadius: 7, fontSize: 11, fontWeight: 500,
                    border: `1px solid ${category === cat ? C.tealB : C.bd}`,
                    background: category === cat ? C.tealT : C.l2,
                    color: category === cat ? C.teal : C.t3,
                    cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Network */}
          <div>
            <label style={labelStyle}>Réseau</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {NETWORKS.map(net => (
                <button
                  key={net}
                  onClick={() => setNetwork(net)}
                  style={{
                    padding: '8px 10px', borderRadius: 7, fontSize: 11, fontWeight: 500,
                    border: `1px solid ${network === net ? C.tealB : C.bd}`,
                    background: network === net ? C.tealT : C.l2,
                    color: network === net ? C.teal : C.t3,
                    cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s', textAlign: 'left',
                  }}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div>
            <label style={labelStyle}>Adresse wallet USDT</label>
            <input
              type="text"
              value={wallet}
              onChange={e => setWallet(e.target.value)}
              onFocus={() => setWalletFocused(true)}
              onBlur={() => setWalletFocused(false)}
              placeholder="Adresse blockchain..."
              style={{ ...inputStyle(walletFocused), fontFamily: MONO }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 40, borderRadius: 8, fontSize: 13,
              background: 'transparent', border: `1px solid ${C.bd}`,
              color: C.t3, cursor: 'pointer', fontFamily: FONT,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bdh; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bd; }}
          >
            Annuler
          </button>
          <button
            disabled={!valid}
            onClick={() => { if (valid) { onSave({ name, walletAddress: wallet, network, country, category: category || undefined }); onClose(); } }}
            style={{
              flex: 1, height: 40, borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: valid ? C.teal : 'rgba(59,150,143,0.3)',
              border: 'none', color: '#fff',
              cursor: valid ? 'pointer' : 'not-allowed', fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => { if (valid) e.currentTarget.style.background = C.tealH; }}
            onMouseLeave={e => { if (valid) e.currentTarget.style.background = C.teal; }}
          >
            <Check style={{ width: 14, height: 14 }} />
            {supplier ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', processing: 'En cours', completed: 'Complété', failed: 'Échoué',
};
const STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b', processing: C.t2, completed: C.teal, failed: C.red,
};

// ── Supplier detail slide-out panel ───────────────────────────────
function SupplierDetailPanel({
  supplier,
  payments,
  onClose,
  onEdit,
  onDelete,
  onPay,
}: {
  supplier: Supplier;
  payments: any[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPay: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const code = COUNTRY_CODE[supplier.country] || '--';
  const netLabel = NET_LABEL[supplier.network] || supplier.network;
  const netColor = NET_COLOR[supplier.network] || C.teal;

  const supplierPayments = payments
    .filter(p => p.supplierName === supplier.name || p.wallet === supplier.walletAddress)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const totalPaid = payments
    .filter(p => (p.supplierName === supplier.name || p.wallet === supplier.walletAddress) && p.status === 'completed')
    .reduce((s, p) => s + (p.amount || 0), 0);

  const copy = () => {
    navigator.clipboard?.writeText(supplier.walletAddress).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
        width: '100%', maxWidth: 420,
        background: '#161616', borderLeft: `1px solid ${C.bd}`,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-16px 0 40px rgba(0,0,0,0.5)',
        fontFamily: FONT,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: C.l3, color: C.t2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: MONO, border: `1px solid ${C.bd}`, flexShrink: 0 }}>
              {code}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{supplier.name}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                {code !== '--' && (
                  <img src={`https://flagcdn.com/20x15/${code.toLowerCase()}.png`} alt={code}
                    style={{ width: 16, height: 12, borderRadius: 1, objectFit: 'cover' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                )}
                {supplier.country}{supplier.category ? ` · ${supplier.category}` : ''}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.t3, cursor: 'pointer' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: 'Total payé', value: `${totalPaid > 0 ? totalPaid.toLocaleString('fr-FR') : '—'}`, unit: totalPaid > 0 ? 'USDT' : '' },
              { label: 'Paiements', value: String(supplierPayments.length), unit: '' },
              { label: 'Réseau', value: netLabel, unit: '' },
            ].map(stat => (
              <div key={stat.label} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: stat.label === 'Réseau' ? netColor : C.t1 }}>{stat.value}</div>
                {stat.unit && <div style={{ fontSize: 10, color: C.t3 }}>{stat.unit}</div>}
              </div>
            ))}
          </div>

          {/* Wallet address */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Adresse wallet</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ flex: 1, fontSize: 11, color: C.t2, fontFamily: MONO, wordBreak: 'break-all', lineHeight: 1.5 }}>
                {supplier.walletAddress}
              </code>
              <button onClick={copy} style={{ background: copied ? C.tealT : C.l2, border: `1px solid ${copied ? C.tealB : C.bds}`, borderRadius: 7, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: copied ? C.teal : C.t3, cursor: 'pointer', flexShrink: 0, transition: 'all 0.12s' }}>
                {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
              </button>
            </div>
          </div>

          {/* Payment history */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Historique paiements
            </div>
            {supplierPayments.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10 }}>
                <Clock style={{ width: 20, height: 20, color: C.t3, margin: '0 auto 8px', display: 'block' }} />
                <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Aucun paiement effectué</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10, overflow: 'hidden' }}>
                {supplierPayments.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: i < supplierPayments.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{p.reference || p.id}</div>
                      <div style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>{new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{(p.amount || 0).toLocaleString('fr-FR')} USDT</div>
                      <div style={{ fontSize: 10, marginTop: 2, color: STATUS_COLOR[p.status] || C.t3 }}>{STATUS_LABEL[p.status] || p.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member since */}
          <div style={{ fontSize: 11, color: C.t3, textAlign: 'center' }}>
            Ajouté le {new Date(supplier.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.bds}`, display: 'flex', gap: 8 }}>
          <button onClick={onPay} style={{ flex: 1, height: 38, borderRadius: 8, background: C.teal, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: FONT, transition: 'background 0.1s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
            onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
            <Send style={{ width: 13, height: 13 }} /> Payer
          </button>
          <button onClick={onEdit} style={{ width: 38, height: 38, borderRadius: 8, background: C.l2, border: `1px solid ${C.bds}`, color: C.t3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
            <Edit2 style={{ width: 14, height: 14 }} />
          </button>
          <button onClick={onDelete} style={{ width: 38, height: 38, borderRadius: 8, background: C.l2, border: `1px solid ${C.bds}`, color: C.t3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = C.l2; }}>
            <Trash2 style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────
export function BusinessSuppliers({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const storageKey = `terex_b2b_${userId}_suppliers`;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; supplier?: Supplier | null }>({ open: false });
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    try {
      setSuppliers(JSON.parse(localStorage.getItem(storageKey) || '[]'));
      setPayments(JSON.parse(localStorage.getItem(`terex_b2b_${userId}_payments`) || '[]'));
    } catch {}
  }, [userId]);

  const save = (list: Supplier[]) => {
    setSuppliers(list);
    localStorage.setItem(storageKey, JSON.stringify(list));
  };

  const handleAdd = (data: Omit<Supplier, 'id' | 'createdAt'>) => {
    if (modal.supplier) {
      save(suppliers.map(s => s.id === modal.supplier!.id ? { ...s, ...data } : s));
    } else {
      save([{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data }, ...suppliers]);
    }
  };

  const handleDelete = (id: string) => save(suppliers.filter(s => s.id !== id));

  const filtered = suppliers.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT }}>
      {modal.open && (
        <SupplierModal
          supplier={modal.supplier}
          onSave={handleAdd}
          onClose={() => setModal({ open: false })}
        />
      )}

      {detailSupplier && (
        <SupplierDetailPanel
          supplier={detailSupplier}
          payments={payments}
          onClose={() => setDetailSupplier(null)}
          onEdit={() => { setDetailSupplier(null); setModal({ open: true, supplier: detailSupplier }); }}
          onDelete={() => { handleDelete(detailSupplier.id); setDetailSupplier(null); }}
          onPay={() => { setDetailSupplier(null); onNavigate?.('payment'); }}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            Fournisseurs
          </h2>
          <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0' }}>
            {suppliers.length} contact{suppliers.length !== 1 ? 's' : ''} enregistré{suppliers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, supplier: null })}
          style={{
            height: 32, paddingLeft: 12, paddingRight: 12,
            background: C.teal, border: 'none', borderRadius: 7,
            color: '#fff', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: FONT, flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
          onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
        >
          <Plus style={{ width: 13, height: 13 }} />
          Ajouter
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          width: 14, height: 14, color: C.t3,
        }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Rechercher par nom ou pays…"
          style={{
            width: '100%', background: C.l1, border: `1px solid ${searchFocused ? 'rgba(59,150,143,0.35)' : C.bds}`,
            borderRadius: 8, paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
            color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT,
            boxSizing: 'border-box', transition: 'border-color 0.15s',
          }}
        />
      </div>

      {/* Card grid or empty state */}
      {filtered.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: C.l3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <Globe style={{ width: 16, height: 16, color: C.t3 }} />
          </div>
          <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>
            {search ? 'Aucun résultat' : 'Aucun fournisseur enregistré'}
          </p>
          {!search && (
            <button
              onClick={() => setModal({ open: true, supplier: null })}
              style={{ color: C.teal, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: FONT }}
            >
              Ajouter votre premier fournisseur →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
          {filtered.map(s => (
            <SupplierCard
              key={s.id}
              supplier={s}
              onClick={() => setDetailSupplier(s)}
              onEdit={() => setModal({ open: true, supplier: s })}
              onDelete={() => handleDelete(s.id)}
              onPay={() => { setDetailSupplier(null); onNavigate?.('payment'); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
