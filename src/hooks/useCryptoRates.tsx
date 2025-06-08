
import { useState, useEffect } from 'react';

interface CryptoRates {
  usdtToCfa: number;
  usdtToCad: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useCryptoRates() {
  const [rates, setRates] = useState<CryptoRates>({
    usdtToCfa: 600, // Valeur par défaut
    usdtToCad: 1.35, // Valeur par défaut
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchRates = async () => {
    try {
      setRates(prev => ({ ...prev, loading: true, error: null }));

      // API CoinGecko gratuite pour récupérer le prix USDT en USD
      const usdtResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&include_last_updated_at=true'
      );
      
      if (!usdtResponse.ok) {
        throw new Error('Erreur lors de la récupération du prix USDT');
      }
      
      const usdtData = await usdtResponse.json();
      const usdtPriceInUSD = usdtData.tether.usd;

      // API pour les taux de change USD vers autres devises
      const exchangeResponse = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      
      if (!exchangeResponse.ok) {
        throw new Error('Erreur lors de la récupération des taux de change');
      }
      
      const exchangeData = await exchangeResponse.json();
      
      // Calcul des taux USDT
      const usdToCfa = exchangeData.rates.XOF || 600; // XOF = Franc CFA
      const usdToCad = exchangeData.rates.CAD || 1.35;
      
      const usdtToCfa = usdtPriceInUSD * usdToCfa;
      const usdtToCad = usdtPriceInUSD * usdToCad;

      setRates({
        usdtToCfa: Math.round(usdtToCfa * 100) / 100,
        usdtToCad: Math.round(usdtToCad * 100) / 100,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des taux:', error);
      setRates(prev => ({
        ...prev,
        loading: false,
        error: 'Impossible de récupérer les taux actuels'
      }));
    }
  };

  useEffect(() => {
    fetchRates();
    
    // Mise à jour toutes les 20 secondes
    const interval = setInterval(fetchRates, 20 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { ...rates, refresh: fetchRates };
}
