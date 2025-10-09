import { Card, CardContent } from '@/components/ui/card';
import { 
  Globe, 
  ArrowUpRight, 
  Activity,
  Handshake,
  TrendingUp
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
        {/* Header avec px-0 */}
        <div className="flex items-center space-x-3 mb-6 px-0">
          <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-1">
              Bienvenue, <span className="text-terex-accent">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm text-gray-400 font-light">Plateforme USDT</p>
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
              <h3 className="text-white text-sm font-light mb-1">Acheter USDT</h3>
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
              <h3 className="text-white text-sm font-light mb-1">Vendre USDT</h3>
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
              <h3 className="text-white text-sm font-light mb-1">Trading OTC</h3>
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
              <h3 className="text-white text-sm font-light mb-1">Virements</h3>
              <p className="text-gray-400 text-xs">International</p>
            </CardContent>
          </Card>
        </div>

        {/* Section Historique des transactions récentes - px-0 */}
        <div className="px-0">
          <RecentTransactions onNavigate={onNavigate} />
        </div>

      </div>
    );
  }

  // Design desktop centré comme mobile
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Section */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-white">
              Bienvenue, <span className="text-terex-accent">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400 text-sm">Plateforme USDT</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('buy')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TetherLogo className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-terex-accent" />
              </div>
              <h3 className="text-white font-light mb-1">Acheter USDT</h3>
              <p className="text-gray-400 text-sm">Achat rapide</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('sell')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TetherLogo className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-terex-accent" />
              </div>
              <h3 className="text-white font-light mb-1">Vendre USDT</h3>
              <p className="text-gray-400 text-sm">Vente rapide</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('otc')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-purple-400" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-terex-accent" />
              </div>
              <h3 className="text-white font-light mb-1">Trading OTC</h3>
              <p className="text-gray-400 text-sm">Gros volumes</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer"
            onClick={() => handleServiceClick('transfer')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-terex-accent" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-terex-accent" />
              </div>
              <h3 className="text-white font-light mb-1">Virements</h3>
              <p className="text-gray-400 text-sm">International</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions onNavigate={onNavigate} />
      </div>
    </div>
  );
}
