
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Smartphone, Shield, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentPageProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    paymentMethod: 'card' | 'mobile';
    exchangeRate: number;
  };
  onBack: () => void;
  onPaymentComplete: () => void;
}

export function PaymentPage({ orderData, onBack, onPaymentComplete }: PaymentPageProps) {
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing'>('method');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Card payment form
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Mobile money form
  const [mobileData, setMobileData] = useState({
    phoneNumber: '',
    provider: 'wave' as 'wave' | 'orange'
  });

  const handleCardPayment = async () => {
    setLoading(true);
    try {
      // TODO: Intégrer Stripe ici
      toast({
        title: "Paiement en cours",
        description: "Redirection vers Stripe...",
      });
      
      // Simulation pour l'instant
      setTimeout(() => {
        setPaymentStep('processing');
        setTimeout(() => {
          onPaymentComplete();
        }, 3000);
      }, 1000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter le paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMobilePayment = async () => {
    setLoading(true);
    try {
      // TODO: Intégrer API Wave/Orange Money
      toast({
        title: "Paiement en cours",
        description: `Redirection vers ${mobileData.provider === 'wave' ? 'Wave' : 'Orange Money'}...`,
      });
      
      // Simulation pour l'instant
      setTimeout(() => {
        setPaymentStep('processing');
        setTimeout(() => {
          onPaymentComplete();
        }, 3000);
      }, 1000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter le paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-terex-dark p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-terex-darker border-terex-gray">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-terex-accent mx-auto"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Traitement du paiement...
            </h3>
            <p className="text-gray-400">
              Veuillez patienter pendant que nous traitons votre paiement
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Paiement</h1>
            <p className="text-gray-400">Finalisez votre achat USDT</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Récapitulatif de commande */}
          <div className="lg:col-span-1">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant</span>
                  <span className="text-white font-semibold">
                    {orderData.amount} {orderData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USDT à recevoir</span>
                  <span className="text-terex-accent font-bold">
                    {orderData.usdtAmount} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Réseau</span>
                  <span className="text-white">{orderData.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taux</span>
                  <span className="text-white">
                    1 USDT = {orderData.exchangeRate} {orderData.currency}
                  </span>
                </div>
                <div className="border-t border-terex-gray pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-terex-accent font-bold">
                      {orderData.amount} {orderData.currency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Méthodes de paiement */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Choisir la méthode de paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {orderData.paymentMethod === 'card' ? (
                  // Paiement par carte
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 p-4 bg-terex-gray rounded-lg">
                      <CreditCard className="w-6 h-6 text-terex-accent" />
                      <div>
                        <h3 className="text-white font-semibold">Carte bancaire</h3>
                        <p className="text-gray-400 text-sm">Paiement sécurisé via Stripe</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">Sécurisé</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Nom du titulaire</Label>
                        <Input
                          value={cardData.cardholderName}
                          onChange={(e) => setCardData({...cardData, cardholderName: e.target.value})}
                          placeholder="Jean Dupont"
                          className="bg-terex-gray border-terex-gray-light text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Numéro de carte</Label>
                        <Input
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          className="bg-terex-gray border-terex-gray-light text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Date d'expiration</Label>
                        <Input
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData({...cardData, expiryDate: e.target.value})}
                          placeholder="MM/AA"
                          className="bg-terex-gray border-terex-gray-light text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">CVV</Label>
                        <Input
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                          placeholder="123"
                          className="bg-terex-gray border-terex-gray-light text-white"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleCardPayment}
                      disabled={loading}
                      className="w-full gradient-button text-white font-semibold h-12"
                    >
                      {loading ? 'Traitement...' : `Payer ${orderData.amount} ${orderData.currency}`}
                    </Button>
                  </div>
                ) : (
                  // Paiement Mobile Money
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Wave */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          mobileData.provider === 'wave' 
                            ? 'border-terex-accent bg-terex-accent/10' 
                            : 'border-terex-gray hover:border-terex-gray-light'
                        }`}
                        onClick={() => setMobileData({...mobileData, provider: 'wave'})}
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-8 h-8 text-blue-500" />
                          <div>
                            <h3 className="text-white font-semibold">Wave</h3>
                            <p className="text-gray-400 text-sm">Paiement instantané</p>
                          </div>
                          {mobileData.provider === 'wave' && (
                            <CheckCircle className="w-5 h-5 text-terex-accent ml-auto" />
                          )}
                        </div>
                      </div>

                      {/* Orange Money */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          mobileData.provider === 'orange' 
                            ? 'border-terex-accent bg-terex-accent/10' 
                            : 'border-terex-gray hover:border-terex-gray-light'
                        }`}
                        onClick={() => setMobileData({...mobileData, provider: 'orange'})}
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-8 h-8 text-orange-500" />
                          <div>
                            <h3 className="text-white font-semibold">Orange Money</h3>
                            <p className="text-gray-400 text-sm">Paiement sécurisé</p>
                          </div>
                          {mobileData.provider === 'orange' && (
                            <CheckCircle className="w-5 h-5 text-terex-accent ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Numéro de téléphone</Label>
                      <Input
                        value={mobileData.phoneNumber}
                        onChange={(e) => setMobileData({...mobileData, phoneNumber: e.target.value})}
                        placeholder="+221 77 123 45 67"
                        className="bg-terex-gray border-terex-gray-light text-white"
                      />
                    </div>

                    <div className="bg-terex-gray/50 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Instructions de paiement</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p>1. Cliquez sur "Procéder au paiement"</p>
                        <p>2. Vous serez redirigé vers {mobileData.provider === 'wave' ? 'Wave' : 'Orange Money'}</p>
                        <p>3. Suivez les instructions sur votre téléphone</p>
                        <p>4. Confirmez le paiement de {orderData.amount} {orderData.currency}</p>
                        <p>5. Vous recevrez vos USDT automatiquement</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleMobilePayment}
                      disabled={loading || !mobileData.phoneNumber}
                      className="w-full gradient-button text-white font-semibold h-12"
                    >
                      {loading ? 'Redirection...' : `Payer avec ${mobileData.provider === 'wave' ? 'Wave' : 'Orange Money'}`}
                    </Button>
                  </div>
                )}

                {/* Sécurité */}
                <div className="flex items-center justify-center space-x-6 pt-4 border-t border-terex-gray">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-400">Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-400">Traitement instantané</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
