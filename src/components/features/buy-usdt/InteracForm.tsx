
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InteracData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface InteracFormProps {
  interacData: InteracData;
  setInteracData: (data: InteracData) => void;
}

export function InteracForm({ interacData, setInteracData }: InteracFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Informations pour le virement Interac</h3>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Prénom</Label>
            <Input
              value={interacData.firstName}
              onChange={(e) => setInteracData({...interacData, firstName: e.target.value})}
              className="bg-terex-gray border-terex-gray-light text-white"
              placeholder="Jean"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Nom de famille</Label>
            <Input
              value={interacData.lastName}
              onChange={(e) => setInteracData({...interacData, lastName: e.target.value})}
              className="bg-terex-gray border-terex-gray-light text-white"
              placeholder="Dupont"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Email Interac</Label>
          <Input
            type="email"
            value={interacData.email}
            onChange={(e) => setInteracData({...interacData, email: e.target.value})}
            className="bg-terex-gray border-terex-gray-light text-white"
            placeholder="jean.dupont@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Téléphone (optionnel)</Label>
          <Input
            type="tel"
            value={interacData.phone}
            onChange={(e) => setInteracData({...interacData, phone: e.target.value})}
            className="bg-terex-gray border-terex-gray-light text-white"
            placeholder="+1 (XXX) XXX-XXXX"
          />
        </div>
      </div>
    </div>
  );
}
