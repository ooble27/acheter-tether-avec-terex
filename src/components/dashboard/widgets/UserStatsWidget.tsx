import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Globe, TrendingUp } from 'lucide-react';
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
      
      // Calculate total volume (sum of all USDT amounts or fiat amounts)
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

  const statItems = [
    {
      icon: ArrowDownCircle,
      label: 'Achats',
      value: stats.buyCount,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: ArrowUpCircle,
      label: 'Ventes',
      value: stats.sellCount,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      icon: Globe,
      label: 'Transferts',
      value: stats.transferCount,
      color: 'text-terex-accent',
      bgColor: 'bg-terex-accent/20'
    },
    {
      icon: TrendingUp,
      label: 'Volume',
      value: `${stats.totalVolume.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} USDT`,
      color: 'text-terex-highlight',
      bgColor: 'bg-terex-highlight/20',
      isText: true
    }
  ];

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Vos statistiques</h3>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-terex-dark rounded-xl p-3 animate-pulse">
              <div className="h-4 bg-terex-gray rounded w-1/2 mb-2" />
              <div className="h-6 bg-terex-gray rounded w-1/3" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray p-4">
      <h3 className="text-white font-semibold text-sm mb-4">Vos statistiques</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => (
          <div 
            key={index}
            className="bg-terex-dark rounded-xl p-3 hover:bg-terex-gray/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-gray-400 text-xs">{item.label}</span>
            </div>
            <p className={`font-bold ${item.isText ? 'text-sm' : 'text-xl'} text-white`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
