import { ArrowRight, Users, Globe, Shield, Target, Coins, HandCoins, CheckCircle2, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

// Flux d'activité simulé (sensation "en direct")
const FEED = [
  { type: 'buy',  label: 'Achat USDT',  amount: '250 000 CFA', usdt: '378 USDT', t: 'à l\'instant' },
  { type: 'sell', label: 'Vente USDT',  amount: '120 USDT',    usdt: '79 200 CFA', t: 'il y a 1 min' },
  { type: 'buy',  label: 'Achat USDT',  amount: '75 000 CFA',  usdt: '113 USDT',  t: 'il y a 2 min' },
  { type: 'sell', label: 'Vente USDT',  amount: '500 USDT',    usdt: '330 000 CFA', t: 'il y a 3 min' },
  { type: 'buy',  label: 'Achat USDT',  amount: '1 000 000 CFA', usdt: '1 515 USDT', t: 'il y a 4 min' },
];

const MILESTONES = [
  { year: 'Le constat', title: 'Un besoin réel', desc: 'Acheter et vendre des USDT en CFA restait trop complexe. Nous avons voulu le rendre simple.' },
  { year: 'La plateforme', title: 'Une expérience épurée', desc: 'Une interface claire pour acheter, vendre et suivre ses transactions en quelques minutes.' },
  { year: 'La communauté', title: 'Construit avec ses utilisateurs', desc: 'Chaque fonctionnalité naît des retours de nos utilisateurs.' },
  { year: "L'ambition", title: "Au service de l'Afrique de l'Ouest", desc: 'Rendre les stablecoins accessibles, simplement et en toute confiance.' },
];

const TEAM = [
  { name: 'Mohamed Lo', role: 'CEO & Fondateur', initials: 'ML', bio: 'Passionné par l\'innovation fintech en Afrique, expert blockchain et services financiers numériques.' },
  { name: 'Sidi Ndiaye', role: 'Directeur des Opérations', initials: 'SN', bio: 'Expert en gestion des opérations et coordination d\'équipes, optimisation des processus.' },
  { name: 'Adechina Olaitan', role: 'Head of Marketing', initials: 'AO', bio: 'Spécialiste du marketing digital et de la communication pour l\'écosystème fintech africain.' },
];

const COUNTRIES = ['🇸🇳 Sénégal', '🇨🇮 Côte d\'Ivoire', '🇲🇱 Mali', '🇧🇫 Burkina Faso', '🇳🇪 Niger', '🇹🇬 Togo', '🇧🇯 Bénin'];

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

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes ab-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .ab-fade { animation: ab-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .ab-fade-2 { animation: ab-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .ab-cta { transition: transform 0.15s ease; }
        .ab-cta:hover { transform: translateY(-1px); }
        .ab-tile { transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease; }
        .ab-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.16) !important; }
        @keyframes ab-feed { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .ab-feed-track { animation: ab-feed 16s linear infinite; }
        @keyframes ab-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.85); } }
        .ab-live-dot { animation: ab-pulse 1.6s ease-in-out infinite; }
        @keyframes ab-ring { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
        @media (max-width: 1100px) { .ab-vline { display: none !important; } }
        @media (max-width: 920px) {
          .ab-hero { grid-template-columns: 1fr !important; }
          .ab-hero-visual { display: none !important; }
          .ab-bento { grid-template-columns: 1fr 1fr !important; grid-auto-rows: auto !important; }
          .ab-bento-feat { grid-column: 1 / -1 !important; grid-row: auto !important; }
          .ab-grid3 { grid-template-columns: 1fr !important; }
          .ab-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 560px) {
          .ab-hero-title { font-size: 33px !important; }
          .ab-bento { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div style={{ height: 64 }} />

      <div className="ab-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="ab-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO — éditorial + flux live */}
      <header className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px 72px', position: 'relative', zIndex: 1 }}>
        <div className="ab-hero" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
          <div className="ab-fade">
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 18px' }}>À propos de Terex</p>
            <h1 className="ab-hero-title" style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.04em', margin: '0 0 22px' }}>
              La crypto, enfin<br />simple en Afrique.
            </h1>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 34px', maxWidth: 480 }}>
              Terex connecte les stablecoins aux monnaies locales pour rendre l'achat, la vente et l'épargne en USDT accessibles à tous — simplement, au meilleur taux CFA.
            </p>
            <button onClick={() => navigate('/auth')} className="ab-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Rejoindre Terex <ArrowRight size={16} />
            </button>
          </div>

          {/* Visuel : panneau d'activité en direct */}
          <div className="ab-hero-visual ab-fade-2" style={{ position: 'relative' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: 18 }}>
              {/* En-tête live + taux */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ position: 'relative', width: 8, height: 8 }}>
                    <span className="ab-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff' }} />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Activité en direct</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: MUTED2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>USDT / CFA</div>
                  {rateDisplay
                    ? <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>{rateDisplay} <span style={{ fontSize: 11, color: MUTED2, fontWeight: 600 }}>CFA</span></div>
                    : <div style={{ width: 70, height: 18, borderRadius: 6, background: ICON_BG, marginTop: 2 }} />}
                </div>
              </div>
              {/* Flux défilant */}
              <div style={{ height: 280, overflow: 'hidden', position: 'relative', WebkitMaskImage: 'linear-gradient(transparent, #000 12%, #000 88%, transparent)', maskImage: 'linear-gradient(transparent, #000 12%, #000 88%, transparent)' }}>
                <div className="ab-feed-track" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[...FEED, ...FEED].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 14, background: '#1e1e1e', border: `1px solid ${BORDER}` }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {f.type === 'buy' ? <Coins size={18} color="rgba(255,255,255,0.85)" /> : <HandCoins size={18} color="rgba(255,255,255,0.85)" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                        <div style={{ fontSize: 11, color: MUTED2 }}>{f.t}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.amount}</div>
                        <div style={{ fontSize: 11, color: MUTED2, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                          <CheckCircle2 size={11} color="rgba(255,255,255,0.5)" /> {f.usdt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MISSION — déclaration éditoriale pleine largeur */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 26px' }}>Notre mission</p>
          <p style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.5rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.35, margin: 0, maxWidth: 920 }}>
            Nous croyons que chaque Africain mérite un accès <span style={{ color: '#fff' }}>simple</span> et <span style={{ color: '#fff' }}>sécurisé</span> aux services financiers numériques. <span style={{ color: MUTED2 }}>Terex relie les crypto-monnaies aux monnaies locales pour libérer les échanges, du smartphone le plus modeste à l'entreprise la plus exigeante.</span>
          </p>
        </div>
      </section>

      {/* VALEURS — bento (tailles variées) */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <SectionHead eyebrow="Nos valeurs" title="Ce qui nous guide" sub="Quatre principes au cœur de chaque décision." />
          <div className="ab-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '1fr', gap: 14 }}>
            {/* Tuile vedette : Sécurité */}
            <div className="ab-bento-feat ab-tile" style={{ gridColumn: '1 / 2', gridRow: '1 / 3', border: `1px solid ${BORDER}`, borderRadius: 22, padding: '30px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Shield size={22} color="#fff" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>Sécurité avant tout</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  Chiffrement, vérification d'identité (KYC) et conformité réglementaire protègent vos fonds et vos données à chaque transaction.
                </p>
              </div>
              {/* Mini visuel cadenas + anneaux */}
              <div style={{ position: 'relative', height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                <span style={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', border: `1px solid ${BORDER}`, animation: 'ab-ring 2.6s ease-out infinite' }} />
                <span style={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', border: `1px solid ${BORDER}`, animation: 'ab-ring 2.6s ease-out 1.3s infinite' }} />
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <Lock size={22} color="#fff" />
                </div>
              </div>
            </div>

            {[
              { Icon: Target, title: 'Transparence', desc: 'Un taux affiché et des frais clairs, sans surprise.' },
              { Icon: Globe,  title: 'Accessibilité', desc: 'Ouvert à toute l\'Afrique francophone, depuis un smartphone.' },
              { Icon: Zap,    title: 'Rapidité', desc: 'Transactions confirmées en moins de 5 minutes.' },
              { Icon: Users,  title: 'Communauté', desc: 'Construit avec et pour ses utilisateurs.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 18, padding: '24px 22px' }}>
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

      {/* COUVERTURE — présence régionale */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 56, alignItems: 'center' }} className="ab-hero">
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 12px' }}>Présence</p>
              <h2 style={{ fontSize: 'clamp(1.7rem,3.4vw,2.3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, margin: '0 0 14px' }}>Présents dans<br />toute la zone UEMOA</h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, margin: 0, maxWidth: 360 }}>Un service pensé pour l'Afrique de l'Ouest, du Sénégal au Bénin.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {COUNTRIES.map((c) => (
                <div key={c} className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 999, padding: '11px 18px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE — verticale avec nœuds */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <SectionHead eyebrow="Parcours" title="Notre histoire" sub="De la fondation à l'expansion régionale." />
          <div style={{ position: 'relative', paddingLeft: 28, maxWidth: 720 }}>
            <div style={{ position: 'absolute', left: 5, top: 8, bottom: 8, width: 1, background: BORDER }} />
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: i < MILESTONES.length - 1 ? 30 : 0 }}>
                <span style={{ position: 'absolute', left: -28, top: 4, width: 11, height: 11, borderRadius: '50%', background: i === 0 ? '#fff' : '#1e1e1e', border: `1px solid ${i === 0 ? '#fff' : 'rgba(255,255,255,0.25)'}` }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: MUTED2, letterSpacing: '0.02em' }}>{m.year}</span>
                <p style={{ fontSize: 17, fontWeight: 600, margin: '4px 0 3px' }}>{m.title}</p>
                <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.55 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <SectionHead eyebrow="L'équipe" title="Les visages derrière Terex" sub="Une équipe pluridisciplinaire au service de votre confiance." />
          <div className="ab-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {TEAM.map((m) => (
              <div key={m.name} className="ab-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 26px' }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, fontSize: 17, fontWeight: 700, letterSpacing: '0.02em' }}>{m.initials}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 2px' }}>{m.name}</h3>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: MUTED2, margin: '0 0 12px', letterSpacing: '0.02em' }}>{m.role}</p>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 130% at 50% 0%, rgba(255,255,255,0.045) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="ab-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '96px 32px', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Prêt à rejoindre Terex ?</h2>
          <p style={{ fontSize: 16, color: MUTED, margin: '0 0 30px' }}>Échangez vos USDT en FCFA dès aujourd'hui, simplement et en toute sécurité.</p>
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
    <div style={{ marginBottom: 38 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 10px' }}>{eyebrow}</p>
      <h2 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: '12px 0 0', maxWidth: 520, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

export default AboutPage;
