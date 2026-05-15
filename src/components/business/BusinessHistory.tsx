import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, XCircle, Loader2, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
}

const STATUS_STYLE: Record<string, string> = {
  pending:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  failed:     'bg-red-500/10 text-red-400 border-red-500/20',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', processing: 'En cours',
  completed: 'Complété', failed: 'Échoué',
};
const STATUS_ICON: Record<string, React.FC<{ className?: string }>> = {
  pending:    ({ className }) => <Clock className={className} />,
  processing: ({ className }) => <Loader2 className={className} />,
  completed:  ({ className }) => <CheckCircle2 className={className} />,
  failed:     ({ className }) => <XCircle className={className} />,
};

const STATUS_FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'completed', label: 'Complétés' },
  { value: 'failed', label: 'Échoués' },
];

export function BusinessHistory({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = `terex_b2b_${userId}_payments`;

  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
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

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalAmount = filtered
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-bold">Historique des transactions</h2>
          <p className="text-gray-600 text-sm mt-0.5">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            {totalAmount > 0 && (
              <span> · <span className="text-emerald-400">{totalAmount.toLocaleString()} USDT</span> complétés</span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
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
          }}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 border border-[#1c1c1c] hover:border-[#2a2a2a] px-3 py-2 rounded-lg transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par fournisseur, référence…"
            className="w-full bg-[#111] border border-[#1c1c1c] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/40"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                statusFilter === f.value
                  ? 'bg-[#3B968F]/10 border-[#3B968F]/25 text-[#3B968F]'
                  : 'bg-[#111] border-[#1c1c1c] text-gray-600 hover:text-gray-300 hover:border-[#2a2a2a]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[#111] border border-[#1c1c1c] overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-600 text-sm">Aucune transaction trouvée</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[1fr_130px_130px_130px_100px] gap-4 px-5 py-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider border-b border-[#181818]">
              <span>Fournisseur</span>
              <span>Référence</span>
              <span>Réseau</span>
              <span className="text-right">Montant</span>
              <span className="text-right">Statut</span>
            </div>
            <div className="divide-y divide-[#181818]">
              {paginated.map(tx => {
                const Icon = STATUS_ICON[tx.status] || Clock;
                return (
                  <div
                    key={tx.id}
                    className="flex md:grid md:grid-cols-[1fr_130px_130px_130px_100px] gap-4 px-5 py-3.5 hover:bg-white/[0.015] transition-colors items-center"
                  >
                    <div>
                      <p className="text-white text-xs font-medium">{tx.supplierName || 'Fournisseur'}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {tx.note && <p className="text-gray-700 text-[10px] mt-0.5 italic truncate max-w-[200px]">{tx.note}</p>}
                    </div>
                    <span className="hidden md:block text-gray-600 text-[11px] font-mono">{tx.reference || '—'}</span>
                    <span className="hidden md:block text-gray-500 text-xs">{tx.network || '—'}</span>
                    <p className="text-white text-xs font-semibold text-right ml-auto md:ml-0">
                      {(tx.amount || 0).toLocaleString()}{' '}
                      <span className="text-gray-600 font-normal">{tx.currency || 'USDT'}</span>
                    </p>
                    <div className="flex justify-end">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_STYLE[tx.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                        <Icon className="w-2.5 h-2.5" />
                        {STATUS_LABEL[tx.status] || tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-xs">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-xs border border-[#1c1c1c] text-gray-500 hover:text-white hover:border-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Précédent
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-xs border border-[#1c1c1c] text-gray-500 hover:text-white hover:border-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
