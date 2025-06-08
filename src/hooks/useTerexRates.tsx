
import { useCryptoRates } from './useCryptoRates';

interface TerexRates {
  terexRateCfa: number;
  terexRateCad: number;
  marketRateCfa: number;
  marketRateCad: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  marginPercentage: number;
}

export function useTerexRates(marginPercentage: number = 2) {
  const { usdtToCfa, usdtToCad, loading, error, lastUpdated, refresh } = useCryptoRates();

  // Calcul des taux TEREX avec marge
  const terexRateCfa = Math.round(usdtToCfa * (1 + marginPercentage / 100));
  const terexRateCad = Math.round((usdtToCad * (1 + marginPercentage / 100)) * 100) / 100;

  return {
    terexRateCfa,
    terexRateCad,
    marketRateCfa: usdtToCfa,
    marketRateCad: usdtToCad,
    loading,
    error,
    lastUpdated,
    marginPercentage,
    refresh
  };
}
