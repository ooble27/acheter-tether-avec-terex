import { Card, CardContent } from '@/components/ui/card';
import { 
  Globe, 
  ArrowUpRight, 
  Handshake,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

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
  const { t } = useLanguage();

  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');

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

  const handleServiceClick = (service: string) => {
    if (onNavigate) onNavigate(service);
  };

  const services = [
    { id: 'buy', label: t.dashboard.buyUsdt, sub: t.dashboard.quickBuy, color: 'green', icon: <TetherLogo className="w-5 h-5" /> },
    { id: 'sell', label: t.dashboard.sellUsdt, sub: t.dashboard.quickSell, color: 'red', icon: <TetherLogo className="w-5 h-5" /> },
    { id: 'otc', label: t.dashboard.otcTrading, sub: t.dashboard.highVolume, color: 'purple', icon: <Handshake className="w-4 h-4 text-purple-400" /> },
    { id: 'transfer', label: t.dashboard.transfer, sub: t.dashboard.international, color: 'accent', icon: <Globe className="w-4 h-4 text-terex-accent" /> },
  ];

  const bgColors: Record<string, string> = {
    green: 'bg-green-500/20',
    red: 'bg-red-500/20',
    purple: 'bg-purple-500/20',
    accent: 'bg-terex-accent/20',
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-terex-dark px-0 py-3 space-y-3 text-xs overflow-y-auto scrollbar-hide">
        <div className="flex items-center space-x-3 mb-6 px-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
            <img src="/bitcoin-logo.png" alt="Bitcoin" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-1">
              {t.dashboard.welcome} <span className="text-terex-accent">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm text-gray-400 font-light">{t.dashboard.usdtPlatform}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 px-0">
          {services.map((s) => (
            <Card key={s.id} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer" onClick={() => handleServiceClick(s.id)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 ${bgColors[s.color]} rounded-lg flex items-center justify-center`}>{s.icon}</div>
                </div>
                <h3 className="text-white text-sm font-light mb-1">{s.label}</h3>
                <p className="text-gray-400 text-xs">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="px-0">
          <RecentTransactions onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
            <img src="/bitcoin-logo.png" alt="Bitcoin" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-white">
              {t.dashboard.welcome} <span className="text-terex-accent">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400 text-sm">{t.dashboard.usdtPlatform}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {services.map((s) => (
            <Card key={s.id} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer" onClick={() => handleServiceClick(s.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${bgColors[s.color]} rounded-lg flex items-center justify-center`}>{s.icon}</div>
                  <ArrowUpRight className="w-4 h-4 text-terex-accent" />
                </div>
                <h3 className="text-white font-light mb-1">{s.label}</h3>
                <p className="text-gray-400 text-sm">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <RecentTransactions onNavigate={onNavigate} />
      </div>
    </div>
  );
}
