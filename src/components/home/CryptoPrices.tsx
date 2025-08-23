
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export function CryptoPrices() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCryptoPrices = async () => {
    try {
      console.log('Tentative de récupération des prix crypto...');
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana&order=market_cap_desc&per_page=5&page=1'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Prix crypto récupérés avec succès:', data.length, 'cryptos');
      setCryptos(data);
      setError(null);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur lors de la récupération des prix crypto:', error);
      setError('Impossible de récupérer les prix');
      
      // Utiliser des données de fallback si pas de données existantes
      if (cryptos.length === 0) {
        setCryptos([
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            current_price: 42000,
            price_change_percentage_24h: 2.5,
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'eth',
            current_price: 2500,
            price_change_percentage_24h: 1.8,
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
          },
          {
            id: 'tether',
            name: 'Tether',
            symbol: 'usdt',
            current_price: 1.00,
            price_change_percentage_24h: 0.1,
            image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray h-full">
        <CardHeader className="border-b border-terex-gray/30">
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
            Prix des Cryptos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-terex-gray rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-terex-gray rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-terex-gray rounded w-1/3"></div>
                  </div>
                  <div className="h-4 bg-terex-gray rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray h-full">
      <CardHeader className="border-b border-terex-gray/30">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
            Prix des Cryptos
          </div>
          <div className="flex items-center space-x-2">
            {error && (
              <AlertCircle className="w-4 h-4 text-yellow-400" title={error} />
            )}
            <RefreshCw 
              className="w-4 h-4 text-terex-accent cursor-pointer hover:animate-spin" 
              onClick={() => {
                setLoading(true);
                fetchCryptoPrices();
              }}
            />
          </div>
        </CardTitle>
        {lastUpdate && (
          <p className="text-xs text-gray-500 mt-1">
            Dernière mise à jour: {formatTime(lastUpdate)}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {cryptos.map((crypto) => (
            <div key={crypto.id} className="flex items-center justify-between p-3 bg-terex-dark rounded-lg hover:bg-terex-gray/30 transition-colors">
              <div className="flex items-center space-x-3">
                <img 
                  src={crypto.image} 
                  alt={crypto.name} 
                  className="w-8 h-8"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div>
                  <p className="text-white font-medium text-sm">{crypto.symbol.toUpperCase()}</p>
                  <p className="text-gray-400 text-xs">{crypto.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">${crypto.current_price.toLocaleString()}</p>
                <div className={`flex items-center text-xs ${
                  crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {crypto.price_change_percentage_24h >= 0 ? 
                    <TrendingUp className="w-3 h-3 mr-1" /> : 
                    <TrendingDown className="w-3 h-3 mr-1" />
                  }
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-xs text-center">
              Connexion limitée - Données en cache
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
