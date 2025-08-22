
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, CheckCircle, Clock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface InteracPaymentInstructionsProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    exchangeRate: number;
    firstName: string;
    lastName: string;
    interacEmail: string;
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
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Email Interac de l'entreprise (à remplacer par le vrai email)
  const companyInteracEmail = "paiements@terex.ca";
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copié!",
        description: "L'email a été copié dans le presse-papiers",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Paiement Interac</h1>
            <p className="text-gray-400">Suivez les instructions pour effectuer votre virement</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 px-0">
          {/* Instructions de paiement */}
          <div className="lg:col-span-2 px-3 md:px-0">
            <Card className="bg-terex-darker border-terex-gray mx-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Instructions de paiement</CardTitle>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">
                    En attente de paiement
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Étapes */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terex-accent text-black rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Ouvrez votre application bancaire</h3>
                      <p className="text-gray-400 text-sm">
                        Connectez-vous à votre application mobile ou site web bancaire
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terex-accent text-black rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Sélectionnez "Interac e-Transfer"</h3>
                      <p className="text-gray-400 text-sm">
                        Choisissez l'option virement Interac dans votre application
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terex-accent text-black rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">Envoyez le virement à cette adresse</h3>
                      <div className="mt-2 p-4 bg-terex-gray rounded-lg border-2 border-dashed border-terex-accent/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-5 h-5 text-terex-accent" />
                            <span className="text-white font-mono text-lg">{companyInteracEmail}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(companyInteracEmail)}
                            className="text-terex-accent hover:text-terex-accent/80"
                          >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terex-accent text-black rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Montant exact</h3>
                      <p className="text-gray-400 text-sm">
                        Envoyez exactement <span className="text-terex-accent font-bold">{orderData.amount} CAD</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terex-accent text-black rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Message (important)</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Dans le message du virement, indiquez votre numéro de commande :
                      </p>
                      <div className="p-3 bg-terex-gray rounded border border-terex-gray-light">
                        <span className="text-white font-mono">#{orderId.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations importantes */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-semibold">Délai de traitement</h4>
                      <p className="text-blue-200 text-sm">
                        Une fois votre virement envoyé, vos USDT seront transférés dans les 5-10 minutes suivant la réception.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onPaymentConfirmed}
                  className="w-full gradient-button text-white font-semibold h-12"
                >
                  J'ai envoyé le virement Interac
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
                  <span className="text-gray-400">Nom</span>
                  <span className="text-white">{orderData.firstName} {orderData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email Interac</span>
                  <span className="text-white text-sm">{orderData.interacEmail}</span>
                </div>
                <hr className="border-terex-gray" />
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant à payer</span>
                  <span className="text-white font-semibold">{orderData.amount} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USDT à recevoir</span>
                  <span className="text-terex-accent font-bold">{orderData.usdtAmount} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Réseau</span>
                  <span className="text-white">{orderData.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Adresse</span>
                  <span className="text-white text-xs font-mono">{orderData.walletAddress.slice(0, 10)}...{orderData.walletAddress.slice(-6)}</span>
                </div>
                <hr className="border-terex-gray" />
                <div className="flex justify-between text-lg">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-terex-accent font-bold">{orderData.amount} CAD</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
