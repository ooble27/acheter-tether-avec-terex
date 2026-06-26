
import { useEffect } from 'react';
import { TransactionHistory } from '@/components/features/TransactionHistory';
import { useTransactions } from '@/hooks/useTransactions';
import { RefreshCw, Download, Coins, HandCoins, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

export function TransactionHistoryPage() {
  const { transactions, loading, refetch } = useTransactions();
  const { toast } = useToast();

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({ title: 'Historique mis à jour', description: 'Vos transactions ont été actualisées.' });
    } catch {
      toast({ title: 'Erreur', description: "Impossible de mettre à jour l'historique.", variant: 'destructive' });
    }
  };

  const total = transactions?.length || 0;
  const completed = transactions?.filter(t => t.status === 'completed' || t.status === 'confirmed').length || 0;
  const pending = transactions?.filter(t => t.status === 'pending').length || 0;

  const stats = [
    { label: 'Total',     value: total,     Icon: Coins    },
    { label: 'Terminées', value: completed,  Icon: HandCoins },
    { label: 'En cours',  value: pending,    Icon: Clock    },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px 120px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ color: '#6b7280', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Compte</p>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Historique</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '10px 16px', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : undefined }} />
            Actualiser
          </button>
          <button
            disabled
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '10px 16px', color: '#4b5563', fontSize: '13px', fontWeight: 500, cursor: 'not-allowed' }}
          >
            <Download size={14} />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {stats.map(({ label, value, Icon }) => (
          <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color="rgba(255,255,255,0.75)" strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 500, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <p style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
