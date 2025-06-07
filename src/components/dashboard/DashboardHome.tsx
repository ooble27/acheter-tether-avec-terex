
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockchainMetrics } from '@/components/home/BlockchainMetrics';
import { TradingVolume } from '@/components/home/TradingVolume';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  ArrowUpRight, 
  Activity,
  DollarSign,
  Lock
} from 'lucide-react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
}

export function DashboardHome({ user }: DashboardHomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark animate-fade-in">
      {/* Hero Section with Grid Background */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/10 via-transparent to-terex-accent/5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 150, 143, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 150, 143, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-terex-accent/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-terex-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 p-8">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="h-8 w-1 bg-terex-accent"></div>
              <h1 className="text-4xl font-bold">
                <span className="text-white">Bienvenue,</span>{' '}
                <span className="terex-brand">{user?.name}</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Plateforme décentralisée pour vos transactions USDT et transferts internationaux
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-terex-darker/80 backdrop-blur-sm rounded-full px-4 py-2 border border-terex-accent/20">
                <DollarSign className="w-4 h-4 text-terex-accent" />
                <span className="text-white text-sm">Frais gratuits - 0%</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/20">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">Transactions instantanées</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Cards avec design tech */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="group bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-terex-accent/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-terex-accent/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">₮</span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-terex-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <CardTitle className="text-white text-xl">Acheter USDT</CardTitle>
            <CardDescription className="text-gray-400">
              Achetez des USDT avec vos devises locales
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-terex-accent">
                <div className="w-2 h-2 bg-terex-accent rounded-full mr-2"></div>
                Taux compétitifs en temps réel
              </div>
              <div className="flex items-center text-terex-accent">
                <div className="w-2 h-2 bg-terex-accent rounded-full mr-2"></div>
                Transactions sécurisées
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-terex-accent/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">₮</span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <CardTitle className="text-white text-xl">Vendre USDT</CardTitle>
            <CardDescription className="text-gray-400">
              Convertissez vos USDT en francs CFA
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Réception instantanée
              </div>
              <div className="flex items-center text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Orange Money & Wave
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-terex-accent/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <CardTitle className="text-white text-xl">Transferts Globaux</CardTitle>
            <CardDescription className="text-gray-400">
              Transferts rapides Canada ↔ Afrique
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Frais gratuits - 0%
              </div>
              <div className="flex items-center text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Transfert en quelques minutes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sécurité Blockchain */}
      <div className="mb-8">
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
          <CardHeader className="relative z-10 border-b border-terex-gray/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Sécurité Blockchain</CardTitle>
                <CardDescription className="text-gray-400">Protection avancée</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <span className="text-green-400 text-sm">✓ Cryptage de niveau militaire</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <span className="text-green-400 text-sm">✓ Authentification multi-facteurs</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <span className="text-green-400 text-sm">✓ Audit de sécurité continu</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nouveaux composants blockchain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BlockchainMetrics />
        <TradingVolume />
      </div>
    </div>
  );
}
