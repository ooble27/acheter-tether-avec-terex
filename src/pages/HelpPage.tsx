
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Book, MessageCircle, Phone, Mail, HelpCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HelpArticle } from '@/components/features/help/HelpArticle';
import { helpArticles, getArticleById } from '@/data/helpArticles';

const HelpPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        className: "bg-green-600 text-white border-green-600",
      });
      window.location.reload();
    }
  };

  const handleShowDashboard = () => {
    navigate('/');
  };

  const selectedArticle = selectedArticleId ? getArticleById(selectedArticleId) : null;

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-terex-dark">
        <HeaderSection 
          user={user ? {
            email: user.email || '',
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
          } : null}
          onShowDashboard={handleShowDashboard}
          onLogout={handleLogout}
        />
        <HelpArticle 
          article={selectedArticle} 
          onBack={() => setSelectedArticleId(null)}
        />
        <FooterSection />
      </div>
    );
  }

  const helpCategories = [
    {
      title: "Commencer",
      icon: Book,
      articles: helpArticles.filter(a => a.category === "Commencer")
    },
    {
      title: "Acheter USDT",
      icon: HelpCircle,
      articles: helpArticles.filter(a => a.category === "Acheter USDT")
    },
    {
      title: "Vendre USDT",
      icon: MessageCircle,
      articles: helpArticles.filter(a => a.category === "Vendre USDT")
    },
    {
      title: "Transferts Internationaux",
      icon: Phone,
      articles: helpArticles.filter(a => a.category === "Transferts Internationaux")
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-terex-dark">
      <HeaderSection 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={handleShowDashboard}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
              <HelpCircle className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Centre d'Aide</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Comment pouvons-nous vous <span className="text-terex-accent">aider</span> ?
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Trouvez rapidement les réponses à vos questions sur l'utilisation de Terex.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher dans l'aide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-terex-darker border-terex-accent/30 text-white placeholder:text-gray-400 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-terex-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{category.title}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {category.articles.length} articles disponibles
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => setSelectedArticleId(article.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-terex-dark/50 hover:bg-terex-accent/10 text-gray-300 hover:text-white transition-all duration-200 group"
                        >
                          <span>{article.title}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Support */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Notre équipe de support est là pour vous aider 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
              >
                <Mail className="w-4 h-4 mr-2" />
                Nous Contacter
              </Button>
              <Button 
                variant="outline"
                className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10"
                onClick={() => window.location.href = 'tel:+221773972749'}
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp: +1 4182619091
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default HelpPage;
