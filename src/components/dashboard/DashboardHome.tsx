import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Globe, Handshake, ArrowUpRight, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { useTerexRates } from '@/hooks/useTerexRates';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickTradeWidget } from '@/components/dashboard/QuickTradeWidget';
import { cn } from '@/lib/utils';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const TetherIcon = ({ className }: { className?: string }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={cn('object-contain', className)}
  />
);

export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const isMobile = useIsMobile();
  const { usdtToCfa, loading } = useCryptoRates();
  const { terexRateCfa, terexBuyRateCfa } = useTerexRates();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(i);
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Trader';

  // ────── MOBILE: keep existing compact layout, refined ──────
  if (isMobile) {
    return (
      <div className="min-h-screen bg-terex-dark px-0 py-3 space-y-4 overflow-y-auto scrollbar-hide">
        <div className="px-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Bienvenue</p>
          <h1 className="text-2xl font-light text-white mt-1">
            {firstName} <span className="text-terex-accent">.</span>
          </h1>
        </div>

        {/* Live ticker mobile */}
        <div className="rounded-2xl bg-[#0d0d0d] border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TetherIcon className="w-7 h-7" />
              <div>
                <div className="text-white text-sm font-medium">USDT / XOF</div>
                <div className="text-[10px] text-gray-500 font-mono">
                  {loading ? '—' : `1 USDT = ${Math.round(usdtToCfa)} XOF`}
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-terex-accent/15 text-terex-accent font-mono">
              LIVE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Achat</div>
              <div className="text-terex-accent text-base font-light font-mono">{terexRateCfa}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Vente</div>
              <div className="text-white text-base font-light font-mono">{terexBuyRateCfa}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-0">
          {[
            { id: 'buy', label: 'Acheter', icon: TetherIcon, custom: true, color: 'terex-accent' },
            { id: 'sell', label: 'Vendre', icon: TrendingDown, color: 'red' },
            { id: 'transfer', label: 'Virement', icon: Globe, color: 'blue' },
            { id: 'otc', label: 'OTC', icon: Handshake, color: 'purple' },
          ].map(it => {
            const Icon = it.icon as any;
            return (
              <button
                key={it.id}
                onClick={() => onNavigate?.(it.id)}
                className="group rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-terex-accent/30 p-3 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2">
                  {it.custom ? <Icon className="w-5 h-5" /> : <Icon className="w-4 h-4 text-white" />}
                </div>
                <div className="text-white text-sm font-light">{it.label}</div>
                <div className="text-[10px] text-gray-500">USDT</div>
              </button>
            );
          })}
        </div>

        <div className="px-0">
          <RecentTransactions onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  // ────── DESKTOP: DODO-inspired centered, 3-column ──────
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Hero strip */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-mono">
            Tableau de bord
          </p>
          <h1 className="text-3xl lg:text-4xl font-light text-white mt-2 tracking-tight">
            Bonjour, <span className="text-terex-accent">{firstName}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-light">
            Marché USDT/XOF en temps réel · Wave & Orange Money supportés
          </p>
        </div>

        {/* Live ticker */}
        <div className="flex items-center gap-3">
          {[
            { label: 'USDT/XOF', value: loading ? '—' : Math.round(usdtToCfa).toLocaleString('fr-FR'), accent: true },
            { label: 'Achat', value: terexRateCfa.toLocaleString('fr-FR') },
            { label: 'Vente', value: terexBuyRateCfa.toLocaleString('fr-FR') },
          ].map(s => (
            <div
              key={s.label}
              className="px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/5 min-w-[110px]"
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                {s.label}
              </div>
              <div
                className={cn(
                  'text-sm font-mono mt-0.5',
                  s.accent ? 'text-terex-accent' : 'text-white'
                )}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid: center info + right action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero card USDT */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0d0d0d] via-[#0d0d0d] to-terex-accent/5 border border-white/5 overflow-hidden p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="relative flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TetherIcon className="w-7 h-7" />
                  <span className="text-white text-sm font-medium">Tether USD</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                    USDT
                  </span>
                </div>
                <div className="text-5xl font-extralight text-white tracking-tight">
                  {loading ? '—' : Math.round(usdtToCfa).toLocaleString('fr-FR')}
                  <span className="text-xl text-gray-500 ml-2 font-light">XOF</span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-terex-accent">
                    <TrendingUp className="w-3 h-3" />
                    Stable
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-500 font-mono">1 USD = 1 USDT</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[200px]">
                <button
                  onClick={() => onNavigate?.('buy')}
                  className="h-11 px-5 rounded-xl bg-terex-accent hover:bg-terex-accent/90 text-black text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-terex-accent/20"
                >
                  Acheter USDT
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate?.('sell')}
                  className="h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-light transition-all flex items-center justify-center gap-2"
                >
                  Vendre USDT
                </button>
              </div>
            </div>
          </div>

          {/* Service grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'buy', label: 'Acheter', sub: 'USDT instant', icon: TetherIcon, custom: true },
              { id: 'sell', label: 'Vendre', sub: 'Wave / Orange', icon: TrendingDown },
              { id: 'transfer', label: 'Virement', sub: 'International', icon: Globe },
              { id: 'otc', label: 'OTC Desk', sub: 'Gros volumes', icon: Handshake },
            ].map(it => {
              const Icon = it.icon as any;
              return (
                <button
                  key={it.id}
                  onClick={() => onNavigate?.(it.id)}
                  className="group relative rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-terex-accent/30 p-4 text-left transition-all overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-terex-accent/15 flex items-center justify-center transition-all">
                      {it.custom ? (
                        <Icon className="w-5 h-5" />
                      ) : (
                        <Icon className="w-[18px] h-[18px] text-white" />
                      )}
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-terex-accent transition-colors" />
                  </div>
                  <div className="text-white text-sm font-light">{it.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{it.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Recent transactions */}
          <RecentTransactions onNavigate={onNavigate} />
        </div>

        {/* Right column: Quick trade */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-20 space-y-4">
            <QuickTradeWidget onTrade={action => onNavigate?.(action)} />

            <div className="rounded-2xl bg-[#0d0d0d] border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-terex-accent" />
                <span className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">
                  Pourquoi Terex
                </span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Règlement < 5 minutes',
                  'Réseaux TRC20 / BEP20 / ERC20',
                  'Support FR 7j/7',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2 text-xs text-gray-400 font-light">
                    <span className="w-1 h-1 rounded-full bg-terex-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
