
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';

interface PaymentPendingProps {
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
  onBackToHome: () => void;
}

export function PaymentPending({ orderData, orderId, onBackToHome }: PaymentPendingProps) {
  const [step, setStep] = useState(1);
  const [dots, setDots] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Animation des points de chargement
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Simulation de progression (en réalité, ça viendrait du backend)
    const stepInterval = setInterval(() => {
      setStep(prev => prev < 3 ? prev + 1 : prev);
    }, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: "Vérification du paiement",
      description: "Nous vérifions votre paiement auprès de notre partenaire",
      icon: <RefreshCw className="w-5 h-5" />,
      status: step >= 1 ? 'current' : 'pending'
    },
    {
      id: 2,
      title: "Confirmation reçue",
      description: "Votre paiement a été confirmé avec succès",
      icon: <CheckCircle className="w-5 h-5" />,
      status: step >= 2 ? 'completed' : step === 1 ? 'current' : 'pending'
    },
    {
      id: 3,
      title: "Transfert USDT en cours",
      description: "Vos USDT sont en cours d'envoi vers votre adresse",
      icon: <Clock className="w-5 h-5" />,
      status: step >= 3 ? 'current' : 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark px-0 py-2 md:p-4">
      <div className="max-w-4xl mx-auto px-0">
        <div className="mb-6 px-3 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Traitement en cours{dots}
          </h1>
          <p className="text-gray-400">
            Votre achat est en cours de traitement. Veuillez patienter quelques instants.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 px-0">
          {/* Statut du traitement */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray mb-6 mx-0">
              <CardHeader>
                <CardTitle className="text-white">Statut de votre commande</CardTitle>
                <p className="text-gray-400">Commande #{orderId.slice(-8).toUpperCase()}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {steps.map((stepItem, index) => (
                  <div key={stepItem.id} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      stepItem.status === 'completed' ? 'bg-green-500' : 
                      stepItem.status === 'current' ? 'bg-terex-accent animate-pulse' : 
                      'bg-gray-700'
                    }`}>
                      {stepItem.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-medium ${
                        stepItem.status === 'completed' ? 'text-green-500' : 
                        stepItem.status === 'current' ? 'text-terex-accent' : 
                        'text-gray-400'
                      }`}>
                        {stepItem.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{stepItem.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="h-12 border-l border-gray-700 absolute ml-5 mt-10"></div>
                    )}
                  </div>
                ))}
                
                <div className="bg-terex-gray/40 p-4 rounded-lg mt-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <p className="text-gray-300 text-sm">
                      {step >= 2 
                        ? "Vos USDT seront envoyés à votre adresse dans les prochaines minutes. Vous recevrez un e-mail de confirmation une fois la transaction finalisée."
                        : "Votre paiement est en cours de vérification. Cette étape peut prendre quelques minutes."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="px-3 md:px-0">
              <Button
                variant="outline"
                onClick={onBackToHome}
                className="text-white border-terex-gray hover:bg-terex-gray"
              >
                Retourner à l'accueil
              </Button>
            </div>
          </div>

          {/* Récapitulatif de commande */}
          <div>
            <Card className="bg-terex-darker border-terex-gray mx-0">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant payé</span>
                  <span className="text-white font-medium">
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
                  <span className="text-gray-400">Adresse de réception</span>
                  <span className="text-white text-xs font-mono">
                    {`${orderData.walletAddress.substring(0, 6)}...${orderData.walletAddress.substring(orderData.walletAddress.length - 4)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Réseau</span>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    {orderData.network}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Méthode</span>
                  <span className="text-white">
                    {orderData.paymentMethod === 'card' ? 'Carte bancaire' : 'Mobile Money'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-terex-gray pt-3 mt-3">
                  <span className="text-white">Statut</span>
                  <Badge variant="outline" className={`${
                    step >= 3 ? 'bg-green-500/10 text-green-500 border-green-500/30' : 
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                  }`}>
                    {step >= 3 ? 'Transfert en cours' : 'Paiement confirmé'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
