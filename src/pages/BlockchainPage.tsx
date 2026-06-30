import { Shield, Zap, Globe, Lock, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#141414';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';
const TETHER = 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png';

const NETWORKS = [
  { name: 'Tron', sub: 'TRC20', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png' },
  { name: 'BNB Chain', sub: 'BEP20', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
  { name: 'Ethereum', sub: 'ERC20', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
  { name: 'Polygon', sub: 'MATIC', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' },
  { name: 'Solana', sub: 'SPL', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
  { name: 'Aptos', sub: 'APT', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' },
];

const BASICS = [
  { Icon: Shield, title: 'Sécurité maximale', desc: 'Chaque transaction est cryptée et vérifiée par le réseau, sans organe central.' },
  { Icon: Zap, title: 'Rapidité', desc: 'Des transferts instantanés, 24h/24 et 7j/7, partout dans le monde.' },
  { Icon: Globe, title: 'Sans frontières', desc: 'Accessible partout, sans intermédiaire bancaire ni délai d\'ouverture.' },
];

const USDT_CARDS = [
  { Icon: null as null, tether: true, title: 'Stabilité du prix', desc: '1 USDT = 1 USD en permanence, éliminant la volatilité des cryptomonnaies traditionnelles.' },
  { Icon: TrendingUp, tether: false, title: 'Transparence', desc: 'Toutes les transactions sont visibles sur la blockchain et vérifiables publiquement.' },
  { Icon: Users, tether: false, title: 'Adoption mondiale', desc: 'Accepté par des millions d\'utilisateurs et d\'entreprises dans le monde entier.' },
];

const BlockchainPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: 'Déconnexion réussie', description: 'À bientôt' }); window.location.reload(); }
  };

  const handleGetStarted = () => navigate('/auth');
  const handleHome = () => navigate('/');

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes bc-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .bc-fade { animation: bc-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .bc-cta { transition: transform 0.15s ease; }
        .bc-cta:hover { transform: translateY(-1px); }
        .bc-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .bc-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        @media (max-width: 1100px) { .bc-vline { display: none !important; } }
        @media (max-width: 860px) {
          .bc-hero-title { font-size: 40px !important; }
          .bc-grid3 { grid-template-columns: 1fr !important; }
          .bc-grid2 { grid-template-columns: 1fr !important; }
          .bc-nets { grid-template-columns: repeat(3,1fr) !important; }
          .bc-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 560px) {
          .bc-hero-title { font-size: 31px !important; }
          .bc-nets { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div style={{ height: 64 }} />

      <div className="bc-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="bc-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HERO */}
      <header className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px 64px', position: 'relative', zIndex: 1 }}>
        <div className="bc-fade" style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 16px' }}>Blockchain · USDT</p>
          <h1 className="bc-hero-title" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em', margin: '0 0 20px' }}>
            La technologie qui réinvente les transferts d'argent.
          </h1>
          <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 580 }}>
            Découvrez comment la blockchain et les stablecoins comme USDT Tether rendent les virements internationaux plus rapides, moins chers et plus sécurisés.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleGetStarted} className="bc-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, padding: '0 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Commencer avec Terex <ArrowRight size={16} />
            </button>
            <button onClick={handleHome} style={{ background: '#2d2d2d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, height: 50, padding: '0 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </header>

      {/* LIVE RATE + WHAT IS BLOCKCHAIN */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <div className="bc-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 48, alignItems: 'center' }}>
            <div>
              <SectionHead eyebrow="Les fondamentaux" title="Qu'est-ce que la blockchain ?" sub="Une technologie de registre distribué qui fonctionne sans organe central de contrôle, sécurisée par cryptographie." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {BASICS.map(({ Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15.5, fontWeight: 600, margin: '0 0 3px' }}>{title}</h3>
                      <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live rate tile + block grid */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 26px' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED2, margin: '0 0 10px' }}>Taux USDT / CFA · en direct</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minHeight: 44 }}>
                  {rateDisplay ? (
                    <>
                      <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-1.2px', lineHeight: 1 }}>{rateDisplay}</span>
                      <span style={{ color: MUTED2, fontSize: 15, fontWeight: 600 }}>CFA</span>
                    </>
                  ) : (
                    <span style={{ display: 'inline-block', width: 130, height: 38, borderRadius: 10, background: ICON_BG }} />
                  )}
                </div>
                <img src={TETHER} alt="USDT" style={{ width: 44, height: 44, opacity: 0.9 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 0', textAlign: 'center' }}>
                    <Lock size={18} color="rgba(255,255,255,0.7)" style={{ margin: '0 auto 6px', display: 'block' }} strokeWidth={1.8} />
                    <span style={{ fontSize: 10.5, color: MUTED2 }}>Bloc {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED NETWORKS */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Réseaux" title="6 réseaux blockchain supportés" sub="Recevez et envoyez vos USDT sur le réseau de votre choix." />
          <div className="bc-nets" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {NETWORKS.map(({ name, sub, logo }) => (
              <div key={name} className="bc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 14px', textAlign: 'center' }}>
                <img src={logo} alt={name} style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontSize: 13.5, fontWeight: 600, margin: '0 0 2px' }}>{name}</p>
                <p style={{ fontSize: 11, color: MUTED2, margin: 0, fontWeight: 600, letterSpacing: '0.04em' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY USDT */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Stablecoin" title="Pourquoi USDT Tether ?" sub="Un stablecoin adossé au dollar américain qui combine les avantages de la blockchain avec la stabilité d'une monnaie fiduciaire." />
          <div className="bc-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {USDT_CARDS.map(({ Icon, tether, title, desc }) => (
              <div key={title} className="bc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '26px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {tether ? (
                    <img src={TETHER} alt="USDT" style={{ width: 26, height: 26 }} />
                  ) : Icon ? (
                    <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                  ) : null}
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCKCHAIN FOR AFRICA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <SectionHead eyebrow="Impact" title="La blockchain au service de l'Afrique" sub="Comment cette technologie transforme les transferts d'argent et l'inclusion financière en Afrique de l'Ouest." />
          <div className="bc-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Coûts */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 26px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Réduction des coûts</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 18px' }}>
                Les transferts traditionnels coûtent souvent 5-10 % du montant envoyé. Avec la blockchain, ces frais tombent sous la barre des 1 %.
              </p>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px' }}>
                <p style={{ fontSize: 12, color: MUTED2, margin: '0 0 12px' }}>Exemple : envoi de 500 CAD vers le Sénégal</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 12.5, color: MUTED, margin: '0 0 3px' }}>Virement traditionnel</p>
                    <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>25–50 CAD</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12.5, color: MUTED, margin: '0 0 3px' }}>Avec Terex (USDT)</p>
                    <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>2–5 CAD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rapidité */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 26px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Rapidité des transferts</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 18px' }}>
                Fini les délais de 3 à 7 jours ouvrables. Les transferts USDT arrivent en quelques minutes, même le week-end.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 2px' }}>3–5 min</p>
                  <p style={{ fontSize: 11.5, color: MUTED2, margin: 0 }}>USDT Terex</p>
                </div>
                <span style={{ fontSize: 13, color: MUTED2 }}>vs</span>
                <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 2px', color: 'rgba(255,255,255,0.7)' }}>3–7 jours</p>
                  <p style={{ fontSize: 11.5, color: MUTED2, margin: 0 }}>Banque traditionnelle</p>
                </div>
              </div>
            </div>

            {/* Inclusion */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 26px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Inclusion financière</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 18px' }}>
                La blockchain permet aux personnes non bancarisées d'accéder aux services financiers avec un simple smartphone.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {['Pas besoin de compte bancaire', 'Accessible 24h/24', 'Interface simple en français'].map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: MUTED }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Sécurité */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 26px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Sécurité renforcée</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 18px' }}>
                La cryptographie blockchain offre un niveau de sécurité supérieur aux systèmes bancaires traditionnels.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                  <Shield size={20} color="rgba(255,255,255,0.85)" style={{ margin: '0 auto 8px', display: 'block' }} strokeWidth={1.8} />
                  <span style={{ fontSize: 12, color: MUTED }}>Chiffrement AES-256</span>
                </div>
                <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                  <Lock size={20} color="rgba(255,255,255,0.85)" style={{ margin: '0 auto 8px', display: 'block' }} strokeWidth={1.8} />
                  <span style={{ fontSize: 12, color: MUTED }}>Clés privées</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Prêt à découvrir l'avenir des transferts ?</h2>
          <p style={{ fontSize: 16, color: MUTED, margin: '0 0 28px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Rejoignez la révolution blockchain avec Terex : des transferts plus rapides, moins chers et plus sécurisés.
          </p>
          <button onClick={handleGetStarted} className="bc-cta" style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 52, padding: '0 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Commencer avec Terex <ArrowRight size={17} />
          </button>
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

export default BlockchainPage;
