import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { USDTPriceWidget } from '@/components/dashboard/widgets/USDTPriceWidget';
import { UserStatsWidget } from '@/components/dashboard/widgets/UserStatsWidget';
import { CryptoNewsWidget } from '@/components/dashboard/widgets/CryptoNewsWidget';
import { QuickActionsWidget } from '@/components/dashboard/widgets/QuickActionsWidget';
import { Bell } from 'lucide-react';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const isMobile = useIsMobile();

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

  const firstName = user?.name?.split(' ')[0] || 'Utilisateur';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bonjour' : currentHour < 18 ? 'Bon après-midi' : 'Bonsoir';

  if (isMobile) {
    return (
      <div className="min-h-screen bg-terex-dark pb-24 overflow-y-auto scrollbar-hide">
        {/* Binance-style Header */}
        <div className="sticky top-0 z-10 bg-terex-dark/98 backdrop-blur-xl border-b border-terex-accent/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terex-accent to-terex-accent/60 flex items-center justify-center shadow-lg shadow-terex-accent/20">
                <span className="text-terex-dark font-bold text-lg">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">{greeting}</p>
                <h1 className="text-white font-bold text-base">
                  {firstName}
                </h1>
              </div>
            </div>
            <button className="w-9 h-9 rounded-lg bg-terex-gray/20 flex items-center justify-center border border-terex-gray/30 hover:border-terex-accent/50 hover:bg-terex-accent/10 transition-all">
              <Bell className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-4 space-y-4">
          {/* USDT Price Widget */}
          <USDTPriceWidget />

          {/* Quick Actions */}
          <QuickActionsWidget onNavigate={onNavigate} />

          {/* User Stats */}
          <UserStatsWidget />

          {/* Crypto News */}
          <CryptoNewsWidget />

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-sm">Transactions récentes</h2>
              <button 
                onClick={() => onNavigate?.('history')}
                className="text-terex-accent text-xs hover:underline"
              >
                Voir tout
              </button>
            </div>
            <RecentTransactions onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout - Binance Style
  return (
    <div className="min-h-[calc(100vh-10rem)] py-6 px-6 bg-terex-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-terex-accent to-terex-accent/60 flex items-center justify-center shadow-lg shadow-terex-accent/30">
              <span className="text-terex-dark font-bold text-xl">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">{greeting}</p>
              <h1 className="text-white font-bold text-xl">
                {firstName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-terex-accent/10 border border-terex-accent/30 text-terex-accent text-sm font-medium hover:bg-terex-accent/20 transition-colors">
              Déposer
            </button>
            <button className="w-10 h-10 rounded-lg bg-terex-gray/20 flex items-center justify-center border border-terex-gray/30 hover:border-terex-accent/50 hover:bg-terex-accent/10 transition-all">
              <Bell className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-5">
            {/* Top Row - Price + Quick Actions */}
            <div className="grid grid-cols-5 gap-5">
              {/* USDT Price Widget */}
              <div className="col-span-2">
                <USDTPriceWidget />
              </div>
              
              {/* Quick Actions */}
              <div className="col-span-3">
                <QuickActionsWidget onNavigate={onNavigate} />
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-accent/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-sm">Transactions récentes</h2>
                <button 
                  onClick={() => onNavigate?.('history')}
                  className="text-terex-accent text-xs hover:underline"
                >
                  Voir tout →
                </button>
              </div>
              <RecentTransactions onNavigate={onNavigate} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-5">
            {/* User Stats */}
            <UserStatsWidget />

            {/* Crypto News */}
            <CryptoNewsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
