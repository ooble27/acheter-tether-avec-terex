import { MapPin, Send, ArrowRight, ChevronDown, User, Globe, Wallet, TrendingUp, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobApplicationForm } from '@/components/features/JobApplicationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BG = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const PERKS = [
  { Icon: Globe, title: '100% Remote', desc: 'Travaillez de n\'importe où en Afrique, à votre rythme.' },
  { Icon: Wallet, title: 'Salaire compétitif', desc: 'Rémunération en crypto ou en fiat, à votre convenance.' },
  { Icon: TrendingUp, title: 'Croissance rapide', desc: 'Une startup en pleine expansion, des responsabilités réelles.' },
  { Icon: GraduationCap, title: 'Formation continue', desc: 'Un budget formation annuel pour monter en compétence.' },
];

const POSITIONS = [
  {
    title: 'Community Manager', type: 'Temps plein', location: 'Dakar / Remote',
    description: 'Développer et animer notre communauté crypto en Afrique francophone.',
    responsibilities: ['Gérer les réseaux sociaux', 'Créer du contenu éducatif', 'Organiser des événements virtuels', 'Support client communautaire'],
    requirements: ['2+ années en community management', 'Maîtrise français/anglais', 'Connaissance crypto/blockchain'],
  },
  {
    title: 'Spécialiste Opérations Crypto', type: 'Temps plein', location: 'Dakar / Remote',
    description: 'Superviser les transactions crypto-fiat en temps réel.',
    responsibilities: ['Traiter les ordres d\'achat/vente', 'Valider les paiements Mobile Money', 'Gérer les portefeuilles crypto', 'Support transactions'],
    requirements: ['Expérience finance/opérations', 'Connaissance des wallets crypto', 'Maîtrise Mobile Money'],
  },
  {
    title: 'Développeur Frontend React', type: 'Temps plein', location: 'Remote / Dakar',
    description: 'Développer l\'interface utilisateur de notre plateforme d\'échange crypto.',
    responsibilities: ['Interfaces React/TypeScript', 'Intégration API blockchain', 'Optimisation UX', 'Tests unitaires'],
    requirements: ['3+ années React', 'TypeScript, ES6+', 'API REST et WebSocket'],
  },
  {
    title: 'Responsable Marketing Digital', type: 'Temps plein', location: 'Dakar / Remote',
    description: 'Piloter la stratégie marketing pour le marché africain.',
    responsibilities: ['Stratégie marketing digital', 'Campagnes multi-canaux', 'Analyse ROI', 'Partenariats'],
    requirements: ['5+ années marketing digital', 'Expérience fintech/crypto', 'Leadership'],
  },
  {
    title: 'Analyste Financier Crypto', type: 'Temps plein', location: 'Dakar / Remote',
    description: 'Analyser les marchés crypto et optimiser les stratégies financières.',
    responsibilities: ['Analyse marchés crypto', 'Stratégies pricing/liquidité', 'Rapports financiers', 'Gestion risques'],
    requirements: ['Formation finance/économie', '2+ années analyse financière', 'Maîtrise Excel/Python'],
  },
];

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
    if (!error) { toast({ title: 'Déconnexion réussie', description: 'À bientôt' }); window.location.reload(); }
  };

  const handleApply = (position: string) => { setSelectedPosition(position); setShowApplicationForm(true); };
  const toggleExpanded = (index: number) => {
    const n = new Set(expandedPositions);
    n.has(index) ? n.delete(index) : n.add(index);
    setExpandedPositions(n);
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes cr-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .cr-fade { animation: cr-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .cr-cta { transition: transform 0.15s ease; }
        .cr-cta:hover { transform: translateY(-1px); }
        .cr-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .cr-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .cr-row { transition: border-color 0.2s ease, background 0.2s ease; }
        .cr-row:hover { border-color: rgba(255,255,255,0.16) !important; }
        @media (max-width: 1100px) { .cr-vline { display: none !important; } }
        @media (max-width: 860px) {
          .cr-hero-title { font-size: 40px !important; }
          .cr-grid4 { grid-template-columns: 1fr 1fr !important; }
          .cr-grid2 { grid-template-columns: 1fr !important; }
          .cr-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 560px) {
          .cr-hero-title { font-size: 31px !important; }
        }
      `}</style>

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div style={{ height: 64 }} />

      <div className="cr-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="cr-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO */}
      <header className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px 64px', position: 'relative', zIndex: 1 }}>
        <div className="cr-fade" style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 16px' }}>Carrières</p>
          <h1 className="cr-hero-title" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em', margin: '0 0 20px' }}>
            Construisons la fintech de demain.
          </h1>
          <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 560 }}>
            Nous redéfinissons les services financiers en Afrique — des solutions puissantes et innovantes à chaque étape. Rejoignez une équipe qui bouge vite.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })} className="cr-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Voir les postes <ArrowRight size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: ICON_BG, border: `2px solid ${BG}`, marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color={MUTED} />
                </div>
              ))}
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: ICON_BG, border: `2px solid ${BG}`, marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: MUTED }}>
                +10
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PERKS — why work here */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Avantages" title="Pourquoi nous rejoindre" sub="Un cadre pensé pour la liberté, l'apprentissage et la croissance." />
          <div className="cr-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {PERKS.map(({ Icon, title, desc }) => (
              <div key={title} className="cr-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '26px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSITIONS */}
      <section id="positions" style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Postes ouverts" title={`${POSITIONS.length} opportunités à saisir`} sub="Cliquez sur un poste pour découvrir les responsabilités et prérequis." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {POSITIONS.map((pos, i) => {
              const isExpanded = expandedPositions.has(i);
              return (
                <div key={i} className="cr-row" style={{ border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden' }}>
                  <button onClick={() => toggleExpanded(i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '22px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{pos.title}</h3>
                        <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 10px', background: ICON_BG, color: MUTED, borderRadius: 999, letterSpacing: '0.02em' }}>{pos.type}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: MUTED, fontSize: 13.5 }}>
                        <MapPin size={14} /> {pos.location}
                      </div>
                      {!isExpanded && <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', margin: '10px 0 0' }}>{pos.description}</p>}
                    </div>
                    <ChevronDown size={18} color={MUTED2} style={{ flexShrink: 0, marginTop: 4, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                      <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.65, margin: 0 }}>{pos.description}</p>
                      <div className="cr-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px', color: '#fff' }}>Responsabilités</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                            {pos.responsibilities.map((r, ri) => (
                              <div key={ri} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: MUTED }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', flexShrink: 0, marginTop: 6 }} />
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px', color: '#fff' }}>Prérequis</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                            {pos.requirements.map((r, ri) => (
                              <div key={ri} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: MUTED }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 6 }} />
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleApply(pos.title)} className="cr-cta" style={{ alignSelf: 'flex-start', background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 44, padding: '0 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Send size={14} /> Postuler maintenant
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Pas de poste idéal ?</h2>
          <p style={{ fontSize: 16, color: MUTED, margin: '0 0 28px' }}>Envoyez-nous une candidature spontanée. Nous cherchons toujours des talents exceptionnels.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleApply('Candidature spontanée')} className="cr-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 52, padding: '0 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Candidature spontanée <ArrowRight size={17} />
            </button>
            <button onClick={() => navigate('/contact')} style={{ background: '#2d2d2d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, height: 52, padding: '0 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-3xl lg:max-w-4xl bg-terex-dark border-white/[0.08] max-h-[90vh] overflow-y-auto">
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

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 10px' }}>{eyebrow}</p>
      <h2 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: '12px 0 0', maxWidth: 520, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

export default CareersPage;
