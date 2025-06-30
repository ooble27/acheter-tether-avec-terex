import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

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
  useBinancePay?: boolean;
}

interface SellOrderConfirmationProps {
  orderData: OrderData;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
}

export function SellOrderConfirmation({ orderData, onConfirm, onBack, loading }: SellOrderConfirmationProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getPaymentMethodName = () => {
    switch (orderData.paymentMethod) {
      case 'bank': return 'Virement bancaire';
      case 'mobile': return 'Mobile Money';
      default: return orderData.paymentMethod;
    }
  };

  const getProviderName = () => {
    return orderData.provider === 'wave' ? 'Wave' : 
           orderData.provider === 'orange' ? 'Orange Money' : 
           orderData.provider === 'bank' ? 'Banque' : 'N/A';
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="w-full max-w-4xl mx-auto px-2 md:px-0">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Confirmation de vente</h1>
          <p className="text-gray-400 text-sm md:text-base">Vérifiez les détails de votre vente avant de confirmer</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray w-full">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <Clock className="w-5 h-5 mr-2 text-terex-accent" />
              Récapitulatif de votre vente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 md:p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Vous vendez</span>
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
              
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Vous recevez</span>
                <div className="text-white font-bold text-lg">
                  {orderData.amount} {orderData.currency}
                </div>
              </div>
              
              <Separator className="bg-terex-gray" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Taux de change</span>
                <span className="text-white">1 USDT = {orderData.exchangeRate} {orderData.currency}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-medium">
                {orderData.useBinancePay ? 'Envoi via Binance Pay' : 'Détails d\'envoi USDT'}
              </h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3 w-full">
                {orderData.useBinancePay ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-gray-400 text-sm">Méthode d'envoi</span>
                      <div className="flex items-center space-x-2">
                        {!imageError ? (
                          <img 
                            src="/lovable-uploads/72ce0703-a66b-4a87-869b-8e9b7a022eb4.png" 
                            alt="Binance" 
                            className="w-5 h-5"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
                            <span className="text-black font-bold text-xs">B</span>
                          </div>
                        )}
                        <span className="text-white font-medium">Binance Pay</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-gray-400 text-sm">Avantages</span>
                      <span className="text-terex-accent text-sm">Instantané • Sans frais</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-gray-400 text-sm">Adresse d'envoi</span>
                      <span className="text-white font-medium break-all text-sm">{orderData.walletAddress}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-gray-400 text-sm">Réseau</span>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent w-fit">
                        {orderData.network}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-medium">Méthode de réception</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Réception via</span>
                  <span className="text-white font-medium">{getPaymentMethodName()}</span>
                </div>
                {orderData.phoneNumber && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-gray-400 text-sm">{orderData.paymentMethod === 'mobile' ? 'Numéro' : 'Compte'}</span>
                    <span className="text-white font-medium">{orderData.phoneNumber}</span>
                  </div>
                )}
                {orderData.provider && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-gray-400 text-sm">Service</span>
                    <span className="text-white font-medium">{getProviderName()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-full">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-blue-200 font-medium">Processus de vente</p>
                  <p className="text-blue-100 text-sm">
                    {orderData.useBinancePay ? (
                      <>
                        Après confirmation, vous serez redirigé vers Binance Pay pour envoyer 
                        vos {orderData.usdtAmount} USDT directement. Une fois la transaction confirmée, 
                        vous recevrez votre paiement de {orderData.amount} {orderData.currency}.
                      </>
                    ) : (
                      <>
                        Après confirmation, vous devrez envoyer vos {orderData.usdtAmount} USDT à l'adresse fournie.
                        Une fois la transaction confirmée sur la blockchain, vous recevrez votre paiement de {orderData.amount} {orderData.currency}.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={onConfirm}
              disabled={loading}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12 text-lg"
            >
              {loading ? 'Création en cours...' : 'Confirmer la vente'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
