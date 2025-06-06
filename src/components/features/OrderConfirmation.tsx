
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
      case 'card': return 'Carte bancaire';
      case 'mobile': return 'Mobile Money';
      default: return orderData.paymentMethod;
    }
  };

  const getNetworkName = () => {
    switch (orderData.network) {
      case 'TRC20': return 'TRC20 (Tron)';
      case 'BEP20': return 'BEP20 (BSC)';
      case 'ERC20': return 'ERC20 (Ethereum)';
      default: return orderData.network;
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Confirmation de commande</h1>
          <p className="text-gray-400">Vérifiez les détails de votre achat avant de confirmer</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-terex-accent" />
              Récapitulatif de votre commande
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Montants */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Vous payez</span>
                <span className="text-white font-bold text-lg">
                  {orderData.amount} {orderData.currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Vous recevez</span>
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

            {/* Détails techniques */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Détails de livraison</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Réseau</span>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    {getNetworkName()}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 text-sm">Adresse de réception</span>
                  <div className="bg-terex-darker rounded p-2 text-white text-sm font-mono break-all">
                    {orderData.walletAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Méthode de paiement</h3>
              <div className="flex items-center space-x-3 bg-terex-gray rounded-lg p-4">
                <CreditCard className="w-5 h-5 text-terex-accent" />
                <span className="text-white">{getPaymentMethodName()}</span>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-amber-200 font-medium">Traitement de la commande</p>
                  <p className="text-amber-100 text-sm">
                    Votre commande sera traitée sous 24h ouvrées. Vous recevrez un email de confirmation 
                    et les USDT seront envoyés à votre adresse une fois le paiement validé.
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
              {loading ? 'Création en cours...' : 'Confirmer la commande'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
