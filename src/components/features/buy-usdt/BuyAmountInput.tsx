
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { enforceMaxLimit } from './LimitsValidator';

interface BuyAmountInputProps {
  fiatAmount: string;
  setFiatAmount: (amount: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  usdtAmount: string;
  exchangeRate: number;
}

export function BuyAmountInput({
  fiatAmount,
  setFiatAmount,
  currency,
  setCurrency,
  usdtAmount,
  exchangeRate
}: BuyAmountInputProps) {
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Appliquer la limite maximale
    const limitedValue = enforceMaxLimit(value, currency);
    setFiatAmount(limitedValue);
  };

  // Calcul des frais et du temps de traitement basé sur la devise
  const fee = currency === 'CFA' ? '0%' : '2%';
  const processingTime = currency === 'CFA' ? '5-15 minutes' : '24-48 heures';

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
              onChange={handleAmountChange}
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-20 focus:bg-terex-gray focus:border-terex-gray-light focus-visible:ring-0 focus-visible:ring-offset-0"
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
              type="text"
              value={usdtAmount}
              readOnly
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-24 focus:bg-terex-gray focus:border-terex-gray-light focus-visible:ring-0 focus-visible:ring-offset-0"
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
    </div>
  );
}
