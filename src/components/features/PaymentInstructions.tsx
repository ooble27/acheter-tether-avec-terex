
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, CheckCircle, Clock, AlertCircle, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentInstructionsProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    paymentMethod: 'card' | 'mobile';
    exchangeRate: number;
  };
  orderId: string;
  onBack: () => void;
  onPaymentConfirmed: () => void;
}

export function PaymentInstructions({ orderData, orderId, onBack, onPaymentConfirmed }: PaymentInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papier`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate unique security question and answer based on orderId
  const generateSecurityDetails = (orderId: string) => {
    const orderNumber = orderId.slice(-8).toUpperCase();
    const question = "TEREX";
    const answer = orderNumber;
    
    return { question, answer };
  };

  const getPaymentInstructions = () => {
    const securityDetails = generateSecurityDetails(orderId);
    
    if (orderData.paymentMethod === 'card') {
      return {
        title: "Instructions de virement Interac",
        steps: [
          "Connectez-vous à votre banque en ligne ou application mobile",
          "Sélectionnez 'Virement Interac' ou 'Envoyer de l'argent'",
          "Confirmez le virement",
          "Cliquez sur 'J'ai payé' ci-dessous"
        ],
        recipientEmail: "mohalaval4@gmail.com",
        securityQuestion: securityDetails.question,
        securityAnswer: securityDetails.answer
      };
    } else {
      return {
        title: "Instructions de paiement Mobile Money",
        steps: [
          "Ouvrez votre application Wave ou Orange Money",
          "Sélectionnez 'Envoyer de l'argent'",
          "Confirmez le transfert",
          "Cliquez sur 'J'ai payé' ci-dessous"
        ],
        recipientNumber: "+221 777569268"
      };
    }
  };

  const instructions = getPaymentInstructions();

  return (
    <div className="min-h-screen bg-terex-dark px-0 py-0 md:p-4">
      <div className="max-w-4xl mx-auto px-0">
        <div className="mb-4 md:mb-6 flex items-center space-x-4 px-3 md:px-0">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white">Effectuer le paiement</h1>
            <p className="text-gray-400 text-sm md:text-base">Suivez les instructions pour compléter votre achat</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 px-0">
          <div className="lg:col-span-2 space-y-4 md:space-y-6 px-0">
            <Card className="bg-terex-darker border-terex-gray mx-0">
              <CardHeader className="px-4 md:px-6 pt-4 md:pt-6">
                <CardTitle className="text-white text-base md:text-lg">{instructions.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-500 font-medium text-sm">
                    Temps restant : {formatTime(timeLeft)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {orderData.paymentMethod === 'card' && (
              <Card className="bg-terex-gray border-terex-gray-light mx-0">
                <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
                  <CardTitle className="text-white text-base md:text-xl font-bold">
                    Détails du destinataire Terex Exchange
                  </CardTitle>
                  <p className="text-terex-accent text-xs md:text-base font-medium">
                    Informations officielles pour votre virement Interac
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                  <div className="p-3 md:p-6 bg-terex-darker rounded-lg border border-terex-accent/20">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <span className="text-gray-400 text-xs md:text-base block font-medium">📧 Email destinataire</span>
                          <p className="text-white font-bold text-sm md:text-xl mt-2 break-all whitespace-nowrap overflow-x-auto">
                            {instructions.recipientEmail}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(instructions.recipientEmail!, 'Email')}
                          className="text-terex-accent border-terex-accent hover:bg-terex-accent/10 flex-shrink-0 h-8 w-8 md:h-12 md:w-12"
                        >
                          {copied === 'Email' ? <CheckCircle className="w-3 h-3 md:w-5 md:h-5" /> : <Copy className="w-3 h-3 md:w-5 md:h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-6 bg-terex-darker rounded-lg border border-green-500/20">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <span className="text-gray-400 text-xs md:text-base block font-medium">❓ Question de sécurité</span>
                          <p className="text-white font-bold text-sm md:text-xl mt-2 whitespace-nowrap overflow-x-auto">
                            {instructions.securityQuestion}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(instructions.securityQuestion!, 'Question')}
                          className="text-green-500 border-green-500 hover:bg-green-500/10 flex-shrink-0 h-8 w-8 md:h-12 md:w-12"
                        >
                          {copied === 'Question' ? <CheckCircle className="w-3 h-3 md:w-5 md:h-5" /> : <Copy className="w-3 h-3 md:w-5 md:h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-6 bg-terex-darker rounded-lg border border-yellow-500/20">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <span className="text-gray-400 text-xs md:text-base block font-medium">✅ Réponse</span>
                          <p className="text-white font-bold text-sm md:text-xl mt-2 whitespace-nowrap overflow-x-auto">
                            {instructions.securityAnswer}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(instructions.securityAnswer!, 'Réponse')}
                          className="text-yellow-500 border-yellow-500 hover:bg-yellow-500/10 flex-shrink-0 h-8 w-8 md:h-12 md:w-12"
                        >
                          {copied === 'Réponse' ? <CheckCircle className="w-3 h-3 md:w-5 md:h-5" /> : <Copy className="w-3 h-3 md:w-5 md:h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-lg border border-terex-accent">
                    <span className="text-gray-400 text-sm md:text-base block font-medium">💰 Montant à envoyer</span>
                    <p className="text-terex-accent font-bold text-2xl md:text-3xl mt-2">
                      {orderData.amount} {orderData.currency}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {orderData.paymentMethod === 'mobile' && (
              <Card className="bg-terex-gray border-terex-gray-light mx-0">
                <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
                  <CardTitle className="text-white text-base md:text-xl font-bold">
                    Détails du destinataire Mobile Money
                  </CardTitle>
                  <p className="text-terex-accent text-xs md:text-base font-medium">
                    Informations pour votre transfert Mobile Money
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                  <div className="p-3 md:p-6 bg-terex-darker rounded-lg border border-terex-accent/20">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <span className="text-gray-400 text-xs md:text-base block font-medium">📱 Numéro destinataire</span>
                          <p className="text-white font-bold text-sm md:text-xl mt-2 break-all whitespace-nowrap overflow-x-auto">
                            +221 777569268
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard('+221 777569268', 'Numéro')}
                          className="text-terex-accent border-terex-accent hover:bg-terex-accent/10 flex-shrink-0 h-8 w-8 md:h-12 md:w-12"
                        >
                          {copied === 'Numéro' ? <CheckCircle className="w-3 h-3 md:w-5 md:h-5" /> : <Copy className="w-3 h-3 md:w-5 md:h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-6 bg-terex-darker rounded-lg border border-yellow-500/20">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <span className="text-gray-400 text-xs md:text-base block font-medium">📝 Référence</span>
                          <p className="text-white font-bold text-sm md:text-xl mt-2 whitespace-nowrap overflow-x-auto">
                            {orderId.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(orderId.slice(-8).toUpperCase(), 'Référence')}
                          className="text-yellow-500 border-yellow-500 hover:bg-yellow-500/10 flex-shrink-0 h-8 w-8 md:h-12 md:w-12"
                        >
                          {copied === 'Référence' ? <CheckCircle className="w-3 h-3 md:w-5 md:h-5" /> : <Copy className="w-3 h-3 md:w-5 md:h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-lg border border-terex-accent">
                    <span className="text-gray-400 text-sm md:text-base block font-medium">💰 Montant à envoyer</span>
                    <p className="text-terex-accent font-bold text-2xl md:text-3xl mt-2">
                      {orderData.amount} {orderData.currency}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-amber-500/10 border-amber-500/30 mx-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-amber-200 font-medium">Important</p>
                    <ul className="text-amber-100 text-sm space-y-1">
                      <li>• Utilisez exactement le montant indiqué</li>
                      <li>• N'oubliez pas d'inclure la référence de commande</li>
                      {orderData.paymentMethod === 'card' && (
                        <>
                          <li>• Question de sécurité : {instructions.securityQuestion}</li>
                          <li>• Réponse : {instructions.securityAnswer}</li>
                        </>
                      )}
                      <li>• Le paiement doit être effectué dans les 30 minutes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="px-3 md:px-0">
              <Button
                onClick={onPaymentConfirmed}
                size="lg"
                className="w-full gradient-button text-white font-semibold h-12"
              >
                J'ai effectué le paiement
              </Button>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6 px-3 md:px-0">
            <Card className="bg-terex-darker border-terex-gray mx-0">
              <CardHeader className="px-4 md:px-6 pt-4 md:pt-6">
                <CardTitle className="text-white text-base md:text-lg">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6 pb-4 md:pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Commande</span>
                    <span className="text-white font-mono text-sm">#{orderId.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Montant à payer</span>
                    <span className="text-white font-bold text-sm">
                      {orderData.amount} {orderData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">USDT à recevoir</span>
                    <span className="text-terex-accent font-bold text-sm">
                      {orderData.usdtAmount} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Méthode</span>
                    <Badge variant="outline" className="text-terex-accent border-terex-accent text-xs">
                      {orderData.paymentMethod === 'card' ? 'Interac' : 'Mobile Money'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Réseau</span>
                    <Badge variant="outline" className="text-terex-accent border-terex-accent text-xs">
                      {orderData.network}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/30 mx-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-green-200 font-medium text-sm">Traitement automatique</p>
                    <p className="text-green-100 text-xs">
                      Vos USDT seront envoyés automatiquement après confirmation du paiement
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
