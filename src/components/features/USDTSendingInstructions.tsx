import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Copy, Send, CheckCircle, AlertCircle, Wallet, ExternalLink } from 'lucide-react';
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
  useBinancePay?: boolean;
}

interface USDTSendingInstructionsProps {
  orderData: OrderData;
  onBack: () => void;
  onUSDTSent: () => void;
}

// Informations Binance de TEREX (à configurer avec vos vraies informations)
const TEREX_BINANCE_INFO = {
  email: 'votre-email-binance@example.com',
  id: 'VOTRE_BINANCE_ID',
  payId: 'VOTRE_BINANCE_PAY_ID'
};

export function USDTSendingInstructions({ orderData, onBack, onUSDTSent }: USDTSendingInstructionsProps) {
  const [confirmingSent, setConfirmingSent] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "L'information a été copiée dans le presse-papiers",
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

  const handleBinanceRedirect = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Essayer d'ouvrir l'app Binance directement
      window.location.href = 'binance://';
      
      // Fallback vers le store approprié si l'app n'est pas installée
      setTimeout(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          window.open('https://apps.apple.com/app/binance-buy-bitcoin-crypto/id1436799971', '_blank');
        } else {
          window.open('https://play.google.com/store/apps/details?id=com.binance.dev', '_blank');
        }
      }, 1000);
    } else {
      // Sur desktop, ouvrir Binance dans le navigateur
      window.open('https://www.binance.com', '_blank');
    }
  };

  const handleUSDTSent = () => {
    setConfirmingSent(true);
    setTimeout(() => {
      onUSDTSent();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-terex-dark p-1 md:p-4">
      <div className="w-full max-w-5xl mx-auto px-1 md:px-0">
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
          <p className="text-gray-400 text-sm md:text-base">Suivez ces étapes pour finaliser votre vente</p>
        </div>

        {/* Récapitulatif de la commande */}
        <Card className="bg-terex-darker border-terex-gray mb-6 w-full mx-1 md:mx-0">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <Wallet className="w-5 h-5 mr-2 text-terex-accent" />
              Récapitulatif de votre vente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div>
            <Separator className="bg-terex-gray" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-gray-400">Numéro de téléphone</span>
                <div className="text-white font-medium break-all">
                  {orderData.phoneNumber}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400">Service de paiement</span>
                <div className="text-white font-medium">
                  {getProviderName()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-gray-400">Taux</span>
                <div className="text-white">1 USDT = {orderData.exchangeRate} {orderData.currency}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions d'envoi */}
        <Card className="bg-terex-darker border-terex-gray mb-6 w-full mx-1 md:mx-0">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <Send className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 1: {orderData.useBinancePay ? 'Envoyez via Binance Pay' : 'Envoyez vos USDT'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 md:p-6">
            {orderData.useBinancePay ? (
              <>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 w-full">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-amber-200 font-medium">Transfert Binance Pay</p>
                      <p className="text-amber-100 text-sm">
                        Envoyez exactement <strong>{orderData.usdtAmount} USDT</strong> via Binance Pay. 
                        Le transfert est instantané et sans frais.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">Informations du destinataire (TEREX)</label>
                    <div className="bg-terex-gray rounded-lg p-4 space-y-3 w-full">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-gray-400 text-sm">Email Binance</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white break-all text-sm">{TEREX_BINANCE_INFO.email}</span>
                          <Button
                            onClick={() => copyToClipboard(TEREX_BINANCE_INFO.email)}
                            size="sm"
                            className="bg-terex-accent hover:bg-terex-accent/80 h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-gray-400 text-sm">Binance ID</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm">{TEREX_BINANCE_INFO.id}</span>
                          <Button
                            onClick={() => copyToClipboard(TEREX_BINANCE_INFO.id)}
                            size="sm"
                            className="bg-terex-accent hover:bg-terex-accent/80 h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-gray-400 text-sm">Montant à envoyer</span>
                        <span className="text-terex-accent font-bold">{orderData.usdtAmount} USDT</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBinanceRedirect}
                    size="lg"
                    className="w-full bg-terex-accent hover:bg-terex-accent/80 text-white font-semibold h-12 text-lg"
                  >
                    {!imageError ? (
                      <img 
                        src="/lovable-uploads/72ce0703-a66b-4a87-869b-8e9b7a022eb4.png" 
                        alt="Binance" 
                        className="w-5 h-5 mr-2"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded flex items-center justify-center mr-2">
                        <span className="text-black font-bold text-xs">B</span>
                      </div>
                    )}
                    Ouvrir Binance Pay
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-full">
                  <h4 className="text-blue-200 font-medium mb-2">Comment procéder :</h4>
                  <ol className="text-blue-100 text-sm space-y-1 list-decimal list-inside">
                    <li>Cliquez sur "Ouvrir Binance Pay" ci-dessus</li>
                    <li>Connectez-vous à votre compte Binance</li>
                    <li>Envoyez {orderData.usdtAmount} USDT à l'ID : {TEREX_BINANCE_INFO.id}</li>
                    <li>Confirmez le transfert</li>
                    <li>Revenez ici et cliquez sur "USDT Envoyé"</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 w-full">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
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
                    <div className="bg-terex-gray rounded-lg p-3 w-full">
                      <Badge variant="outline" className="text-terex-accent border-terex-accent">
                        {getNetworkName()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block">Adresse de destination</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <div className="bg-terex-gray rounded-lg p-3 flex-1 text-white font-mono text-sm break-all">
                        {orderData.walletAddress}
                      </div>
                      <Button
                        onClick={() => copyToClipboard(orderData.walletAddress)}
                        size="sm"
                        className="bg-terex-accent hover:bg-terex-accent/80 w-full sm:w-auto"
                      >
                        <Copy className="w-4 h-4 mr-2 sm:mr-0" />
                        <span className="sm:hidden">Copier</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block">Montant exact à envoyer</label>
                    <div className="bg-terex-gray rounded-lg p-3 text-terex-accent font-bold text-lg w-full">
                      {orderData.usdtAmount} USDT
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-full">
                  <h4 className="text-blue-200 font-medium mb-2">Comment procéder :</h4>
                  <ol className="text-blue-100 text-sm space-y-1 list-decimal list-inside">
                    <li>Ouvrez votre portefeuille crypto (Trust Wallet, MetaMask, etc.)</li>
                    <li>Sélectionnez USDT sur le réseau {getNetworkName()}</li>
                    <li>Copiez l'adresse de destination ci-dessus</li>
                    <li>Envoyez exactement {orderData.usdtAmount} USDT</li>
                    <li>Revenez ici et cliquez sur "USDT Envoyé"</li>
                  </ol>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bouton de confirmation */}
        <Card className="bg-terex-darker border-terex-gray w-full mx-1 md:mx-0">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <CheckCircle className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 2: Confirmez l'envoi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
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
