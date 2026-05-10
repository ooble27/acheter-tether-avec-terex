import { useState, useMemo } from 'react';
import { ArrowDownUp, ChevronDown, Zap } from 'lucide-react';
import { useTerexRates } from '@/hooks/useTerexRates';
import { cn } from '@/lib/utils';

interface QuickTradeWidgetProps {
  onTrade?: (action: 'buy' | 'sell', amount: string) => void;
}

const TetherIcon = ({ className }: { className?: string }) => (
  <img
    src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png"
    alt="USDT"
    className={cn('object-contain', className)}
  />
);

export function QuickTradeWidget({ onTrade }: QuickTradeWidgetProps) {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const { terexRateCfa, terexBuyRateCfa, loading } = useTerexRates();

  const rate = mode === 'buy' ? terexRateCfa : terexBuyRateCfa;
  const isFromFiat = mode === 'buy';

  const result = useMemo(() => {
    const n = parseFloat(amount.replace(/\s/g, ''));
    if (!n || !rate) return '';
    if (mode === 'buy') return (n / rate).toFixed(2);
    return Math.round(n * rate).toLocaleString('fr-FR');
  }, [amount, rate, mode]);

  const quickPercents = [25, 50, 75, 100];
  const baseAmount = mode === 'buy' ? 200000 : 100;

  const handlePercent = (p: number) => {
    setAmount(String((baseAmount * p) / 100));
  };

  return (
    <div className="rounded-2xl bg-[#0d0d0d] border border-white/5 overflow-hidden">
      {/* Header tabs */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="inline-flex bg-black/40 rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => setMode('buy')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-medium rounded-md transition-all',
              mode === 'buy'
                ? 'bg-terex-accent text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Acheter
          </button>
          <button
            onClick={() => setMode('sell')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-medium rounded-md transition-all',
              mode === 'sell'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Vendre
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-terex-accent animate-pulse" />
          <span className="font-mono">Live</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* From */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">
              {isFromFiat ? 'Vous payez' : 'Vous vendez'}
            </span>
            <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 transition-colors">
              {isFromFiat ? (
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[9px] font-bold text-amber-300">
                  F
                </span>
              ) : (
                <TetherIcon className="w-5 h-5" />
              )}
              <span className="text-xs text-white font-medium">
                {isFromFiat ? 'XOF' : 'USDT'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-3xl font-light text-white outline-none placeholder:text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="flex gap-1.5 mt-3">
            {quickPercents.map(p => (
              <button
                key={p}
                onClick={() => handlePercent(p)}
                className="flex-1 py-1 text-[10px] text-gray-500 hover:text-white hover:bg-white/5 rounded-md transition-all border border-white/5"
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        {/* Switch */}
        <div className="flex justify-center -my-1.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-[#0d0d0d] border border-white/10 flex items-center justify-center">
            <ArrowDownUp className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* To */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">
              Vous recevez
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1">
              {!isFromFiat ? (
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[9px] font-bold text-amber-300">
                  F
                </span>
              ) : (
                <TetherIcon className="w-5 h-5" />
              )}
              <span className="text-xs text-white font-medium">
                {isFromFiat ? 'USDT' : 'XOF'}
              </span>
            </div>
          </div>
          <div className="text-3xl font-light text-white truncate">
            {result || <span className="text-gray-700">0.00</span>}
          </div>
          <div className="text-[11px] text-gray-500 mt-1 font-mono">
            1 USDT = {loading ? '—' : rate.toLocaleString('fr-FR')} XOF
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onTrade?.(mode, amount)}
          className={cn(
            'w-full h-12 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2',
            mode === 'buy'
              ? 'bg-terex-accent hover:bg-terex-accent/90 text-black shadow-lg shadow-terex-accent/20'
              : 'bg-white hover:bg-white/90 text-black'
          )}
        >
          <Zap className="w-4 h-4" />
          {mode === 'buy' ? 'Acheter USDT' : 'Vendre USDT'}
        </button>

        <div className="text-[10px] text-gray-600 text-center">
          Frais réseau inclus · Règlement Wave / Orange Money
        </div>
      </div>
    </div>
  );
}
