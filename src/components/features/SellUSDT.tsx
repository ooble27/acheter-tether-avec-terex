
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Info, Wallet, CreditCard, ArrowRight, Smartphone, Percent, Shield, Clock } from 'lucide-react';
import { SellOrderConfirmation } from './SellOrderConfirmation';
import { USDTSendingInstructions } from './USDTSendingInstructions';
import { USDTSentConfirmation } from './USDTSentConfirmation';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { KYCProtection } from './KYCProtection';
import { KYCPage } from './KYCPage';
import { useTerexRates } from '@/hooks/useTerexRates';
import { BinancePayOption } from './sell-usdt/BinancePayOption';

export function SellUSDT() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile' | 'binance'>('bank');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [binancePayId, setBinancePayId] = useState('');
  const [mobileProvider, setMobileProvider] = useState<'wave' | 'orange'>('wave');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();

  // Utiliser les taux de rachat TEREX
  const { 
    terexBuyRateCfa, 
    terexBuyRateCad, 
    loading: ratesLoading, 
    error: ratesError,
    lastUpdated,
    refresh: refreshRates
  } = useTerexRates(2);

  // Taux d'achat (ce que TEREX paie pour racheter les USDT)
  const buyRates = {
    CFA: terexBuyRateCfa,
    CAD: terexBuyRateCad
  };

  const fiatAmount = usdtAmount ? (parseFloat(usdtAmount) * buyRates[currency as keyof typeof buyRates]).toFixed(2) : '0.00';

  const networks = [
    { id: 'TRC20', name: 'TRC20 (Tron)', fee: 'Gratuit', time: '1-5 min' },
    { id: 'ERC20', name: 'ERC20 (Ethereum)', fee: 'Variable', time: '5-15 min' },
    { id: 'BEP20', name: 'BEP20 (BSC)', fee: 'Faible', time: '3-10 min' }
  ];

  const handleSellClick = () => {
    if (!usdtAmount) {
      return;
    }
    
    // Validation selon la méthode de paiement
    if (paymentMethod === 'bank' && (!bankName || !accountNumber || !accountName)) {
      return;
    }
    
    if (paymentMethod === 'mobile' && !mobileNumber) {
      return;
    }

    if (paymentMethod === 'binance' && !binancePayId) {
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const orderData = {
      user_id: user.id,
      type: 'sell' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: buyRates[currency as keyof typeof buyRates],
      payment_method: paymentMethod === 'bank' ? 'card' as const : paymentMethod === 'mobile' ? 'mobile' as const : 'card' as const,
      network,
      wallet_address: '',
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        paymentMethod,
        bankName: paymentMethod === 'bank' ? bankName : null,
        accountNumber: paymentMethod === 'bank' ? accountNumber : null,
        accountName: paymentMethod === 'bank' ? accountName : null,
        mobileProvider: paymentMethod === 'mobile' ? mobileProvider : null,
        mobileNumber: paymentMethod === 'mobile' ? mobileNumber : null,
        binancePayId: paymentMethod === 'binance' ? binancePayId : null,
        network
      })
    };

    const result = await createOrder(orderData);
    
    if (result) {
      setCurrentOrderId(result.id);
      setShowConfirmation(false);
      setShowInstructions(true);
    }
    
    setLoading(false);
  };

  const handleUSDTSent = () => {
    setShowInstructions(false);
    setShowConfirmed(true);
  };

  const handleBackToHome = () => {
    // Réinitialiser tous les états
    setUsdtAmount('');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setBinancePayId('');
    setMobileNumber('');
    setShowConfirmed(false);
    setCurrentOrderId('');
  };

  const handleKYCRequired = () => {
    setShowKYCPage(true);
  };

  // Si on est sur la page KYC
  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  // État de confirmation finale
  if (showConfirmed) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <USDTSentConfirmation
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            exchangeRate: buyRates[currency as keyof typeof buyRates],
            walletAddress: '',
            paymentMethod: paymentMethod,
            bankName: paymentMethod === 'bank' ? bankName : undefined,
            accountNumber: paymentMethod === 'bank' ? accountNumber : undefined,
            accountName: paymentMethod === 'bank' ? accountName : undefined,
            mobileProvider: paymentMethod === 'mobile' ? mobileProvider : undefined,
            mobileNumber: paymentMethod === 'mobile' ? mobileNumber : undefined,
            binancePayId: paymentMethod === 'binance' ? binancePayId : undefined
          }}
          orderId={currentOrderId}
          onBackToHome={handleBackToHome}
        />
      </KYCProtection>
    );
  }

  // État des instructions d'envoi
  if (showInstructions) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <USDTSendingInstructions
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            exchangeRate: buyRates[currency as keyof typeof buyRates],
            walletAddress: '',
            paymentMethod: paymentMethod,
            bankName: paymentMethod === 'bank' ? bankName : undefined,
            accountNumber: paymentMethod === 'bank' ? accountNumber : undefined,
            accountName: paymentMethod === 'bank' ? accountName : undefined,
            mobileProvider: paymentMethod === 'mobile' ? mobileProvider : undefined,
            mobileNumber: paymentMethod === 'mobile' ? mobileNumber : undefined,
            binancePayId: paymentMethod === 'binance' ? binancePayId : undefined
          }}
          orderId={currentOrderId}
          onBack={() => setShowInstructions(false)}
          onUSDTSent={handleUSDTSent}
        />
      </KYCProtection>
    );
  }

  // État de confirmation de commande
  if (showConfirmation) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <SellOrderConfirmation
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            exchangeRate: buyRates[currency as keyof typeof buyRates],
            walletAddress: '',
            paymentMethod: paymentMethod,
            bankName: paymentMethod === 'bank' ? bankName : undefined,
            accountNumber: paymentMethod === 'bank' ? accountNumber : undefined,
            accountName: paymentMethod === 'bank' ? accountName : undefined,
            mobileProvider: paymentMethod === 'mobile' ? mobileProvider : undefined,
            mobileNumber: paymentMethod === 'mobile' ? mobileNumber : undefined,
            binancePayId: paymentMethod === 'binance' ? binancePayId : undefined
          }}
          onConfirm={handleConfirmOrder}
          onBack={() => setShowConfirmation(false)}
          loading={loading}
        />
      </KYCProtection>
    );
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      <div className="min-h-screen bg-terex-dark p-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 px-1 md:px-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Vendre USDT</h1>
            <p className="text-gray-400">Vendez vos USDT et recevez de l'argent fiat</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-0 md:gap-6 px-0 lg:px-0">
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
                  <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'bank' | 'mobile' | 'binance')} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-terex-gray">
                      <TabsTrigger 
                        value="bank"
                        className="data-[state=active]:bg-terex-accent data-[state=active]:text-black text-xs md:text-sm"
                      >
                        <CreditCard className="mr-1 md:mr-2 w-4 h-4" />
                        <span className="hidden sm:inline">Virement</span>
                        <span className="sm:hidden">Bank</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="mobile"
                        className="data-[state=active]:bg-terex-accent data-[state=active]:text-black text-xs md:text-sm"
                      >
                        <Smartphone className="mr-1 md:mr-2 w-4 h-4" />
                        <span className="hidden sm:inline">Mobile Money</span>
                        <span className="sm:hidden">Mobile</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="binance"
                        className="data-[state=active]:bg-terex-accent data-[state=active]:text-black text-xs md:text-sm"
                      >
                        <Wallet className="mr-1 md:mr-2 w-4 h-4" />
                        <span className="hidden sm:inline">Binance Pay</span>
                        <span className="sm:hidden">Binance</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Common USDT Amount Section */}
                    <div className="space-y-6">
                      {/* Amount Input Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Montant USDT à vendre</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={usdtAmount}
                              onChange={(e) => setUsdtAmount(e.target.value)}
                              className="bg-terex-gray border-terex-gray-light text-white h-12 pr-16"
                            />
                            <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
                              <img 
                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                                alt="USDT" 
                                className="w-6 h-6"
                              />
                              <span className="text-terex-accent font-medium">USDT</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Vous recevrez</Label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={fiatAmount}
                              readOnly
                              className="bg-terex-gray-light border-terex-gray-light text-white h-12 pr-20"
                            />
                            <Select value={currency} onValueChange={setCurrency}>
                              <SelectTrigger className="absolute right-1 top-1 w-16 h-10 bg-terex-accent text-black border-0">
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

                      {/* Processing Info */}
                      <div className="bg-terex-gray rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Taux TEREX (rachat)</span>
                          <span className="text-white">
                            1 USDT = {buyRates[currency as keyof typeof buyRates]} {currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Commission</span>
                          <span className="text-terex-accent">Optimisée</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Temps de traitement</span>
                          <span className="text-white">2-24h</span>
                        </div>
                      </div>

                      {/* Network Selection */}
                      <div className="space-y-2">
                        <Label className="text-white">Réseau blockchain</Label>
                        <Select value={network} onValueChange={setNetwork}>
                          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {networks.map((net) => (
                              <SelectItem key={net.id} value={net.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{net.name}</span>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <Badge variant="outline" className="text-xs">{net.fee}</Badge>
                                    <span className="text-xs text-gray-500">{net.time}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Payment Method Specific Content */}
                    <TabsContent value="bank" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-medium">Informations bancaires</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">Nom de la banque</Label>
                            <Input
                              placeholder="Ex: Banque Atlantique"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="bg-terex-gray border-terex-gray-light text-white h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Numéro de compte</Label>
                            <Input
                              placeholder="Ex: 1234567890"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              className="bg-terex-gray border-terex-gray-light text-white h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Nom du titulaire</Label>
                          <Input
                            placeholder="Nom complet du titulaire du compte"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="bg-terex-gray border-terex-gray-light text-white h-12"
                          />
                        </div>

                        <Alert className="border-blue-500/50 bg-blue-500/10">
                          <Info className="h-4 w-4 text-blue-400" />
                          <AlertDescription className="text-blue-200">
                            Le virement sera effectué sous 2-24h après réception et vérification de vos USDT.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </TabsContent>

                    <TabsContent value="mobile" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-medium">Mobile Money</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">Service</Label>
                            <Select value={mobileProvider} onValueChange={(value) => setMobileProvider(value as 'wave' | 'orange')}>
                              <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="wave">
                                  <div className="flex items-center">
                                    <img 
                                      src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" 
                                      alt="Wave" 
                                      className="w-5 h-5 mr-2 rounded-full"
                                    />
                                    Wave
                                  </div>
                                </SelectItem>
                                <SelectItem value="orange">
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 bg-orange-500 rounded-full mr-2" />
                                    Orange Money
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Numéro de téléphone</Label>
                            <Input
                              placeholder="Ex: +221 77 123 45 67"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              className="bg-terex-gray border-terex-gray-light text-white h-12"
                            />
                          </div>
                        </div>

                        <Alert className="border-green-500/50 bg-green-500/10">
                          <Shield className="h-4 w-4 text-green-400" />
                          <AlertDescription className="text-green-200">
                            Transfert Mobile Money instantané après vérification de vos USDT.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </TabsContent>

                    <TabsContent value="binance" className="space-y-6">
                      <BinancePayOption
                        binancePayId={binancePayId}
                        setBinancePayId={setBinancePayId}
                      />
                    </TabsContent>

                    {/* Sell Button */}
                    <Button 
                      size="lg"
                      className="w-full gradient-button text-white font-semibold h-12 text-lg"
                      disabled={!usdtAmount || 
                        (paymentMethod === 'bank' && (!bankName || !accountNumber || !accountName)) ||
                        (paymentMethod === 'mobile' && !mobileNumber) ||
                        (paymentMethod === 'binance' && !binancePayId)
                      }
                      onClick={handleSellClick}
                    >
                      Continuer la vente
                    </Button>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="px-0 lg:px-0 mt-4 lg:mt-0 space-y-4 md:space-y-6">
              {/* Taux du jour */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader className="p-4">
                  <CardTitle className="text-white text-base flex items-center">
                    <Percent className="mr-2 w-4 h-4 text-terex-accent" />
                    Taux de rachat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">USDT → CFA</span>
                    <span className="text-white font-mono">{terexBuyRateCfa}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">USDT → CAD</span>
                    <span className="text-white font-mono">{terexBuyRateCad}</span>
                  </div>
                  <Separator className="bg-terex-gray-light" />
                  <div className="text-xs text-gray-400">
                    Dernière mise à jour: {lastUpdated?.toLocaleTimeString('fr-FR') || 'En cours...'}
                  </div>
                </CardContent>
              </Card>

              {/* Processus de vente */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader className="p-4">
                  <CardTitle className="text-white text-base flex items-center">
                    <Clock className="mr-2 w-4 h-4 text-terex-accent" />
                    Processus de vente
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-terex-accent text-black text-xs flex items-center justify-center font-bold">1</div>
                      <div>
                        <p className="text-white text-sm font-medium">Confirmation</p>
                        <p className="text-gray-400 text-xs">Vérifiez vos informations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-bold">2</div>
                      <div>
                        <p className="text-white text-sm font-medium">Envoi USDT</p>
                        <p className="text-gray-400 text-xs">Vers notre adresse</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-bold">3</div>
                      <div>
                        <p className="text-white text-sm font-medium">Vérification</p>
                        <p className="text-gray-400 text-xs">Confirmation blockchain</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-bold">4</div>
                      <div>
                        <p className="text-white text-sm font-medium">Paiement</p>
                        <p className="text-gray-400 text-xs">Réception des fonds</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader className="p-4">
                  <CardTitle className="text-white text-base flex items-center">
                    <Shield className="mr-2 w-4 h-4 text-terex-accent" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Transactions sécurisées</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Vérification KYC</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Support 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </KYCProtection>
  );
}
