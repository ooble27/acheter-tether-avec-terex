import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Globe, Shield, Target, User } from 'lucide-react';
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

      {/* Hero — Attio-style big typography */}
      <section className="pt-16 pb-8 md:pt-32 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-8">
            <span className="text-muted-foreground text-xs">À propos</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.1] mb-6">
            Notre mission est de<br className="hidden md:block" />
            démocratiser la crypto<br className="hidden md:block" />
            en Afrique.
          </h1>
          <p className="text-muted-foreground text-base md:text-xl max-w-2xl leading-relaxed mb-8">
            Nous construisons la plateforme d'échange crypto-fiat la plus accessible d'Afrique francophone — simple, rapide, sécurisée.
          </p>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/auth')} className="bg-foreground text-background hover:bg-foreground/90 font-medium px-6 h-11 rounded-xl">
              Rejoindre Terex
            </Button>
            <div className="flex -space-x-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-terex-dark flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-terex-dark flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                +500
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative dots grid — Attio-style */}
      <section className="py-8 md:py-12 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 opacity-20">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/40" style={{ opacity: Math.random() * 0.6 + 0.2 }} />
            ))}
          </div>
          <p className="text-muted-foreground text-xs mt-4">Fonctionnalités, améliorations, jalons au fil du temps.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Mission & Vision — large cards */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="p-8 md:p-10 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <p className="text-terex-accent text-xs uppercase tracking-[0.15em] mb-4 font-medium">01 — Mission</p>
              <h2 className="text-foreground text-2xl md:text-3xl font-light mb-4 leading-tight">
                Rendre la crypto accessible à tous
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Chez Terex, nous croyons que chaque africain mérite un accès simple et sécurisé aux services financiers numériques. Notre plateforme connecte les crypto-monnaies aux monnaies locales (FCFA), facilitant les échanges et les transferts via Orange Money et Wave.
              </p>
            </div>
            <div className="p-8 md:p-10 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <p className="text-terex-accent text-xs uppercase tracking-[0.15em] mb-4 font-medium">02 — Vision 2030</p>
              <h2 className="text-foreground text-2xl md:text-3xl font-light mb-4 leading-tight">
                La référence en Afrique de l'Ouest
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Devenir la référence ouest-africaine pour les échanges crypto-fiat en servant plus d'un million d'utilisateurs.
              </p>
              <div className="space-y-2">
                {["Zone UEMOA complète", "1M+ utilisateurs actifs", "100M+ FCFA de volume"].map((goal, i) => (
                  <div key={i} className="flex items-center gap-3 text-foreground/70 text-sm">
                    <div className="w-1.5 h-1.5 bg-terex-accent rounded-full" />
                    {goal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Stats — large numbers */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: "99.9%", label: "Disponibilité", sub: "uptime garanti" },
              { value: "24/7", label: "Support", sub: "toujours disponible" },
              { value: "< 5min", label: "Temps moyen", sub: "par transaction" },
              { value: "500+", label: "Utilisateurs", sub: "et en croissance" }
            ].map((stat, i) => (
              <div key={i} className="p-5 md:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <p className="text-foreground text-3xl md:text-4xl font-light mb-1">{stat.value}</p>
                <p className="text-foreground text-sm font-medium">{stat.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Timeline */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-8">Parcours</p>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-6 py-5 border-b border-white/[0.06] group hover:bg-white/[0.01] transition-colors px-2 -mx-2 rounded-lg">
                <span className="text-muted-foreground text-xs font-mono min-w-[80px] pt-0.5">{m.year}</span>
                <div className="flex-1">
                  <p className="text-foreground text-base md:text-lg font-medium">{m.title}</p>
                  <p className="text-muted-foreground text-sm">{m.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-white/40 transition-colors mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Values — bold grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-8">Nos valeurs</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Sécurité", desc: "Protection maximale de vos fonds" },
              { icon: Target, title: "Transparence", desc: "Frais clairs, sans surprise" },
              { icon: Globe, title: "Accessibilité", desc: "Ouvert à toute l'Afrique" },
              { icon: Users, title: "Communauté", desc: "Construite avec nos utilisateurs" },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] group hover:border-white/[0.15] transition-all">
                  <Icon className="w-6 h-6 text-muted-foreground mb-4 group-hover:text-terex-accent transition-colors" />
                  <p className="text-foreground text-base font-medium mb-1">{v.title}</p>
                  <p className="text-muted-foreground text-xs">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Team */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-2">L'équipe</p>
          <h2 className="text-foreground text-2xl md:text-4xl font-light mb-8">Les visages derrière Terex</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {team.map((member, i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] group hover:border-white/[0.15] transition-all">
                <div className="w-16 h-16 bg-white/[0.06] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-white/[0.1] transition-colors">
                  <User className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-foreground font-medium text-lg mb-0.5">{member.name}</h3>
                <p className="text-terex-accent text-xs font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* CTA */}
      <section className="py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4 leading-tight">
            Prêt à rejoindre la<br />révolution Terex ?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto">Échangez vos USDT en FCFA dès aujourd'hui, simplement et en toute sécurité.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/auth')} className="bg-foreground text-background hover:bg-foreground/90 font-medium px-8 h-12 rounded-xl text-base">
              Créer un compte <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => navigate('/careers')} variant="outline" className="border-white/[0.15] text-foreground hover:bg-white/[0.04] h-12 rounded-xl">
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
