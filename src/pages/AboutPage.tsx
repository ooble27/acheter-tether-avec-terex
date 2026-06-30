import { ArrowRight, Users, Globe, Shield, Target, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const VALUES = [
  { Icon: Shield, title: 'Sécurité', desc: 'Protection maximale de vos fonds, chiffrement et conformité à chaque étape.' },
  { Icon: Target, title: 'Transparence', desc: 'Des frais clairs et un taux affiché, sans surprise ni coût caché.' },
  { Icon: Globe, title: 'Accessibilité', desc: 'Un accès ouvert à toute l\'Afrique francophone, depuis un simple smartphone.' },
  { Icon: Users, title: 'Communauté', desc: 'Une plateforme construite avec et pour ses utilisateurs, à leur écoute.' },
];

const MILESTONES = [
  { year: '2024', title: 'Fondation de Terex', desc: 'Lancement officiel à Dakar.' },
  { year: 'Q2 2024', title: 'Partenariats clés', desc: 'Orange Money et Free Money.' },
  { year: 'Q3 2024', title: 'Lancement MVP', desc: 'Version bêta au Sénégal.' },
  { year: 'Q4 2024', title: 'Expansion UEMOA', desc: 'Burkina, Côte d\'Ivoire, Mali.' },
  { year: '2025', title: 'Croissance régionale', desc: 'Toute la zone UEMOA.' },
];

const TEAM = [
  { name: 'Mohamed Lo', role: 'CEO & Fondateur', bio: 'Visionnaire passionné par l\'innovation fintech en Afrique, avec une expertise en blockchain et services financiers numériques.' },
  { name: 'Sidi Ndiaye', role: 'Directeur des Opérations', bio: 'Expert en gestion des opérations et coordination d\'équipes, spécialisé dans l\'optimisation des processus.' },
  { name: 'Adechina Olaitan', role: 'Head of Marketing', bio: 'Spécialiste du marketing digital et de la communication stratégique pour l\'écosystème fintech africain.' },
];

const AboutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: 'Déconnexion réussie', description: 'À bientôt' }); window.location.reload(); }
  };

  const STATS = [
    { value: rateDisplay, suffix: 'CFA', label: 'Taux USDT en direct', live: true },
    { value: '99.9%', label: 'Disponibilité' },
    { value: '< 5 min', label: 'Par transaction' },
    { value: '500+', label: 'Utilisateurs' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes ab-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .ab-fade { animation: ab-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .ab-cta { transition: transform 0.15s ease; }
        .ab-cta:hover { transform: translateY(-1px); }
        .ab-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .ab-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        .ab-row { transition: border-color 0.2s ease, background 0.2s ease; }
        .ab-row:hover { background: rgba(255,255,255,0.02); }
        @media (max-width: 1100px) { .ab-vline { display: none !important; } }
        @media (max-width: 860px) {
          .ab-hero-title { font-size: 40px !important; }
          .ab-grid4 { grid-template-columns: 1fr 1fr !important; }
          .ab-grid3 { grid-template-columns: 1fr !important; }
          .ab-grid2 { grid-template-columns: 1fr !important; }
          .ab-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 560px) {
          .ab-hero-title { font-size: 31px !important; }
        }
      `}</style>

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div style={{ height: 64 }} />

      <div className="ab-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="ab-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO — mission statement */}
      <header className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px 64px', position: 'relative', zIndex: 1 }}>
        <div className="ab-fade" style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 16px' }}>À propos de Terex</p>
          <h1 className="ab-hero-title" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em', margin: '0 0 20px' }}>
            Démocratiser la crypto en Afrique.
          </h1>
          <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 560 }}>
            Nous construisons la plateforme d'échange crypto-fiat la plus accessible d'Afrique francophone — simple, rapide, sécurisée et au meilleur taux CFA.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth')} className="ab-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Rejoindre Terex <ArrowRight size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: ICON_BG, border: `2px solid ${BG}`, marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color={MUTED} />
                </div>
              ))}
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: ICON_BG, border: `2px solid ${BG}`, marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: MUTED }}>
                +500
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* STATS row — neutral tiles, live rate */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <div className="ab-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {STATS.map((s, i) => (
              <div key={i} className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 18, padding: '24px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minHeight: 40, marginBottom: 8 }}>
                  {s.live && !s.value ? (
                    <span style={{ display: 'inline-block', width: 110, height: 34, borderRadius: 8, background: ICON_BG }} />
                  ) : (
                    <>
                      <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</span>
                      {s.suffix && <span style={{ color: MUTED2, fontSize: 14, fontWeight: 600 }}>{s.suffix}</span>}
                    </>
                  )}
                </div>
                <p style={{ fontSize: 13, color: MUTED, margin: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
                  {s.live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />}
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION — story */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Notre raison d'être" title="Une finance ouverte, simple et locale" sub="Connecter les crypto-monnaies aux monnaies locales pour libérer les échanges en Afrique de l'Ouest." />
          <div className="ab-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '32px 30px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Target size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 10px' }}>01 — Mission</p>
              <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.2 }}>Rendre la crypto accessible à tous</h3>
              <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                Chez Terex, nous croyons que chaque africain mérite un accès simple et sécurisé aux services financiers numériques. Notre plateforme connecte les crypto-monnaies aux monnaies locales (FCFA), facilitant les échanges et les transferts via Orange Money et Wave.
              </p>
            </div>
            <div className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '32px 30px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Globe size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 10px' }}>02 — Vision 2030</p>
              <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.2 }}>La référence en Afrique de l'Ouest</h3>
              <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.7, margin: '0 0 18px' }}>
                Devenir la référence ouest-africaine pour les échanges crypto-fiat en servant plus d'un million d'utilisateurs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Zone UEMOA complète', '1M+ utilisateurs actifs', '100M+ FCFA de volume'].map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES — neutral cards with icon tiles */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Nos valeurs" title="Ce qui nous guide au quotidien" sub="Quatre principes au cœur de chaque décision que nous prenons." />
          <div className="ab-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {VALUES.map(({ Icon, title, desc }) => (
              <div key={title} className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '26px 24px' }}>
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

      {/* TIMELINE — parcours */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Parcours" title="Notre histoire, étape par étape" sub="De la fondation à l'expansion régionale." />
          <div>
            {MILESTONES.map((m, i) => (
              <div key={i} className="ab-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '22px 12px', borderBottom: `1px solid ${BORDER}`, borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: MUTED2, minWidth: 84, paddingTop: 2, letterSpacing: '0.02em' }}>{m.year}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 3px' }}>{m.title}</p>
                  <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>{m.desc}</p>
                </div>
                <ArrowRight size={16} color="rgba(255,255,255,0.25)" style={{ marginTop: 3, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="L'équipe" title="Les visages derrière Terex" sub="Une équipe pluridisciplinaire au service de votre confiance." />
          <div className="ab-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {TEAM.map((m) => (
              <div key={m.name} className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '30px 28px' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <User size={26} color={MUTED} strokeWidth={1.6} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 2px' }}>{m.name}</h3>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: MUTED2, margin: '0 0 12px', letterSpacing: '0.02em' }}>{m.role}</p>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Prêt à rejoindre Terex ?</h2>
          <p style={{ fontSize: 16, color: MUTED, margin: '0 0 28px' }}>Échangez vos USDT en FCFA dès aujourd'hui, simplement et en toute sécurité.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth')} className="ab-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 52, padding: '0 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Créer un compte <ArrowRight size={17} />
            </button>
            <button onClick={() => navigate('/careers')} style={{ background: '#2d2d2d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, height: 52, padding: '0 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Nous rejoindre
            </button>
          </div>
        </div>
      </section>

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

export default AboutPage;
