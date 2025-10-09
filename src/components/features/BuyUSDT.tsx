import { useState, useEffect } from 'react';
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
import { InteracForm } from './buy-usdt/InteracForm';
import { TradingSidebar } from './buy-usdt/TradingSidebar';
import { LimitsValidator, getLimitMessage } from './buy-usdt/LimitsValidator';
import { useNabooPay } from '@/hooks/useNabooPay';
import { MobileBuyUSDT } from './buy-usdt/MobileBuyUSDT';
import { useIsMobile } from '@/hooks/use-mobile';

export function BuyUSDT() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileBuyUSDT />;
  }
  
  return <DesktopBuyUSDT />;
}

function DesktopBuyUSDT() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [showHighVolumeRequest, setShowHighVolumeRequest] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency, setCurrency] = useState('CAD'); // Défaut CAD pour Interac
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

  // Remplacer cardData par interacData
  const [interacData, setInteracData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [mobileData, setMobileData] = useState({
    phoneNumber: '',
    provider: 'wave' as 'wave' | 'orange'
  });

  // Gérer les devises selon le mode de paiement
  useEffect(() => {
    if (paymentMethod === 'card') {
      setCurrency('CAD');
    } else if (paymentMethod === 'mobile') {
      setCurrency('CFA');
    }
  }, [paymentMethod]);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { createTransaction, checkoutUrl } = useNabooPay();

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

  const exchangeRates = {
    CFA: terexRateCfa,
    CAD: terexRateCad
  };

  const marketRates = {
    CFA: marketRateCfa,
    CAD: marketRateCad
  };

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    return parseFloat(num.toFixed(2)).toString();
  };

  const usdtAmount = fiatAmount ? formatAmount(parseFloat(fiatAmount) / exchangeRates[currency as keyof typeof exchangeRates]) : '0';

  const paymentMethods = [
    { id: 'card' as const, name: 'Interac', icon: '💳', fee: '3%', time: '2-5 min' },
    { id: 'mobile' as const, name: 'Mobile Money', icon: '📱', fee: '2%', time: '2-5 min' }
  ];

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
    
    if (destination === 'wallet' && !walletAddress) {
      return;
    }
    
    if (destination === 'binance' && (!binanceEmail || !binanceUsername || !binanceId)) {
      return;
    }
    
    // Validation Interac
    if (paymentMethod === 'card' && (!interacData.firstName || !interacData.lastName || !interacData.email)) {
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
      notes: JSON.stringify({
        destination,
        phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : null,
        provider: paymentMethod === 'mobile' ? mobileData.provider : null,
        paymentMethod: paymentMethod,
        interacData: paymentMethod === 'card' ? interacData : null,
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
      
      // Si c'est Mobile Money, créer une transaction NabooPay et rediriger
      if (paymentMethod === 'mobile') {
        const nabooResult = await createTransaction({
          orderId: result.id,
          amount: parseFloat(fiatAmount),
          products: [{
            name: `Achat USDT - ${parseFloat(usdtAmount).toFixed(2)} USDT`,
            category: 'Crypto',
            amount: parseFloat(fiatAmount),
            quantity: 1,
            description: `Achat de ${parseFloat(usdtAmount).toFixed(2)} USDT via ${mobileData.provider.toUpperCase()}`
          }],
          paymentMethods: [mobileData.provider === 'wave' ? 'WAVE' : 'ORANGE_MONEY'],
          successUrl: `${window.location.origin}/dashboard`,
          errorUrl: `${window.location.origin}/dashboard`
        });

        if (nabooResult?.success && nabooResult.checkoutUrl) {
          // Rediriger vers NabooPay
          window.location.href = nabooResult.checkoutUrl;
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de créer le paiement. Veuillez réessayer.",
            variant: "destructive"
          });
          setLoading(false);
        }
      } else {
        // Pour Interac, afficher les instructions manuelles
        setShowInstructions(true);
      }
    }
    
    setLoading(false);
  };

  const handlePaymentConfirmed = () => {
    setShowInstructions(false);
    setShowPending(true);
  };

  const handleBackToHome = () => {
    setFiatAmount('');
    setWalletAddress('');
    setBinanceEmail('');
    setBinanceUsername('');
    setBinanceId('');
    setInteracData({ firstName: '', lastName: '', email: '', phone: '' });
    setMobileData({ phoneNumber: '', provider: 'wave' });
    setShowPending(false);
    setCurrentOrderId('');
  };

  const handleKYCRequired = () => {
    setShowKYCPage(true);
  };

  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  if (showHighVolumeRequest) {
    return (
      <HighVolumeRequest 
        onBack={() => setShowHighVolumeRequest(false)}
        requestedAmount={fiatAmount}
      />
    );
  }

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
      <style>
        {`
          .usdt-icon-force-visible {
            filter: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: inline-block !important;
            background: none !important;
            -webkit-filter: none !important;
            backdrop-filter: none !important;
          }
        `}
      </style>
      <div className="min-h-screen bg-terex-dark p-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 px-1 md:px-0">
            <div className="flex items-center mb-2">
              <img 
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                alt="USDT" 
                className="w-8 h-8 mr-3 usdt-icon-force-visible"
              />
              <h1 className="text-2xl sm:text-3xl font-light text-white">Acheter USDT</h1>
            </div>
            <p className="text-gray-400">Achetez des USDT avec de l'argent fiat</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-0 md:gap-6 px-0 lg:px-0">
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
                  <LimitsValidator 
                    amount={fiatAmount} 
                    currency={currency} 
                    onHighVolumeRequest={handleHighVolumeRequest}
                  >
                    <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'mobile')} className="space-y-6">
                      <TabsList className="grid w-full grid-cols-2 bg-terex-gray">
                        <TabsTrigger 
                          value="card"
                          className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-xs md:text-sm"
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Interac_logo.svg/256px-Interac_logo.svg.png" 
                            alt="Interac" 
                            className="mr-1 md:mr-2 w-4 h-4"
                            onError={(e) => {
                              e.currentTarget.src = "/lovable-uploads/3c0dd5e1-7e00-4dd0-add4-bc08aef7010c.png";
                            }}
                          />
                          <span className="hidden sm:inline">Interac</span>
                          <span className="sm:hidden">Interac</span>
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

                          <DestinationSelector
                            destination={destination}
                            setDestination={setDestination}
                          />

                          {destination === 'wallet' && (
                            <>
                              <NetworkSelector
                                network={network}
                                setNetwork={setNetwork}
                              />

                              <WalletAddressInput
                                walletAddress={walletAddress}
                                setWalletAddress={setWalletAddress}
                                network={network}
                              />
                            </>
                          )}

                          {destination === 'binance' && (
                            <BinanceEmailInput
                              email={binanceEmail}
                              setEmail={setBinanceEmail}
                              username={binanceUsername}
                              setUsername={setBinanceUsername}
                              binanceId={binanceId}
                              setBinanceId={setBinanceId}
                            />
                          )}

                          {method.id === 'card' ? (
                            <InteracForm
                              interacData={interacData}
                              setInteracData={setInteracData}
                            />
                          ) : (
                            <PaymentMethodForm
                              paymentMethod={paymentMethod}
                              cardData={{number: '', expiryMonth: '', expiryYear: '', cvv: '', name: ''}}
                              setCardData={() => {}}
                              mobileData={mobileData}
                              setMobileData={setMobileData}
                            />
                          )}

                          <Button 
                            size="lg"
                            className="w-full gradient-button text-white font-semibold h-12 text-lg"
                            disabled={!fiatAmount || 
                              (destination === 'wallet' && !walletAddress) ||
                              (destination === 'binance' && (!binanceEmail || !binanceUsername || !binanceId)) ||
                              limitMessage.type === 'error' || limitMessage.type === 'max-reached' ||
                              (paymentMethod === 'card' && (!interacData.firstName || !interacData.lastName || !interacData.email)) ||
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

            <div className="px-0 lg:px-0 mt-4 lg:mt-0">
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
      </div>
    </KYCProtection>
  );
}
