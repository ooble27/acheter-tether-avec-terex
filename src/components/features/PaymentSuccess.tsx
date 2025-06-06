
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface PaymentSuccessProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
  };
  orderId: string;
  txHash?: string;
  onBackToHome: () => void;
  onBuyMore: () => void;
}

export function PaymentSuccess({ orderData, orderId, txHash, onBackToHome, onBuyMore }: PaymentSuccessProps) {
  // Explorer URL selon le réseau
  const getExplorerUrl = () => {
    if (!txHash) return '';
    
    switch(orderData.network) {
      case 'TRC20':
        return `https://tronscan.org/#/transaction/${txHash}`;
      case 'BEP20':
        return `https://bscscan.com/tx/${txHash}`;
      case 'ERC20':
        return `https://etherscan.io/tx/${txHash}`;
      case 'Arbitrum':
        return `https://arbiscan.io/tx/${txHash}`;
      case 'Polygon':
        return `https://polygonscan.com/tx/${txHash}`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Achat réussi !
          </h1>
          <p className="text-gray-400">
            Vos USDT ont été envoyés à votre adresse avec succès.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Détails de la transaction */}
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Détails de la transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Commande</span>
                <span className="text-white font-mono">#{orderId.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Montant payé</span>
                <span className="text-white font-medium">
                  {orderData.amount} {orderData.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">USDT envoyés</span>
                <span className="text-terex-accent font-bold">
                  {orderData.usdtAmount} USDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Statut</span>
                <Badge className="bg-green-500 text-white border-0">Complété</Badge>
              </div>
              {txHash && (
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction</span>
                    <a 
                      href={getExplorerUrl()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-terex-accent hover:underline flex items-center"
                    >
                      <span className="font-mono text-xs mr-1">
                        {`${txHash.substring(0, 8)}...${txHash.substring(txHash.length - 8)}`}
                      </span>
                      <ExternalLink className="w-3 h-3 inline-block" />
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adresse de réception */}
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Détails de réception</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="text-gray-400">Adresse de réception</span>
                <div className="bg-terex-gray p-3 rounded break-all text-xs md:text-sm font-mono text-white">
                  {orderData.walletAddress}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Réseau</span>
                <Badge variant="outline" className="text-terex-accent border-terex-accent">
                  {orderData.network}
                </Badge>
              </div>
              <div className="border-t border-terex-gray pt-3 mt-3">
                <div className="text-center px-4 py-2 bg-green-500/10 rounded-lg">
                  <p className="text-green-500 text-sm">
                    Un email de confirmation a été envoyé à votre adresse
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="lg:col-span-2 flex flex-col md:flex-row gap-3 md:gap-6">
            <Button
              className="w-full gradient-button text-white font-medium py-3"
              onClick={onBuyMore}
            >
              Acheter à nouveau
            </Button>
            <Button
              variant="outline"
              className="w-full text-white border-terex-gray hover:bg-terex-gray"
              onClick={onBackToHome}
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
