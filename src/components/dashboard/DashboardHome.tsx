
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockchainMetrics } from '@/components/home/BlockchainMetrics';
import { TradingVolume } from '@/components/home/TradingVolume';
import { CryptoPrices } from '@/components/home/CryptoPrices';
import { CryptoNews } from '@/components/home/CryptoNews';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  ArrowUpRight, 
  Activity,
  DollarSign,
  Handshake
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
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
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
            <Shield className="w-5 h-5 mr-2 text-terex-accent" />
            Avantages Terex
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-terex-accent" />
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
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Sécurité blockchain</h3>
                <p className="text-gray-400 text-sm">Protection maximale</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section informations crypto et métriques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <CryptoPrices />
        </div>
        <div className="lg:col-span-1">
          <CryptoNews />
        </div>
        <div className="lg:col-span-1">
          <BlockchainMetrics />
        </div>
        <div className="lg:col-span-1">
          <TradingVolume />
        </div>
      </div>
    </div>
  );
}
