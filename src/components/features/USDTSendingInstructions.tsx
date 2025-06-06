
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Copy, Send, CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface USDTSendingInstructionsProps {
  orderData: OrderData;
  onBack: () => void;
  onUSDTSent: () => void;
}

export function USDTSendingInstructions({ orderData, onBack, onUSDTSent }: USDTSendingInstructionsProps) {
  const [confirmingSent, setConfirmingSent] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "L'adresse a été copiée dans le presse-papiers",
    });
  };

  const getNetworkName = () => {
    switch (orderData.network) {
      case 'TRC20': return 'TRC20 (Tron)';
      case 'BEP20': return 'BEP20 (BSC)';
      case 'ERC20': return 'ERC20 (Ethereum)';
      case 'Arbitrum': return 'Arbitrum';
      case 'Polygon': return 'Polygon';
      default: return orderData.network;
    }
  };

  const getProviderName = () => {
    return orderData.provider === 'wave' ? 'Wave' : 'Orange Money';
  };

  const handleUSDTSent = () => {
    setConfirmingSent(true);
    // Simuler un délai pour l'effet visuel
    setTimeout(() => {
      onUSDTSent();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Instructions d'envoi USDT</h1>
          <p className="text-gray-400">Suivez ces étapes pour finaliser votre vente</p>
        </div>

        {/* Récapitulatif de la commande */}
        <Card className="bg-terex-darker border-terex-gray mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-terex-accent" />
              Récapitulatif de votre vente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <span className="text-white font-bold text-lg">
                  {orderData.amount} {orderData.currency}
                </span>
              </div>
            </div>
            <Separator className="bg-terex-gray" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Réception sur</span>
                <div className="text-white font-medium">
                  {getProviderName()} - {orderData.phoneNumber}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Taux</span>
                <div className="text-white">1 USDT = {orderData.exchangeRate} {orderData.currency}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions d'envoi */}
        <Card className="bg-terex-darker border-terex-gray mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center">
              <Send className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 1: Envoyez vos USDT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-amber-200 font-medium">Important !</p>
                  <p className="text-amber-100 text-sm">
                    Envoyez exactement <strong>{orderData.usdtAmount} USDT</strong> sur le réseau <strong>{getNetworkName()}</strong>. 
                    Tout envoi incorrect pourrait retarder ou annuler votre transaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Réseau à utiliser</label>
                <div className="bg-terex-gray rounded-lg p-3">
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    {getNetworkName()}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Adresse de destination</label>
                <div className="flex items-center space-x-2">
                  <div className="bg-terex-gray rounded-lg p-3 flex-1 text-white font-mono text-sm break-all">
                    {orderData.walletAddress}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(orderData.walletAddress)}
                    size="sm"
                    className="bg-terex-accent hover:bg-terex-accent/80"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Montant exact à envoyer</label>
                <div className="bg-terex-gray rounded-lg p-3 text-terex-accent font-bold text-lg">
                  {orderData.usdtAmount} USDT
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-200 font-medium mb-2">Comment procéder :</h4>
              <ol className="text-blue-100 text-sm space-y-1 list-decimal list-inside">
                <li>Ouvrez votre portefeuille crypto (Trust Wallet, MetaMask, etc.)</li>
                <li>Sélectionnez USDT sur le réseau {getNetworkName()}</li>
                <li>Copiez l'adresse de destination ci-dessus</li>
                <li>Envoyez exactement {orderData.usdtAmount} USDT</li>
                <li>Revenez ici et cliquez sur "USDT Envoyé"</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de confirmation */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 2: Confirmez l'envoi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Une fois que vous avez envoyé les USDT à l'adresse indiquée, cliquez sur le bouton ci-dessous 
                pour nous notifier. Nous traiterons votre commande dans les 30 minutes et vous recevrez 
                votre argent sur {getProviderName()}.
              </p>
              
              <Button
                onClick={handleUSDTSent}
                disabled={confirmingSent}
                size="lg"
                className="w-full gradient-button text-white font-semibold h-12 text-lg"
              >
                {confirmingSent ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 animate-spin" />
                    Confirmation en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    USDT Envoyé
                  </>
                )}
              </Button>

              <p className="text-gray-400 text-xs text-center">
                En cliquant sur ce bouton, vous confirmez avoir envoyé les USDT à l'adresse indiquée
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
