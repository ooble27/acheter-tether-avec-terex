
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, CreditCard, Smartphone, MapPin, Phone } from 'lucide-react';

interface TransferFormProps {
  sendAmount: string;
  setSendAmount: (value: string) => void;
  receiveAmount: string;
  recipientCountry: string;
  setRecipientCountry: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  receiveMethod: string;
  setReceiveMethod: (value: string) => void;
  exchangeRate: number;
  fees: string;
  provider?: string;
}

const availableCountries = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' }
];

export function TransferForm({
  sendAmount,
  setSendAmount,
  receiveAmount,
  recipientCountry,
  setRecipientCountry,
  paymentMethod,
  setPaymentMethod,
  receiveMethod,
  setReceiveMethod,
  exchangeRate,
  fees,
  provider
}: TransferFormProps) {
  
  // Calcul des frais des services tiers
  const getServiceFees = () => {
    if (receiveMethod === 'mobile') {
      if (provider === 'wave') return '1%';
      if (provider === 'orange') return '0.8%';
    }
    return '0%';
  };

  const serviceFees = getServiceFees();
  const serviceFeeRate = parseFloat(serviceFees) / 100;
  const totalAmountAfterFees = receiveAmount ? (parseFloat(receiveAmount) * (1 - serviceFeeRate)).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Montant et devises */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">Vous envoyez</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
              />
              <div className="bg-terex-gray border border-terex-gray-light text-white h-12 w-24 flex items-center justify-center rounded">
                CAD
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">Destinataire reçoit</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={totalAmountAfterFees}
                readOnly
                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
              />
              <div className="bg-terex-gray border border-terex-gray-light text-white h-12 w-24 flex items-center justify-center rounded">
                CFA
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
        </div>

        <div className="bg-terex-gray rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Taux de change</span>
              <span className="text-white">1 CAD = {exchangeRate} CFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frais TRX</span>
              <span className="text-green-500 font-medium">GRATUIT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frais service</span>
              <span className="text-orange-400 font-medium">{serviceFees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Délai</span>
              <span className="text-terex-accent">3-5 min</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-gray-400">Total à payer</span>
              <span className="text-white font-semibold">{sendAmount || '0.00'} CAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pays de destination */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Pays de destination</Label>
        <Select value={recipientCountry} onValueChange={setRecipientCountry}>
          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
            <SelectValue placeholder="Sélectionner un pays" />
          </SelectTrigger>
          <SelectContent>
            {availableCountries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center space-x-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Méthode de paiement */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Comment payez-vous ?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'card', label: 'Carte bancaire', icon: CreditCard, desc: 'Visa, Mastercard' },
            { id: 'bank', label: 'Virement bancaire', icon: MapPin, desc: 'Depuis votre banque' },
            { id: 'interac', label: 'Interac E-Transfer', icon: Smartphone, desc: 'Interac' }
          ].map((method) => (
            <div
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? 'border-terex-accent bg-terex-accent/10'
                  : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <method.icon className="w-5 h-5 text-terex-accent" />
                <div>
                  <p className="text-white font-medium text-sm">{method.label}</p>
                  <p className="text-gray-400 text-xs">{method.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Méthode de réception */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Comment le destinataire reçoit-il l'argent ?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'mobile', label: 'Mobile Money', icon: Smartphone, desc: 'Orange Money, Wave' },
            { id: 'bank_transfer', label: 'Virement bancaire', icon: MapPin, desc: 'Directement sur le compte' },
            { id: 'cash_pickup', label: 'Retrait en espèces', icon: Phone, desc: 'Points de retrait' }
          ].map((method) => (
            <div
              key={method.id}
              onClick={() => setReceiveMethod(method.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                receiveMethod === method.id
                  ? 'border-terex-accent bg-terex-accent/10'
                  : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <method.icon className="w-5 h-5 text-terex-accent" />
                <div>
                  <p className="text-white font-medium text-sm">{method.label}</p>
                  <p className="text-gray-400 text-xs">{method.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
