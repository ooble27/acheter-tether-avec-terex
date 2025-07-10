
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { ArrowUp, ArrowDown, Send, Clock, CheckCircle, RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

export function RecentTransactions({ onNavigate }: RecentTransactionsProps) {
  const isMobile = useIsMobile();
  const { transactions, loading, loadTransactions } = useTransactions();

  // Load transactions when component mounts
  React.useEffect(() => {
    loadTransactions();
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDown className="w-4 h-4 text-terex-accent" />;
      case 'sell':
        return <ArrowUp className="w-4 h-4 text-red-600" />;
      case 'transfer':
        return <Send className="w-4 h-4 text-orange-600" />;
      default:
        return <ArrowDown className="w-4 h-4 text-terex-accent" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'buy':
        return 'Achat USDT';
      case 'sell':
        return 'Vente USDT';
      case 'transfer':
        return 'Virement';
      default:
        return 'Achat USDT';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case 'confirmed':
      case 'completed':
        return (
          <Badge variant="outline" className="text-xs border-green-500 text-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

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

  // Show only the 3 most recent transactions
  const recentTransactions = transactions.slice(0, 3);

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-3">
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-white text-sm font-medium">Activité récente</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-center py-4">
            <p className="text-gray-400 text-xs">Aucune transaction récente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-medium">Activité récente</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('history')}
            className="text-terex-accent hover:text-terex-accent/80 text-xs p-1 h-auto"
          >
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-2 bg-terex-gray/20 rounded-lg">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getTransactionIcon(transaction.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-xs font-medium truncate">
                      {getTransactionLabel(transaction.type)}
                    </span>
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-gray-400 text-xs">
                      {transaction.amount} {transaction.currency}
                    </span>
                    {transaction.usdtAmount && (
                      <>
                        <span className="text-gray-500 text-xs">→</span>
                        <TetherLogo className="w-3 h-3" />
                        <span className="text-terex-accent text-xs">{transaction.usdtAmount}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRepeatTransaction(transaction)}
                className="ml-2 p-1 h-auto text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10"
                title="Refaire cette transaction"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
