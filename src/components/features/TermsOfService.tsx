
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Scale, AlertCircle, Users, CreditCard, Ban } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Conditions d'utilisation Terex</h1>
          <p className="text-gray-400">
            Termes et conditions d'utilisation de nos services
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-terex-accent" />
              Acceptation des conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              En utilisant les services de Terex, vous acceptez d'être lié par ces conditions d'utilisation. 
              Si vous n'acceptez pas ces termes, veuillez ne pas utiliser nos services.
            </p>
            <p>
              Ces conditions constituent un accord légalement contraignant entre vous et Terex concernant 
              l'utilisation de notre plateforme de change de cryptomonnaies et de virements internationaux.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-terex-accent" />
              Éligibilité et inscription
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Conditions d'éligibilité:</h4>
            <div className="space-y-2">
              <p>• Vous devez être âgé d'au moins 18 ans</p>
              <p>• Vous devez avoir la capacité juridique de contracter</p>
              <p>• Vous ne devez pas être dans un pays où nos services sont interdits</p>
              <p>• Vous devez fournir des informations exactes lors de l'inscription</p>
            </div>
            <h4 className="text-white font-medium mt-4">Vérification d'identité:</h4>
            <p>
              Nous nous réservons le droit de demander une vérification d'identité (KYC) 
              conformément aux réglementations en vigueur.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-terex-accent" />
              Services offerts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Nos services incluent:</h4>
            <div className="space-y-2">
              <p>• Achat et vente d'USDT</p>
              <p>• Virements internationaux vers l'Afrique de l'Ouest</p>
              <p>• Services de change de devises</p>
              <p>• Support client</p>
            </div>
            <h4 className="text-white font-medium mt-4">Limites de service:</h4>
            <div className="space-y-2">
              <p>• Montants minimum et maximum selon le type de transaction</p>
              <p>• Disponibilité des services selon les régions</p>
              <p>• Délais de traitement variables selon les réseaux</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Scale className="w-5 h-5 mr-2 text-terex-accent" />
              Frais et tarification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-2">
              <p>• Les frais sont affichés de manière transparente avant chaque transaction</p>
              <p>• Les taux de change sont mis à jour en temps réel</p>
              <p>• Les frais de réseau blockchain sont inclus dans nos tarifs</p>
              <p>• Aucun frais caché n'est appliqué</p>
            </div>
            <p className="text-yellow-300">
              <strong>Important:</strong> Les frais peuvent varier selon le type de transaction 
              et le réseau utilisé.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Ban className="w-5 h-5 mr-2 text-terex-accent" />
              Utilisations interdites
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Il est strictement interdit d'utiliser nos services pour:</h4>
            <div className="space-y-2">
              <p>• Toute activité illégale ou frauduleuse</p>
              <p>• Le blanchiment d'argent</p>
              <p>• Le financement du terrorisme</p>
              <p>• La manipulation de marchés</p>
              <p>• L'usurpation d'identité</p>
              <p>• La violation des droits de propriété intellectuelle</p>
            </div>
            <p className="text-red-300">
              <strong>Sanctions:</strong> La violation de ces règles peut entraîner 
              la suspension ou la fermeture définitive de votre compte.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-terex-accent" />
              Limitations de responsabilité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Terex ne sera pas responsable pour:</h4>
            <div className="space-y-2">
              <p>• Les fluctuations de prix des cryptomonnaies</p>
              <p>• Les délais causés par les réseaux blockchain</p>
              <p>• Les erreurs d'adresse fournies par l'utilisateur</p>
              <p>• Les problèmes techniques des services tiers</p>
              <p>• Les pertes liées à la compromission de votre compte par négligence</p>
            </div>
            <p className="text-yellow-300">
              Il est de votre responsabilité de vérifier toutes les informations 
              avant de confirmer une transaction.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-terex-accent" />
              Confidentialité et données
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-2">
              <p>• Vos données personnelles sont protégées selon notre politique de confidentialité</p>
              <p>• Nous ne vendons ni ne partageons vos données sans votre consentement</p>
              <p>• Les informations de transaction peuvent être conservées pour des raisons légales</p>
              <p>• Vous avez le droit d'accéder, modifier ou supprimer vos données</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Scale className="w-5 h-5 mr-2 text-terex-accent" />
              Résolution des litiges
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">En cas de litige:</h4>
            <div className="space-y-2">
              <p>• Contactez notre support client en premier recours</p>
              <p>• Nous nous efforçons de résoudre tous les problèmes à l'amiable</p>
              <p>• Les litiges non résolus peuvent être soumis à médiation</p>
              <p>• Les lois du Canada s'appliquent à ces conditions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-terex-accent" />
              Modifications des conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-2">
              <p>• Nous nous réservons le droit de modifier ces conditions</p>
              <p>• Les utilisateurs seront notifiés des changements importants</p>
              <p>• L'utilisation continue des services constitue l'acceptation des nouveaux termes</p>
              <p>• Les conditions antérieures s'appliquent aux transactions déjà effectuées</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-blue-200 font-medium">Contact légal</p>
                <p className="text-blue-100 text-sm">
                  Pour toute question concernant ces conditions d'utilisation, 
                  contactez-nous à: Terangaexchange@gmail.com
                </p>
                <p className="text-blue-100 text-sm">
                  Dernière mise à jour: Décembre 2024
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
