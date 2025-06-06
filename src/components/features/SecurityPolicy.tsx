
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Server, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecurityPolicyProps {
  onBack: () => void;
}

export function SecurityPolicy({ onBack }: SecurityPolicyProps) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Politique de sécurité Terex</h1>
          <p className="text-gray-400">
            Découvrez comment nous protégeons vos fonds et vos données
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-terex-accent" />
              Notre engagement sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Chez Terex, la sécurité de vos fonds et de vos données personnelles est notre priorité absolue. 
              Nous mettons en place les meilleures pratiques de l'industrie pour vous offrir une expérience 
              sécurisée et fiable.
            </p>
            <p>
              Cette politique détaille les mesures que nous prenons pour protéger votre compte, 
              vos transactions et vos informations personnelles.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lock className="w-5 h-5 mr-2 text-terex-accent" />
              Chiffrement et protection des données
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Chiffrement SSL/TLS</h4>
                  <p className="text-sm">Toutes les communications sont chiffrées avec le protocole SSL/TLS 256-bit</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Chiffrement des données sensibles</h4>
                  <p className="text-sm">Vos informations personnelles et financières sont chiffrées en base de données</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Protection contre les attaques</h4>
                  <p className="text-sm">Systèmes de détection et prévention des attaques DDoS et malveillantes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Server className="w-5 h-5 mr-2 text-terex-accent" />
              Infrastructure sécurisée
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Serveurs sécurisés</h4>
                  <p className="text-sm">Hébergement dans des centres de données certifiés avec surveillance 24/7</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Séparation des fonds</h4>
                  <p className="text-sm">Les fonds clients sont séparés des fonds opérationnels de l'entreprise</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Sauvegardes régulières</h4>
                  <p className="text-sm">Sauvegardes automatiques et chiffrées de toutes les données importantes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Eye className="w-5 h-5 mr-2 text-terex-accent" />
              Surveillance et conformité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Surveillance des transactions</h4>
                  <p className="text-sm">Monitoring en temps réel pour détecter les activités suspectes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Vérification KYC/AML</h4>
                  <p className="text-sm">Procédures de vérification conformes aux réglementations anti-blanchiment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Logs d'audit</h4>
                  <p className="text-sm">Enregistrement détaillé de toutes les activités pour la traçabilité</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-terex-accent" />
              Vos responsabilités
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-white font-medium mb-3">Pour maintenir la sécurité de votre compte:</p>
            <div className="space-y-2">
              <p><span className="text-terex-accent">• Mot de passe fort:</span> Utilisez un mot de passe unique et complexe</p>
              <p><span className="text-terex-accent">• Confidentialité:</span> Ne partagez jamais vos identifiants de connexion</p>
              <p><span className="text-terex-accent">• Vérification des adresses:</span> Vérifiez toujours les adresses de portefeuille</p>
              <p><span className="text-terex-accent">• Connexion sécurisée:</span> Utilisez toujours https://terex.com</p>
              <p><span className="text-terex-accent">• Signalement:</span> Signalez immédiatement toute activité suspecte</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-terex-accent" />
              En cas d'incident
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Si vous soupçonnez une activité frauduleuse sur votre compte ou si vous avez 
              des préoccupations concernant la sécurité:
            </p>
            <div className="space-y-2">
              <p><span className="text-terex-accent">• Contactez-nous immédiatement:</span> Terangaexchange@gmail.com</p>
              <p><span className="text-terex-accent">• Ligne d'urgence:</span> +1 (418) 261-9091</p>
              <p><span className="text-terex-accent">• Changez vos mots de passe</span> si vous suspectez une compromission</p>
              <p><span className="text-terex-accent">• Surveillez vos transactions</span> régulièrement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-blue-200 font-medium">Mise à jour de la politique</p>
                <p className="text-blue-100 text-sm">
                  Cette politique de sécurité peut être mise à jour périodiquement. 
                  Nous vous informerons de tout changement important.
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
