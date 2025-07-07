
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, TrendingUp, Globe, Bitcoin, DollarSign, Clock } from 'lucide-react';
import { CryptoNews } from '@/components/home/CryptoNews';

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tous', icon: Globe },
    { id: 'terex', label: 'Terex', icon: DollarSign },
    { id: 'crypto', label: 'Crypto', icon: Bitcoin },
    { id: 'market', label: 'Marchés', icon: TrendingUp }
  ];

  const terexNews = [
    {
      id: 1,
      title: "Terex atteint 10 000 utilisateurs actifs",
      excerpt: "Croissance exceptionnelle avec un triplement du nombre d'utilisateurs en 3 mois",
      content: "Terex franchit une étape majeure avec plus de 10 000 utilisateurs actifs sur sa plateforme d'échange USDT et de transferts vers l'Afrique...",
      category: "terex",
      date: new Date().toISOString(),
      author: "Équipe Terex",
      readTime: "3 min",
      featured: true
    },
    {
      id: 2,
      title: "Nouveau partenariat avec UBA Group",
      excerpt: "Extension des services de transfert vers 15 nouveaux pays africains",
      content: "Terex annonce un partenariat stratégique avec UBA Group, permettant d'étendre ses services de transferts d'argent...",
      category: "terex",
      date: new Date(Date.now() - 86400000).toISOString(),
      author: "Relations Presse",
      readTime: "4 min",
      featured: false
    },
    {
      id: 3,
      title: "Lancement des virements instantanés",
      excerpt: "Nouvelle fonctionnalité pour des transferts en moins de 5 minutes",
      content: "Terex révolutionne les transferts d'argent avec sa nouvelle fonctionnalité de virements instantanés...",
      category: "terex",
      date: new Date(Date.now() - 172800000).toISOString(),
      author: "Équipe Produit",
      readTime: "2 min",
      featured: false
    }
  ];

  const cryptoMarketNews = [
    {
      id: 4,
      title: "USDT maintient sa stabilité face à la volatilité",
      excerpt: "Tether confirme ses réserves et rassure les investisseurs",
      content: "Malgré la volatilité récente du marché crypto, l'USDT maintient sa parité avec le dollar américain...",
      category: "crypto",
      date: new Date(Date.now() - 3600000).toISOString(),
      author: "Crypto Today",
      readTime: "5 min",
      featured: false
    },
    {
      id: 5,
      title: "L'adoption crypto en Afrique atteint des records",
      excerpt: "Le continent africain leader mondial de l'adoption des cryptomonnaies",
      content: "Selon le dernier rapport de Chainalysis, l'Afrique continue de mener l'adoption mondiale des cryptomonnaies...",
      category: "market",
      date: new Date(Date.now() - 7200000).toISOString(),
      author: "Africa Crypto Report",
      readTime: "6 min",
      featured: true
    },
    {
      id: 6,
      title: "Réglementation crypto : avancées en Afrique de l'Ouest",
      excerpt: "Les autorités préparent un cadre réglementaire harmonisé",
      content: "Les autorités monétaires d'Afrique de l'Ouest travaillent sur un cadre réglementaire commun pour les cryptomonnaies...",
      category: "market",
      date: new Date(Date.now() - 10800000).toISOString(),
      author: "Fintech Africa",
      readTime: "4 min",
      featured: false
    }
  ];

  const allNews = [...terexNews, ...cryptoMarketNews];
  const filteredNews = selectedCategory === 'all' ? allNews : allNews.filter(news => news.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours === 1) return 'Il y a 1 heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'terex': return 'bg-terex-accent/20 text-terex-accent';
      case 'crypto': return 'bg-orange-500/20 text-orange-400';
      case 'market': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <div className="bg-terex-darker border-b border-terex-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Actualités <span className="text-terex-accent">Terex</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Restez informé des dernières nouvelles de Terex, des évolutions du marché crypto 
              et des tendances de la fintech africaine.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-terex-accent text-black'
                        : 'bg-terex-darker text-gray-300 hover:bg-terex-gray'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Featured Article */}
            {filteredNews.find(news => news.featured) && (
              <Card className="bg-terex-darker border-terex-accent/30 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-terex-accent text-black">À la une</Badge>
                    <Badge variant="outline" className={getCategoryColor(filteredNews.find(news => news.featured)?.category || '')}>
                      {filteredNews.find(news => news.featured)?.category.toUpperCase()}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {filteredNews.find(news => news.featured)?.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    {filteredNews.find(news => news.featured)?.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center gap-4">
                      <span>{filteredNews.find(news => news.featured)?.author}</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {filteredNews.find(news => news.featured)?.readTime}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(filteredNews.find(news => news.featured)?.date || '')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* News Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredNews.filter(news => !news.featured).map((article) => (
                <Card key={article.id} className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getCategoryColor(article.category)}>
                        {article.category.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(article.date)}
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg leading-tight">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-gray-400 text-xs">
                      <span>{article.author}</span>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Live Crypto News Widget */}
            <div className="mb-8">
              <CryptoNews />
            </div>

            {/* Quick Stats */}
            <Card className="bg-terex-darker border-terex-gray mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
                  Stats Terex
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Volume 24h</span>
                    <span className="text-white font-semibold">$2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Utilisateurs</span>
                    <span className="text-terex-accent font-semibold">10,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pays</span>
                    <span className="text-white font-semibold">25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Transactions</span>
                    <span className="text-green-400 font-semibold">156,890</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-terex-accent/10 to-terex-accent/5 border-terex-accent/30">
              <CardContent className="p-6 text-center">
                <h3 className="text-white font-semibold mb-3">Newsletter Terex</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Recevez les dernières actualités directement dans votre boîte mail
                </p>
                <button 
                  onClick={() => window.location.href = 'mailto:newsletter@terex.com?subject=Inscription Newsletter'}
                  className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  S'abonner
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
