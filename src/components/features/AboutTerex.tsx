
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Target, Users, Globe, Award, Zap, Star, Rocket, BarChart, Calendar, FileText } from 'lucide-react';

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
            Notre histoire, notre mission et nos valeurs fondatrices
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="rounded-lg overflow-hidden border-4 border-terex-accent">
                  <img 
                    src="/lovable-uploads/abd0d53b-cb36-4edb-91e5-e55da1466079.png" 
                    alt="Mohamed Lou - Fondateur de Terex" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-white">Mohamed Lou</h2>
                <h3 className="text-xl font-medium text-terex-accent">Fondateur & CEO</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  "Notre mission est de connecter l'Afrique au monde digital grâce à des solutions 
                  financières accessibles, transparentes et sécurisées. Nous construisons des ponts là 
                  où d'autres voient des frontières."
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-terex-accent font-medium">Formation</p>
                    <p className="text-gray-300">Finance & Technologie</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-terex-accent font-medium">Nationalité</p>
                    <p className="text-gray-300">Sénégalaise & Canadienne</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-terex-accent font-medium">LinkedIn</p>
                    <p className="text-terex-accent hover:text-terex-accent-light transition-colors">@mohamed-lou-terex</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-terex-accent font-medium">Contact</p>
                    <p className="text-gray-300">mohamed@terex.com</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-terex-accent" />
              Notre fondateur - Une vision née de l'expérience personnelle
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              L'histoire de Terex commence avec son fondateur, Mohamed Lou, un entrepreneur visionnaire né au Sénégal et 
              établi au Canada. Son parcours unique entre deux continents lui a permis d'identifier un besoin crucial: 
              faciliter les échanges financiers entre l'Afrique et le reste du monde.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-terex-accent font-medium text-lg">Les défis qui ont inspiré Terex</h4>
                <p>
                  En tant qu'immigrant au Canada, Mohamed a personnellement vécu les frustrations liées aux transferts 
                  d'argent internationaux: frais exorbitants, délais interminables, taux de change défavorables et manque 
                  de transparence. Il raconte comment un simple envoi d'argent à sa famille au Sénégal pouvait prendre 
                  plusieurs jours et coûter jusqu'à 10% du montant envoyé.
                </p>
                <p>
                  "J'étudiais l'informatique tout en travaillant à temps partiel, et chaque mois, j'envoyais une partie 
                  de mon salaire à ma famille. J'étais constamment frustré par les options disponibles, qui semblaient toutes 
                  prendre trop de temps et coûter trop cher. C'est là que l'idée de Terex a commencé à germer."
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-terex-accent font-medium text-lg">De la technologie à la finance</h4>
                <p>
                  Passionné par la technologie blockchain et ses applications potentielles, Mohamed a rapidement compris 
                  comment cette innovation pourrait révolutionner les transferts d'argent internationaux, particulièrement 
                  pour les communautés africaines.
                </p>
                <p>
                  "Au cours de mes études en informatique, j'ai découvert le potentiel des cryptomonnaies stables comme l'USDT 
                  pour faciliter les transferts d'argent rapides et à faible coût. J'ai réalisé que nous pouvions créer un pont 
                  digital entre les continents, contournant les systèmes bancaires traditionnels et leurs limitations."
                </p>
                <p>
                  En 2022, après des mois de recherche, de développement et de travail avec les régulateurs, Mohamed a lancé 
                  Terex avec une vision claire: démocratiser l'accès aux services financiers digitaux pour tous.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-2">
              <h4 className="text-blue-200 font-medium mb-3">La philosophie de Mohamed</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <h6 className="text-terex-accent font-medium">💡 Innovation pragmatique</h6>
                  <p className="text-sm mt-1">
                    "Notre technologie n'est pas compliquée pour impressionner, mais simplifiée pour fonctionner - accessible même 
                    sans connaissances techniques."
                  </p>
                </div>
                <div>
                  <h6 className="text-terex-accent font-medium">🌱 Impact social</h6>
                  <p className="text-sm mt-1">
                    "Chaque transaction facilitée représente des opportunités économiques pour les familles et les communautés 
                    partout en Afrique."
                  </p>
                </div>
                <div>
                  <h6 className="text-terex-accent font-medium">🛤️ Long terme</h6>
                  <p className="text-sm mt-1">
                    "Nous construisons pour durer - pas pour suivre une mode ou attirer des investisseurs, mais pour résoudre 
                    des problèmes réels pour des années à venir."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-terex-accent" />
              Notre histoire - Des origines à aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              Terex est née d'une vision simple mais ambitieuse : transformer la façon dont l'argent circule entre le Canada, 
              l'Afrique et au-delà, en utilisant les technologies blockchain comme catalyseur de changement.
            </p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-terex-gray rounded-lg p-4">
                  <h5 className="text-terex-accent font-medium mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    2021
                  </h5>
                  <h6 className="text-white font-medium mb-1">Conception et recherche</h6>
                  <ul className="text-sm space-y-1">
                    <li>• Premiers prototypes conceptuels</li>
                    <li>• Recherche de marché approfondie</li>
                    <li>• Étude des réglementations</li>
                  </ul>
                </div>
                <div className="bg-terex-gray rounded-lg p-4">
                  <h5 className="text-terex-accent font-medium mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    2022
                  </h5>
                  <h6 className="text-white font-medium mb-1">Fondation de Terex</h6>
                  <ul className="text-sm space-y-1">
                    <li>• Constitution légale de l'entreprise</li>
                    <li>• Premier financement amorçage</li>
                    <li>• Développement de la plateforme</li>
                  </ul>
                </div>
                <div className="bg-terex-gray rounded-lg p-4">
                  <h5 className="text-terex-accent font-medium mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    2023
                  </h5>
                  <h6 className="text-white font-medium mb-1">Lancement et croissance</h6>
                  <ul className="text-sm space-y-1">
                    <li>• Lancement officiel au Canada/Sénégal</li>
                    <li>• 1000+ utilisateurs actifs</li>
                    <li>• Expansion à la Côte d'Ivoire</li>
                  </ul>
                </div>
                <div className="bg-terex-gray rounded-lg p-4">
                  <h5 className="text-terex-accent font-medium mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    2024
                  </h5>
                  <h6 className="text-white font-medium mb-1">Expansion majeure</h6>
                  <ul className="text-sm space-y-1">
                    <li>• Couverture de 6 pays</li>
                    <li>• 5000+ utilisateurs actifs</li>
                    <li>• Levée de fonds réussie</li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-terex-gray rounded-lg p-4">
                  <h5 className="text-terex-accent font-medium mb-3">Nos réalisations marquantes</h5>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h6 className="text-white font-medium">+10,000 transactions traitées</h6>
                        <p className="text-sm">Des milliers de familles et d'entreprises connectées financièrement à travers les continents</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h6 className="text-white font-medium">Prix de l'innovation fintech 2023</h6>
                        <p className="text-sm">Reconnaissance nationale pour notre approche novatrice des transferts d'argent</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-terex-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h6 className="text-white font-medium">Partenariats stratégiques</h6>
                        <p className="text-sm">Collaborations avec des opérateurs mobiles majeurs en Afrique de l'Ouest</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-terex-gray rounded-lg p-4">
                  <h5 className="text-terex-accent font-medium mb-3">Notre empreinte</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Volume total traité</span>
                      <span className="text-terex-accent font-medium">$3M+</span>
                    </div>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-terex-accent to-blue-500 h-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Économies générées</span>
                      <span className="text-terex-accent font-medium">$150k+</span>
                    </div>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-terex-accent to-blue-500 h-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Temps économisé</span>
                      <span className="text-terex-accent font-medium">15,000+ heures</span>
                    </div>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-terex-accent to-blue-500 h-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-terex-accent" />
              Notre mission et raison d'être
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 rounded-lg p-6 mb-4">
              <h3 className="text-white text-xl font-bold text-center">
                "Connecter les économies africaines au monde digital en rendant les services financiers plus accessibles, 
                plus rapides et plus équitables pour tous"
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-terex-accent p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <Rocket className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-white font-medium text-lg mb-3">Accessibilité universelle</h4>
                <p>
                  Nous croyons que les services financiers modernes devraient être accessibles à tous, indépendamment 
                  de leur situation géographique ou économique. Terex s'efforce d'éliminer les barrières traditionnelles 
                  en fournissant des solutions simples et intuitives qui ne nécessitent qu'un téléphone et une connexion internet.
                </p>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-terex-accent p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-white font-medium text-lg mb-3">Rapidité et efficacité</h4>
                <p>
                  Dans un monde où tout s'accélère, les transferts d'argent ne devraient pas prendre des jours. 
                  Notre engagement est de traiter chaque transaction en quelques minutes, pas en jours ou en heures. 
                  Cette instantanéité permet des décisions économiques plus rapides et des urgences mieux gérées.
                </p>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-terex-accent p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-white font-medium text-lg mb-3">Transparence et équité</h4>
                <p>
                  Trop longtemps, les services financiers internationaux ont été caractérisés par des frais cachés 
                  et des taux défavorables. Terex s'engage à une transparence totale sur ses frais, des taux de change 
                  équitables et une information claire sur chaque étape du processus.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="bg-terex-gray p-4 rounded-lg">
                <h4 className="text-terex-accent font-medium mb-3">Le problème que nous résolvons</h4>
                <p className="mb-3">
                  L'Afrique reçoit plus de $50 milliards en transferts de fonds chaque année, mais près de 
                  $3 milliards sont perdus en frais excessifs et taux de change défavorables. Les délais 
                  peuvent atteindre plusieurs jours pour un simple transfert.
                </p>
                <div className="bg-terex-darker p-3 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Frais moyens (méthodes traditionnelles)</span>
                    <span className="text-red-400">8-12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Temps moyen (méthodes traditionnelles)</span>
                    <span className="text-red-400">2-5 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Frais moyens (Terex)</span>
                    <span className="text-green-400">3-6%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Temps moyen (Terex)</span>
                    <span className="text-green-400">5-15 minutes</span>
                  </div>
                </div>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <h4 className="text-terex-accent font-medium mb-3">Notre impact social</h4>
                <p className="mb-3">
                  Au-delà des chiffres, Terex crée un impact social significatif en permettant:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Soutien familial plus efficace pour les diasporas</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Accès à l'économie digitale pour les populations non-bancarisées</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Financement rapide pour petites entreprises et entrepreneurs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Réduction de la dépendance aux intermédiaires financiers</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-terex-accent" />
              Notre équipe multiculturelle
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              Derrière Terex se trouve une équipe passionnée, diversifiée et expérimentée, unie par une vision commune 
              de démocratiser l'accès aux services financiers digitaux. Notre force réside dans notre diversité culturelle, 
              technique et intellectuelle.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-terex-gray rounded-lg p-4">
                <h5 className="text-terex-accent font-medium mb-2">Direction</h5>
                <div className="space-y-4 mt-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-terex-accent flex items-center justify-center">
                      <span className="text-black font-bold">ML</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Mohamed Lou</p>
                      <p className="text-sm">Fondateur & CEO</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                      <span className="text-black font-bold">AF</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Aminata Fall</p>
                      <p className="text-sm">COO & Opérations Afrique</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                      <span className="text-black font-bold">JD</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Jean Dupont</p>
                      <p className="text-sm">CTO & Architecture</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-terex-gray rounded-lg p-4">
                <h5 className="text-terex-accent font-medium mb-2">Expertise technique</h5>
                <div className="space-y-2 mt-3">
                  <div>
                    <h6 className="text-white font-medium">Développement blockchain</h6>
                    <p className="text-sm">Équipe de 4 développeurs spécialisés</p>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-terex-accent to-green-500 h-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-white font-medium">Sécurité informatique</h6>
                    <p className="text-sm">Protection des données et détection des fraudes</p>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-terex-accent to-blue-500 h-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-white font-medium">Expérience utilisateur</h6>
                    <p className="text-sm">Design intuitif adapté aux marchés africains</p>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-terex-accent to-purple-500 h-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-terex-gray rounded-lg p-4">
                <h5 className="text-terex-accent font-medium mb-2">Expertise régionale</h5>
                <div className="space-y-2 mt-3">
                  <div>
                    <h6 className="text-white font-medium">Marchés africains</h6>
                    <p className="text-sm">Connaissance approfondie des écosystèmes locaux</p>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-terex-accent to-orange-500 h-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-white font-medium">Réglementation financière</h6>
                    <p className="text-sm">Conformité AML/KYC internationale</p>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-terex-accent to-red-500 h-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-white font-medium">Support multilingue</h6>
                    <p className="text-sm">Français, anglais, wolof, bambara</p>
                    <div className="w-full h-1 bg-terex-darker rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-terex-accent to-yellow-500 h-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-2">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="text-blue-200 font-medium">Une équipe diverse et passionnée</h5>
                  <p className="text-blue-100 text-sm mt-1">
                    Notre équipe de 15 personnes est répartie entre le Canada et l'Afrique de l'Ouest, représentant 
                    7 nationalités différentes. Cette diversité est notre force, nous permettant de comprendre intimement 
                    les besoins de nos utilisateurs et les défis propres à chaque marché. Nous sommes unis par une passion commune: 
                    utiliser la technologie pour créer un impact social positif et durable.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-terex-accent" />
              Notre présence internationale
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-terex-accent font-medium mb-4">Pays actuellement desservis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-terex-gray p-3 rounded flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-terex-darker flex items-center justify-center">
                      <span className="text-2xl">🇨🇦</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Canada</p>
                      <p className="text-xs">Siège principal</p>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-3 rounded flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-terex-darker flex items-center justify-center">
                      <span className="text-2xl">🇸🇳</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Sénégal</p>
                      <p className="text-xs">Bureau régional</p>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-3 rounded flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-terex-darker flex items-center justify-center">
                      <span className="text-2xl">🇨🇮</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Côte d'Ivoire</p>
                      <p className="text-xs">Support local</p>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-3 rounded flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-terex-darker flex items-center justify-center">
                      <span className="text-2xl">🇲🇱</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Mali</p>
                      <p className="text-xs">Partenariats</p>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-3 rounded flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-terex-darker flex items-center justify-center">
                      <span className="text-2xl">🇧🇫</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Burkina Faso</p>
                      <p className="text-xs">Partenariats</p>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-3 rounded flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-terex-darker flex items-center justify-center">
                      <span className="text-2xl">🇳🇪</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Niger</p>
                      <p className="text-xs">Partenariats</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-terex-accent font-medium mb-4">Plan d'expansion 2025-2026</h4>
                <div className="space-y-3">
                  <div className="bg-terex-gray p-3 rounded">
                    <h6 className="text-white font-medium mb-2">Phase 1: Afrique de l'Ouest et Centrale</h6>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇹🇬</span>
                        <span>Togo</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇧🇯</span>
                        <span>Bénin</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇬🇭</span>
                        <span>Ghana</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇨🇲</span>
                        <span>Cameroun</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇬🇦</span>
                        <span>Gabon</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇬🇳</span>
                        <span>Guinée</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-3 rounded">
                    <h6 className="text-white font-medium mb-2">Phase 2: Afrique de l'Est et Australe</h6>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇰🇪</span>
                        <span>Kenya</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇹🇿</span>
                        <span>Tanzanie</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇺🇬</span>
                        <span>Ouganda</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇿🇦</span>
                        <span>Afrique du Sud</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇷🇼</span>
                        <span>Rwanda</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇪🇹</span>
                        <span>Éthiopie</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-3 rounded">
                    <h6 className="text-white font-medium mb-2">Phase 3: International</h6>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇺🇸</span>
                        <span>États-Unis</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇪🇺</span>
                        <span>Europe</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">🇦🇪</span>
                        <span>UAE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-2">
              <div className="flex items-start space-x-3">
                <BarChart className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-green-200 font-medium">Notre impact par région (2024)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-100">🇸🇳 Sénégal</span>
                        <span className="text-green-100 font-medium">42%</span>
                      </div>
                      <div className="w-full h-2 bg-terex-darker rounded-full overflow-hidden mt-1">
                        <div className="bg-green-400 h-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-100">🇨🇮 Côte d'Ivoire</span>
                        <span className="text-green-100 font-medium">28%</span>
                      </div>
                      <div className="w-full h-2 bg-terex-darker rounded-full overflow-hidden mt-1">
                        <div className="bg-green-400 h-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-100">🇲🇱 Mali</span>
                        <span className="text-green-100 font-medium">15%</span>
                      </div>
                      <div className="w-full h-2 bg-terex-darker rounded-full overflow-hidden mt-1">
                        <div className="bg-green-400 h-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-terex-accent" />
              Nos valeurs fondamentales
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              Terex est guidée par un ensemble de valeurs fondamentales qui façonnent chaque aspect de 
              notre activité, de notre culture interne à nos interactions avec nos clients et partenaires.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-terex-accent/20 p-2 rounded w-10 h-10 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-terex-accent" />
                </div>
                <h4 className="text-terex-accent font-medium text-lg mb-3">Transparence totale</h4>
                <p className="mb-3">
                  Nous croyons que la confiance se construit à travers la transparence. Chez Terex, tous les frais, 
                  taux de change et délais sont clairement affichés avant chaque transaction.
                </p>
                <div className="bg-terex-darker p-3 rounded">
                  <p className="text-sm italic">
                    "La transparence n'est pas simplement une pratique commerciale, c'est un engagement moral 
                    envers nos utilisateurs. Cacher des frais est la façon la plus rapide de perdre la confiance."
                  </p>
                  <p className="text-xs text-terex-accent mt-2">- Mohamed Lou, Fondateur</p>
                </div>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-blue-500/20 p-2 rounded w-10 h-10 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-blue-400 font-medium text-lg mb-3">Sécurité inébranlable</h4>
                <p className="mb-3">
                  La sécurité des fonds et données de nos clients est non-négociable. Nous investissons constamment 
                  dans les technologies les plus avancées pour assurer une protection de niveau bancaire.
                </p>
                <div className="bg-terex-darker p-3 rounded">
                  <p className="text-sm italic">
                    "Chaque transaction représente la confiance de quelqu'un. Cette responsabilité guide 
                    chacune de nos décisions technologiques et opérationnelles."
                  </p>
                  <p className="text-xs text-blue-400 mt-2">- Jean Dupont, CTO</p>
                </div>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-purple-500/20 p-2 rounded w-10 h-10 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-purple-400 font-medium text-lg mb-3">Inclusion financière</h4>
                <p className="mb-3">
                  Notre mission dépasse le simple profit. Nous construisons des ponts vers l'inclusion financière, 
                  permettant à chacun d'accéder à des services financiers modernes, peu importe sa situation.
                </p>
                <div className="bg-terex-darker p-3 rounded">
                  <p className="text-sm italic">
                    "L'inclusion financière est un droit fondamental, pas un privilège. La technologie doit 
                    servir à éliminer les barrières, pas à en créer de nouvelles."
                  </p>
                  <p className="text-xs text-purple-400 mt-2">- Aminata Fall, COO</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-green-500/20 p-2 rounded w-10 h-10 flex items-center justify-center mb-3">
                  <Rocket className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-green-400 font-medium text-lg mb-3">Innovation pragmatique</h4>
                <p>
                  Nous cultivons une innovation ancrée dans les besoins réels de nos utilisateurs. Notre technologie 
                  blockchain avancée est rendue accessible et compréhensible pour tous, sans jargon technique inutile.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm">Développement guidé par les retours utilisateurs</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm">Tests sur le terrain avec les communautés locales</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm">Simplicité et facilité d'utilisation prioritaires</p>
                  </div>
                </div>
              </div>
              <div className="bg-terex-gray p-4 rounded-lg">
                <div className="bg-orange-500/20 p-2 rounded w-10 h-10 flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-orange-400 font-medium text-lg mb-3">Impact social positif</h4>
                <p>
                  Chaque transaction sur Terex contribue à un impact social positif. En réduisant les frais et en accélérant 
                  les transferts, nous permettons à plus de ressources d'atteindre directement les communautés qui en ont besoin.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <p className="text-sm">Soutien aux initiatives d'éducation financière</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <p className="text-sm">Programme d'autonomisation des entrepreneurs locaux</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <p className="text-sm">1% des profits dédiés à des initiatives communautaires</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-terex-accent" />
              Nos réalisations et partenariats
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-terex-accent font-medium mb-4">Récompenses et reconnaissances</h4>
                <div className="space-y-4">
                  <div className="bg-terex-gray p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-500/20 p-2 rounded w-10 h-10 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h6 className="text-white font-medium">Prix de l'Innovation Fintech 2023</h6>
                        <p className="text-sm">Chambre de Commerce du Québec</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500/20 p-2 rounded w-10 h-10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h6 className="text-white font-medium">Top 10 des Startups Africaines à Suivre</h6>
                        <p className="text-sm">Africa Tech Summit 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500/20 p-2 rounded w-10 h-10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h6 className="text-white font-medium">Certification Excellence Client</h6>
                        <p className="text-sm">Bureau International des Services Digitaux</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-terex-accent font-medium mb-4">Partenariats stratégiques</h4>
                <div className="space-y-4">
                  <div className="bg-terex-gray p-4 rounded-lg">
                    <h6 className="text-white font-medium mb-2">🏦 Institutions financières</h6>
                    <p className="text-sm mb-3">
                      Collaborations avec des banques régionales et des institutions de microfinance 
                      pour étendre notre couverture et améliorer nos services.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-terex-darker px-3 py-1 rounded text-sm">BCEAO</span>
                      <span className="bg-terex-darker px-3 py-1 rounded text-sm">Ecobank</span>
                      <span className="bg-terex-darker px-3 py-1 rounded text-sm">Baobab Microfinance</span>
                    </div>
                  </div>
                  <div className="bg-terex-gray p-4 rounded-lg">
                    <h6 className="text-white font-medium mb-2">📱 Opérateurs mobiles</h6>
                    <p className="text-sm mb-3">
                      Intégrations directes avec les principaux services de mobile money 
                      en Afrique pour des transactions instantanées et sécurisées.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-terex-darker px-3 py-1 rounded text-sm">Orange Money</span>
                      <span className="bg-terex-darker px-3 py-1 rounded text-sm">Wave</span>
                      <span className="bg-terex-darker px-3 py-1 rounded text-sm">MTN Mobile Money</span>
                      <span className="bg-terex-darker px-3 py-1 rounded text-sm">Moov Money</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-2">
              <h5 className="text-purple-200 font-medium mb-3">📊 Nos statistiques en un coup d'œil</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">15K+</div>
                  <div className="text-sm text-purple-100">Utilisateurs actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">$5M+</div>
                  <div className="text-sm text-purple-100">Volume échangé</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">6</div>
                  <div className="text-sm text-purple-100">Pays desservis</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">98%</div>
                  <div className="text-sm text-purple-100">Satisfaction client</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-terex-accent" />
              Notre vision d'avenir
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p className="text-lg">
              Terex se projette dans un avenir où les frontières financières seront effacées, permettant à chacun 
              d'accéder et de participer pleinement à l'économie mondiale, indépendamment de sa localisation géographique.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-b from-terex-gray to-terex-darker p-4 rounded-lg">
                <div className="relative mb-6">
                  <div className="absolute w-full h-0.5 bg-terex-accent bottom-0 left-0"></div>
                  <h5 className="text-2xl font-bold text-white pb-2">2025</h5>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Expansion à 12 pays africains</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Lancement de la carte de débit Terex</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Intégration de crypto-monnaies supplémentaires</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">100,000 utilisateurs actifs mensuels</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-b from-terex-gray to-terex-darker p-4 rounded-lg">
                <div className="relative mb-6">
                  <div className="absolute w-full h-0.5 bg-blue-400 bottom-0 left-0"></div>
                  <h5 className="text-2xl font-bold text-white pb-2">2026-2027</h5>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Présence dans 20+ pays africains</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Service de remittance B2B pour entreprises</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Plateforme d'épargne et investissement</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Expansion aux États-Unis et en Europe</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-b from-terex-gray to-terex-darker p-4 rounded-lg">
                <div className="relative mb-6">
                  <div className="absolute w-full h-0.5 bg-purple-400 bottom-0 left-0"></div>
                  <h5 className="text-2xl font-bold text-white pb-2">Vision 2030</h5>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Hub financier panafricain complet</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Services bancaires complets sans frontière</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">10 millions d'utilisateurs sur 5 continents</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-sm">Impact économique mesurable en Afrique</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20 rounded-lg p-6 mt-2">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-white">Un mot du fondateur sur notre vision</h3>
                <p className="text-gray-300 text-lg italic">
                  "Notre ambition va au-delà de créer une entreprise prospère. Nous souhaitons contribuer à la 
                  transformation digitale de l'Afrique et à son intégration dans l'économie mondiale. Chaque transfert, 
                  chaque transaction, chaque utilisateur nous rapproche de cette vision d'un monde où l'argent circule 
                  aussi librement que l'information."
                </p>
                <p className="text-terex-accent">- Mohamed Lou, Fondateur & CEO</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-terex-accent/10 to-blue-500/10 border-terex-accent/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Rejoignez-nous dans cette aventure</h3>
              <p className="text-gray-300">
                Que vous soyez un utilisateur, un partenaire potentiel ou un investisseur intéressé, 
                nous serions ravis d'échanger avec vous sur notre mission et notre vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-sm text-gray-400">
                  📧 Terangaexchange@gmail.com
                </div>
                <div className="text-sm text-gray-400">
                  📞 +1 (418) 261-9091
                </div>
                <div className="text-sm text-gray-400">
                  🌐 www.terex.com
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
