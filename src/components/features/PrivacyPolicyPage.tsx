
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-terex-dark p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-gray-400 hover:text-white mb-4 p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="bg-gradient-to-br from-terex-darker/95 to-terex-dark/95 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Politique de Confidentialité</h1>
              <p className="text-gray-300 text-lg">Protection de vos données personnelles</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Notre engagement</CardTitle>
            <CardDescription className="text-gray-400">
              Chez Terex, nous nous engageons à protéger votre vie privée et vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons 
              vos informations personnelles lorsque vous utilisez nos services de change de cryptomonnaies.
            </p>
            <p className="text-gray-300">
              En utilisant Terex, vous acceptez les pratiques décrites dans cette politique.
            </p>
          </CardContent>
        </Card>

        {/* Collecte des données */}
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-terex-accent" />
              <CardTitle className="text-white text-xl">Collecte des données</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Informations que nous collectons :</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Données d'identification :</strong> Nom, prénom, date de naissance</li>
                <li>• <strong>Coordonnées :</strong> Adresse email, numéro de téléphone, adresse postale</li>
                <li>• <strong>Documents KYC :</strong> Pièce d'identité, justificatif de domicile, selfie</li>
                <li>• <strong>Données financières :</strong> Historique des transactions, méthodes de paiement</li>
                <li>• <strong>Données techniques :</strong> Adresse IP, navigateur, données d'utilisation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Comment nous collectons ces données :</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Lors de votre inscription sur la plateforme</li>
                <li>• Pendant le processus de vérification KYC</li>
                <li>• Lors de vos transactions et interactions</li>
                <li>• Via les cookies et technologies de suivi</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Utilisation des données */}
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-terex-accent" />
              <CardTitle className="text-white text-xl">Utilisation des données</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 mb-4">Nous utilisons vos données personnelles pour :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-darker/50 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Services principaux</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Traitement des transactions</li>
                  <li>• Vérification d'identité (KYC)</li>
                  <li>• Prévention de la fraude</li>
                  <li>• Support client</li>
                </ul>
              </div>
              <div className="bg-terex-darker/50 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Amélioration du service</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Analyse d'utilisation</li>
                  <li>• Personnalisation</li>
                  <li>• Communication marketing</li>
                  <li>• Conformité réglementaire</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protection des données */}
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-green-400" />
              <CardTitle className="text-white text-xl">Protection et sécurité</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 mb-4">Mesures de sécurité mises en place :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                <h4 className="text-green-400 font-semibold mb-2">Chiffrement</h4>
                <p className="text-gray-300 text-sm">
                  Toutes les données sensibles sont chiffrées en transit et au repos avec des algorithmes de niveau bancaire.
                </p>
              </div>
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                <h4 className="text-blue-400 font-semibold mb-2">Accès restreint</h4>
                <p className="text-gray-300 text-sm">
                  Seul le personnel autorisé peut accéder à vos données, selon le principe du moindre privilège.
                </p>
              </div>
              <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                <h4 className="text-purple-400 font-semibold mb-2">Surveillance</h4>
                <p className="text-gray-300 text-sm">
                  Monitoring 24/7 pour détecter toute activité suspecte ou tentative d'intrusion.
                </p>
              </div>
              <div className="bg-orange-900/20 rounded-xl p-4 border border-orange-500/30">
                <h4 className="text-orange-400 font-semibold mb-2">Sauvegarde</h4>
                <p className="text-gray-300 text-sm">
                  Sauvegardes régulières et sécurisées pour garantir la disponibilité de vos données.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partage des données */}
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-terex-accent" />
              <CardTitle className="text-white text-xl">Partage des données</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 mb-4">
              Nous ne vendons jamais vos données personnelles. Nous ne les partageons que dans les cas suivants :
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-terex-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Partenaires de service :</strong> Processeurs de paiement, services KYC, uniquement pour les services demandés</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-terex-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Obligations légales :</strong> Autorités judiciaires ou réglementaires, en cas de demande légale</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-terex-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Protection des droits :</strong> Pour protéger nos droits, propriété ou sécurité</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Vos droits */}
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-terex-accent" />
              <CardTitle className="text-white text-xl">Vos droits RGPD</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-terex-darker/50 rounded-lg p-3">
                  <h4 className="text-white font-semibold text-sm">Droit d'accès</h4>
                  <p className="text-gray-400 text-sm">Consulter vos données personnelles</p>
                </div>
                <div className="bg-terex-darker/50 rounded-lg p-3">
                  <h4 className="text-white font-semibold text-sm">Droit de rectification</h4>
                  <p className="text-gray-400 text-sm">Corriger vos informations</p>
                </div>
                <div className="bg-terex-darker/50 rounded-lg p-3">
                  <h4 className="text-white font-semibold text-sm">Droit à l'effacement</h4>
                  <p className="text-gray-400 text-sm">Supprimer vos données</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-terex-darker/50 rounded-lg p-3">
                  <h4 className="text-white font-semibold text-sm">Droit à la portabilité</h4>
                  <p className="text-gray-400 text-sm">Récupérer vos données</p>
                </div>
                <div className="bg-terex-darker/50 rounded-lg p-3">
                  <h4 className="text-white font-semibold text-sm">Droit d'opposition</h4>
                  <p className="text-gray-400 text-sm">Refuser certains traitements</p>
                </div>
                <div className="bg-terex-darker/50 rounded-lg p-3">
                  <h4 className="text-white font-semibold text-sm">Droit de limitation</h4>
                  <p className="text-gray-400 text-sm">Limiter le traitement</p>
                </div>
              </div>
            </div>
            <div className="bg-terex-accent/10 rounded-xl p-4 border border-terex-accent/30 mt-6">
              <p className="text-terex-accent font-medium text-sm">
                Pour exercer vos droits, contactez-nous à : privacy@terex.africa
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-br from-terex-accent/10 to-terex-dark border border-terex-accent/30 shadow-2xl">
          <CardContent className="p-6">
            <h3 className="text-terex-accent font-semibold text-xl mb-4">Questions ou préoccupations ?</h3>
            <p className="text-gray-300 mb-4">
              Si vous avez des questions concernant cette politique de confidentialité ou le traitement de vos données, 
              n'hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-gray-300">
                <p className="font-medium">Email :</p>
                <p>privacy@terex.africa</p>
              </div>
              <div className="text-gray-300">
                <p className="font-medium">Adresse :</p>
                <p>Terex SARL, Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
