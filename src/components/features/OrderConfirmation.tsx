
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Clock, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OrderData {
  amount: string;
  currency: string;
  usdtAmount: string;
  network: string;
  walletAddress: string;
  paymentMethod: string;
  exchangeRate: number;
  phoneNumber?: string;
  provider?: string;
}

interface OrderConfirmationProps {
  orderData: OrderData;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
}

export function OrderConfirmation({ orderData, onConfirm, onBack, loading }: OrderConfirmationProps) {
  const { isAuthorized, loading: kycLoading, kycStatus } = useTransactionAuthorization();
  const [showKYCAlert, setShowKYCAlert] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleConfirmClick = () => {
    if (!isAuthorized) {
      setShowKYCAlert(true);
      return;
    }
    onConfirm();
  };

  const getPaymentMethodName = () => {
    switch (orderData.paymentMethod) {
      case 'card': return 'Interac';
      case 'mobile': return 'Mobile Money';
      default: return orderData.paymentMethod;
    }
  };

  const getProviderName = () => {
    return orderData.provider === 'wave' ? 'Wave' : 'Orange Money';
  };

  return (
    <div className="min-h-screen bg-terex-dark px-0 py-2 md:p-4">
      <div className="w-full max-w-4xl mx-auto px-0 md:px-0">
        <div className="mb-6 px-3 md:px-0">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-light text-white mb-2">Confirmation d'achat</h1>
          <p className="text-gray-400 text-sm md:text-base">Vérifiez les détails de votre achat avant de confirmer</p>
        </div>

        {showKYCAlert && !isAuthorized && (
          <Alert variant="destructive" className="border-l-4 border-l-red-500 mb-6 mx-3 md:mx-0">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">Vérification d'identité requise</AlertTitle>
            <AlertDescription className="mt-2">
              {kycStatus === 'pending' && 
                'Vous devez vérifier votre identité avant d\'effectuer des transactions. Veuillez compléter le processus KYC dans votre profil.'
              }
              {kycStatus === 'submitted' && 
                'Vos documents sont en cours d\'examen. Vous pourrez effectuer des transactions une fois la vérification approuvée.'
              }
              {kycStatus === 'rejected' && 
                'Votre vérification d\'identité a été rejetée. Veuillez soumettre de nouveaux documents conformes dans votre profil.'
              }
              {!kycStatus && 
                'Une vérification d\'identité est requise pour effectuer cette transaction.'
              }
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-terex-darker border-terex-gray w-full mx-0">
          <CardHeader className="pb-4 p-3 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <ShoppingCart className="w-5 h-5 mr-2 text-terex-accent" />
              Récapitulatif de votre achat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-3 md:p-6">
            {/* Montants */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Vous payez</span>
                <div className="text-white font-bold text-lg">
                  {orderData.amount} {orderData.currency}
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Vous recevez</span>
                <div className="flex items-center space-x-2">
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                    alt="USDT" 
                    className="w-5 h-5"
                  />
                  <span className="text-terex-accent font-bold text-lg">
                    {orderData.usdtAmount} USDT
                  </span>
                </div>
              </div>
              
              <Separator className="bg-terex-gray" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Taux de change</span>
                <span className="text-white">1 USDT = {orderData.exchangeRate} {orderData.currency}</span>
              </div>
            </div>

            {/* Détails de réception */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Détails de réception USDT</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Adresse de réception</span>
                  <span className="text-white font-medium break-all text-sm">{orderData.walletAddress}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Réseau</span>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent w-fit">
                    {orderData.network}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Méthode de paiement</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Paiement via</span>
                  <span className="text-white font-medium">{getPaymentMethodName()}</span>
                </div>
                {orderData.paymentMethod === 'mobile' && orderData.phoneNumber && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-gray-400 text-sm">Service</span>
                    <span className="text-white font-medium">{getProviderName()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-full">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-blue-200 font-medium">Traitement de l'achat</p>
                  <p className="text-blue-100 text-sm">
                    Après confirmation du paiement, vos USDT seront envoyés automatiquement 
                    à votre adresse dans les 30 minutes. Vous recevrez un email de confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <Button
              onClick={handleConfirmClick}
              disabled={loading || kycLoading}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12 text-lg"
            >
              {loading ? 'Création en cours...' : kycLoading ? 'Vérification...' : 'Confirmer l\'achat'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
