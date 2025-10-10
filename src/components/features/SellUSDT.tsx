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
import { SellOrderConfirmation } from '@/components/features/SellOrderConfirmation';
import { USDTSendingInstructions } from '@/components/features/USDTSendingInstructions';
import { USDTSentConfirmation } from '@/components/features/USDTSentConfirmation';
import { BinancePayOption } from '@/components/features/sell-usdt/BinancePayOption';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { KYCProtection } from './KYCProtection';
import { KYCPage } from './KYCPage';
import { useTerexRates } from '@/hooks/useTerexRates';
import { MobileSellUSDT } from './sell-usdt/MobileSellUSDT';
import { DesktopSellUSDT as DesktopSellUSDTComponent } from './sell-usdt/DesktopSellUSDT';
import { useIsMobile } from '@/hooks/use-mobile';

// Adresses de portefeuille par réseau - Vos vraies adresses
const WALLET_ADDRESSES = {
  TRC20: 'TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb',
  BEP20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84', 
  ERC20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Arbitrum: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Polygon: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Solana: '8ES2hxsfqZVX3cjxWLBJ8jCdzSu9hTBYELSkX82UdnhN',
  Aptos: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84'
};

// Logos des réseaux blockchain
const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', // Tron
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', // BSC/BNB
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', // Ethereum
  Arbitrum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png', // Arbitrum
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png', // Polygon
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', // Solana
  Aptos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' // Aptos
};

export function SellUSDT() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSellUSDT /> : <DesktopSellUSDTComponent />;
}

function DesktopSellUSDT() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile'>('bank');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [useBinancePay, setUseBinancePay] = useState(false);
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

  // Utilisation des taux automatiques pour les achats USDT (TEREX achète)
  const { 
    terexBuyRateCfa, 
    terexBuyRateCad, 
    marketRateCfa, 
    marketRateCad, 
    loading: ratesLoading, 
    error: ratesError,
    lastUpdated,
    refresh: refreshRates
  } = useTerexRates(2);

  const exchangeRates = {
    CFA: terexBuyRateCfa
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

  const fiatAmount = usdtAmount ? formatAmount(parseFloat(usdtAmount) * exchangeRates[currency as keyof typeof exchangeRates]) : '0';

  const paymentMethods = [
    { id: 'bank' as const, name: 'Virement bancaire', icon: '🏦', fee: '0%', time: '2-5 min' },
    { id: 'mobile' as const, name: 'Mobile Money', icon: '📱', fee: '0%', time: '2-5 min' }
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
    
    // Vérifier KYC avant de confirmer
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const dbPaymentMethod = paymentMethod === 'bank' ? 'card' : 'mobile';
    
    const orderData = {
      user_id: user.id,
      type: 'sell' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRates[currency as keyof typeof exchangeRates],
      payment_method: dbPaymentMethod as 'card' | 'mobile',
      network: useBinancePay ? 'Binance Pay' : network,
      wallet_address: useBinancePay ? 'Binance Pay Transfer' : WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : bankData.accountNumber,
        provider: paymentMethod === 'mobile' ? mobileData.provider : 'bank',
        paymentMethod: paymentMethod,
        bankData: paymentMethod === 'bank' ? bankData : null,
        mobileData: paymentMethod === 'mobile' ? mobileData : null,
        useBinancePay: useBinancePay
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

  const handleKYCRequired = () => {
    setShowKYCPage(true);
  };

  // Si on est sur la page KYC
  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  // État de confirmation finale
  if (showFinalConfirmation) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
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
            network,
            walletAddress: WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
            paymentMethod: paymentMethod,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates],
            phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : bankData.accountNumber,
            provider: paymentMethod === 'mobile' ? mobileData.provider : 'bank',
            useBinancePay: useBinancePay
          }}
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
            network,
            walletAddress: WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
            paymentMethod: paymentMethod,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates],
            phoneNumber: paymentMethod === 'mobile' ? mobileData.phoneNumber : bankData.accountNumber,
            provider: paymentMethod === 'mobile' ? mobileData.provider : 'bank',
            useBinancePay: useBinancePay
          }}
          onConfirm={handleConfirmOrder}
          onBack={() => setShowConfirmation(false)}
          loading={loading}
        />
      </KYCProtection>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark px-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 px-1 md:px-0">
          <div className="flex items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-light text-white">Sell USDT</h1>
            <img
              src="https://cryptologos.cc/logos/tether-usdt-logo.png"
              alt="USDT"
              className="w-7 h-7 ml-2"
            />
          </div>
          <p className="text-gray-400">Convert your USDT to CFA instantly</p>
        </div>
      </div>
    </div>
  );
}
