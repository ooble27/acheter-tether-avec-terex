import { Shield, Zap, Globe, Lock, TrendingUp, Users, ArrowRight, Wallet, CheckCircle2, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const CARD2 = '#1e1e1e';
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
        .bc-fade-2 { animation: bc-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .bc-cta { transition: transform 0.15s ease; }
        .bc-cta:hover { transform: translateY(-1px); }
        .bc-tile { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .bc-tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16) !important; }
        @keyframes bc-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.8); } }
        .bc-live-dot { animation: bc-pulse 1.5s ease-in-out infinite; }
        @keyframes bc-dash { to { stroke-dashoffset: -16; } }
        .bc-flow-line { stroke-dasharray: 4 4; animation: bc-dash 0.9s linear infinite; }
        @keyframes bc-travel { 0% { left: 6%; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: 94%; opacity: 0; } }
        .bc-packet { animation: bc-travel 3.2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes bc-check-pop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
        .bc-check { animation: bc-check-pop 0.5s ease 2.6s both; }
        @keyframes bc-node-glow { 0%,100% { opacity: 0.25; } 50% { opacity: 0.7; } }
        @media (max-width: 1100px) { .bc-vline { display: none !important; } }
        @media (max-width: 920px) {
          .bc-hero { grid-template-columns: 1fr !important; }
          .bc-hero-visual { display: none !important; }
        }
        @media (max-width: 860px) {
          .bc-hero-title { font-size: 40px !important; }
          .bc-grid3 { grid-template-columns: 1fr !important; }
          .bc-grid2 { grid-template-columns: 1fr !important; }
          .bc-nets { grid-template-columns: repeat(3,1fr) !important; }
          .bc-bento { grid-template-columns: 1fr !important; grid-auto-rows: auto !important; }
          .bc-bento-feat { grid-column: auto !important; grid-row: auto !important; }
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

      {/* HERO — éditorial + mockup transaction on-chain */}
      <header className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px 64px', position: 'relative', zIndex: 1 }}>
        <div className="bc-hero" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
          <div className="bc-fade">
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 16px' }}>Blockchain · USDT</p>
            <h1 className="bc-hero-title" style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.04em', margin: '0 0 20px' }}>
              La technologie qui réinvente les transferts d'argent.
            </h1>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 480 }}>
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

          {/* MOCKUP — transaction on-chain animée */}
          <div className="bc-hero-visual bc-fade-2" style={{ position: 'relative' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 22, padding: 22 }}>
              {/* En-tête */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ position: 'relative', width: 8, height: 8 }}>
                    <span className="bc-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.55)' }} />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Transaction en direct</span>
                </div>
                <span style={{ fontSize: 10.5, color: MUTED2, fontFamily: 'ui-monospace, Menlo, monospace' }}>TRC20</span>
              </div>

              {/* Flux wallet → réseau → confirmation */}
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, alignItems: 'center', marginBottom: 22 }}>
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: '28px', width: '100%', height: 20, zIndex: 0 }}>
                  <line className="bc-flow-line" x1="6" y1="10" x2="94" y2="10" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                </svg>
                <span className="bc-packet" style={{ position: 'absolute', top: '22px', width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: '0 0 12px rgba(255,255,255,0.6)', zIndex: 2 }} />
                {[
                  { icon: <Wallet size={18} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />, label: 'Wallet' },
                  { icon: <Radio size={18} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />, label: 'Réseau' },
                  { icon: <span className="bc-check" style={{ display: 'flex' }}><CheckCircle2 size={20} color="rgba(255,255,255,0.55)" strokeWidth={2} /></span>, label: 'Confirmé' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: CARD2, border: `1px solid ${i === 2 ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.icon}
                    </div>
                    <span style={{ fontSize: 11, color: MUTED2, fontWeight: 600 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Détail transaction */}
              <div style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={TETHER} alt="USDT" style={{ width: 30, height: 30 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>500,00 USDT</div>
                      <div style={{ fontSize: 11, color: MUTED2 }}>Tether · stablecoin</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9.5, color: MUTED2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valeur CFA</div>
                    {rateDisplay
                      ? <div style={{ fontSize: 14, fontWeight: 700 }}>{(terexRateCfa! * 500).toLocaleString('fr-FR')} <span style={{ fontSize: 10, color: MUTED2, fontWeight: 600 }}>CFA</span></div>
                      : <div style={{ width: 78, height: 14, borderRadius: 5, background: ICON_BG, marginTop: 3, marginLeft: 'auto' }} />}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
                  <span style={{ fontSize: 11, color: MUTED2, fontFamily: 'ui-monospace, Menlo, monospace' }}>0x7a3f…e9c2</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>
                    <CheckCircle2 size={12} /> 12 confirmations
                  </span>
                </div>
              </div>

              {/* Taux live */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: '0 4px' }}>
                <span style={{ fontSize: 11, color: MUTED2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Taux USDT / CFA</span>
                {rateDisplay
                  ? <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>{rateDisplay} <span style={{ fontSize: 10, color: MUTED2, fontWeight: 600 }}>CFA</span></span>
                  : <span style={{ display: 'inline-block', width: 64, height: 15, borderRadius: 5, background: ICON_BG }} />}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* QU'EST-CE QUE LA BLOCKCHAIN — éditorial + graphique nœuds */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
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

            {/* Graphique réseau de nœuds distribués */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 22, padding: '26px 24px', position: 'relative', overflow: 'hidden' }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED2, margin: '0 0 4px' }}>Registre distribué</p>
              <p style={{ fontSize: 13, color: MUTED, margin: '0 0 8px' }}>Aucun point de contrôle unique.</p>
              <div style={{ position: 'relative', height: 230 }}>
                <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%' }}>
                  {[
                    [150, 115, 60, 50], [150, 115, 245, 55], [150, 115, 45, 175], [150, 115, 255, 180], [150, 115, 150, 25], [150, 115, 150, 210],
                    [60, 50, 150, 25], [245, 55, 150, 25], [45, 175, 150, 210], [255, 180, 150, 210], [60, 50, 45, 175], [245, 55, 255, 180],
                  ].map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  ))}
                  {[[60, 50], [245, 55], [45, 175], [255, 180], [150, 25], [150, 210]].map(([cx, cy], i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                      <circle cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.55)" style={{ animation: `bc-node-glow 2.${i}s ease-in-out infinite` }} />
                    </g>
                  ))}
                  <circle cx="150" cy="115" r="22" fill={CARD2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                </svg>
                <img src={TETHER} alt="USDT" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 30, height: 30 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉSEAUX SUPPORTÉS — grille de logos raffinée */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 56, alignItems: 'center' }} className="bc-grid2">
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 12px' }}>Réseaux</p>
              <h2 style={{ fontSize: 'clamp(1.7rem,3.4vw,2.3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, margin: '0 0 14px' }}>6 réseaux<br />supportés</h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, margin: 0, maxWidth: 320 }}>Recevez et envoyez vos USDT sur le réseau de votre choix, au plus bas coût.</p>
            </div>
            <div className="bc-nets" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {NETWORKS.map(({ name, sub, logo }) => (
                <div key={name} className="bc-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 16, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={logo} alt={name} style={{ width: 38, height: 38, borderRadius: '50%', display: 'block' }} />
                    <img src={TETHER} alt="" style={{ position: 'absolute', right: -4, bottom: -4, width: 17, height: 17, borderRadius: '50%', border: `2px solid ${CARD}` }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, margin: '0 0 1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                    <p style={{ fontSize: 11, color: MUTED2, margin: 0, fontWeight: 600, letterSpacing: '0.04em' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI USDT — bento (une tuile vedette) */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <SectionHead eyebrow="Stablecoin" title="Pourquoi USDT Tether ?" sub="Un stablecoin adossé au dollar américain qui combine les avantages de la blockchain avec la stabilité d'une monnaie fiduciaire." />
          <div className="bc-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '1fr', gap: 14 }}>
            {/* Vedette : stabilité 1:1 */}
            <div className="bc-bento-feat bc-tile" style={{ gridColumn: '1 / 2', gridRow: '1 / 3', border: `1px solid ${BORDER}`, background: CARD, borderRadius: 22, padding: '30px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <img src={TETHER} alt="USDT" style={{ width: 28, height: 28 }} />
                </div>
                <h3 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>Stabilité du prix</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  1 USDT vaut 1 USD en permanence, éliminant la volatilité des cryptomonnaies traditionnelles.
                </p>
              </div>
              {/* Mini visuel parité */}
              <div style={{ marginTop: 24, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>1 USDT</span>
                <span style={{ fontSize: 18, color: MUTED2, fontWeight: 600 }}>=</span>
                <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>1 USD</span>
              </div>
            </div>

            {[
              { Icon: TrendingUp, title: 'Transparence', desc: 'Toutes les transactions sont visibles sur la blockchain et vérifiables publiquement.' },
              { Icon: Users, title: 'Adoption mondiale', desc: 'Accepté par des millions d\'utilisateurs et d\'entreprises dans le monde entier.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bc-tile" style={{ gridColumn: '2 / 4', border: `1px solid ${BORDER}`, background: CARD, borderRadius: 20, padding: '26px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={21} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT AFRIQUE — bento asymétrique */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1 }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 32px' }}>
          <SectionHead eyebrow="Impact" title="La blockchain au service de l'Afrique" sub="Comment cette technologie transforme les transferts d'argent et l'inclusion financière en Afrique de l'Ouest." />
          <div className="bc-grid2" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 14 }}>
            {/* Coûts — large avec comparateur */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 22, padding: '30px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Réduction des coûts</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 20px' }}>
                Les transferts traditionnels coûtent souvent 5-10 % du montant envoyé. Avec la blockchain, ces frais tombent sous la barre des 1 %.
              </p>
              <p style={{ fontSize: 12, color: MUTED2, margin: '0 0 12px' }}>Exemple : envoi de 500 CAD vers le Sénégal</p>
              {/* Barres comparatives */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: MUTED }}>Virement traditionnel</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>25–50 CAD</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: CARD2, overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', background: 'rgba(255,255,255,0.55)', borderRadius: 999 }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: MUTED }}>Avec Terex (USDT)</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>2–5 CAD</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: CARD2, overflow: 'hidden' }}>
                    <div style={{ width: '12%', height: '100%', background: 'rgba(255,255,255,0.55)', borderRadius: 999 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Rapidité */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 22, padding: '30px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Rapidité</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 20px' }}>
                Les transferts USDT arrivent en quelques minutes, même le week-end.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ border: `1px solid rgba(74,222,128,0.3)`, background: CARD2, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: MUTED }}>USDT Terex</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'rgba(255,255,255,0.55)' }}>3–5 min</span>
                </div>
                <div style={{ border: `1px solid ${BORDER}`, background: CARD2, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: MUTED }}>Banque</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>3–7 j</span>
                </div>
              </div>
            </div>

            {/* Inclusion */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 22, padding: '30px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Inclusion financière</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 18px' }}>
                Accédez aux services financiers avec un simple smartphone, sans compte bancaire.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Pas de compte bancaire', 'Accessible 24h/24', 'Interface en français'].map((t) => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: `1px solid ${BORDER}`, background: CARD2, borderRadius: 999, padding: '8px 14px', fontSize: 12.5, color: MUTED }}>
                    <CheckCircle2 size={13} color="rgba(255,255,255,0.5)" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Sécurité */}
            <div className="bc-tile" style={{ border: `1px solid ${BORDER}`, background: CARD, borderRadius: 22, padding: '30px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Sécurité renforcée</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: '0 0 18px' }}>
                La cryptographie offre un niveau de sécurité supérieur aux systèmes bancaires.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ border: `1px solid ${BORDER}`, background: CARD2, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                  <Shield size={20} color="rgba(255,255,255,0.85)" style={{ margin: '0 auto 8px', display: 'block' }} strokeWidth={1.8} />
                  <span style={{ fontSize: 12, color: MUTED }}>Chiffrement AES-256</span>
                </div>
                <div style={{ border: `1px solid ${BORDER}`, background: CARD2, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                  <Lock size={20} color="rgba(255,255,255,0.85)" style={{ margin: '0 auto 8px', display: 'block' }} strokeWidth={1.8} />
                  <span style={{ fontSize: 12, color: MUTED }}>Clés privées</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${BORDER}`, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div className="bc-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '96px 32px', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Prêt à découvrir l'avenir des transferts ?</h2>
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
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: MUTED2, margin: '0 0 10px' }}>{eyebrow}</p>
      <h2 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: '12px 0 0', maxWidth: 520, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

export default BlockchainPage;
