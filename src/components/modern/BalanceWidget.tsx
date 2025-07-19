
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

interface BalanceWidgetProps {
  balance?: string;
  currency?: string;
  trend?: number;
}

export function BalanceWidget({ 
  balance = "0", 
  currency = "FCFA", 
  trend = 0 
}: BalanceWidgetProps) {
  const [isVisible, setIsVisible] = useState(true);

  const formatBalance = (amount: string) => {
    if (!isVisible) return "••••••";
    const num = parseFloat(amount);
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <Card className="bg-gradient-to-br from-terex-accent to-terex-accent/80 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Solde total</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-white text-3xl font-bold">
                {formatBalance(balance)}
              </span>
              <span className="text-white/80 text-lg font-medium">
                {currency}
              </span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(!isVisible)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
          >
            {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
        </div>

        {trend !== 0 && (
          <div className="flex items-center space-x-2">
            <div className={`
              flex items-center space-x-1 px-3 py-1.5 rounded-full
              ${trend > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}
            `}>
              <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">
                {Math.abs(trend)}% ce mois
              </span>
            </div>
          </div>
        )}

        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full rounded-full bg-white transform translate-x-8 -translate-y-8" />
        </div>
      </CardContent>
    </Card>
  );
}
