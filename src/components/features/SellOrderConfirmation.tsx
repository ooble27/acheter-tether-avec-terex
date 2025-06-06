
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

interface OrderData {
  amount: number;
  network: string;
  paymentMethod: string;
  phoneNumber: string;
  cfaAmount: number;
  exchangeRate: number;
}

interface SellOrderConfirmationProps {
  orderData: OrderData;
  onBack: () => void;
}

export function SellOrderConfirmation({ orderData, onBack }: SellOrderConfirmationProps) {
  const getPaymentMethodName = () => {
    switch (orderData.paymentMethod) {
      case 'orange-money': return 'Orange Money';
      case 'wave': return 'Wave';
      default: return orderData.paymentMethod;
    }
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
            {/* Montants */}
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
                    {orderData.amount} USDT
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Vous recevez</span>
                <div className="text-white font-bold text-lg">
                  {orderData.cfaAmount.toLocaleString()} CFA
                </div>
              </div>
              
              <Separator className="bg-terex-gray" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Taux de change</span>
                <span className="text-white">1 USDT = {orderData.exchangeRate} CFA</span>
              </div>
            </div>

            {/* Détails d'envoi */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Détails d'envoi USDT</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Réseau</span>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent w-fit">
                    {orderData.network.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Méthode de réception</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Réception via</span>
                  <span className="text-white font-medium">{getPaymentMethodName()}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Numéro</span>
                  <span className="text-white font-medium">{orderData.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-full">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-blue-200 font-medium">Processus de vente</p>
                  <p className="text-blue-100 text-sm">
                    Après confirmation, vous devrez envoyer vos {orderData.amount} USDT à l'adresse fournie.
                    Une fois la transaction confirmée sur la blockchain, vous recevrez votre paiement de {orderData.cfaAmount.toLocaleString()} CFA.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <Button
              onClick={() => {}}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12 text-lg"
            >
              Confirmer la vente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
