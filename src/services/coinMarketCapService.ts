
interface USDTData {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

// Service pour récupérer les données de Tether depuis CoinMarketCap
export class CoinMarketCapService {
  private static readonly API_BASE = 'https://pro-api.coinmarketcap.com/v1';
  
  // Pour une démo, nous utiliserons des données simulées
  // En production, vous devriez utiliser votre clé API CoinMarketCap
  static async getUSDTData(): Promise<USDTData> {
    try {
      // Simulation de l'appel API avec des données réalistes
      // En production, remplacez par un vrai appel API avec votre clé
      const mockData: USDTData = {
        price: 1.0001,
        change24h: 0.02,
        marketCap: 97500000000,
        volume24h: 25600000000
      };
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données USDT:', error);
      throw new Error('Impossible de récupérer les données USDT');
    }
  }
  
  static formatPrice(price: number): string {
    return `$${price.toFixed(4)}`;
  }
  
  static formatMarketCap(marketCap: number): string {
    return `$${(marketCap / 1000000000).toFixed(1)}B`;
  }
  
  static formatVolume(volume: number): string {
    return `$${(volume / 1000000000).toFixed(1)}B`;
  }
  
  static formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }
}
