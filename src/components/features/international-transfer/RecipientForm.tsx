
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
  const inputClasses = "bg-terex-gray border-terex-gray-light text-white h-12 focus:bg-terex-gray focus:border-terex-gray-light focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-transparent focus:shadow-none";
  const inputStyle = { 
    boxShadow: 'none',
    outline: 'none',
    border: '1px solid #3A3A3A'
  };

  return (
    <div className="space-y-4">
      <Label className="text-white text-sm font-medium">Informations du destinataire</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Prénom"
          value={recipientFirstName}
          onChange={(e) => setRecipientFirstName(e.target.value)}
          className={inputClasses}
          style={inputStyle}
        />
        <Input
          placeholder="Nom de famille"
          value={recipientLastName}
          onChange={(e) => setRecipientLastName(e.target.value)}
          className={inputClasses}
          style={inputStyle}
        />
        <Input
          placeholder="Email (optionnel)"
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className={inputClasses}
          style={inputStyle}
        />
        {receiveMethod !== 'mobile' && (
          <Input
            placeholder="Téléphone"
            type="tel"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            className={inputClasses}
            style={inputStyle}
          />
        )}
      </div>
      
      {receiveMethod === 'bank_transfer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            placeholder="IBAN / Numéro de compte"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            className={inputClasses}
            style={inputStyle}
          />
          <Input
            placeholder="Nom de la banque"
            value={recipientBank}
            onChange={(e) => setRecipientBank(e.target.value)}
            className={inputClasses}
            style={inputStyle}
          />
        </div>
      )}
    </div>
  );
}
