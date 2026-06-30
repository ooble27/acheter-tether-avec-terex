import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Zap, Globe, Shield, Layers, TrendingUp, Repeat,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { BuyUSDT } from '@/components/features/BuyUSDT';
import { SellUSDT } from '@/components/features/SellUSDT';
import { TransactionHistoryPage } from '@/components/features/TransactionHistoryPage';
import { FooterSection } from './sections/FooterSection';

// ── Palette neutre — AUCUN vert ───────────────────────────────────────
const C = {
  bg: '#141414', l1: '#1a1a1a', l2: '#1e1e1e', l3: '#242424',
  bds: 'rgba(255,255,255,0.07)', bd: 'rgba(255,255,255,0.12)',
  t1: '#ffffff', t2: 'rgba(255,255,255,0.56)', t3: 'rgba(255,255,255,0.4)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const DEMO = { email: 'demo@terex.sn', name: 'Awa Diop', id: 'demo' };

// CSS : animations tuées + responsive mobile
const GLOBAL_CSS = `
  .biz-no-anim { contain: layout size; }
  .biz-no-anim * {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .biz-no-anim .recharts-responsive-container { overflow: hidden !important; }
  .biz-no-anim .recharts-wrapper { overflow: hidden !important; }
  .biz-no-anim .recharts-cartesian-grid { display: none !important; }

  .biz-root { overflow-x: hidden; }

  @media (max-width: 1100px) {
    .biz-vline { display: none !important; }
  }

  @media (max-width: 900px) {
    .biz-hero-preview {
      padding: 0 !important;
      overflow: hidden !important;
    }
    .biz-section-row { gap: 24px !important; padding: 48px 24px !important; }
    .biz-section-row-rev { gap: 24px !important; padding: 48px 24px !important; }
    .biz-preview { max-width: 300px !important; }
    .biz-features { grid-template-columns: 1fr 1fr !important; }
    .biz-networks-grid { grid-template-columns: 1fr 1fr !important; }
    .biz-faq-row { flex-direction: column !important; gap: 16px !important; }
    .biz-outer-pad { padding-left: 24px !important; padding-right: 24px !important; }
  }

  @media (max-width: 600px) {
    .biz-nav-actions { display: none !important; }
    .biz-nav { padding: 0 16px !important; }
    .biz-hero-title { font-size: 28px !important; letter-spacing: -0.04em !important; }
    .biz-hero-sub { display: none !important; }
    .biz-hero-preview { display: none !important; }
    .biz-hero-btns { flex-direction: column !important; align-items: center !important; gap: 8px !important; }
    .biz-section-row { flex-direction: column !important; gap: 16px !important; padding: 32px 16px !important; }
    .biz-section-row-rev { flex-direction: column !important; gap: 16px !important; padding: 32px 16px !important; }
    .biz-section-row h2, .biz-section-row-rev h2 { font-size: 20px !important; margin-bottom: 8px !important; }
    .biz-section-row p, .biz-section-row-rev p { font-size: 13px !important; }
    .biz-section-row .biz-stats, .biz-section-row-rev .biz-stats { display: none !important; }
    .biz-preview { width: 100% !important; max-width: 100% !important; flex-shrink: 1 !important; }
    .biz-features { grid-template-columns: 1fr !important; }
    .biz-networks-grid { grid-template-columns: 1fr 1fr !important; }
    .biz-outer-pad { padding-left: 16px !important; padding-right: 16px !important; }
    .biz-faq-row { padding: 0 !important; gap: 12px !important; }
    .biz-faq-head { flex: none !important; }
    .biz-faq-head h2 { font-size: 22px !important; margin-bottom: 8px !important; }
    .biz-faq-head p { font-size: 12px !important; }
  }
`;

// ── Preview constants ─────────────────────────────────────────────────
const SCALE   = 0.58;
const FRAME_W = 640;
const INNER_W = Math.round(FRAME_W / SCALE);

const HERO_SCALE   = 0.65;
const HERO_VW      = 1064;
const HERO_VH      = 460;
const HERO_INNER_W = Math.round(HERO_VW / HERO_SCALE);
const HERO_INNER_H = Math.round(HERO_VH / HERO_SCALE);

// ── Rendu direct sans cadre — scale auto sur mobile ──────────────────
function InlinePreview({ children, height = 420 }: { children: React.ReactNode; height?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 600) {
      return Math.min(1, (window.innerWidth - 64) / FRAME_W);
    }
    return 1;
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      setS(prev => { const n = w >= FRAME_W ? 1 : w / FRAME_W; return Math.abs(prev - n) > 0.005 ? n : prev; });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const innerH = Math.round(height / SCALE);
  const visH   = Math.round(height * s);

  return (
    <div ref={wrapRef} className="biz-preview" style={{ position: 'relative', width: FRAME_W, maxWidth: '100%', flexShrink: 0 }}>
      <div style={{ height: visH, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: s < 1 ? `scale(${s})` : undefined, width: FRAME_W }}>
          <div className="biz-no-anim" style={{ width: FRAME_W, height, overflow: 'hidden' }}>
            <div style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left', width: INNER_W, height: innerH, overflow: 'hidden', pointerEvents: 'none', userSelect: 'none', willChange: 'transform' }}>
              <div style={{ padding: '12px 16px' }}>{children}</div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, background: `linear-gradient(transparent, ${C.bg})`, pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  );
}

// ── Boutons ───────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      height: large ? 50 : 40, paddingLeft: large ? 28 : 20, paddingRight: large ? 28 : 20,
      background: hov ? '#e9e9e9' : '#ffffff', border: 'none', borderRadius: 12,
      color: '#111111', fontSize: large ? 15 : 13, fontWeight: 700,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONT, transition: 'background 0.15s', whiteSpace: 'nowrap',
      letterSpacing: '-0.01em',
    }}>{children}</button>
  );
}
function OutlineBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      height: large ? 50 : 40, paddingLeft: large ? 26 : 18, paddingRight: large ? 26 : 18,
      background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 12,
      color: hov ? C.t1 : C.t2, fontSize: large ? 15 : 13, fontWeight: 500,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

const FEATURES = [
  { icon: Zap,        title: 'Achat instantané',        desc: 'Achetez des USDT en quelques secondes depuis votre solde CFA, avec confirmation immédiate.' },
  { icon: TrendingUp, title: 'Vente rapide',            desc: 'Vendez vos USDT et recevez le paiement directement sur Wave ou Orange Money.' },
  { icon: Globe,      title: "Virements vers l'Afrique", desc: 'Envoyez de l\'argent vers vos proches partout en Afrique, rapidement et au meilleur taux.' },
  { icon: Layers,     title: 'Multi-réseaux',           desc: 'TRC20, BEP20, ERC20, Polygon et Arbitrum — choisissez le réseau qui vous convient.' },
  { icon: Repeat,     title: 'Meilleur taux CFA',       desc: 'Profitez d\'un taux USDT/CFA actualisé en temps réel et toujours compétitif.' },
  { icon: Shield,     title: 'Sécurité & KYC',          desc: 'Vos transactions sont protégées par une vérification d\'identité et un chiffrement de bout en bout.' },
];

function Tag({ label }: { label: string }) {
  return (
    <div style={{ display: 'inline-block', background: C.l2, border: `1px solid ${C.bd}`, padding: '5px 14px', borderRadius: 100, marginBottom: 20 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: C.t2, fontFamily: FONT }}>{label}</span>
    </div>
  );
}
function SectionStats({ items }: { items: [string, string][] }) {
  return (
    <div className="biz-stats" style={{ display: 'flex', gap: 32, paddingTop: 24, borderTop: `1px solid ${C.bds}`, flexWrap: 'wrap' }}>
      {items.map(([val, label]) => (
        <div key={val + label}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em' }}>{val}</div>
          <div style={{ fontSize: 12, color: C.t3, fontFamily: FONT, marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

const NETWORKS = [
  { name: 'TRC20',    chain: 'Tron' },
  { name: 'BEP20',    chain: 'BNB Smart Chain' },
  { name: 'ERC20',    chain: 'Ethereum' },
  { name: 'Polygon',  chain: 'Polygon PoS' },
  { name: 'Arbitrum', chain: 'Arbitrum One' },
];

const FAQ_ITEMS = [
  { q: 'Comment acheter des USDT sur Terex ?', a: "Connectez-vous, entrez le montant en CFA que vous souhaitez convertir, choisissez votre réseau (TRC20, BEP20, ERC20, Polygon ou Arbitrum) et indiquez votre adresse wallet. Vos USDT sont envoyés en quelques minutes." },
  { q: 'Quels réseaux blockchain sont supportés ?', a: 'Terex prend en charge cinq réseaux : TRC20 (Tron), BEP20 (BNB Smart Chain), ERC20 (Ethereum), Polygon et Arbitrum. Vous choisissez le réseau au moment de l\'achat ou de la vente selon vos préférences et vos frais.' },
  { q: 'Quels sont les délais de traitement ?', a: 'La réception de vos USDT prend généralement moins de 5 minutes après confirmation du paiement. Pour les ventes, le paiement vers Wave ou Orange Money est immédiat dès la confirmation de réception des fonds.' },
  { q: 'Quels sont les frais ?', a: 'Terex applique un taux USDT/CFA transparent et actualisé en temps réel. Le taux affiché au moment de la transaction est celui qui vous est appliqué, sans frais cachés.' },
  { q: 'Comment vendre mes USDT ?', a: 'Sélectionnez « Vendre », indiquez le montant d\'USDT à céder et le réseau d\'envoi, puis choisissez votre méthode de réception (Wave ou Orange Money). Une fois vos USDT reçus, le paiement en CFA est envoyé immédiatement.' },
  { q: 'Mes fonds et mes données sont-ils en sécurité ?', a: 'Oui. Terex applique une vérification d\'identité (KYC), chiffre vos données de bout en bout et sécurise chaque transaction sur la blockchain. Vos informations ne sont jamais partagées sans votre consentement.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.bds}` }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 0', textAlign: 'left', fontFamily: FONT }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: open ? C.t1 : C.t2, transition: 'color 0.15s', lineHeight: 1.4 }}>{q}</span>
        {open ? <ChevronUp style={{ width: 16, height: 16, color: C.t3, flexShrink: 0 }} /> : <ChevronDown style={{ width: 16, height: 16, color: C.t3, flexShrink: 0 }} />}
      </button>
      {open && <p style={{ fontSize: 14, color: C.t3, lineHeight: 1.75, margin: '0 0 18px', paddingRight: 32, fontFamily: FONT }}>{a}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
export function TerexLanding({ user, onShowDashboard }: { user?: { email: string; name: string } | null; onShowDashboard?: () => void }) {
  const navigate = useNavigate();

  const goAuth = () => navigate('/auth');
  const goPrimary = () => { if (user && onShowDashboard) onShowDashboard(); else navigate('/auth'); };

  const heroPreviewRef = useRef<HTMLDivElement>(null);
  const [heroScale, setHeroScale] = useState(1);
  useEffect(() => {
    const el = heroPreviewRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      setHeroScale(prev => { const s = w >= HERO_VW ? 1 : w / HERO_VW; return Math.abs(prev - s) > 0.005 ? s : prev; });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="biz-root" style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1, position: 'relative' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── VERTICAL LINES ── */}
      <div className="biz-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 580px)', width: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none', zIndex: 1 }} />
      <div className="biz-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 580px)', width: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none', zIndex: 1 }} />

      {/* ── NAV ── */}
      <nav className="biz-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(20,20,20,0.92)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.bds}`, padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} />
            <span style={{ color: C.t1, fontSize: 15, fontWeight: 700 }}>Terex</span>
          </button>
        </div>
        <div className="biz-nav-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <PrimaryBtn onClick={goPrimary}>Mon tableau de bord <ArrowRight style={{ width: 14, height: 14 }} /></PrimaryBtn>
          ) : (
            <>
              <span><OutlineBtn onClick={goAuth}>Se connecter</OutlineBtn></span>
              <PrimaryBtn onClick={goAuth}>Commencer <ArrowRight style={{ width: 14, height: 14 }} /></PrimaryBtn>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ background: C.bg, paddingTop: 96, overflow: 'hidden', position: 'relative' }}>
        <div className="biz-outer-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 48px', textAlign: 'center', marginBottom: 52 }}>
          <h1 className="biz-hero-title" style={{ fontSize: 64, fontWeight: 900, color: C.t1, margin: '0 0 20px', letterSpacing: '-0.05em', lineHeight: 1.04, fontFamily: FONT }}>
            Achetez et vendez des USDT<br />en toute simplicité
          </h1>
          <p className="biz-hero-sub" style={{ fontSize: 18, color: C.t2, margin: '0 auto 40px', maxWidth: 540, lineHeight: 1.65, fontFamily: FONT }}>
            Achat et vente de stablecoins et virements vers l'Afrique :<br />rapide, sécurisé et au meilleur taux CFA.
          </p>
          <div className="biz-hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <PrimaryBtn large onClick={goPrimary}>
              {user ? 'Mon tableau de bord' : 'Créer un compte'} <ArrowRight style={{ width: 15, height: 15 }} />
            </PrimaryBtn>
            <OutlineBtn large onClick={goAuth}>Se connecter</OutlineBtn>
          </div>
        </div>

        {/* Hero preview — DashboardHome */}
        <div
          ref={heroPreviewRef}
          className="biz-hero-preview"
          style={{
            maxWidth: 1160, margin: '0 auto', padding: '0 48px',
            position: 'relative', zIndex: 2,
            overflow: heroScale < 1 ? 'hidden' : undefined,
            height: heroScale < 1 ? Math.round(HERO_VH * heroScale) : undefined,
          }}
        >
          <div className="biz-hero-3d-wrap" style={{ perspective: heroScale < 1 ? 'none' : '900px', perspectiveOrigin: '50% 20%' }}>
            <div className="biz-hero-3d-inner" style={{
              transform: heroScale < 1 ? `scale(${heroScale})` : 'rotateX(20deg) scale(0.97)',
              transformOrigin: heroScale < 1 ? 'top left' : 'center top',
              borderRadius: '16px 16px 0 0',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.10)',
              borderBottom: 'none',
              boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
            }}>
              <div className="biz-no-anim" style={{ width: HERO_VW, height: HERO_VH, overflow: 'hidden', background: '#141414' }}>
                <div style={{ transform: `scale(${HERO_SCALE})`, transformOrigin: 'top left', width: HERO_INNER_W, height: HERO_INNER_H, overflow: 'hidden', pointerEvents: 'none', userSelect: 'none', willChange: 'transform' }}>
                  <div style={{ padding: '20px 28px' }}>
                    <DashboardHome user={DEMO} onNavigate={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES 3-COL ── */}
      <div id="features" style={{ borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}` }}>
        <div className="biz-outer-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '72px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.t1, margin: '0 0 10px', letterSpacing: '-0.03em', fontFamily: FONT }}>Tout ce qu'il vous faut pour vos USDT</h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>Acheter, vendre et envoyer de l'argent, en quelques clics</p>
          </div>
          <div className="biz-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ padding: '32px 34px', borderRight: (i + 1) % 3 !== 0 ? `1px solid ${C.bds}` : 'none', borderBottom: i < 3 ? `1px solid ${C.bds}` : 'none' }}>
                  <Icon style={{ width: 20, height: 20, color: C.t3, marginBottom: 18 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.t1, margin: '0 0 8px', fontFamily: FONT, letterSpacing: '-0.012em' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.65, margin: 0, fontFamily: FONT }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTIONS ALTERNÉES ── */}
      <div className="biz-outer-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 48px' }}>

        {/* Acheter */}
        <div className="biz-section-row" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Acheter" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Achetez des USDT<br />en quelques secondes</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Entrez le montant en CFA, choisissez votre réseau et votre adresse wallet. La conversion se fait instantanément au meilleur taux.</p>
            <SectionStats items={[['< 5 min', 'Réception'], ['5 réseaux', 'Supportés'], ['Meilleur taux', 'CFA']]} />
          </div>
          <InlinePreview height={430}><BuyUSDT /></InlinePreview>
        </div>

        {/* Vendre */}
        <div className="biz-section-row-rev" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}`, flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Vendre" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Vendez vos USDT<br />et soyez payé aussitôt</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Indiquez le montant à céder et recevez votre paiement directement sur Wave ou Orange Money, dès la confirmation de réception.</p>
            <SectionStats items={[['Wave & Orange', 'Mobile Money'], ['Paiement', 'Immédiat'], ['0 %', 'Commission']]} />
          </div>
          <InlinePreview height={430}><SellUSDT /></InlinePreview>
        </div>

        {/* Historique */}
        <div className="biz-section-row" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Historique" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Suivez toutes vos<br />transactions</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Retrouvez l'ensemble de vos achats, ventes et virements au même endroit, avec tous les détails et un suivi en temps réel.</p>
            <SectionStats items={[['Suivi', 'Temps réel'], ['Tous types', 'Achat/Vente/Virement'], ['Détails', 'Complets']]} />
          </div>
          <InlinePreview height={430}><TransactionHistoryPage /></InlinePreview>
        </div>

        {/* Tableau de bord */}
        <div className="biz-section-row-rev" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Tableau de bord" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Tout votre univers USDT<br />en un coup d'œil</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Taux live, actions rapides et activité récente : votre tableau de bord vous donne accès à l'essentiel en un seul clic.</p>
            <SectionStats items={[['Taux live', 'USDT/CFA'], ['Actions rapides', '1 clic'], ['Activité', 'Récente']]} />
          </div>
          <InlinePreview height={430}><DashboardHome user={DEMO} onNavigate={() => {}} /></InlinePreview>
        </div>
      </div>

      {/* ── NETWORKS ── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}` }}>
        <div className="biz-outer-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.035em', fontFamily: FONT }}>Cinq réseaux, un seul Terex</h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>Choisissez le réseau qui correspond à vos besoins et à vos frais</p>
          </div>
          <div className="biz-networks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: `1px solid ${C.bds}`, borderRadius: 16, overflow: 'hidden' }}>
            {NETWORKS.map((n, i) => (
              <div key={n.name} style={{ padding: '34px 24px', textAlign: 'center', borderRight: i < NETWORKS.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em', marginBottom: 8 }}>{n.name}</div>
                <div style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>{n.chain}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ borderBottom: `1px solid ${C.bds}` }}>
        <div className="biz-outer-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 48px' }}>
          <div className="biz-faq-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 80 }}>
            <div className="biz-faq-head" style={{ flex: '0 0 280px' }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: C.t1, margin: '0 0 14px', letterSpacing: '-0.035em', fontFamily: FONT }}>Questions<br />fréquentes</h2>
              <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0, fontFamily: FONT }}>Tout ce que vous devez savoir avant de commencer</p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA BAND ── */}
      <div style={{ borderBottom: `1px solid ${C.bds}` }}>
        <div className="biz-outer-pad" style={{ maxWidth: 1160, margin: '0 auto', padding: '88px 48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: FONT }}>Prêt à commencer ?</h2>
          <p style={{ fontSize: 16, color: C.t2, margin: '0 auto 32px', maxWidth: 460, lineHeight: 1.6, fontFamily: FONT }}>Créez votre compte en quelques minutes et achetez vos premiers USDT au meilleur taux CFA.</p>
          <div className="biz-hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <PrimaryBtn large onClick={goPrimary}>
              {user ? 'Mon tableau de bord' : 'Créer un compte'} <ArrowRight style={{ width: 15, height: 15 }} />
            </PrimaryBtn>
            <OutlineBtn large onClick={goAuth}>Se connecter</OutlineBtn>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <FooterSection />
    </div>
  );
}
