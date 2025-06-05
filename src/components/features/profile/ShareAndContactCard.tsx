
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShareAndContactCard() {
  const { toast } = useToast();

  const handleWhatsAppClick = () => {
    const phoneNumber = '+14182619091';
    const message = 'Bonjour, je souhaiterais obtenir plus d\'informations sur Terex.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareTerex = async () => {
    const shareData = {
      title: 'Terex - Plateforme de change et transfert',
      text: 'Découvrez Terex - La plateforme de change et de transfert d\'argent',
      url: window.location.origin
    };

    try {
      // Vérifier si l'API Web Share est supportée
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback : copier le lien
        const textToShare = `${shareData.text} - ${shareData.url}`;
        await navigator.clipboard.writeText(textToShare);
        toast({
          title: "Lien copié !",
          description: "Le lien Terex a été copié dans le presse-papiers",
          className: "bg-green-600 text-white border-green-600",
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      // Fallback final : copier le lien
      try {
        const textToShare = `${shareData.text} - ${shareData.url}`;
        await navigator.clipboard.writeText(textToShare);
        toast({
          title: "Lien copié !",
          description: "Le lien Terex a été copié dans le presse-papiers",
          className: "bg-green-600 text-white border-green-600",
        });
      } catch (clipboardError) {
        toast({
          title: "Erreur",
          description: "Impossible de partager ou copier le lien",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white">Partager Terex</CardTitle>
        <CardDescription className="text-gray-400">
          Partagez Terex avec vos proches et contactez-nous
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button 
            onClick={handleShareTerex}
            variant="outline"
            className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager Terex
          </Button>
          
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Nous rejoindre sur WhatsApp
          </Button>
        </div>
        
        <div className="text-center text-sm text-gray-400 mt-4">
          <p>Partagez Terex avec vos proches et découvrez tous nos services</p>
        </div>
      </CardContent>
    </Card>
  );
}
