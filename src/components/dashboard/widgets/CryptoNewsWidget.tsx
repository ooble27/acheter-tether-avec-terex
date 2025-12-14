import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ExternalLink, Newspaper, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  tag?: string;
}

const staticNews: NewsItem[] = [
  {
    id: '1',
    title: "Bitcoin atteint un nouveau record historique au-dessus de 100 000$",
    source: "CoinDesk",
    url: "#",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tag: "BTC"
  },
  {
    id: '2', 
    title: "L'adoption de l'USDT en Afrique augmente de 150% en 2024",
    source: "Bloomberg",
    url: "#",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    tag: "USDT"
  },
  {
    id: '3',
    title: "Tether renforce ses réserves avec des obligations américaines",
    source: "Reuters",
    url: "#",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    tag: "USDT"
  },
  {
    id: '4',
    title: "Les transferts crypto en Afrique de l'Ouest en forte hausse",
    source: "CoinTelegraph",
    url: "#",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    tag: "Afrique"
  }
];

export function CryptoNewsWidget() {
  const [news, setNews] = useState<NewsItem[]>(staticNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}j`;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-accent/20 p-4 rounded-xl">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-terex-gray/30 rounded w-24" />
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-terex-gray/30 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-accent/20 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-terex-accent" />
          <h3 className="text-white font-semibold text-sm">Actualités</h3>
        </div>
        <a href="#" className="text-gray-400 text-xs hover:text-terex-accent transition-colors flex items-center gap-1">
          Voir tout
          <ChevronRight className="w-3 h-3" />
        </a>
      </div>
      
      <div className="space-y-2">
        {news.slice(0, 4).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg bg-terex-gray/10 hover:bg-terex-gray/20 border border-transparent hover:border-terex-gray/30 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.tag && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-terex-accent/20 text-terex-accent">
                      {item.tag}
                    </span>
                  )}
                  <span className="text-gray-500 text-[10px]">{item.source}</span>
                </div>
                <h4 className="text-gray-200 text-sm font-medium line-clamp-2 group-hover:text-white transition-colors">
                  {item.title}
                </h4>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-gray-500 text-[10px]">{formatTime(item.publishedAt)}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-terex-accent transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}
