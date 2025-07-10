
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecipientFormProps {
  recipientFirstName: string;
  setRecipientFirstName: (value: string) => void;
  recipientLastName: string;
  setRecipientLastName: (value: string) => void;
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;
  recipientPhone: string;
  setRecipientPhone: (value: string) => void;
  recipientAccount: string;
  setRecipientAccount: (value: string) => void;
  recipientBank: string;
  setRecipientBank: (value: string) => void;
  recipientCountry: string;
  setRecipientCountry: (value: string) => void;
  receiveMethod: string;
  setReceiveMethod: (value: string) => void;
  provider: string;
  setProvider: (value: string) => void;
  isEditable?: boolean;
}

const availableCountries = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' }
];

export function RecipientForm({
  recipientFirstName,
  setRecipientFirstName,
  recipientLastName,
  setRecipientLastName,
  recipientEmail,
  setRecipientEmail,
  recipientPhone,
  setRecipientPhone,
  recipientAccount,
  setRecipientAccount,
  recipientBank,
  setRecipientBank,
  recipientCountry,
  setRecipientCountry,
  receiveMethod,
  setReceiveMethod,
  provider,
  setProvider,
  isEditable = true
}: RecipientFormProps) {
  const getCountryName = (countryCode: string) => {
    const country = availableCountries.find(c => c.code === countryCode);
    return country ? `${country.flag} ${country.name}` : countryCode;
  };

  return (
    <div className="space-y-6 p-4 bg-terex-gray rounded-lg border border-terex-gray-light">
      <Label className="text-white text-lg font-semibold">Informations du destinataire</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Prénom *</Label>
          <Input
            placeholder="Prénom"
            value={recipientFirstName}
            onChange={(e) => setRecipientFirstName(e.target.value)}
            disabled={!isEditable}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Nom de famille *</Label>
          <Input
            placeholder="Nom de famille"
            value={recipientLastName}
            onChange={(e) => setRecipientLastName(e.target.value)}
            disabled={!isEditable}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Email (optionnel)</Label>
          <Input
            placeholder="Email (optionnel)"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            disabled={!isEditable}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Pays *</Label>
          <Select value={recipientCountry} onValueChange={setRecipientCountry} disabled={!isEditable}>
            <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
              <SelectValue placeholder="Sélectionner le pays" />
            </SelectTrigger>
            <SelectContent>
              {availableCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Méthode de réception *</Label>
          <Select value={receiveMethod} onValueChange={setReceiveMethod} disabled={!isEditable}>
            <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
              <SelectValue placeholder="Choisir la méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile">Mobile Money</SelectItem>
              <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
              <SelectItem value="cash_pickup">Retrait en espèces</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {receiveMethod === 'mobile' && (
          <>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Service Mobile Money *</Label>
              <Select value={provider} onValueChange={setProvider} disabled={!isEditable}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                  <SelectValue placeholder="Choisir le service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wave">Wave</SelectItem>
                  <SelectItem value="orange">Orange Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Numéro de téléphone *</Label>
              <Input
                placeholder="Numéro de téléphone"
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                disabled={!isEditable}
                className="bg-terex-gray border-terex-gray-light text-white h-12"
              />
            </div>
          </>
        )}
        
        {receiveMethod !== 'mobile' && (
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Téléphone</Label>
            <Input
              placeholder="Téléphone"
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              disabled={!isEditable}
              className="bg-terex-gray border-terex-gray-light text-white h-12"
            />
          </div>
        )}
      </div>
      
      {receiveMethod === 'bank_transfer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">IBAN / Numéro de compte *</Label>
            <Input
              placeholder="IBAN / Numéro de compte"
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              disabled={!isEditable}
              className="bg-terex-gray border-terex-gray-light text-white h-12"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Nom de la banque *</Label>
            <Input
              placeholder="Nom de la banque"
              value={recipientBank}
              onChange={(e) => setRecipientBank(e.target.value)}
              disabled={!isEditable}
              className="bg-terex-gray border-terex-gray-light text-white h-12"
            />
          </div>
        </div>
      )}
    </div>
  );
}
