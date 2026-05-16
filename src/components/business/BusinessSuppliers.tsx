import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, X, Check, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Supplier {
  id: string;
  name: string;
  walletAddress: string;
  network: string;
  country: string;
  createdAt: string;
}

interface Props {
  user: { email: string; name: string } | null;
}

const NETWORKS = ['TRC20 (TRON)', 'BEP20 (BSC)', 'ERC20 (Ethereum)', 'Polygon (MATIC)'];

const COUNTRIES = [
  'Chine', 'Émirats Arabes Unis', 'Turquie', 'Maroc', 'Sénégal',
  'France', 'Inde', 'Pakistan', 'Autre',
];

const COUNTRY_FLAG: Record<string, string> = {
  'Chine': '🇨🇳', 'Émirats Arabes Unis': '🇦🇪', 'Turquie': '🇹🇷',
  'Maroc': '🇲🇦', 'Sénégal': '🇸🇳', 'France': '🇫🇷',
  'Inde': '🇮🇳', 'Pakistan': '🇵🇰', 'Autre': '🌍',
};

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  bg: '#0e0e0e', l1: '#141414', l2: '#191919', l3: '#1f1f1f', l4: '#242424',
  bd: '#2a2a2a', bds: '#1f1f1f', bdh: '#333333',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555', t4: '#333333',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// ── InitialAvatar ─────────────────────────────────────────────────
function InitialAvatar({ name, size = 30 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'rgba(59,150,143,0.22)', color: C.teal,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0, fontFamily: FONT,
    }}>
      {initials}
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
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      {/* Modal card */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 440,
        background: C.l1, border: `1px solid ${C.bd}`,
        borderRadius: 14, padding: 24,
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
        fontFamily: FONT,
      }}>
        {/* Header */}
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

          {/* Country 3x3 grid */}
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

          {/* Network 2x2 grid */}
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

          {/* Wallet (mono) */}
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

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 40, borderRadius: 8, fontSize: 13,
              background: 'transparent', border: `1px solid ${C.bd}`,
              color: C.t3, cursor: 'pointer', fontFamily: FONT,
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bdh; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bd; }}
          >
            Annuler
          </button>
          <button
            disabled={!valid}
            onClick={() => { if (valid) { onSave({ name, walletAddress: wallet, network, country }); onClose(); } }}
            style={{
              flex: 1, height: 40, borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: valid ? C.teal : 'rgba(59,150,143,0.3)',
              border: 'none', color: '#fff',
              cursor: valid ? 'pointer' : 'not-allowed', fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => { if (valid) (e.currentTarget.style.background = C.tealH); }}
            onMouseLeave={e => { if (valid) (e.currentTarget.style.background = C.teal); }}
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

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            Fournisseurs
          </h2>
          <p style={{ color: C.t3, fontSize: 12, marginTop: 4, margin: '4px 0 0' }}>
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

      {/* Table card */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, overflow: 'hidden' }}>
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
          <>
            {/* Table headers */}
            <div className="hidden md:grid" style={{
              gridTemplateColumns: '2fr 130px 110px 1fr 80px',
              gap: 16, padding: '10px 20px',
              borderBottom: `1px solid ${C.bds}`,
            }}>
              {['Nom', 'Pays', 'Réseau', 'Wallet', 'Actions'].map((h, i) => (
                <span key={h} style={{
                  fontSize: 10, fontWeight: 600, color: C.t3,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  textAlign: i === 4 ? 'right' : 'left',
                }}>
                  {h}
                </span>
              ))}
            </div>
            {/* Rows */}
            <div>
              {filtered.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '12px 20px',
                    borderBottom: i < filtered.length - 1 ? `1px solid ${C.bds}` : 'none',
                    gap: 16,
                    transition: 'background 0.1s',
                  }}
                  className="md:grid"
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Name + date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                    <InitialAvatar name={s.name} size={30} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </p>
                      <p style={{ fontSize: 10, color: C.t3, marginTop: 2, margin: '2px 0 0' }}>
                        Ajouté le {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {/* Country */}
                  <div className="hidden md:flex" style={{ alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{COUNTRY_FLAG[s.country] || '🌍'}</span>
                    <span style={{ color: C.t2, fontSize: 12 }}>{s.country}</span>
                  </div>
                  {/* Network */}
                  <span className="hidden md:block" style={{ color: C.t2, fontSize: 12 }}>{s.network}</span>
                  {/* Wallet mono truncated */}
                  <span className="hidden md:block" style={{ color: C.t3, fontSize: 11, fontFamily: MONO, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.walletAddress.slice(0, 10)}...{s.walletAddress.slice(-6)}
                  </span>
                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginLeft: 'auto' }}>
                    <button
                      onClick={() => setModal({ open: true, supplier: s })}
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'transparent', border: 'none',
                        color: C.t3, cursor: 'pointer', transition: 'all 0.1s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.background = C.l3; }}
                      onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Edit2 style={{ width: 13, height: 13 }} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'transparent', border: 'none',
                        color: C.t3, cursor: 'pointer', transition: 'all 0.1s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redT; }}
                      onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
