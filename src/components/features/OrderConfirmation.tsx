
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Clock, CreditCard } from 'lucide-react';

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
  const getPaymentMethodName = () => {
    switch (orderData.paymentMethod) {
      case 'card': return 'Virement bancaire';
      case 'mobile': return 'Mobile Money';
      default: return orderData.paymentMethod;
    }
  };

  const getProviderName = () => {
    return orderData.provider === 'wave' ? 'Wave' : 'Orange Money';
  };

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Confirmation de vente</h1>
          <p className="text-gray-400">Vérifiez les détails de votre vente avant de confirmer</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-terex-accent" />
              Récapitulatif de votre vente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Montants */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-gray-400">Vous vendez</span>
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
                <span className="text-gray-400">Vous recevez</span>
                <span className="text-white font-bold text-lg">
                  {orderData.amount} {orderData.currency}
                </span>
              </div>
              
              <Separator className="bg-terex-gray" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Taux de change</span>
                <span className="text-white">1 USDT = {orderData.exchangeRate} {orderData.currency}</span>
              </div>
            </div>

            {/* Détails de réception */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Détails de réception</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Numéro de réception</span>
                  <span className="text-white font-medium">{orderData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service de paiement</span>
                  <span className="text-white font-medium">{getProviderName()}</span>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-amber-200 font-medium">Traitement de la vente</p>
                  <p className="text-amber-100 text-sm">
                    Votre vente sera traitée sous 30 minutes. Vous recevrez un email de confirmation 
                    et l'argent sera envoyé sur votre {getProviderName()} une fois les USDT reçus et validés.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton de confirmation */}
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
