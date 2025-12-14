import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

// Static news items as fallback (API-independent)
const staticNews: NewsItem[] = [
  {
    id: '1',
    title: 'Le Bitcoin atteint de nouveaux sommets en 2024',
    source: 'CryptoNews',
    url: '#',
    publishedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'USDT maintient sa position de stablecoin leader',
    source: 'CoinDesk',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: "L'adoption crypto progresse en Afrique de l'Ouest",
    source: 'BlockchainAfrica',
    url: '#',
    publishedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'Binance annonce de nouvelles fonctionnalités P2P',
    source: 'Binance Blog',
    url: '#',
    publishedAt: new Date(Date.now() - 10800000).toISOString()
  }
];

export function CryptoNewsWidget() {
  const [news, setNews] = useState<NewsItem[]>(staticNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading then show static news
    // In production, you would fetch from a crypto news API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${Math.floor(diffHours / 24)}j`;
  };

  if (loading) {
    return (
      <Card className="bg-terex-darker border-terex-gray p-4">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="w-4 h-4 text-terex-accent" />
          <h3 className="text-white font-semibold text-sm">Actualités Crypto</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-terex-gray rounded w-full mb-2" />
              <div className="h-3 bg-terex-gray rounded w-1/3" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-terex-darker border-terex-gray p-4">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-4 h-4 text-terex-accent" />
        <h3 className="text-white font-semibold text-sm">Actualités Crypto</h3>
      </div>
      
      <div className="space-y-3">
        {news.slice(0, 4).map((item) => (
          <div 
            key={item.id}
            className="group p-3 bg-terex-dark rounded-lg hover:bg-terex-gray/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-terex-accent transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-terex-accent text-xs font-medium">{item.source}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.publishedAt)}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-terex-accent transition-colors flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
