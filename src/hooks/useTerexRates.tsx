
import { useCryptoRates } from './useCryptoRates';

interface TerexRates {
  // Taux d'achat (TEREX vend USDT)
  terexRateCfa: number;
  terexRateCad: number;
  // Taux de vente (TEREX achète USDT)
  terexBuyRateCfa: number;
  terexBuyRateCad: number;
  // Taux du marché
  marketRateCfa: number;
  marketRateCad: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  marginPercentage: number;
}

export function useTerexRates(marginPercentage: number = 2) {
  const { usdtToCfa, usdtToCad, loading, error, lastUpdated, refresh } = useCryptoRates();

  // Calcul des taux TEREX d'achat (avec marge)
  const terexRateCfa = Math.round(usdtToCfa * (1 + marginPercentage / 100));
  const terexRateCad = Math.round((usdtToCad * (1 + marginPercentage / 100)) * 100) / 100;

  // Calcul des taux TEREX d'achat d'USDT (avec réduction de 10 CFA et proportionnelle pour CAD)
  const terexBuyRateCfa = Math.round(usdtToCfa - 10);
  const cfaReductionPercentage = 10 / usdtToCfa; // Calculer le pourcentage de réduction
  const terexBuyRateCad = Math.round((usdtToCad * (1 - cfaReductionPercentage)) * 100) / 100;

  return {
    terexRateCfa,
    terexRateCad,
    terexBuyRateCfa,
    terexBuyRateCad,
    marketRateCfa: usdtToCfa,
    marketRateCad: usdtToCad,
    loading,
    error,
    lastUpdated,
    marginPercentage,
    refresh
  };
}
