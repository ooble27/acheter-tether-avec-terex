import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Shield, Clock, CreditCard, CheckCircle, Copy } from 'lucide-react';
import { OrderConfirmation } from '@/components/features/OrderConfirmation';
import { USDTSendingInstructions } from '@/components/features/USDTSendingInstructions';
import { USDTSentConfirmation } from '@/components/features/USDTSentConfirmation';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Adresses de portefeuille par réseau - Vos vraies adresses
const WALLET_ADDRESSES = {
  TRC20: 'TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb',
  BEP20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84', 
  ERC20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Arbitrum: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Polygon: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84'
};

export function SellUSDT() {
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile'>('bank');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bankData, setBankData] = useState({
    accountNumber: '',
    bankName: '',
    accountHolder: ''
  });

  const [mobileData, setMobileData] = useState({
    phoneNumber: '',
    provider: 'wave' as 'wave' | 'orange'
  });

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();

  const exchangeRates = {
    CFA: 615,
    CAD: 1.35
  };

  // Fonction pour formater les nombres - améliorée
  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    // Si c'est un nombre entier, ne pas afficher de décimales
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    // Sinon, limiter à 2 décimales et enlever les zéros inutiles
    return parseFloat(num.toFixed(2)).toString();
  };

  const fiatAmount = usdtAmount ? formatAmount(parseFloat(usdtAmount) * exchangeRates[currency as keyof typeof exchangeRates]) : '0';

  const paymentMethods = [
    { id: 'bank' as const, name: 'Virement bancaire', icon: '🏦', fee: '0%', time: '24-48h' },
    { id: 'mobile' as const, name: 'Mobile Money', icon: '📱', fee: '0%', time: 'Instantané' }
  ];

  const getQuickAmounts = () => {
    return ['10', '50', '100', '500', '1000'];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "L'adresse a été copiée dans le presse-papiers",
    });
  };

  const handleSellClick = () => {
    if (!usdtAmount) {
      return;
    }
    
    if (paymentMethod === 'bank' && (!bankData.accountNumber || !bankData.bankName || !bankData.accountHolder)) {
      return;
    }
    
    if (paymentMethod === 'mobile' && !mobileData.phoneNumber) {
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Mapper les méthodes de paiement pour la base de données
    const dbPaymentMethod = paymentMethod === 'bank' ? 'card' : 'mobile';
    
    const orderData = {
      user_id: user.id,
      type: 'sell',
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRates[currency as keyof typeof exchangeRates],
      payment_method: dbPaymentMethod as 'card' | 'mobile',
      network,
      wallet_address: WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
      status: 'pending' as const,
      payment_status: 'pending',
      // Stocker les informations dans les notes au lieu du champ phone_number qui n'existe pas
      notes: JSON.stringify({
        phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : bankData.accountNumber,
        provider: paymentMethod === 'mobile' ? mobileData.provider : 'bank',
        paymentMethod: paymentMethod,
        bankData: paymentMethod === 'bank' ? bankData : null,
        mobileData: paymentMethod === 'mobile' ? mobileData : null
      })
    };

    const result = await createOrder(orderData);
    
    if (result) {
      setShowConfirmation(false);
      setShowInstructions(true);
    }
    
    setLoading(false);
  };

  const handleUSDTSent = () => {
    setShowInstructions(false);
    setShowFinalConfirmation(true);
  };

  const handleBackToHome = () => {
    // Réinitialiser tous les états
    setUsdtAmount('');
    setBankData({ accountNumber: '', bankName: '', accountHolder: '' });
    setMobileData({ phoneNumber: '', provider: 'wave' });
    setShowFinalConfirmation(false);
  };

  // État de confirmation finale
  if (showFinalConfirmation) {
    return (
      <USDTSentConfirmation
        orderData={{
          amount: fiatAmount,
          currency,
          usdtAmount,
          phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : bankData.accountNumber,
          provider: paymentMethod === 'mobile' ? mobileData.provider : 'bank'
        }}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // État des instructions d'envoi
  if (showInstructions) {
    return (
      <USDTSendingInstructions
        orderData={{
          amount: fiatAmount,
          currency,
          usdtAmount,
          network,
          walletAddress: WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
          paymentMethod: paymentMethod as 'card' | 'mobile',
          exchangeRate: exchangeRates[currency as keyof typeof exchangeRates],
          phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : bankData.accountNumber,
          provider: paymentMethod === 'mobile' ? mobileData.provider : 'bank'
        }}
        onBack={() => setShowInstructions(false)}
        onUSDTSent={handleUSDTSent}
      />
    );
  }

  // État de confirmation de commande
  if (showConfirmation) {
    return (
      <OrderConfirmation
        orderData={{
          amount: fiatAmount,
          currency,
          usdtAmount,
          network,
          walletAddress: WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
          paymentMethod: paymentMethod as 'card' | 'mobile',
          exchangeRate: exchangeRates[currency as keyof typeof exchangeRates],
          phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : bankData.accountNumber,
          provider: paymentMethod === 'mobile' ? mobileData.provider : 'bank'
        }}
        onConfirm={handleConfirmOrder}
        onBack={() => setShowConfirmation(false)}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Vendre USDT</h1>
          <p className="text-gray-400">Vendez vos USDT et recevez de l'argent fiat</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Trading Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray shadow-2xl">
              <CardHeader className="border-b border-terex-gray p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg md:text-xl">Vendre USDT</CardTitle>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    Taux en temps réel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'bank' | 'mobile')} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-terex-gray">
                    <TabsTrigger 
                      value="bank"
                      className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm"
                    >
                      <CreditCard className="mr-1 md:mr-2 w-4 h-4" />
                      <span className="hidden sm:inline">Virement bancaire</span>
                      <span className="sm:hidden">Banque</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mobile"
                      className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm"
                    >
                      <img 
                        src="/lovable-uploads/52b82a09-1493-4fdf-8589-0e3497357f07.png" 
                        alt="Wave" 
                        className="mr-1 md:mr-2 w-4 h-4 rounded-full"
                      />
                      <span className="hidden sm:inline">Mobile Money</span>
                      <span className="sm:hidden">Mobile</span>
                    </TabsTrigger>
                  </TabsList>

                  {paymentMethods.map((method) => (
                    <TabsContent key={method.id} value={method.id} className="space-y-6">
                      {/* Amount Input Section */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">Je vends</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={usdtAmount}
                                onChange={(e) => setUsdtAmount(e.target.value)}
                                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-24"
                              />
                              <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
                                <img 
                                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                                  alt="USDT" 
                                  className="w-5 h-5"
                                />
                                <span className="text-terex-accent font-medium text-sm">USDT</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">Je reçois</Label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={fiatAmount}
                                readOnly
                                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-24 md:pr-20"
                              />
                              <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger className="absolute right-1 top-1 w-20 h-10 bg-terex-gray-light border-0 text-terex-accent">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CFA">CFA</SelectItem>
                                  <SelectItem value="CAD">CAD</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
                        </div>

                        <div className="bg-terex-gray rounded-lg p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Taux de change</span>
                            <span className="text-white">1 USDT = {exchangeRates[currency as keyof typeof exchangeRates]} {currency}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-400">Frais</span>
                            <span className="text-terex-accent">{method.fee}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-400">Temps de traitement</span>
                            <span className="text-terex-accent">{method.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Network Selection */}
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Réseau d'envoi</Label>
                        <Select value={network} onValueChange={setNetwork}>
                          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TRC20">
                              <div className="flex items-center space-x-2">
                                <span>TRC20 (Tron)</span>
                                <Badge variant="secondary" className="text-xs">Recommandé</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                            <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                            <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                            <SelectItem value="Polygon">Polygon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Our Wallet Address */}
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Adresse de réception (Notre portefeuille)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="text"
                            value={WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES]}
                            readOnly
                            className="bg-terex-gray border-terex-gray-light text-white h-12"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => copyToClipboard(WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES])}
                            className="bg-terex-accent hover:bg-terex-accent/80"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-400 text-xs">Envoyez vos USDT à cette adresse sur le réseau {network}</p>
                      </div>

                      {/* Payment Method Details */}
                      {method.id === 'bank' && (
                        <div className="space-y-4">
                          <h3 className="text-white font-medium">Informations bancaires</h3>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Nom du titulaire du compte</Label>
                              <Input
                                value={bankData.accountHolder}
                                onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                                className="bg-terex-gray border-terex-gray-light text-white"
                                placeholder="Votre nom complet"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Numéro de compte</Label>
                              <Input
                                value={bankData.accountNumber}
                                onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                                className="bg-terex-gray border-terex-gray-light text-white"
                                placeholder="Votre numéro de compte"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Nom de la banque</Label>
                              <Input
                                value={bankData.bankName}
                                onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                                className="bg-terex-gray border-terex-gray-light text-white"
                                placeholder="Nom de votre banque"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {method.id === 'mobile' && (
                        <div className="space-y-4">
                          <h3 className="text-white font-medium">Comment souhaitez-vous recevoir l'argent ?</h3>
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
                                      <img src="/lovable-uploads/52b82a09-1493-4fdf-8589-0e3497357f07.png" alt="Wave" className="w-4 h-4" />
                                      <span>Wave</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="orange">
                                    <div className="flex items-center space-x-2">
                                      <img src="/lovable-uploads/62ebb1fa-b6ad-4de9-b63e-14b9a3baaf99.png" alt="Orange Money" className="w-4 h-4" />
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
                      )}

                      {/* Sell Button */}
                      <Button 
                        size="lg"
                        className="w-full gradient-button text-white font-semibold h-12 text-lg"
                        disabled={!usdtAmount || 
                          (paymentMethod === 'bank' && (!bankData.accountNumber || !bankData.bankName || !bankData.accountHolder)) ||
                          (paymentMethod === 'mobile' && !mobileData.phoneNumber)
                        }
                        onClick={handleSellClick}
                      >
                        Continuer la vente
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Market Info */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base md:text-lg">Prix du marché</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">USDT/USD</span>
                  <span className="text-terex-accent font-bold">$1.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">USDT/CFA</span>
                  <span className="text-white font-bold">615 CFA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">USDT/CAD</span>
                  <span className="text-white font-bold">1.35 CAD</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base md:text-lg flex items-center">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Vérification des transactions</p>
                    <p className="text-gray-400 text-xs">Toutes les transactions sont vérifiées</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Paiements sécurisés</p>
                    <p className="text-gray-400 text-xs">Vos fonds sont protégés</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Support 24/7</p>
                    <p className="text-gray-400 text-xs">Aide disponible en permanence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base md:text-lg">Montants rapides</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {getQuickAmounts().map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => setUsdtAmount(value)}
                      className="border-terex-gray text-gray-300 hover:bg-terex-gray text-xs"
                    >
                      {value} USDT
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
