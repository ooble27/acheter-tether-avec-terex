
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useTransfers } from '@/hooks/useTransfers';
import { TransactionHistory } from './TransactionHistory';
import { 
  Send, 
  Calculator, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  MapPin,
  DollarSign,
  Users
} from 'lucide-react';

const countries = [
  'France', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 
  'Niger', 'Guinée', 'Bénin', 'Togo', 'Cameroun', 'Gabon'
];

const currencies = [
  { code: 'EUR', name: 'Euro', rate: 655 },
  { code: 'XOF', name: 'Franc CFA BCEAO', rate: 1 },
  { code: 'XAF', name: 'Franc CFA BEAC', rate: 1 },
  { code: 'GNF', name: 'Franc Guinéen', rate: 0.065 }
];

export function InternationalTransfer() {
  const { transfers, loading, createTransfer } = useTransfers();
  const [formData, setFormData] = useState({
    amount: '',
    fromCurrency: 'USDT',
    toCurrency: 'XOF',
    recipientName: '',
    recipientAccount: '',
    recipientBank: '',
    recipientCountry: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangeRate] = useState(655); // USDT to XOF rate
  const fees = 25; // Fixed fees in USDT

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const totalAmount = amount * exchangeRate;
    const totalFees = fees * exchangeRate;
    return { totalAmount, totalFees, finalAmount: totalAmount - totalFees };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (!formData.recipientName || !formData.recipientAccount || !formData.recipientCountry) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsSubmitting(true);
      const { totalAmount } = calculateTotal();
      
      await createTransfer({
        amount,
        from_currency: formData.fromCurrency,
        to_currency: formData.toCurrency,
        recipient_name: formData.recipientName,
        recipient_account: formData.recipientAccount,
        recipient_bank: formData.recipientBank,
        recipient_country: formData.recipientCountry,
        exchange_rate: exchangeRate,
        fees,
        total_amount: totalAmount
      });

      // Reset form
      setFormData({
        amount: '',
        fromCurrency: 'USDT',
        toCurrency: 'XOF',
        recipientName: '',
        recipientAccount: '',
        recipientBank: '',
        recipientCountry: '',
        notes: ''
      });
    } catch (error) {
      console.error('Transfer submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { totalAmount, totalFees, finalAmount } = calculateTotal();

  // Convert transfers to transaction format for history display
  const transactionHistory = transfers.map(transfer => ({
    id: transfer.id,
    type: 'transfer' as const,
    amount: transfer.amount.toString(),
    currency: transfer.from_currency,
    fiatAmount: transfer.total_amount.toString(),
    receiveCurrency: transfer.to_currency,
    network: 'International Wire',
    address: `${transfer.recipient_name} - ${transfer.recipient_country}`,
    status: transfer.status as 'pending' | 'confirmed' | 'completed' | 'failed',
    date: transfer.created_at
  }));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Virement International</h1>
        <p className="text-gray-400">
          Envoyez vos USDT partout dans le monde via virement bancaire
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de virement */}
        <div className="lg:col-span-2">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Send className="w-5 h-5 text-terex-accent" />
                <span>Nouveau virement</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Remplissez les informations pour effectuer un virement international
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Montant et devises */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-white">
                        Montant à envoyer
                      </Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          className="bg-terex-gray border-terex-gray text-white pl-12"
                          required
                        />
                        <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="toCurrency" className="text-white">
                        Devise de réception
                      </Label>
                      <Select 
                        value={formData.toCurrency} 
                        onValueChange={(value) => handleInputChange('toCurrency', value)}
                      >
                        <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-terex-gray border-terex-gray">
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="bg-terex-gray" />

                {/* Informations du destinataire */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium flex items-center space-x-2">
                    <Users className="w-4 h-4 text-terex-accent" />
                    <span>Informations du destinataire</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName" className="text-white">
                        Nom complet du destinataire *
                      </Label>
                      <Input
                        id="recipientName"
                        type="text"
                        placeholder="Jean Dupont"
                        value={formData.recipientName}
                        onChange={(e) => handleInputChange('recipientName', e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientCountry" className="text-white">
                        Pays de destination *
                      </Label>
                      <Select 
                        value={formData.recipientCountry} 
                        onValueChange={(value) => handleInputChange('recipientCountry', value)}
                      >
                        <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent className="bg-terex-gray border-terex-gray">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{country}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientAccount" className="text-white">
                        Numéro de compte / IBAN *
                      </Label>
                      <Input
                        id="recipientAccount"
                        type="text"
                        placeholder="FR76 1234 5678 9012 3456 7890 123"
                        value={formData.recipientAccount}
                        onChange={(e) => handleInputChange('recipientAccount', e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientBank" className="text-white">
                        Nom de la banque
                      </Label>
                      <Input
                        id="recipientBank"
                        type="text"
                        placeholder="Banque Centrale"
                        value={formData.recipientBank}
                        onChange={(e) => handleInputChange('recipientBank', e.target.value)}
                        className="bg-terex-gray border-terex-gray text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white">
                      Notes (optionnel)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Motif du virement..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="bg-terex-gray border-terex-gray text-white"
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.amount}
                  className="w-full bg-terex-accent hover:bg-terex-accent/80 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Initier le virement
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Résumé du virement */}
        <div className="space-y-6">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-terex-accent" />
                <span>Résumé</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Montant à envoyer:</span>
                  <span className="text-white">{formData.amount || '0'} USDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Taux de change:</span>
                  <span className="text-white">1 USDT = {exchangeRate} {formData.toCurrency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frais de service:</span>
                  <span className="text-white">{totalFees.toLocaleString()} {formData.toCurrency}</span>
                </div>
                <Separator className="bg-terex-gray" />
                <div className="flex justify-between font-medium">
                  <span className="text-white">Montant reçu:</span>
                  <span className="text-terex-accent">
                    {finalAmount.toLocaleString()} {formData.toCurrency}
                  </span>
                </div>
              </div>

              <Alert className="bg-terex-gray border-terex-accent/20">
                <AlertCircle className="w-4 h-4 text-terex-accent" />
                <AlertDescription className="text-gray-300 text-sm">
                  Le virement sera traité sous 1-3 jours ouvrables selon le pays de destination.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white text-sm">Devises disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currencies.map((currency) => (
                  <div key={currency.code} className="flex justify-between text-xs">
                    <span className="text-gray-400">{currency.code}</span>
                    <span className="text-white">{currency.rate}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historique des virements */}
      <TransactionHistory transactions={transactionHistory} />
    </div>
  );
}
