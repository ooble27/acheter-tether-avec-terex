import { useState, useEffect } from 'react';
import { MaintenanceNotice, MAINTENANCE_MODE } from './MaintenanceNotice';
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
import { DesktopBuyUSDT as DesktopBuyUSDTComponent } from './buy-usdt/DesktopBuyUSDT';
import { useIsMobile } from '@/hooks/use-mobile';

export function BuyUSDT() {
  const isMobile = useIsMobile();
  if (MAINTENANCE_MODE) return <MaintenanceNotice />;
  return isMobile ? <MobileBuyUSDT /> : <DesktopBuyUSDTComponent />;
}

function DesktopBuyUSDTOld() {
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
    
    // Vérifier KYC avant de confirmer
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
    <>
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
              <h1 className="text-2xl md:text-3xl font-light text-white">Buy USDT</h1>
              <img
                src="https://cryptologos.cc/logos/tether-usdt-logo.png"
                alt="USDT"
                className="w-7 h-7 ml-2 usdt-icon-force-visible"
              />
            </div>
            <p className="text-gray-400">Fast and secure cryptocurrency purchase</p>
          </div>
        </div>
      </div>
    </>
  );
}
