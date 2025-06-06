
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Users, DollarSign, Clock } from 'lucide-react';

// Mock data pour les données de marché
const marketData = {
  usdtPrice: 1.0012,
  priceChange24h: 0.0008,
  volume24h: 24500000,
  avgExecutionTime: 18,
  activeTraders: 156,
  totalVolume: 1200000000
};

const recentTrades = [
  { id: 1, type: 'buy', amount: 850000, price: 1.0015, time: '14:23', counterparty: 'Binance OTC' },
  { id: 2, type: 'sell', amount: 1200000, price: 1.0010, time: '14:18', counterparty: 'Kraken Pro' },
  { id: 3, type: 'buy', amount: 650000, price: 1.0012, time: '14:12', counterparty: 'Coinbase Prime' },
  { id: 4, type: 'sell', amount: 2100000, price: 1.0008, time: '14:05', counterparty: 'FTX OTC' },
  { id: 5, type: 'buy', amount: 750000, price: 1.0014, time: '13:58', counterparty: 'Huobi Global' }
];

const marketMakers = [
  { name: 'Binance OTC', spread: '0.05%', volume24h: 8500000, reliability: 98 },
  { name: 'Kraken Pro', spread: '0.06%', volume24h: 6200000, reliability: 97 },
  { name: 'Coinbase Prime', spread: '0.07%', volume24h: 4800000, reliability: 99 },
  { name: 'FTX OTC', spread: '0.08%', volume24h: 3600000, reliability: 95 },
  { name: 'Huobi Global', spread: '0.09%', volume24h: 1400000, reliability: 94 }
];

export function OTCMarketData() {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="space-y-6">
      {/* Stats générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Prix USDT</p>
                <p className="text-lg font-bold text-white">${marketData.usdtPrice}</p>
              </div>
              <DollarSign className="h-8 w-8 text-terex-accent" />
            </div>
            <div className="flex items-center mt-2">
              {marketData.priceChange24h > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={`text-xs ${marketData.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {marketData.priceChange24h > 0 ? '+' : ''}{(marketData.priceChange24h * 100).toFixed(3)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Volume 24h</p>
                <p className="text-lg font-bold text-white">${formatNumber(marketData.volume24h)}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Temps moy.</p>
                <p className="text-lg font-bold text-white">{marketData.avgExecutionTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Traders actifs</p>
                <p className="text-lg font-bold text-white">{marketData.activeTraders}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/30 md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Volume total</p>
                <p className="text-lg font-bold text-white">${formatNumber(marketData.totalVolume)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Depuis le lancement</p>
                <Badge variant="outline" className="bg-terex-accent/10 text-terex-accent border-terex-accent/30">
                  +24.5% ce mois
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trades récents */}
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardHeader>
            <CardTitle className="text-white">Trades récents</CardTitle>
            <CardDescription className="text-gray-400">
              Dernières transactions OTC exécutées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-terex-gray/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={`${trade.type === 'buy' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                      {trade.type === 'buy' ? 'BUY' : 'SELL'}
                    </Badge>
                    <div>
                      <p className="text-white text-sm font-medium">{formatNumber(trade.amount)} USDT</p>
                      <p className="text-xs text-gray-400">{trade.counterparty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">${trade.price}</p>
                    <p className="text-xs text-gray-400">{formatTime(trade.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Makers */}
        <Card className="bg-terex-darker border-terex-gray/30">
          <CardHeader>
            <CardTitle className="text-white">Market Makers</CardTitle>
            <CardDescription className="text-gray-400">
              Principaux fournisseurs de liquidité OTC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketMakers.map((maker, index) => (
                <div key={index} className="p-3 bg-terex-gray/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{maker.name}</h4>
                    <Badge variant="outline" className={`${maker.reliability >= 97 ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}`}>
                      {maker.reliability}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Spread: </span>
                      <span className="text-white">{maker.spread}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Volume 24h: </span>
                      <span className="text-white">${formatNumber(maker.volume24h)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur les spreads */}
      <Card className="bg-terex-darker border-terex-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Analyse des spreads</CardTitle>
          <CardDescription className="text-gray-400">
            Écarts bid/ask moyens par volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-terex-gray/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">100K - 500K</h4>
              <p className="text-terex-accent text-2xl font-bold">0.08%</p>
              <p className="text-xs text-gray-400 mt-1">Spread moyen</p>
            </div>
            <div className="text-center p-4 bg-terex-gray/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">500K - 1M</h4>
              <p className="text-terex-accent text-2xl font-bold">0.06%</p>
              <p className="text-xs text-gray-400 mt-1">Spread moyen</p>
            </div>
            <div className="text-center p-4 bg-terex-gray/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">1M - 5M</h4>
              <p className="text-terex-accent text-2xl font-bold">0.04%</p>
              <p className="text-xs text-gray-400 mt-1">Spread moyen</p>
            </div>
            <div className="text-center p-4 bg-terex-gray/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">5M+</h4>
              <p className="text-terex-accent text-2xl font-bold">0.02%</p>
              <p className="text-xs text-gray-400 mt-1">Spread moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
