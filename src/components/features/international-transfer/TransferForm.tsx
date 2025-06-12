
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
  provider: string;
  setProvider: (value: string) => void;
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
  provider,
  setProvider
}: TransferFormProps) {
  // Calcul des frais selon le service choisi
  const calculateFinalAmount = () => {
    if (!sendAmount || !receiveMethod) return '0.00';
    
    const baseAmount = parseFloat(sendAmount) * exchangeRate;
    
    if (receiveMethod === 'mobile') {
      if (provider === 'wave') {
        // Déduction de 1% pour Wave
        return (baseAmount * 0.99).toFixed(2);
      } else if (provider === 'orange') {
        // Déduction de 0.8% pour Orange Money
        return (baseAmount * 0.992).toFixed(2);
      }
    }
    
    return baseAmount.toFixed(2);
  };

  const finalReceiveAmount = calculateFinalAmount();

  return (
    <div className="space-y-6">
      {/* Méthode de réception - MAINTENANT EN PREMIER */}
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
              onClick={() => {
                setReceiveMethod(method.id);
                if (method.id !== 'mobile') {
                  setProvider(''); // Reset provider si ce n'est pas mobile money
                }
              }}
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

      {/* Sélection Wave/Orange Money si Mobile Money est sélectionné */}
      {receiveMethod === 'mobile' && (
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Quel service Mobile Money ?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              onClick={() => setProvider('wave')}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                provider === 'wave'
                  ? 'border-terex-accent bg-terex-accent/10'
                  : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/6399d0b4-abb9-4b62-97ad-516c0213a601.png" 
                  alt="Wave" 
                  className="w-8 h-8 rounded-full object-contain"
                />
                <div>
                  <p className="text-white font-medium text-sm">Wave</p>
                  <p className="text-gray-400 text-xs">Frais: 1%</p>
                </div>
              </div>
            </div>
            
            <div
              onClick={() => setProvider('orange')}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                provider === 'orange'
                  ? 'border-terex-accent bg-terex-accent/10'
                  : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/49a20f85-382b-4dd2-aefe-98214bea6069.png" 
                  alt="Orange Money" 
                  className="w-8 h-8 rounded-full object-contain"
                />
                <div>
                  <p className="text-white font-medium text-sm">Orange Money</p>
                  <p className="text-gray-400 text-xs">Frais: 0.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <Label className="text-white text-sm font-medium">Destinataire</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={finalReceiveAmount}
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
              <span className="text-gray-400">Frais Terex</span>
              <span className="text-green-500 font-medium">GRATUIT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Délai</span>
              <span className="text-terex-accent">3-5 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total à payer</span>
              <span className="text-white font-semibold">{sendAmount || '0.00'} CAD</span>
            </div>
          </div>
          
          {receiveMethod === 'mobile' && (provider === 'wave' || provider === 'orange') && (
            <div className="mt-3 pt-3 border-t border-terex-gray-light">
              <div className="flex justify-between text-sm">
                <span className="text-yellow-400">
                  Frais {provider === 'wave' ? 'Wave (1%)' : 'Orange Money (0.8%)'}
                </span>
                <span className="text-yellow-400">
                  -{(parseFloat(sendAmount || '0') * exchangeRate * (provider === 'wave' ? 0.01 : 0.008)).toFixed(2)} CFA
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold mt-1">
                <span className="text-white">Montant final reçu</span>
                <span className="text-terex-accent">{finalReceiveAmount} CFA</span>
              </div>
            </div>
          )}
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
    </div>
  );
}
