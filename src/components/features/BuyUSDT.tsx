import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, CircleDollarSign, AlertCircle, ArrowLeft } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [orderData, setOrderData] = useState<any>(null);
  const [showKYC, setShowKYC] = useState(false);
  
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const exchangeRate = 656; // 1 USDT = 656 CFA

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  const handleNetworkChange = (value: string) => {
    setNetwork(value);
  };

  const calculateUSDT = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return 0;
    }
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
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
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
    );
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      {currentStep === 'form' && (
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Acheter USDT</CardTitle>
            <CardDescription className="text-gray-400">
              Remplissez le formulaire pour acheter des USDT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-300">Montant</Label>
              <Input
                id="amount"
                placeholder="Entrez le montant"
                value={amount}
                onChange={handleAmountChange}
                className="bg-terex-gray border-terex-gray text-white"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-gray-300">Devise</Label>
              <Select value={currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                  <SelectValue placeholder="Sélectionnez une devise" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="CFA" className="text-white hover:bg-terex-gray">CFA</SelectItem>
                  <SelectItem value="USD" className="text-white hover:bg-terex-gray">USD</SelectItem>
                  <SelectItem value="EUR" className="text-white hover:bg-terex-gray">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-gray-300">Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
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
            <div className="space-y-2">
              <Label htmlFor="walletAddress" className="text-gray-300">Adresse du portefeuille USDT (TRC20)</Label>
              <Input
                id="walletAddress"
                placeholder="Adresse de réception USDT"
                value={walletAddress}
                onChange={handleWalletAddressChange}
                className="bg-terex-gray border-terex-gray text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network" className="text-gray-300">Réseau</Label>
              <Select value={network} onValueChange={handleNetworkChange}>
                <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                  <SelectValue placeholder="Sélectionnez un réseau" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="TRC20" className="text-white hover:bg-terex-gray">TRC20</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-gray-300">
                Vous recevrez environ :
                <span className="font-medium text-terex-accent ml-1">
                  {usdtAmount.toFixed(2)} USDT
                </span>
              </p>
            </div>
            <Button
              onClick={handleCreateOrder}
              className="bg-terex-accent hover:bg-terex-accent/80 w-full"
            >
              Continuer vers la confirmation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
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
        />
      )}
    </KYCProtection>
  );
}
