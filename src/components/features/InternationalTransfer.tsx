
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setShowKYC(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Vérification requise</h1>
              <p className="text-gray-400">Veuillez compléter votre vérification d'identité</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800/50 border-r border-gray-700 min-h-screen p-4">
            <div className="mb-8">
              <h2 className="text-white text-lg font-semibold mb-4">TEREX</h2>
              <p className="text-gray-400 text-sm">CRYPTO EXCHANGE</p>
            </div>
            
            <nav className="space-y-3">
              <div className="text-gray-400 px-4 py-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <span>💰 Acheter USDT</span>
              </div>
              <div className="text-gray-400 px-4 py-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <span>📈 Vendre USDT</span>
              </div>
              <div className="bg-teal-500/20 text-teal-400 px-4 py-3 rounded-lg border border-teal-500/30">
                <span className="font-medium">🌍 Virement International</span>
              </div>
              <div className="text-gray-400 px-4 py-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <span>📊 Trading OTC</span>
              </div>
              <div className="text-gray-400 px-4 py-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <span>👤 Mon Profil</span>
              </div>
              <div className="text-gray-400 px-4 py-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <span>❓ FAQ</span>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {currentStep === 'form' && (
              <div className="max-w-5xl">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">Virement International</h1>
                  <p className="text-gray-400">Transferts rapides et sécurisés vers l'Afrique</p>
                  <div className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm mt-2 inline-block border border-teal-500/30">
                    Taux en temps réel
                  </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Main Form */}
                  <div className="lg:col-span-3">
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white text-xl">Virement International</CardTitle>
                        <CardDescription className="text-gray-400">
                          Envoyez de l'argent facilement vers l'Afrique
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Amount Section */}
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h3 className="text-white text-lg font-semibold mb-4">💰 Montant à envoyer</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300 text-sm">Montant</Label>
                              <Input
                                placeholder="100"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-gray-700/50 border-gray-600 text-white h-12 text-lg"
                                type="number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300 text-sm">Devise d'envoi</Label>
                              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  <SelectItem value="CAD" className="text-white hover:bg-gray-700">
                                    🇨🇦 CAD (Dollar Canadien)
                                  </SelectItem>
                                  <SelectItem value="USD" className="text-white hover:bg-gray-700">
                                    🇺🇸 USD (Dollar Américain)
                                  </SelectItem>
                                  <SelectItem value="EUR" className="text-white hover:bg-gray-700">
                                    🇪🇺 EUR (Euro)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {/* Exchange Rate */}
                          <div className="flex items-center justify-center text-gray-400 text-sm mt-4">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            1 {fromCurrency} = {exchangeRates[`${fromCurrency}-${toCurrency}` as keyof typeof exchangeRates]} CFA
                          </div>
                        </div>

                        {/* Recipient Information */}
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h3 className="text-white text-lg font-semibold mb-4">👤 Informations du destinataire</h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300 text-sm">Nom complet</Label>
                              <Input
                                placeholder="Nom complet du destinataire"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="bg-gray-700/50 border-gray-600 text-white h-12"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300 text-sm">Téléphone</Label>
                              <Input
                                placeholder="+221 XX XXX XX XX"
                                value={recipientPhone}
                                onChange={(e) => setRecipientPhone(e.target.value)}
                                className="bg-gray-700/50 border-gray-600 text-white h-12"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Pays de destination</Label>
                            <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12">
                                <SelectValue placeholder="Sélectionnez le pays" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="senegal" className="text-white hover:bg-gray-700">
                                  🇸🇳 Sénégal
                                </SelectItem>
                                <SelectItem value="mali" className="text-white hover:bg-gray-700">
                                  🇲🇱 Mali
                                </SelectItem>
                                <SelectItem value="burkina_faso" className="text-white hover:bg-gray-700">
                                  🇧🇫 Burkina Faso
                                </SelectItem>
                                <SelectItem value="cote_ivoire" className="text-white hover:bg-gray-700">
                                  🇨🇮 Côte d'Ivoire
                                </SelectItem>
                                <SelectItem value="niger" className="text-white hover:bg-gray-700">
                                  🇳🇪 Niger
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h3 className="text-white text-lg font-semibold mb-4">💳 Méthodes de paiement</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300 text-sm">Comment payer</Label>
                              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  <SelectItem value="interac" className="text-white hover:bg-gray-700">
                                    💳 Interac e-Transfer
                                  </SelectItem>
                                  <SelectItem value="bank_transfer" className="text-white hover:bg-gray-700">
                                    🏦 Virement bancaire
                                  </SelectItem>
                                  <SelectItem value="card" className="text-white hover:bg-gray-700">
                                    💎 Carte bancaire
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300 text-sm">Comment recevoir</Label>
                              <Select value={receiveMethod} onValueChange={setReceiveMethod}>
                                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  <SelectItem value="mobile_money" className="text-white hover:bg-gray-700">
                                    📱 Mobile Money
                                  </SelectItem>
                                  <SelectItem value="wave" className="text-white hover:bg-gray-700">
                                    🌊 Wave
                                  </SelectItem>
                                  <SelectItem value="orange_money" className="text-white hover:bg-gray-700">
                                    🍊 Orange Money
                                  </SelectItem>
                                  <SelectItem value="bank_account" className="text-white hover:bg-gray-700">
                                    🏛️ Compte bancaire
                                  </SelectItem>
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
                          className="w-full h-12 text-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          Continuer vers la confirmation
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-4">
                    {/* Exchange Rate */}
                    {amount && (
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg">Estimation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <p className="text-gray-300 text-sm mb-2">Le destinataire recevra</p>
                            <p className="text-2xl font-bold text-teal-400">
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
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">Avantages</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
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
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                          <span className="text-gray-300 text-sm">Livraison en 24-48h</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Popular Countries */}
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3">
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
      </div>
    </KYCProtection>
  );
}
