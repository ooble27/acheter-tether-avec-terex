import { useState, useEffect } from 'react';
import { Globe, Handshake, TrendingDown, ArrowDownUp, ChevronRight, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTerexRates } from '@/hooks/useTerexRates';

interface DashboardHomeProps {
  user: { email: string; name: string } | null;
  onNavigate?: (section: string) => void;
}

const TetherLogo = ({ className }: { className?: string }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={className}
  />
);

/* ── Bloc swap interactif ── */
function SwapCard({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { terexRateCfa, terexBuyRateCfa, loading } = useTerexRates();
  const [cfaAmount, setCfaAmount] = useState('');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  const rate    = mode === 'buy' ? terexRateCfa : terexBuyRateCfa;
  const parsed  = parseFloat(cfaAmount.replace(/\s/g, '')) || 0;
  const usdt    = parsed > 0 && rate > 0 ? (parsed / rate).toFixed(2) : '0.00';
  const usdtIn  = parseFloat(cfaAmount.replace(/\s/g, '')) || 0;
  const cfaOut  = usdtIn > 0 && rate > 0 ? Math.round(usdtIn * rate).toLocaleString('fr-FR') : '0';

  const handleSwitch = () => setMode(m => m === 'buy' ? 'sell' : 'buy');
  const handleGo     = () => onNavigate?.(mode);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
      {/* Tabs buy / sell */}
      <div className="flex border-b" style={{ borderColor: '#2a2a2a' }}>
        {(['buy', 'sell'] as const).map(t => (
          <button
            key={t}
            onClick={() => setMode(t)}
            className="flex-1 py-3 text-sm font-medium transition-colors"
            style={{
              color: mode === t ? '#3b968f' : '#555',
              borderBottom: mode === t ? '2px solid #3b968f' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {t === 'buy' ? 'Acheter USDT' : 'Vendre USDT'}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-3">
        {/* Champ 1 */}
        <div className="rounded-xl p-4" style={{ background: '#1e1e1e', border: '1px solid #2e2e2e' }}>
          <p className="text-xs mb-2" style={{ color: '#666' }}>
            {mode === 'buy' ? 'Vous payez' : 'Vous envoyez'}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0"
              value={cfaAmount}
              onChange={e => setCfaAmount(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-gray-700 min-w-0"
            />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
              style={{ background: '#2a2a2a' }}>
              {mode === 'buy'
                ? <span className="text-sm font-semibold text-white">CFA</span>
                : <><TetherLogo className="w-5 h-5" /><span className="text-sm font-semibold text-white">USDT</span></>
              }
            </div>
          </div>
        </div>

        {/* Bouton switch */}
        <div className="flex justify-center">
          <button
            onClick={handleSwitch}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: '#252525', border: '1px solid #333' }}
          >
            <ArrowDownUp className="w-4 h-4" style={{ color: '#3b968f' }} />
          </button>
        </div>

        {/* Champ 2 — lecture seule */}
        <div className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid #252525' }}>
          <p className="text-xs mb-2" style={{ color: '#666' }}>
            {mode === 'buy' ? 'Vous recevez' : 'Vous recevez'}
          </p>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-2xl font-semibold" style={{ color: '#3b968f' }}>
              {mode === 'buy' ? usdt : cfaOut}
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
              style={{ background: '#2a2a2a' }}>
              {mode === 'buy'
                ? <><TetherLogo className="w-5 h-5" /><span className="text-sm font-semibold text-white">USDT</span></>
                : <span className="text-sm font-semibold text-white">CFA</span>
              }
            </div>
          </div>
        </div>

        {/* Taux */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs" style={{ color: '#555' }}>
            {loading ? 'Chargement…' : `1 USDT = ${rate.toLocaleString('fr-FR')} CFA`}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: '#3b968f' }}>
            <Zap className="w-3 h-3" />
            Taux en direct
          </span>
        </div>

        {/* Bouton action */}
        <button
          onClick={handleGo}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity"
          style={{ background: '#3b968f', color: '#fff' }}
        >
          {mode === 'buy' ? 'Acheter USDT →' : 'Vendre USDT →'}
        </button>
      </div>
    </div>
  );
}

/* ── Bouton action rapide ── */
function QuickAction({ icon, label, sub, onClick, color }: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl text-left w-full transition-colors group"
      style={{ background: '#141414', border: '1px solid #2a2a2a' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#555' }}>{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#444' }} />
    </button>
  );
}

/* ── Composant principal ── */
export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const isMobile = useIsMobile();
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

  const firstName = user?.name?.split(' ')[0] || 'vous';

  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <img src="/bitcoin-logo.png" alt="" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-light text-white leading-tight">
            Bonjour, <span style={{ color: '#3b968f' }}>{firstName}</span>
          </h1>
          <p className="text-xs" style={{ color: '#555' }}>Plateforme USDT · Terex</p>
        </div>
      </div>

      {/* Bloc swap */}
      <SwapCard onNavigate={onNavigate} />

      {/* Actions rapides */}
      <div className="space-y-2">
        <p className="text-xs font-medium px-1" style={{ color: '#444' }}>AUTRES SERVICES</p>
        <QuickAction
          icon={<TrendingDown className="w-5 h-5" />}
          label="Vendre USDT"
          sub="Convertir vos USDT en CFA"
          onClick={() => onNavigate?.('sell')}
          color="#ef4444"
        />
        <QuickAction
          icon={<Globe className="w-5 h-5" />}
          label="Virement international"
          sub="Transfert bancaire rapide"
          onClick={() => onNavigate?.('transfer')}
          color="#3b968f"
        />
        <QuickAction
          icon={<Handshake className="w-5 h-5" />}
          label="Trading OTC"
          sub="Pour les gros volumes"
          onClick={() => onNavigate?.('otc')}
          color="#a855f7"
        />
      </div>

      {/* Historique */}
      <RecentTransactions onNavigate={onNavigate} />
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-terex-dark px-0 py-3 overflow-y-auto scrollbar-hide">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-lg">
        {content}
      </div>
    </div>
  );
}
