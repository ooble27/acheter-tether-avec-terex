import { Button } from '@/components/ui/button';
import { MapPin, Send, ArrowRight, ChevronDown, ChevronUp, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobApplicationForm } from '@/components/features/JobApplicationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CareersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [expandedPositions, setExpandedPositions] = useState<Set<number>>(new Set());

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" }); window.location.reload(); }
  };

  const handleApply = (position: string) => { setSelectedPosition(position); setShowApplicationForm(true); };
  const toggleExpanded = (index: number) => {
    const n = new Set(expandedPositions);
    n.has(index) ? n.delete(index) : n.add(index);
    setExpandedPositions(n);
  };

  const positions = [
    {
      title: "Community Manager", type: "Temps plein", location: "Dakar / Remote",
      description: "Développer et animer notre communauté crypto en Afrique francophone.",
      responsibilities: ["Gérer les réseaux sociaux", "Créer du contenu éducatif", "Organiser des événements virtuels", "Support client communautaire"],
      requirements: ["2+ années en community management", "Maîtrise français/anglais", "Connaissance crypto/blockchain"],
    },
    {
      title: "Spécialiste Opérations Crypto", type: "Temps plein", location: "Dakar / Remote",
      description: "Superviser les transactions crypto-fiat en temps réel.",
      responsibilities: ["Traiter les ordres d'achat/vente", "Valider les paiements Mobile Money", "Gérer les portefeuilles crypto", "Support transactions"],
      requirements: ["Expérience finance/opérations", "Connaissance des wallets crypto", "Maîtrise Mobile Money"],
    },
    {
      title: "Développeur Frontend React", type: "Temps plein", location: "Remote / Dakar",
      description: "Développer l'interface utilisateur de notre plateforme d'échange crypto.",
      responsibilities: ["Interfaces React/TypeScript", "Intégration API blockchain", "Optimisation UX", "Tests unitaires"],
      requirements: ["3+ années React", "TypeScript, ES6+", "API REST et WebSocket"],
    },
    {
      title: "Responsable Marketing Digital", type: "Temps plein", location: "Dakar / Remote",
      description: "Piloter la stratégie marketing pour le marché africain.",
      responsibilities: ["Stratégie marketing digital", "Campagnes multi-canaux", "Analyse ROI", "Partenariats"],
      requirements: ["5+ années marketing digital", "Expérience fintech/crypto", "Leadership"],
    },
    {
      title: "Analyste Financier Crypto", type: "Temps plein", location: "Dakar / Remote",
      description: "Analyser les marchés crypto et optimiser les stratégies financières.",
      responsibilities: ["Analyse marchés crypto", "Stratégies pricing/liquidité", "Rapports financiers", "Gestion risques"],
      requirements: ["Formation finance/économie", "2+ années analyse financière", "Maîtrise Excel/Python"],
    },
  ];

  const perks = [
    { icon: Globe, title: "100% Remote", desc: "Travaillez de n'importe où en Afrique" },
    { icon: Wallet, title: "Salaire compétitif", desc: "Rémunération en crypto ou fiat" },
    { icon: TrendingUp, title: "Croissance rapide", desc: "Startup en pleine expansion" },
    { icon: GraduationCap, title: "Formation continue", desc: "Budget formation annuel" },
  ];

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div className="h-16 md:h-20" />

      {/* Hero — Attio-style large text */}
      <section className="pt-16 pb-8 md:pt-32 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-8">
            <span className="text-muted-foreground text-xs">Careers</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.1] mb-6">
            Notre mission est de<br className="hidden md:block" />
            construire la fintech<br className="hidden md:block" />
            de demain.
          </h1>
          <p className="text-muted-foreground text-base md:text-xl max-w-2xl leading-relaxed mb-8">
            Nous redéfinissons les services financiers — en créant des solutions puissantes et innovantes à chaque étape. Rejoignez-nous pour révolutionner la finance en Afrique.
          </p>
          <div className="flex items-center gap-4">
            <Button onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })} className="bg-foreground text-background hover:bg-foreground/90 font-medium px-6 h-11 rounded-xl">
              Rejoindre l'équipe
            </Button>
            <div className="flex -space-x-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-terex-dark flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-terex-dark flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                +10
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative dots — Attio-style */}
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

      {/* Perks */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-2">Avantages</p>
          <h2 className="text-foreground text-2xl md:text-4xl font-light mb-8">Pourquoi nous rejoindre</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map((perk, i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] group hover:border-white/[0.15] transition-all">
                <span className="text-2xl md:text-3xl mb-4 block">{perk.emoji}</span>
                <p className="text-foreground text-sm md:text-base font-medium mb-1">{perk.title}</p>
                <p className="text-muted-foreground text-xs">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Positions */}
      <section id="positions" className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-2">Postes ouverts</p>
              <h2 className="text-foreground text-2xl md:text-4xl font-light">{positions.length} opportunités</h2>
            </div>
          </div>
          <div className="space-y-3">
            {positions.map((pos, i) => {
              const isExpanded = expandedPositions.has(i);
              return (
                <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all">
                  <button
                    onClick={() => toggleExpanded(i)}
                    className="w-full p-5 md:p-6 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1.5">
                        <h3 className="text-foreground font-medium text-base md:text-lg">{pos.title}</h3>
                        <span className="text-[10px] font-medium px-2.5 py-0.5 bg-terex-accent/10 text-terex-accent rounded-full">{pos.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {pos.location}
                      </div>
                      {!isExpanded && <p className="text-muted-foreground text-sm mt-2 line-clamp-1">{pos.description}</p>}
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-white/40 flex-shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0 mt-1" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 space-y-5">
                      <p className="text-muted-foreground text-sm md:text-base">{pos.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-foreground text-sm font-medium mb-3">Responsabilités</p>
                          <div className="space-y-2">
                            {pos.responsibilities.map((r, ri) => (
                              <div key={ri} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                                <div className="w-1.5 h-1.5 bg-terex-accent rounded-full flex-shrink-0 mt-1.5" />
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium mb-3">Prérequis</p>
                          <div className="space-y-2">
                            {pos.requirements.map((r, ri) => (
                              <div key={ri} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                                <div className="w-1.5 h-1.5 bg-white/30 rounded-full flex-shrink-0 mt-1.5" />
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button onClick={() => handleApply(pos.title)} className="bg-foreground text-background hover:bg-foreground/90 font-medium h-10 text-sm px-5 rounded-xl">
                        <Send className="w-3.5 h-3.5 mr-2" />
                        Postuler maintenant
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* CTA */}
      <section className="py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4 leading-tight">
            Vous ne trouvez pas<br />votre poste idéal ?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto">Envoyez-nous une candidature spontanée. Nous sommes toujours à la recherche de talents exceptionnels.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => handleApply('Candidature spontanée')} className="bg-foreground text-background hover:bg-foreground/90 font-medium px-8 h-12 rounded-xl text-base">
              Candidature spontanée <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => navigate('/contact')} variant="outline" className="border-white/[0.15] text-foreground hover:bg-white/[0.04] h-12 rounded-xl">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-2xl bg-terex-dark border-white/[0.08] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Postuler : {selectedPosition}</DialogTitle>
          </DialogHeader>
          {selectedPosition && (
            <JobApplicationForm position={selectedPosition} onClose={() => setShowApplicationForm(false)} />
          )}
        </DialogContent>
      </Dialog>

      <FooterSection />
    </div>
  );
};

export default CareersPage;
