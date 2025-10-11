import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useNabooPay } from '@/hooks/useNabooPay';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { BinanceEmailInput } from './BinanceEmailInput';
import { PURCHASE_LIMITS, getLimitMessage, enforceMaxLimit } from './LimitsValidator';
import { KYCPage } from '../KYCPage';

const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
  BINANCE: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png'
};

export function DesktopBuyUSDT() {
  const [step, setStep] = useState<'amount' | 'network' | 'address' | 'binance' | 'confirm'>('amount');
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [fiatAmount, setFiatAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile'>('mobile');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [binanceEmail, setBinanceEmail] = useState('');
  const [binanceUsername, setBinanceUsername] = useState('');
  const [binanceId, setBinanceId] = useState('');
  const [loading, setLoading] = useState(false);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { createTransaction } = useNabooPay();
  const { terexRateCfa, terexRateCad } = useTerexRates(2);
  const { isAuthorized, kycStatus } = useTransactionAuthorization();

  const exchangeRate = currency === 'CFA' ? terexRateCfa : terexRateCad;
  const limits = PURCHASE_LIMITS[currency as keyof typeof PURCHASE_LIMITS];
  const numericAmount = parseFloat(fiatAmount) || 0;
  const usdtAmount = fiatAmount && numericAmount >= (limits?.min || 0) 
    ? (numericAmount / exchangeRate).toFixed(2) 
    : '0';

  const isBinanceNetwork = network === 'BINANCE';
  const limitMessage = getLimitMessage(fiatAmount, currency);

  const handleContinueToNetwork = () => {
    const numericAmount = parseFloat(fiatAmount);
    if (!fiatAmount || numericAmount <= 0) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant valide", variant: "destructive" });
      return;
    }
    
    if (limits && numericAmount < limits.min) {
      toast({ 
        title: "Montant trop faible", 
        description: `Le montant minimum est ${limits.min.toLocaleString()} ${currency}`, 
        variant: "destructive" 
      });
      return;
    }
    
    setStep('network');
  };

  const handleContinueToAddress = () => {
    if (isBinanceNetwork) {
      setStep('binance');
    } else {
      setStep('address');
    }
  };

  const handleContinueToBinanceConfirm = () => {
    if (!binanceEmail || !binanceUsername || !binanceId) {
      toast({ title: "Erreur", description: "Veuillez remplir toutes les informations Binance", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleContinueToConfirm = () => {
    if (!walletAddress) {
      toast({ title: "Erreur", description: "Veuillez entrer une adresse valide", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user) return;
    
    // Vérifier KYC avant de créer la transaction
    if (!isAuthorized) {
      setShowKYCPage(true);
      return;
    }
    
    setLoading(true);
    
    const orderData = {
      user_id: user.id,
      type: 'buy' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRate,
      payment_method: paymentMethod,
      network: isBinanceNetwork ? 'BINANCE' : network,
      wallet_address: isBinanceNetwork ? binanceEmail : walletAddress,
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        paymentMethod,
        mobilePayment: true,
        destination: isBinanceNetwork ? 'binance' : 'wallet',
        binanceData: isBinanceNetwork ? {
          email: binanceEmail,
          username: binanceUsername,
          binanceId: binanceId
        } : null
      })
    };

    const result = await createOrder(orderData);
    
    if (result) {
      const nabooResult = await createTransaction({
        orderId: result.id,
        amount: parseFloat(fiatAmount),
        products: [{
          name: `Achat USDT - ${parseFloat(usdtAmount).toFixed(2)} USDT`,
          category: 'Crypto',
          amount: parseFloat(fiatAmount),
          quantity: 1,
          description: `Achat de ${parseFloat(usdtAmount).toFixed(2)} USDT`
        }],
        paymentMethods: ['WAVE', 'ORANGE_MONEY'],
        successUrl: `${window.location.origin}/dashboard`,
        errorUrl: `${window.location.origin}/dashboard`
      });

      if (nabooResult?.success && nabooResult.checkoutUrl) {
        window.location.href = nabooResult.checkoutUrl;
      } else {
        toast({ title: "Erreur", description: "Impossible de créer le paiement", variant: "destructive" });
      }
    }
    
    setLoading(false);
  };

  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-lg">
        {/* Étape 1: Montant */}
        {step === 'amount' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-white">Acheter USDT</h2>
              <p className="text-sm text-gray-400 font-light">Entrez le montant que vous souhaitez dépenser</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-sm font-light">Montant</Label>
                  {limits && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFiatAmount(limits.min.toString())}
                        className="text-xs text-terex-accent underline font-light hover:text-terex-accent/80 transition-colors"
                      >
                        Min
                      </button>
                      <button
                        type="button"
                        onClick={() => setFiatAmount(limits.max.toString())}
                        className="text-xs text-terex-accent underline font-light hover:text-terex-accent/80 transition-colors"
                      >
                        Max
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    value={fiatAmount}
                    onChange={(e) => setFiatAmount(enforceMaxLimit(e.target.value, currency))}
                    className="bg-terex-gray/50 border-terex-gray text-white text-3xl font-light h-16 text-center px-20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-light">
                    {currency}
                  </span>
                </div>
                
                {limitMessage.type && (
                  <p className={`text-xs font-light ${
                    limitMessage.type === 'error' 
                      ? 'text-red-400' 
                      : limitMessage.type === 'max-reached'
                      ? 'text-terex-accent'
                      : 'text-yellow-400'
                  }`}>
                    {limitMessage.message}
                  </p>
                )}
              </div>

              <div className="bg-terex-gray/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-light">Vous recevez</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-light">{usdtAmount} USDT</span>
                    <img 
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                      alt="USDT" 
                      className="w-5 h-5"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm font-light">Taux</span>
                  <span className="text-white font-light">1 USDT = {exchangeRate} {currency}</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleContinueToNetwork}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Étape 2: Réseau */}
        {step === 'network' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="space-y-2">
              <button 
                onClick={() => setStep('amount')}
                className="p-2 hover:bg-terex-gray/50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white">Destination</h2>
              <p className="text-sm text-gray-400 font-light">
                Choisissez où vous voulez recevoir vos USDT
              </p>
            </div>
            
            <div className="space-y-2">
              {Object.entries(NETWORK_LOGOS).map(([net, logo]) => (
                <button
                  key={net}
                  onClick={() => setNetwork(net)}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    network === net 
                      ? 'border-terex-accent bg-terex-accent/10' 
                      : 'border-terex-gray bg-terex-gray/30 hover:bg-terex-gray/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={logo} alt={net} className="w-8 h-8 rounded-full" />
                      <span className="text-white font-light">{net}</span>
                    </div>
                    {network === net && <Check className="w-5 h-5 text-terex-accent" />}
                  </div>
                </button>
              ))}
            </div>

            <Button 
              onClick={handleContinueToAddress}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Étape 3: Adresse Wallet */}
        {step === 'address' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="space-y-2">
              <button 
                onClick={() => setStep('network')}
                className="p-2 hover:bg-terex-gray/50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white">Adresse de réception</h2>
              <p className="text-sm text-gray-400 font-light">
                Entrez votre adresse {network} pour recevoir les USDT
              </p>
            </div>
            
            <div className="relative">
              <Input
                placeholder={`Votre adresse ${network}`}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-terex-gray/50 border-terex-gray text-white h-12 font-light pr-12"
              />
              <img 
                src={NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS]} 
                alt={network} 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
              />
            </div>

            <Button 
              onClick={handleContinueToConfirm}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Étape 3bis: Compte Binance */}
        {step === 'binance' && (
          <div className="space-y-6 rounded-2xl p-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="space-y-2">
              <button 
                onClick={() => setStep('network')}
                className="p-2 hover:bg-terex-gray/50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white flex items-center gap-2">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
                  alt="Binance" 
                  className="w-6 h-6 rounded"
                />
                Compte Binance
              </h2>
              <p className="text-sm text-gray-400 font-light">
                Vos USDT seront envoyés directement sur votre compte Binance
              </p>
            </div>
            
            <BinanceEmailInput
              email={binanceEmail}
              setEmail={setBinanceEmail}
              username={binanceUsername}
              setUsername={setBinanceUsername}
              binanceId={binanceId}
              setBinanceId={setBinanceId}
            />

            <Button 
              onClick={handleContinueToBinanceConfirm}
              disabled={!binanceEmail || !binanceUsername || !binanceId}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light disabled:opacity-50"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 'confirm' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="space-y-2">
              <button 
                onClick={() => isBinanceNetwork ? setStep('binance') : setStep('address')}
                className="p-2 hover:bg-terex-gray/50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white">Confirmer l'achat</h2>
              <p className="text-sm text-gray-400 font-light">
                Vérifiez les détails de votre transaction
              </p>
            </div>
            
            <div className="bg-terex-gray/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Montant</span>
                <span className="text-white font-light">{fiatAmount} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Vous recevez</span>
                <span className="text-white font-light">{usdtAmount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Destination</span>
                <span className="text-white font-light">{isBinanceNetwork ? 'Binance' : network}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400 font-light">{isBinanceNetwork ? 'Email' : 'Adresse'}</span>
                <span className="text-white font-light text-right text-xs break-all max-w-[60%]">
                  {isBinanceNetwork ? binanceEmail : walletAddress}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleConfirm}
              disabled={loading}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Confirmer et payer'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
