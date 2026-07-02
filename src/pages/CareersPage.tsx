import { MapPin, Send, ArrowRight, ChevronDown, Globe, Wallet, TrendingUp, GraduationCap, Users, Heart, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobApplicationForm } from '@/components/features/JobApplicationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const CARD2 = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

// Mock culture feed (sensation "vie d'équipe")
const CULTURE = [
  { who: 'Aïssatou', initials: 'AD', text: 'a livré la nouvelle page de transfert 🚀', t: 'à l\'instant' },
  { who: 'Moussa', initials: 'MK', text: 'a rejoint l\'équipe Opérations', t: 'il y a 12 min' },
  { who: 'Fatou', initials: 'FB', text: 'a clôturé le sprint marketing UEMOA', t: 'il y a 1 h' },
  { who: 'Cheikh', initials: 'CT', text: 'a publié un guide sur la sécurité crypto', t: 'il y a 2 h' },
];

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

const DEPT_OF = (title: string) =>
  /dévelop|frontend/i.test(title) ? 'Ingénierie'
  : /opérations|analyste|financ/i.test(title) ? 'Opérations'
  : /marketing|community/i.test(title) ? 'Marketing'
  : 'Équipe';

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
        .cr-fade-2 { animation: cr-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .cr-cta { transition: transform 0.15s ease; }
        .cr-cta:hover { transform: translateY(-1px); }
        .cr-tile { transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease; }
        .cr-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.16) !important; }
        .cr-row { transition: border-color 0.2s ease, background 0.2s ease; }
        .cr-row:hover { border-color: rgba(255,255,255,0.16) !important; }
        .cr-row:hover .cr-arrow { color: #fff !important; transform: translateX(2px); }
        @keyframes cr-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.82); } }
        .cr-live-dot { animation: cr-pulse 1.6s ease-in-out infinite; }
        @media (max-width: 1100px) { .cr-vline { display: none !important; } }
        @media (max-width: 920px) {
          .cr-hero { grid-template-columns: 1fr !important; }
          .cr-hero-visual { display: none !important; }
          .cr-bento { grid-template-columns: 1fr 1fr !important; }
          .cr-bento-feat { grid-column: 1 / -1 !important; grid-row: auto !important; }
        }
        @media (max-width: 860px) {
          .cr-hero-title { font-size: 40px !important; }
          .cr-grid2 { grid-template-columns: 1fr !important; }
          .cr-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 560px) {
          .cr-hero-title { font-size: 31px !important; }
          .cr-bento { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div style={{ height: 64 }} />

      <div className="cr-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="cr-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO — editorial split + culture panel */}
      <header className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '84px 32px 64px', position: 'relative', zIndex: 1 }}>
        <div className="cr-hero" style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 56, alignItems: 'center' }}>
          <div className="cr-fade">
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 16px' }}>Carrières · Terex</p>
            <h1 className="cr-hero-title" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.04em', margin: '0 0 20px' }}>
              Construisons la fintech de demain.
            </h1>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 480 }}>
              Nous redéfinissons les services financiers en Afrique. Rejoignez une équipe distribuée, ambitieuse et qui bouge vite.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })} className="cr-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Voir les {POSITIONS.length} postes <ArrowRight size={16} />
              </button>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>7</span>
                <span style={{ fontSize: 13, color: MUTED }}>pays · zone UEMOA</span>
              </div>
            </div>
          </div>

          {/* Crafted visual: live team culture panel */}
          <div className="cr-hero-visual cr-fade-2" style={{ position: 'relative' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ position: 'relative', width: 8, height: 8 }}>
                    <span className="cr-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff' }} />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Vie d'équipe</span>
                </div>
                <span style={{ fontSize: 11, color: MUTED2 }}>Aujourd'hui</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {CULTURE.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 14, background: CARD2, border: `1px solid ${BORDER}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: ICON_BG, border: `1px solid rgba(255,255,255,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700 }}>{c.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, lineHeight: 1.4 }}><strong style={{ fontWeight: 600 }}>{c.who}</strong> <span style={{ color: MUTED }}>{c.text}</span></div>
                      <div style={{ fontSize: 10.5, color: MUTED2, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><Clock size={10} /> {c.t}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: '12px 14px', borderRadius: 14, background: '#fff', color: '#141414' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Heart size={16} fill="#141414" />
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>Satisfaction équipe</span>
                </div>
                <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>96%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* WHY WORK HERE — bento (varied tiles, one featured) */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '76px 32px' }}>
          <SectionHead eyebrow="Pourquoi nous" title="Une culture qui vous fait grandir" sub="Un cadre pensé pour la liberté, l'apprentissage et l'impact réel." />
          <div className="cr-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '1fr', gap: 14 }}>
            {/* Featured tile */}
            <div className="cr-bento-feat cr-tile" style={{ gridColumn: '1 / 2', gridRow: '1 / 3', border: `1px solid ${BORDER}`, borderRadius: 22, padding: '30px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #1e1e1e 0%, #1a1a1a 100%)' }}>
              <div>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Globe size={22} color="#fff" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>Travaillez d'où vous voulez</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  Une équipe 100% distribuée à travers la zone UEMOA. Pas de bureau imposé, pas d'horaires rigides — seul le résultat compte.
                </p>
              </div>
              {/* mini avatar cluster */}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 28 }}>
                {['ML', 'SN', 'AO', 'FB'].map((ini, i) => (
                  <div key={ini} style={{ width: 38, height: 38, borderRadius: '50%', background: CARD2, border: `2px solid #1a1a1a`, marginLeft: i === 0 ? 0 : -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{ini}</div>
                ))}
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', color: '#141414', border: `2px solid #1a1a1a`, marginLeft: -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>+8</div>
                <span style={{ marginLeft: 14, fontSize: 12.5, color: MUTED }}>déjà à bord</span>
              </div>
            </div>

            {/* Wide stat tile */}
            <div className="cr-tile" style={{ gridColumn: '2 / 4', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '24px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 6px' }}>Salaire compétitif</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0, maxWidth: 320 }}>Rémunération en crypto ou en fiat, selon votre convenance — versée à temps, chaque mois.</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={20} color="rgba(255,255,255,0.9)" strokeWidth={1.8} /></div>
              </div>
            </div>

            {/* Two small tiles */}
            {[
              { Icon: TrendingUp, title: 'Croissance rapide', desc: 'Startup en pleine expansion, des responsabilités réelles dès le départ.' },
              { Icon: GraduationCap, title: 'Formation continue', desc: 'Un budget annuel pour monter en compétence et apprendre sans limite.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="cr-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 18, padding: '24px 22px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={19} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 15.5, fontWeight: 600, margin: '0 0 6px' }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSITIONS — refined expandable rows */}
      <section id="positions" style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '76px 32px' }}>
          <SectionHead eyebrow="Postes ouverts" title={`${POSITIONS.length} opportunités à saisir`} sub="Cliquez sur un poste pour découvrir les responsabilités et prérequis." />
          <div style={{ borderTop: `1px solid ${BORDER}` }}>
            {POSITIONS.map((pos, i) => {
              const isExpanded = expandedPositions.has(i);
              const dept = DEPT_OF(pos.title);
              return (
                <div key={i} className="cr-row" style={{ borderBottom: `1px solid ${BORDER}`, background: isExpanded ? CARD : 'transparent' }}>
                  <button onClick={() => toggleExpanded(i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '26px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* index */}
                    <span style={{ fontSize: 12, fontWeight: 700, color: MUTED2, fontVariantNumeric: 'tabular-nums', flexShrink: 0, width: 24 }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 7px' }}>{pos.title}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, color: MUTED, fontSize: 13 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {pos.location}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Clock size={13} /> {pos.type}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 10px', background: ICON_BG, color: 'rgba(255,255,255,0.7)', borderRadius: 999, letterSpacing: '0.02em' }}>{dept}</span>
                      </div>
                    </div>
                    <span className="cr-arrow" style={{ flexShrink: 0, color: MUTED2, display: 'inline-flex', transition: 'transform 0.2s ease, color 0.2s ease' }}>
                      <ChevronDown size={20} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }} />
                    </span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateRows: isExpanded ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 24px 28px 68px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.65, margin: 0, maxWidth: 640 }}>{pos.description}</p>
                        <div className="cr-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', color: MUTED2 }}>Responsabilités</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {pos.responsibilities.map((r, ri) => (
                                <div key={ri} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}>
                                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0, marginTop: 7 }} />
                                  {r}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', color: MUTED2 }}>Prérequis</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {pos.requirements.map((r, ri) => (
                                <div key={ri} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}>
                                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', flexShrink: 0, marginTop: 7 }} />
                                  {r}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleApply(pos.title)} className="cr-cta" style={{ alignSelf: 'flex-start', background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 46, padding: '0 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <Send size={14} /> Postuler maintenant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div className="cr-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '92px 32px', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, border: `1px solid ${BORDER}`, marginBottom: 22, fontSize: 12.5, color: MUTED }}>
            <Users size={14} /> Plus de 10 talents nous ont déjà rejoints
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Pas de poste idéal ?</h2>
          <p style={{ fontSize: 16, color: MUTED, margin: '0 0 30px' }}>Envoyez-nous une candidature spontanée. Nous cherchons toujours des talents exceptionnels.</p>
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
