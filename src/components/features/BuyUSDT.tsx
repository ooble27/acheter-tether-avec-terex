import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CircleDollarSign, AlertCircle, ArrowLeft, ArrowRightLeft, Shield, Clock, CreditCard, Copy } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';
import { PaymentPage } from './PaymentPage';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { KYCProtection } from './KYCProtection';
import { KYCPage };

type PaymentMethodType = 'card' | 'mobile' | 'wave' | 'orange_money' | 'bank' | 'bank_transfer' | 'interac';

export function BuyUSDT() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation' | 'payment'>('form');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | ''>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [orderData, setOrderData] = useState<any>(null);
  
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const exchangeRates = {
    CFA: 600, // 1 USDT = 600 CFA
    CAD: 1.35  // 1 USDT = 1.35 CAD
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethodType);
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  const handleNetworkChange = (value: string) => {
    setNetwork(value);
  };

  const calculateUSDT = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return 0;
    }
    const rate = exchangeRates[currency as keyof typeof exchangeRates] || exchangeRates.CFA;
    return parsedAmount / rate;
  };

  const usdtAmount = calculateUSDT();

  const handleKYCRequired = () => {
    setShowKYCPage(true);
  };

  const handlePaymentComplete = () => {
    toast({
      title: "Paiement réussi",
      description: "Votre commande a été traitée avec succès. Vous recevrez vos USDT sous peu.",
    });
    setCurrentStep('form');
    // Reset form
    setAmount('');
    setPaymentMethod('');
    setWalletAddress('');
    setOrderData(null);
  };

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "L'adresse a été copiée dans le presse-papiers",
    });
  };

  const getQuickAmounts = () => {
    if (currency === 'CFA') {
      return ['10000', '25000', '50000', '100000'];
    } else {
      return ['15', '40', '75', '150'];
    }
  };

  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      {currentStep === 'form' && (
        <div className="min-h-screen bg-terex-dark p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-4 md:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Acheter USDT</h1>
              <p className="text-gray-400 text-sm md:text-base">Achetez des USDT avec de l'argent fiat</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Trading Interface - Même largeur que VendreUSDT et InternationalTransfer */}
              <div className="lg:col-span-2 w-full">
                <Card className="bg-terex-darker border-terex-gray shadow-2xl w-full overflow-hidden">
                  <CardHeader className="border-b border-terex-gray p-3 sm:p-4 md:p-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-white text-base sm:text-lg md:text-xl flex items-center">
                        <img 
                          src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                          alt="USDT" 
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                        />
                        <span className="truncate">Acheter USDT</span>
                      </CardTitle>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent text-xs whitespace-nowrap">
                        Taux en temps réel
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 w-full">
                    {/* Amount Input Section */}
                    <div className="space-y-4 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                        <div className="space-y-2 min-w-0">
                          <Label className="text-white text-sm font-medium">Je paie</Label>
                          <div className="relative w-full">
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={handleAmountChange}
                              className="bg-terex-gray border-terex-gray-light text-white text-base sm:text-lg h-10 sm:h-12 pr-20 sm:pr-24 w-full"
                            />
                            <Select value={currency} onValueChange={handleCurrencyChange}>
                              <SelectTrigger className="absolute right-1 top-1 w-20 sm:w-24 h-8 sm:h-10 bg-terex-gray-light border-0 text-terex-accent text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CFA">CFA</SelectItem>
                                <SelectItem value="CAD">CAD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2 min-w-0">
                          <Label className="text-white text-sm font-medium">Je reçois</Label>
                          <div className="relative w-full">
                            <Input
                              type="text"
                              value={usdtAmount.toFixed(6)}
                              readOnly
                              className="bg-terex-gray border-terex-gray-light text-white text-base sm:text-lg h-10 sm:h-12 pr-20 sm:pr-24 w-full"
                            />
                            <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-1 sm:px-2 py-1">
                              <img 
                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                                alt="USDT" 
                                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                              />
                              <span className="text-terex-accent font-medium text-xs sm:text-sm whitespace-nowrap">USDT</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-terex-accent" />
                      </div>

                      <div className="bg-terex-gray rounded-lg p-3 w-full overflow-hidden">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-400">Taux de change</span>
                          <span className="text-white text-right">1 USDT = {exchangeRates[currency as keyof typeof exchangeRates]} {currency}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm mt-1">
                          <span className="text-gray-400">Frais</span>
                          <span className="text-terex-accent">0%</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm mt-1">
                          <span className="text-gray-400">Temps de traitement</span>
                          <span className="text-terex-accent text-right">5-10 minutes</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-2 w-full">
                      <Label className="text-white text-sm font-medium">Méthode de paiement</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        <div
                          onClick={() => setPaymentMethod('mobile')}
                          className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all w-full ${
                            paymentMethod === 'mobile'
                              ? 'border-terex-accent bg-terex-accent/10'
                              : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img 
                              src="/lovable-uploads/2562d408-8490-4483-894c-a0e6cdd19337.png" 
                              alt="Wave" 
                              className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-medium text-sm">Mobile Money</p>
                              <p className="text-gray-400 text-xs truncate">Wave et Orange Money</p>
                            </div>
                          </div>
                        </div>
                        
                        <div
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all w-full ${
                            paymentMethod === 'card'
                              ? 'border-terex-accent bg-terex-accent/10'
                              : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-terex-accent flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-medium text-sm">Carte bancaire</p>
                              <p className="text-gray-400 text-xs truncate">Visa, Mastercard</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Network Selection */}
                    <div className="space-y-2 w-full">
                      <Label className="text-white text-sm font-medium">Réseau de réception</Label>
                      <Select value={network} onValueChange={handleNetworkChange}>
                        <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-10 sm:h-12 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRC20">
                            <div className="flex items-center space-x-2">
                              <span>TRC20 (Tron)</span>
                              <Badge variant="secondary" className="text-xs">Recommandé</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="BEP20">
                            <div className="flex items-center space-x-2">
                              <span>BEP20 (Binance Smart Chain)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="ERC20">
                            <div className="flex items-center space-x-2">
                              <span>ERC20 (Ethereum)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="POLYGON">
                            <div className="flex items-center space-x-2">
                              <span>POLYGON (Matic)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="ARBITRUM">
                            <div className="flex items-center space-x-2">
                              <span>ARBITRUM</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="OPTIMISM">
                            <div className="flex items-center space-x-2">
                              <span>OPTIMISM</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="AVALANCHE">
                            <div className="flex items-center space-x-2">
                              <span>AVALANCHE</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="SOLANA">
                            <div className="flex items-center space-x-2">
                              <span>SOLANA</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wallet Address */}
                    <div className="space-y-2 w-full">
                      <Label className="text-white text-sm font-medium">Votre adresse USDT ({network})</Label>
                      <div className="flex items-center space-x-2 w-full">
                        <Input
                          placeholder={`Votre adresse de réception USDT ${network}`}
                          value={walletAddress}
                          onChange={handleWalletAddressChange}
                          className="bg-terex-gray border-terex-gray-light text-white h-10 sm:h-12 w-full min-w-0"
                        />
                      </div>
                      <p className="text-gray-400 text-xs">Adresse où vous recevrez vos USDT sur le réseau {network}</p>
                    </div>

                    {/* Buy Button */}
                    <Button 
                      size="lg"
                      className="w-full gradient-button text-white font-semibold h-10 sm:h-12 text-base sm:text-lg"
                      disabled={!amount || !paymentMethod || !walletAddress}
                      onClick={handleCreateOrder}
                    >
                      <span className="truncate">Continuer vers la confirmation</span>
                      <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Même largeur que les autres pages */}
              <div className="lg:col-span-1 space-y-4 md:space-y-6 w-full">
                {/* Nos taux TEREX */}
                <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
                      <img 
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                        alt="USDT" 
                        className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0"
                      />
                      <span className="truncate">Nos taux TEREX</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">USDT/CFA</span>
                      <span className="text-white font-bold text-xs sm:text-sm">{exchangeRates.CFA} CFA</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">USDT/CAD</span>
                      <span className="text-terex-accent font-bold text-xs sm:text-sm">${exchangeRates.CAD} CAD</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-white text-sm sm:text-base md:text-lg truncate">Montants rapides ({currency})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0 w-full">
                    <div className="grid grid-cols-2 gap-2">
                      {getQuickAmounts().map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(value)}
                          className="border-terex-gray text-gray-300 hover:bg-terex-gray text-xs w-full min-w-0 h-8 px-1"
                        >
                          <span className="truncate">
                            {currency === 'CFA' 
                              ? `${parseInt(value).toLocaleString()} CFA`
                              : `$${value} CAD`
                            }
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Security Features */}
                <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent flex-shrink-0" />
                      <span className="truncate">Sécurité</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs sm:text-sm font-medium">Cryptage SSL 256-bit</p>
                        <p className="text-gray-400 text-xs">Vos données sont protégées</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs sm:text-sm font-medium">Fonds sécurisés</p>
                        <p className="text-gray-400 text-xs">Protection des transactions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs sm:text-sm font-medium">Support 24/7</p>
                        <p className="text-gray-400 text-xs">Aide disponible en permanence</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Time */}
                <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent flex-shrink-0" />
                      <span className="truncate">Délais de traitement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">Mobile Money</span>
                      <Badge variant="outline" className="text-green-500 border-green-500 text-xs whitespace-nowrap">
                        5-10 min
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">Carte bancaire</span>
                      <Badge variant="outline" className="text-green-500 border-green-500 text-xs whitespace-nowrap">
                        Instantané
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
            usdtAmount: usdtAmount.toFixed(6),
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates],
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

            if (paymentMethod === '') {
              toast({
                title: "Erreur",
                description: "Méthode de paiement requise.",
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
                exchange_rate: exchangeRates[currency as keyof typeof exchangeRates],
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
            usdtAmount: usdtAmount.toFixed(6),
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates],
          }}
          onBack={() => setCurrentStep('confirmation')}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </KYCProtection>
  );
}
