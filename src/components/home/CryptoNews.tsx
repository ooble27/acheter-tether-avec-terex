
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Calendar } from 'lucide-react';

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
        // Simulation d'actualités crypto (en attendant une vraie API)
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: 'Bitcoin atteint de nouveaux sommets',
            summary: 'Le Bitcoin continue sa progression après les dernières annonces institutionnelles...',
            url: '#',
            published_at: new Date().toISOString(),
            source: 'CryptoNews'
          },
          {
            id: '2',
            title: 'Ethereum 2.0 : Mise à jour majeure',
            summary: 'La blockchain Ethereum franchit une nouvelle étape avec sa dernière mise à jour...',
            url: '#',
            published_at: new Date(Date.now() - 3600000).toISOString(),
            source: 'BlockchainDaily'
          },
          {
            id: '3',
            title: 'USDT : Stabilité confirmée',
            summary: 'Tether maintient sa parité avec le dollar américain malgré la volatilité du marché...',
            url: '#',
            published_at: new Date(Date.now() - 7200000).toISOString(),
            source: 'StablecoinReport'
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
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">📰</span>
            Actualités Crypto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Chargement des actualités...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <span className="mr-2">📰</span>
          Actualités Crypto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((article) => (
          <div key={article.id} className="p-4 bg-terex-dark rounded-lg hover:bg-terex-gray transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-medium text-sm line-clamp-2 flex-1">
                {article.title}
              </h3>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
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
      </CardContent>
    </Card>
  );
}
