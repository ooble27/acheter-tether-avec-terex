
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  published_at: string;
  source: string;
}

export function CryptoNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: 'Bitcoin atteint de nouveaux sommets',
            summary: 'Le Bitcoin continue sa progression après les dernières annonces institutionnelles...',
            url: 'https://coinmarketcap.com/alexandria/article/bitcoin-hits-new-highs',
            published_at: new Date().toISOString(),
            source: 'CoinMarketCap'
          },
          {
            id: '2',
            title: 'Ethereum 2.0 : Mise à jour majeure',
            summary: 'La blockchain Ethereum franchit une nouvelle étape avec sa dernière mise à jour...',
            url: 'https://coinmarketcap.com/alexandria/article/ethereum-2-major-update',
            published_at: new Date(Date.now() - 3600000).toISOString(),
            source: 'CoinMarketCap'
          },
          {
            id: '3',
            title: 'USDT : Stabilité confirmée',
            summary: 'Tether maintient sa parité avec le dollar américain malgré la volatilité du marché...',
            url: 'https://coinmarketcap.com/alexandria/article/usdt-stability-confirmed',
            published_at: new Date(Date.now() - 7200000).toISOString(),
            source: 'CoinMarketCap'
          },
          {
            id: '4',
            title: 'DeFi : Croissance continue',
            summary: 'Les protocoles DeFi maintiennent leur croissance avec de nouveaux records...',
            url: 'https://coinmarketcap.com/alexandria/article/defi-continued-growth',
            published_at: new Date(Date.now() - 10800000).toISOString(),
            source: 'DeFiPulse'
          }
        ];
        
        setNews(mockNews);
      } catch (error) {
        console.error('Erreur lors de la récupération des actualités:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoNews();
    const interval = setInterval(fetchCryptoNews, 300000); // Actualise toutes les 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours === 1) return 'Il y a 1 heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray h-full">
        <CardHeader className="border-b border-terex-gray/30">
          <CardTitle className="text-white flex items-center">
            <Newspaper className="w-5 h-5 mr-2 text-terex-accent" />
            Actualités Crypto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-terex-gray rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-terex-gray rounded w-full mb-1"></div>
                <div className="h-3 bg-terex-gray rounded w-1/2"></div>
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
          <Newspaper className="w-5 h-5 mr-2 text-terex-accent" />
          Actualités Crypto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {news.map((article) => (
            <div 
              key={article.id} 
              className="p-3 bg-terex-dark rounded-lg hover:bg-terex-gray/30 transition-colors cursor-pointer group"
              onClick={() => window.open(article.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium text-sm line-clamp-2 flex-1 group-hover:text-terex-accent transition-colors">
                  {article.title}
                </h3>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0 group-hover:text-terex-accent transition-colors" />
              </div>
              <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                {article.summary}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-terex-accent">{article.source}</span>
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(article.published_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
