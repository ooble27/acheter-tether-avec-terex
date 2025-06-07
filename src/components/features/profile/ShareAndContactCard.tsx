
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, ExternalLink, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShareAndContactCard() {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Terex Exchange',
        text: 'Découvrez Terex Exchange - La plateforme de référence pour acheter et vendre des cryptomonnaies en Afrique !',
        url: 'https://app.terangaexchange.com'
      });
    } else {
      navigator.clipboard.writeText('https://app.terangaexchange.com');
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans votre presse-papiers",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Partagez Terex Exchange
          </CardTitle>
          <CardDescription className="text-gray-400">
            Invitez vos amis à découvrir notre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleShare}
            className="bg-terex-accent hover:bg-terex-accent/80 w-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager l'application
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white">Contactez-nous</CardTitle>
          <CardDescription className="text-gray-400">
            Notre équipe est là pour vous aider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <a
              href="mailto:terangaexchange@gmail.com"
              className="flex items-center space-x-3 p-3 rounded-lg bg-terex-gray hover:bg-terex-gray/80 transition-colors"
            >
              <Mail className="w-5 h-5 text-terex-accent" />
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-gray-400 text-sm">terangaexchange@gmail.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>

            <a
              href="tel:+221234567890"
              className="flex items-center space-x-3 p-3 rounded-lg bg-terex-gray hover:bg-terex-gray/80 transition-colors"
            >
              <Phone className="w-5 h-5 text-terex-accent" />
              <div>
                <p className="text-white font-medium">Téléphone</p>
                <p className="text-gray-400 text-sm">+221 23 456 78 90</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>

            <a
              href="https://wa.me/221234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 rounded-lg bg-terex-gray hover:bg-terex-gray/80 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-terex-accent" />
              <div>
                <p className="text-white font-medium">WhatsApp</p>
                <p className="text-gray-400 text-sm">Support client 24/7</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
          </div>

          <div className="pt-4 border-t border-terex-gray">
            <h4 className="text-white font-medium mb-2">Heures d'ouverture</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Lundi - Vendredi: 8h00 - 20h00</p>
              <p>Samedi: 9h00 - 18h00</p>
              <p>Dimanche: 10h00 - 16h00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
