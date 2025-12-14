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
        {/* Header */}
        <div className="sticky top-0 z-10 bg-terex-dark/95 backdrop-blur-lg border-b border-terex-gray/20 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-terex-accent to-terex-teal flex items-center justify-center">
                <span className="text-terex-dark font-bold text-lg">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">{greeting}</p>
                <h1 className="text-white font-semibold text-lg">
                  {firstName}
                </h1>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-terex-darker flex items-center justify-center border border-terex-gray hover:border-terex-accent transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-4 space-y-4">
          {/* USDT Price Widget */}
          <USDTPriceWidget />

          {/* Quick Actions */}
          <div>
            <h2 className="text-white font-semibold text-sm mb-3">Actions rapides</h2>
            <QuickActionsWidget onNavigate={onNavigate} />
          </div>

          {/* User Stats */}
          <UserStatsWidget />

          {/* Crypto News */}
          <CryptoNewsWidget />

          {/* Recent Transactions */}
          <div>
            <h2 className="text-white font-semibold text-sm mb-3">Transactions récentes</h2>
            <RecentTransactions onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-[calc(100vh-10rem)] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terex-accent to-terex-teal flex items-center justify-center shadow-lg shadow-terex-accent/20">
              <span className="text-terex-dark font-bold text-2xl">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{greeting}</p>
              <h1 className="text-white font-semibold text-2xl">
                {firstName}
              </h1>
            </div>
          </div>
          <button className="w-11 h-11 rounded-xl bg-terex-darker flex items-center justify-center border border-terex-gray hover:border-terex-accent transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Top Row - Price + Quick Actions */}
            <div className="grid grid-cols-5 gap-6">
              {/* USDT Price Widget */}
              <div className="col-span-2">
                <USDTPriceWidget />
              </div>
              
              {/* Quick Actions */}
              <div className="col-span-3">
                <h2 className="text-white font-semibold text-sm mb-3">Actions rapides</h2>
                <QuickActionsWidget onNavigate={onNavigate} />
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h2 className="text-white font-semibold text-sm mb-3">Transactions récentes</h2>
              <RecentTransactions onNavigate={onNavigate} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-6">
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
