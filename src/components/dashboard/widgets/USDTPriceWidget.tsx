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
  const { usdtToCfa, loading: ratesLoading, lastUpdated } = useCryptoRates();
  const [data, setData] = useState<PriceData>({
    priceHistory: [],
    change24h: 0,
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
          change24h: result.market_data?.price_change_percentage_24h || 0,
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
    const interval = setInterval(fetchSparkline, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const isPositive = data.change24h >= 0;
  const maxPrice = Math.max(...(data.priceHistory.length ? data.priceHistory : [1]));
  const minPrice = Math.min(...(data.priceHistory.length ? data.priceHistory : [1]));
  const range = maxPrice - minPrice || 0.001;

  const isLoading = ratesLoading || data.loading;

  return (
    <Card className="bg-gradient-to-br from-terex-accent/20 via-terex-darker to-terex-darker border-terex-accent/30 p-4 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-terex-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img 
              src="https://coin-images.coingecko.com/coins/images/325/small/Tether.png"
              alt="USDT"
              className="w-8 h-8"
            />
            <div>
              <h3 className="text-white font-semibold text-sm">USDT</h3>
              <p className="text-gray-400 text-xs">Tether</p>
            </div>
          </div>
          
          {isLoading ? (
            <RefreshCw className="w-4 h-4 text-terex-accent animate-spin" />
          ) : (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(data.change24h).toFixed(2)}%
            </div>
          )}
        </div>

        {/* Price in CFA */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-terex-highlight">
            {usdtToCfa.toLocaleString('fr-FR')}
          </span>
          <span className="text-gray-400 text-sm ml-2">FCFA</span>
        </div>

        {/* Mini Sparkline Chart */}
        {data.priceHistory.length > 0 && (
          <div className="h-12 flex items-end gap-px">
            {data.priceHistory.map((price, index) => {
              const height = ((price - minPrice) / range) * 100;
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-t transition-all ${
                    isPositive ? 'bg-green-400/60' : 'bg-red-400/60'
                  }`}
                  style={{ 
                    height: `${Math.max(height, 5)}%`,
                    opacity: 0.4 + (index / data.priceHistory.length) * 0.6
                  }}
                />
              );
            })}
          </div>
        )}
        
        <p className="text-gray-500 text-xs mt-2 text-center">
          {lastUpdated ? `Mis à jour ${new Date(lastUpdated).toLocaleTimeString('fr-FR')}` : 'Dernières 24h'}
        </p>
      </div>
    </Card>
  );
}
