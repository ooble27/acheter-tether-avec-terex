
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Send, Clock, CheckCircle, RotateCcw } from 'lucide-react';

const TetherLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={className}
  />
);

interface ModernTransactionItemProps {
  transaction: {
    id: string;
    type: 'buy' | 'sell' | 'transfer';
    amount: string;
    currency: string;
    usdtAmount?: string;
    fiatAmount?: string;
    receiveCurrency?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'failed';
    date: string;
    recipient_name?: string;
  };
  onRepeat?: (transaction: any) => void;
}

export function ModernTransactionItem({ transaction, onRepeat }: ModernTransactionItemProps) {
  const getTransactionConfig = (type: string) => {
    switch (type) {
      case 'buy':
        return {
          icon: ArrowDownLeft,
          label: 'Achat USDT',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      case 'sell':
        return {
          icon: ArrowUpRight,
          label: 'Vente USDT',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
      case 'transfer':
        return {
          icon: Send,
          label: 'Virement',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      default:
        return {
          icon: ArrowDownLeft,
          label: 'Transaction',
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20'
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case 'confirmed':
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
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

  const config = getTransactionConfig(transaction.type);
  const IconComponent = config.icon;

  return (
    <div className="group p-4 bg-white/50 hover:bg-white/80 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Icon Avatar */}
          <div className={`
            w-12 h-12 rounded-2xl border flex items-center justify-center
            ${config.bgColor} ${config.borderColor}
            group-hover:scale-105 transition-transform duration-300
          `}>
            <IconComponent className={`w-5 h-5 ${config.color}`} />
          </div>

          {/* Transaction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-terex-accent transition-colors">
                {config.label}
              </h4>
              {getStatusBadge(transaction.status)}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>{transaction.amount} {transaction.currency}</span>
              {transaction.usdtAmount && (
                <>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center space-x-1">
                    <TetherLogo className="w-3 h-3" />
                    <span className="text-terex-accent font-medium">{transaction.usdtAmount}</span>
                  </div>
                </>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.date)}</p>
          </div>
        </div>

        {/* Repeat Button */}
        {onRepeat && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRepeat(transaction)}
            className="w-8 h-8 rounded-xl text-gray-400 hover:text-terex-accent hover:bg-terex-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
