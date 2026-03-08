
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, User, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserGuide } from '@/components/features/UserGuide';
import { VideoGuide } from '@/components/features/VideoGuide';

interface Guide {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  steps: string[];
  category: string;
  videoUrl: string;
}

const GuidePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDetailedGuide, setShowDetailedGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

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

  // Afficher la vidéo du guide sélectionné
  if (selectedGuide) {
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
        
        <VideoGuide
          title={selectedGuide.title}
          videoUrl={selectedGuide.videoUrl}
          description={selectedGuide.description}
          onBack={() => setSelectedGuide(null)}
        />
        
        <FooterSection />
      </div>
    );
  }

  // Afficher le guide complet avec captures d'écran
  if (showDetailedGuide) {
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserGuide onBack={() => setShowDetailedGuide(false)} />
        </div>
        
        <FooterSection />
      </div>
    );
  }

  const guides: Guide[] = [
    {
      title: "Guide de Démarrage Rapide",
      description: "Apprenez les bases de Terex en 10 minutes",
      duration: "10 min",
      difficulty: "Débutant",
      steps: [
        "Créer votre compte",
        "Vérifier votre identité",
        "Effectuer votre première transaction",
        "Configurer vos préférences"
      ],
      category: "Démarrage",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_1"
    },
    {
      title: "Maîtriser l'Achat d'USDT",
      description: "Guide complet pour acheter des USDT en toute sécurité",
      duration: "15 min",
      difficulty: "Intermédiaire",
      steps: [
        "Choisir le montant",
        "Sélectionner la méthode de paiement",
        "Confirmer la transaction",
        "Recevoir vos USDT"
      ],
      category: "Trading",
      videoUrl: "https://youtu.be/yqMAOvQTzGY?si=O0_LI8sC0877bvL6"
    },
    {
      title: "Transferts Internationaux",
      description: "Envoyez de l'argent vers l'Afrique facilement",
      duration: "12 min",
      difficulty: "Intermédiaire",
      steps: [
        "Saisir les informations du destinataire",
        "Choisir la méthode de réception",
        "Confirmer le transfert",
        "Suivre l'envoi"
      ],
      category: "Transferts",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_3"
    },
    {
      title: "Sécurité et Bonnes Pratiques",
      description: "Protégez votre compte et vos transactions",
      duration: "20 min",
      difficulty: "Avancé",
      steps: [
        "Configurer l'authentification 2FA",
        "Reconnaître les tentatives de phishing",
        "Sécuriser vos wallets",
        "Bonnes pratiques de trading"
      ],
      category: "Sécurité",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_4"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-600';
      case 'Intermédiaire': return 'bg-yellow-600';
      case 'Avancé': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background pattern - white with more density like Attio */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
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
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Maîtrisez <span className="text-terex-accent">Terex</span> étape par étape
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Des guides détaillés pour vous accompagner dans toutes vos opérations crypto-fiat.
            </p>

            {/* Guide complet button */}
            <Button 
              onClick={() => setShowDetailedGuide(true)}
              size="lg"
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl mb-8"
            >
              📖 Guide Complet avec Captures d'Écran
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <Card key={index} className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20 hover:border-terex-accent/40 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-terex-accent border-terex-accent/30">
                          {guide.category}
                        </Badge>
                        <Badge className={`${getDifficultyColor(guide.difficulty)} text-white`}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-xl mb-2">{guide.title}</CardTitle>
                      <CardDescription className="text-gray-300 text-base">
                        {guide.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm ml-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {guide.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {guide.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-terex-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-terex-accent text-sm font-medium">{stepIndex + 1}</span>
                        </div>
                        <span className="text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => setSelectedGuide(guide)}
                    className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black font-semibold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Regarder la Vidéo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Prêt à commencer ?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Créez votre compte et suivez nos guides pour réussir vos premières transactions
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl"
            >
              Créer mon Compte
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default GuidePage;
