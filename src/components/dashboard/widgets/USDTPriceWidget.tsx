import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTerexRates } from '@/hooks/useTerexRates';

interface PriceData {
  priceHistory: number[];
  change24h: number;
  loading: boolean;
}

export function USDTPriceWidget() {
  const { terexRateCfa, terexBuyRateCfa, loading: ratesLoading, lastUpdated } = useTerexRates();
  const [data, setData] = useState<PriceData>({
    priceHistory: [],
    change24h: 0,
    loading: true
  });
  
  // Converter state
  const [usdtAmount, setUsdtAmount] = useState<string>('100');
  const [cfaAmount, setCfaAmount] = useState<string>('');
  const [convertDirection, setConvertDirection] = useState<'usdt-to-cfa' | 'cfa-to-usdt'>('usdt-to-cfa');

  // Update CFA amount when USDT changes or rate changes
  useEffect(() => {
    if (convertDirection === 'usdt-to-cfa') {
      const usdt = parseFloat(usdtAmount) || 0;
      const cfa = Math.round(usdt * terexBuyRateCfa);
      setCfaAmount(cfa > 0 ? cfa.toLocaleString('fr-FR') : '');
    }
  }, [usdtAmount, terexBuyRateCfa, convertDirection]);

  // Update USDT amount when CFA changes
  useEffect(() => {
    if (convertDirection === 'cfa-to-usdt') {
      const cfa = parseFloat(cfaAmount.replace(/\s/g, '').replace(/,/g, '')) || 0;
      const usdt = cfa / terexRateCfa;
      setUsdtAmount(usdt > 0 ? usdt.toFixed(2) : '');
    }
  }, [cfaAmount, terexRateCfa, convertDirection]);

  const handleUsdtChange = (value: string) => {
    setConvertDirection('usdt-to-cfa');
    setUsdtAmount(value);
  };

  const handleCfaChange = (value: string) => {
    setConvertDirection('cfa-to-usdt');
    setCfaAmount(value);
  };

  const toggleDirection = () => {
    setConvertDirection(prev => prev === 'usdt-to-cfa' ? 'cfa-to-usdt' : 'usdt-to-cfa');
  };

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
    const interval = setInterval(fetchSparkline, 60000);
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
              <p className="text-gray-400 text-xs">Prix Terex</p>
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

        {/* Prices */}
        <div className="mb-4 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-400">Vente:</span>
            <span className="text-xl font-bold text-terex-highlight">
              {terexBuyRateCfa.toLocaleString('fr-FR')}
            </span>
            <span className="text-gray-400 text-xs">FCFA</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-400">Achat:</span>
            <span className="text-sm font-medium text-white">
              {terexRateCfa.toLocaleString('fr-FR')}
            </span>
            <span className="text-gray-500 text-xs">FCFA</span>
          </div>
        </div>

        {/* Quick Converter */}
        <div className="bg-terex-dark/50 rounded-xl p-3 border border-terex-gray/30">
          <p className="text-xs text-gray-400 mb-2">Convertisseur rapide</p>
          
          <div className="flex items-center gap-2">
            {/* USDT Input */}
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="number"
                  value={usdtAmount}
                  onChange={(e) => handleUsdtChange(e.target.value)}
                  className="bg-terex-darker border-terex-gray text-white pr-14 text-sm h-9"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-terex-accent font-medium">
                  USDT
                </span>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={toggleDirection}
              className="w-8 h-8 rounded-lg bg-terex-accent/20 flex items-center justify-center hover:bg-terex-accent/30 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4 text-terex-accent" />
            </button>

            {/* CFA Input */}
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  value={cfaAmount}
                  onChange={(e) => handleCfaChange(e.target.value)}
                  className="bg-terex-darker border-terex-gray text-white pr-12 text-sm h-9"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-terex-highlight font-medium">
                  CFA
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Taux de vente Terex • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('fr-FR') : '--:--'}
          </p>
        </div>

        {/* Mini Sparkline Chart */}
        {data.priceHistory.length > 0 && (
          <div className="h-8 flex items-end gap-px mt-3">
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
      </div>
    </Card>
  );
}
