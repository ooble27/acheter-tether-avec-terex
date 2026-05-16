import { useState, useEffect } from 'react';
import {
  TrendingUp, Clock, Users2, Zap,
  Send, Plus, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
  onNavigate: (section: string) => void;
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

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_STYLE[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export function BusinessOverview({ user, onNavigate }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const key = (k: string) => `terex_b2b_${userId}_${k}`;

  const [payments, setPayments] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      setPayments(JSON.parse(localStorage.getItem(key('payments')) || '[]'));
      setSuppliers(JSON.parse(localStorage.getItem(key('suppliers')) || '[]'));
      setProfile(JSON.parse(localStorage.getItem(key('profile')) || 'null'));
    } catch {}
  }, [userId]);

  const completed = payments.filter(p => p.status === 'completed');
  const totalVolume = completed.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingCount = payments.filter(p => ['pending', 'processing'].includes(p.status)).length;
  const recent = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const kpis = [
    {
      label: 'Volume total',
      value: totalVolume > 0 ? `${totalVolume.toLocaleString()}` : '—',
      unit: totalVolume > 0 ? 'USDT' : '',
      sub: 'Transactions complétées',
      icon: TrendingUp,
      color: '#3B968F',
    },
    {
      label: 'En cours',
      value: String(pendingCount),
      unit: '',
      sub: pendingCount > 0 ? 'Paiements actifs' : 'Aucune en cours',
      icon: Clock,
      color: '#f59e0b',
    },
    {
      label: 'Fournisseurs',
      value: String(suppliers.length),
      unit: '',
      sub: 'Contacts enregistrés',
      icon: Users2,
      color: '#8b5cf6',
    },
    {
      label: 'Économies vs SWIFT',
      value: totalVolume > 0 ? `~${Math.round(totalVolume * 0.03).toLocaleString()}` : '—',
      unit: totalVolume > 0 ? 'USDT' : '',
      sub: 'Frais évités estimés',
      icon: Zap,
      color: '#22c55e',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold leading-tight">
            {profile?.companyName || user?.name || 'Votre entreprise'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Vue d'ensemble ·{' '}
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </p>
        </div>
        {!profile?.companyName && (
          <button
            onClick={() => onNavigate('profile')}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs text-[#3B968F] border border-[#3B968F]/25 px-3 py-1.5 rounded-lg hover:bg-[#3B968F]/5 transition-colors"
          >
            Configurer le profil <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl bg-[#111] border border-[#1c1c1c] p-4 hover:border-[#222] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${kpi.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <p className="text-white text-2xl font-bold leading-none">
                {kpi.value}
                {kpi.unit && (
                  <span className="text-gray-500 text-sm font-normal ml-1">{kpi.unit}</span>
                )}
              </p>
              <p className="text-gray-400 text-[11px] font-medium mt-1.5">{kpi.label}</p>
              <p className="text-gray-600 text-[10px] mt-0.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('payment')}
          className="group relative rounded-xl bg-gradient-to-br from-[#3B968F] to-[#2d7870] hover:from-[#3B968F]/90 hover:to-[#2d7870]/90 p-5 text-left transition-all overflow-hidden shadow-lg shadow-[#3B968F]/10"
        >
          <div className="absolute right-3 top-3 w-20 h-20 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-300" />
          <Send className="w-5 h-5 text-white/70 mb-3 relative z-10" />
          <p className="text-white font-semibold text-sm relative z-10">Initier un paiement</p>
          <p className="text-white/50 text-xs mt-1 relative z-10">Payer un fournisseur en USDT</p>
        </button>
        <button
          onClick={() => onNavigate('suppliers')}
          className="group rounded-xl bg-[#111] border border-[#1c1c1c] hover:border-[#3B968F]/20 p-5 text-left transition-all"
        >
          <Plus className="w-5 h-5 text-gray-600 group-hover:text-[#3B968F] mb-3 transition-colors" />
          <p className="text-white font-semibold text-sm">Gérer les fournisseurs</p>
          <p className="text-gray-600 text-xs mt-1">Chine · Dubaï · Turquie · Monde</p>
        </button>
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl bg-[#111] border border-[#1c1c1c] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1c1c1c]">
          <div>
            <h3 className="text-white text-sm font-semibold">Transactions récentes</h3>
            <p className="text-gray-600 text-[11px] mt-0.5">{payments.length} au total</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="flex items-center gap-1 text-[#3B968F] text-xs hover:underline"
          >
            Tout voir <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#3B968F]/8 flex items-center justify-center mx-auto mb-3">
              <Send className="w-4 h-4 text-[#3B968F]/60" />
            </div>
            <p className="text-gray-600 text-sm">Aucune transaction pour le moment</p>
            <button
              onClick={() => onNavigate('payment')}
              className="mt-2 text-[#3B968F] text-xs hover:underline"
            >
              Créer votre premier paiement →
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[1fr_110px_130px_100px] gap-4 px-5 py-2.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wider border-b border-[#181818]">
              <span>Fournisseur</span>
              <span>Réseau</span>
              <span className="text-right">Montant</span>
              <span className="text-right">Statut</span>
            </div>
            <div className="divide-y divide-[#181818]">
              {recent.map(tx => (
                <div
                  key={tx.id}
                  className="flex md:grid md:grid-cols-[1fr_110px_130px_100px] gap-4 px-5 py-3 hover:bg-white/[0.015] transition-colors items-center"
                >
                  <div>
                    <p className="text-white text-xs font-medium leading-tight">
                      {tx.supplierName || 'Fournisseur'}
                    </p>
                    <p className="text-gray-600 text-[10px] mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="text-gray-500 text-xs hidden md:block">
                    {tx.network || '—'}
                  </span>
                  <p className="text-white text-xs font-semibold text-right ml-auto md:ml-0">
                    {(tx.amount || 0).toLocaleString()}{' '}
                    <span className="text-gray-500 font-normal">{tx.currency || 'USDT'}</span>
                  </p>
                  <div className="flex justify-end">
                    <StatusPill status={tx.status} />
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
