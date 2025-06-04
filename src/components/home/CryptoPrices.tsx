
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
        // Utilisation de l'API publique CoinGecko (alternative à CoinMarketCap)
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
    // Actualiser les prix toutes les 30 secondes
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">💰</span>
            Prix des Cryptos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Chargement des prix...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <span className="mr-2">💰</span>
          Prix des Cryptos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="flex items-center justify-between p-3 bg-terex-dark rounded-lg">
            <div className="flex items-center space-x-3">
              <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
              <div>
                <p className="text-white font-medium">{crypto.symbol.toUpperCase()}</p>
                <p className="text-gray-400 text-sm">{crypto.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">${crypto.current_price.toLocaleString()}</p>
              <div className={`flex items-center text-sm ${
                crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {crypto.price_change_percentage_24h >= 0 ? 
                  <TrendingUp className="w-4 h-4 mr-1" /> : 
                  <TrendingDown className="w-4 h-4 mr-1" />
                }
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
