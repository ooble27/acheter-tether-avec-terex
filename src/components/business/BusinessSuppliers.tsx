import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, X, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const valid = name && wallet;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#111] border border-[#1e1e1e] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">{supplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Nom</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Guangzhou Textiles Ltd"
              className="w-full bg-[#161616] border border-[#222] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Pays</label>
            <div className="grid grid-cols-3 gap-1.5">
              {COUNTRIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                    country === c
                      ? 'bg-[#3B968F]/10 border-[#3B968F]/30 text-[#3B968F]'
                      : 'bg-[#161616] border-[#222] text-gray-500 hover:border-[#2a2a2a] hover:text-gray-300'
                  }`}
                >
                  {COUNTRY_FLAG[c]} {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Réseau</label>
            <div className="grid grid-cols-2 gap-1.5">
              {NETWORKS.map(net => (
                <button
                  key={net}
                  onClick={() => setNetwork(net)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                    network === net
                      ? 'bg-[#3B968F]/10 border-[#3B968F]/30 text-[#3B968F]'
                      : 'bg-[#161616] border-[#222] text-gray-500 hover:border-[#2a2a2a] hover:text-gray-300'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Adresse wallet USDT
            </label>
            <input
              type="text"
              value={wallet}
              onChange={e => setWallet(e.target.value)}
              placeholder="Adresse blockchain..."
              className="w-full bg-[#161616] border border-[#222] rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#222] text-gray-500 hover:text-white hover:bg-white/5 h-10 flex-1 text-sm"
          >
            Annuler
          </Button>
          <Button
            disabled={!valid}
            onClick={() => { onSave({ name, walletAddress: wallet, network, country }); onClose(); }}
            className="bg-[#3B968F] hover:bg-[#3B968F]/90 text-white disabled:opacity-30 h-10 flex-1 text-sm gap-2"
          >
            <Check className="w-4 h-4" />
            {supplier ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BusinessSuppliers({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const storageKey = `terex_b2b_${userId}_suppliers`;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
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
    <div className="space-y-5">
      {modal.open && (
        <SupplierModal
          supplier={modal.supplier}
          onSave={handleAdd}
          onClose={() => setModal({ open: false })}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-bold">Fournisseurs</h2>
          <p className="text-gray-600 text-sm mt-0.5">{suppliers.length} contact{suppliers.length !== 1 ? 's' : ''} enregistré{suppliers.length !== 1 ? 's' : ''}</p>
        </div>
        <Button
          onClick={() => setModal({ open: true, supplier: null })}
          className="bg-[#3B968F] hover:bg-[#3B968F]/90 text-white h-9 text-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou pays…"
          className="w-full bg-[#111] border border-[#1c1c1c] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/40"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[#111] border border-[#1c1c1c] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center mx-auto mb-3">
              <Globe className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-gray-600 text-sm">
              {search ? 'Aucun résultat' : 'Aucun fournisseur enregistré'}
            </p>
            {!search && (
              <button
                onClick={() => setModal({ open: true, supplier: null })}
                className="mt-2 text-[#3B968F] text-xs hover:underline"
              >
                Ajouter votre premier fournisseur →
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_120px_140px_1fr_80px] gap-4 px-5 py-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider border-b border-[#181818]">
              <span>Nom</span>
              <span>Pays</span>
              <span>Réseau</span>
              <span>Wallet</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-[#181818]">
              {filtered.map(s => (
                <div
                  key={s.id}
                  className="flex md:grid md:grid-cols-[2fr_120px_140px_1fr_80px] gap-4 px-5 py-3.5 hover:bg-white/[0.015] transition-colors items-center"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{s.name}</p>
                    <p className="text-gray-600 text-[11px] mt-0.5">
                      Ajouté le {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5">
                    <span className="text-sm">{COUNTRY_FLAG[s.country] || '🌍'}</span>
                    <span className="text-gray-400 text-xs">{s.country}</span>
                  </div>
                  <span className="hidden md:block text-gray-500 text-xs">{s.network}</span>
                  <span className="hidden md:block text-gray-700 text-[11px] font-mono">
                    {s.walletAddress.slice(0, 10)}...{s.walletAddress.slice(-6)}
                  </span>
                  <div className="flex items-center justify-end gap-1 ml-auto md:ml-0">
                    <button
                      onClick={() => setModal({ open: true, supplier: s })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
