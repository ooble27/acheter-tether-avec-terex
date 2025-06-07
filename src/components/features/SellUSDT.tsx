
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, TrendingDown, AlertCircle, ArrowLeft, DollarSign, Shield, Clock, CheckCircle } from 'lucide-react';
import { SellOrderConfirmation } from './SellOrderConfirmation';
import { USDTSendingInstructions } from './USDTSendingInstructions';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { KYCProtection } from './KYCProtection';

export function SellUSDT() {
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation' | 'instructions'>('form');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'wave' | 'orange_money' | 'bank_transfer'>('mobile');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [showKYC, setShowKYC] = useState(false);
  
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const exchangeRate = 656; // 1 USDT = 656 CFA

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
              Vous devez vérifier votre identité pour effectuer des ventes d'USDT. 
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Vendre USDT</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Convertissez vos USDT en CFA rapidement et en toute sécurité
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                  <Card className="bg-terex-darker/50 border-terex-gray backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-white text-2xl flex items-center">
                        <DollarSign className="w-6 h-6 mr-3 text-orange-500" />
                        Détails de la vente
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-lg">
                        Remplissez le formulaire pour vendre vos USDT
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="amount" className="text-gray-300 text-base font-medium">
                          Montant USDT à vendre
                        </Label>
                        <Input
                          id="amount"
                          placeholder="Entrez le montant en USDT"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-terex-gray border-terex-gray text-white h-12 text-lg"
                          type="number"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="paymentMethod" className="text-gray-300 text-base font-medium">
                          Méthode de réception
                        </Label>
                        <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                          <SelectTrigger className="bg-terex-gray border-terex-gray text-white h-12">
                            <SelectValue placeholder="Sélectionnez une méthode" />
                          </SelectTrigger>
                          <SelectContent className="bg-terex-darker border-terex-gray">
                            <SelectItem value="mobile" className="text-white hover:bg-terex-gray">Mobile Money</SelectItem>
                            <SelectItem value="wave" className="text-white hover:bg-terex-gray">Wave</SelectItem>
                            <SelectItem value="orange_money" className="text-white hover:bg-terex-gray">Orange Money</SelectItem>
                            <SelectItem value="bank_transfer" className="text-white hover:bg-terex-gray">Virement bancaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="recipientNumber" className="text-gray-300 text-base font-medium">
                          {paymentMethod === 'bank_transfer' ? 'Numéro de compte bancaire' : 'Numéro de téléphone'}
                        </Label>
                        <Input
                          id="recipientNumber"
                          placeholder={paymentMethod === 'bank_transfer' ? 'Votre numéro de compte' : 'Votre numéro de téléphone'}
                          value={recipientNumber}
                          onChange={(e) => setRecipientNumber(e.target.value)}
                          className="bg-terex-gray border-terex-gray text-white h-12"
                        />
                      </div>

                      <Button
                        onClick={() => {
                          if (!amount || !recipientNumber) {
                            toast({
                              title: "Erreur",
                              description: "Veuillez remplir tous les champs.",
                              variant: "destructive",
                            });
                            return;
                          }

                          const newOrderData = {
                            amount: parseFloat(amount),
                            paymentMethod: paymentMethod,
                            recipientNumber: recipientNumber,
                            fiatAmount: parseFloat(amount) * exchangeRate,
                          };

                          setOrderData(newOrderData);
                          setCurrentStep('confirmation');
                        }}
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-500/90 hover:to-red-500/90 text-white"
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
                  <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Estimation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className="text-gray-300 text-sm mb-2">Vous recevrez environ</p>
                        <p className="text-3xl font-bold text-orange-500">
                          {(parseFloat(amount) * exchangeRate || 0).toFixed(0)} CFA
                        </p>
                      </div>
                      <div className="text-center text-sm text-gray-400">
                        Taux: 1 USDT = {exchangeRate} CFA
                      </div>
                    </CardContent>
                  </Card>

                  {/* Process Steps */}
                  <Card className="bg-terex-darker/50 border-terex-gray">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Processus de vente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <span className="text-gray-300">Confirmation des détails</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <span className="text-gray-300">Envoi des USDT</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">3</span>
                        </div>
                        <span className="text-gray-300">Réception des fonds</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Info */}
                  <Card className="bg-terex-darker/50 border-terex-gray">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Sécurité garantie</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-gray-300">Transactions sécurisées</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-300">Support 24/7</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-terex-accent" />
                        <span className="text-gray-300">Traitement rapide</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'confirmation' && orderData && (
            <SellOrderConfirmation
              orderData={orderData}
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
                    type: 'sell',
                    amount: orderData.amount,
                    currency: 'USDT',
                    usdt_amount: orderData.amount,
                    exchange_rate: exchangeRate,
                    payment_method: orderData.paymentMethod,
                    wallet_address: orderData.recipientNumber,
                    network: 'Mobile Money',
                    status: 'pending',
                    payment_status: 'pending'
                  });

                  if (order) {
                    setCurrentStep('instructions');
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
          
          {currentStep === 'instructions' && orderData && (
            <USDTSendingInstructions
              orderData={orderData}
              onBack={() => setCurrentStep('confirmation')}
              onUSDTSent={() => {
                toast({
                  title: "Commande créée",
                  description: "Votre ordre de vente a été enregistré.",
                });
                setCurrentStep('form');
                setAmount('');
                setRecipientNumber('');
              }}
            />
          )}
        </div>
      </div>
    </KYCProtection>
  );
}
