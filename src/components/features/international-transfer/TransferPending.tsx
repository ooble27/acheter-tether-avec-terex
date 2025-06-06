
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';

interface TransferPendingProps {
  transferData: any;
  onBackToDashboard: () => void;
}

export function TransferPending({ transferData, onBackToDashboard }: TransferPendingProps) {
  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="w-full max-w-4xl mx-auto px-2 md:px-0">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Transfert en cours de traitement</h1>
          <p className="text-gray-400 text-sm md:text-base">Votre paiement est en cours de vérification</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                  Statut du transfert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Demande reçue</p>
                      <p className="text-gray-400 text-sm">Votre transfert a été créé avec succès</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Vérification du paiement</p>
                      <p className="text-gray-400 text-sm">Notre équipe vérifie votre paiement</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Traitement du transfert</p>
                      <p className="text-gray-500 text-sm">En attente de validation</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Transfert complété</p>
                      <p className="text-gray-500 text-sm">Le destinataire recevra les fonds</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-blue-200 font-medium">Délai de traitement</p>
                    <p className="text-blue-100 text-sm">
                      Votre transfert sera traité dans un délai de 24-48h ouvrables. 
                      Vous recevrez une notification par email à chaque étape du processus.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={onBackToDashboard}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12"
            >
              Retour au tableau de bord
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg">Détails du transfert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Numéro de référence</span>
                  <p className="text-white font-medium">TEREX-{transferData.id?.slice(-8)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Montant envoyé</span>
                  <p className="text-white font-medium">{transferData.amount} CAD</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Montant à recevoir</span>
                  <p className="text-terex-accent font-bold">{transferData.total_amount} CFA</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Statut</span>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    En traitement
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg">Destinataire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-white font-medium">{transferData.recipient_name}</p>
                <p className="text-gray-400 text-sm">{transferData.recipient_phone}</p>
                <Badge variant="outline" className="text-terex-accent border-terex-accent">
                  {transferData.recipient_country}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg">Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-terex-accent" />
                  <span className="text-white text-sm">+221 77 397 27 49</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-terex-accent" />
                  <span className="text-white text-sm">terangaexchange@gmail.com</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
