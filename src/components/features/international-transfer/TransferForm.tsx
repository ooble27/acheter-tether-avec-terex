
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TransferFormProps {
  sendAmount: string;
  setSendAmount: (amount: string) => void;
  receiveAmount: string;
  recipientCountry: string;
  setRecipientCountry: (country: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  receiveMethod: string;
  setReceiveMethod: (method: string) => void;
  exchangeRate: number;
  fees: string;
}

const countries = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
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
  fees
}: TransferFormProps) {
  const getQuickAmounts = () => {
    return ['50', '100', '200', '500', '1000'];
  };

  return (
    <div className="space-y-6">
      {/* Frais Information */}
      <Alert className="border-terex-accent/30 bg-terex-accent/10">
        <Info className="h-4 w-4 text-terex-accent" />
        <AlertDescription className="text-terex-accent">
          <strong>Chez Terex, les frais sont gratuits.</strong> Cependant, les services tiers appliquent leurs propres frais :
          <br />• Wave : 1 % du montant reçu
          <br />• Orange Money : 0,8 % du montant reçu
        </AlertDescription>
      </Alert>

      {/* Amount Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">J'envoie</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-16"
            />
            <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
              <span className="text-terex-accent font-medium text-sm">CAD</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Le destinataire reçoit</Label>
          <div className="relative">
            <Input
              type="text"
              value={receiveAmount}
              readOnly
              className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-16"
            />
            <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
              <span className="text-terex-accent font-medium text-sm">CFA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
      </div>

      {/* Quick amounts */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Montants rapides</Label>
        <div className="grid grid-cols-5 gap-2">
          {getQuickAmounts().map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setSendAmount(amount)}
              className="bg-terex-gray hover:bg-terex-gray-light border border-terex-gray-light text-white text-sm py-2 rounded transition-colors"
            >
              {amount} CAD
            </button>
          ))}
        </div>
      </div>

      {/* Exchange rate info */}
      <div className="bg-terex-gray rounded-lg p-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Taux de change</span>
          <span className="text-white">1 CAD = {exchangeRate.toFixed(2)} CFA</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Frais Terex</span>
          <span className="text-terex-accent">{fees} CAD (Gratuit)</span>
        </div>
      </div>

      {/* Country Selection */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Pays de destination</Label>
        <Select value={recipientCountry} onValueChange={setRecipientCountry}>
          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
            <SelectValue placeholder="Sélectionnez un pays" />
          </SelectTrigger>
          <SelectContent className="bg-terex-darker border-terex-gray">
            {countries.map((country) => (
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

      {/* Payment Method */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Mode de paiement (depuis le Canada)</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
            <SelectValue placeholder="Choisissez votre mode de paiement" />
          </SelectTrigger>
          <SelectContent className="bg-terex-darker border-terex-gray">
            <SelectItem value="interac">
              <div className="flex items-center space-x-2">
                <span>💳</span>
                <span>Interac E-Transfer</span>
              </div>
            </SelectItem>
            <SelectItem value="card">
              <div className="flex items-center space-x-2">
                <span>💰</span>
                <span>Carte bancaire</span>
              </div>
            </SelectItem>
            <SelectItem value="bank">
              <div className="flex items-center space-x-2">
                <span>🏦</span>
                <span>Virement bancaire</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Receive Method */}
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Mode de réception (en Afrique)</Label>
        <Select value={receiveMethod} onValueChange={setReceiveMethod}>
          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
            <SelectValue placeholder="Comment le destinataire recevra l'argent" />
          </SelectTrigger>
          <SelectContent className="bg-terex-darker border-terex-gray">
            <SelectItem value="mobile">
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>Mobile Money (Wave, Orange Money)</span>
              </div>
            </SelectItem>
            <SelectItem value="bank">
              <div className="flex items-center space-x-2">
                <span>🏦</span>
                <span>Compte bancaire</span>
              </div>
            </SelectItem>
            <SelectItem value="cash">
              <div className="flex items-center space-x-2">
                <span>💵</span>
                <span>Retrait en espèces</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
