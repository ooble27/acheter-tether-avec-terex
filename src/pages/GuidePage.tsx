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
import dashboardPreview from '@/assets/dashboard-preview.jpeg';

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
        <div className="pt-24 sm:pt-28">
          <VideoGuide title={selectedGuide.title} videoUrl={selectedGuide.videoUrl} description={selectedGuide.description} onBack={() => setSelectedGuide(null)} />
        </div>
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
        <div className="pt-24 sm:pt-28 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <UserGuide onBack={() => setShowDetailedGuide(false)} />
          </div>
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
      description: "Achetez des USDT via Wave ou Orange Money, paiement automatique.",
      duration: "15 min",
      difficulty: "Intermédiaire",
      steps: ["Choisir le montant", "Sélectionner la destination", "Payer via Wave/OM", "Recevoir vos USDT"],
      category: "Trading",
      videoUrl: "https://youtu.be/yqMAOvQTzGY?si=O0_LI8sC0877bvL6",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      title: "Transferts internationaux",
      description: "Envoyez de l'argent vers l'Afrique rapidement et à moindre coût.",
      duration: "12 min",
      difficulty: "Intermédiaire",
      steps: ["Choisir le destinataire", "Méthode de réception", "Paiement automatique", "Confirmation"],
      category: "Transferts",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_3",
      icon: <Send className="w-5 h-5" />,
    },
    {
      title: "Sécurité",
      description: "Protégez votre compte avec les bonnes pratiques de sécurité crypto.",
      duration: "20 min",
      difficulty: "Avancé",
      steps: ["Sécuriser votre email", "Reconnaître le phishing", "Vérifier les adresses", "Bonnes pratiques"],
      category: "Sécurité",
      videoUrl: "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID_4",
      icon: <Shield className="w-5 h-5" />,
    }
  ];

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      
      <HeaderSection 
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text */}
            <div>
              <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">/ GUIDE</p>
              <h1 className="text-3xl md:text-5xl font-light text-white mb-4">
                Maîtrisez Terex<br />étape par étape
              </h1>
              <p className="text-white/50 text-sm md:text-base max-w-md mb-6">
                Des guides détaillés avec de vraies captures d'écran pour toutes vos opérations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowDetailedGuide(true)}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-6 h-11"
                >
                  Guide complet illustré
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right: Screenshot preview */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
                <img 
                  src={dashboardPreview} 
                  alt="Aperçu du tableau de bord Terex" 
                  className="w-full"
                  loading="lazy"
                />
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-terex-accent/5 rounded-2xl -z-10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* Video Guides Grid */}
      <section className="py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/30 text-xs uppercase tracking-[0.15em]">Guides vidéo</p>
            <div className="flex items-center gap-1.5 text-white/20 text-xs">
              <Play className="w-3 h-3" />
              4 vidéos disponibles
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {guides.map((guide, index) => (
              <button
                key={index}
                onClick={() => setSelectedGuide(guide)}
                className="group relative p-5 md:p-6 rounded-xl border border-white/[0.08] hover:border-white/[0.15] bg-terex-gray/50 hover:bg-terex-gray/70 transition-all text-left"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-terex-accent/10 flex items-center justify-center text-terex-accent">
                    {guide.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.duration}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      guide.difficulty === 'Débutant' ? 'bg-green-500/10 text-green-400' :
                      guide.difficulty === 'Intermédiaire' ? 'bg-terex-accent/10 text-terex-accent' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>
                      {guide.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="text-white font-medium text-sm md:text-base mb-1">{guide.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">{guide.description}</p>

                {/* Steps */}
                <div className="space-y-1.5 mb-4">
                  {guide.steps.map((step, si) => (
                    <div key={si} className="flex items-center gap-2">
                      <span className="text-white/20 text-[10px] font-mono w-4">{String(si + 1).padStart(2, '0')}</span>
                      <span className="text-white/50 text-xs">{step}</span>
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

      {/* Separator */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* CTA */}
      <section className="py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-light text-white mb-3">
            Prêt à commencer ?
          </h2>
          <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
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
