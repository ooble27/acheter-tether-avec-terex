import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  Link2,
  Facebook,
  Twitter,
  Linkedin,
  Download,
  QrCode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SharePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const appUrl = 'https://app.terangaexchange.com';
  const shareMessage = "Découvrez Terex - La plateforme pour acheter et vendre des USDT en Afrique de l'Ouest facilement et en toute sécurité !";

  const handleShare = async (platform?: string) => {
    if (!platform && navigator.share) {
      try {
        await navigator.share({
          title: 'Terex - Plateforme USDT',
          text: shareMessage,
          url: appUrl
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans le presse-papier",
      className: "bg-green-600 text-white",
    });
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(appUrl);
    const encodedMessage = encodeURIComponent(shareMessage);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Découvrez Terex')}&body=${encodedMessage}%20${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="sm"
            className="border-terex-gray text-white hover:bg-terex-gray/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-1">Partager Terex</h1>
            <p className="text-sm text-gray-400 font-light">Faites découvrir Terex à vos proches</p>
          </div>
        </div>

        {/* Partage rapide */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white font-light flex items-center gap-2">
              <Share2 className="w-5 h-5 text-terex-accent" />
              Partage rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button
                onClick={() => handleSocialShare('whatsapp')}
                className="bg-green-600 hover:bg-green-700 text-white justify-start"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              <Button
                onClick={() => handleSocialShare('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>

              <Button
                onClick={() => handleSocialShare('twitter')}
                className="bg-sky-500 hover:bg-sky-600 text-white justify-start"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>

              <Button
                onClick={() => handleSocialShare('linkedin')}
                className="bg-blue-700 hover:bg-blue-800 text-white justify-start"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>

              <Button
                onClick={() => handleSocialShare('email')}
                className="bg-gray-600 hover:bg-gray-700 text-white justify-start"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>

              <Button
                onClick={handleCopyLink}
                className="bg-terex-accent hover:bg-terex-accent/90 text-black justify-start"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Copier lien
              </Button>
            </div>

            {navigator.share && (
              <Button
                onClick={() => handleShare()}
                variant="outline"
                className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-black"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Plus d'options de partage
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Message de partage */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white font-light">Message suggéré</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-terex-dark rounded-lg p-4 border border-terex-gray">
              <p className="text-gray-300 font-light text-sm">
                {shareMessage}
              </p>
              <p className="text-terex-accent text-sm mt-2 font-light">
                {appUrl}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pourquoi partager */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white font-light">Pourquoi partager Terex ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-white font-light">Aidez vos proches</p>
                  <p className="text-gray-400 text-sm font-light">
                    Permettez à votre entourage d'accéder facilement aux cryptomonnaies
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-white font-light">Faites grandir la communauté</p>
                  <p className="text-gray-400 text-sm font-light">
                    Plus nous sommes nombreux, plus Terex peut s'améliorer
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-white font-light">Simplifiez les transactions</p>
                  <p className="text-gray-400 text-sm font-light">
                    Facilitez les échanges USDT avec vos amis et famille
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-gradient-to-br from-terex-accent/10 to-terex-darker border-terex-accent/20">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-light">Rejoignez</p>
              <p className="text-4xl font-light text-terex-accent">10,000+</p>
              <p className="text-white font-light">Utilisateurs satisfaits</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
