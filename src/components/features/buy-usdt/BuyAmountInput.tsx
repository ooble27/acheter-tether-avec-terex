
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { QuickAmounts } from './QuickAmounts';

interface BuyAmountInputProps {
  fiatAmount: string;
  setFiatAmount: (amount: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  usdtAmount: string;
  exchangeRate: number;
  paymentMethod: 'card' | 'mobile' | 'interac';
  processingTime: string;
  fee: string;
  disableCurrencyChange?: boolean;
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
  fee,
  disableCurrencyChange = false
}: BuyAmountInputProps) {
  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    return parseFloat(num.toFixed(2)).toString();
  };

  const availableCurrencies = disableCurrencyChange ? 
    [{ value: 'CAD', label: 'Dollar Canadien (CAD)', flag: '🇨🇦' }] :
    [
      { value: 'CFA', label: 'Franc CFA (XOF)', flag: '🇸🇳' },
      { value: 'CAD', label: 'Dollar Canadien (CAD)', flag: '🇨🇦' }
    ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Payment Method Info */}
        <div className="flex items-center justify-between bg-terex-gray/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm">Temps de traitement:</span>
            <Badge variant="outline" className="text-terex-accent border-terex-accent">
              {processingTime}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm">Frais:</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {fee}
            </Badge>
          </div>
        </div>

        {/* Fiat Amount Input */}
        <div className="space-y-2">
          <Label className="text-white text-sm">Montant à payer</Label>
          <div className="relative">
            <Input
              type="number"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              className="bg-terex-gray border-terex-gray-light text-white text-lg font-semibold pr-20"
              placeholder="0"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Select 
                value={currency} 
                onValueChange={setCurrency}
                disabled={disableCurrencyChange}
              >
                <SelectTrigger className="w-20 h-8 bg-transparent border-none text-white font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      <div className="flex items-center space-x-2">
                        <span>{curr.flag}</span>
                        <span>{curr.value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Amounts */}
        <QuickAmounts
          currency={currency}
          onAmountSelect={setFiatAmount}
          paymentMethod={paymentMethod}
        />

        {/* Exchange Rate */}
        <div className="bg-terex-gray/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Taux de change</span>
            <span className="text-white font-semibold">
              1 USDT = {formatAmount(exchangeRate)} {currency}
            </span>
          </div>
        </div>

        {/* USDT Amount Output */}
        <div className="space-y-2">
          <Label className="text-white text-sm">USDT à recevoir</Label>
          <div className="bg-terex-darker border border-terex-gray rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                  alt="USDT" 
                  className="w-8 h-8"
                />
                <div>
                  <p className="text-terex-accent font-bold text-xl">
                    {formatAmount(usdtAmount)} USDT
                  </p>
                  <p className="text-gray-400 text-sm">Tether USD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
