
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShareAndContactCard() {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Terex - Échange crypto et transferts',
          text: 'Découvrez Terex pour vos échanges USDT et virements internationaux',
          url: 'https://terangaexchange.com'
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      navigator.clipboard.writeText('https://terangaexchange.com');
      toast({
        title: "Lien copié !",
        description: "Le lien de Terex a été copié dans le presse-papiers",
      });
    }
  };

  const handleEmailContact = () => {
    window.open('mailto:terangaexchange@gmail.com?subject=Contact Terex', '_blank');
  };

  const handlePhoneContact = () => {
    window.open('tel:+221773972749', '_blank');
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/14182619091', '_blank');
  };

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/30 rounded-t-xl">
        <CardTitle className="text-white flex items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center mr-3">
            <Share2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <div className="text-white">Partager & Contact</div>
            <CardDescription className="text-gray-400">
              Partagez Terex ou contactez notre équipe
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Partage */}
        <div className="p-4 bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-xl border border-terex-accent/20">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white text-sm px-2"
          >
            <Share2 className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Partager Terex</span>
          </Button>
        </div>
        
        {/* Contact */}
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm mb-3">Contactez notre équipe :</h4>
          
          <Button
            onClick={handleEmailContact}
            variant="outline"
            size="sm"
            className="w-full border-terex-gray/30 text-gray-300 hover:bg-terex-gray/30 justify-start min-w-0"
          >
            <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="flex-1 text-left truncate text-xs">terangaexchange@gmail.com</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </Button>
          
          <Button
            onClick={handlePhoneContact}
            variant="outline"
            size="sm"
            className="w-full border-terex-gray/30 text-gray-300 hover:bg-terex-gray/30 justify-start"
          >
            <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="flex-1 text-left">+1 4182619091</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </Button>
          
          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
            size="sm"
            className="w-full border-terex-gray/30 text-gray-300 hover:bg-terex-gray/30 justify-start"
          >
            <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="flex-1 text-left">WhatsApp Support</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </Button>
        </div>

        {/* Support disponible */}
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-green-400 text-sm text-center">
            💬 Support disponible 24h/7j
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
