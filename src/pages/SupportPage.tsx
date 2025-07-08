
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Mail, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SupportPage = () => {
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
              <MessageCircle className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Besoin d'Aide ?</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Notre <span className="text-terex-accent">Support</span> est là pour vous
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Contactez notre équipe d'assistance dédiée pour toute question ou problème. 
              Nous sommes disponibles 24h/7j pour vous aider.
            </p>
            
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">24/7</div>
                <div className="text-gray-400">Disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">5 min</div>
                <div className="text-gray-400">Temps de réponse moyen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-terex-accent mb-2">99%</div>
                <div className="text-gray-400">Satisfaction client</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Comment pouvons-nous vous aider ?</h2>
            <p className="text-gray-300 text-lg">Choisissez l'option qui vous convient le mieux</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* WhatsApp Support */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-terex-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-gray/50 group-hover:border-terex-accent/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">WhatsApp</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Contactez-nous directement sur WhatsApp pour une assistance rapide.
                </p>
                
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  Réponse immédiate
                </Badge>
                
                <Button 
                  className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 w-full"
                  onClick={() => window.open('https://wa.me/14182619091', '_blank')}
                >
                  +1 (418) 261-9091
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Email Support */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-terex-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-gray/50 group-hover:border-terex-accent/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-terex-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Support par email</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Envoyez-nous un email et nous vous répondrons rapidement.
                </p>
                
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  Réponse en 24 heures
                </Badge>
                
                <Button 
                  className="mt-6 bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-6 py-3 w-full"
                  onClick={() => window.location.href = 'mailto:terangaexchange@gmail.com'}
                >
                  terangaexchange@gmail.com
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Phone Support */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-terex-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-terex-darker to-terex-gray/30 rounded-2xl p-8 border border-terex-gray/50 group-hover:border-terex-accent/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-terex-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Support téléphonique</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Appelez-nous pour une assistance immédiate (Canada/International).
                </p>
                
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  Disponible 24/7
                </Badge>
                
                <Button 
                  className="mt-6 bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold px-6 py-3 w-full"
                  onClick={() => window.location.href = 'tel:+14182619091'}
                >
                  +1 (418) 261-9091
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Terex Support */}
      <div className="py-24 bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker border-t border-terex-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Pourquoi choisir le support Terex ?</h2>
            <p className="text-gray-300 text-lg">Un support client de qualité pour une expérience optimale</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Expertise */}
            <div className="text-center">
              <div className="w-16 h-16 bg-terex-accent/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Expertise</h3>
              <p className="text-gray-300 leading-relaxed">
                Nos agents sont formés pour répondre à toutes vos questions.
              </p>
            </div>

            {/* Rapidité */}
            <div className="text-center">
              <div className="w-16 h-16 bg-terex-accent/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Rapidité</h3>
              <p className="text-gray-300 leading-relaxed">
                Nous nous engageons à vous répondre dans les plus brefs délais.
              </p>
            </div>

            {/* Disponibilité */}
            <div className="text-center">
              <div className="w-16 h-16 bg-terex-accent/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Disponibilité</h3>
              <p className="text-gray-300 leading-relaxed">
                Notre équipe est disponible 24h/7j pour vous assister.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default SupportPage;
