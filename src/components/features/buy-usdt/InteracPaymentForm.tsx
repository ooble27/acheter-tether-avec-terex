
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InteracPaymentData {
  firstName: string;
  lastName: string;
  interacEmail: string;
  phoneNumber?: string;
}

interface InteracPaymentFormProps {
  interacData: InteracPaymentData;
  setInteracData: (data: InteracPaymentData) => void;
}

export function InteracPaymentForm({ interacData, setInteracData }: InteracPaymentFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Informations pour le paiement Interac</h3>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Prénom *</Label>
            <Input
              value={interacData.firstName}
              onChange={(e) => setInteracData({...interacData, firstName: e.target.value})}
              className="bg-terex-gray border-terex-gray-light text-white"
              placeholder="Jean"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Nom *</Label>
            <Input
              value={interacData.lastName}
              onChange={(e) => setInteracData({...interacData, lastName: e.target.value})}
              className="bg-terex-gray border-terex-gray-light text-white"
              placeholder="Dupont"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Email Interac *</Label>
          <Input
            type="email"
            value={interacData.interacEmail}
            onChange={(e) => setInteracData({...interacData, interacEmail: e.target.value})}
            className="bg-terex-gray border-terex-gray-light text-white"
            placeholder="votre@email.com"
            required
          />
          <p className="text-gray-400 text-xs">
            L'email associé à votre compte Interac pour envoyer le virement
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Numéro de téléphone (optionnel)</Label>
          <Input
            type="tel"
            value={interacData.phoneNumber || ''}
            onChange={(e) => setInteracData({...interacData, phoneNumber: e.target.value})}
            className="bg-terex-gray border-terex-gray-light text-white"
            placeholder="+1 (XXX) XXX-XXXX"
          />
        </div>
      </div>
    </div>
  );
}
