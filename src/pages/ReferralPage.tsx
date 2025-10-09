import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, Copy, Share2, ArrowLeft, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReferralPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Génération d'un code de parrainage basé sur l'ID utilisateur
  const referralCode = user?.id ? `TEREX-${user.id.slice(0, 8).toUpperCase()}` : 'TEREX-XXXXX';
  const referralLink = `https://app.terangaexchange.com/auth?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: "Code copié !",
      description: "Votre code de parrainage a été copié",
      className: "bg-green-600 text-white",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Lien copié !",
      description: "Votre lien de parrainage a été copié",
      className: "bg-green-600 text-white",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoignez Terex',
          text: `Utilisez mon code de parrainage ${referralCode} pour rejoindre Terex et profiter d'avantages exclusifs !`,
          url: referralLink
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark px-0 md:p-6 lg:p-8 py-3">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 px-4 md:px-0">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="sm"
            className="border-terex-gray text-white hover:bg-terex-gray/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-1">Programme de Parrainage</h1>
            <p className="text-sm text-gray-400 font-light">Invitez vos amis et gagnez ensemble</p>
          </div>
        </div>

        {/* Code de parrainage */}
        <Card className="bg-gradient-to-br from-terex-accent/10 to-terex-darker border-terex-accent/20">
          <CardHeader>
            <CardTitle className="text-white font-light flex items-center gap-2">
              <Gift className="w-5 h-5 text-terex-accent" />
              Votre code de parrainage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-terex-darker rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm mb-2 font-light">Votre code unique</p>
              <div className="text-3xl font-light text-terex-accent mb-4 tracking-wider">
                {referralCode}
              </div>
              <Button
                onClick={handleCopyCode}
                className="bg-terex-accent hover:bg-terex-accent/90 text-black"
              >
                {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copié !' : 'Copier le code'}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-light">Lien de parrainage</p>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="bg-terex-dark border-terex-gray text-white text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="border-terex-gray text-white hover:bg-terex-gray/20"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-black"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager mon code
            </Button>
          </CardContent>
        </Card>

        {/* Avantages */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white font-light flex items-center gap-2">
              <Award className="w-5 h-5 text-terex-accent" />
              Vos avantages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-terex-dark rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-light mb-1">Pour vous</p>
                <p className="text-terex-accent text-lg font-light">5% de bonus</p>
                <p className="text-gray-400 text-xs font-light">Sur chaque transaction</p>
              </div>

              <div className="bg-terex-dark rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-light mb-1">Pour votre filleul</p>
                <p className="text-terex-accent text-lg font-light">3% de bonus</p>
                <p className="text-gray-400 text-xs font-light">Sur sa première transaction</p>
              </div>

              <div className="bg-terex-dark rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-light mb-1">Illimité</p>
                <p className="text-terex-accent text-lg font-light">Sans limite</p>
                <p className="text-gray-400 text-xs font-light">Parrainez autant que vous voulez</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comment ça marche */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white font-light">Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 text-black font-light">
                  1
                </div>
                <div>
                  <p className="text-white font-light">Partagez votre code</p>
                  <p className="text-gray-400 text-sm font-light">
                    Envoyez votre code de parrainage à vos amis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 text-black font-light">
                  2
                </div>
                <div>
                  <p className="text-white font-light">Inscription</p>
                  <p className="text-gray-400 text-sm font-light">
                    Votre ami s'inscrit avec votre code
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center flex-shrink-0 text-black font-light">
                  3
                </div>
                <div>
                  <p className="text-white font-light">Gagnez ensemble</p>
                  <p className="text-gray-400 text-sm font-light">
                    Vous recevez tous les deux des bonus sur vos transactions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white font-light">Vos parrainages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-terex-dark rounded-lg p-4">
                <p className="text-gray-400 text-sm font-light mb-2">Filleuls actifs</p>
                <p className="text-3xl font-light text-white">0</p>
              </div>
              <div className="bg-terex-dark rounded-lg p-4">
                <p className="text-gray-400 text-sm font-light mb-2">Bonus gagnés</p>
                <p className="text-3xl font-light text-terex-accent">0 CFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
