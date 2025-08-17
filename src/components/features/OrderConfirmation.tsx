import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shield, Clock, AlertTriangle } from 'lucide-react';
import { useScrollToTop } from '@/components/ScrollToTop';

interface OrderConfirmationProps {
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
  onConfirm: () => void;
}

export function OrderConfirmation({ orderData, onBack, onConfirm }: OrderConfirmationProps) {
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  return (
    <div className="min-h-screen bg-terex-dark px-0 py-2 md:p-4">
      <div className="max-w-3xl mx-auto px-0">
        <div className="mb-6 px-3 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Confirmation de la commande
          </h1>
          <p className="text-gray-400">
            Vérifiez les détails de votre commande avant de confirmer.
          </p>
        </div>

        <Card className="bg-terex-darker border-terex-gray mx-0">
          <CardHeader>
            <CardTitle className="text-white">Détails de la commande</CardTitle>
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
              <span className="text-gray-400">Méthode de paiement</span>
              <span className="text-white">
                {orderData.paymentMethod === 'card' ? 'Carte bancaire' : 'Mobile Money'}
              </span>
            </div>
            <Separator className="bg-terex-gray" />
            <div className="flex justify-between">
              <span className="text-white">Total</span>
              <span className="text-terex-accent font-bold text-lg">
                {orderData.amount} {orderData.currency}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 px-3 md:px-0">
          <div className="bg-terex-gray/40 p-4 rounded-lg mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <p className="text-gray-300 text-sm">
                En confirmant, vous acceptez nos <a href="/terms-of-service" className="text-terex-accent hover:underline">Conditions d'utilisation</a> et reconnaissez avoir lu notre <a href="/security-policy" className="text-terex-accent hover:underline">Politique de sécurité</a>.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full text-white border-terex-gray hover:bg-terex-gray"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button
              onClick={onConfirm}
              className="w-full gradient-button text-white font-medium"
            >
              Confirmer l'achat
              <Shield className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
