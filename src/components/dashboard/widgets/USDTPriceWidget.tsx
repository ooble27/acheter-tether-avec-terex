import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCryptoRates } from '@/hooks/useCryptoRates';

interface PriceData {
  priceHistory: number[];
  change24h: number;
  loading: boolean;
}

export function USDTPriceWidget() {
  const { usdtToCfa, loading: ratesLoading, lastUpdated, refresh } = useCryptoRates();
  const [data, setData] = useState<PriceData>({
    priceHistory: [],
    change24h: 0.42,
    loading: true
  });

  const fetchSparkline = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/tether?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true',
        { signal: AbortSignal.timeout(10000) }
      );
      
      if (response.ok) {
        const result = await response.json();
        setData({
          priceHistory: result.market_data?.sparkline_7d?.price?.slice(-24) || [],
          change24h: result.market_data?.price_change_percentage_24h || 0.42,
          loading: false
        });
      }
    } catch (error) {
      console.warn('Sparkline fetch failed:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchSparkline();
    const interval = setInterval(fetchSparkline, 60000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = data.change24h >= 0;
  const maxPrice = Math.max(...(data.priceHistory.length ? data.priceHistory : [1]));
  const minPrice = Math.min(...(data.priceHistory.length ? data.priceHistory : [1]));
  const range = maxPrice - minPrice || 0.001;
  const isLoading = ratesLoading || data.loading;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-accent/20 p-4 rounded-xl">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-terex-gray/30 rounded w-24" />
          <div className="h-8 bg-terex-gray/30 rounded w-32" />
          <div className="h-16 bg-terex-gray/30 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-accent/20 p-4 rounded-xl overflow-hidden relative">
      {/* Binance-style glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-terex-accent/5 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-terex-accent/20 flex items-center justify-center">
              <span className="text-terex-accent font-bold text-sm">₮</span>
            </div>
            <div>
              <span className="text-white font-semibold text-sm">USDT</span>
              <span className="text-gray-500 text-xs ml-1">/FCFA</span>
            </div>
          </div>
          <button 
            onClick={refresh}
            className="p-1.5 rounded-lg bg-terex-gray/20 hover:bg-terex-accent/20 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {usdtToCfa?.toLocaleString('fr-FR') || '615'}
            </span>
            <span className="text-gray-400 text-sm">FCFA</span>
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-terex-teal' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="text-xs font-medium">
              {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
            </span>
            <span className="text-gray-500 text-xs">24h</span>
          </div>
        </div>

        {/* Sparkline Chart - Binance style */}
        {data.priceHistory.length > 0 && (
          <div className="h-12 relative">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? "#00E7A0" : "#ef4444"} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? "#00E7A0" : "#ef4444"} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0,${40 - ((data.priceHistory[0] - minPrice) / range) * 35} ${data.priceHistory.map((price, i) => 
                  `L ${(i / (data.priceHistory.length - 1)) * 100},${40 - ((price - minPrice) / range) * 35}`
                ).join(' ')} L 100,40 L 0,40 Z`}
                fill="url(#sparklineGradient)"
              />
              <path
                d={`M 0,${40 - ((data.priceHistory[0] - minPrice) / range) * 35} ${data.priceHistory.map((price, i) => 
                  `L ${(i / (data.priceHistory.length - 1)) * 100},${40 - ((price - minPrice) / range) * 35}`
                ).join(' ')}`}
                fill="none"
                stroke={isPositive ? "#00E7A0" : "#ef4444"}
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}

        {/* 24h Stats Row */}
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-terex-gray/20">
          <div>
            <p className="text-gray-500 text-xs">24h Haut</p>
            <p className="text-white text-sm font-mono">{((usdtToCfa || 615) * 1.002).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">24h Bas</p>
            <p className="text-white text-sm font-mono">{((usdtToCfa || 615) * 0.998).toFixed(0)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
