import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { ArrowRight, ArrowLeft, Check, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WALLET_ADDRESSES = {
  TRC20: 'TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb',
  BEP20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  ERC20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Arbitrum: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Polygon: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  Solana: '8ES2hxsfqZVX3cjxWLBJ8jCdzSu9hTBYELSkX82UdnhN',
  Aptos: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84'
};

const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Arbitrum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png'
};

export function DesktopSellUSDT() {
  const [step, setStep] = useState<'amount' | 'method' | 'network' | 'confirm' | 'success'>('amount');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile'>('mobile');
  const [currency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'wave' | 'orange'>('wave');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [loading, setLoading] = useState(false);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { terexBuyRateCfa } = useTerexRates(2);

  const exchangeRate = terexBuyRateCfa;
  const fiatAmount = usdtAmount ? (parseFloat(usdtAmount) * exchangeRate).toFixed(2) : '0';

  const handleContinueToMethod = () => {
    const numericAmount = parseFloat(usdtAmount);
    if (!usdtAmount || numericAmount <= 0) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant valide", variant: "destructive" });
      return;
    }
    setStep('method');
  };

  const handleContinueToNetwork = () => {
    if (paymentMethod === 'mobile' && !phoneNumber) {
      toast({ title: "Erreur", description: "Veuillez entrer votre numéro de téléphone", variant: "destructive" });
      return;
    }
    if (paymentMethod === 'bank' && (!bankName || !accountNumber || !accountHolder)) {
      toast({ title: "Erreur", description: "Veuillez remplir toutes les informations bancaires", variant: "destructive" });
      return;
    }
    setStep('network');
  };

  const handleContinueToConfirm = () => {
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const dbPaymentMethod = paymentMethod === 'bank' ? 'card' : 'mobile';
    
    const orderData = {
      user_id: user.id,
      type: 'sell' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRate,
      payment_method: dbPaymentMethod as 'card' | 'mobile',
      network: network,
      wallet_address: WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        phoneNumber: paymentMethod === 'mobile' ? phoneNumber : accountNumber,
        provider: paymentMethod === 'mobile' ? provider : 'bank',
        paymentMethod: paymentMethod,
        bankData: paymentMethod === 'bank' ? {
          bankName,
          accountNumber,
          accountHolder
        } : null,
        mobileData: paymentMethod === 'mobile' ? {
          phoneNumber,
          provider
        } : null
      })
    };

    const result = await createOrder(orderData);
    
    if (result) {
      setStep('success');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-lg">
        {/* Étape 1: Montant */}
        {step === 'amount' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-white">Vendre USDT</h2>
              <p className="text-sm text-gray-400 font-light">Entrez le montant d'USDT que vous souhaitez vendre</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white text-sm font-light">Montant USDT</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    value={usdtAmount}
                    onChange={(e) => setUsdtAmount(e.target.value)}
                    className="bg-terex-gray/50 border-terex-gray text-white text-3xl font-light h-16 text-center px-20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-light">
                    USDT
                  </span>
                </div>
              </div>

              <div className="bg-terex-gray/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-light">Vous recevez</span>
                  <span className="text-white font-light">{fiatAmount} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm font-light">Taux (achat)</span>
                  <span className="text-white font-light">1 USDT = {exchangeRate} {currency}</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleContinueToMethod}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Étape 2: Méthode de paiement */}
        {step === 'method' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="space-y-2">
              <button 
                onClick={() => setStep('amount')}
                className="p-2 hover:bg-terex-gray/50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white">Méthode de réception</h2>
              <p className="text-sm text-gray-400 font-light">
                Comment souhaitez-vous recevoir votre argent ?
              </p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`w-full p-4 rounded-lg border transition-all ${
                  paymentMethod === 'mobile' 
                    ? 'border-terex-accent bg-terex-accent/10' 
                    : 'border-terex-gray bg-terex-gray/30 hover:bg-terex-gray/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📱</span>
                    <span className="text-white font-light">Mobile Money</span>
                  </div>
                  {paymentMethod === 'mobile' && <Check className="w-5 h-5 text-terex-accent" />}
                </div>
              </button>
            </div>

            {paymentMethod === 'mobile' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white text-sm font-light">Opérateur</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setProvider('wave')}
                      className={`p-4 rounded-lg border transition-all ${
                        provider === 'wave' 
                          ? 'border-terex-accent bg-terex-accent/10' 
                          : 'border-terex-gray bg-terex-gray/30 hover:bg-terex-gray/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <img 
                          src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" 
                          alt="Wave" 
                          className="w-12 h-12"
                        />
                        <span className="text-white font-light">Wave</span>
                        {provider === 'wave' && <Check className="w-4 h-4 text-terex-accent" />}
                      </div>
                    </button>
                    <button
                      onClick={() => setProvider('orange')}
                      className={`p-4 rounded-lg border transition-all ${
                        provider === 'orange' 
                          ? 'border-terex-accent bg-terex-accent/10' 
                          : 'border-terex-gray bg-terex-gray/30 hover:bg-terex-gray/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <img 
                          src="/payment-methods/orange-money-logo.png" 
                          alt="Orange Money" 
                          className="w-12 h-12"
                        />
                        <span className="text-white font-light">Orange Money</span>
                        {provider === 'orange' && <Check className="w-4 h-4 text-terex-accent" />}
                      </div>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm font-light">Numéro de téléphone</Label>
                  <Input
                    placeholder="+221 XX XXX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-terex-gray/50 border-terex-gray text-white h-12 font-light"
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={handleContinueToNetwork}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Étape 3: Réseau */}
        {step === 'network' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="space-y-2">
              <button 
                onClick={() => setStep('method')}
                className="p-2 hover:bg-terex-gray/50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white">Réseau d'envoi</h2>
              <p className="text-sm text-gray-400 font-light">
                Choisissez le réseau sur lequel vous enverrez vos USDT
              </p>
            </div>
            
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200 text-sm">
                Vous devrez envoyer vos USDT à l'adresse que nous vous fournirons à l'étape suivante
              </AlertDescription>
            </Alert>

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
              onClick={handleContinueToConfirm}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
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
                onClick={() => setStep('network')}
                className="p-2 hover:bg-terex-gray/50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white">Confirmer la vente</h2>
              <p className="text-sm text-gray-400 font-light">
                Vérifiez les détails de votre transaction
              </p>
            </div>
            
            <div className="bg-terex-gray/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Vous vendez</span>
                <span className="text-white font-light">{usdtAmount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Vous recevez</span>
                <span className="text-white font-light">{fiatAmount} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Méthode de paiement</span>
                <span className="text-white font-light">{paymentMethod === 'mobile' ? 'Mobile Money' : 'Virement bancaire'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Réseau</span>
                <span className="text-white font-light">{network}</span>
              </div>
              {paymentMethod === 'mobile' && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-light">Téléphone</span>
                  <span className="text-white font-light">{phoneNumber}</span>
                </div>
              )}
            </div>

            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <Info className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200 text-sm">
                Après confirmation, vous recevrez l'adresse pour envoyer vos USDT
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleConfirm}
              disabled={loading}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              {loading ? 'Traitement...' : 'Confirmer la vente'}
            </Button>
          </div>
        )}

        {/* Étape 5: Succès */}
        {step === 'success' && (
          <div className="space-y-6 rounded-2xl p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-light text-white">Commande créée !</h2>
              <p className="text-sm text-gray-400 font-light">
                Envoyez maintenant vos USDT à l'adresse suivante
              </p>
            </div>

            <div className="bg-terex-gray/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Réseau</span>
                <span className="text-white font-light">{network}</span>
              </div>
              <div>
                <Label className="text-gray-400 font-light text-sm">Adresse de dépôt</Label>
                <div className="mt-2 p-3 bg-terex-gray/50 rounded-lg break-all text-white font-mono text-sm">
                  {WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES]}
                </div>
              </div>
            </div>

            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200 text-sm">
                Une fois l'envoi effectué, votre paiement sera traité dans les 2-5 minutes
              </AlertDescription>
            </Alert>

            <Button 
              onClick={() => {
                setStep('amount');
                setUsdtAmount('');
                setPhoneNumber('');
                setBankName('');
                setAccountNumber('');
                setAccountHolder('');
              }}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Retour à l'accueil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
