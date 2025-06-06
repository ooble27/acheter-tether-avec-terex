
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, CreditCard, Send, Smartphone, Shield, Clock } from 'lucide-react';

interface UserGuideProps {
  onBack: () => void;
}

export function UserGuide({ onBack }: UserGuideProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Guide d'utilisation Terex</h1>
          <p className="text-gray-400">
            Apprenez à utiliser toutes les fonctionnalités de Terex
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-terex-accent" />
              Bienvenue sur Terex
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Terex est votre plateforme de confiance pour acheter et vendre des USDT, 
              effectuer des virements internationaux et gérer vos transactions crypto en toute sécurité.
            </p>
            <p>
              Cette guide vous accompagnera dans toutes les étapes pour profiter pleinement 
              de nos services.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-terex-accent" />
              Comment acheter des USDT
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="text-white font-medium">Sélectionnez "Acheter USDT"</h4>
                  <p className="text-sm">Rendez-vous dans la section correspondante du menu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="text-white font-medium">Choisissez votre devise</h4>
                  <p className="text-sm">Sélectionnez CFA (pour l'Afrique) ou CAD (pour le Canada)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="text-white font-medium">Entrez le montant</h4>
                  <p className="text-sm">Minimum: 10,000 CFA ou 15 CAD</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="text-white font-medium">Sélectionnez votre réseau</h4>
                  <p className="text-sm">TRC20, BEP20, ERC20, Arbitrum ou Polygon</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <h4 className="text-white font-medium">Fournissez votre adresse USDT</h4>
                  <p className="text-sm">Assurez-vous qu'elle correspond au réseau choisi</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</div>
                <div>
                  <h4 className="text-white font-medium">Effectuez le paiement</h4>
                  <p className="text-sm">Suivez les instructions de paiement fournies</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-terex-accent" />
              Comment vendre des USDT
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="text-white font-medium">Accédez à "Vendre USDT"</h4>
                  <p className="text-sm">Cliquez sur la section vente dans le menu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="text-white font-medium">Entrez le montant d'USDT</h4>
                  <p className="text-sm">Minimum: 10 USDT</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="text-white font-medium">Choisissez le réseau d'envoi</h4>
                  <p className="text-sm">Sélectionnez le réseau de votre portefeuille USDT</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="text-white font-medium">Sélectionnez votre méthode de réception</h4>
                  <p className="text-sm">Orange Money, Wave ou virement bancaire</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <h4 className="text-white font-medium">Confirmez et envoyez</h4>
                  <p className="text-sm">Recevez votre argent sous 5 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Send className="w-5 h-5 mr-2 text-terex-accent" />
              Virements internationaux
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Envoyez de l'argent rapidement vers le Sénégal, la Côte d'Ivoire, 
              le Mali, le Burkina Faso et le Niger.
            </p>
            <div className="space-y-2">
              <p><span className="text-terex-accent">• Montant minimum:</span> 25 CAD</p>
              <p><span className="text-terex-accent">• Délai de traitement:</span> 5-15 minutes</p>
              <p><span className="text-terex-accent">• Services supportés:</span> Orange Money, Wave</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-terex-accent" />
              Vérification KYC
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Pour votre sécurité et conformément aux réglementations, 
              une vérification d'identité peut être requise pour certaines transactions.
            </p>
            <div className="space-y-2">
              <p><span className="text-terex-accent">• Documents requis:</span> Pièce d'identité valide</p>
              <p><span className="text-terex-accent">• Délai de vérification:</span> 24-48 heures</p>
              <p><span className="text-terex-accent">• Seuils de vérification:</span> Variables selon le montant</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-terex-accent" />
              Support client
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Notre équipe support est disponible 24/7 pour vous accompagner.
            </p>
            <div className="space-y-2">
              <p><span className="text-terex-accent">• Email:</span> Terangaexchange@gmail.com</p>
              <p><span className="text-terex-accent">• Téléphone:</span> +1 (418) 261-9091</p>
              <p><span className="text-terex-accent">• Chat en direct:</span> Disponible sur la plateforme</p>
              <p><span className="text-terex-accent">• Temps de réponse:</span> Maximum 30 minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
