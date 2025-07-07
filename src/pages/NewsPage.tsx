import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const NewsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to top when component mounts
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
              <TrendingUp className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Dernières Actualités</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Restez Informé avec <span className="text-terex-accent">Terex</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Découvrez les dernières actualités, analyses de marché et mises à jour de notre écosystème. 
              Soyez au courant des tendances crypto-fiat en Afrique.
            </p>
          </div>
        </div>
      </div>

      {/* News Articles */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {[
              {
                title: "Terex lance un nouveau service de transfert d'argent au Sénégal",
                date: "15 Mars 2024",
                author: "Équipe Terex",
                content: "Nous sommes heureux d'annoncer le lancement de notre nouveau service de transfert d'argent au Sénégal. Envoyez de l'argent rapidement et en toute sécurité à vos proches.",
                image: "/news/senegal-transfer.jpg"
              },
              {
                title: "Analyse du marché crypto-fiat en Côte d'Ivoire",
                date: "8 Mars 2024",
                author: "Expert Financier",
                content: "Notre dernière analyse du marché crypto-fiat en Côte d'Ivoire révèle des opportunités passionnantes pour les investisseurs et les utilisateurs de services financiers numériques.",
                image: "/news/cote-ivoire-crypto.jpg"
              },
              {
                title: "Terex participe à la conférence Fintech Africa à Nairobi",
                date: "1 Mars 2024",
                author: "Relations Publiques",
                content: "Terex a participé à la conférence Fintech Africa à Nairobi, où nous avons partagé notre vision de l'avenir des services financiers numériques en Afrique.",
                image: "/news/fintech-africa.jpg"
              }
            ].map((article, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-terex-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-gray/50 group-hover:border-terex-accent/50">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-400 text-sm">{article.date}</span>
                    <span className="mx-3 text-gray-500">•</span>
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-400 text-sm">{article.author}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{article.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{article.content}</p>
                  
                  <Button 
                    className="bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-8 py-3"
                    onClick={() => navigate('/blog-post')}
                  >
                    Lire l'article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default NewsPage;
