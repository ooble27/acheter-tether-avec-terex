import { Button } from '@/components/ui/button';
import { Play, Clock, ArrowRight, ArrowLeft, BookOpen, Shield, Send, Wallet } from 'lucide-react';
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
  icon: React.ReactNode;
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
    if (!error) {
      toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" });
      window.location.reload();
    }
  };

  // Video sub-view
  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-terex-dark">
        <HeaderSection 
          user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
          onShowDashboard={() => navigate('/')}
          onLogout={handleLogout}
        />
        <VideoGuide title={selectedGuide.title} videoUrl={selectedGuide.videoUrl} description={selectedGuide.description} onBack={() => setSelectedGuide(null)} />
        <FooterSection />
      </div>
    );
  }

  // Detailed guide sub-view
  if (showDetailedGuide) {
    return (
      <div className="min-h-screen bg-terex-dark">
        <HeaderSection 
          user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
          onShowDashboard={() => navigate('/')}
          onLogout={handleLogout}
        />
        <div className="h-16 md:h-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <UserGuide onBack={() => setShowDetailedGuide(false)} />
        </div>
        <FooterSection />
      </div>
    );
  }

  const guides: Guide[] = [
    {
      title: "Démarrage rapide",
      description: "Créez votre compte et effectuez votre première transaction en quelques minutes.",
      duration: "10 min",
      difficulty: "Débutant",
      steps: ["Créer votre compte", "Vérifier votre identité", "Première transaction", "Configurer vos préférences"],
      category: "Démarrage",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_1",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "Acheter des USDT",
      description: "Guide complet pour acheter des USDT via Mobile Money en toute sécurité.",
      duration: "15 min",
      difficulty: "Intermédiaire",
      steps: ["Choisir le montant", "Sélectionner le paiement", "Confirmer la transaction", "Recevoir vos USDT"],
      category: "Trading",
      videoUrl: "https://youtu.be/yqMAOvQTzGY?si=O0_LI8sC0877bvL6",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      title: "Transferts internationaux",
      description: "Envoyez de l'argent vers l'Afrique rapidement et à moindre coût.",
      duration: "12 min",
      difficulty: "Intermédiaire",
      steps: ["Informations du destinataire", "Méthode de réception", "Confirmer le transfert", "Suivre l'envoi"],
      category: "Transferts",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_3",
      icon: <Send className="w-5 h-5" />,
    },
    {
      title: "Sécurité",
      description: "Protégez votre compte avec les bonnes pratiques de sécurité crypto.",
      duration: "20 min",
      difficulty: "Avancé",
      steps: ["Authentification 2FA", "Reconnaître le phishing", "Sécuriser vos wallets", "Bonnes pratiques"],
      category: "Sécurité",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_4",
      icon: <Shield className="w-5 h-5" />,
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      
      <HeaderSection 
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />

      <div className="h-16 md:h-20" />

      {/* Hero */}
      <section className="pt-12 pb-6 md:pt-24 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ GUIDE</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-3">
            Maîtrisez Terex étape par étape
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8">
            Des guides détaillés pour toutes vos opérations
          </p>
          <Button 
            onClick={() => setShowDetailedGuide(true)}
            className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-6 h-11"
          >
            Guide complet avec captures d'écran
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Dashed separator */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* Guides Grid */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Guides disponibles</p>
          
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {guides.map((guide, index) => (
              <button
                key={index}
                onClick={() => setSelectedGuide(guide)}
                className="group p-5 md:p-6 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left"
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-muted-foreground">
                    {guide.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.duration}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      guide.difficulty === 'Débutant' ? 'bg-white/[0.06] text-white/50' :
                      guide.difficulty === 'Intermédiaire' ? 'bg-terex-accent/10 text-terex-accent' :
                      'bg-white/[0.06] text-white/50'
                    }`}>
                      {guide.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="text-foreground font-medium text-sm md:text-base mb-1">{guide.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4">{guide.description}</p>

                {/* Steps */}
                <div className="space-y-1.5 mb-4">
                  {guide.steps.map((step, si) => (
                    <div key={si} className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[10px] font-mono w-4">{String(si + 1).padStart(2, '0')}</span>
                      <span className="text-foreground/70 text-xs">{step}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-terex-accent text-xs font-medium group-hover:gap-2.5 transition-all">
                  <Play className="w-3 h-3" />
                  Regarder la vidéo
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dashed separator */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* CTA */}
      <section className="py-10 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-3">
            Prêt à commencer ?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Créez votre compte et suivez nos guides
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-6 h-11"
          >
            Créer mon compte
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default GuidePage;
