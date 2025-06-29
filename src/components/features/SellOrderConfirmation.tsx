
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';

interface SellOrderConfirmationProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network?: string;
    walletAddress?: string;
    paymentMethod: 'bank' | 'mobile';
    exchangeRate: number;
    phoneNumber?: string;
    provider?: string;
    useBinancePay?: boolean;
    binanceInfo?: {
      email: string;
      binanceId: string;
      displayName: string;
    };
  };
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}

export function SellOrderConfirmation({ orderData, onConfirm, onBack, loading }: SellOrderConfirmationProps) {
  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Confirmer la vente</h1>
            <p className="text-gray-400">Vérifiez les détails de votre transaction</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Détails de la transaction */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Détails de la vente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Vous vendez</p>
                    <p className="text-white font-bold text-lg">{orderData.usdtAmount} USDT</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Vous recevez</p>
                    <p className="text-terex-accent font-bold text-lg">
                      {orderData.amount} {orderData.currency}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-terex-gray pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Taux de change</span>
                    <span className="text-white">1 USDT = {orderData.exchangeRate} {orderData.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Méthode d'envoi */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Méthode d'envoi des USDT</CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.useBinancePay ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
                        alt="Binance" 
                        className="w-6 h-6 rounded"
                      />
                      <div>
                        <p className="text-white font-medium">Binance Pay</p>
                        <p className="text-gray-400 text-sm">Envoi direct via Binance</p>
                      </div>
                      <Badge variant="outline" className="text-terex-accent border-terex-accent ml-auto">
                        Rapide
                      </Badge>
                    </div>
                    
                    {orderData.binanceInfo && (
                      <div className="bg-terex-gray/30 rounded-lg p-3 space-y-2">
                        <p className="text-gray-400 text-xs">Vous enverrez à :</p>
                        <p className="text-white text-sm font-mono">{orderData.binanceInfo.email}</p>
                        <p className="text-white text-sm">ID: {orderData.binanceInfo.binanceId}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={orderData.network === 'TRC20' ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'} 
                        alt={orderData.network} 
                        className="w-6 h-6 rounded"
                      />
                      <div>
                        <p className="text-white font-medium">Réseau {orderData.network}</p>
                        <p className="text-gray-400 text-sm">Envoi via adresse wallet</p>
                      </div>
                    </div>
                    
                    <div className="bg-terex-gray/30 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Adresse de réception :</p>
                      <p className="text-white text-sm font-mono break-all">{orderData.walletAddress}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Méthode de réception */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Méthode de réception</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {orderData.paymentMethod === 'mobile' ? (
                      <img 
                        src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" 
                        alt="Mobile Money" 
                        className="w-6 h-6 rounded"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-terex-accent rounded flex items-center justify-center text-xs text-white">🏦</div>
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {orderData.paymentMethod === 'mobile' ? 'Mobile Money' : 'Virement bancaire'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {orderData.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec boutons d'action */}
          <div className="space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Montant USDT</span>
                    <span className="text-white">{orderData.usdtAmount} USDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Vous recevez</span>
                    <span className="text-terex-accent font-bold">{orderData.amount} {orderData.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Frais</span>
                    <span className="text-green-500">Gratuit</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avertissement de sécurité */}
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-amber-200 font-medium text-sm">Important</p>
                    <ul className="text-amber-100 text-xs space-y-1">
                      <li>• Vérifiez tous les détails avant de confirmer</li>
                      <li>• La transaction sera irréversible</li>
                      <li>• Vous recevrez les instructions d'envoi après confirmation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="w-full gradient-button text-white font-semibold h-12"
              >
                {loading ? 'Confirmation...' : 'Confirmer la vente'}
              </Button>
              
              <Button
                variant="outline"
                onClick={onBack}
                disabled={loading}
                className="w-full text-white border-terex-gray hover:bg-terex-gray"
              >
                Retour
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
