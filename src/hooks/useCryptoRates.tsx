
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

      // Essayer plusieurs APIs en fallback
      let usdtPriceInUSD = 1.0;
      let usdToCfa = 600;
      let usdToCad = 1.35;

      // 1. Essayer CoinGecko d'abord
      try {
        const usdtResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&include_last_updated_at=true',
          { 
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000) // 10 secondes timeout
          }
        );
        
        if (usdtResponse.ok) {
          const usdtData = await usdtResponse.json();
          if (usdtData.tether?.usd) {
            usdtPriceInUSD = usdtData.tether.usd;
          }
        }
      } catch (error) {
        console.warn('CoinGecko API failed, using fallback price:', error);
      }

      // 2. Essayer ExchangeRate-API pour les taux de change
      try {
        const exchangeResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD',
          { 
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000)
          }
        );
        
        if (exchangeResponse.ok) {
          const exchangeData = await exchangeResponse.json();
          if (exchangeData.rates) {
            usdToCfa = exchangeData.rates.XOF || 600;
            usdToCad = exchangeData.rates.CAD || 1.35;
          }
        }
      } catch (error) {
        console.warn('ExchangeRate API failed, using fallback rates:', error);
      }

      // 3. Si ExchangeRate-API échoue, essayer Fixer.io comme fallback
      if (usdToCfa === 600 && usdToCad === 1.35) {
        try {
          const fixerResponse = await fetch(
            'https://api.fixer.io/latest?base=USD&symbols=XOF,CAD',
            { 
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
              signal: AbortSignal.timeout(10000)
            }
          );
          
          if (fixerResponse.ok) {
            const fixerData = await fixerResponse.json();
            if (fixerData.rates) {
              usdToCfa = fixerData.rates.XOF || 600;
              usdToCad = fixerData.rates.CAD || 1.35;
            }
          }
        } catch (error) {
          console.warn('Fixer API also failed, using default rates:', error);
        }
      }
      
      // Calcul des taux USDT finaux
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
      console.error('Erreur critique lors de la récupération des taux:', error);
      // En cas d'erreur totale, utiliser des taux par défaut mais informer l'utilisateur
      setRates({
        usdtToCfa: 600, // Taux par défaut CFA
        usdtToCad: 1.35, // Taux par défaut CAD
        loading: false,
        error: 'Taux par défaut utilisés - Connexion limitée',
        lastUpdated: new Date()
      });
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
