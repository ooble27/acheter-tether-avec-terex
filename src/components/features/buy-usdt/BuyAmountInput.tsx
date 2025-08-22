
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
  paymentMethod: string;
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white text-sm font-medium">Montant à acheter</Label>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-terex-accent border-terex-accent text-xs">
            Frais: {fee}
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
            {processingTime}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Montant Fiat */}
        <div className="space-y-2">
          <Label className="text-white text-sm">Vous payez</Label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.00"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
            />
            {disableCurrencyChange ? (
              <div className="bg-terex-gray border border-terex-gray-light text-white h-12 w-20 flex items-center justify-center rounded">
                {currency}
              </div>
            ) : (
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CFA">CFA</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Montant USDT */}
        <div className="space-y-2">
          <Label className="text-white text-sm">Vous recevez</Label>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={usdtAmount}
              readOnly
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
            />
            <div className="bg-terex-gray border border-terex-gray-light text-white h-12 w-20 flex items-center justify-center rounded">
              USDT
            </div>
          </div>
        </div>
      </div>

      {/* Taux de change */}
      <div className="bg-terex-gray/30 p-3 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Taux de change</span>
          <span className="text-white">1 USDT = {exchangeRate} {currency}</span>
        </div>
      </div>

      {/* Montants rapides */}
      {!disableCurrencyChange && (
        <QuickAmounts 
          currency={currency}
          onAmountSelect={setFiatAmount}
        />
      )}
    </div>
  );
}
