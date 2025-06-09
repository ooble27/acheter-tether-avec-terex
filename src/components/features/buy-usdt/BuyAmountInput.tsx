
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

interface BuyAmountInputProps {
  fiatAmount: string;
  setFiatAmount: (amount: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  usdtAmount: string;
  exchangeRate: number;
  paymentMethod: 'card' | 'mobile';
  processingTime: string;
  fee: string;
}

export function BuyAmountInput({
  fiatAmount,
  setFiatAmount,
  currency,
  setCurrency,
  usdtAmount,
  exchangeRate,
  paymentMethod,
  processingTime,
  fee
}: BuyAmountInputProps) {
  const getQuickAmounts = () => {
    if (currency === 'CFA') {
      return ['10000', '25000', '50000', '100000', '250000'];
    }
    return ['25', '50', '100', '250', '500'];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Je paie</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-20"
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="absolute right-1 top-1 w-16 h-10 bg-terex-gray-light border-0 text-terex-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CFA">CFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Je reçois</Label>
          <div className="relative">
            <Input
              type="text"
              value={usdtAmount}
              readOnly
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-24"
            />
            <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
              <img 
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                alt="USDT" 
                className="w-5 h-5"
              />
              <span className="text-terex-accent font-medium text-sm">USDT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
      </div>

      <div className="bg-terex-gray rounded-lg p-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Taux TEREX (vente)</span>
          <span className="text-white">1 USDT = {exchangeRate} {currency}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Frais</span>
          <span className="text-terex-accent">{fee}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Temps de traitement</span>
          <span className="text-terex-accent">{processingTime}</span>
        </div>
      </div>

      {/* Quick amounts - moved to the bottom */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Montants rapides ({currency})</Label>
        <div className="grid grid-cols-2 gap-2">
          {getQuickAmounts().map((value) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => setFiatAmount(value)}
              className="border-terex-gray text-gray-300 hover:bg-terex-gray text-xs w-full min-w-0 h-8 px-1"
            >
              <span className="truncate">
                {currency === 'CFA' 
                  ? `${parseInt(value).toLocaleString()} CFA`
                  : `$${value} CAD`
                }
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
