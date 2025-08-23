
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana&order=market_cap_desc&per_page=5&page=1'
        );
        const data = await response.json();
        setCryptos(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des prix:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

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
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
          Prix des Cryptos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {cryptos.map((crypto) => (
            <div key={crypto.id} className="flex items-center justify-between p-3 bg-terex-dark rounded-lg hover:bg-terex-gray/30 transition-colors">
              <div className="flex items-center space-x-3">
                <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
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
      </CardContent>
    </Card>
  );
}
