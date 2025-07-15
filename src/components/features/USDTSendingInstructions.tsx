
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Copy, CheckCircle, AlertTriangle, ExternalLink, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderData {
  amount: string;
  currency: string;
  usdtAmount: string;
  exchangeRate: number;
  walletAddress: string;
  paymentMethod: 'bank' | 'mobile' | 'binance';
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  mobileProvider?: 'wave' | 'orange';
  mobileNumber?: string;
  binancePayId?: string;
  network?: string;
}

interface USDTSendingInstructionsProps {
  orderData: OrderData;
  orderId: string;
  onBack: () => void;
  onUSDTSent: () => void;
}

export function USDTSendingInstructions({ orderData, orderId, onBack, onUSDTSent }: USDTSendingInstructionsProps) {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const walletAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TEREX USDT wallet address

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papiers`,
    });
  };

  const getPaymentMethodName = () => {
    switch (orderData.paymentMethod) {
      case 'bank': return 'Virement bancaire';
      case 'mobile': return 'Mobile Money';
      case 'binance': return 'Binance Pay';
      default: return orderData.paymentMethod;
    }
  };

  // Si c'est Binance Pay, rediriger vers Binance
  if (orderData.paymentMethod === 'binance') {
    const handleBinancePayRedirect = () => {
      // Ouvrir Binance Pay avec les détails pré-remplis
      const binancePayUrl = `https://www.binance.com/en/pay`;
      window.open(binancePayUrl, '_blank');
      
      // Marquer comme envoyé après un délai
      setTimeout(() => {
        onUSDTSent();
      }, 3000);
    };

    return (
      <div className="min-h-screen bg-terex-dark p-1 md:p-4">
        <div className="w-full max-w-5xl md:max-w-4xl mx-auto px-1 md:px-2">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Paiement via Binance Pay</h1>
            <p className="text-gray-400 text-sm md:text-base">Envoyez vos USDT via Binance Pay</p>
          </div>

          <Card className="bg-terex-darker border-terex-gray w-full mx-1 md:mx-0">
            <CardHeader className="pb-4 p-3 md:p-6">
              <CardTitle className="text-white flex items-center text-lg md:text-xl">
                <QrCode className="w-5 h-5 mr-2 text-terex-accent" />
                Paiement Binance Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-3 md:p-6">
              <div className="bg-terex-gray rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  {!imageError ? (
                    <img 
                      src="/lovable-uploads/72ce0703-a66b-4a87-869b-8e9b7a022eb4.png" 
                      alt="Binance" 
                      className="w-8 h-8"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
                      <span className="text-black font-bold">B</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-medium">Binance Pay</h3>
                    <p className="text-gray-400 text-sm">Paiement instantané et sécurisé</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Montant à envoyer</span>
                    <span className="text-terex-accent font-bold">{orderData.usdtAmount} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID destinataire</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono">{orderData.binancePayId}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(orderData.binancePayId || '', 'ID Binance Pay')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-200 font-medium mb-2">Instructions :</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-100 text-sm">
                  <li>Ouvrez l'application Binance</li>
                  <li>Allez dans "Pay" puis "Envoyer"</li>
                  <li>Entrez l'ID : {orderData.binancePayId}</li>
                  <li>Envoyez {orderData.usdtAmount} USDT</li>
                  <li>Confirmez la transaction</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBinancePayRedirect}
                  size="lg"
                  className="w-full gradient-button text-white font-semibold h-12 text-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Ouvrir Binance Pay
                </Button>

                <Button
                  onClick={onUSDTSent}
                  variant="outline"
                  size="lg"
                  className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-black h-12"
                >
                  J'ai envoyé les USDT
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-1 md:p-4">
      <div className="w-full max-w-5xl md:max-w-4xl mx-auto px-1 md:px-2">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Instructions d'envoi USDT</h1>
          <p className="text-gray-400 text-sm md:text-base">Envoyez vos USDT à l'adresse ci-dessous</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray w-full mx-1 md:mx-0">
          <CardHeader className="pb-4 p-3 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <QrCode className="w-5 h-5 mr-2 text-terex-accent" />
              Commande #{orderId.slice(-8)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-3 md:p-6">
            {/* Résumé de la commande */}
            <div className="bg-terex-gray rounded-lg p-4 space-y-3">
              <h3 className="text-white font-medium">Résumé de votre vente</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">USDT à envoyer</span>
                  <span className="text-terex-accent font-bold">{orderData.usdtAmount} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vous recevrez</span>
                  <span className="text-white font-bold">{orderData.amount} {orderData.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Méthode de réception</span>
                  <span className="text-white">{getPaymentMethodName()}</span>
                </div>
              </div>
            </div>

            {/* Adresse de destination */}
            <div className="bg-terex-gray rounded-lg p-4 space-y-4">
              <h3 className="text-white font-medium">Adresse de destination USDT</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm">Réseau</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-terex-accent border-terex-accent">
                      {orderData.network || 'TRC20'}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {orderData.network === 'TRC20' ? '(Tron - Gratuit)' : 
                       orderData.network === 'ERC20' ? '(Ethereum)' : 
                       orderData.network === 'BEP20' ? '(BSC)' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm">Adresse du portefeuille</label>
                  <div className="flex items-center space-x-2 mt-1 p-3 bg-terex-dark rounded border border-terex-gray-light">
                    <span className="text-white font-mono text-sm break-all flex-1">{walletAddress}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(walletAddress, 'Adresse')}
                      className="flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm">Montant exact à envoyer</label>
                  <div className="flex items-center space-x-2 mt-1 p-3 bg-terex-dark rounded border border-terex-gray-light">
                    <span className="text-terex-accent font-bold flex-1">{orderData.usdtAmount} USDT</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(orderData.usdtAmount, 'Montant')}
                      className="flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions importantes */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-orange-200 font-medium">Instructions importantes :</p>
                  <ul className="list-disc list-inside space-y-1 text-orange-100 text-sm">
                    <li>Envoyez exactement {orderData.usdtAmount} USDT</li>
                    <li>Utilisez uniquement le réseau {orderData.network || 'TRC20'}</li>
                    <li>Vérifiez l'adresse avant d'envoyer</li>
                    <li>La transaction est irréversible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="bg-terex-gray rounded-lg p-4 text-center">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-3">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">QR Code pour l'adresse USDT</p>
            </div>

            <Button
              onClick={onUSDTSent}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12 text-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              J'ai envoyé les USDT
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
