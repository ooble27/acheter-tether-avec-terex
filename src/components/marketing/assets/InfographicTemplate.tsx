
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InfographicTemplate() {
  const { toast } = useToast();

  const infographics = [
    {
      id: 1,
      title: "Comment ça marche - 3 étapes",
      visual: (
        <div className="bg-white p-6 rounded-xl">
          <div className="text-center mb-6">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-16 h-16 mx-auto rounded-xl mb-3"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Comment utiliser TEREX
            </h2>
            <p className="text-gray-600">En 3 étapes simples</p>
          </div>

          <div className="space-y-6">
            {/* Étape 1 */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Inscription gratuite</h3>
                <p className="text-gray-600 text-sm">Créez votre compte en 2 minutes</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* Étape 2 */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Choisissez votre service</h3>
                <p className="text-gray-600 text-sm">USDT ou transfert Afrique</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* Étape 3 */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Transaction sécurisée</h3>
                <p className="text-gray-600 text-sm">Confirmez et c'est fini !</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>

          <div className="mt-6 bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-gray-900 font-medium">Commencez maintenant !</p>
            <p className="text-gray-600 text-sm">terex.lovable.app</p>
          </div>
        </div>
      ),
      description: "Infographie expliquant le processus en 3 étapes"
    },
    {
      id: 2,
      title: "Statistiques Terex",
      visual: (
        <div className="bg-gradient-to-br from-terex-accent to-terex-accent/80 p-6 rounded-xl text-black">
          <div className="text-center mb-6">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-16 h-16 mx-auto rounded-xl mb-3"
            />
            <h2 className="text-2xl font-bold mb-2">TEREX en chiffres</h2>
            <p className="opacity-80">Une plateforme en croissance</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm opacity-80">CFA traités</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm opacity-80">Utilisateurs</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm opacity-80">Pays couverts</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm opacity-80">Disponibilité</div>
            </div>
          </div>

          <div className="mt-6 bg-black/30 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold">⚡</div>
                <div className="text-xs">Rapide</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">🔒</div>
                <div className="text-xs">Sécurisé</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">💰</div>
                <div className="text-xs">Économique</div>
              </div>
            </div>
          </div>
        </div>
      ),
      description: "Infographie avec les statistiques clés de Terex"
    }
  ];

  const downloadInfographic = (infoId: number) => {
    toast({
      title: "Téléchargement simulé",
      description: `L'infographie ${infoId} serait téléchargée en haute résolution.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">Infographies</h3>
        <p className="text-gray-400 text-sm">
          Contenus visuels pour expliquer vos services
        </p>
      </div>

      {infographics.map((infographic) => (
        <Card key={infographic.id} className="bg-terex-gray/20 border-terex-gray/30">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-3">{infographic.title}</h4>
                <div className="max-w-sm mx-auto">
                  {infographic.visual}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{infographic.description}</p>
                <Button 
                  size="sm" 
                  onClick={() => downloadInfographic(infographic.id)}
                  className="bg-terex-accent text-black hover:bg-terex-accent/80"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PNG
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-orange-500/10 border-orange-500/20">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-2">Utilisation des infographies :</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Publiez sur LinkedIn pour un public professionnel</li>
            <li>• Partagez sur Facebook pour éduquer votre audience</li>
            <li>• Utilisez dans vos présentations et documents</li>
            <li>• Intégrez dans vos emails marketing</li>
            <li>• Adaptez les couleurs selon la plateforme</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
