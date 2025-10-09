import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ArrowRightLeft, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useNabooPay } from '@/hooks/useNabooPay';
import { KYCProtection } from '../KYCProtection';
import { NetworkSelector } from './NetworkSelector';
import { WalletAddressInput } from './WalletAddressInput';

export function SimplifiedBuyUSDT() {
  const [step, setStep] = useState<'amount' | 'destination' | 'confirmation'>('amount');
  const [fiatAmount, setFiatAmount] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { createTransaction } = useNabooPay();
  const { terexRateCfa } = useTerexRates(2);

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    if (num === Math.floor(num)) return num.toString();
    return parseFloat(num.toFixed(2)).toString();
  };

  const usdtAmount = fiatAmount ? formatAmount(parseFloat(fiatAmount) / terexRateCfa) : '0';

  const handleConfirmOrder = async () => {
    if (!user || !fiatAmount || !walletAddress) return;
    
    setLoading(true);
    
    const orderData = {
      user_id: user.id,
      type: 'buy' as const,
      amount: parseFloat(fiatAmount),
      currency: 'CFA',
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: terexRateCfa,
      payment_method: 'mobile' as const,
      network: network,
      wallet_address: walletAddress,
      status: 'pending' as const,
      payment_status: 'pending'
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
        toast({
          title: "Erreur",
          description: "Impossible de créer le paiement. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    }
    
    setLoading(false);
  };

  return (
    <KYCProtection onKYCRequired={() => {}}>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <img 
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
              alt="USDT" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Acheter USDT</h1>
              <p className="text-sm text-muted-foreground font-light">Simple, rapide et sécurisé</p>
            </div>
          </div>

          {/* Main Card */}
          <Card className="bg-card border-border/50 shadow-xl">
            <CardContent className="p-6 space-y-6">
              {/* Montant */}
              <div className="space-y-4">
                <Label className="text-base font-medium text-foreground">Combien voulez-vous acheter ?</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-light text-muted-foreground">Vous payez</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        value={fiatAmount}
                        onChange={(e) => setFiatAmount(e.target.value)}
                        className="bg-muted/30 border-border text-foreground text-2xl h-16 pr-20 font-light"
                      />
                      <div className="absolute right-3 top-4 text-lg font-medium text-primary">
                        CFA
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-light text-muted-foreground">Vous recevez</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={usdtAmount}
                        readOnly
                        className="bg-muted/30 border-border text-foreground text-2xl h-16 pr-24 font-light"
                      />
                      <div className="absolute right-3 top-4 flex items-center space-x-2">
                        <img 
                          src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                          alt="USDT" 
                          className="w-6 h-6"
                        />
                        <span className="text-lg font-medium text-primary">USDT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-2">
                  <ArrowRightLeft className="w-5 h-5 text-primary" />
                </div>

                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-light">Taux TEREX</span>
                    <span className="text-foreground font-medium">1 USDT = {terexRateCfa} CFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-light">Frais</span>
                    <span className="text-primary font-medium">0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-light">Traitement</span>
                    <span className="text-primary font-medium">2-5 min</span>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <Sheet>
                <Button
                  variant="outline"
                  className="w-full h-14 justify-between text-base"
                  onClick={() => {}}
                >
                  <span className="font-light">
                    {walletAddress ? `${network} • ${walletAddress.slice(0, 8)}...` : 'Sélectionner votre wallet'}
                  </span>
                  <ArrowRightLeft className="w-5 h-5" />
                </Button>
                
                <SheetContent side="right" className="bg-card border-border w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="text-foreground font-semibold">Adresse de réception</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    <NetworkSelector network={network} setNetwork={setNetwork} />
                    <WalletAddressInput 
                      walletAddress={walletAddress}
                      setWalletAddress={setWalletAddress}
                      network={network}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Bouton Commander */}
              <Button
                onClick={handleConfirmOrder}
                disabled={!fiatAmount || !walletAddress || loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  'Traitement...'
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-6 w-6" />
                    Payer {fiatAmount || '0'} CFA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground font-light">
            <p>Paiement sécurisé via Wave ou Orange Money</p>
            <p className="mt-1">USDT envoyé automatiquement après confirmation</p>
          </div>
        </div>
      </div>
    </KYCProtection>
  );
}
