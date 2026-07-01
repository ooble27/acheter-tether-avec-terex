import { ArrowRight, Handshake, Repeat, Zap, Lock, ShieldCheck, Headphones, TrendingUp, Coins, CheckCircle2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

const WHATSAPP = 'https://wa.me/+14182619091';

const VALUES = [
  { Icon: TrendingUp,  title: 'Taux préférentiels', desc: 'Des conditions négociées sur mesure, meilleures que le taux standard, dès les gros montants.' },
  { Icon: Repeat,      title: 'Liquidité profonde', desc: 'Exécutez des transactions importantes en une fois, sans impact sur le marché.' },
  { Icon: Handshake,   title: 'Accompagnement dédié', desc: 'Un interlocuteur unique vous accompagne de la demande au règlement.' },
  { Icon: Zap,         title: 'Règlement rapide', desc: 'Fonds ou USDT livrés rapidement après confirmation, sur le réseau de votre choix.' },
  { Icon: Lock,        title: 'Confidentialité', desc: 'Vos opérations restent privées et traitées avec la plus grande discrétion.' },
  { Icon: Headphones,  title: 'Support VIP 24/7', desc: 'Une équipe disponible à tout moment par WhatsApp, téléphone ou email.' },
];

const STEPS = [
  { n: '1', title: 'Votre demande', desc: 'Indiquez le montant et le sens de l\'opération (achat ou vente).' },
  { n: '2', title: 'Devis personnalisé', desc: 'Nous vous proposons un taux ferme et les conditions de règlement.' },
  { n: '3', title: 'Règlement sécurisé', desc: 'Une fois validé, la transaction est réglée rapidement et en toute sécurité.' },
];

const OTCPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rate = !rateLoading && terexRateCfa ? terexRateCfa : null;
  const [vol, setVol] = useState(50000);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: 'Déconnexion réussie', description: 'À bientôt' }); window.location.reload(); }
  };

  const received = rate ? (vol * rate).toLocaleString('fr-FR') : null;
  const rateDisplay = rate ? rate.toLocaleString('fr-FR') : null;

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes otc-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .otc-fade { animation: otc-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .otc-fade-2 { animation: otc-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .otc-cta { transition: transform 0.15s ease; }
        .otc-cta:hover { transform: translateY(-1px); }
        .otc-tile { transition: border-color 0.25s ease, transform 0.25s ease; }
        .otc-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.16) !important; }
        .otc-range { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 999px; background: rgba(255,255,255,0.12); outline: none; }
        .otc-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fff; cursor: pointer; border: 3px solid #1a1a1a; box-shadow: 0 0 0 1px rgba(255,255,255,0.2); }
        .otc-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff; cursor: pointer; border: 3px solid #1a1a1a; }
        @media (max-width: 1100px) { .otc-vline { display: none !important; } }
        @media (max-width: 920px) {
          .otc-hero { grid-template-columns: 1fr !important; }
          .otc-grid3 { grid-template-columns: 1fr !important; }
          .otc-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 860px) { .otc-grid2 { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .otc-hero-title { font-size: 33px !important; } }
      `}</style>

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div style={{ height: 64 }} />

      <div className="otc-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="otc-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO */}
      <header className="otc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px 72px', position: 'relative', zIndex: 1 }}>
        <div className="otc-hero" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
          <div className="otc-fade">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, marginBottom: 22 }}>
              <Handshake size={14} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Terex OTC Desk</span>
            </div>
            <h1 className="otc-hero-title" style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.04em', margin: '0 0 22px' }}>
              Négociez de gros<br />volumes de USDT.
            </h1>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 34px', maxWidth: 480 }}>
              Pour les transactions importantes, notre desk OTC vous offre des taux préférentiels, une liquidité profonde et un accompagnement dédié, en toute confidentialité.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => window.open(WHATSAPP, '_blank')} className="otc-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Demander un devis <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/contact')} style={{ background: '#2d2d2d', color: '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, height: 50, padding: '0 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Nous contacter
              </button>
            </div>
          </div>

          {/* Mockup — simulateur de devis OTC (taux live) */}
          <div className="otc-fade-2">
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Simulateur de devis</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: MUTED2 }}>
                  Taux : {rateDisplay ? <b style={{ color: '#fff', fontWeight: 700 }}>{rateDisplay} CFA</b> : <span style={{ display: 'inline-block', width: 54, height: 12, borderRadius: 4, background: ICON_BG }} />}
                </span>
              </div>

              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED2, margin: '0 0 10px' }}>Volume (USDT)</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>{vol.toLocaleString('fr-FR')}</span>
                <span style={{ fontSize: 14, color: MUTED2, fontWeight: 600 }}>USDT</span>
              </div>
              <input type="range" min={10000} max={500000} step={5000} value={vol} onChange={e => setVol(Number(e.target.value))} className="otc-range" style={{ width: '100%', marginBottom: 20 }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Coins size={20} color="rgba(255,255,255,0.9)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: MUTED2, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vous recevez (estimation)</p>
                  {received
                    ? <p style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{received} <span style={{ fontSize: 13, color: MUTED2, fontWeight: 600 }}>CFA</span></p>
                    : <span style={{ display: 'inline-block', width: 160, height: 20, borderRadius: 6, background: ICON_BG }} />}
                </div>
              </div>
              <p style={{ fontSize: 11.5, color: MUTED2, margin: '12px 2px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} color="rgba(255,255,255,0.5)" /> Estimation indicative — un taux ferme vous est confirmé sur devis.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* VALEURS */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="otc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <SectionHead eyebrow="Pourquoi le desk OTC" title="Conçu pour les gros volumes" sub="Tout ce qu'il faut pour exécuter vos transactions importantes en toute sérénité." />
          <div className="otc-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {VALUES.map(({ Icon, title, desc }) => (
              <div key={title} className="otc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '26px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="otc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <SectionHead eyebrow="Le processus" title="Simple, en 3 étapes" sub="De la demande au règlement, un parcours fluide et transparent." />
          <div className="otc-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 15, fontWeight: 700 }}>{n}</div>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIES bandeau */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="otc-pad otc-grid2" style={{ maxWidth: 1120, margin: '0 auto', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { Icon: ShieldCheck, t: 'Sécurité & conformité', s: 'KYC et procédures renforcées.' },
            { Icon: Lock, t: 'Confidentialité totale', s: 'Vos opérations restent privées.' },
            { Icon: Headphones, t: 'Interlocuteur dédié', s: 'Un contact unique, 24/7.' },
          ].map(({ Icon, t, s }, i, arr) => (
            <div key={t} style={{ padding: '34px 28px', borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={19} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 3px' }}>{t}</p>
                <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 130% at 50% 0%, rgba(255,255,255,0.045) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="otc-pad" style={{ maxWidth: 900, margin: '0 auto', padding: '96px 32px', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
            <Handshake size={26} color="#fff" strokeWidth={1.7} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 14px' }}>Un projet de gros volume ?</h2>
          <p style={{ fontSize: 16, color: MUTED, margin: '0 0 30px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>Parlez à notre desk OTC. Réponse rapide, devis ferme et accompagnement de bout en bout.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.open(WHATSAPP, '_blank')} className="otc-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 52, padding: '0 30px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <MessageCircle size={17} /> Contacter le desk OTC
            </button>
            <button onClick={() => navigate('/auth')} style={{ background: '#2d2d2d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, height: 52, padding: '0 26px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Créer un compte
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

export default OTCPage;
