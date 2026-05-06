import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowDownLeft, ArrowUpRight, Send, Clock, CheckCircle, RotateCcw } from 'lucide-react';

interface RecentTransactionsProps {
  onNavigate?: (section: string) => void;
}

const UsdtIcon = ({ size = 14 }: { size?: number }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
  />
);

const txConfig: Record<string, { label: string; iconColor: string; iconBg: string; Icon: React.ElementType }> = {
  buy:      { label: 'Achat USDT',    iconColor: '#3B968F', iconBg: 'rgba(59,150,143,0.12)', Icon: ArrowDownLeft },
  sell:     { label: 'Vente USDT',   iconColor: '#f87171', iconBg: 'rgba(248,113,113,0.1)',  Icon: ArrowUpRight   },
  transfer: { label: 'Virement',     iconColor: '#60a5fa', iconBg: 'rgba(96,165,250,0.1)',   Icon: Send           },
};

const statusConfig: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  pending:   { label: 'En cours',  color: '#fbbf24', Icon: Clock        },
  confirmed: { label: 'Terminé',   color: '#3B968F', Icon: CheckCircle  },
  completed: { label: 'Terminé',   color: '#3B968F', Icon: CheckCircle  },
};

export function RecentTransactions({ onNavigate }: RecentTransactionsProps) {
  const { transactions, loading, refetch } = useTransactions();
  const { user } = useAuth();

  useEffect(() => {
    if (user && transactions.length === 0 && !loading) refetch();
  }, [user?.id]);

  const recentTransactions = transactions.slice(0, 4);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 62, borderRadius: 14, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '28px 16px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>Aucune transaction récente</p>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 4 }}>Effectuez votre premier achat USDT</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {recentTransactions.map((tx) => {
        const cfg = txConfig[tx.type] || txConfig.buy;
        const status = statusConfig[tx.status] || statusConfig.pending;
        const StatusIcon = status.Icon;
        const TxIcon = cfg.Icon;

        return (
          <div
            key={tx.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '12px 14px',
            }}
          >
            {/* icon */}
            <div style={{
              width: 40, height: 40, flexShrink: 0,
              borderRadius: 12,
              background: cfg.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TxIcon size={18} color={cfg.iconColor} strokeWidth={1.8} />
            </div>

            {/* info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{cfg.label}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <StatusIcon size={11} color={status.color} />
                  <span style={{ color: status.color, fontSize: 10, fontWeight: 500 }}>{status.label}</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                  {tx.amount} {tx.currency}
                </span>
                {tx.usdtAmount && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>→</span>
                    <UsdtIcon size={12} />
                    <span style={{ color: '#3B968F', fontSize: 11, fontWeight: 500 }}>{tx.usdtAmount} USDT</span>
                  </>
                )}
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginLeft: 'auto' }}>
                  {formatDate(tx.date)}
                </span>
              </div>
            </div>

            {/* repeat btn */}
            <button
              onClick={() => onNavigate?.(tx.type === 'transfer' ? 'transfer' : tx.type)}
              style={{
                width: 32, height: 32, flexShrink: 0,
                borderRadius: 10,
                background: 'rgba(59,150,143,0.08)',
                border: '1px solid rgba(59,150,143,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
              title="Refaire"
            >
              <RotateCcw size={13} color="rgba(59,150,143,0.8)" />
            </button>
          </div>
        );
      })}

      <button
        onClick={() => onNavigate?.('history')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '10px',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 12,
          fontWeight: 500,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        Voir tout l'historique
      </button>
    </div>
  );
}
