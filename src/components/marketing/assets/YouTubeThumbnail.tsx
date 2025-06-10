
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function YouTubeThumbnail() {
  const { toast } = useToast();

  const thumbnails = [
    {
      id: 1,
      title: "Tuto USDT - Comment échanger",
      visual: (
        <div className="bg-gradient-to-r from-red-600 to-red-700 w-full h-48 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex items-center justify-between p-6">
            <div className="flex-1">
              <div className="bg-terex-accent text-black px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                TUTORIEL
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">
                Comment échanger vos USDT
              </h2>
              <p className="text-white/90 text-sm">
                Tuto complet en 5 minutes
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-12 h-12 rounded-lg"
              />
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
            5:23
          </div>
        </div>
      ),
      description: "Tutoriel complet pour échanger des USDT avec Terex"
    },
    {
      id: 2,
      title: "Transfert Afrique - Guide complet",
      visual: (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 w-full h-48 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex items-center justify-between p-6">
            <div className="flex-1">
              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                GUIDE 2024
              </div>
              <h2 className="text-white text-xl font-bold mb-2">
                Envoyer de l'argent vers l'Afrique
              </h2>
              <p className="text-white/90 text-sm">
                Mobile Money • Orange • Wave • MTN
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="text-4xl">🌍</div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
            8:15
          </div>
        </div>
      ),
      description: "Guide complet pour les transferts d'argent vers l'Afrique"
    },
    {
      id: 3,
      title: "Terex vs Concurrents - Comparaison",
      visual: (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-full h-48 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex items-center justify-between p-6">
            <div className="flex-1">
              <div className="bg-terex-accent text-black px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                COMPARAISON
              </div>
              <h2 className="text-white text-xl font-bold mb-2">
                Terex VS Autres plateformes
              </h2>
              <p className="text-white/90 text-sm">
                Frais • Rapidité • Sécurité
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl">⚔️</div>
              <div className="bg-terex-accent text-black px-2 py-1 rounded text-xs font-bold">
                TEREX GAGNE
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
            12:34
          </div>
        </div>
      ),
      description: "Comparaison détaillée avec les concurrents"
    }
  ];

  const downloadThumbnail = (thumbId: number) => {
    toast({
      title: "Téléchargement simulé",
      description: `La miniature ${thumbId} serait téléchargée en 1280x720.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">Miniatures YouTube</h3>
        <p className="text-gray-400 text-sm">
          Format 1280x720 px - Optimisées pour attirer les clics
        </p>
      </div>

      {thumbnails.map((thumbnail) => (
        <Card key={thumbnail.id} className="bg-terex-gray/20 border-terex-gray/30">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-3">{thumbnail.title}</h4>
                {thumbnail.visual}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{thumbnail.description}</p>
                <Button 
                  size="sm" 
                  onClick={() => downloadThumbnail(thumbnail.id)}
                  className="bg-terex-accent text-black hover:bg-terex-accent/80"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger 1280x720
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-2">Conseils pour YouTube :</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Utilisez des couleurs vives et contrastées</li>
            <li>• Ajoutez des émojis pour attirer l'attention</li>
            <li>• Mettez en avant le bénéfice principal</li>
            <li>• Incluez votre logo pour la reconnaissance</li>
            <li>• Testez différentes versions (A/B test)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
