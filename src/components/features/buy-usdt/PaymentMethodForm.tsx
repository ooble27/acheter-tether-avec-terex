
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardData {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

interface MobileData {
  phoneNumber: string;
  provider: 'wave' | 'orange';
}

interface PaymentMethodFormProps {
  paymentMethod: 'card' | 'mobile';
  cardData: CardData;
  setCardData: (data: CardData) => void;
  mobileData: MobileData;
  setMobileData: (data: MobileData) => void;
}

export function PaymentMethodForm({
  paymentMethod,
  cardData,
  setCardData,
  mobileData,
  setMobileData
}: PaymentMethodFormProps) {
  if (paymentMethod === 'card') {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-medium">Informations de carte</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Nom sur la carte</Label>
            <Input
              value={cardData.name}
              onChange={(e) => setCardData({...cardData, name: e.target.value})}
              className="bg-terex-gray border-terex-gray-light text-white"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Numéro de carte</Label>
            <Input
              value={cardData.number}
              onChange={(e) => setCardData({...cardData, number: e.target.value})}
              className="bg-terex-gray border-terex-gray-light text-white"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white text-sm">Mois</Label>
              <Select value={cardData.expiryMonth} onValueChange={(value) => setCardData({...cardData, expiryMonth: value})}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 12}, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white text-sm">Année</Label>
              <Select value={cardData.expiryYear} onValueChange={(value) => setCardData({...cardData, expiryYear: value})}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                  <SelectValue placeholder="AA" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 10}, (_, i) => (
                    <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                      {String(new Date().getFullYear() + i).slice(-2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white text-sm">CVV</Label>
              <Input
                value={cardData.cvv}
                onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                className="bg-terex-gray border-terex-gray-light text-white"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Comment souhaitez-vous payer ?</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label className="text-white text-sm">Service de paiement</Label>
          <Select value={mobileData.provider} onValueChange={(value) => setMobileData({...mobileData, provider: value as 'wave' | 'orange'})}>
            <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wave">
                <div className="flex items-center space-x-2">
                  <img src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" alt="Wave" className="w-4 h-4" />
                  <span>Wave</span>
                </div>
              </SelectItem>
              <SelectItem value="orange">
                <div className="flex items-center space-x-2">
                  <img src="/lovable-uploads/86b4b50f-9595-46c2-8cce-30343f23454a.png" alt="Orange Money" className="w-4 h-4" />
                  <span>Orange Money</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Numéro de téléphone</Label>
          <Input
            value={mobileData.phoneNumber}
            onChange={(e) => setMobileData({...mobileData, phoneNumber: e.target.value})}
            className="bg-terex-gray border-terex-gray-light text-white"
            placeholder="+221 XX XXX XX XX"
          />
        </div>
      </div>
    </div>
  );
}
