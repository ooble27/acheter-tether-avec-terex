
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Mail, Phone, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShareAndContactCard() {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Terex - Échange crypto et transferts',
          text: 'Découvrez Terex pour vos échanges USDT et virements internationaux',
          url: 'https://app.terangaexchange.com'
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage
      navigator.clipboard.writeText('https://app.terangaexchange.com');
      toast({
        title: "Lien copié !",
        description: "Le lien de Terex a été copié dans le presse-papiers",
      });
    }
  };

  const handleEmailContact = () => {
    window.open('mailto:lomohamed834@gmail.com?subject=Contact Terex', '_blank');
  };

  const handlePhoneContact = () => {
    window.open('tel:+221773972749', '_blank');
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/14182619091', '_blank');
  };

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white">Partager & Contact</CardTitle>
        <CardDescription className="text-gray-400">
          Partagez Terex ou contactez notre équipe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager Terex
          </Button>
          
          <div className="space-y-2">
            <p className="text-white font-medium text-sm">Contactez-nous :</p>
            
            <Button
              onClick={handleEmailContact}
              variant="outline"
              size="sm"
              className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray text-xs"
            >
              <Mail className="w-3 h-3 mr-2" />
              lomohamed834@gmail.com
            </Button>
            
            <Button
              onClick={handlePhoneContact}
              variant="outline"
              size="sm"
              className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray text-xs"
            >
              <Phone className="w-3 h-3 mr-2" />
              +221 77 397 27 49
            </Button>
            
            <Button
              onClick={handleWhatsAppContact}
              variant="outline"
              size="sm"
              className="w-full border-terex-gray text-gray-300 hover:bg-terex-gray text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-2" />
              WhatsApp: +1 418 261 9091
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
