
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MessageCircle, Home } from 'lucide-react';

interface OrderData {
  amount: string;
  currency: string;
  usdtAmount: string;
  phoneNumber?: string;
  provider?: string;
}

interface USDTSentConfirmationProps {
  orderData: OrderData;
  onBackToHome: () => void;
}

export function USDTSentConfirmation({ orderData, onBackToHome }: USDTSentConfirmationProps) {
  const getProviderName = () => {
    return orderData.provider === 'wave' ? 'Wave' : 'Orange Money';
  };

  return (
    <div className="min-h-screen bg-terex-dark p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-terex-darker border-terex-gray text-center">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl">
              Transaction confirmée !
            </CardTitle>
            <p className="text-gray-400 mt-2">
              Nous avons bien reçu votre confirmation d'envoi USDT
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Résumé de la transaction */}
            <div className="bg-terex-gray rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">USDT envoyé</span>
                <span className="text-terex-accent font-bold">{orderData.usdtAmount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vous recevrez</span>
                <span className="text-white font-bold">{orderData.amount} {orderData.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Numéro de téléphone</span>
                <span className="text-white">{orderData.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service de paiement</span>
                <span className="text-white">{getProviderName()}</span>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="space-y-4">
              <h3 className="text-white font-medium text-left">Prochaines étapes :</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">Vérification en cours</p>
                    <p className="text-gray-400 text-sm">
                      Nous vérifions la réception de vos USDT sur notre portefeuille
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Traitement du paiement</p>
                    <p className="text-gray-400 text-sm">
                      Une fois confirmé, nous procéderons au transfert sur votre {getProviderName()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Réception des fonds</p>
                    <p className="text-gray-400 text-sm">
                      Vous recevrez {orderData.amount} {orderData.currency} dans les 30 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-left">
                  <p className="text-blue-200 font-medium">Temps de traitement</p>
                  <p className="text-blue-100 text-sm">
                    Maximum 30 minutes. Vous recevrez un email de confirmation une fois le transfert effectué.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact support */}
            <div className="bg-terex-gray rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-terex-accent" />
                <div className="text-left">
                  <p className="text-white font-medium">Besoin d'aide ?</p>
                  <p className="text-gray-400 text-sm">
                    Contactez notre support : terangaexchange@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton retour */}
            <Button
              onClick={onBackToHome}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12 text-lg mt-6"
            >
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
