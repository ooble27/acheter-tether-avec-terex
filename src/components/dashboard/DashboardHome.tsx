
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Zap, 
  Globe, 
  ArrowUpRight, 
  Activity,
  Handshake,
  Clock,
  Users,
  Star,
  Trophy,
  Target,
  Shield,
  Blocks,
  CheckCircle,
  Anchor,
  TrendingDown
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useEffect } from 'react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const TetherLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="Tether Logo"
    className={className}
  />
);

export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const isMobile = useIsMobile();

  // Vérifier si on est en mode PWA (standalone)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  // Force le scroll en haut quand le composant se monte (spécialement pour PWA mobile)
  useEffect(() => {
    if (isPWA && isMobile) {
      // Scroll immédiat et forcé pour PWA mobile
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Double vérification après un petit délai
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isPWA, isMobile]);

  const handleServiceClick = (service: string) => {
    if (onNavigate) {
      onNavigate(service);
    }
  };

  if (isMobile) {
    // Design mobile avec px-0 pour tous les conteneurs
    return (
      <div className="min-h-screen bg-terex-dark px-0 py-3 space-y-3 text-xs overflow-y-auto scrollbar-hide">
        {/* Header avec px-0 et alignement avec le bouton hamburger */}
        <div className="flex items-center space-x-3 mb-6 px-0 pt-4 mt-safe">
          <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Bienvenue, <span className="text-terex-accent">{user?.name}</span>
            </h1>
            <p className="text-gray-400 text-base">Plateforme USDT</p>
          </div>
        </div>

        {/* Services Grid - 2x2 avec px-0 */}
        <div className="grid grid-cols-2 gap-3 mb-4 px-0">
          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('buy')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TetherLogo className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Acheter USDT</h3>
              <p className="text-gray-400 text-xs">Achat rapide</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('sell')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TetherLogo className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Vendre USDT</h3>
              <p className="text-gray-400 text-xs">Vente rapide</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('otc')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Handshake className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Trading OTC</h3>
              <p className="text-gray-400 text-xs">Gros volumes</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('transfer')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-terex-accent" />
                </div>
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Virements</h3>
              <p className="text-gray-400 text-xs">International</p>
            </CardContent>
          </Card>
        </div>

        {/* Section Historique des transactions récentes - px-0 */}
        <div className="px-0">
          <RecentTransactions onNavigate={onNavigate} />
        </div>

        {/* Avantages Terex - px-0 */}
        <Card className="bg-terex-darker border-terex-gray mb-3 mx-0">
          <CardContent className="p-3">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2 text-terex-accent" />
              Avantages Terex
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-terex-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-3 h-3 text-terex-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Frais gratuits</p>
                  <p className="text-gray-400 text-xs">0% de frais</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Rapide</p>
                  <p className="text-gray-400 text-xs">Instantané</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3 h-3 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">24/7</p>
                  <p className="text-gray-400 text-xs">Toujours disponible</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section USDT - px-0 */}
        <Card className="bg-terex-darker border-terex-gray mb-3 mx-0">
          <CardContent className="p-3">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center">
              <TetherLogo className="w-4 h-4 mr-2" />
              Pourquoi Tether ?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Anchor className="w-3 h-3 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Stabilité</p>
                  <p className="text-gray-400 text-xs">Adossé au dollar</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-3 h-3 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Mondial</p>
                  <p className="text-gray-400 text-xs">Accepté partout</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Sécurité et Confiance - px-0 */}
        <Card className="bg-terex-darker border-terex-gray mx-0">
          <CardContent className="p-3">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-400" />
              Sécurité & Confiance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3 h-3 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Sécurisé</p>
                  <p className="text-gray-400 text-xs">Cryptage SSL</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Certifié</p>
                  <p className="text-gray-400 text-xs">Plateforme agréée</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-terex-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-3 h-3 text-terex-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Support</p>
                  <p className="text-gray-400 text-xs">Équipe dédiée</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Design desktop inchangé avec navigation ajoutée
  return (
    <div className="min-h-screen bg-terex-dark p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white">
              Bienvenue, <span className="text-terex-accent">{user?.name}</span>
            </h1>
            <p className="text-gray-400">Plateforme décentralisée pour vos transactions USDT</p>
          </div>
        </div>
      </div>

      {/* Services rapides avec navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card 
          className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer"
          onClick={() => handleServiceClick('buy')}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <TetherLogo className="w-8 h-8" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-terex-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <CardTitle className="text-white text-lg">Acheter USDT</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Achetez des USDT rapidement
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer"
          onClick={() => handleServiceClick('sell')}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                <TetherLogo className="w-8 h-8" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-terex-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <CardTitle className="text-white text-lg">Vendre USDT</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Convertissez en francs CFA
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer"
          onClick={() => handleServiceClick('otc')}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Handshake className="w-6 h-6 text-purple-400" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-terex-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <CardTitle className="text-white text-lg">Trading OTC</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Gros volumes & négociation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer"
          onClick={() => handleServiceClick('transfer')}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center group-hover:bg-terex-accent/30 transition-colors">
                <Globe className="w-6 h-6 text-terex-accent" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-terex-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <CardTitle className="text-white text-lg">Virements</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Transferts internationaux gratuits
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Avantages Terex */}
      <Card className="bg-terex-darker border-terex-gray mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
            Avantages Terex
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-terex-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium">Frais gratuits</h3>
                <p className="text-gray-400 text-sm">0% de frais sur les virements</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Transactions rapides</h3>
                <p className="text-gray-400 text-sm">Traitement instantané</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Service 24/7</h3>
                <p className="text-gray-400 text-sm">Support disponible 24h/24</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section USDT - Pourquoi nous ne supportons que Tether */}
      <Card className="bg-terex-darker border-terex-gray mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center text-lg md:text-xl">
            <TetherLogo className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Pourquoi nous ne supportons que Tether ?
          </CardTitle>
          <CardDescription className="text-gray-400">
            Terex se concentre exclusivement sur le Tether (USDT) pour offrir la meilleure expérience possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <Anchor className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Stabilité garantie</h3>
                  <p className="text-gray-400 text-sm">Tether est adossé au dollar américain (1:1), offrant une stabilité incomparable face à la volatilité du marché crypto</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Acceptation mondiale</h3>
                  <p className="text-gray-400 text-sm">L'USDT est la cryptomonnaie stable la plus utilisée au monde, acceptée sur toutes les plateformes d'échange</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-terex-accent" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Simplicité d'usage</h3>
                  <p className="text-gray-400 text-sm">Pas besoin de suivre plusieurs cryptomonnaies, Tether seul pour tous vos besoins</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Transferts rapides</h3>
                  <p className="text-gray-400 text-sm">Les transactions Tether sont rapides et peu coûteuses, parfaites pour les virements internationaux</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Blockchain & Sécurité */}
      <Card className="bg-terex-darker border-terex-gray mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center text-lg md:text-xl">
            <Blocks className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
            Blockchain & Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-terex-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Sécurité renforcée</h3>
                <p className="text-gray-400 text-sm">Protection blockchain avancée pour toutes vos transactions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Réseau décentralisé</h3>
                <p className="text-gray-400 text-sm">Infrastructure distribuée pour plus de fiabilité</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Transparence totale</h3>
                <p className="text-gray-400 text-sm">Toutes les transactions sont vérifiables sur la blockchain</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section pourquoi choisir Terex */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white text-xl text-center">Pourquoi choisir Terex ?</CardTitle>
          <p className="text-gray-400 text-center">La plateforme de confiance pour vos transactions USDT</p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:items-start">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-terex-accent" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Économies garanties</h3>
                  <p className="text-gray-400 text-sm">Frais de transaction réduits et transferts internationaux gratuits</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Rapidité optimale</h3>
                  <p className="text-gray-400 text-sm">Transactions instantanées et confirmations rapides</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Disponibilité continue</h3>
                  <p className="text-gray-400 text-sm">Service client et plateforme accessibles 24h/24, 7j/7</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Communauté active</h3>
                  <p className="text-gray-400 text-sm">Rejoignez des milliers d'utilisateurs satisfaits</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
