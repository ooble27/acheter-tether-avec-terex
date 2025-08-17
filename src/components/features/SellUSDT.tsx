import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator from '@/components/ui/separator';
import { ArrowLeft, TrendingUp, DollarSign, Wallet, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SellOrderConfirmation } from '@/components/features/SellOrderConfirmation';
import { USDTSendingInstructions } from '@/components/features/USDTSendingInstructions';
import { USDTSentConfirmation } from '@/components/features/USDTSentConfirmation';
import { KYCProtection } from '@/components/features/KYCProtection';
import { BinancePayOption } from '@/components/features/sell-usdt/BinancePayOption';
import { useScrollToTop } from '@/components/ScrollToTop';

interface SellUSDTProps {
  // Define any props here
}

interface PaymentMethod {
  value: string;
  label: string;
}

export function SellUSDT() {
  const scrollToTop = useScrollToTop();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [accountDetails, setAccountDetails] = useState('');
  const [orderId, setOrderId] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [usdtNetwork, setUsdtNetwork] = useState('TRC20');
  const [binancePay, setBinancePay] = useState(false);
  const [binanceEmail, setBinanceEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  // Effet pour scroll to top à chaque changement d'étape
  useEffect(() => {
    scrollToTop();
  }, [currentStep, scrollToTop]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handlePaymentMethodChange = (method: PaymentMethod | null) => {
    setPaymentMethod(method);
  };

  const handleAccountDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountDetails(e.target.value);
  };

  const handleUSDTAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdtAddress(e.target.value);
  };

  const handleUSDTNetworkChange = (network: string) => {
    setUsdtNetwork(network);
  };

  const handleBinancePayChange = (checked: boolean) => {
    setBinancePay(checked);
    if (!checked) {
      setBinanceEmail(''); // Reset email if Binance Pay is disabled
    }
  };

  const handleBinanceEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBinanceEmail(e.target.value);
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!amount) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer un montant.",
          variant: "destructive",
        });
        return;
      }
      if (isNaN(Number(amount))) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer un montant valide.",
          variant: "destructive",
        });
        return;
      }
      if (Number(amount) < 10) {
        toast({
          title: "Erreur",
          description: "Le montant minimum est de 10 USDT.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!paymentMethod) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une méthode de paiement.",
          variant: "destructive",
        });
        return;
      }
      if (!accountDetails) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer vos informations de paiement.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!usdtAddress) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer votre adresse USDT.",
          variant: "destructive",
        });
        return;
      }
      if (binancePay && !binanceEmail) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer votre email Binance Pay.",
          variant: "destructive",
        });
        return;
      }
      if (!agreedToTerms) {
        toast({
          title: "Erreur",
          description: "Veuillez accepter les termes et conditions.",
          variant: "destructive",
        });
        return;
      }
      // Simulate order creation and get order ID
      const newOrderId = Math.random().toString(36).substring(2, 15).toUpperCase();
      setOrderId(newOrderId);
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  };

  const handleUSDTConfirmation = () => {
    setCurrentStep(5);
  };

  const handleBackToHome = () => {
    setCurrentStep(1);
    setAmount('');
    setPaymentMethod(null);
    setAccountDetails('');
    setOrderId('');
    setUsdtAddress('');
    setUsdtNetwork('TRC20');
    setBinancePay(false);
    setBinanceEmail('');
    setAgreedToTerms(false);
  };

  const paymentMethods: PaymentMethod[] = [
    { value: "mobile_money", label: "Mobile Money" },
    { value: "bank_transfer", label: "Virement Bancaire" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Montant de la vente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-400">
                  Montant en USDT
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Entrez le montant en USDT"
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400"
                />
              </div>
              <Button className="w-full gradient-button text-white font-medium" onClick={handleNext}>
                Continuer
              </Button>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-gray-400">
                  Sélectionnez votre méthode de paiement
                </Label>
                <Select onValueChange={(value) => handlePaymentMethodChange(paymentMethods.find(method => method.value === value) || null)}>
                  <SelectTrigger className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400">
                    <SelectValue placeholder="Sélectionnez une méthode" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray text-white">
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountDetails" className="text-gray-400">
                  Informations de paiement
                </Label>
                <Input
                  id="accountDetails"
                  type="text"
                  placeholder="Entrez vos informations de paiement"
                  value={accountDetails}
                  onChange={handleAccountDetailsChange}
                  className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="border-terex-gray text-gray-300 hover:bg-terex-gray" onClick={handleBack}>
                  Retour
                </Button>
                <Button className="gradient-button text-white font-medium" onClick={handleNext}>
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Détails de réception USDT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usdtAddress" className="text-gray-400">
                  Adresse de réception USDT
                </Label>
                <Input
                  id="usdtAddress"
                  type="text"
                  placeholder="Entrez votre adresse USDT"
                  value={usdtAddress}
                  onChange={handleUSDTAddressChange}
                  className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usdtNetwork" className="text-gray-400">
                  Réseau USDT
                </Label>
                <Select onValueChange={handleUSDTNetworkChange}>
                  <SelectTrigger className="bg-terex-dark border-terex-gray text-white placeholder:text-gray-400">
                    <SelectValue placeholder="Sélectionnez un réseau" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray text-white">
                    <SelectItem value="TRC20">TRC20</SelectItem>
                    <SelectItem value="BEP20">BEP20</SelectItem>
                    <SelectItem value="ERC20">ERC20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <BinancePayOption
                binancePay={binancePay}
                binanceEmail={binanceEmail}
                onBinancePayChange={handleBinancePayChange}
                onBinanceEmailChange={handleBinanceEmailChange}
              />
              <div className="flex items-center space-x-2">
                <Input id="terms" type="checkbox" checked={agreedToTerms} onChange={handleTermsChange} className="bg-terex-dark border-terex-gray text-white"/>
                <Label htmlFor="terms" className="text-gray-400 cursor-pointer">
                  J'accepte les <a href="/terms" className="text-terex-accent">termes et conditions</a>
                </Label>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="border-terex-gray text-gray-300 hover:bg-terex-gray" onClick={handleBack}>
                  Retour
                </Button>
                <Button className="gradient-button text-white font-medium" onClick={handleNext}>
                  Confirmer
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <SellOrderConfirmation
            amount={amount}
            paymentMethod={paymentMethod?.label || ''}
            accountDetails={accountDetails}
            usdtAddress={usdtAddress}
            usdtNetwork={usdtNetwork}
            binancePay={binancePay}
            binanceEmail={binanceEmail}
            orderId={orderId}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <USDTSendingInstructions
            amount={amount}
            paymentMethod={paymentMethod?.label || ''}
            accountDetails={accountDetails}
            usdtAddress={usdtAddress}
            usdtNetwork={usdtNetwork}
            binancePay={binancePay}
            binanceEmail={binanceEmail}
            orderId={orderId}
            onBackToHome={handleBackToHome}
          />
        );
      case 6:
        return (
          <USDTSentConfirmation
            amount={amount}
            paymentMethod={paymentMethod?.label || ''}
            accountDetails={accountDetails}
            usdtAddress={usdtAddress}
            usdtNetwork={usdtNetwork}
            binancePay={binancePay}
            binanceEmail={binanceEmail}
            orderId={orderId}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {currentStep !== 5 && currentStep !== 6 && (
        <Button variant="ghost" className="gap-2 w-fit p-0 text-white hover:bg-transparent" onClick={handleBackToHome}>
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Button>
      )}
      {renderStepContent()}
      {currentStep === 4 && (
        <Button className="w-full gradient-button text-white font-medium" onClick={handleUSDTConfirmation}>
          J'ai envoyé les USDT
        </Button>
      )}
    </div>
  );
}
