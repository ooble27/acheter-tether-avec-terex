import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { ArrowRight, Check } from 'lucide-react';

const WALLET_ADDRESSES = {
  TRC20: 'TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb',
  BEP20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
  ERC20: '0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84',
};

const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
};

export function MobileSellUSDT() {
  const [step, setStep] = useState<'amount' | 'network' | 'phone' | 'confirm' | 'instructions'>('amount');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [paymentMethod] = useState<'mobile'>('mobile');
  const [currency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'wave' | 'orange'>('wave');
  const [loading, setLoading] = useState(false);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { terexBuyRateCfa } = useTerexRates(2);

  const fiatAmount = usdtAmount ? (parseFloat(usdtAmount) * terexBuyRateCfa).toFixed(2) : '0';

  const handleContinueToNetwork = () => {
    if (!usdtAmount || parseFloat(usdtAmount) <= 0) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant valide", variant: "destructive" });
      return;
    }
    setStep('network');
  };

  const handleContinueToPhone = () => {
    setStep('phone');
  };

  const handleContinueToConfirm = () => {
    if (!phoneNumber) {
      toast({ title: "Erreur", description: "Veuillez entrer un numéro de téléphone", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const orderData = {
      user_id: user.id,
      type: 'sell' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: terexBuyRateCfa,
      payment_method: paymentMethod,
      network,
      wallet_address: WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        phoneNumber,
        provider,
        paymentMethod
      })
    };

    const result = await createOrder(orderData);
    
    if (result) {
      setStep('instructions');
    }
    
    setLoading(false);
  };

  const handleBackToDashboard = () => {
    setStep('amount');
    setUsdtAmount('');
    setPhoneNumber('');
  };

  return (
    <div className="h-full bg-terex-dark">
      {/* Étape 1: Montant */}
      {step === 'amount' && (
        <div className="p-4 space-y-6">
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
                  className="bg-terex-darker border-terex-gray text-white text-3xl font-light h-16 text-center pr-24"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                    alt="USDT" 
                    className="w-8 h-8"
                  />
                  <span className="text-gray-400 text-sm font-light">USDT</span>
                </div>
              </div>
            </div>

            <div className="bg-terex-darker rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm font-light">Vous recevez</span>
                <span className="text-white font-light">{fiatAmount} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm font-light">Taux</span>
                <span className="text-white font-light">1 USDT = {terexBuyRateCfa} {currency}</span>
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
            <DrawerTitle className="text-white font-light">Réseau d'envoi</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Sélectionnez le réseau sur lequel vous enverrez vos USDT
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
              onClick={handleContinueToPhone}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer pour l'étape 3: Téléphone & Provider */}
      <Drawer open={step === 'phone'} onOpenChange={(open) => !open && setStep('network')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader>
            <DrawerTitle className="text-white font-light">Informations de paiement</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Entrez votre numéro Mobile Money
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-white text-sm font-light">Service Mobile Money</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setProvider('wave')}
                  className={`p-4 rounded-lg border transition-all ${
                    provider === 'wave' 
                      ? 'border-terex-accent bg-terex-accent/10' 
                      : 'border-terex-gray bg-terex-gray/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-light">Wave</span>
                    {provider === 'wave' && <Check className="w-5 h-5 text-terex-accent" />}
                  </div>
                </button>
                <button
                  onClick={() => setProvider('orange')}
                  className={`p-4 rounded-lg border transition-all ${
                    provider === 'orange' 
                      ? 'border-terex-accent bg-terex-accent/10' 
                      : 'border-terex-gray bg-terex-gray/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-light">Orange Money</span>
                    {provider === 'orange' && <Check className="w-5 h-5 text-terex-accent" />}
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
                className="bg-terex-gray border-terex-gray-light text-white h-12 font-light"
              />
            </div>
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
      <Drawer open={step === 'confirm'} onOpenChange={(open) => !open && setStep('phone')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader>
            <DrawerTitle className="text-white font-light">Confirmer la vente</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Vérifiez les détails de votre transaction
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4">
            <div className="bg-terex-gray rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Vous envoyez</span>
                <span className="text-white font-light">{usdtAmount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Vous recevez</span>
                <span className="text-white font-light">{fiatAmount} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Réseau</span>
                <span className="text-white font-light">{network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Service</span>
                <span className="text-white font-light">{provider === 'wave' ? 'Wave' : 'Orange Money'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Numéro</span>
                <span className="text-white font-light">{phoneNumber}</span>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <Button 
              onClick={handleConfirm}
              disabled={loading}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              {loading ? 'Traitement...' : 'Confirmer'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer pour l'étape 5: Instructions d'envoi */}
      <Drawer open={step === 'instructions'} onOpenChange={(open) => !open && handleBackToDashboard()}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader>
            <DrawerTitle className="text-white font-light">Envoyer vos USDT</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Suivez ces instructions pour compléter votre vente
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4">
            <div className="bg-terex-gray rounded-lg p-4 space-y-3">
              <p className="text-white font-light">Envoyez exactement:</p>
              <p className="text-2xl text-terex-accent font-light">{usdtAmount} USDT</p>
              <p className="text-sm text-gray-400 font-light">sur le réseau {network}</p>
              
              <div className="pt-3 border-t border-terex-gray-light">
                <p className="text-gray-400 text-sm font-light mb-2">À l'adresse:</p>
                <p className="text-white text-xs break-all font-light">{WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES]}</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-200 text-xs font-light">
                Une fois l'envoi effectué, nous traiterons votre paiement en 2-5 minutes.
              </p>
            </div>
          </div>

          <DrawerFooter>
            <Button 
              onClick={handleBackToDashboard}
              className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light"
            >
              Compris
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
