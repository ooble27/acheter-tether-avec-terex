
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Send, AlertCircle, ArrowLeft, Globe, Users, CreditCard, Smartphone } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
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
      </div>
    );
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-black p-4">
        <div className="max-w-7xl mx-auto">
          {currentStep === 'form' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Virement International</h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Envoyez de l'argent rapidement et en toute sécurité vers l'Afrique
                </p>
              </div>

              <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-3">
                  <Card className="bg-terex-darker/50 border-terex-gray backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-white text-2xl flex items-center">
                        <Globe className="w-6 h-6 mr-3 text-blue-500" />
                        Détails du transfert
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-lg">
                        Remplissez les informations pour votre transfert international
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Amount and Currency Section */}
                      <div className="bg-terex-gray/30 rounded-lg p-6">
                        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                          Montant à envoyer
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="amount" className="text-gray-300 text-base font-medium">
                              Montant
                            </Label>
                            <Input
                              id="amount"
                              placeholder="100"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="bg-terex-gray border-terex-gray text-white h-12 text-lg"
                              type="number"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="fromCurrency" className="text-gray-300 text-base font-medium">
                              Devise d'envoi
                            </Label>
                            <Select value={fromCurrency} onValueChange={setFromCurrency}>
                              <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12">
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
                      </div>

                      {/* Recipient Information */}
                      <div className="bg-terex-gray/30 rounded-lg p-6">
                        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-purple-500" />
                          Informations du destinataire
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="recipientName" className="text-gray-300 text-base font-medium">
                              Nom complet
                            </Label>
                            <Input
                              id="recipientName"
                              placeholder="Nom complet du destinataire"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              className="bg-terex-gray border-terex-gray text-white h-12"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="recipientPhone" className="text-gray-300 text-base font-medium">
                              Téléphone
                            </Label>
                            <Input
                              id="recipientPhone"
                              placeholder="+221 XX XXX XX XX"
                              value={recipientPhone}
                              onChange={(e) => setRecipientPhone(e.target.value)}
                              className="bg-terex-gray border-terex-gray text-white h-12"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <Label htmlFor="recipientCountry" className="text-gray-300 text-base font-medium">
                            Pays de destination
                          </Label>
                          <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                            <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12 mt-3">
                              <SelectValue placeholder="Sélectionnez le pays" />
                            </SelectTrigger>
                            <SelectContent className="bg-terex-darker border-terex-gray">
                              <SelectItem value="senegal" className="text-white hover:bg-terex-gray">🇸🇳 Sénégal</SelectItem>
                              <SelectItem value="mali" className="text-white hover:bg-terex-gray">🇲🇱 Mali</SelectItem>
                              <SelectItem value="burkina_faso" className="text-white hover:bg-terex-gray">🇧🇫 Burkina Faso</SelectItem>
                              <SelectItem value="cote_ivoire" className="text-white hover:bg-terex-gray">🇨🇮 Côte d'Ivoire</SelectItem>
                              <SelectItem value="niger" className="text-white hover:bg-terex-gray">🇳🇪 Niger</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div className="bg-terex-gray/30 rounded-lg p-6">
                        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                          <Smartphone className="w-5 h-5 mr-2 text-terex-accent" />
                          Méthodes de paiement
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="paymentMethod" className="text-gray-300 text-base font-medium">
                              Comment payer
                            </Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-terex-darker border-terex-gray">
                                <SelectItem value="interac" className="text-white hover:bg-terex-gray">💳 Interac e-Transfer</SelectItem>
                                <SelectItem value="bank_transfer" className="text-white hover:bg-terex-gray">🏦 Virement bancaire</SelectItem>
                                <SelectItem value="card" className="text-white hover:bg-terex-gray">💎 Carte bancaire</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="receiveMethod" className="text-gray-300 text-base font-medium">
                              Comment recevoir
                            </Label>
                            <Select value={receiveMethod} onValueChange={setReceiveMethod}>
                              <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-terex-darker border-terex-gray">
                                <SelectItem value="mobile_money" className="text-white hover:bg-terex-gray">📱 Mobile Money</SelectItem>
                                <SelectItem value="wave" className="text-white hover:bg-terex-gray">🌊 Wave</SelectItem>
                                <SelectItem value="orange_money" className="text-white hover:bg-terex-gray">🍊 Orange Money</SelectItem>
                                <SelectItem value="bank_account" className="text-white hover:bg-terex-gray">🏛️ Compte bancaire</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

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
                            exchangeRate: exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates],
                            fees: '0',
                          };

                          setOrderData(newOrderData);
                          setCurrentStep('confirmation');
                        }}
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-500/90 hover:to-purple-600/90 text-white"
                      >
                        Continuer vers la confirmation
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Exchange Rate */}
                  {amount && (
                    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Estimation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <p className="text-gray-300 text-sm mb-2">Le destinataire recevra</p>
                          <p className="text-2xl font-bold text-blue-400">
                            {(parseFloat(amount) * exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates] || 0).toFixed(0)} CFA
                          </p>
                        </div>
                        <div className="text-center text-sm text-gray-400">
                          1 {fromCurrency} = {exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates]} CFA
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Features */}
                  <Card className="bg-terex-darker/50 border-terex-gray">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Avantages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-gray-300 text-sm">Transferts sécurisés et rapides</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-gray-300 text-sm">Taux de change compétitifs</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-gray-300 text-sm">Support client 24/7</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-terex-accent rounded-full mt-2"></div>
                        <span className="text-gray-300 text-sm">Livraison en 24-48h</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Popular Countries */}
                  <Card className="bg-terex-darker/50 border-terex-gray">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Pays populaires</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇸🇳</span>
                        <span className="text-gray-300">Sénégal</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇨🇮</span>
                        <span className="text-gray-300">Côte d'Ivoire</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇲🇱</span>
                        <span className="text-gray-300">Mali</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'confirmation' && orderData && (
            <TransferConfirmation
              transferData={orderData}
              onConfirm={async () => {
                try {
                  const transfer = await createTransfer({
                    amount: parseFloat(amount),
                    from_currency: fromCurrency,
                    to_currency: toCurrency,
                    recipient_name: recipientName,
                    recipient_phone: recipientPhone,
                    recipient_country: recipientCountry,
                    payment_method: paymentMethod,
                    receive_method: receiveMethod,
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
        </div>
      </div>
    </KYCProtection>
  );
}
