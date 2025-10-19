import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Switch } from '@/components/ui/switch';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { ArrowRight, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KYCPage } from '../KYCPage';
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
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png'
};
export function MobileSellUSDT() {
  const [step, setStep] = useState<'amount' | 'network' | 'binance' | 'phone' | 'confirm' | 'instructions'>('amount');
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState('');
  const [paymentMethod] = useState<'mobile'>('mobile');
  const [currency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'wave' | 'orange'>('wave');
  const [useBinancePay, setUseBinancePay] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { terexBuyRateCfa } = useTerexRates(2);
  const { isAuthorized, kycStatus } = useTransactionAuthorization();
  
  const fiatAmount = usdtAmount ? (parseFloat(usdtAmount) * terexBuyRateCfa).toFixed(2) : '0';
  const handleContinueToNetwork = () => {
    if (!usdtAmount || parseFloat(usdtAmount) <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }
    setStep('network');
  };
  const handleContinueToPhone = () => {
    if (useBinancePay) {
      setStep('binance');
    } else {
      setStep('phone');
    }
  };
  const handleContinueFromBinance = () => {
    setStep('phone');
  };
  const handleContinueToConfirm = () => {
    if (!phoneNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro de téléphone",
        variant: "destructive"
      });
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
      type: 'sell' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: terexBuyRateCfa,
      payment_method: paymentMethod,
      network: useBinancePay ? 'Binance Pay' : network,
      wallet_address: useBinancePay ? 'Binance Pay Transfer' : WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES],
      status: 'pending' as const,
      payment_status: 'pending',
      notes: JSON.stringify({
        phoneNumber,
        provider,
        paymentMethod,
        useBinancePay
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
  
  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }
  return (
    <div className="min-h-screen flex items-start justify-center bg-terex-dark p-4 pt-20 pb-24">
      <div className="w-full max-w-md">
        {/* Étape 1: Montant */}
        {step === 'amount' && (
          <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-white">Vendre USDT</h2>
            <p className="text-sm text-gray-400 font-light">Entrez le montant que vous souhaitez vendre</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white text-sm font-light">Montant USDT</Label>
              <div className="relative">
                <Input type="number" placeholder="0" value={usdtAmount} onChange={e => setUsdtAmount(e.target.value)} className="bg-terex-darker border-terex-gray text-white text-3xl font-light h-16 text-center px-20" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-gray-400 text-lg font-light">USDT</span>
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-5 h-5" />
                </span>
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

          <Button onClick={handleContinueToNetwork} className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light">
            Continuer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Drawer pour l'étape 2: Réseau + Binance Pay */}
      <Drawer open={step === 'network'} onOpenChange={open => !open && setStep('amount')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader className="relative">
            <button 
              onClick={() => setStep('amount')}
              className="absolute left-4 top-4 p-2 hover:bg-terex-gray/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <DrawerTitle className="text-white font-light">Mode d'envoi</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Choisissez comment vous voulez envoyer vos USDT
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4">
            {/* Option Binance Pay */}
            <div className="bg-terex-gray/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="text-white font-medium">Binance Pay</h3>
                    <p className="text-xs text-gray-400">Envoi instantané depuis Binance</p>
                  </div>
                </div>
                <Switch checked={useBinancePay} onCheckedChange={setUseBinancePay} className="data-[state=checked]:bg-terex-accent" />
              </div>
              
              {useBinancePay && <Alert className="border-terex-accent/30 bg-terex-accent/10">
                  <AlertCircle className="h-4 w-4 text-terex-accent" />
                  <AlertDescription className="text-terex-accent text-xs">
                    Vous devrez envoyer vos USDT via Binance Pay à notre ID Binance Pay
                  </AlertDescription>
                </Alert>}
            </div>

            {/* Sélection du réseau si Binance Pay désactivé */}
            {!useBinancePay && <div className="space-y-2">
                <Label className="text-white text-sm">Réseau blockchain</Label>
                {Object.entries(NETWORK_LOGOS).map(([net, logo]) => <button key={net} onClick={() => setNetwork(net)} className={`w-full p-4 rounded-lg border transition-all ${network === net ? 'border-terex-accent bg-terex-accent/10' : 'border-terex-gray bg-terex-gray/50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={logo} alt={net} className="w-8 h-8 rounded-full" />
                        <span className="text-white font-light">{net}</span>
                      </div>
                      {network === net && <Check className="w-5 h-5 text-terex-accent" />}
                    </div>
                  </button>)}
              </div>}
          </div>

          <DrawerFooter>
            <Button onClick={handleContinueToPhone} className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light">
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer Binance Pay Info */}
      <Drawer open={step === 'binance'} onOpenChange={open => !open && setStep('network')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader className="relative">
            <button 
              onClick={() => setStep('network')}
              className="absolute left-4 top-4 p-2 hover:bg-terex-gray/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <DrawerTitle className="text-white font-light flex items-center gap-2 ml-12">
              <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" className="w-6 h-6 rounded" />
              Binance Pay
            </DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Instructions pour l'envoi via Binance Pay
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4">
            <Alert className="border-terex-accent/30 bg-terex-accent/10">
              <AlertCircle className="h-4 w-4 text-terex-accent" />
              <AlertDescription className="text-white text-sm space-y-2">
                <p className="font-medium">Pour envoyer vos USDT via Binance Pay :</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-300">
                  <li>Ouvrez l'application Binance</li>
                  <li>Allez dans "Pay" puis "Envoyer"</li>
                  <li>Envoyez à l'email: lomohamed834@gmail.com</li>
                  <li>Ou utilisez l'ID: 450715599</li>
                  <li>Montant exact: {usdtAmount} USDT</li>
                  <li>Confirmez l'envoi</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="bg-terex-gray rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Email Binance</span>
                <span className="text-white text-sm">lomohamed834@gmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">ID Binance Pay</span>
                <span className="text-white font-medium text-lg">450715599</span>
              </div>
              <p className="text-terex-accent text-xs text-center">Utilisez cet ID dans Binance Pay</p>
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleContinueFromBinance} className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light">
              J'ai compris
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer pour l'étape 3: Téléphone & Provider */}
      <Drawer open={step === 'phone'} onOpenChange={open => !open && (useBinancePay ? setStep('binance') : setStep('network'))}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader className="relative">
            <button 
              onClick={() => useBinancePay ? setStep('binance') : setStep('network')}
              className="absolute left-4 top-4 p-2 hover:bg-terex-gray/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <DrawerTitle className="text-white font-light">Informations de paiement</DrawerTitle>
            <DrawerDescription className="text-gray-400 font-light">
              Entrez votre numéro Mobile Money
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-white text-sm font-light">Service Mobile Money</Label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setProvider('wave')} className={`p-4 rounded-lg border transition-all ${provider === 'wave' ? 'border-terex-accent bg-terex-accent/10' : 'border-terex-gray bg-terex-gray/50'}`}>
                  <div className="flex flex-col items-center space-y-2">
                    <img 
                      src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" 
                      alt="Wave" 
                      className="w-10 h-10"
                    />
                    <span className="text-white font-light text-sm">Wave</span>
                    {provider === 'wave' && <Check className="w-4 h-4 text-terex-accent" />}
                  </div>
                </button>
                <button onClick={() => setProvider('orange')} className={`p-4 rounded-lg border transition-all ${provider === 'orange' ? 'border-terex-accent bg-terex-accent/10' : 'border-terex-gray bg-terex-gray/50'}`}>
                  <div className="flex flex-col items-center space-y-2">
                    <img 
                      src="/payment-methods/orange-money-logo.png" 
                      alt="Orange Money" 
                      className="w-10 h-10"
                    />
                    <span className="text-white font-light text-sm">Orange Money</span>
                    {provider === 'orange' && <Check className="w-4 h-4 text-terex-accent" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm font-light">Numéro de téléphone</Label>
              <Input placeholder="+221 XX XXX XX XX" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="bg-terex-gray border-terex-gray-light text-white h-12 font-light" />
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleContinueToConfirm} className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light">
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer pour l'étape 4: Confirmation */}
      <Drawer open={step === 'confirm'} onOpenChange={open => !open && setStep('phone')}>
        <DrawerContent className="bg-terex-darker border-terex-gray">
          <DrawerHeader className="relative">
            <button 
              onClick={() => setStep('phone')}
              className="absolute left-4 top-4 p-2 hover:bg-terex-gray/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
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
            <Button onClick={handleConfirm} disabled={loading} className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light">
              {loading ? 'Traitement...' : 'Confirmer'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer pour l'étape 5: Instructions d'envoi */}
      <Drawer open={step === 'instructions'} onOpenChange={open => !open && handleBackToDashboard()}>
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
              
              {useBinancePay ? (
                <div className="pt-3 border-t border-terex-gray-light space-y-3">
                  <p className="text-gray-400 text-sm font-light mb-2">Via Binance Pay à:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Email:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">lomohamed834@gmail.com</span>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText('lomohamed834@gmail.com');
                            toast({ title: "Copié !", description: "Email copié dans le presse-papiers" });
                          }}
                          size="sm"
                          className="bg-terex-accent hover:bg-terex-accent/80 h-6 w-6 p-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">ID Binance:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-light">450715599</span>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText('450715599');
                            toast({ title: "Copié !", description: "ID Binance copié dans le presse-papiers" });
                          }}
                          size="sm"
                          className="bg-terex-accent hover:bg-terex-accent/80 h-6 w-6 p-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                      if (isMobile) {
                        window.location.href = 'binance://';
                        setTimeout(() => {
                          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                          if (isIOS) {
                            window.open('https://apps.apple.com/app/binance-buy-bitcoin-crypto/id1436799971', '_blank');
                          } else {
                            window.open('https://play.google.com/store/apps/details?id=com.binance.dev', '_blank');
                          }
                        }, 1000);
                      } else {
                        window.open('https://www.binance.com', '_blank');
                      }
                    }}
                    className="w-full h-10 bg-terex-accent hover:bg-terex-accent/90 text-black font-light mt-2"
                  >
                    <img src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" alt="Binance" className="w-5 h-5 mr-2" />
                    Ouvrir Binance Pay
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-400 font-light">sur le réseau {network}</p>
                  
                  <div className="pt-3 border-t border-terex-gray-light">
                    <p className="text-gray-400 text-sm font-light mb-2">À l'adresse:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white text-xs break-all font-light flex-1">{WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES]}</p>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(WALLET_ADDRESSES[network as keyof typeof WALLET_ADDRESSES]);
                          toast({ title: "Copié !", description: "Adresse copiée dans le presse-papiers" });
                        }}
                        size="sm"
                        className="bg-terex-accent hover:bg-terex-accent/80 h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-200 text-xs font-light">
                Une fois l'envoi effectué, nous traiterons votre paiement en 2-5 minutes.
              </p>
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleBackToDashboard} className="w-full h-12 bg-terex-accent hover:bg-terex-accent/90 text-black font-light">
              Compris
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      </div>
    </div>
  );
}