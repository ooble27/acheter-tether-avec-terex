
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface InteracPaymentInstructionsProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    paymentMethod: string;
    exchangeRate: number;
  };
  orderId: string;
  onBack: () => void;
  onPaymentConfirmed: () => void;
}

export function InteracPaymentInstructions({
  orderData,
  orderId,
  onBack,
  onPaymentConfirmed
}: InteracPaymentInstructionsProps) {
  const [emailCopied, setEmailCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);
  
  const interacEmail = "payments@terex.ca"; // L'email d'entreprise pour recevoir les Interac
  
  const copyToClipboard = (text: string, type: 'email' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } else {
      setAmountCopied(true);
      setTimeout(() => setAmountCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark px-0 py-2 md:p-4">
      <div className="max-w-4xl mx-auto px-0">
        {/* Header */}
        <div className="mb-6 flex items-center space-x-4 px-3 md:px-0">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Paiement Interac e-Transfer</h1>
            <p className="text-gray-400">Suivez les instructions pour envoyer votre paiement</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 px-0">
          {/* Instructions principales */}
          <div className="lg:col-span-2 px-3 md:px-0">
            <Card className="bg-terex-darker border-terex-gray mx-0 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-terex-accent" />
                  Instructions de paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-terex-accent/10 border border-terex-accent/20 rounded-lg p-4">
                  <h3 className="text-terex-accent font-semibold mb-2">Étapes à suivre :</h3>
                  <ol className="space-y-2 text-white">
                    <li className="flex items-start">
                      <span className="bg-terex-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                      <span>Connectez-vous à votre application bancaire ou au site web de votre banque</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-terex-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                      <span>Sélectionnez "Interac e-Transfer" ou "Virement Interac"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-terex-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                      <span>Utilisez les informations ci-dessous pour effectuer le transfert</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-terex-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                      <span>Cliquez sur "J'ai envoyé le paiement" une fois le transfert effectué</span>
                    </li>
                  </ol>
                </div>

                {/* Informations de transfert */}
                <div className="space-y-4">
                  <div className="bg-terex-gray/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-white font-medium">Destinataire (Email)</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(interacEmail, 'email')}
                        className="h-8"
                      >
                        {emailCopied ? <CheckCircle className="w-4 h-4" /> : 'Copier'}
                      </Button>
                    </div>
                    <div className="bg-terex-darker p-3 rounded border">
                      <code className="text-terex-accent font-mono">{interacEmail}</code>
                    </div>
                  </div>

                  <div className="bg-terex-gray/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-white font-medium">Montant exact</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${orderData.amount}`, 'amount')}
                        className="h-8"
                      >
                        {amountCopied ? <CheckCircle className="w-4 h-4" /> : 'Copier'}
                      </Button>
                    </div>
                    <div className="bg-terex-darker p-3 rounded border">
                      <code className="text-terex-accent font-mono text-lg font-bold">
                        {orderData.amount} CAD
                      </code>
                    </div>
                  </div>

                  <div className="bg-terex-gray/50 rounded-lg p-4">
                    <Label className="text-white font-medium">Message (optionnel)</Label>
                    <div className="bg-terex-darker p-3 rounded border mt-2">
                      <code className="text-gray-300 font-mono">
                        Commande TEREX #{orderId.substring(0, 8)}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-yellow-200 font-medium">Important</h4>
                      <ul className="text-yellow-100 text-sm mt-1 space-y-1">
                        <li>• Envoyez exactement {orderData.amount} CAD</li>
                        <li>• Utilisez l'email destinataire fourni ci-dessus</li>
                        <li>• Le traitement peut prendre 5-30 minutes après réception</li>
                        <li>• Vous recevrez vos USDT dès validation de notre équipe</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onPaymentConfirmed}
                  className="w-full gradient-button text-white font-semibold h-12"
                >
                  J'ai envoyé le paiement Interac
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif */}
          <div className="px-3 md:px-0">
            <Card className="bg-terex-darker border-terex-gray mx-0">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Commande</span>
                  <span className="text-white font-mono">#{orderId.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant</span>
                  <span className="text-white font-semibold">
                    {orderData.amount} CAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USDT à recevoir</span>
                  <span className="text-terex-accent font-bold">
                    {orderData.usdtAmount} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Réseau</span>
                  <span className="text-white">{orderData.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taux</span>
                  <span className="text-white">
                    1 USDT = {orderData.exchangeRate} CAD
                  </span>
                </div>
                <div className="border-t border-terex-gray pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200 text-sm">Délai de traitement</span>
                  </div>
                  <p className="text-gray-300 text-sm">5-30 minutes après réception</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
