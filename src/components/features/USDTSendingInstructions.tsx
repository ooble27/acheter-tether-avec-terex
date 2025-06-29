
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Copy, CheckCircle, Clock, AlertCircle, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface USDTSendingInstructionsProps {
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
  onBack: () => void;
  onUSDTSent: () => void;
}

export function USDTSendingInstructions({ orderData, onBack, onUSDTSent }: USDTSendingInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast({
      title: "Copié !",
      description: `${field} copié dans le presse-papiers`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {orderData.useBinancePay ? 'Envoyer via Binance Pay' : 'Envoyer les USDT'}
            </h1>
            <p className="text-gray-400">Suivez les instructions pour compléter votre vente</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Instructions d'envoi */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {orderData.useBinancePay ? (
                    <img 
                      src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
                      alt="Binance" 
                      className="w-6 h-6 mr-3 rounded"
                    />
                  ) : (
                    <Wallet className="w-6 h-6 mr-3 text-terex-accent" />
                  )}
                  {orderData.useBinancePay ? 'Instructions Binance Pay' : `Instructions d'envoi ${orderData.network}`}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-500 font-medium">
                    Temps restant : {formatTime(timeLeft)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderData.useBinancePay ? (
                  // Instructions Binance Pay
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <p className="text-gray-300">Ouvrez votre application Binance</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                        <p className="text-gray-300">Allez dans "Pay" puis "Envoyer"</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">3</span>
                        </div>
                        <p className="text-gray-300">Utilisez l'email ou l'ID Binance ci-dessous</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">4</span>
                        </div>
                        <p className="text-gray-300">Montant: <strong className="text-white">{orderData.usdtAmount} USDT</strong></p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">5</span>
                        </div>
                        <p className="text-gray-300">Confirmez et envoyez la transaction</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">6</span>
                        </div>
                        <p className="text-gray-300">Cliquez sur "J'ai envoyé" ci-dessous</p>
                      </div>
                    </div>
                  </>
                ) : (
                  // Instructions Wallet classique
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <p className="text-gray-300">
                          Envoyez exactement <strong>{orderData.usdtAmount} USDT</strong>
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                        <p className="text-gray-300">
                          Utilisez le réseau <strong>{orderData.network}</strong>
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">3</span>
                        </div>
                        <p className="text-gray-300">
                          À l'adresse suivante :
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {orderData.useBinancePay && orderData.binanceInfo ? (
              // Informations de réception Binance Pay
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <img 
                      src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
                      alt="Binance" 
                      className="w-5 h-5 mr-2 rounded"
                    />
                    Informations de réception TEREX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-400 text-sm">Email Binance</Label>
                    <div className="flex items-center justify-between bg-terex-gray rounded-lg p-4 mt-1">
                      <span className="text-white font-mono text-lg">{orderData.binanceInfo.email}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(orderData.binanceInfo!.email, 'Email')}
                        className="border-terex-gray text-white hover:bg-terex-gray"
                      >
                        {copied === 'Email' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm">ID Binance</Label>
                    <div className="flex items-center justify-between bg-terex-gray rounded-lg p-4 mt-1">
                      <span className="text-white font-mono text-lg">{orderData.binanceInfo.binanceId}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(orderData.binanceInfo!.binanceId, 'ID')}
                        className="border-terex-gray text-white hover:bg-terex-gray"
                      >
                        {copied === 'ID' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm">Nom du destinataire</Label>
                    <div className="bg-terex-gray rounded-lg p-4 mt-1">
                      <span className="text-white font-medium">{orderData.binanceInfo.displayName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Adresse de réception classique (si pas Binance Pay)
              orderData.walletAddress && (
                <Card className="bg-terex-darker border-terex-gray">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wallet className="w-5 h-5 mr-2 text-terex-accent" />
                      Adresse de réception
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between bg-terex-gray rounded-lg p-4">
                      <span className="text-white font-mono text-sm break-all">{orderData.walletAddress}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(orderData.walletAddress!, 'Adresse')}
                        className="border-terex-gray text-white hover:bg-terex-gray ml-2"
                      >
                        {copied === 'Adresse' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            {/* Avertissement */}
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-amber-200 font-medium">Important</p>
                    <ul className="text-amber-100 text-sm space-y-1">
                      <li>• Envoyez exactement <strong>{orderData.usdtAmount} USDT</strong></li>
                      {orderData.useBinancePay ? (
                        <li>• Utilisez uniquement Binance Pay (pas un transfert wallet classique)</li>
                      ) : (
                        <li>• Utilisez uniquement le réseau <strong>{orderData.network}</strong></li>
                      )}
                      <li>• L'envoi doit être effectué dans les 30 minutes</li>
                      <li>• Ne fermez pas cette page avant confirmation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={onUSDTSent}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12"
            >
              {orderData.useBinancePay ? "J'ai envoyé via Binance Pay" : "J'ai envoyé les USDT"}
            </Button>
          </div>

          {/* Sidebar - Récapitulatif */}
          <div className="space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">À envoyer</span>
                    <span className="text-white font-bold">
                      {orderData.usdtAmount} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vous recevrez</span>
                    <span className="text-terex-accent font-bold">
                      {orderData.amount} {orderData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Méthode</span>
                    <Badge variant="outline" className="text-terex-accent border-terex-accent">
                      {orderData.useBinancePay ? 'Binance Pay' : orderData.network}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Réception</span>
                    <span className="text-white text-sm">
                      {orderData.paymentMethod === 'mobile' ? 'Mobile Money' : 'Virement bancaire'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de sécurité */}
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-green-200 font-medium text-sm">Traitement automatique</p>
                    <p className="text-green-100 text-xs">
                      Votre paiement sera traité automatiquement après réception des USDT
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
