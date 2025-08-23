
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface QuickAmountsProps {
  currency: string;
  setFiatAmount: (amount: string) => void;
}

export function QuickAmounts({ currency, setFiatAmount }: QuickAmountsProps) {
  const getQuickAmounts = () => {
    if (currency === 'CFA') {
      return ['50000', '100000', '250000', '500000', '1000000', '1800000'];
    }
    return ['100', '250', '500', '1000', '2500', '4000'];
  };

  return (
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
  );
}
