
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface BuyAmountInputProps {
  fiatAmount: string;
  setFiatAmount: (amount: string) => void;
  usdtAmount: string;
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRate: number;
}

export function BuyAmountInput({
  fiatAmount,
  setFiatAmount,
  usdtAmount,
  currency,
  setCurrency,
  exchangeRate
}: BuyAmountInputProps) {
  const [internalFiatAmount, setInternalFiatAmount] = useState(fiatAmount);
  const [internalUsdtAmount, setInternalUsdtAmount] = useState(usdtAmount);

  useEffect(() => {
    setInternalFiatAmount(fiatAmount);
  }, [fiatAmount]);

  useEffect(() => {
    setInternalUsdtAmount(usdtAmount);
  }, [usdtAmount]);

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    return parseFloat(num.toFixed(2)).toString();
  };

  const calculateUsdtAmount = (fiat: string) => {
    const num = parseFloat(fiat);
    if (isNaN(num)) return '';
    return formatAmount(num / exchangeRate);
  };

  const calculateFiatAmount = (usdt: string) => {
    const num = parseFloat(usdt);
    if (isNaN(num)) return '';
    return formatAmount(num * exchangeRate);
  };

  const handleFiatChange = (value: string) => {
    setInternalFiatAmount(value);
    setInternalUsdtAmount('');
    setFiatAmount(value);
  };

  const handleUsdtChange = (value: string) => {
    setInternalUsdtAmount(value);
    setInternalFiatAmount('');
    const calculatedFiat = calculateFiatAmount(value);
    setFiatAmount(calculatedFiat);
  };

  const displayedFiatAmount = internalFiatAmount;
  const displayedUsdtAmount = internalUsdtAmount || (fiatAmount ? calculateUsdtAmount(fiatAmount) : '');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Je paie</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00"
            value={displayedFiatAmount}
            onChange={(e) => handleFiatChange(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12 pr-20 focus:bg-terex-gray focus:border-terex-gray-light focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="absolute right-1 top-1 w-16 h-10 bg-terex-gray-light border-0 text-terex-accent focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-terex-gray border-terex-gray-light">
              <SelectItem value="CFA" className="text-white hover:bg-terex-gray-light focus:bg-terex-gray-light">CFA</SelectItem>
              <SelectItem value="CAD" className="text-white hover:bg-terex-gray-light focus:bg-terex-gray-light">CAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Je reçois</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00"
            value={displayedUsdtAmount}
            onChange={(e) => handleUsdtChange(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12 pr-24 focus:bg-terex-gray focus:border-terex-gray-light focus-visible:ring-0 focus-visible:ring-offset-0"
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

      <div className="bg-terex-gray rounded-lg p-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Taux TEREX</span>
          <span className="text-white">1 USDT = {exchangeRate} {currency}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Commission</span>
          <span className="text-terex-accent">+2%</span>
        </div>
      </div>
    </div>
  );
}
