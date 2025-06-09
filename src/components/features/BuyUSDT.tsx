import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRightLeft, Shield, Clock, CreditCard, CheckCircle, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { OrderConfirmation } from '@/components/features/OrderConfirmation';
import { PaymentInstructions } from '@/components/features/PaymentInstructions';
import { PaymentPending } from '@/components/features/PaymentPending';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { KYCProtection } from './KYCProtection';
import { KYCPage } from './KYCPage';
import { useTerexRates } from '@/hooks/useTerexRates';

// Logos des réseaux blockchain
const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', // Tron
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', // BSC/BNB
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', // Ethereum
  Arbitrum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png', // Arbitrum
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' // Polygon
};

export function BuyUSDT() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');

  const [cardData, setCardData] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: ''
  });

  const [mobileData, setMobileData] = useState({
    phoneNumber: '',
    provider: 'wave' as 'wave' | 'orange'
  });

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();

  // Correction: utiliser les bonnes propriétés du hook
  const { 
    terexRateCfa, 
    terexRateCad, 
    marketRateCfa, 
    marketRateCad, 
    loading: ratesLoading, 
    error: ratesError,
    lastUpdated,
    refresh: refreshRates
  } = useTerexRates(2);

  // Correction: ajouter CAD aux taux d'échange
  const exchangeRates = {
    CFA: terexRateCfa,
    CAD: terexRateCad
  };

  const marketRates = {
    CFA: marketRateCfa,
    CAD: marketRateCad
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

  const usdtAmount = fiatAmount ? formatAmount(parseFloat(fiatAmount) / exchangeRates[currency as keyof typeof exchangeRates]) : '0';

  const paymentMethods = [
    { id: 'card' as const, name: 'Carte bancaire', icon: '💳', fee: '3%', time: '2-5 min' },
    { id: 'mobile' as const, name: 'Mobile Money', icon: '📱', fee: '2%', time: '2-5 min' }
  ];

  const getQuickAmounts = () => {
    if (currency === 'CFA') {
      return ['10000', '25000', '50000', '100000', '250000'];
    }
    return ['25', '50', '100', '250', '500'];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "L'adresse a été copiée dans le presse-papiers",
    });
  };

  const handleBuyClick = () => {
    if (!fiatAmount) {
      return;
    }
    
    if (paymentMethod === 'card' && (!cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv || !cardData.name)) {
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
    
    const orderData = {
      user_id: user.id,
      type: 'buy' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRates[currency as keyof typeof exchangeRates],
      payment_method: paymentMethod,
      network,
      status: 'pending' as const,
      payment_status: 'pending',
      // Stocker les informations dans les notes
      notes: JSON.stringify({
        phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : null,
        provider: paymentMethod === 'mobile' ? mobileData.provider : null,
        paymentMethod: paymentMethod,
        cardData: paymentMethod === 'card' ? {
          ...cardData,
          number: cardData.number.slice(-4), // Stocker seulement les 4 derniers chiffres
          cvv: '***' // Ne pas stocker le CVV
        } : null,
        mobileData: paymentMethod === 'mobile' ? mobileData : null
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

  const handlePaymentConfirmed = () => {
    setShowInstructions(false);
    setShowPending(true);
  };

  const handleBackToHome = () => {
    // Réinitialiser tous les états
    setFiatAmount('');
    setCardData({ number: '', expiryMonth: '', expiryYear: '', cvv: '', name: '' });
    setMobileData({ phoneNumber: '', provider: 'wave' });
    setShowPending(false);
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
  if (showPending) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <PaymentPending
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            network,
            walletAddress: '', // Correction: ajouter la propriété manquante
            paymentMethod: paymentMethod,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
          }}
          orderId={currentOrderId}
          onBackToHome={handleBackToHome}
        />
      </KYCProtection>
    );
  }

  // État des instructions de paiement
  if (showInstructions) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <PaymentInstructions
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            network,
            walletAddress: '', // Correction: ajouter la propriété manquante
            paymentMethod: paymentMethod,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
          }}
          orderId={currentOrderId}
          onBack={() => setShowInstructions(false)}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      </KYCProtection>
    );
  }

  // État de confirmation de commande
  if (showConfirmation) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <OrderConfirmation
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            network,
            walletAddress: '', // Correction: ajouter la propriété manquante
            paymentMethod: paymentMethod,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
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
      <div className="min-h-screen bg-terex-dark p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Acheter USDT</h1>
            <p className="text-gray-400">Achetez des USDT avec de l'argent fiat</p>
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
                          src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" 
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
                                  value={fiatAmount}
                                  onChange={(e) => setFiatAmount(e.target.value)}
                                  className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-20"
                                />
                                <Select value={currency} onValueChange={setCurrency}>
                                  <SelectTrigger className="absolute right-1 top-1 w-16 h-10 bg-terex-gray-light border-0 text-terex-accent">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="CFA">CFA</SelectItem>
                                  </SelectContent>
                                </Select>
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
                          </div>

                          <div className="flex items-center justify-center">
                            <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
                          </div>

                          <div className="bg-terex-gray rounded-lg p-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Taux TEREX (vente)</span>
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

                        {/* Network Selection with Logos */}
                        <div className="space-y-2">
                          <Label className="text-white text-sm font-medium">Réseau de réception</Label>
                          <Select value={network} onValueChange={setNetwork}>
                            <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TRC20">
                                <div className="flex items-center space-x-3">
                                  <img src={NETWORK_LOGOS.TRC20} alt="Tron" className="w-6 h-6 rounded-full" />
                                  <div className="flex flex-col">
                                    <span>TRC20 (Tron)</span>
                                    <span className="text-xs text-gray-400">Frais faibles</span>
                                  </div>
                                  <Badge variant="secondary" className="text-xs ml-auto">Recommandé</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="BEP20">
                                <div className="flex items-center space-x-3">
                                  <img src={NETWORK_LOGOS.BEP20} alt="BSC" className="w-6 h-6 rounded-full" />
                                  <div className="flex flex-col">
                                    <span>BEP20 (BSC)</span>
                                    <span className="text-xs text-gray-400">Rapide et abordable</span>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="ERC20">
                                <div className="flex items-center space-x-3">
                                  <img src={NETWORK_LOGOS.ERC20} alt="Ethereum" className="w-6 h-6 rounded-full" />
                                  <div className="flex flex-col">
                                    <span>ERC20 (Ethereum)</span>
                                    <span className="text-xs text-gray-400">Réseau principal</span>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="Arbitrum">
                                <div className="flex items-center space-x-3">
                                  <img src={NETWORK_LOGOS.Arbitrum} alt="Arbitrum" className="w-6 h-6 rounded-full" />
                                  <div className="flex flex-col">
                                    <span>Arbitrum</span>
                                    <span className="text-xs text-gray-400">Layer 2 Ethereum</span>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="Polygon">
                                <div className="flex items-center space-x-3">
                                  <img src={NETWORK_LOGOS.Polygon} alt="Polygon" className="w-6 h-6 rounded-full" />
                                  <div className="flex flex-col">
                                    <span>Polygon</span>
                                    <span className="text-xs text-gray-400">Frais très faibles</span>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Payment Method Details */}
                        {method.id === 'card' && (
                          <div className="space-y-4">
                            <h3 className="text-white font-medium">Informations de carte</h3>
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <Label className="text-white text-sm">Nom sur la carte</Label>
                                <Input
                                  value={cardData.name}
                                  onChange={(e) => setCardData({...cardData, name: e.target.value})}
                                  className="bg-terex-gray border-terex-gray-light text-white"
                                  placeholder="John Doe"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-white text-sm">Numéro de carte</Label>
                                <Input
                                  value={cardData.number}
                                  onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                  className="bg-terex-gray border-terex-gray-light text-white"
                                  placeholder="1234 5678 9012 3456"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Mois</Label>
                                  <Select value={cardData.expiryMonth} onValueChange={(value) => setCardData({...cardData, expiryMonth: value})}>
                                    <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({length: 12}, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                          {String(i + 1).padStart(2, '0')}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Année</Label>
                                  <Select value={cardData.expiryYear} onValueChange={(value) => setCardData({...cardData, expiryYear: value})}>
                                    <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                                      <SelectValue placeholder="AA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({length: 10}, (_, i) => (
                                        <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                                          {String(new Date().getFullYear() + i).slice(-2)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">CVV</Label>
                                  <Input
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                                    className="bg-terex-gray border-terex-gray-light text-white"
                                    placeholder="123"
                                    maxLength={3}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {method.id === 'mobile' && (
                          <div className="space-y-4">
                            <h3 className="text-white font-medium">Comment souhaitez-vous payer ?</h3>
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
                                        <img src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" alt="Wave" className="w-4 h-4" />
                                        <span>Wave</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="orange">
                                      <div className="flex items-center space-x-2">
                                        <img src="/lovable-uploads/86b4b50f-9595-46c2-8cce-30343f23454a.png" alt="Orange Money" className="w-4 h-4" />
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

                        {/* Buy Button */}
                        <Button 
                          size="lg"
                          className="w-full gradient-button text-white font-semibold h-12 text-lg"
                          disabled={!fiatAmount || 
                            (paymentMethod === 'card' && (!cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv || !cardData.name)) ||
                            (paymentMethod === 'mobile' && !mobileData.phoneNumber)
                          }
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
            <div className="lg:col-span-1 space-y-4 md:space-y-6 w-full">
              {/* Taux du jour */}
              <Card className="bg-terex-darker border-terex-gray w-full overflow-hidden">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm sm:text-base md:text-lg flex items-center">
                      <img 
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                        alt="USDT" 
                        className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0"
                      />
                      <span className="truncate">Taux du jour</span>
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={refreshRates}
                      disabled={ratesLoading}
                      className="h-8 w-8 p-0 text-terex-accent hover:bg-terex-accent/10"
                    >
                      <RefreshCw className={`w-4 h-4 ${ratesLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  {lastUpdated && (
                    <p className="text-xs text-gray-400">
                      Mis à jour: {lastUpdated.toLocaleTimeString('fr-FR')}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 p-3 sm:p-4 pt-0 w-full overflow-hidden">
                  {ratesError && (
                    <Alert className="border-yellow-500/50 bg-yellow-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-yellow-200 text-xs">
                        {ratesError}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">Marché USDT/CFA</span>
                      <span className="text-gray-300 font-medium text-xs sm:text-sm">{marketRates.CFA.toLocaleString()} CFA</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">Marché USDT/CAD</span>
                      <span className="text-gray-300 font-medium text-xs sm:text-sm">${marketRates.CAD} CAD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <span className="text-white font-bold text-xs sm:text-sm">{exchangeRates.CFA.toLocaleString()} CFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs sm:text-sm">USDT/CAD</span>
                    <span className="text-terex-accent font-bold text-xs sm:text-sm">${exchangeRates.CAD} CAD</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    * Taux marché + 2% de commission
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
                        onClick={() => setFiatAmount(value)}
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
    </KYCProtection>
  );
}
