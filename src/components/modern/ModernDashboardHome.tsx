import React, { useEffect } from 'react';
import { TrendingUp, Zap, Globe, Handshake } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuickActionCard } from './QuickActionCard';
import { BalanceWidget } from './BalanceWidget';
import { ModernRecentTransactions } from './ModernRecentTransactions';

const TetherLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="Tether Logo"
    className={className}
  />
);

interface ModernDashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

export function ModernDashboardHome({ user, onNavigate }: ModernDashboardHomeProps) {
  const isMobile = useIsMobile();

  const handleServiceClick = (service: string) => {
    if (onNavigate) {
      onNavigate(service);
    }
  };

  // Vérifier si on est en mode PWA (standalone)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

  // Force le scroll en haut quand le composant se monte (spécialement pour PWA mobile)
  useEffect(() => {
    if (isPWA && isMobile) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isPWA, isMobile]);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 py-6 space-y-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Salut, <span className="text-terex-accent">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-600">Que souhaitez-vous faire aujourd'hui ?</p>
        </div>

        {/* Balance Widget */}
        <BalanceWidget balance="0" currency="FCFA" />

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard
            icon={TrendingUp}
            title="Acheter"
            subtitle="USDT rapidement"
            onClick={() => handleServiceClick('buy')}
            gradient="from-green-500 to-green-600"
            iconColor="text-white"
          />
          
          <QuickActionCard
            icon={TrendingUp}
            title="Vendre"
            subtitle="Convertir en FCFA"
            onClick={() => handleServiceClick('sell')}
            gradient="from-red-500 to-red-600"
            iconColor="text-white"
          />
          
          <QuickActionCard
            icon={Handshake}
            title="Trading OTC"
            subtitle="Gros volumes"
            onClick={() => handleServiceClick('otc')}
            gradient="from-purple-500 to-purple-600"
            iconColor="text-white"
          />
          
          <QuickActionCard
            icon={Globe}
            title="Virements"
            subtitle="International"
            onClick={() => handleServiceClick('transfer')}
            gradient="from-terex-accent to-terex-accent/80"
            iconColor="text-white"
          />
        </div>

        {/* Recent Transactions */}
        <ModernRecentTransactions onNavigate={onNavigate} />

        {/* Features Highlight */}
        <div className="bg-white/50 rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-terex-accent" />
            Pourquoi choisir Terex ?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Frais gratuits</p>
                <p className="text-gray-600 text-xs">0% de frais sur les transactions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Instantané</p>
                <p className="text-gray-600 text-xs">Transactions en temps réel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Disponible 24/7</p>
                <p className="text-gray-600 text-xs">Support client permanent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - keeping similar structure but with modern styling
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue, <span className="text-terex-accent">{user?.name}</span>
        </h1>
        <p className="text-gray-600">Gérez vos transactions USDT en toute simplicité</p>
      </div>

      {/* Balance and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <BalanceWidget balance="0" currency="FCFA" />
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={TrendingUp}
            title="Acheter"
            subtitle="USDT"
            onClick={() => handleServiceClick('buy')}
            gradient="from-green-500 to-green-600"
            iconColor="text-white"
          />
          
          <QuickActionCard
            icon={TrendingUp}
            title="Vendre"
            subtitle="USDT"
            onClick={() => handleServiceClick('sell')}
            gradient="from-red-500 to-red-600"
            iconColor="text-white"
          />
          
          <QuickActionCard
            icon={Handshake}
            title="OTC"
            subtitle="Trading"
            onClick={() => handleServiceClick('otc')}
            gradient="from-purple-500 to-purple-600"
            iconColor="text-white"
          />
          
          <QuickActionCard
            icon={Globe}
            title="Virements"
            subtitle="Internationaux"
            onClick={() => handleServiceClick('transfer')}
            gradient="from-terex-accent to-terex-accent/80"
            iconColor="text-white"
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <ModernRecentTransactions onNavigate={onNavigate} />
    </div>
  );
}
