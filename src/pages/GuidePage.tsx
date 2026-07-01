import { Button } from '@/components/ui/button';
import { Play, Clock, ArrowRight, BookOpen, Shield, Send, Wallet, ArrowRightLeft, Coins, HandCoins } from 'lucide-react';
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
      toast({ title: "Déconnexion réussie", description: "À bientôt" });
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
      <HeaderSection 
        user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-fade-in">
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">Guide</p>
              <h1 className="text-[clamp(1.9rem,5vw,2.6rem)] font-bold text-white tracking-tight leading-[1.1] mb-4">
                Maîtrisez Terex<br />étape par étape
              </h1>
              <p className="text-white/55 text-sm md:text-base max-w-md mb-7">
                Des guides détaillés et illustrés pour toutes vos opérations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowDetailedGuide(true)}
                  className="bg-white hover:bg-white/90 text-[#141414] font-bold rounded-xl px-6 h-11"
                >
                  Guide complet illustré
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right: Inline neutral app mockup */}
            <div className="animate-fade-in">
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Rate card */}
                <div
                  className="rounded-xl p-4 flex items-center justify-between mb-3"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider">Taux USDT / CFA</p>
                      <p className="text-white font-semibold text-lg">660 CFA</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] px-2 py-1 rounded-full text-white/60"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    Live
                  </span>
                </div>
                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Acheter', icon: Coins },
                    { label: 'Vendre', icon: HandCoins },
                    { label: 'Virement', icon: Send },
                  ].map((a) => (
                    <div
                      key={a.label}
                      className="rounded-xl p-3 flex flex-col items-center gap-2"
                      style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        <a.icon className="w-4 h-4" />
                      </div>
                      <span className="text-white/70 text-xs">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Video Guides Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3">Guides vidéo</p>
            <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-bold text-white tracking-tight mb-2">
              Apprenez en regardant
            </h2>
            <p className="text-white/55 text-sm max-w-md">
              Quatre guides vidéo pour couvrir chaque opération essentielle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {guides.map((guide, index) => (
              <button
                key={index}
                onClick={() => setSelectedGuide(guide)}
                className="group relative p-6 rounded-2xl transition-all text-left hover:-translate-y-0.5"
                style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {guide.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.duration}
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/60"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {guide.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="text-white font-semibold text-base mb-1 tracking-tight">{guide.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">{guide.description}</p>

                {/* Steps */}
                <div className="space-y-2 mb-5">
                  {guide.steps.map((step, si) => (
                    <div key={si} className="flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        {si + 1}
                      </span>
                      <span className="text-white/55 text-xs">{step}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-white text-xs font-medium group-hover:gap-2.5 transition-all">
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
        <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3">Commencer</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-bold text-white tracking-tight mb-3">
            Prêt à commencer ?
          </h2>
          <p className="text-white/55 text-sm mb-7 max-w-md mx-auto">
            Créez votre compte et suivez nos guides en quelques minutes.
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-white hover:bg-white/90 text-[#141414] font-bold rounded-xl px-6 h-11"
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
