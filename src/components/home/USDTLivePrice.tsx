
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface USDTData {
  usd_price: number;
  fcfa_price: number;
  cad_price: number;
  last_updated: string;
}

export function USDTLivePrice() {
  const [usdtData, setUsdtData] = useState<USDTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Taux de change approximatifs (dans une vraie app, ces taux viendraient aussi d'une API)
  const USD_TO_FCFA = 600; // 1 USD = 600 FCFA environ
  const USD_TO_CAD = 1.35;  // 1 USD = 1.35 CAD environ

  const fetchUSDTPrice = async () => {
    try {
      console.log('Tentative de récupération du prix USDT...');
      
      // Récupération du prix USDT depuis CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&include_last_updated_at=true'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Prix USDT récupéré avec succès:', data);
      
      const usdPrice = data.tether.usd;
      const fcfaPrice = usdPrice * USD_TO_FCFA;
      const cadPrice = usdPrice * USD_TO_CAD;
      
      setUsdtData({
        usd_price: usdPrice,
        fcfa_price: fcfaPrice,
        cad_price: cadPrice,
        last_updated: new Date().toISOString()
      });
      
      setLastUpdate(new Date());
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération du prix USDT:', error);
      setError('Connexion limitée à l\'API');
      
      // Utiliser des données de fallback si pas de données existantes
      if (!usdtData) {
        console.log('Utilisation des données de fallback pour USDT');
        const fallbackUsdPrice = 1.0000;
        setUsdtData({
          usd_price: fallbackUsdPrice,
          fcfa_price: fallbackUsdPrice * USD_TO_FCFA,
          cad_price: fallbackUsdPrice * USD_TO_CAD,
          last_updated: new Date().toISOString()
        });
      }
      
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUSDTPrice();
    
    // Mise à jour toutes les 60 secondes
    const interval = setInterval(fetchUSDTPrice, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleRefresh = () => {
    console.log('Actualisation manuelle demandée');
    setLoading(true);
    fetchUSDTPrice();
  };

  if (loading && !usdtData) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">💰</span>
            Prix USDT en Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Chargement du prix USDT...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-accent/30 shadow-xl shadow-terex-accent/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <span className="mr-2">💰</span>
            Prix USDT en Temps Réel
          </span>
          <div className="flex items-center space-x-2">
            {error && (
              <AlertCircle className="w-4 h-4 text-yellow-400" title={error} />
            )}
            <RefreshCw 
              className={`w-4 h-4 text-terex-accent cursor-pointer hover:text-terex-accent/80 ${loading ? 'animate-spin' : ''}`} 
              onClick={handleRefresh}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usdtData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-terex-dark to-terex-gray/30 rounded-xl border border-terex-gray/50">
                <p className="text-gray-400 text-sm mb-1">USD</p>
                <p className="text-white font-bold text-xl">
                  ${usdtData.usd_price.toFixed(4)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-xl border border-terex-accent/30">
                <p className="text-gray-400 text-sm mb-1">FCFA</p>
                <p className="text-terex-accent font-bold text-xl">
                  {usdtData.fcfa_price.toLocaleString('fr-FR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })} FCFA
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl border border-green-500/30">
                <p className="text-gray-400 text-sm mb-1">CAD</p>
                <p className="text-green-400 font-bold text-xl">
                  ${usdtData.cad_price.toFixed(4)} CAD
                </p>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
              <span>Dernière mise à jour : {formatTime(lastUpdate)}</span>
            </div>
            
            {error && (
              <div className="text-center p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  Connexion limitée - Prix approximatif
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
