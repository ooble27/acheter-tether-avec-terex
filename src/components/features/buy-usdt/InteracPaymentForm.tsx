
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InteracData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface InteracPaymentFormProps {
  interacData: InteracData;
  setInteracData: (data: InteracData) => void;
}

export function InteracPaymentForm({
  interacData,
  setInteracData
}: InteracPaymentFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Informations Interac e-Transfer</h3>
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
            value={interacData.email}
            onChange={(e) => setInteracData({...interacData, email: e.target.value})}
            className="bg-terex-gray border-terex-gray-light text-white"
            placeholder="votre@email.ca"
            required
          />
          <p className="text-gray-400 text-xs">
            Cet email sera utilisé pour l'envoi Interac e-Transfer
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Téléphone (optionnel)</Label>
          <Input
            type="tel"
            value={interacData.phone || ''}
            onChange={(e) => setInteracData({...interacData, phone: e.target.value})}
            className="bg-terex-gray border-terex-gray-light text-white"
            placeholder="+1 (xxx) xxx-xxxx"
          />
        </div>
      </div>
    </div>
  );
}
