
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentMethodFormProps {
  paymentMethod: 'card' | 'mobile' | 'binance';
  onPaymentMethodChange: (paymentMethod: 'card' | 'mobile' | 'binance') => void;
}

export function PaymentMethodForm({
  paymentMethod,
  onPaymentMethodChange
}: PaymentMethodFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Méthode de paiement</h3>
      <Select value={paymentMethod} onValueChange={(value) => onPaymentMethodChange(value as 'card' | 'mobile' | 'binance')}>
        <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="card">Carte bancaire</SelectItem>
          <SelectItem value="mobile">Mobile Money</SelectItem>
          <SelectItem value="binance">Binance Pay</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
