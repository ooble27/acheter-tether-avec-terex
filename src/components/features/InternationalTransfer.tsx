
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Send, AlertCircle, ArrowLeft } from 'lucide-react';
import { TransferConfirmation } from './international-transfer/TransferConfirmation';
import { TransferPending } from './international-transfer/TransferPending';
import { useToast } from '@/hooks/use-toast';
import { useInternationalTransfers } from '@/hooks/useInternationalTransfers';
import { useAuth } from '@/contexts/AuthContext';
import { KYCProtection } from './KYCProtection';

export function InternationalTransfer() {
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation' | 'pending'>('form');
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('CAD');
  const [toCurrency, setToCurrency] = useState('CFA');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('interac');
  const [receiveMethod, setReceiveMethod] = useState('mobile_money');
  const [orderData, setOrderData] = useState<any>(null);
  const [showKYC, setShowKYC] = useState(false);
  
  const { toast } = useToast();
  const { createTransfer } = useInternationalTransfers();
  const { user } = useAuth();

  const exchangeRates = {
    'CAD-CFA': 493,
    'USD-CFA': 656,
    'EUR-CFA': 710
  };

  const handleKYCRequired = () => {
    setShowKYC(true);
  };

  if (showKYC) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowKYC(false)}
            className="border-terex-gray text-gray-300 hover:bg-terex-gray"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Vérification requise</h1>
            <p className="text-gray-400">Veuillez compléter votre vérification d'identité</p>
          </div>
        </div>
        <Alert className="border-terex-gray bg-terex-darker">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-gray-300">
            Vous devez vérifier votre identité pour effectuer des virements internationaux. 
            Rendez-vous dans votre profil pour commencer la vérification.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      {currentStep === 'form' && (
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Virement International
            </CardTitle>
            <CardDescription className="text-gray-400">
              Envoyez de l'argent rapidement vers l'Afrique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">Montant à envoyer</Label>
                <Input
                  id="amount"
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-terex-gray border-terex-gray text-white"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromCurrency" className="text-gray-300">Devise d'envoi</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="CAD" className="text-white hover:bg-terex-gray">CAD (Dollar Canadien)</SelectItem>
                    <SelectItem value="USD" className="text-white hover:bg-terex-gray">USD (Dollar Américain)</SelectItem>
                    <SelectItem value="EUR" className="text-white hover:bg-terex-gray">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName" className="text-gray-300">Nom du destinataire</Label>
                <Input
                  id="recipientName"
                  placeholder="Nom complet du destinataire"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone" className="text-gray-300">Téléphone du destinataire</Label>
                <Input
                  id="recipientPhone"
                  placeholder="+221 XX XXX XX XX"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="bg-terex-gray border-terex-gray text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientCountry" className="text-gray-300">Pays de destination</Label>
              <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                  <SelectValue placeholder="Sélectionnez le pays" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="senegal" className="text-white hover:bg-terex-gray">Sénégal</SelectItem>
                  <SelectItem value="mali" className="text-white hover:bg-terex-gray">Mali</SelectItem>
                  <SelectItem value="burkina_faso" className="text-white hover:bg-terex-gray">Burkina Faso</SelectItem>
                  <SelectItem value="cote_ivoire" className="text-white hover:bg-terex-gray">Côte d'Ivoire</SelectItem>
                  <SelectItem value="niger" className="text-white hover:bg-terex-gray">Niger</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-gray-300">Méthode de paiement</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="interac" className="text-white hover:bg-terex-gray">Interac e-Transfer</SelectItem>
                    <SelectItem value="bank_transfer" className="text-white hover:bg-terex-gray">Virement bancaire</SelectItem>
                    <SelectItem value="card" className="text-white hover:bg-terex-gray">Carte bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiveMethod" className="text-gray-300">Méthode de réception</Label>
                <Select value={receiveMethod} onValueChange={setReceiveMethod}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="mobile_money" className="text-white hover:bg-terex-gray">Mobile Money</SelectItem>
                    <SelectItem value="wave" className="text-white hover:bg-terex-gray">Wave</SelectItem>
                    <SelectItem value="orange_money" className="text-white hover:bg-terex-gray">Orange Money</SelectItem>
                    <SelectItem value="bank_account" className="text-white hover:bg-terex-gray">Compte bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {amount && (
              <div className="p-4 bg-terex-gray rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Montant à recevoir :</span>
                  <span className="font-medium text-terex-accent">
                    {(parseFloat(amount) * exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates] || 0).toFixed(0)} CFA
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-300">Taux de change :</span>
                  <span className="text-white">
                    1 {fromCurrency} = {exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates]} CFA
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                if (!amount || !recipientName || !recipientPhone || !recipientCountry) {
                  toast({
                    title: "Erreur",
                    description: "Veuillez remplir tous les champs requis.",
                    variant: "destructive",
                  });
                  return;
                }

                const newOrderData = {
                  sendAmount: amount,
                  receiveAmount: (parseFloat(amount) * (exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates] || 0)).toFixed(0),
                  recipientCountry,
                  paymentMethod,
                  receiveMethod,
                  recipientFirstName: recipientName.split(' ')[0] || '',
                  recipientLastName: recipientName.split(' ').slice(1).join(' ') || '',
                  recipientPhone,
                  exchangeRate: exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates] || 0,
                  fees: '0',
                };

                setOrderData(newOrderData);
                setCurrentStep('confirmation');
              }}
              className="bg-terex-accent hover:bg-terex-accent/80 w-full"
            >
              Continuer vers la confirmation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
      
      {currentStep === 'confirmation' && orderData && (
        <TransferConfirmation
          transferData={orderData}
          onConfirm={async () => {
            try {
              const transfer = await createTransfer({
                amount: parseFloat(orderData.sendAmount),
                from_currency: fromCurrency,
                to_currency: toCurrency,
                recipient_name: `${orderData.recipientFirstName} ${orderData.recipientLastName}`,
                recipient_phone: orderData.recipientPhone,
                recipient_country: orderData.recipientCountry,
                payment_method: orderData.paymentMethod,
                receive_method: orderData.receiveMethod,
                exchange_rate: orderData.exchangeRate,
                total_amount: parseFloat(orderData.receiveAmount),
                fees: 0
              });

              if (transfer) {
                setCurrentStep('pending');
              }
            } catch (error) {
              toast({
                title: "Erreur",
                description: "Une erreur s'est produite lors de la création du transfert.",
                variant: "destructive",
              });
            }
          }}
          onBack={() => setCurrentStep('form')}
        />
      )}
      
      {currentStep === 'pending' && orderData && (
        <TransferPending
          transferData={orderData}
          onBackToDashboard={() => {
            setCurrentStep('form');
            setAmount('');
            setRecipientName('');
            setRecipientPhone('');
            setRecipientCountry('');
          }}
        />
      )}
    </KYCProtection>
  );
}
