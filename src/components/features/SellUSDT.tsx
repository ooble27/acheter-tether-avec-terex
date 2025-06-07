import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, CircleDollarSign, AlertCircle, ArrowLeft } from 'lucide-react';
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
            Vous devez vérifier votre identité pour effectuer des ventes d'USDT. 
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
            <CardTitle className="text-white">Vendre USDT</CardTitle>
            <CardDescription className="text-gray-400">
              Remplissez le formulaire pour vendre vos USDT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-300">Montant USDT à vendre</Label>
              <Input
                id="amount"
                placeholder="Entrez le montant en USDT"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-terex-gray border-terex-gray text-white"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-gray-300">Méthode de réception</Label>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
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
            <div className="space-y-2">
              <Label htmlFor="recipientNumber" className="text-gray-300">
                {paymentMethod === 'bank_transfer' ? 'Numéro de compte bancaire' : 'Numéro de téléphone'}
              </Label>
              <Input
                id="recipientNumber"
                placeholder={paymentMethod === 'bank_transfer' ? 'Votre numéro de compte' : 'Votre numéro de téléphone'}
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                className="bg-terex-gray border-terex-gray text-white"
              />
            </div>
            <div>
              <p className="text-gray-300">
                Vous recevrez environ :
                <span className="font-medium text-terex-accent ml-1">
                  {(parseFloat(amount) * exchangeRate || 0).toFixed(0)} CFA
                </span>
              </p>
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
              className="bg-terex-accent hover:bg-terex-accent/80 w-full"
            >
              Continuer vers la confirmation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
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
    </KYCProtection>
  );
}
