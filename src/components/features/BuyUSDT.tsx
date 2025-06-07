
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, CircleDollarSign, AlertCircle, ArrowLeft, TrendingUp, Shield, Clock } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';
import { PaymentPage } from './PaymentPage';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { KYCProtection } from './KYCProtection';

export function BuyUSDT() {
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation' | 'payment'>('form');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'wave' | 'orange_money' | 'card' | 'bank' | 'bank_transfer' | 'interac'>('mobile');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [orderData, setOrderData] = useState<any>(null);
  const [showKYC, setShowKYC] = useState(false);
  
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const exchangeRate = 656; // 1 USDT = 656 CFA

  const calculateUSDT = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return 0;
    return parsedAmount / exchangeRate;
  };

  const usdtAmount = calculateUSDT();

  const handleCreateOrder = async () => {
    if (!amount || !currency || !paymentMethod || !walletAddress || !network) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    const newOrderData = {
      amount: parseFloat(amount),
      currency: currency,
      paymentMethod: paymentMethod,
      walletAddress: walletAddress,
      network: network,
      usdtAmount: usdtAmount,
    };

    setOrderData(newOrderData);
    setCurrentStep('confirmation');
  };

  const handleKYCRequired = () => {
    setShowKYC(true);
  };

  if (showKYC) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setShowKYC(false)}
              className="border-terex-gray text-gray-300 hover:bg-terex-gray"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Vérification requise</h1>
              <p className="text-gray-400">Veuillez compléter votre vérification d'identité</p>
            </div>
          </div>
          <Alert className="border-terex-gray bg-terex-darker">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-gray-300">
              Vous devez vérifier votre identité pour effectuer des achats d'USDT. 
              Rendez-vous dans votre profil pour commencer la vérification.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-black p-4">
        <div className="max-w-6xl mx-auto">
          {currentStep === 'form' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-terex-accent to-green-500 rounded-full mb-4">
                  <CircleDollarSign className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Acheter USDT</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Achetez des USDT en toute sécurité avec les meilleures conditions du marché
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                  <Card className="bg-terex-darker/50 border-terex-gray backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-white text-2xl flex items-center">
                        <TrendingUp className="w-6 h-6 mr-3 text-terex-accent" />
                        Détails de l'achat
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-lg">
                        Remplissez le formulaire pour effectuer votre achat
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="amount" className="text-gray-300 text-base font-medium">
                            Montant à payer
                          </Label>
                          <Input
                            id="amount"
                            placeholder="Entrez le montant"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-terex-gray border-terex-gray text-white h-12 text-lg"
                            type="number"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="currency" className="text-gray-300 text-base font-medium">Devise</Label>
                          <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12">
                              <SelectValue placeholder="Sélectionnez une devise" />
                            </SelectTrigger>
                            <SelectContent className="bg-terex-darker border-terex-gray">
                              <SelectItem value="CFA" className="text-white hover:bg-terex-gray">CFA (Franc CFA)</SelectItem>
                              <SelectItem value="USD" className="text-white hover:bg-terex-gray">USD (Dollar US)</SelectItem>
                              <SelectItem value="EUR" className="text-white hover:bg-terex-gray">EUR (Euro)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="paymentMethod" className="text-gray-300 text-base font-medium">
                          Méthode de paiement
                        </Label>
                        <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                          <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12">
                            <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                          </SelectTrigger>
                          <SelectContent className="bg-terex-darker border-terex-gray">
                            <SelectItem value="mobile" className="text-white hover:bg-terex-gray">Mobile Money</SelectItem>
                            <SelectItem value="wave" className="text-white hover:bg-terex-gray">Wave</SelectItem>
                            <SelectItem value="orange_money" className="text-white hover:bg-terex-gray">Orange Money</SelectItem>
                            <SelectItem value="card" className="text-white hover:bg-terex-gray">Carte bancaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="walletAddress" className="text-gray-300 text-base font-medium">
                            Adresse de réception USDT
                          </Label>
                          <Input
                            id="walletAddress"
                            placeholder="Votre adresse USDT TRC20"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            className="bg-terex-gray border-terex-gray text-white h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="network" className="text-gray-300 text-base font-medium">Réseau</Label>
                          <Select value={network} onValueChange={setNetwork}>
                            <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12">
                              <SelectValue placeholder="Sélectionnez un réseau" />
                            </SelectTrigger>
                            <SelectContent className="bg-terex-darker border-terex-gray">
                              <SelectItem value="TRC20" className="text-white hover:bg-terex-gray">TRC20 (Tron)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        onClick={handleCreateOrder}
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-terex-accent to-green-500 hover:from-terex-accent/90 hover:to-green-500/90 text-white"
                      >
                        Continuer vers la confirmation
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Price Calculator */}
                  <Card className="bg-gradient-to-br from-terex-accent/10 to-green-500/10 border-terex-accent/30">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Calculateur</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className="text-gray-300 text-sm mb-2">Vous recevrez</p>
                        <p className="text-3xl font-bold text-terex-accent">
                          {usdtAmount.toFixed(6)} USDT
                        </p>
                      </div>
                      <div className="text-center text-sm text-gray-400">
                        Taux: 1 USDT = {exchangeRate} CFA
                      </div>
                    </CardContent>
                  </Card>

                  {/* Features */}
                  <Card className="bg-terex-darker/50 border-terex-gray">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Pourquoi nous choisir ?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-gray-300">Sécurisé & réglementé</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-300">Traitement rapide</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-terex-accent" />
                        <span className="text-gray-300">Meilleurs taux</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'confirmation' && orderData && (
            <OrderConfirmation
              orderData={{
                amount: orderData.amount,
                currency: orderData.currency,
                paymentMethod: orderData.paymentMethod,
                walletAddress: orderData.walletAddress,
                network: orderData.network,
                usdtAmount: usdtAmount.toFixed(2),
                exchangeRate: exchangeRate,
              }}
              onConfirm={async () => {
                if (!user) {
                  toast({
                    title: "Erreur",
                    description: "Utilisateur non connecté.",
                    variant: "destructive",
                  });
                  return;
                }

                try {
                  const order = await createOrder({
                    user_id: user.id,
                    type: 'buy',
                    amount: parseFloat(amount),
                    currency: currency,
                    usdt_amount: usdtAmount,
                    exchange_rate: exchangeRate,
                    payment_method: paymentMethod,
                    wallet_address: walletAddress,
                    network: network,
                    status: 'pending',
                    payment_status: 'pending'
                  });

                  if (order) {
                    setCurrentStep('payment');
                  } else {
                    toast({
                      title: "Erreur",
                      description: "Impossible de créer la commande.",
                      variant: "destructive",
                    });
                  }
                } catch (error) {
                  toast({
                    title: "Erreur",
                    description: "Une erreur s'est produite lors de la création de la commande.",
                    variant: "destructive",
                  });
                }
              }}
              onBack={() => setCurrentStep('form')}
            />
          )}
          
          {currentStep === 'payment' && orderData && (
            <PaymentPage
              orderData={{
                amount: orderData.amount,
                currency: orderData.currency,
                paymentMethod: orderData.paymentMethod,
                walletAddress: orderData.walletAddress,
                network: orderData.network,
                usdtAmount: usdtAmount.toFixed(2),
                exchangeRate: exchangeRate,
              }}
              onBack={() => setCurrentStep('confirmation')}
              onPaymentComplete={() => {
                toast({
                  title: "Paiement confirmé",
                  description: "Votre commande a été traitée avec succès.",
                });
                setCurrentStep('form');
                setAmount('');
                setWalletAddress('');
              }}
            />
          )}
        </div>
      </div>
    </KYCProtection>
  );
}
