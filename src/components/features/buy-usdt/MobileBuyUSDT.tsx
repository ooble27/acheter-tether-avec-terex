import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useNabooPay } from '@/hooks/useNabooPay';
import { ArrowRight, Check } from 'lucide-react';

const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Arbitrum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'
};

export function MobileBuyUSDT() {
  const [step, setStep] = useState<'amount' | 'network' | 'address' | 'confirm'>('amount');
  const [fiatAmount, setFiatAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile'>('mobile');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { createTransaction } = useNabooPay();
  const { terexRateCfa, terexRateCad } = useTerexRates(2);

  const exchangeRate = currency === 'CFA' ? terexRateCfa : terexRateCad;
  const usdtAmount = fiatAmount ? (parseFloat(fiatAmount) / exchangeRate).toFixed(2) : '0';

  const handleContinueToNetwork = () => {
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant valide", variant: "destructive" });
      return;
    }
    setStep('network');
  };

  const handleContinueToAddress = () => {
    setStep('address');
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
    
    setLoading(true);
    
    const orderData = {
      user_id: user.id,
      type: 'buy' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRate,
      payment_method: paymentMethod,
      network,
      wallet_address: walletAddress,
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        paymentMethod,
        mobilePayment: true
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

  return (
    <div className="h-full bg-terex-dark">
      {/* Étape 1: Montant */}
      {step === 'amount' && (
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-white">Acheter USDT</h2>
            <p className="text-sm text-gray-400 font-light">Entrez le montant que vous souhaitez dépenser</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white text-sm font-light">Montant</Label>
              <Input
                type="number"
                placeholder="0"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                className="bg-terex-darker border-terex-gray text-white text-3xl font-light h-16 text-center"
              />
              <p className="text-center text-sm text-gray-400 font-light">{currency}</p>
            </div>

            <div className="bg-terex-darker rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm font-light">Vous recevez</span>
                <span className="text-white font-light">{usdtAmount} USDT</span>
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

      {/* Drawer pour l'étape 2: Réseau */}
      <Drawer open={step === 'network'} onOpenChange={(open) => !open && setStep('amount')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader>
            <DrawerTitle className="text-white font-light">Sélectionner le réseau</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Choisissez le réseau blockchain pour recevoir vos USDT
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-2">
            {Object.entries(NETWORK_LOGOS).map(([net, logo]) => (
              <button
                key={net}
                onClick={() => setNetwork(net)}
                className={`w-full p-4 rounded-lg border transition-all ${
                  network === net 
                    ? 'border-terex-accent bg-terex-accent/10' 
                    : 'border-terex-gray bg-terex-gray/50'
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

          <DrawerFooter>
            <Button 
              onClick={handleContinueToAddress}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer pour l'étape 3: Adresse */}
      <Drawer open={step === 'address'} onOpenChange={(open) => !open && setStep('network')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader>
            <DrawerTitle className="text-white font-light">Adresse de réception</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Entrez votre adresse {network} pour recevoir les USDT
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4">
            <Input
              placeholder={`Votre adresse ${network}`}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-terex-gray border-terex-gray-light text-white h-12 font-light"
            />
          </div>

          <DrawerFooter>
            <Button 
              onClick={handleContinueToConfirm}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer pour l'étape 4: Confirmation */}
      <Drawer open={step === 'confirm'} onOpenChange={(open) => !open && setStep('address')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader>
            <DrawerTitle className="text-white font-light">Confirmer l'achat</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Vérifiez les détails de votre transaction
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4">
            <div className="bg-terex-gray rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Montant</span>
                <span className="text-white font-light">{fiatAmount} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Vous recevez</span>
                <span className="text-white font-light">{usdtAmount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Réseau</span>
                <span className="text-white font-light">{network}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400 font-light">Adresse</span>
                <span className="text-white font-light text-right text-xs break-all max-w-[60%]">{walletAddress}</span>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <Button 
              onClick={handleConfirm}
              disabled={loading}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              {loading ? 'Traitement...' : 'Confirmer et payer'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
