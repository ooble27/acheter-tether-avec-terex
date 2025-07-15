import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, AlertTriangle, Info } from 'lucide-react';
import { OrderConfirmation } from '@/components/features/OrderConfirmation';
import { PaymentInstructions } from '@/components/features/PaymentInstructions';
import { PaymentPending } from '@/components/features/PaymentPending';
import { HighVolumeRequest } from '@/components/features/HighVolumeRequest';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { KYCProtection } from './KYCProtection';
import { KYCPage } from './KYCPage';
import { useTerexRates } from '@/hooks/useTerexRates';
import { BuyAmountInput } from './buy-usdt/BuyAmountInput';
import { NetworkSelector } from './buy-usdt/NetworkSelector';
import { WalletAddressInput } from './buy-usdt/WalletAddressInput';
import { DestinationSelector } from './buy-usdt/DestinationSelector';
import { BinanceEmailInput } from './buy-usdt/BinanceEmailInput';
import { PaymentMethodForm } from './buy-usdt/PaymentMethodForm';
import { TradingSidebar } from './buy-usdt/TradingSidebar';
import { LimitsValidator, getLimitMessage } from './buy-usdt/LimitsValidator';

export function BuyUSDT() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [showHighVolumeRequest, setShowHighVolumeRequest] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [destination, setDestination] = useState<'wallet' | 'binance'>('wallet');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [binanceEmail, setBinanceEmail] = useState('');
  const [binanceUsername, setBinanceUsername] = useState('');
  const [binanceId, setBinanceId] = useState('');
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

  // Gestion des limites
  const limitMessage = getLimitMessage(fiatAmount, currency);

  const handleHighVolumeRequest = () => {
    setShowHighVolumeRequest(true);
  };

  const handleLimitExceeded = (amount: string) => {
    setShowHighVolumeRequest(true);
  };

  const handleBuyClick = () => {
    if (!fiatAmount) {
      return;
    }
    
    // Validation selon la destination
    if (destination === 'wallet' && !walletAddress) {
      return;
    }
    
    if (destination === 'binance' && (!binanceEmail || !binanceUsername || !binanceId)) {
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
      network: destination === 'wallet' ? network : 'BINANCE',
      wallet_address: destination === 'wallet' ? walletAddress : binanceEmail,
      status: 'pending' as const,
      payment_status: 'pending',
      // Stocker les informations dans les notes
      notes: JSON.stringify({
        destination,
        phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : null,
        provider: paymentMethod === 'mobile' ? mobileData.provider : null,
        paymentMethod: paymentMethod,
        cardData: paymentMethod === 'card' ? {
          ...cardData,
          number: cardData.number.slice(-4), // Stocker seulement les 4 derniers chiffres
          cvv: '***' // Ne pas stocker le CVV
        } : null,
        mobileData: paymentMethod === 'mobile' ? mobileData : null,
        binanceData: destination === 'binance' ? {
          email: binanceEmail,
          username: binanceUsername,
          binanceId: binanceId
        } : null
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
    setWalletAddress('');
    setBinanceEmail('');
    setBinanceUsername('');
    setBinanceId('');
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
  if (showHighVolumeRequest) {
    return (
      <HighVolumeRequest 
        onBack={() => setShowHighVolumeRequest(false)}
        requestedAmount={fiatAmount}
      />
    );
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
            network: destination === 'wallet' ? network : 'BINANCE',
            walletAddress: destination === 'wallet' ? walletAddress : binanceEmail,
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
            network: destination === 'wallet' ? network : 'BINANCE',
            walletAddress: destination === 'wallet' ? walletAddress : binanceEmail,
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
            network: destination === 'wallet' ? network : 'BINANCE',
            walletAddress: destination === 'wallet' ? walletAddress : binanceEmail,
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
      <div className="min-h-screen bg-terex-dark p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Acheter USDT</h1>
            <p className="text-gray-400">Achetez des USDT avec de l'argent fiat</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Trading Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-terex-darker border-terex-gray shadow-2xl">
                <CardHeader className="border-b border-terex-gray p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">Acheter USDT</CardTitle>
                    <Badge variant="outline" className="text-terex-accent border-terex-accent">
                      Taux en temps réel
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <LimitsValidator 
                    amount={fiatAmount} 
                    currency={currency} 
                    onHighVolumeRequest={handleHighVolumeRequest}
                  >
                    <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'mobile')} className="space-y-6">
                      <TabsList className="grid w-full grid-cols-2 bg-terex-gray">
                        <TabsTrigger 
                          value="card"
                          className="data-[state=active]:bg-terex-accent data-[state=active]:text-white"
                        >
                          <CreditCard className="mr-2 w-4 h-4" />
                          Carte bancaire
                        </TabsTrigger>
                        <TabsTrigger 
                          value="mobile"
                          className="data-[state=active]:bg-terex-accent data-[state=active]:text-white"
                        >
                          <img 
                            src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" 
                            alt="Wave" 
                            className="mr-2 w-4 h-4 rounded-full"
                          />
                          Mobile Money
                        </TabsTrigger>
                      </TabsList>

                      {/* Affichage des messages de limite */}
                      {limitMessage.type && (
                        <Alert className={
                          limitMessage.type === 'error' ? 'border-red-500/50 bg-red-500/10' :
                          limitMessage.type === 'max-reached' ? 'border-orange-500/50 bg-orange-500/10' :
                          'border-yellow-500/50 bg-yellow-500/10'
                        }>
                          {limitMessage.type === 'error' ? (
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                          ) : limitMessage.type === 'max-reached' ? (
                            <AlertTriangle className="h-4 w-4 text-orange-400" />
                          ) : (
                            <Info className="h-4 w-4 text-yellow-400" />
                          )}
                          <AlertDescription className={
                            limitMessage.type === 'error' ? 'text-red-200' :
                            limitMessage.type === 'max-reached' ? 'text-orange-200' :
                            'text-yellow-200'
                          }>
                            <div className="flex flex-col space-y-3">
                              <span>{limitMessage.message}</span>
                              {limitMessage.type === 'max-reached' && (
                                <Button 
                                  onClick={handleHighVolumeRequest}
                                  className="bg-terex-accent hover:bg-terex-accent/90 text-white w-fit"
                                  size="sm"
                                >
                                  Demande de gros volume
                                </Button>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {paymentMethods.map((method) => (
                        <TabsContent key={method.id} value={method.id} className="space-y-6">
                          {/* Amount Input Section */}
                          <div>
                            <BuyAmountInput
                              fiatAmount={fiatAmount}
                              setFiatAmount={setFiatAmount}
                              currency={currency}
                              setCurrency={setCurrency}
                              usdtAmount={usdtAmount}
                              exchangeRate={exchangeRates[currency as keyof typeof exchangeRates]}
                              paymentMethod={paymentMethod}
                              processingTime={method.time}
                              fee={method.fee}
                            />
                          </div>

                          {/* Destination Selection */}
                          <div>
                            <DestinationSelector
                              destination={destination}
                              setDestination={setDestination}
                            />
                          </div>

                          {/* Conditional rendering based on destination */}
                          {destination === 'wallet' && (
                            <>
                              {/* Network Selection */}
                              <div>
                                <NetworkSelector
                                  network={network}
                                  setNetwork={setNetwork}
                                />
                              </div>

                              {/* Wallet Address Input */}
                              <div>
                                <WalletAddressInput
                                  walletAddress={walletAddress}
                                  setWalletAddress={setWalletAddress}
                                  network={network}
                                />
                              </div>
                            </>
                          )}

                          {destination === 'binance' && (
                            <div>
                              <BinanceEmailInput
                                email={binanceEmail}
                                setEmail={setBinanceEmail}
                                username={binanceUsername}
                                setUsername={setBinanceUsername}
                                binanceId={binanceId}
                                setBinanceId={setBinanceId}
                              />
                            </div>
                          )}

                          {/* Payment Method Details */}
                          <div>
                            <PaymentMethodForm
                              paymentMethod={paymentMethod}
                              cardData={cardData}
                              setCardData={setCardData}
                              mobileData={mobileData}
                              setMobileData={setMobileData}
                            />
                          </div>

                          {/* Buy Button */}
                          <Button 
                            size="lg"
                            className="w-full gradient-button text-white font-semibold h-12 text-lg"
                            disabled={!fiatAmount || 
                              (destination === 'wallet' && !walletAddress) ||
                              (destination === 'binance' && (!binanceEmail || !binanceUsername || !binanceId)) ||
                              limitMessage.type === 'error' || limitMessage.type === 'max-reached' ||
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
                  </LimitsValidator>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <TradingSidebar
              exchangeRates={exchangeRates}
              marketRates={marketRates}
              ratesLoading={ratesLoading}
              ratesError={ratesError}
              lastUpdated={lastUpdated}
              refreshRates={refreshRates}
              currency={currency}
              setFiatAmount={setFiatAmount}
            />
          </div>
        </div>
      </div>
    </KYCProtection>
  );
}
