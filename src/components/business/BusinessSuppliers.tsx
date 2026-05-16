import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, X, Check, Globe, Send } from 'lucide-react';
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

const COUNTRY_FLAG: Record<string, string> = {
  'Chine': '🇨🇳', 'Émirats Arabes Unis': '🇦🇪', 'Turquie': '🇹🇷',
  'Maroc': '🇲🇦', 'Sénégal': '🇸🇳', 'France': '🇫🇷',
  'Inde': '🇮🇳', 'Pakistan': '🇵🇰', 'Autre': '🌍',
};

const COUNTRY_CODE: Record<string, string> = {
  'Chine': 'CN', 'Émirats Arabes Unis': 'AE', 'Turquie': 'TR',
  'Maroc': 'MA', 'Sénégal': 'SN', 'France': 'FR',
  'Inde': 'IN', 'Pakistan': 'PK', 'Autre': '--',
};

const NET_COLOR: Record<string, string> = {
  'TRC20 (TRON)':     '#3B968F',
  'BEP20 (BSC)':      '#F0B90B',
  'ERC20 (Ethereum)': '#627EEA',
  'Polygon (MATIC)':  '#8247E5',
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

// ── Supplier card (module-level for SWC) ─────────────────────────
function SupplierCard({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: Supplier;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const code = COUNTRY_CODE[supplier.country] || '--';
  const netColor = NET_COLOR[supplier.network] || C.teal;
  const netLabel = NET_LABEL[supplier.network] || supplier.network;

  return (
    <div style={{
      background: C.l1,
      border: `1px solid ${C.bds}`,
      borderRadius: 14,
      padding: '16px 16px 14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT,
    }}>
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
            <p style={{ color: C.t3, fontSize: 11, margin: '2px 0 0' }}>
              {COUNTRY_FLAG[supplier.country] || '🌍'} {supplier.country}{supplier.category ? ` · ${supplier.category}` : ''}
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
          onClick={onEdit}
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
          onClick={onDelete}
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

// ── Main component ────────────────────────────────────────────────
export function BusinessSuppliers({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const storageKey = `terex_b2b_${userId}_suppliers`;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; supplier?: Supplier | null }>({ open: false });

  useEffect(() => {
    try {
      setSuppliers(JSON.parse(localStorage.getItem(storageKey) || '[]'));
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
              onEdit={() => setModal({ open: true, supplier: s })}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
