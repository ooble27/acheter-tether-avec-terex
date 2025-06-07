
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Zap, 
  Globe, 
  ArrowUpRight, 
  Activity,
  DollarSign,
  Handshake,
  Clock,
  Users,
  Star,
  Trophy,
  Target
} from 'lucide-react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
}

const TetherLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="Tether Logo"
    className={className}
  />
);

export function DashboardHome({ user }: DashboardHomeProps) {
  return (
    <div className="min-h-screen bg-terex-dark p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Bienvenue, <span className="text-terex-accent">{user?.name}</span>
            </h1>
            <p className="text-gray-400">Plateforme décentralisée pour vos transactions USDT</p>
          </div>
        </div>
      </div>

      {/* Services rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer">
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

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
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

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer">
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

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors group cursor-pointer">
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
            <Trophy className="w-5 h-5 mr-2 text-terex-accent" />
            Avantages Terex
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-terex-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium">Frais gratuits</h3>
                <p className="text-gray-400 text-sm">0% de frais sur les virements</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Transactions rapides</h3>
                <p className="text-gray-400 text-sm">Traitement instantané</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Service 24/7</h3>
                <p className="text-gray-400 text-sm">Support disponible 24h/24</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nouvelle section - Statistiques plateforme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-terex-accent" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Utilisateurs actifs</CardTitle>
                <p className="text-gray-400 text-sm">Communauté grandissante</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-terex-accent mb-2">12,847+</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Volume traité</CardTitle>
                <p className="text-gray-400 text-sm">Dernières 24h</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 mb-2">$2.8M+</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.5% aujourd'hui
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Transactions</CardTitle>
                <p className="text-gray-400 text-sm">Réussies aujourd'hui</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400 mb-2">94,523</div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              99.9% succès
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section pourquoi choisir Terex */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white text-xl text-center">Pourquoi choisir Terex ?</CardTitle>
          <p className="text-gray-400 text-center">La plateforme de confiance pour vos transactions USDT</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center mt-1">
                  <DollarSign className="w-4 h-4 text-terex-accent" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Économies garanties</h3>
                  <p className="text-gray-400 text-sm">Frais de transaction réduits et transferts internationaux gratuits</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Rapidité optimale</h3>
                  <p className="text-gray-400 text-sm">Transactions instantanées et confirmations rapides</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Disponibilité continue</h3>
                  <p className="text-gray-400 text-sm">Service client et plateforme accessibles 24h/24, 7j/7</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-purple-400" />
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
