
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function StoryTemplate() {
  const { toast } = useToast();

  const stories = [
    {
      id: 1,
      title: "Story USDT - Format vertical",
      visual: (
        <div className="bg-gradient-to-b from-terex-accent via-terex-accent/90 to-terex-accent/70 w-64 h-96 mx-auto rounded-3xl p-6 text-black relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <div className="font-bold text-sm">TEREX</div>
                <div className="text-xs opacity-80">Teranga Exchange</div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col justify-center text-center">
              <div className="text-4xl mb-3">💰</div>
              <h2 className="text-xl font-bold mb-2">
                Échangez vos USDT
              </h2>
              <h3 className="text-lg font-semibold mb-4">
                en 3 minutes !
              </h3>
              
              <div className="bg-black/20 rounded-xl p-3 mb-4">
                <div className="text-sm font-medium">Taux du jour</div>
                <div className="text-lg font-bold">1 USDT = 655 CFA</div>
              </div>

              <div className="space-y-2 text-sm">
                <div>✅ Sans commission</div>
                <div>⚡ Instantané</div>
                <div>🔒 100% sécurisé</div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-black/30 rounded-2xl p-4 text-center">
              <div className="font-bold text-sm mb-1">Swipe up</div>
              <div className="text-xs">terex.lovable.app</div>
              <div className="text-2xl mt-1">⬆️</div>
            </div>
          </div>
        </div>
      ),
      copy: "💰 ÉCHANGEZ VOS USDT EN 3 MINUTES !\n\n✅ Sans commission\n⚡ Instantané\n🔒 Sécurisé\n\nSwipe up pour commencer ! 👆\n\n#USDT #Crypto #Terex"
    },
    {
      id: 2,
      title: "Story Transfert Afrique",
      visual: (
        <div className="bg-gradient-to-b from-green-600 via-green-700 to-green-800 w-64 h-96 mx-auto rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <div className="font-bold text-sm">TEREX</div>
                <div className="text-xs opacity-80">Teranga Exchange</div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col justify-center text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h2 className="text-xl font-bold mb-2">
                Envoyez de l'argent
              </h2>
              <h3 className="text-lg font-semibold mb-6">
                vers l'Afrique
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">🇸🇳</span>
                  <span className="text-sm">Sénégal</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">🇲🇱</span>
                  <span className="text-sm">Mali</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">🇨🇮</span>
                  <span className="text-sm">Côte d'Ivoire</span>
                </div>
              </div>

              <div className="bg-white/20 rounded-xl p-3 mb-4">
                <div className="text-sm">Transfert en</div>
                <div className="text-lg font-bold">5 minutes</div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-black/30 rounded-2xl p-4 text-center">
              <div className="font-bold text-sm mb-1">Commencez</div>
              <div className="text-xs">terex.lovable.app</div>
              <div className="text-2xl mt-1">👆</div>
            </div>
          </div>
        </div>
      ),
      copy: "🌍 ENVOYEZ DE L'ARGENT VERS L'AFRIQUE\n\n⚡ En 5 minutes\n📱 Mobile Money\n🔒 Sécurisé\n\n5 pays disponibles !\n\nSwipe up ! 👆\n\n#TransfertAfrique #MobileMoney"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Texte copié !",
      description: "Le texte de story a été copié.",
    });
  };

  const downloadStory = (storyId: number) => {
    toast({
      title: "Téléchargement simulé",
      description: `La story ${storyId} serait téléchargée en format 1080x1920.`,
    });
  };

  return (
    <div className="space-y-6">
      {stories.map((story) => (
        <Card key={story.id} className="bg-terex-gray/20 border-terex-gray/30">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Aperçu story */}
              <div>
                <h3 className="text-white font-semibold mb-3">{story.title}</h3>
                <div className="flex justify-center">
                  {story.visual}
                </div>
                <div className="flex space-x-2 mt-4 justify-center">
                  <Button 
                    size="sm" 
                    onClick={() => downloadStory(story.id)}
                    className="bg-terex-accent text-black hover:bg-terex-accent/80"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger 1080x1920
                  </Button>
                </div>
              </div>
              
              {/* Texte et instructions */}
              <div>
                <h4 className="text-white font-semibold mb-3">Texte pour story</h4>
                <div className="bg-terex-darker/50 border border-terex-gray/30 rounded-lg p-4 mb-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                    {story.copy}
                  </pre>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(story.copy)}
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 mb-4"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le texte
                </Button>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Instructions :</h5>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Publiez aux heures de pointe (19h-21h)</li>
                    <li>• Ajoutez un lien "Swipe up" vers votre site</li>
                    <li>• Utilisez les autocollants Instagram</li>
                    <li>• Tagguez des comptes pertinents</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
