
import { useState, useEffect } from 'react';

interface CryptoRates {
  usdtToCfa: number;
  usdtToCad: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// ── Cache partagé au niveau module ──────────────────────────────────────────
// Évite que chaque page qui monte le hook repasse par `loading: true`
// (ce qui provoquait un flash « chargement » à chaque navigation).
let sharedRates: CryptoRates = {
  usdtToCfa: 600,
  usdtToCad: 1.35,
  loading: true,
  error: null,
  lastUpdated: null,
};

const listeners = new Set<(r: CryptoRates) => void>();
let intervalStarted = false;

function setShared(next: CryptoRates) {
  sharedRates = next;
  listeners.forEach(l => l(sharedRates));
}

async function fetchRatesShared() {
  try {
    // On ne remet PAS loading à true si on a déjà des données fraîches —
    // on rafraîchit en arrière-plan sans flash.
    if (!sharedRates.lastUpdated) {
      setShared({ ...sharedRates, loading: true, error: null });
    }

    let usdtPriceInUSD = 1.0;
    let usdToCfa = 600;
    let usdToCad = 1.35;

    // 1. CoinGecko (prix USDT)
    try {
      const usdtResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&include_last_updated_at=true',
        { method: 'GET', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) }
      );
      if (usdtResponse.ok) {
        const usdtData = await usdtResponse.json();
        if (usdtData.tether?.usd) usdtPriceInUSD = usdtData.tether.usd;
      }
    } catch (error) {
      console.warn('CoinGecko API failed, using fallback price:', error);
    }

    // 2. ExchangeRate-API (taux de change)
    try {
      const exchangeResponse = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD',
        { method: 'GET', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) }
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

    // 3. Fixer.io fallback
    if (usdToCfa === 600 && usdToCad === 1.35) {
      try {
        const fixerResponse = await fetch(
          'https://api.fixer.io/latest?base=USD&symbols=XOF,CAD',
          { method: 'GET', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) }
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

    const usdtToCfa = usdtPriceInUSD * usdToCfa;
    const usdtToCad = usdtPriceInUSD * usdToCad;

    setShared({
      usdtToCfa: Math.round(usdtToCfa * 100) / 100,
      usdtToCad: Math.round(usdtToCad * 100) / 100,
      loading: false,
      error: null,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Erreur critique lors de la récupération des taux:', error);
    setShared({
      usdtToCfa: sharedRates.usdtToCfa || 600,
      usdtToCad: sharedRates.usdtToCad || 1.35,
      loading: false,
      error: 'Taux par défaut utilisés - Connexion limitée',
      lastUpdated: new Date(),
    });
  }
}

export function useCryptoRates() {
  const [rates, setRates] = useState<CryptoRates>(sharedRates);

  useEffect(() => {
    // S'abonner aux mises à jour partagées
    listeners.add(setRates);
    // Synchroniser immédiatement avec l'état partagé courant
    setRates(sharedRates);

    // Démarrer le fetch + l'intervalle une seule fois pour toute l'app
    if (!intervalStarted) {
      intervalStarted = true;
      fetchRatesShared();
      setInterval(fetchRatesShared, 20 * 1000);
    }

    return () => {
      listeners.delete(setRates);
    };
  }, []);

  return { ...rates, refresh: fetchRatesShared };
}
