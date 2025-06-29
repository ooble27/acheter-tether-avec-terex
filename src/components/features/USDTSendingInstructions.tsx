
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
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
}

interface USDTSendingInstructionsProps {
  orderData: OrderData;
  onBack: () => void;
  onUSDTSent: () => void;
}

// Informations Binance de TEREX - À configurer avec vos vraies informations
const TEREX_BINANCE_INFO = {
  email: 'teranga.exchange@gmail.com',
  id: 'TEREX123456',
  payId: 'TEREX_PAY_ID'
};

export function USDTSendingInstructions({ orderData, onBack, onUSDTSent }: USDTSendingInstructionsProps) {
  const [confirmingSent, setConfirmingSent] = useState(false);
  const [useBinancePay, setUseBinancePay] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyToClipboard = (text: string, label: string = "L'adresse") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${label} a été copié dans le presse-papiers`,
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

  const handleBinanceRedirect = () => {
    // Essayer d'ouvrir l'app Binance d'abord, sinon le site web
    const binanceAppUrl = 'binance://pay';
    const binanceWebUrl = 'https://www.binance.com/fr/pay/checkout';
    
    // Créer un lien temporaire pour tenter d'ouvrir l'app
    const link = document.createElement('a');
    link.href = binanceAppUrl;
    
    // Essayer d'ouvrir l'app
    const startTime = Date.now();
    link.click();
    
    // Si l'app ne s'ouvre pas dans les 2 secondes, ouvrir le navigateur
    setTimeout(() => {
      if (Date.now() - startTime < 2100) {
        window.open(binanceWebUrl, '_blank');
      }
    }, 2000);
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
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Instructions d'envoi USDT
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Choisissez votre méthode d'envoi et suivez les étapes</p>
        </div>

        {/* Récapitulatif de la commande */}
        <Card className="bg-terex-darker border-terex-gray mb-6 w-full">
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
              <div className="space-y-1">
                <span className="text-gray-400">Méthode d'envoi</span>
                <div className="text-white">
                  {useBinancePay ? 'Binance Pay' : `Blockchain ${orderData.network}`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Choix de la méthode d'envoi */}
        <Card className="bg-terex-darker border-terex-gray mb-6 w-full">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <Send className="w-5 h-5 mr-2 text-terex-accent" />
              Choisissez votre méthode d'envoi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="grid gap-4">
              {/* Option Binance Pay */}
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  useBinancePay 
                    ? 'border-yellow-500 bg-yellow-500/10' 
                    : 'border-terex-gray bg-terex-gray/30 hover:border-yellow-500/50'
                }`}
                onClick={() => setUseBinancePay(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png" 
                      alt="Binance Pay" 
                      className="w-8 h-8"
                    />
                    <div>
                      <h3 className="text-white font-medium">Binance Pay</h3>
                      <p className="text-sm text-gray-400">Transfert direct et sans frais</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    useBinancePay ? 'bg-yellow-500 border-yellow-500' : 'border-gray-400'
                  }`}>
                    {useBinancePay && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                  </div>
                </div>
                {useBinancePay && (
                  <div className="mt-4 pt-4 border-t border-yellow-500/20">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      ✓ Recommandé - Sans frais
                    </Badge>
                  </div>
                )}
              </div>

              {/* Option Blockchain classique */}
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  !useBinancePay 
                    ? 'border-terex-accent bg-terex-accent/10' 
                    : 'border-terex-gray bg-terex-gray/30 hover:border-terex-accent/50'
                }`}
                onClick={() => setUseBinancePay(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                      alt="Blockchain" 
                      className="w-8 h-8"
                    />
                    <div>
                      <h3 className="text-white font-medium">Envoi Blockchain</h3>
                      <p className="text-sm text-gray-400">Via votre portefeuille crypto</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    !useBinancePay ? 'bg-terex-accent border-terex-accent' : 'border-gray-400'
                  }`}>
                    {!useBinancePay && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions d'envoi */}
        <Card className="bg-terex-darker border-terex-gray mb-6 w-full">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              {useBinancePay ? (
                <>
                  <img 
                    src="/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png" 
                    alt="Binance Pay" 
                    className="w-5 h-5 mr-2"
                  />
                  Étape 1: Envoyez via Binance Pay
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2 text-terex-accent" />
                  Étape 1: Envoyez vos USDT
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 md:p-6">
            {useBinancePay ? (
              // Instructions Binance Pay
              <>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 w-full">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-yellow-200 font-medium">Transfert Binance Pay !</p>
                      <p className="text-yellow-100 text-sm">
                        Vous allez être redirigé vers Binance Pay pour envoyer <strong>{orderData.usdtAmount} USDT</strong> directement et sans frais.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white font-medium mb-2 block">Nos informations Binance</Label>
                    <div className="bg-terex-gray rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Email Binance</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">{TEREX_BINANCE_INFO.email}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(TEREX_BINANCE_INFO.email, 'Email Binance')}
                            className="h-6 w-6 p-0 text-terex-accent hover:bg-terex-accent/10"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">ID Binance</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">{TEREX_BINANCE_INFO.id}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(TEREX_BINANCE_INFO.id, 'ID Binance')}
                            className="h-6 w-6 p-0 text-terex-accent hover:bg-terex-accent/10"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Pay ID</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">{TEREX_BINANCE_INFO.payId}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(TEREX_BINANCE_INFO.payId, 'Pay ID')}
                            className="h-6 w-6 p-0 text-terex-accent hover:bg-terex-accent/10"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white font-medium mb-2 block">Montant exact à envoyer</Label>
                    <div className="bg-terex-gray rounded-lg p-3 text-terex-accent font-bold text-lg w-full">
                      {orderData.usdtAmount} USDT
                    </div>
                  </div>

                  <Button
                    onClick={handleBinanceRedirect}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Ouvrir Binance Pay
                  </Button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-full">
                  <h4 className="text-blue-200 font-medium mb-2">Comment procéder :</h4>
                  <ol className="text-blue-100 text-sm space-y-1 list-decimal list-inside">
                    <li>Cliquez sur "Ouvrir Binance Pay"</li>
                    <li>Connectez-vous à votre compte Binance</li>
                    <li>Utilisez nos informations pour le transfert</li>
                    <li>Envoyez exactement {orderData.usdtAmount} USDT</li>
                    <li>Revenez ici et cliquez sur "Transfert effectué"</li>
                  </ol>
                </div>
              </>
            ) : (
              // Instructions blockchain classiques
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
                    <Label className="text-white font-medium mb-2 block">Réseau à utiliser</Label>
                    <div className="bg-terex-gray rounded-lg p-3 w-full">
                      <Badge variant="outline" className="text-terex-accent border-terex-accent">
                        {getNetworkName()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white font-medium mb-2 block">Adresse de destination</Label>
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
                    <Label className="text-white font-medium mb-2 block">Montant exact à envoyer</Label>
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
        <Card className="bg-terex-darker border-terex-gray w-full">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <CheckCircle className="w-5 h-5 mr-2 text-terex-accent" />
              Étape 2: Confirmez l'envoi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                {useBinancePay ? (
                  <>
                    Une fois que vous avez effectué le transfert via Binance Pay, cliquez sur le bouton ci-dessous 
                    pour nous notifier. Nous traiterons votre commande dans les 30 minutes et vous recevrez 
                    votre argent sur {getProviderName()}.
                  </>
                ) : (
                  <>
                    Une fois que vous avez envoyé les USDT à l'adresse indiquée, cliquez sur le bouton ci-dessous 
                    pour nous notifier. Nous traiterons votre commande dans les 30 minutes et vous recevrez 
                    votre argent sur {getProviderName()}.
                  </>
                )}
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
                    {useBinancePay ? 'Transfert effectué' : 'USDT Envoyé'}
                  </>
                )}
              </Button>

              <p className="text-gray-400 text-xs text-center">
                En cliquant sur ce bouton, vous confirmez avoir {useBinancePay ? 'effectué le transfert via Binance Pay' : 'envoyé les USDT à l\'adresse indiquée'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
