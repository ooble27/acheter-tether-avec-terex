
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  receiveMethod: string;
}

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
  receiveMethod
}: RecipientFormProps) {
  return (
    <div className="space-y-4">
      <Label className="text-white text-sm font-medium">Informations du destinataire</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Prénom"
          value={recipientFirstName}
          onChange={(e) => setRecipientFirstName(e.target.value)}
          className="bg-terex-gray border-terex-gray-light text-white h-12"
        />
        <Input
          placeholder="Nom de famille"
          value={recipientLastName}
          onChange={(e) => setRecipientLastName(e.target.value)}
          className="bg-terex-gray border-terex-gray-light text-white h-12"
        />
        <Input
          placeholder="Email (optionnel)"
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="bg-terex-gray border-terex-gray-light text-white h-12"
        />
        {receiveMethod !== 'mobile' && (
          <Input
            placeholder="Téléphone"
            type="tel"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        )}
      </div>
      
      {receiveMethod === 'bank_transfer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            placeholder="IBAN / Numéro de compte"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
          <Input
            placeholder="Nom de la banque"
            value={recipientBank}
            onChange={(e) => setRecipientBank(e.target.value)}
            className="bg-terex-gray border-terex-gray-light text-white h-12"
          />
        </div>
      )}
    </div>
  );
}
