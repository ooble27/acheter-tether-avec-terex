
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';
import { PaymentPage } from './PaymentPage';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { KYCProtection } from './KYCProtection';

export function BuyUSDT() {
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation' | 'payment'>('form');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'wave' | 'orange_money' | 'card' | 'bank' | 'bank_transfer' | 'interac'>('mobile');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [orderData, setOrderData] = useState<any>(null);
  const [showKYC, setShowKYC] = useState(false);
  
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const exchangeRate = 656; // 1 USDT = 656 CFA

  const calculateUSDT = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return 0;
    return parsedAmount / exchangeRate;
  };

  const usdtAmount = calculateUSDT();

  const handleCreateOrder = async () => {
    if (!amount || !currency || !paymentMethod || !walletAddress || !network) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    const newOrderData = {
      amount: parseFloat(amount),
      currency: currency,
      paymentMethod: paymentMethod,
      walletAddress: walletAddress,
      network: network,
      usdtAmount: usdtAmount,
    };

    setOrderData(newOrderData);
    setCurrentStep('confirmation');
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
              <div className="bg-teal-500/20 text-teal-400 px-4 py-3 rounded-lg border border-teal-500/30">
                <span className="font-medium">💰 Acheter USDT</span>
              </div>
              <div className="text-gray-400 px-4 py-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                <span>📈 Vendre USDT</span>
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
                  <h1 className="text-3xl font-bold text-white mb-2">Acheter USDT</h1>
                  <p className="text-gray-400">Achetez des USDT facilement et en toute sécurité</p>
                  <div className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm mt-2 inline-block border border-teal-500/30">
                    Taux en temps réel
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Form */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white text-xl">Acheter USDT</CardTitle>
                        <CardDescription className="text-gray-400">
                          Remplissez le formulaire ci-dessous
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Amount and Payment Method Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Je paie</Label>
                            <div className="relative">
                              <Input
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-gray-700/50 border-gray-600 text-white h-12 text-lg pr-16"
                                type="number"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                {currency}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Je reçois</Label>
                            <div className="relative">
                              <Input
                                value={usdtAmount.toFixed(6)}
                                readOnly
                                className="bg-gray-700/50 border-gray-600 text-white h-12 text-lg pr-20"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm flex items-center">
                                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-4 h-4 mr-1" />
                                USDT
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
                            <span className="text-teal-400">Instantané</span>
                          </div>
                        </div>

                        {/* Receive Method */}
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm">Réseau de réception</Label>
                          <Select value={network} onValueChange={setNetwork}>
                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="TRC20" className="text-white hover:bg-gray-700">
                                TRC20 (Tron) - Recommandé
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Wallet Address */}
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm">Adresse de réception (Votre Portefeuille)</Label>
                          <Input
                            placeholder="Votre adresse USDT TRC20"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            className="bg-gray-700/50 border-gray-600 text-white h-12"
                          />
                          <p className="text-xs text-gray-500">
                            Envoyez vos USDT à cette adresse sur le Réseau TRC20
                          </p>
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
                                <SelectValue placeholder="Méthode de paiement" />
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
                                <SelectItem value="card" className="text-white hover:bg-gray-700">
                                  💳 Carte bancaire
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button
                          onClick={handleCreateOrder}
                          className="w-full h-12 text-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          Confirmer l'achat
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
              <OrderConfirmation
                orderData={{
                  amount: orderData.amount,
                  currency: orderData.currency,
                  paymentMethod: orderData.paymentMethod,
                  walletAddress: orderData.walletAddress,
                  network: orderData.network,
                  usdtAmount: usdtAmount.toFixed(2),
                  exchangeRate: exchangeRate,
                }}
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
                      type: 'buy',
                      amount: parseFloat(amount),
                      currency: currency,
                      usdt_amount: usdtAmount,
                      exchange_rate: exchangeRate,
                      payment_method: paymentMethod,
                      wallet_address: walletAddress,
                      network: network,
                      status: 'pending',
                      payment_status: 'pending'
                    });

                    if (order) {
                      setCurrentStep('payment');
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
            
            {currentStep === 'payment' && orderData && (
              <PaymentPage
                orderData={{
                  amount: orderData.amount,
                  currency: orderData.currency,
                  paymentMethod: orderData.paymentMethod,
                  walletAddress: orderData.walletAddress,
                  network: orderData.network,
                  usdtAmount: usdtAmount.toFixed(2),
                  exchangeRate: exchangeRate,
                }}
                onBack={() => setCurrentStep('confirmation')}
                onPaymentComplete={() => {
                  toast({
                    title: "Paiement confirmé",
                    description: "Votre commande a été traitée avec succès.",
                  });
                  setCurrentStep('form');
                  setAmount('');
                  setWalletAddress('');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </KYCProtection>
  );
}
