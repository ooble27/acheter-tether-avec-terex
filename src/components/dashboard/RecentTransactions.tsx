
import { useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowDown, ArrowUp, Send, Clock, CheckCircle, RotateCcw } from 'lucide-react';

interface RecentTransactionsProps {
  onNavigate?: (section: string) => void;
}

const TetherLogo = ({ className }: { className?: string }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={className}
  />
);

const TYPE_CONFIG = {
  buy:      { label: 'Achat USDT',  color: '#3b968f', icon: <ArrowDown className="w-4 h-4" />, section: 'buy' },
  sell:     { label: 'Vente USDT',  color: '#ef4444', icon: <ArrowUp   className="w-4 h-4" />, section: 'sell' },
  transfer: { label: 'Virement',    color: '#f97316', icon: <Send       className="w-4 h-4" />, section: 'transfer' },
} as const;

const STATUS_CONFIG = {
  pending:   { label: 'En cours',  bg: 'rgba(234,179,8,0.12)',  text: '#eab308', icon: <Clock       className="w-3 h-3" /> },
  confirmed: { label: 'Terminé',   bg: 'rgba(59,150,143,0.12)', text: '#3b968f', icon: <CheckCircle className="w-3 h-3" /> },
  completed: { label: 'Terminé',   bg: 'rgba(59,150,143,0.12)', text: '#3b968f', icon: <CheckCircle className="w-3 h-3" /> },
} as const;

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function RecentTransactions({ onNavigate }: RecentTransactionsProps) {
  const { transactions, loading, refetch } = useTransactions();
  const { user } = useAuth();

  useEffect(() => {
    if (user && transactions.length === 0 && !loading) refetch();
  }, [user?.id]);

  const recent = transactions.slice(0, 5);

  const shell = (children: React.ReactNode) => (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#222' }}>
        <p className="text-sm font-medium text-white">Activité récente</p>
        {recent.length > 0 && (
          <button
            onClick={() => onNavigate?.('history')}
            className="text-xs transition-colors"
            style={{ color: '#3b968f' }}
          >
            Voir tout
          </button>
        )}
      </div>
      {children}
    </div>
  );

  if (loading && transactions.length === 0) {
    return shell(
      <div className="py-8 text-center">
        <p className="text-xs" style={{ color: '#555' }}>Chargement…</p>
      </div>
    );
  }

  if (recent.length === 0) {
    return shell(
      <div className="py-10 text-center">
        <p className="text-sm text-white mb-1">Aucune transaction</p>
        <p className="text-xs" style={{ color: '#555' }}>Vos échanges apparaîtront ici</p>
      </div>
    );
  }

  return shell(
    <div className="divide-y" style={{ borderColor: '#1f1f1f' }}>
      {recent.map(tx => {
        const type   = TYPE_CONFIG[tx.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.buy;
        const status = STATUS_CONFIG[tx.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;

        return (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
            {/* Icône colorée */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${type.color}15`, color: type.color }}>
              {type.icon}
            </div>

            {/* Info principale */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-white">{type.label}</span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: status.bg, color: status.text }}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs" style={{ color: '#777' }}>
                  {tx.amount} {tx.currency}
                </span>
                {tx.usdtAmount && (
                  <>
                    <span className="text-xs" style={{ color: '#444' }}>→</span>
                    <TetherLogo className="w-3 h-3" />
                    <span className="text-xs font-medium" style={{ color: '#3b968f' }}>{tx.usdtAmount} USDT</span>
                  </>
                )}
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: '#444' }}>{formatDate(tx.date)}</p>
            </div>

            {/* Bouton refaire */}
            <button
              onClick={() => onNavigate?.(type.section)}
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
              style={{ background: '#1e1e1e', color: '#555' }}
              title="Refaire"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
