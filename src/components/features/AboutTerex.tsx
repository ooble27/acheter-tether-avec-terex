
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Target, Users, Globe, Award, Zap } from 'lucide-react';

interface AboutTerexProps {
  onBack: () => void;
}

export function AboutTerex({ onBack }: AboutTerexProps) {
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
          <h1 className="text-3xl font-bold text-white mb-2">À propos de Terex</h1>
          <p className="text-gray-400">
            Découvrez notre histoire, notre mission et nos valeurs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-terex-accent" />
              Notre histoire
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Terex a été fondée avec une vision simple mais ambitieuse : démocratiser l'accès 
              aux services financiers digitaux et faciliter les échanges entre l'Afrique et le reste du monde.
            </p>
            <p>
              Née de la frustration liée aux frais élevés et aux délais prolongés des virements 
              traditionnels, notre plateforme propose une alternative moderne, rapide et accessible 
              pour tous.
            </p>
            <p>
              Depuis notre création, nous avons traité des milliers de transactions, 
              aidant les familles, les entreprises et les individus à envoyer et recevoir 
              de l'argent de manière sécurisée.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-terex-accent" />
              Notre mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg text-white font-medium">
              "Connecter les économies africaines au monde digital"
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="text-white font-medium">Accessibilité</h4>
                  <p className="text-sm">Rendre les services financiers digitaux accessibles à tous</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="text-white font-medium">Rapidité</h4>
                  <p className="text-sm">Traiter les transactions en quelques minutes, pas en jours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="text-white font-medium">Transparence</h4>
                  <p className="text-sm">Frais clairs, taux de change équitables, aucun frais caché</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-terex-accent" />
              Notre équipe
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Terex est dirigée par une équipe multiculturelle passionnée par la fintech 
              et l'inclusion financière. Nos experts combinent une expérience approfondie 
              des marchés africains avec une expertise technique de pointe.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-terex-gray rounded-lg p-4">
                <h4 className="text-white font-medium">Expertise Technique</h4>
                <p className="text-sm mt-2">Développeurs blockchain et spécialistes en sécurité</p>
              </div>
              <div className="bg-terex-gray rounded-lg p-4">
                <h4 className="text-white font-medium">Connaissance Locale</h4>
                <p className="text-sm mt-2">Experts des marchés africains et des réglementations</p>
              </div>
              <div className="bg-terex-gray rounded-lg p-4">
                <h4 className="text-white font-medium">Support Client</h4>
                <p className="text-sm mt-2">Équipe multilingue disponible 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-terex-accent" />
              Notre couverture
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <h4 className="text-white font-medium">Pays actuellement desservis:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                <span>🇸🇳 Sénégal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                <span>🇨🇮 Côte d'Ivoire</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                <span>🇲🇱 Mali</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                <span>🇧🇫 Burkina Faso</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                <span>🇳🇪 Niger</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
                <span>🇨🇦 Canada</span>
              </div>
            </div>
            <p className="text-yellow-300 text-sm">
              <strong>Expansion en cours:</strong> Nous travaillons activement pour étendre 
              nos services à d'autres pays africains.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-terex-accent" />
              Nos valeurs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-terex-accent font-medium">Innovation</h4>
                  <p className="text-sm">Nous adoptons les dernières technologies pour améliorer continuellement nos services</p>
                </div>
                <div>
                  <h4 className="text-terex-accent font-medium">Intégrité</h4>
                  <p className="text-sm">Transparence totale dans nos opérations et nos tarifs</p>
                </div>
                <div>
                  <h4 className="text-terex-accent font-medium">Inclusion</h4>
                  <p className="text-sm">Des services accessibles à tous, sans discrimination</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-terex-accent font-medium">Sécurité</h4>
                  <p className="text-sm">Protection maximale des fonds et données de nos utilisateurs</p>
                </div>
                <div>
                  <h4 className="text-terex-accent font-medium">Excellence</h4>
                  <p className="text-sm">Engagement envers la qualité de service et la satisfaction client</p>
                </div>
                <div>
                  <h4 className="text-terex-accent font-medium">Impact Social</h4>
                  <p className="text-sm">Contribuer au développement économique de l'Afrique</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-terex-accent" />
              Nos statistiques
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-terex-accent">10K+</div>
                <div className="text-sm">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-terex-accent">5K+</div>
                <div className="text-sm">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-terex-accent">6</div>
                <div className="text-sm">Pays</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-terex-accent">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-terex-accent" />
              Vision d'avenir
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Notre vision pour les prochaines années est ambitieuse : devenir la plateforme 
              de référence pour les services financiers digitaux en Afrique.
            </p>
            <div className="space-y-2">
              <p><span className="text-terex-accent">• Expansion géographique:</span> Couvrir 20+ pays africains d'ici 2026</p>
              <p><span className="text-terex-accent">• Nouveaux services:</span> Épargne, investissement, cartes de débit</p>
              <p><span className="text-terex-accent">• Partenariats:</span> Collaboration avec plus d'institutions financières</p>
              <p><span className="text-terex-accent">• Innovation:</span> Intégration de nouvelles cryptomonnaies et blockchains</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Rejoignez-nous dans cette aventure</h3>
              <p className="text-gray-300">
                Ensemble, construisons l'avenir des services financiers en Afrique
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-sm text-gray-400">
                  📧 Terangaexchange@gmail.com
                </div>
                <div className="text-sm text-gray-400">
                  📞 +1 (418) 261-9091
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
