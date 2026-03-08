import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Heart, Users, Send, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
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
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ CARRIÈRES</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-3">
            Construisons l'avenir de la finance digitale
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Rejoignez l'équipe qui révolutionne les transferts d'argent en Afrique
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Values */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Heart, title: "Innovation" },
              { icon: Users, title: "Diversité" },
              { icon: Briefcase, title: "Excellence" },
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

      {/* Positions */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">{positions.length} postes ouverts</p>
          <div className="space-y-3">
            {positions.map((pos, i) => {
              const isExpanded = expandedPositions.has(i);
              return (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(i)}
                    className="w-full p-4 md:p-5 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-foreground font-medium text-sm md:text-base">{pos.title}</h3>
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-terex-accent/10 text-terex-accent rounded-full">{pos.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <MapPin className="w-3 h-3" />
                        {pos.location}
                      </div>
                      {!isExpanded && <p className="text-muted-foreground text-xs mt-2 line-clamp-1">{pos.description}</p>}
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0 mt-1" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0 space-y-4">
                      <p className="text-muted-foreground text-xs md:text-sm">{pos.description}</p>
                      
                      <div>
                        <p className="text-foreground text-xs font-medium mb-2">Responsabilités</p>
                        <div className="space-y-1">
                          {pos.responsibilities.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-2 text-muted-foreground text-xs">
                              <div className="w-1 h-1 bg-terex-accent rounded-full flex-shrink-0" />
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-foreground text-xs font-medium mb-2">Prérequis</p>
                        <div className="space-y-1">
                          {pos.requirements.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-2 text-muted-foreground text-xs">
                              <div className="w-1 h-1 bg-white/30 rounded-full flex-shrink-0" />
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={() => handleApply(pos.title)} className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium h-9 text-xs px-4">
                        <Send className="w-3 h-3 mr-1.5" />
                        Postuler
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
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
