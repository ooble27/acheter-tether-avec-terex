import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Layers, Zap, Globe, BarChart2, Shield, Code2,
  ChevronDown, ChevronUp, Copy, Check,
  ShoppingBag, Factory, Briefcase, Store, Truck, Cpu, Calendar, Users,
} from 'lucide-react';
import { BusinessTreasury } from '@/components/business/BusinessTreasury';
import { BusinessPayments } from '@/components/business/BusinessPayments';
import { BusinessHistory } from '@/components/business/BusinessHistory';
import { BusinessAnalytics } from '@/components/business/BusinessAnalytics';
import { BusinessBatch } from '@/components/business/BusinessBatch';
import { BusinessTeam } from '@/components/business/BusinessTeam';
import { BusinessOverview } from '@/components/business/BusinessOverview';

const C = {
  bg: '#111111', l1: '#181818', l2: '#202020', l3: '#272727',
  bds: '#222222', bd: '#333333',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const DEMO_USER = { email: 'demo@terex.sn', name: 'Terex Business', id: 'demo' };

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

  @media (max-width: 1100px) {
    .biz-vline { display: none !important; }
  }
  @media (max-width: 900px) {
    .biz-hero-preview { display: none !important; }
    .biz-section-row { flex-direction: column !important; gap: 32px !important; padding: 56px 24px !important; }
    .biz-section-row-rev { flex-direction: column !important; gap: 32px !important; padding: 56px 24px !important; }
    .biz-preview { width: 100% !important; max-width: 480px !important; align-self: center !important; }
    .biz-features { grid-template-columns: 1fr 1fr !important; }
    .biz-use-cases-grid { grid-template-columns: 1fr 1fr !important; }
    .biz-faq-row { flex-direction: column !important; gap: 32px !important; }
    .biz-api-row { flex-direction: column !important; gap: 32px !important; }
  }
  @media (max-width: 600px) {
    .biz-hero-title { font-size: 34px !important; letter-spacing: -0.04em !important; }
    .biz-hero-sub { font-size: 15px !important; }
    .biz-hero-btns { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .biz-hero-btns button { width: 100% !important; justify-content: center !important; }
    .biz-nav { padding: 0 16px !important; }
    .biz-nav-actions .biz-nav-link { display: none !important; }
    .biz-features { grid-template-columns: 1fr !important; }
    .biz-use-cases-grid { grid-template-columns: 1fr !important; }
    .biz-use-case-tabs { overflow-x: auto !important; flex-wrap: nowrap !important; }
    .biz-section-row, .biz-section-row-rev { padding: 40px 16px !important; }
    .biz-api-row { padding: 0 !important; }
    .biz-faq-row { padding: 0 !important; }
    .biz-preview { max-width: 100% !important; }
  }
`;

// ── Preview constants ─────────────────────────────────────────────────
const SCALE   = 0.58;
const FRAME_W = 640;
const INNER_W = Math.round(FRAME_W / SCALE);

// Héro — même largeur que le container 1160px (padding 48 inclus → 1064px utile)
const HERO_SCALE   = 0.65;
const HERO_VW      = 1064;
const HERO_VH      = 460;
const HERO_INNER_W = Math.round(HERO_VW / HERO_SCALE);
const HERO_INNER_H = Math.round(HERO_VH / HERO_SCALE);

// ── Rendu direct sans cadre ───────────────────────────────────────────
function InlinePreview({ children, height = 420 }: { children: React.ReactNode; height?: number }) {
  const innerH = Math.round(height / SCALE);
  return (
    <div className="biz-preview" style={{ position: 'relative', width: FRAME_W, height, flexShrink: 0 }}>
      <div className="biz-no-anim" style={{ width: FRAME_W, height, overflow: 'hidden' }}>
        <div style={{
          transform: `scale(${SCALE})`, transformOrigin: 'top left',
          width: INNER_W, height: innerH, overflow: 'hidden',
          pointerEvents: 'none', userSelect: 'none', willChange: 'transform',
        }}>
          <div style={{ padding: '12px 16px' }}>
            {children}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, background: `linear-gradient(transparent, ${C.bg})`, pointerEvents: 'none' }} />
    </div>
  );
}

// ── Boutons ───────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      height: large ? 50 : 40, paddingLeft: large ? 28 : 20, paddingRight: large ? 28 : 20,
      background: hov ? C.tealH : C.teal, border: 'none', borderRadius: 12,
      color: '#000', fontSize: large ? 15 : 13, fontWeight: 700,
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
  { icon: Layers,    title: 'Trésorerie multi-réseaux',    desc: 'Solde consolidé sur TRC-20, BEP-20 et ERC-20 avec verrouillage de taux en temps réel.' },
  { icon: Zap,       title: 'Paiements en quelques clics', desc: 'Sélectionnez le fournisseur, confirmez le montant. Le paiement part directement sur la blockchain.' },
  { icon: Calendar,  title: 'Planification & Batch',       desc: 'Programmez vos paiements récurrents et envoyez plusieurs virements en une seule action.' },
  { icon: Globe,     title: 'Réseau de fournisseurs',      desc: 'Enregistrez vos contacts avec leur adresse wallet et réseau blockchain préféré.' },
  { icon: BarChart2, title: 'Analytiques temps réel',      desc: 'Volumes, tendances et répartition par réseau. Tableaux de bord mis à jour automatiquement.' },
  { icon: Users,     title: 'Équipe & Accès',              desc: 'Invitez vos collaborateurs avec des rôles distincts : Admin, Financier, Comptable, Opérateur.' },
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
    <div style={{ display: 'flex', gap: 32, paddingTop: 24, borderTop: `1px solid ${C.bds}`, flexWrap: 'wrap' }}>
      {items.map(([val, label]) => (
        <div key={val}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em' }}>{val}</div>
          <div style={{ fontSize: 12, color: C.t3, fontFamily: FONT, marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

const USE_CASE_TABS = ['Importateurs', 'Distributeurs', 'Services', 'E-commerce'] as const;
type UseCaseTab = typeof USE_CASE_TABS[number];

const USE_CASES: Record<UseCaseTab, { icon: React.ElementType; title: string; desc: string }[]> = {
  Importateurs: [
    { icon: ShoppingBag, title: 'Textile & Mode',            desc: 'Gérez vos achats de produits finis en Asie et au Moyen-Orient sans intermédiaire bancaire.' },
    { icon: Cpu,         title: 'Électronique',              desc: 'Payez vos fournisseurs de composants et produits tech dans les délais contractuels.' },
    { icon: Factory,     title: 'Agroalimentaire',           desc: 'Règlement des cargaisons importées avec confirmation blockchain sous 10 minutes.' },
    { icon: Truck,       title: 'Matériaux de construction', desc: 'Paiements sécurisés pour vos fournisseurs de matériaux sur tout le réseau UEMOA.' },
    { icon: Briefcase,   title: 'Équipements industriels',   desc: "Financement et règlement de vos achats d'équipements lourds et pièces détachées." },
    { icon: Store,       title: 'Cosmétiques & Beauté',      desc: 'Approvisionnement USDT rapide pour vos produits de beauté et soins importés.' },
  ],
  Distributeurs: [
    { icon: Truck,       title: 'Grossiste alimentaire',     desc: 'Réglez vos fournisseurs internationaux et maintenez vos stocks sans rupture.' },
    { icon: ShoppingBag, title: 'Distribution textile',      desc: 'Paiements USDT multi-fournisseurs pour alimenter votre réseau de revendeurs.' },
    { icon: Cpu,         title: 'High-tech & Téléphonie',    desc: 'Gérez vos achats en volume avec des taux négociés et des frais optimisés.' },
    { icon: Factory,     title: 'Matériaux & Quincaillerie', desc: 'Consolidez vos paiements fournisseurs sur un seul tableau de bord.' },
    { icon: Store,       title: 'Pharmacie & Santé',         desc: 'Transactions sécurisées pour vos achats de médicaments et dispositifs médicaux.' },
    { icon: Briefcase,   title: 'Automobile & Pièces',       desc: "Règlement rapide pour vos importations de pièces et véhicules neufs." },
  ],
  Services: [
    { icon: Briefcase,   title: 'Cabinets de conseil',       desc: "Facturez et encaissez vos honoraires en USDT depuis n'importe quelle zone." },
    { icon: Code2,       title: 'Agences digitales',         desc: 'Recevez vos paiements clients internationaux sans passer par des banques correspondantes.' },
    { icon: Shield,      title: 'Services juridiques',       desc: 'Transactions traçables et conformes pour vos honoraires et provisions.' },
    { icon: Globe,       title: 'Logistique & Fret',         desc: 'Réglez vos partenaires et sous-traitants de transport en USDT en temps réel.' },
    { icon: Factory,     title: 'BTP & Ingénierie',          desc: 'Paiements sécurisés pour vos sous-traitants et fournisseurs de chantier.' },
    { icon: BarChart2,   title: 'Finance & Comptabilité',    desc: 'Gestion des flux USDT avec export comptable pour vos clients entreprises.' },
  ],
  'E-commerce': [
    { icon: Store,       title: 'Marketplace B2B',           desc: "Automatisez vos paiements fournisseurs via l'API Terex intégrée à votre plateforme." },
    { icon: ShoppingBag, title: 'Dropshipping',              desc: 'Réglez vos fournisseurs asiatiques dès la commande confirmée, sans délai bancaire.' },
    { icon: Truck,       title: 'Fulfillment & Logistique',  desc: "Paiements automatiques déclenchés à l'expédition via webhooks en temps réel." },
    { icon: Cpu,         title: 'Boutique en ligne',         desc: "Intégrez Terex à votre stack e-commerce et automatisez le cycle d'achat." },
    { icon: Globe,       title: 'Abonnements & SaaS',        desc: "Gérez la facturation récurrente de vos clients entreprises via l'API Terex." },
    { icon: Code2,       title: 'Intégrateurs ERP',          desc: 'Connectez votre ERP via notre API REST et gérez tout depuis un seul système.' },
  ],
};

const CODE_EXAMPLES = {
  curl: `curl -X POST https://api.terex.sn/v1/payments \\
  -H "Authorization: Bearer txb_live_xK9mP2..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1500,
    "currency": "USDT",
    "network": "TRC20",
    "supplier_id": "sup_a1b2c3",
    "reference": "CMD-2025-042"
  }'`,
  node: `import Terex from '@terex/business-sdk';

const client = new Terex('txb_live_xK9mP2...');

const payment = await client.payments.create({
  amount: 1500,
  currency: 'USDT',
  network: 'TRC20',
  supplier_id: 'sup_a1b2c3',
  reference: 'CMD-2025-042',
});

console.log(payment.id, payment.status);
// pay_a1b2c3d4e5  "processing"`,
  python: `import terex

client = terex.Client("txb_live_xK9mP2...")

payment = client.payments.create(
    amount=1500,
    currency="USDT",
    network="TRC20",
    supplier_id="sup_a1b2c3",
    reference="CMD-2025-042",
)

print(payment.id, payment.status)
# pay_a1b2c3d4e5  "processing"`,
};

const FAQ_ITEMS = [
  { q: 'Quelle est la différence entre Terex et Terex Business ?', a: "Terex standard est destiné aux particuliers souhaitant acheter ou vendre des USDT. Terex Business s'adresse aux entreprises : il ajoute la gestion de fournisseurs, les paiements récurrents, l'API webhook, les analytiques avancées et un onboarding KYC adapté aux entités légales (RCCM, NINEA)." },
  { q: 'Comment fonctionne le verrouillage de taux 15 minutes ?', a: 'Lorsque vous initiez un paiement, le taux de change USDT/XOF est figé pendant 15 minutes. Si vous confirmez dans ce délai, le montant débité correspond exactement au taux affiché. Passé ce délai, un nouveau taux est proposé.' },
  { q: 'Quels documents KYC sont requis pour le compte Business ?', a: "Pour le niveau 2 (jusqu'à 50 000 USDT/mois) : RCCM, NINEA, pièce d'identité du dirigeant, justificatif de siège social. Pour les niveaux 3 et 4, des documents complémentaires sont nécessaires. Le délai de traitement est de 24 à 48h ouvrées." },
  { q: 'Comment intégrer Terex Business dans mon logiciel de comptabilité ?', a: "API REST avec export CSV/PDF depuis le tableau de bord Historique. L'API webhook permet de déclencher des événements dans votre ERP à chaque transaction complétée." },
  { q: 'Quel est le délai de traitement des paiements ?', a: 'Les paiements sont confirmés sur la blockchain en moins de 10 minutes pour TRC-20 et BEP-20. Les clients Business+ bénéficient d\'un traitement prioritaire.' },
  { q: 'Puis-je avoir plusieurs utilisateurs sur un même compte Business ?', a: "Oui, la fonctionnalité Équipe & Accès permet d'inviter des membres avec des rôles distincts (Admin, Opérateur, Comptable, Viewer). Chaque rôle a des permissions différentes." },
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
export function BusinessLanding() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<UseCaseTab>('Importateurs');
  const [codeLang, setCodeLang] = useState<'curl' | 'node' | 'python'>('curl');
  const [codeCopied, setCodeCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[codeLang]).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1, position: 'relative' }}>
      <style>{GLOBAL_CSS}</style>


      {/* ── VERTICAL LINES ───────────────────────────────────────── */}
      <div className="biz-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 580px)', width: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="biz-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 580px)', width: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav className="biz-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(17,17,17,0.94)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.bds}`, padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} />
            <span style={{ color: C.t1, fontSize: 15, fontWeight: 700 }}>Terex</span>
          </button>
          <div style={{ width: 1, height: 14, background: C.bds, margin: '0 4px' }} />
          <span style={{ color: C.t3, fontSize: 13 }}>Business</span>
        </div>
        <div className="biz-nav-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="biz-nav-link"><OutlineBtn onClick={() => navigate('/auth')}>Se connecter</OutlineBtn></span>
          <PrimaryBtn onClick={() => navigate('/auth')}>Commencer <ArrowRight style={{ width: 14, height: 14 }} /></PrimaryBtn>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ background: C.bg, paddingTop: 96, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* Titre centré */}
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 48px', textAlign: 'center', marginBottom: 52 }}>
          <h1 className="biz-hero-title" style={{ fontSize: 64, fontWeight: 900, color: C.t1, margin: '0 0 20px', letterSpacing: '-0.05em', lineHeight: 1.04, fontFamily: FONT }}>
            La finance de votre entreprise,<br />enfin sous contrôle
          </h1>
          <p className="biz-hero-sub" style={{ fontSize: 18, color: C.t2, margin: '0 auto 40px', maxWidth: 500, lineHeight: 1.65, fontFamily: FONT }}>
            Paiements USDT, trésorerie multi-réseaux et API webhook<br />pour les entreprises de la zone UEMOA.
          </p>
          <div className="biz-hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <PrimaryBtn large onClick={() => navigate('/auth')}>
              Créer un compte Business <ArrowRight style={{ width: 15, height: 15 }} />
            </PrimaryBtn>
            <OutlineBtn large onClick={() => navigate('/auth')}>Se connecter</OutlineBtn>
          </div>
        </div>

        {/* Dashboard BusinessOverview — 3D ancrée dans la ligne du dessous */}
        <div className="biz-hero-preview" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 48px', position: 'relative' }}>

          {/* Perspective 3D forte — l'élément se prolonge vers le bas sans arrondi */}
          <div style={{ perspective: '900px', perspectiveOrigin: '50% 20%' }}>
            <div style={{
              transform: 'rotateX(20deg) scale(0.97)',
              transformOrigin: 'center top',
              borderRadius: '16px 16px 0 0',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.10)',
              borderBottom: 'none',
              boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
            }}>
              <div className="biz-no-anim" style={{ width: HERO_VW, height: HERO_VH, overflow: 'hidden', background: '#1a1a1a' }}>
                <div style={{ transform: `scale(${HERO_SCALE})`, transformOrigin: 'top left', width: HERO_INNER_W, height: HERO_INNER_H, overflow: 'hidden', pointerEvents: 'none', userSelect: 'none', willChange: 'transform' }}>
                  <div style={{ padding: '20px 28px' }}>
                    <BusinessOverview user={DEMO_USER} onNavigate={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fondu bas — liseré discret pour ancrer dans la section Features */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(transparent, ${C.bg})`, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ── FEATURES 3-COL ───────────────────────────────────────── */}
      <div id="features" style={{ borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '72px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.t1, margin: '0 0 10px', letterSpacing: '-0.03em', fontFamily: FONT }}>Tout ce dont votre entreprise a besoin</h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>Un tableau de bord complet pour gérer vos flux USDT</p>
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

      {/* ── SECTIONS ALTERNÉES ───────────────────────────────────── */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 48px' }}>

        <div className="biz-section-row" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Trésorerie" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Votre solde USDT<br />en temps réel</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Visualisez votre solde consolidé sur TRC-20, BEP-20 et ERC-20. Verrouillez votre taux pendant 15 minutes et planifiez vos virements.</p>
            <SectionStats items={[['3 réseaux', 'TRC-20, BEP-20, ERC-20'], ['15 min', 'Verrouillage de taux'], ['Temps réel', 'Mise à jour']]} />
          </div>
          <InlinePreview height={430}><BusinessTreasury user={DEMO_USER} /></InlinePreview>
        </div>

        <div className="biz-section-row-rev" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}`, flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Paiements" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Payez vos fournisseurs<br />en quelques clics</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Saisissez le montant, sélectionnez votre fournisseur et confirmez. Les paiements supérieurs à 5 000 USDT déclenchent une validation renforcée.</p>
            <SectionStats items={[['100 USDT', 'Montant minimum'], ['1,5 %', "Frais jusqu'à 10K"], ['< 10 min', 'Confirmation blockchain']]} />
          </div>
          <InlinePreview height={430}><BusinessPayments user={DEMO_USER} onBack={() => {}} /></InlinePreview>
        </div>

        <div className="biz-section-row" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Historique" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Toutes vos transactions<br />au même endroit</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Consultez l'intégralité de vos paiements avec filtres avancés, export CSV et accès aux justificatifs. Chaque transaction est traçable et auditable.</p>
            <SectionStats items={[['Export CSV', 'Données complètes'], ['Filtres avancés', 'Recherche rapide'], ['Traçabilité', 'Blockchain']]} />
          </div>
          <InlinePreview height={430}><BusinessHistory user={DEMO_USER} /></InlinePreview>
        </div>

        <div className="biz-section-row-rev" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}`, flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Analytiques" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Pilotez votre activité<br />avec des données précises</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Suivez vos volumes, tendances et la répartition de vos paiements par réseau. Les indicateurs s'actualisent en temps réel.</p>
            <SectionStats items={[['Temps réel', 'Données actualisées'], ['3 réseaux', 'Répartition détaillée'], ['12 mois', 'Historique glissant']]} />
          </div>
          <InlinePreview height={430}><BusinessAnalytics user={DEMO_USER} /></InlinePreview>
        </div>

        <div className="biz-section-row" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Planification" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Automatisez vos<br />paiements récurrents</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Programmez des virements quotidiens, hebdomadaires ou mensuels. Envoyez plusieurs paiements en une seule opération avec les paiements en lot.</p>
            <SectionStats items={[['Lot', 'Paiements groupés'], ['5 fréquences', 'Récurrence flexible'], ['Calendrier', 'Vue planning']]} />
          </div>
          <InlinePreview height={430}><BusinessBatch user={DEMO_USER} /></InlinePreview>
        </div>

        <div className="biz-section-row-rev" style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '88px 0', flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Équipe & Accès" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Gérez les accès<br />de votre équipe</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>Invitez vos collaborateurs avec des rôles précis. Administrateur, Financier, Comptable ou Opérateur — chacun voit uniquement ce dont il a besoin.</p>
            <SectionStats items={[['5 rôles', 'Permissions granulaires'], ['Illimité', 'Membres invitables'], ['Activité', 'Journal des actions']]} />
          </div>
          <InlinePreview height={430}><BusinessTeam user={DEMO_USER} /></InlinePreview>
        </div>
      </div>

      {/* ── USE CASES ────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.035em', fontFamily: FONT }}>Une solution, des cas d'usage illimités</h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>Quel que soit votre secteur, Terex Business s'adapte à vos flux de paiement</p>
          </div>
          <div className="biz-use-case-tabs" style={{ display: 'flex', gap: 4, marginBottom: 36, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 4, width: 'fit-content', margin: '0 auto 36px' }}>
            {USE_CASE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', background: activeTab === tab ? C.l3 : 'transparent', color: activeTab === tab ? C.t1 : C.t3, fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>{tab}</button>
            ))}
          </div>
          <div className="biz-use-cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {USE_CASES[activeTab].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ padding: '28px 30px', borderRight: (i + 1) % 3 !== 0 ? `1px solid ${C.bds}` : 'none', borderBottom: i < 3 ? `1px solid ${C.bds}` : 'none' }}>
                  <Icon style={{ width: 22, height: 22, color: C.t3, marginBottom: 16 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.t1, margin: '0 0 10px', fontFamily: FONT }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.65, margin: 0, fontFamily: FONT }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── API CODE ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '88px 48px' }}>
        <div className="biz-api-row" style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="API" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>Intégrez en moins<br />de 10 lignes de code</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>API REST complète avec documentation, webhooks HMAC-SHA256 et SDKs pour Node.js et Python. Connectez votre ERP en quelques heures.</p>
            <SectionStats items={[['REST', 'API standard'], ['HMAC-256', 'Sécurité webhooks'], ['< 1 h', "Temps d'intégration"]]} />
          </div>
          <div style={{ flex: '1 1 0', minWidth: 0, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.bds}` }}>
              {(['curl', 'node', 'python'] as const).map(l => (
                <button key={l} onClick={() => setCodeLang(l)} style={{ padding: '12px 22px', border: 'none', cursor: 'pointer', background: codeLang === l ? C.l2 : 'transparent', color: codeLang === l ? C.t1 : C.t3, fontSize: 13, fontWeight: codeLang === l ? 600 : 400, fontFamily: FONT, transition: 'all 0.15s', borderBottom: codeLang === l ? `2px solid ${C.teal}` : '2px solid transparent' }}>
                  {l === 'curl' ? 'cURL' : l === 'node' ? 'Node.js' : 'Python'}
                </button>
              ))}
            </div>
            <pre style={{ margin: 0, padding: '22px 26px', fontFamily: MONO, fontSize: 12.5, lineHeight: 1.75, color: '#d1d5db', overflowX: 'auto', whiteSpace: 'pre' }}>{CODE_EXAMPLES[codeLang]}</pre>
            <button onClick={copyCode} style={{ width: '100%', padding: '13px', background: C.l2, border: 'none', borderTop: `1px solid ${C.bds}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.t2, fontSize: 13, fontFamily: FONT, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.t1)} onMouseLeave={e => (e.currentTarget.style.color = C.t2)}>
              {codeCopied ? <><Check style={{ width: 14, height: 14 }} /> Copié !</> : <><Copy style={{ width: 14, height: 14 }} /> Copier le code</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 48px' }}>
          <div className="biz-faq-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 80 }}>
            <div style={{ flex: '0 0 280px' }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: C.t1, margin: '0 0 14px', letterSpacing: '-0.035em', fontFamily: FONT }}>Questions<br />fréquentes</h2>
              <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0, fontFamily: FONT }}>Tout ce que vous devez savoir avant de commencer</p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
          <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>© 2026 Terex Exchange. Tous droits réservés.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Accueil', '/'], ['Termes', '/terms'], ['Confidentialité', '/privacy'], ['Support', '/support']].map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.t3, fontFamily: FONT, padding: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.t2)} onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
