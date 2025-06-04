
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CoinMarketCapService } from '@/services/coinMarketCapService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface USDTData {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export function USDTMarketInfo() {
  const [usdtData, setUsdtData] = useState<USDTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUSDTData = async () => {
      try {
        setLoading(true);
        const data = await CoinMarketCapService.getUSDTData();
        setUsdtData(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUSDTData();
    
    // Actualiser les données toutes les 30 secondes
    const interval = setInterval(fetchUSDTData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-6 flex items-center justify-center">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-gray-400">Chargement des données USDT...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !usdtData) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-6">
          <p className="text-red-400 text-center">{error || 'Aucune donnée disponible'}</p>
        </CardContent>
      </Card>
    );
  }

  const isPositiveChange = usdtData.change24h >= 0;

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center space-x-2">
          <img 
            src="https://cryptologos.cc/logos/tether-usdt-logo.svg"
            alt="Tether USDT" 
            className="w-6 h-6"
          />
          <span>Tether (USDT)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              {CoinMarketCapService.formatPrice(usdtData.price)}
            </p>
            <div className={`flex items-center space-x-1 ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveChange ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {CoinMarketCapService.formatChange(usdtData.change24h)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-terex-gray">
          <div>
            <p className="text-gray-400 text-sm">Cap. marché</p>
            <p className="text-white font-medium">
              {CoinMarketCapService.formatMarketCap(usdtData.marketCap)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Volume 24h</p>
            <p className="text-white font-medium">
              {CoinMarketCapService.formatVolume(usdtData.volume24h)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
