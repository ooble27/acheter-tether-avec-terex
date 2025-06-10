
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SocialMediaPost() {
  const { toast } = useToast();

  const posts = [
    {
      id: 1,
      title: "Post Conversion USDT",
      visual: (
        <div className="bg-gradient-to-br from-terex-accent to-terex-accent/80 p-6 rounded-xl text-black">
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="font-bold text-xl">TEREX</h3>
              <p className="text-sm opacity-80">Teranga Exchange</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            Échangez vos USDT en 3 minutes ⚡
          </h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>💰 Meilleurs taux</span>
              <span className="font-bold">0% commission</span>
            </div>
            <div className="flex justify-between">
              <span>🔒 100% sécurisé</span>
              <span className="font-bold">KYC rapide</span>
            </div>
            <div className="flex justify-between">
              <span>📱 Interface simple</span>
              <span className="font-bold">Support 24/7</span>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <p className="font-bold">Commencez maintenant !</p>
            <p className="text-sm">terex.lovable.app</p>
          </div>
        </div>
      ),
      copy: "🚀 Échangez vos USDT facilement avec Terex !\n\n💰 Taux compétitifs sans commission\n🔒 Plateforme 100% sécurisée\n⚡ Transactions en 3 minutes\n📞 Support en français 24/7\n\nRejoignez des milliers d'utilisateurs qui nous font confiance !\n\n👉 Inscription gratuite sur terex.lovable.app\n\n#USDT #Crypto #TerexExchange #AfriqueNumérique"
    },
    {
      id: 2,
      title: "Post Transferts Afrique",
      visual: (
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl text-white">
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="font-bold text-xl">TEREX</h3>
              <p className="text-sm opacity-80">Teranga Exchange</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            Transferts vers l'Afrique 🌍
          </h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇸🇳</span>
              <span>Sénégal - Orange Money, Wave</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇲🇱</span>
              <span>Mali - Orange Money, Moov</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇨🇮</span>
              <span>Côte d'Ivoire - MTN, Orange</span>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="font-bold">Envoyez de l'argent maintenant</p>
            <p className="text-sm">Rapide • Sécurisé • Fiable</p>
          </div>
        </div>
      ),
      copy: "💸 Envoyez de l'argent vers l'Afrique en quelques clics !\n\n🌍 5 pays couverts\n📱 Mobile Money intégré\n⚡ Transferts instantanés\n🔒 Transactions sécurisées\n💰 Frais transparents\n\nVotre famille reçoit l'argent en moins de 5 minutes !\n\n👉 Essayez maintenant : terex.lovable.app\n\n#TransfertAfrique #MobileMoney #Diaspora #EnvoiArgent"
    },
    {
      id: 3,
      title: "Post Témoignage Client",
      visual: (
        <div className="bg-terex-darker p-6 rounded-xl border border-terex-accent/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-terex-accent/20 rounded-full flex items-center justify-center">
              <span className="text-terex-accent font-bold">AD</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">Amadou Diallo</h4>
              <p className="text-gray-400 text-sm">Dakar, Sénégal</p>
            </div>
          </div>
          
          <div className="text-terex-accent text-6xl mb-2">"</div>
          <p className="text-white text-lg mb-4 italic">
            Terex a révolutionné mes transferts d'argent. En 5 minutes, j'ai pu envoyer de l'argent à ma famille au Canada. Service exceptionnel !
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <div className="text-right">
              <div className="text-terex-accent font-bold">TEREX</div>
              <div className="text-gray-400 text-sm">Teranga Exchange</div>
            </div>
          </div>
        </div>
      ),
      copy: "⭐⭐⭐⭐⭐ Témoignage client\n\n\"Terex a révolutionné mes transferts d'argent. En 5 minutes, j'ai pu envoyer de l'argent à ma famille au Canada. Service exceptionnel !\" - Amadou D.\n\nRejoignez des milliers de clients satisfaits !\n\n✅ Transactions rapides\n✅ Support réactif\n✅ Taux compétitifs\n✅ Interface intuitive\n\n👉 Votre première transaction : terex.lovable.app\n\n#TémoignageClient #Terex #Satisfaction"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Texte copié !",
      description: "Le texte publicitaire a été copié dans votre presse-papiers.",
    });
  };

  const downloadImage = (postId: number) => {
    toast({
      title: "Téléchargement simulé",
      description: `Le visuel ${postId} serait téléchargé en haute résolution.`,
    });
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-terex-gray/20 border-terex-gray/30">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Aperçu visuel */}
              <div>
                <h3 className="text-white font-semibold mb-3">{post.title}</h3>
                <div className="max-w-sm mx-auto">
                  {post.visual}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => downloadImage(post.id)}
                    className="bg-terex-accent text-black hover:bg-terex-accent/80"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
              
              {/* Texte publicitaire */}
              <div>
                <h4 className="text-white font-semibold mb-3">Texte pour publication</h4>
                <div className="bg-terex-darker/50 border border-terex-gray/30 rounded-lg p-4 mb-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                    {post.copy}
                  </pre>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(post.copy)}
                  className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le texte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
