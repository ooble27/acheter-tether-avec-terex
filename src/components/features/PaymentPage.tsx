
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Smartphone, ExternalLink, Clock, Shield, CheckCircle } from 'lucide-react';
import { PaymentInstructions } from '@/components/features/PaymentInstructions';
import { useScrollToTop } from '@/components/ScrollToTop';

interface PaymentPageProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    paymentMethod: 'card' | 'mobile';
    exchangeRate: number;
    paymentLink: string;
  };
  orderId: string;
  onBack: () => void;
  onPaymentSuccess: (txHash?: string) => void;
  onPaymentError: () => void;
}

export function PaymentPage({ orderData, orderId, onBack, onPaymentSuccess, onPaymentError }: PaymentPageProps) {
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  const handlePaymentSuccess = (txHash?: string) => {
    onPaymentSuccess(txHash);
  };

  const handlePaymentError = () => {
    onPaymentError();
  };

  return (
    <div className="min-h-screen bg-terex-dark px-0 py-2 md:p-4">
      <div className="max-w-4xl mx-auto px-0">
        <div className="mb-6 px-3 md:px-0">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-terex-gray mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Effectuer le paiement
          </h1>
          <p className="text-gray-400">
            Veuillez suivre les instructions ci-dessous pour finaliser votre achat.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 px-0">
          {/* Instructions de paiement */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray mb-6 mx-0">
              <CardHeader>
                <CardTitle className="text-white">Instructions de paiement</CardTitle>
                <p className="text-gray-400">Commande #{orderId.slice(-8).toUpperCase()}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <PaymentInstructions
                  orderData={orderData}
                />
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif de commande */}
          <div>
            <Card className="bg-terex-darker border-terex-gray mx-0">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant à payer</span>
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
                <Separator className="bg-terex-gray" />
                <div className="flex items-center justify-between">
                  <span className="text-white">Statut</span>
                  <Badge variant="secondary" className="gap-2">
                    En attente de paiement
                    <Clock className="w-4 h-4" />
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
