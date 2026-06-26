
import { useState } from 'react';
import { Coins, HandCoins, Send, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { TransactionDetails } from './TransactionDetails';
import { useIsMobile } from '@/hooks/use-mobile';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: string;
  currency: string;
  usdtAmount?: string;
  fiatAmount?: string;
  receiveCurrency?: string;
  network: string;
  address?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  date: string;
  recipient_name?: string;
  recipient_phone?: string;
  payment_method?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

const typeConfig = (type: string) => {
  switch (type) {
    case 'buy':      return { label: 'Achat',       Icon: Coins,     color: 'rgba(255,255,255,0.85)' };
    case 'sell':     return { label: 'Vente',       Icon: HandCoins, color: 'rgba(255,255,255,0.85)' };
    case 'transfer': return { label: 'Virement',    Icon: Send,      color: 'rgba(255,255,255,0.85)' };
    default:         return { label: 'Transaction', Icon: Coins,     color: 'rgba(255,255,255,0.85)' };
  }
};

const statusConfig = (status: string) => {
  switch (status) {
    case 'completed':
    case 'confirmed':
      return { label: 'Terminée', Icon: CheckCircle, bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' };
    case 'failed':
      return { label: 'Échouée', Icon: XCircle, bg: 'rgba(248,113,113,0.08)', color: '#f87171' };
    default:
      return { label: 'En attente', Icon: Clock, bg: 'rgba(251,191,36,0.08)', color: '#fbbf24' };
  }
};

const formatDate = (dateString: string) => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return '—'; }
};

const USDTLogo = () => (
  <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" style={{ width: '14px', height: '14px' }} />
);

export function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!transactions || transactions.length === 0) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 12px' }}>
          <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>Historique des transactions</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Consultez toutes vos transactions passées</p>
        </div>
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: ICON_BG, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} color="#4b5563" />
          </div>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px', fontWeight: 500 }}>Aucune transaction</p>
          <p style={{ color: '#374151', fontSize: '12px', margin: 0 }}>Vos opérations apparaîtront ici</p>
        </div>
      </div>
    );
  }

  /* ── Mobile: single box, all rows inside ── */
  if (isMobile) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px 12px' }}>
          <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: '0 0 3px' }}>Historique des transactions</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Consultez toutes vos transactions passées</p>
        </div>

        {transactions.map((tx) => {
          const { label, Icon, color } = typeConfig(tx.type);
          const st = statusConfig(tx.status);
          const StatusIcon = st.Icon;
          const isOpen = expanded === tx.id;

          return (
            <div key={tx.id} style={{ borderTop: `1px solid ${BORDER}` }}>
              {/* Row header */}
              <button
                onClick={() => setExpanded(isOpen ? null : tx.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                {/* Icon */}
                <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={color} strokeWidth={2} />
                </div>

                {/* Label + status */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{label}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '999px', background: st.bg, color: st.color }}>
                      <StatusIcon size={10} />
                      {st.label}
                    </span>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '11px', margin: 0 }}>{formatDate(tx.date)}</p>
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right', flexShrink: 0, marginRight: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                    {tx.type === 'buy' && tx.usdtAmount ? `${tx.usdtAmount} USDT` : `${tx.amount} ${tx.currency}`}
                  </span>
                </div>

                <ChevronDown size={14} color="#4b5563" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  {[
                    { label: 'Montant envoyé', value: `${tx.amount} ${tx.currency}` },
                    tx.type === 'buy' && tx.usdtAmount ? { label: 'Reçu', value: `${tx.usdtAmount} USDT` } : null,
                    (tx.type === 'sell' || tx.type === 'transfer') && tx.fiatAmount ? { label: 'Reçu', value: `${tx.fiatAmount} ${tx.receiveCurrency || ''}` } : null,
                    tx.type !== 'transfer' ? { label: 'Réseau', value: tx.network } : null,
                    tx.type === 'transfer' && tx.recipient_name ? { label: 'Destinataire', value: tx.recipient_name } : null,
                  ].filter(Boolean).map((item: any) => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>{item.label}</span>
                      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '2px' }}>
                    <TransactionDetails transaction={tx} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ── Desktop: table ── */
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: '0 0 3px' }}>Historique des transactions</p>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Consultez toutes vos transactions passées</p>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 120px 140px 160px 60px', padding: '8px 20px', borderTop: `1px solid ${BORDER}` }}>
        {['Type', 'Montant envoyé', 'Reçu', 'Réseau', 'Statut', 'Date', ''].map(h => (
          <span key={h} style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {transactions.map((tx) => {
        const { label, Icon, color } = typeConfig(tx.type);
        const st = statusConfig(tx.status);
        const StatusIcon = st.Icon;
        return (
          <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 120px 140px 160px 60px', alignItems: 'center', padding: '14px 20px', borderTop: `1px solid ${BORDER}` }}>
            {/* Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={color} strokeWidth={2} />
              </div>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{label}</span>
            </div>

            {/* Sent */}
            <span style={{ color: '#fff', fontSize: '13px' }}>{tx.amount} {tx.currency}</span>

            {/* Received */}
            <span style={{ color: '#fff', fontSize: '13px' }}>
              {tx.type === 'buy' && tx.usdtAmount
                ? tx.usdtAmount
                : tx.fiatAmount
                  ? `${tx.fiatAmount}${tx.receiveCurrency ? ` ${tx.receiveCurrency}` : ''}`
                  : <span style={{ color: '#4b5563' }}>—</span>
              }
            </span>

            {/* Network / Recipient */}
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>
              {tx.type === 'transfer' ? (tx.recipient_name || 'Transfert') : tx.network}
            </span>

            {/* Status */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px', background: st.bg, color: st.color, width: 'fit-content' }}>
              <StatusIcon size={11} />
              {st.label}
            </span>

            {/* Date */}
            <span style={{ color: '#6b7280', fontSize: '12px' }}>{formatDate(tx.date)}</span>

            {/* Actions */}
            <TransactionDetails transaction={tx} />
          </div>
        );
      })}
    </div>
  );
}
