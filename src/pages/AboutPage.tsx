import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Globe, TrendingUp, Award, Shield, Target, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AboutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" }); window.location.reload(); }
  };

  const team = [
    { name: "Mohamed Lo", role: "CEO & Fondateur", bio: "Visionnaire passionné par l'innovation fintech en Afrique, avec une expertise en blockchain et services financiers numériques" },
    { name: "Sidi Ndiaye", role: "Directeur des Opérations", bio: "Expert en gestion des opérations et coordination d'équipes, spécialisé dans l'optimisation des processus" },
    { name: "Adechina Olaitan", role: "Head of Marketing", bio: "Spécialiste du marketing digital et de la communication stratégique pour l'écosystème fintech africain" }
  ];

  const milestones = [
    { year: "2024", title: "Fondation de Terex", desc: "Lancement officiel à Dakar" },
    { year: "Q2 2024", title: "Partenariats clés", desc: "Orange Money et Free Money" },
    { year: "Q3 2024", title: "Lancement MVP", desc: "Version bêta au Sénégal" },
    { year: "Q4 2024", title: "Expansion UEMOA", desc: "Burkina, Côte d'Ivoire, Mali" },
    { year: "2025", title: "Croissance régionale", desc: "Toute la zone UEMOA" }
  ];

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div className="h-16 md:h-20" />

      {/* Hero */}
      <section className="pt-12 pb-6 md:pt-24 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ À PROPOS</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-2">
            À propos de Terex
          </h1>
          <p className="text-terex-accent text-sm font-medium mb-4">Teranga Exchange</p>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            La première plateforme d'échange crypto-fiat dédiée à l'Afrique francophone
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Mission */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-4">Notre Mission</p>
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-4">
                Chez Terex, nous croyons que chaque africain mérite un accès simple et sécurisé aux services financiers numériques.
              </p>
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
                Notre plateforme connecte les crypto-monnaies aux monnaies locales (FCFA), facilitant les échanges et les transferts via Orange Money et Wave.
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-4">Vision 2030</p>
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-4">
                Devenir la référence ouest-africaine pour les échanges crypto-fiat en servant plus d'un million d'utilisateurs.
              </p>
              <div className="space-y-2 mt-4">
                {["Zone UEMOA complète", "1M+ utilisateurs actifs", "100M+ FCFA de volume"].map((goal, i) => (
                  <div key={i} className="flex items-center gap-2 text-foreground/60 text-xs">
                    <div className="w-1 h-1 bg-terex-accent rounded-full" />
                    {goal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Stats */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">En chiffres</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { value: "99.9%", label: "Disponibilité" },
              { value: "24/7", label: "Support" },
              { value: "< 5min", label: "Temps moyen" },
              { value: "500+", label: "Utilisateurs" }
            ].map((stat, i) => (
              <div key={i} className="p-4 md:p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                <p className="text-terex-accent text-xl md:text-2xl font-semibold mb-1">{stat.value}</p>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Timeline */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Parcours</p>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <span className="text-terex-accent text-xs font-mono font-medium min-w-[70px]">{m.year}</span>
                <div>
                  <p className="text-foreground text-sm font-medium">{m.title}</p>
                  <p className="text-muted-foreground text-xs">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Values */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Nos valeurs</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Shield, title: "Sécurité" },
              { icon: Target, title: "Transparence" },
              { icon: Globe, title: "Accessibilité" },
              { icon: Users, title: "Communauté" },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-4 md:p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                  <Icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-foreground text-sm font-medium">{v.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Team */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Équipe</p>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {team.map((member, i) => (
              <div key={i} className="p-5 md:p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-12 h-12 bg-white/[0.06] rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-foreground font-medium text-sm mb-0.5 text-center md:text-left">{member.name}</h3>
                <p className="text-terex-accent text-xs mb-2 text-center md:text-left">{member.role}</p>
                <p className="text-muted-foreground text-xs leading-relaxed text-center md:text-left">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* CTA */}
      <section className="py-10 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-3">Rejoignez la révolution Terex</h2>
          <p className="text-muted-foreground text-sm mb-6">Échangez vos USDT en FCFA dès aujourd'hui</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/auth')} className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-6 h-11">
              Créer un compte <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => navigate('/careers')} variant="outline" className="border-white/[0.12] text-foreground hover:bg-white/[0.04] h-11">
              Nous rejoindre
            </Button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
