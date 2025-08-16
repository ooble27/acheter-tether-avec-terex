
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function OrdersFilters() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    setAmountMin('');
    setAmountMax('');
    setPaymentMethod('all');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label className="text-gray-400">Date de début</Label>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="bg-terex-gray border-terex-gray text-white focus:bg-terex-gray focus:border-terex-gray focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400">Date de fin</Label>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="bg-terex-gray border-terex-gray text-white focus:bg-terex-gray focus:border-terex-gray focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400">Montant minimum</Label>
        <Input
          type="number"
          placeholder="0"
          value={amountMin}
          onChange={(e) => setAmountMin(e.target.value)}
          className="bg-terex-gray border-terex-gray text-white focus:bg-terex-gray focus:border-terex-gray focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400">Montant maximum</Label>
        <Input
          type="number"
          placeholder="1000000"
          value={amountMax}
          onChange={(e) => setAmountMax(e.target.value)}
          className="bg-terex-gray border-terex-gray text-white focus:bg-terex-gray focus:border-terex-gray focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400">Méthode de paiement</Label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full bg-terex-gray border border-terex-gray text-white rounded-md px-3 py-2 focus:bg-terex-gray focus:border-terex-gray focus:outline-none focus:ring-0"
        >
          <option value="all">Toutes les méthodes</option>
          <option value="bank_transfer">Virement bancaire</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      <div className="flex items-end space-x-2">
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-terex-gray text-white hover:bg-terex-gray"
        >
          Réinitialiser
        </Button>
        <Button className="bg-terex-accent hover:bg-terex-accent/90">
          Appliquer
        </Button>
      </div>
    </div>
  );
}
