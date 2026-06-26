import React, { useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, HandCoins, Send, RotateCcw, ChevronRight } from 'lucide-react';

interface RecentTransactionsProps {
  onNavigate?: (section: string) => void;
}

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#3B968F';

const TetherLogo = () => (
  <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" style={{ width: '12px', height: '12px' }} />
);

export function RecentTransactions({ onNavigate }: RecentTransactionsProps) {
  const { transactions, loading, refetch } = useTransactions();
  const { user } = useAuth();

  useEffect(() => {
    if (user && transactions.length === 0 && !loading) refetch();
  }, [user?.id]);

  const recentTransactions = transactions.slice(0, 5);

  const typeConfig = (type: string) => {
    const iconBg = 'rgba(255,255,255,0.06)';
    const iconColor = 'rgba(255,255,255,0.85)';
    switch (type) {
      case 'buy':      return { label: 'Achat USDT',  Icon: Coins,     iconColor, iconBg };
      case 'sell':     return { label: 'Vente USDT',  Icon: HandCoins, iconColor, iconBg };
      case 'transfer': return { label: 'Virement',    Icon: Send,      iconColor, iconBg };
      default:         return { label: 'Transaction', Icon: Coins,     iconColor, iconBg };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return '—'; }
  };

  const repeat = (tx: any) => {
    const map: Record<string, string> = { buy: 'buy', sell: 'sell', transfer: 'transfer' };
    onNavigate?.(map[tx.type] || 'buy');
  };

  return (
    <div style={{ background: CARD, borderRadius: '20px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
        <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: 0 }}>Activité récente</p>
        {transactions.length > 0 && (
          <button
            onClick={() => onNavigate?.('history')}
            style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'none', border: 'none', color: ACCENT, fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '4px 0' }}
          >
            Voir tout <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && transactions.length === 0 && (
        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          <p style={{ color: '#4b5563', fontSize: '13px', margin: 0 }}>Chargement...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && recentTransactions.length === 0 && (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} color="#4b5563" />
          </div>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px', fontWeight: 500 }}>Aucune transaction</p>
          <p style={{ color: '#374151', fontSize: '12px', margin: 0 }}>Vos opérations apparaîtront ici</p>
        </div>
      )}

      {/* Transactions list */}
      {recentTransactions.map((tx, i) => {
        const { label, Icon, iconColor, iconBg } = typeConfig(tx.type);
        const isLast = i === recentTransactions.length - 1;
        return (
          <div
            key={tx.id}
            style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}
          >
            {/* Icon */}
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={17} color={iconColor} strokeWidth={2} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{label}</span>
                <span style={{
                  fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '999px',
                  background: tx.status === 'completed' || tx.status === 'confirmed' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                  color: tx.status === 'completed' || tx.status === 'confirmed' ? '#4ade80' : '#fbbf24',
                }}>
                  {tx.status === 'completed' || tx.status === 'confirmed' ? 'Terminé' : 'En cours'}
                </span>
              </div>
              <p style={{ color: '#4b5563', fontSize: '11px', margin: 0 }}>{formatDate(tx.date)}</p>
            </div>

            {/* Amount */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginBottom: '2px' }}>
                <TetherLogo />
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{tx.usdtAmount || '—'}</span>
              </div>
              <p style={{ color: '#4b5563', fontSize: '11px', margin: 0 }}>{tx.amount?.toLocaleString()} {tx.currency}</p>
            </div>

            {/* Repeat */}
            <button
              onClick={() => repeat(tx)}
              title="Refaire"
              style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <RotateCcw size={13} color="#6b7280" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
