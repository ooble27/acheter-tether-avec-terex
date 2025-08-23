
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, CheckCircle, CreditCard, ArrowLeft, ExternalLink, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentInstructionsProps {
  transferData: any;
  onPaymentSent: () => void;
  onBack: () => void;
}

export function PaymentInstructions({ transferData, onPaymentSent, onBack }: PaymentInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papier`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const renderInteracInstructions = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 md:p-4">
        <div className="flex items-start space-x-2 md:space-x-3">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Interac_logo.svg/256px-Interac_logo.svg.png" 
            alt="Interac" 
            className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/lovable-uploads/ae10f8c7-fb15-4996-8f3e-d8a28fe8f89e.png";
            }}
          />
          <div>
            <h3 className="text-blue-200 font-medium mb-1 md:mb-2 text-sm md:text-base">Instructions Interac E-Transfer</h3>
            <div className="space-y-1 md:space-y-2 text-blue-100 text-xs md:text-sm">
              <p>1. Connectez-vous à votre banque en ligne</p>
              <p>2. Sélectionnez "Interac E-Transfer"</p>
              <p>3. Envoyez {transferData.amount} CAD</p>
            </div>
          </div>
        </div>
      </div>

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
                    mohalaval4@gmail.com
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('mohalaval4@gmail.com', 'Email')}
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
                    Référence transfert
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('Référence transfert', 'Question')}
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
                    TEREX-{transferData.id?.slice(-8)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`TEREX-${transferData.id?.slice(-8)}`, 'Réponse')}
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
              {transferData.amount} CAD
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCardInstructions = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 md:p-4">
        <div className="flex items-start space-x-2 md:space-x-3">
          <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-green-200 font-medium mb-1 md:mb-2 text-sm md:text-base">Paiement par carte bancaire</h3>
            <p className="text-green-100 text-xs md:text-sm">
              Cliquez ci-dessous pour payer {transferData.amount} CAD de manière sécurisée
            </p>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full gradient-button text-white font-semibold h-12 md:h-14 text-base md:text-lg"
        onClick={() => {
          toast({
            title: "Redirection",
            description: "Redirection vers la passerelle de paiement...",
          });
        }}
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Payer {transferData.amount} CAD
      </Button>
    </div>
  );

  const renderBankInstructions = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 md:p-4">
        <div className="flex items-start space-x-2 md:space-x-3">
          <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-purple-200 font-medium mb-1 md:mb-2 text-sm md:text-base">Virement bancaire</h3>
            <p className="text-purple-100 text-xs md:text-sm">
              Effectuez un virement avec les détails ci-dessous
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-terex-gray border-terex-gray-light mx-0">
        <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
          <CardTitle className="text-white text-base md:text-lg">Coordonnées bancaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
          <div className="p-3 md:p-4 bg-terex-darker rounded-lg border border-terex-accent/20">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-gray-400 text-xs md:text-sm block font-medium">Nom du bénéficiaire</span>
                <p className="text-white font-bold text-sm md:text-base mt-1">Teranga Exchange Inc.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard('Teranga Exchange Inc.', 'Nom')}
                className="text-terex-accent border-terex-accent hover:bg-terex-accent/10 flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
              >
                {copied === 'Nom' ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
              </Button>
            </div>
          </div>

          <div className="p-3 md:p-4 bg-terex-darker rounded-lg border border-blue-500/20">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-gray-400 text-xs md:text-sm block font-medium">Numéro de compte</span>
                <p className="text-white font-bold text-sm md:text-base mt-1">1234567890</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard('1234567890', 'Compte')}
                className="text-blue-500 border-blue-500 hover:bg-blue-500/10 flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
              >
                {copied === 'Compte' ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
              </Button>
            </div>
          </div>

          <div className="p-3 md:p-4 bg-terex-darker rounded-lg border border-green-500/20">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-gray-400 text-xs md:text-sm block font-medium">Code d'institution</span>
                <p className="text-white font-bold text-sm md:text-base mt-1">001</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard('001', 'Code')}
                className="text-green-500 border-green-500 hover:bg-green-500/10 flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
              >
                {copied === 'Code' ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
              </Button>
            </div>
          </div>

          <div className="p-3 md:p-4 bg-terex-darker rounded-lg border border-yellow-500/20">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-gray-400 text-xs md:text-sm block font-medium">Référence</span>
                <p className="text-white font-bold text-sm md:text-base mt-1">TEREX-{transferData.id?.slice(-8)}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`TEREX-${transferData.id?.slice(-8)}`, 'Référence')}
                className="text-yellow-500 border-yellow-500 hover:bg-yellow-500/10 flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
              >
                {copied === 'Référence' ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-terex-dark overflow-x-hidden px-0">
      <div className="w-full max-w-7xl mx-auto px-0 md:px-6 py-0 md:py-6">
        <div className="mb-4 md:mb-6 px-4 md:px-0">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-3 md:mb-4 -ml-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
            <span className="text-sm md:text-base">Retour</span>
          </Button>
          <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">Instructions de paiement</h1>
          <p className="text-gray-400 text-sm md:text-base">Suivez les instructions pour effectuer votre paiement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-0 md:px-0">
          <div className="lg:col-span-2 order-2 lg:order-1 px-4 md:px-0">
            <Card className="bg-terex-darker border-terex-gray mx-0 md:mx-0">
              <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
                <CardTitle className="text-white flex items-center text-base md:text-lg">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
                  Transfert #{transferData.id?.slice(-8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6 pb-4 md:pb-6">
                {transferData.payment_method === 'interac' && renderInteracInstructions()}
                {transferData.payment_method === 'card' && renderCardInstructions()}
                {transferData.payment_method === 'bank' && renderBankInstructions()}

                <Separator className="bg-terex-gray" />

                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-white font-medium text-sm md:text-base">Après avoir effectué le paiement</h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Une fois votre paiement envoyé, cliquez sur le bouton ci-dessous pour nous notifier. 
                    Notre équipe vérifiera votre paiement et procédera au transfert.
                  </p>
                  
                  <Button
                    onClick={onPaymentSent}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12 md:h-14 text-base md:text-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    J'ai effectué le paiement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:space-y-6 order-1 lg:order-2 px-4 md:px-0">
            <Card className="bg-terex-darker border-terex-gray mx-0 md:mx-0">
              <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
                <CardTitle className="text-white text-base md:text-lg">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 px-4 md:px-6 pb-4 md:pb-6">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-400">Montant</span>
                  <span className="text-white">{transferData.amount} CAD</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-400">Frais</span>
                  <span className="text-white">{transferData.fees} CAD</span>
                </div>
                <Separator className="bg-terex-gray" />
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-terex-accent font-bold">
                    {(parseFloat(transferData.amount) + parseFloat(transferData.fees)).toFixed(2)} CAD
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray mx-0 md:mx-0">
              <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
                <CardTitle className="text-white text-base md:text-lg">Destinataire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 md:px-6 pb-4 md:pb-6">
                <p className="text-white font-medium text-sm md:text-base">
                  {transferData.recipient_name}
                </p>
                <p className="text-gray-400 text-xs md:text-sm break-all">
                  {transferData.recipient_phone}
                </p>
                <Badge variant="outline" className="text-terex-accent border-terex-accent text-xs">
                  {transferData.recipient_country}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
