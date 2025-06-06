
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Shield, Clock, CreditCard } from 'lucide-react';
import { OrderConfirmation } from '@/components/features/OrderConfirmation';
import { PaymentInstructions } from '@/components/features/PaymentInstructions';
import { PaymentPending } from '@/components/features/PaymentPending';
import { PaymentSuccess } from '@/components/features/PaymentSuccess';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';

export function BuyUSDT() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation' | 'payment' | 'pending' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [mobileData, setMobileData] = useState({
    phoneNumber: '',
    provider: 'wave' as 'wave' | 'orange'
  });
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const { createOrder } = useOrders();
  const { user } = useAuth();

  const exchangeRates = {
    CFA: 615,
    CAD: 1.35
  };

  const usdtAmount = amount ? (parseFloat(amount) / exchangeRates[currency as keyof typeof exchangeRates]).toFixed(6) : '0';

  const paymentMethods = [
    { id: 'card' as const, name: 'Carte bancaire', icon: '💳', fee: '0%', time: 'Instantané' },
    { id: 'mobile' as const, name: 'Mobile Money', icon: '📱', fee: '0%', time: 'Instantané' }
  ];

  const getQuickAmounts = () => {
    if (currency === 'CFA') {
      return ['50000', '100000', '500000', '1000000'];
    } else {
      return ['50', '100', '500', '1000'];
    }
  };

  const handleBuyClick = () => {
    if (!amount || !walletAddress) {
      return;
    }
    setCurrentStep('confirmation');
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const orderData = {
      user_id: user.id,
      type: 'buy',
      amount: parseFloat(amount),
      currency: paymentMethod === 'mobile' ? 'CFA' : currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRates[currency as keyof typeof exchangeRates],
      payment_method: paymentMethod,
      network,
      wallet_address: walletAddress,
      status: 'pending' as const,
      payment_status: 'pending'
    };

    const result = await createOrder(orderData);
    
    if (result) {
      setCurrentOrderId(result.id);
      setCurrentStep('payment');
    }
    
    setLoading(false);
  };
  
  const handlePaymentSubmitted = () => {
    setCurrentStep('pending');
    
    // Dans un cas réel, nous vérifierions l'état du paiement via webhook ou polling
    // Ici, on simule un succès de paiement après 5 secondes
    setTimeout(() => {
      // Simuler un hash de transaction pour démonstration
      setTransactionHash('0x' + Math.random().toString(16).substring(2, 40));
      setCurrentStep('success');
    }, 5000);
  };

  const handleBackToHome = () => {
    // Reset le formulaire et revient à l'état initial
    setAmount('');
    setWalletAddress('');
    setCurrentStep('form');
  };
  
  const handleBuyMore = () => {
    // Reset le formulaire et revient à l'état initial
    setAmount('');
    setWalletAddress('');
    setCurrentStep('form');
  };

  // Determine which component to render based on current step
  const renderCurrentStep = () => {
    switch(currentStep) {
      case 'confirmation':
        return (
          <OrderConfirmation
            orderData={{
              amount,
              currency: paymentMethod === 'mobile' ? 'CFA' : currency,
              usdtAmount,
              network,
              walletAddress,
              paymentMethod,
              exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
            }}
            onConfirm={handleConfirmOrder}
            onBack={() => setCurrentStep('form')}
            loading={loading}
          />
        );
      
      case 'payment':
        return (
          <PaymentInstructions
            orderData={{
              amount,
              currency: paymentMethod === 'mobile' ? 'CFA' : currency,
              usdtAmount,
              network,
              walletAddress,
              paymentMethod,
              exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
            }}
            orderId={currentOrderId}
            onBack={() => setCurrentStep('confirmation')}
            onPaymentConfirmed={handlePaymentSubmitted}
          />
        );
      
      case 'pending':
        return (
          <PaymentPending
            orderData={{
              amount,
              currency: paymentMethod === 'mobile' ? 'CFA' : currency,
              usdtAmount,
              network,
              walletAddress,
              paymentMethod,
              exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
            }}
            orderId={currentOrderId}
            onBackToHome={handleBackToHome}
          />
        );
      
      case 'success':
        return (
          <PaymentSuccess
            orderData={{
              amount,
              currency: paymentMethod === 'mobile' ? 'CFA' : currency,
              usdtAmount,
              network,
              walletAddress,
            }}
            orderId={currentOrderId}
            txHash={transactionHash}
            onBackToHome={handleBackToHome}
            onBuyMore={handleBuyMore}
          />
        );
      
      case 'form':
      default:
        return renderBuyForm();
    }
  };

  const renderBuyForm = () => (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Acheter USDT</h1>
          <p className="text-gray-400">Achetez des USDT facilement et en toute sécurité</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Trading Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray shadow-2xl">
              <CardHeader className="border-b border-terex-gray p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg md:text-xl">Acheter USDT</CardTitle>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    Taux en temps réel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'mobile')} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-terex-gray">
                    <TabsTrigger 
                      value="card"
                      className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm"
                    >
                      <CreditCard className="mr-1 md:mr-2 w-4 h-4" />
                      <span className="hidden sm:inline">Carte bancaire</span>
                      <span className="sm:hidden">Carte</span>
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
                            <Label className="text-white text-sm font-medium">Je paie</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-24 md:pr-20"
                              />
                              {method.id === 'mobile' ? (
                                <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
                                  <span className="text-terex-accent font-medium text-sm">CFA</span>
                                </div>
                              ) : (
                                <Select value={currency} onValueChange={setCurrency}>
                                  <SelectTrigger className="absolute right-1 top-1 w-20 h-10 bg-terex-gray-light border-0 text-terex-accent">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="CFA">CFA</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">Je reçois</Label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={usdtAmount}
                                readOnly
                                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-24"
                              />
                              <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-1 py-1">
                                <img 
                                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                                  alt="USDT" 
                                  className="w-5 h-5"
                                />
                                <span className="text-terex-accent font-medium text-sm">USDT</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
                        </div>

                        <div className="bg-terex-gray rounded-lg p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Taux de change</span>
                            <span className="text-white">1 USDT = {method.id === 'mobile' ? '615 CFA' : `${exchangeRates[currency as keyof typeof exchangeRates]} ${currency}`}</span>
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
                        <Label className="text-white text-sm font-medium">Réseau de réception</Label>
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

                      {/* Wallet Address */}
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Adresse de réception</Label>
                        <Input
                          type="text"
                          placeholder="Votre adresse USDT"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          className="bg-terex-gray border-terex-gray-light text-white h-12"
                        />
                      </div>

                      {/* Buy Button */}
                      <Button 
                        size="lg"
                        className="w-full gradient-button text-white font-semibold h-12 text-lg"
                        disabled={!amount || !walletAddress}
                        onClick={handleBuyClick}
                      >
                        Continuer l'achat
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
                    <p className="text-white text-sm font-medium">Cryptage SSL 256-bit</p>
                    <p className="text-gray-400 text-xs">Vos données sont protégées</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Fonds sécurisés</p>
                    <p className="text-gray-400 text-xs">Portefeuilles multi-signatures</p>
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
                      onClick={() => setAmount(value)}
                      className="border-terex-gray text-gray-300 hover:bg-terex-gray text-xs"
                    >
                      {value} {paymentMethod === 'mobile' ? 'CFA' : currency}
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

  return renderCurrentStep();
}
