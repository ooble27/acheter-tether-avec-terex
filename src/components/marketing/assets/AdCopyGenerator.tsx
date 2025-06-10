
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function AdCopyGenerator() {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [selectedService, setSelectedService] = useState('usdt');

  const adCopies = {
    facebook: {
      usdt: [
        {
          title: "Post Conversion USDT - Accrocheur",
          copy: "🚀 ÉCHANGEZ VOS USDT EN 3 MINUTES CHRONO !\n\n💰 Vous avez des USDT et vous voulez de l'argent liquide ?\n✅ Terex vous propose :\n• Taux compétitifs sans commission cachée\n• Transactions 100% sécurisées\n• Support en français 24/7\n• Interface simple et intuitive\n\n⚡ Plus de 500 clients nous font confiance !\n\n👉 Inscription gratuite sur terex.lovable.app\n\n#USDT #Crypto #TerexExchange #EchangeCrypto #Bitcoin"
        },
        {
          title: "Post Conversion USDT - Testimonial",
          copy: "⭐⭐⭐⭐⭐ \"Terex a changé ma façon de gérer mes cryptos !\"\n\n💬 \"J'ai vendu 1000 USDT en moins de 5 minutes. Service impeccable, support réactif, je recommande !\" - Amadou D., Dakar\n\n🔥 Pourquoi choisir Terex ?\n✅ 0% de commission sur les échanges\n✅ Vérification KYC rapide (24h)\n✅ Paiements instantanés\n✅ Plateforme réglementée\n\n💰 Votre première transaction vous attend !\n\n👉 Commencez maintenant : terex.lovable.app\n\n#TémoignageClient #USDT #Satisfaction #TerexExchange"
        }
      ],
      transfer: [
        {
          title: "Post Transfert Afrique - Émotionnel",
          copy: "❤️ VOTRE FAMILLE VOUS ATTEND...\n\n🌍 Envoyez de l'argent vers l'Afrique en 5 minutes !\n\n📱 Avec Terex, vos proches reçoivent instantanément sur :\n• Orange Money (Sénégal, Mali, Côte d'Ivoire)\n• Wave (Sénégal)\n• MTN Mobile Money\n• Free Money\n\n💝 \"Maman a reçu l'argent en 3 minutes. Merci Terex !\" - Fatou B.\n\n✨ Frais transparents, pas de surprise\n✨ Suivi en temps réel\n✨ Support multilingue\n\n👉 Premier transfert : terex.lovable.app\n\n#TransfertAfrique #Famille #MobileMoney #Diaspora"
        }
      ]
    },
    instagram: {
      usdt: [
        {
          title: "Post Instagram USDT - Visuel",
          copy: "💰 ÉCHANGE USDT INSTANTANÉ\n\n⚡ 3 minutes chrono\n🔒 100% sécurisé\n💸 0% commission\n📞 Support 24/7\n\n👆 Swipe pour voir comment ça marche !\n\n#USDT #crypto #terex #echange #instantané #sécurisé #bitcoin #blockchain"
        }
      ],
      transfer: [
        {
          title: "Post Instagram Transfert",
          copy: "🌍 TRANSFERTS VERS L'AFRIQUE\n\n📱 Mobile Money intégré\n⚡ 5 minutes maximum\n💝 Votre famille en premier\n\n🇸🇳🇲🇱🇨🇮 5 pays disponibles\n\n#transfertafrique #mobilemoney #famille #diaspora #orangemoney #wave #terex"
        }
      ]
    },
    youtube: {
      usdt: [
        {
          title: "Description YouTube - Tuto USDT",
          copy: "🎯 COMMENT ÉCHANGER SES USDT FACILEMENT ?\n\nDans cette vidéo, je vous montre étape par étape comment utiliser Terex pour échanger vos USDT en toute sécurité.\n\n⏰ SOMMAIRE :\n00:00 - Introduction\n01:30 - Inscription sur Terex\n03:15 - Vérification KYC\n05:00 - Premier échange USDT\n07:20 - Conseils de sécurité\n\n🔗 LIENS UTILES :\n• Site Terex : https://terex.lovable.app\n• Guide complet : [lien]\n• Support client : [contact]\n\n✅ AVANTAGES TEREX :\n• Commission 0%\n• Transactions sécurisées\n• Support français 24/7\n• Interface intuitive\n\n💰 Code promo première transaction : YOUTUBE2024\n\n👍 Si cette vidéo vous a aidé, n'oubliez pas de liker et vous abonner !\n\n#USDT #Crypto #Terex #Tutoriel #Échange #Bitcoin"
        }
      ]
    },
    google: {
      usdt: [
        {
          title: "Google Ads - USDT Court",
          copy: "Échangez vos USDT en 3 minutes !\n0% commission • 100% sécurisé\nInscription gratuite sur Terex"
        },
        {
          title: "Google Ads - USDT Détaillé",
          copy: "Vendez vos USDT au meilleur taux\nPlateforme réglementée • Support 24/7\nTransactions instantanées • KYC rapide\nCommencez maintenant avec Terex"
        }
      ],
      transfer: [
        {
          title: "Google Ads - Transfert Court",
          copy: "Transferts vers l'Afrique en 5 min\nMobile Money • Frais transparents\nEssayez Terex maintenant"
        }
      ]
    }
  };

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'youtube', name: 'YouTube', icon: '🎥' },
    { id: 'google', name: 'Google Ads', icon: '🔍' }
  ];

  const services = [
    { id: 'usdt', name: 'Échange USDT', icon: '💰' },
    { id: 'transfer', name: 'Transfert Afrique', icon: '🌍' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Texte copié !",
      description: "Le texte publicitaire a été copié dans votre presse-papiers.",
    });
  };

  const currentCopies = adCopies[selectedPlatform]?.[selectedService] || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">Générateur de textes publicitaires</h3>
        <p className="text-gray-400 text-sm">
          Textes optimisés pour chaque plateforme et service
        </p>
      </div>

      {/* Sélecteurs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-terex-gray/20 border-terex-gray/30">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-3">Plateforme</h4>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.id ? "default" : "ghost"}
                  size="sm"
                  className={`${
                    selectedPlatform === platform.id 
                      ? 'bg-terex-accent text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  {platform.icon} {platform.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-gray/20 border-terex-gray/30">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-3">Service</h4>
            <div className="space-y-2">
              {services.map((service) => (
                <Button
                  key={service.id}
                  variant={selectedService === service.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    selectedService === service.id 
                      ? 'bg-terex-accent text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  {service.icon} {service.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Textes générés */}
      <div className="space-y-4">
        {currentCopies.length > 0 ? (
          currentCopies.map((ad, index) => (
            <Card key={index} className="bg-terex-gray/20 border-terex-gray/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-white font-semibold">{ad.title}</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(ad.copy)}
                    className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                </div>
                
                <div className="bg-terex-darker/50 border border-terex-gray/30 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                    {ad.copy}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-terex-gray/20 border-terex-gray/30">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">
                Aucun contenu disponible pour cette combinaison plateforme/service.
              </p>
              <Button 
                className="mt-4 bg-terex-accent text-black hover:bg-terex-accent/80"
                onClick={() => {
                  setSelectedPlatform('facebook');
                  setSelectedService('usdt');
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Conseils par plateforme */}
      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-2">
            Conseils pour {platforms.find(p => p.id === selectedPlatform)?.name} :
          </h4>
          <div className="text-gray-300 text-sm">
            {selectedPlatform === 'facebook' && (
              <ul className="space-y-1">
                <li>• Postez entre 19h et 21h pour plus d'engagement</li>
                <li>• Utilisez 3-5 hashtags maximum</li>
                <li>• Incluez toujours un call-to-action clair</li>
                <li>• Répondez rapidement aux commentaires</li>
              </ul>
            )}
            {selectedPlatform === 'instagram' && (
              <ul className="space-y-1">
                <li>• Utilisez 5-10 hashtags pertinents</li>
                <li>• Publiez des stories quotidiennement</li>
                <li>• Créez du contenu visuel attractif</li>
                <li>• Collaborez avec des influenceurs</li>
              </ul>
            )}
            {selectedPlatform === 'youtube' && (
              <ul className="space-y-1">
                <li>• Optimisez vos titres avec des mots-clés</li>
                <li>• Créez des miniatures accrocheuses</li>
                <li>• Ajoutez des sous-titres</li>
                <li>• Incluez toujours une description détaillée</li>
              </ul>
            )}
            {selectedPlatform === 'google' && (
              <ul className="space-y-1">
                <li>• Utilisez des mots-clés spécifiques</li>
                <li>• Testez différentes versions d'annonces</li>
                <li>• Incluez des extensions d'annonce</li>
                <li>• Optimisez pour mobile</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
