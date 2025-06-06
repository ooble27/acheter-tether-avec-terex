
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, CheckCircle, Clock, AlertCircle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentInstructionsProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    paymentMethod: 'card' | 'mobile';
    exchangeRate: number;
  };
  orderId: string;
  onBack: () => void;
  onPaymentConfirmed: () => void;
}

export function PaymentInstructions({ orderData, orderId, onBack, onPaymentConfirmed }: PaymentInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes en secondes
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copié !",
      description: "Le numéro a été copié dans le presse-papiers",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getPaymentInstructions = () => {
    if (orderData.paymentMethod === 'mobile') {
      return {
        title: "Instructions de paiement Mobile Money",
        steps: [
          "Ouvrez votre application Wave ou Orange Money",
          "Sélectionnez 'Envoyer de l'argent'",
          `Entrez le numéro : +221 77 123 45 67`,
          `Montant : ${orderData.amount} ${orderData.currency}`,
          `Référence : ${orderId.slice(-8).toUpperCase()}`,
          "Confirmez le transfert",
          "Cliquez sur 'J'ai payé' ci-dessous"
        ],
        recipientNumber: "+221 77 123 45 67"
      };
    } else {
      return {
        title: "Instructions de paiement par carte",
        steps: [
          "Vous allez être redirigé vers notre partenaire de paiement sécurisé",
          "Entrez vos informations de carte bancaire",
          "Confirmez le paiement sécurisé",
          "Vous serez redirigé automatiquement après paiement"
        ],
        recipientNumber: null
      };
    }
  };

  const instructions = getPaymentInstructions();

  if (orderData.paymentMethod === 'card') {
    return (
      <div className="min-h-screen bg-terex-dark p-2 md:p-4">
        <div className="max-w-2xl mx-auto">
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
              <h1 className="text-2xl md:text-3xl font-bold text-white">Paiement sécurisé</h1>
              <p className="text-gray-400">Finalisez votre achat</p>
            </div>
          </div>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-terex-accent/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Redirection vers le paiement sécurisé
              </h3>
              <p className="text-gray-400">
                Vous allez être redirigé vers notre partenaire de paiement pour finaliser votre achat de manière sécurisée.
              </p>
              <Button
                onClick={onPaymentConfirmed}
                className="gradient-button text-white font-semibold px-8 py-3"
              >
                Procéder au paiement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Effectuer le paiement</h1>
            <p className="text-gray-400">Suivez les instructions pour compléter votre achat</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Instructions de paiement */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">{instructions.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-500 font-medium">
                    Temps restant : {formatTime(timeLeft)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-300">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {instructions.recipientNumber && (
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-terex-accent" />
                    Numéro de réception
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between bg-terex-gray rounded-lg p-4">
                    <span className="text-white font-mono text-lg">{instructions.recipientNumber}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(instructions.recipientNumber!)}
                      className="border-terex-gray text-white hover:bg-terex-gray"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-amber-200 font-medium">Important</p>
                    <ul className="text-amber-100 text-sm space-y-1">
                      <li>• Utilisez exactement le montant indiqué</li>
                      <li>• N'oubliez pas d'inclure la référence de commande</li>
                      <li>• Le paiement doit être effectué dans les 30 minutes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={onPaymentConfirmed}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12"
            >
              J'ai effectué le paiement
            </Button>
          </div>

          {/* Récapitulatif de la commande */}
          <div className="space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commande</span>
                    <span className="text-white font-mono">#{orderId.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Montant à payer</span>
                    <span className="text-white font-bold">
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
                    <Badge variant="outline" className="text-terex-accent border-terex-accent">
                      {orderData.network}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-green-200 font-medium text-sm">Traitement automatique</p>
                    <p className="text-green-100 text-xs">
                      Vos USDT seront envoyés automatiquement après confirmation du paiement
                    </p>
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
