import { Card, CardContent } from '@/components/ui/card';
import { 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  Handshake,
  TrendingUp,
  Activity,
  Wallet,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useEffect } from 'react';
import { useTerexRates } from '@/hooks/useTerexRates';

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
  const { terexBuyRateCfa, terexRateCfa, loading } = useTerexRates();

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

  const handleServiceClick = (service: string) => {
    if (onNavigate) {
      onNavigate(service);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Utilisateur';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bonjour' : currentHour < 18 ? 'Bon après-midi' : 'Bonsoir';

  // Services data
  const services = [
    {
      id: 'buy',
      title: 'Acheter',
      subtitle: 'USDT',
      description: 'Mobile Money → USDT',
      icon: <ArrowUpRight className="w-5 h-5" />,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/50'
    },
    {
      id: 'sell',
      title: 'Vendre',
      subtitle: 'USDT',
      description: 'USDT → Mobile Money',
      icon: <ArrowDownRight className="w-5 h-5" />,
      gradient: 'from-rose-500/20 to-pink-500/20',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400',
      borderHover: 'hover:border-rose-500/50'
    },
    {
      id: 'otc',
      title: 'Trading',
      subtitle: 'OTC',
      description: 'Volumes importants',
      icon: <Handshake className="w-5 h-5" />,
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      borderHover: 'hover:border-violet-500/50'
    },
    {
      id: 'transfer',
      title: 'Virement',
      subtitle: 'International',
      description: 'Transferts rapides',
      icon: <Globe className="w-5 h-5" />,
      gradient: 'from-terex-accent/20 to-teal-500/20',
      iconBg: 'bg-terex-accent/20',
      iconColor: 'text-terex-accent',
      borderHover: 'hover:border-terex-accent/50'
    }
  ];

  return (
    <div className={`${isMobile ? 'px-4 py-4' : 'py-8 px-6'} relative z-10 max-w-4xl mx-auto`}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terex-accent/20 to-teal-500/10 flex items-center justify-center border border-white/10">
              <Sparkles className="w-6 h-6 text-terex-accent" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-terex-dark flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-sm text-white/50 mb-0.5">{greeting}</p>
            <h1 className="text-2xl text-white">
              {firstName} <span className="text-white/30">👋</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Live Rates Card */}
      <div className="mb-6">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 via-transparent to-violet-500/5 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TetherLogo className="w-8 h-8" />
                <div>
                  <h2 className="text-white text-lg">USDT/XOF</h2>
                  <p className="text-white/40 text-xs">Taux en temps réel</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/50 text-xs uppercase tracking-wider">Achat</span>
                </div>
                <p className="text-2xl text-white font-mono">
                  {loading ? '---' : terexBuyRateCfa?.toLocaleString('fr-FR')}
                </p>
                <p className="text-white/30 text-xs">FCFA / USDT</p>
              </div>
              
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  <span className="text-white/50 text-xs uppercase tracking-wider">Vente</span>
                </div>
                <p className="text-2xl text-white font-mono">
                  {loading ? '---' : terexRateCfa?.toLocaleString('fr-FR')}
                </p>
                <p className="text-white/30 text-xs">FCFA / USDT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        <span className="text-white/30 text-xs uppercase tracking-widest">Services</span>
        <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            className={`group relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-4 text-left transition-all duration-300 hover:bg-white/[0.05] ${service.borderHover} hover:scale-[1.02] active:scale-[0.98]`}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center ${service.iconColor}`}>
                  {service.icon}
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white text-base">{service.title}</span>
                  <span className="text-terex-accent text-sm">{service.subtitle}</span>
                </div>
                <p className="text-white/40 text-xs mt-0.5">{service.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-3 text-center">
          <Activity className="w-4 h-4 text-terex-accent mx-auto mb-1.5" />
          <p className="text-white text-sm">Actif</p>
          <p className="text-white/40 text-xs">Statut</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-3 text-center">
          <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
          <p className="text-white text-sm">24/7</p>
          <p className="text-white/40 text-xs">Support</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-3 text-center">
          <Wallet className="w-4 h-4 text-violet-400 mx-auto mb-1.5" />
          <p className="text-white text-sm">Sécurisé</p>
          <p className="text-white/40 text-xs">100%</p>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        <span className="text-white/30 text-xs uppercase tracking-widest">Activité récente</span>
        <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions onNavigate={onNavigate} />
    </div>
  );
}
