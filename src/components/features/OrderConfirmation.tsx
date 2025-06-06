
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface OrderConfirmationProps {
  orderData: {
    amount: string | number;
    currency: string;
    usdtAmount: string | number;
    network: string;
    walletAddress: string;
    paymentMethod: 'card' | 'mobile';
    exchangeRate: number;
    phoneNumber?: string;
    provider?: string;
    bankData?: {
      accountNumber: string;
      bankName: string;
      accountHolder: string;
    };
    mobileData?: {
      phoneNumber: string;
      provider: string;
    };
  };
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
  transactionType?: 'buy' | 'sell';
}

export function OrderConfirmation({ 
  orderData, 
  onConfirm, 
  onBack, 
  loading,
  transactionType = 'buy'
}: OrderConfirmationProps) {
  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    return parseFloat(num.toFixed(2)).toString();
  };

  const isSell = transactionType === 'sell';

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-terex-gray"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour
          </Button>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="text-center border-b border-terex-gray">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-terex-accent rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-white text-xl">
              Récapitulatif de la commande
            </CardTitle>
            <p className="text-gray-400">
              Vérifiez les détails avant de confirmer
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Transaction Summary */}
            <div className="bg-terex-gray rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Résumé de la transaction</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {isSell ? 'Vous donnez' : 'Vous payez'}
                  </span>
                  <span className="text-white font-medium">
                    {isSell ? `${formatAmount(orderData.usdtAmount)} USDT` : `${formatAmount(orderData.amount)} ${orderData.currency}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {isSell ? 'Vous recevez' : 'Vous recevez'}
                  </span>
                  <span className="text-terex-accent font-bold text-lg">
                    {isSell ? `${formatAmount(orderData.amount)} ${orderData.currency}` : `${formatAmount(orderData.usdtAmount)} USDT`}
                  </span>
                </div>
                <Separator className="bg-terex-gray-light" />
                <div className="flex justify-between">
                  <span className="text-gray-400">Taux de change</span>
                  <span className="text-white">1 USDT = {orderData.exchangeRate} {orderData.currency}</span>
                </div>
                {isSell && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Réseau</span>
                    <span className="text-white">{orderData.network}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Details for Sell */}
            {isSell && (
              <div className="bg-terex-gray rounded-lg p-4">
                <h3 className="text-white font-medium mb-4">Détails de livraison</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Numéro client</span>
                    <span className="text-white">{orderData.mobileData?.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Opérateur</span>
                    <span className="text-white">
                      {orderData.mobileData?.provider === 'wave' ? 'Wave' : 'Orange Money'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method for Buy */}
            {!isSell && orderData.paymentMethod === 'mobile' && (
              <div className="bg-terex-gray rounded-lg p-4">
                <h3 className="text-white font-medium mb-4">Méthode de paiement</h3>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-terex-accent" />
                  <span className="text-white">Mobile Money</span>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    Instantané
                  </Badge>
                </div>
              </div>
            )}

            {/* Processing Time */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Traitement de la commande
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Votre commande sera traitée sous 30 minutes maximum. Vous recevrez un email de confirmation.
                    {isSell 
                      ? " L'argent sera transféré dans votre compte une fois le paiement validé." 
                      : " Vos USDT seront envoyés à votre adresse une fois le paiement validé."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="w-full gradient-button text-white font-semibold h-12 text-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Traitement...</span>
                </div>
              ) : (
                isSell ? 'Vendre mes USDT' : 'Confirmer la commande'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
