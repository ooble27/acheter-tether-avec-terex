import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Activity, ShoppingCart, Wallet, Send, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';

interface Stats {
  totalTransactions: number;
  buyCount: number;
  sellCount: number;
  transferCount: number;
  totalVolume: number;
}

export function UserStatsWidget() {
  const { transactions, loading } = useTransactions();
  const [stats, setStats] = useState<Stats>({
    totalTransactions: 0,
    buyCount: 0,
    sellCount: 0,
    transferCount: 0,
    totalVolume: 0
  });

  useEffect(() => {
    if (transactions.length > 0) {
      const buyTx = transactions.filter(t => t.type === 'buy');
      const sellTx = transactions.filter(t => t.type === 'sell');
      const transferTx = transactions.filter(t => t.type === 'transfer');
      
      const totalVolume = transactions.reduce((sum, tx) => {
        const amount = parseFloat(tx.usdtAmount || tx.amount || '0');
        return sum + amount;
      }, 0);

      setStats({
        totalTransactions: transactions.length,
        buyCount: buyTx.length,
        sellCount: sellTx.length,
        transferCount: transferTx.length,
        totalVolume
      });
    }
  }, [transactions]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-accent/20 p-4 rounded-xl">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-terex-gray/30 rounded w-32" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-terex-gray/30 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const statItems = [
    { icon: Activity, label: 'Transactions', value: stats.totalTransactions, change: '+5' },
    { icon: ShoppingCart, label: 'Achats', value: stats.buyCount, change: '+2' },
    { icon: Wallet, label: 'Ventes', value: stats.sellCount, change: '+1' },
    { icon: Send, label: 'Transferts', value: stats.transferCount, change: '+2' },
  ];

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-accent/20 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Statistiques</h3>
        <span className="text-xs text-gray-500">30 derniers jours</span>
      </div>
      
      {/* Volume Card */}
      <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-transparent border border-terex-accent/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-terex-accent/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-terex-accent" />
            <span className="text-gray-400 text-xs">Volume total</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{stats.totalVolume.toLocaleString('fr-FR')}</span>
            <span className="text-terex-accent text-sm font-semibold">USDT</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-terex-teal text-xs">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.5% ce mois</span>
          </div>
        </div>
      </div>
      
      {/* Stats List */}
      <div className="space-y-2">
        {statItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-terex-gray/10 hover:bg-terex-gray/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-terex-gray/30 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-300 text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold font-mono">{item.value}</span>
              <span className="text-terex-teal text-xs bg-terex-teal/10 px-1.5 py-0.5 rounded">{item.change}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
