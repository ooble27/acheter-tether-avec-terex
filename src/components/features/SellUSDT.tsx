
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { SellOrderConfirmation } from './SellOrderConfirmation';
import { USDTSendingInstructions } from './USDTSendingInstructions';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { KYCProtection } from './KYCProtection';

export function SellUSDT() {
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation' | 'instructions'>('form');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'wave' | 'orange_money' | 'bank_transfer'>('mobile');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [showKYC, setShowKYC] = useState(false);
  
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const exchangeRate = 656; // 1 USDT = 656 CFA

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
              <div className="bg-teal-500/20 text-teal-400 px-4 py-3 rounded-lg border border-teal-500/30">
                <span className="font-medium">📈 Vendre USDT</span>
              </div>
              <div className="text-gray-400 px-4 py-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <span>🌍 Virement International</span>
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
              <div className="max-w-4xl">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">Vendre USDT</h1>
                  <p className="text-gray-400">Vendez vos USDT et recevez de l'argent fiat</p>
                  <div className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm mt-2 inline-block border border-teal-500/30">
                    Taux en temps réel
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Form */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white text-xl">Vendre USDT</CardTitle>
                        <CardDescription className="text-gray-400">
                          Remplissez le formulaire ci-dessous
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Amount and Receive Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Je vends</Label>
                            <div className="relative">
                              <Input
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-gray-700/50 border-gray-600 text-white h-12 text-lg pr-20"
                                type="number"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm flex items-center">
                                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-4 h-4 mr-1" />
                                USDT
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Je reçois</Label>
                            <div className="relative">
                              <Input
                                value={((parseFloat(amount) || 0) * exchangeRate).toFixed(0)}
                                readOnly
                                className="bg-gray-700/50 border-gray-600 text-white h-12 text-lg pr-16"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                CFA
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Exchange Rate */}
                        <div className="flex items-center justify-center text-gray-400 text-sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          1 USDT = {exchangeRate} CFA
                        </div>

                        {/* Rate Info */}
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Taux de change</span>
                            <span className="text-white">0%</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Frais</span>
                            <span className="text-white">0%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Temps de traitement</span>
                            <span className="text-teal-400">24-48H</span>
                          </div>
                        </div>

                        {/* Send Network */}
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm">Réseau d'envoi</Label>
                          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3">
                            <div className="flex items-center text-white">
                              <span className="text-sm">TRC20 (Tron) - Recommandé</span>
                            </div>
                          </div>
                        </div>

                        {/* Receive Address */}
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm">Adresse de réception (Notre Portefeuille)</Label>
                          <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-3">
                            <p className="text-white text-sm font-mono break-all">
                              TSPULXHo6QdKwxpXACJaGkCZbCNxnJyDC6
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Envoyez vos USDT à cette adresse sur le Réseau TRC20
                            </p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm">Informations bancaires</Label>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-gray-400 text-xs">Nom du titulaire du compte</Label>
                              <Input
                                placeholder="Votre nom complet"
                                className="bg-gray-700/50 border-gray-600 text-white h-10 mt-1"
                              />
                            </div>
                            <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12">
                                <SelectValue placeholder="Méthode de réception" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="mobile" className="text-white hover:bg-gray-700">
                                  📱 Mobile Money
                                </SelectItem>
                                <SelectItem value="wave" className="text-white hover:bg-gray-700">
                                  🌊 Wave
                                </SelectItem>
                                <SelectItem value="orange_money" className="text-white hover:bg-gray-700">
                                  🍊 Orange Money
                                </SelectItem>
                                <SelectItem value="bank_transfer" className="text-white hover:bg-gray-700">
                                  🏦 Virement bancaire
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder={paymentMethod === 'bank_transfer' ? 'Numéro de compte bancaire' : 'Numéro de téléphone'}
                              value={recipientNumber}
                              onChange={(e) => setRecipientNumber(e.target.value)}
                              className="bg-gray-700/50 border-gray-600 text-white h-10"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            if (!amount || !recipientNumber) {
                              toast({
                                title: "Erreur",
                                description: "Veuillez remplir tous les champs.",
                                variant: "destructive",
                              });
                              return;
                            }

                            const newOrderData = {
                              amount: parseFloat(amount),
                              paymentMethod: paymentMethod,
                              recipientNumber: recipientNumber,
                              fiatAmount: parseFloat(amount) * exchangeRate,
                            };

                            setOrderData(newOrderData);
                            setCurrentStep('confirmation');
                          }}
                          className="w-full h-12 text-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          Confirmer la vente
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-4">
                    {/* Price Info */}
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">Prix du marché</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">USDT/USD</span>
                          <span className="text-white text-sm">$1.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">USDT/CFA</span>
                          <span className="text-white text-sm">{exchangeRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">USDT/CAD</span>
                          <span className="text-white text-sm">1.34</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">🛡️ Sécurité</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-300">Cryptage avancé</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-300">Vérification sécurisée</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-300">Fonds sécurisés</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-300">Support 24/7</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 'confirmation' && orderData && (
              <SellOrderConfirmation
                orderData={orderData}
                onConfirm={async () => {
                  if (!user) {
                    toast({
                      title: "Erreur",
                      description: "Utilisateur non connecté.",
                      variant: "destructive",
                    });
                    return;
                  }

                  try {
                    const order = await createOrder({
                      user_id: user.id,
                      type: 'sell',
                      amount: orderData.amount,
                      currency: 'USDT',
                      usdt_amount: orderData.amount,
                      exchange_rate: exchangeRate,
                      payment_method: orderData.paymentMethod,
                      wallet_address: orderData.recipientNumber,
                      network: 'Mobile Money',
                      status: 'pending',
                      payment_status: 'pending'
                    });

                    if (order) {
                      setCurrentStep('instructions');
                    } else {
                      toast({
                        title: "Erreur",
                        description: "Impossible de créer la commande.",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Erreur",
                      description: "Une erreur s'est produite lors de la création de la commande.",
                      variant: "destructive",
                    });
                  }
                }}
                onBack={() => setCurrentStep('form')}
              />
            )}
            
            {currentStep === 'instructions' && orderData && (
              <USDTSendingInstructions
                orderData={orderData}
                onBack={() => setCurrentStep('confirmation')}
                onUSDTSent={() => {
                  toast({
                    title: "Commande créée",
                    description: "Votre ordre de vente a été enregistré.",
                  });
                  setCurrentStep('form');
                  setAmount('');
                  setRecipientNumber('');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </KYCProtection>
  );
}
