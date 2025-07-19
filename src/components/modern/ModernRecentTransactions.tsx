
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ModernTransactionItem } from './ModernTransactionItem';
import { useTransactions } from '@/hooks/useTransactions';

interface ModernRecentTransactionsProps {
  onNavigate?: (section: string) => void;
}

export function ModernRecentTransactions({ onNavigate }: ModernRecentTransactionsProps) {
  const { transactions } = useTransactions();

  const handleRepeatTransaction = (transaction: any) => {
    if (onNavigate) {
      switch (transaction.type) {
        case 'buy':
          onNavigate('buy');
          break;
        case 'sell':
          onNavigate('sell');
          break;
        case 'transfer':
          onNavigate('transfer');
          break;
        default:
          onNavigate('buy');
      }
    }
  };

  const recentTransactions = transactions.slice(0, 3);

  if (recentTransactions.length === 0) {
    return (
      <Card className="bg-white/50 border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 text-lg font-semibold">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Aucune transaction récente</p>
            <p className="text-gray-400 text-xs mt-1">Vos transactions apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/50 border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 text-lg font-semibold">Activité récente</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('history')}
            className="text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10 rounded-xl text-sm font-medium"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.map((transaction) => (
          <ModernTransactionItem
            key={transaction.id}
            transaction={transaction}
            onRepeat={handleRepeatTransaction}
          />
        ))}
      </CardContent>
    </Card>
  );
}
