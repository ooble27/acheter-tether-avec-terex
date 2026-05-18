import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Layers, Zap, Globe, BarChart2, Shield, Code2,
  ChevronDown, ChevronUp, Copy, Check,
  ShoppingBag, Factory, Briefcase, Store, Truck, Cpu,
} from 'lucide-react';
import { BusinessTreasury } from '@/components/business/BusinessTreasury';
import { BusinessPayments } from '@/components/business/BusinessPayments';
import { BusinessSuppliers } from '@/components/business/BusinessSuppliers';
import { BusinessAnalytics } from '@/components/business/BusinessAnalytics';

const C = {
  bg: '#111111', l1: '#181818', l2: '#202020', l3: '#272727',
  bds: '#222222', bd: '#333333',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const DEMO_USER = { email: 'demo@terex.sn', name: 'Terex Business', id: 'demo' };

const GRID_BG = {
  background: C.bg,
  backgroundImage: [
    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
  ].join(','),
  backgroundSize: '44px 44px',
};

// ── Preview card ─────────────────────────────────────────────────────
// Centrage : le contenu interne est enveloppé dans un maxWidth 860px
// centré dans INNER_W, ce qui donne des marges et reproduit
// le look "formulaire centré" qu'on voit dans Paiements.
const SCALE   = 0.42;
const FRAME_W = 460;
const INNER_W = Math.round(FRAME_W / SCALE); // ~1095px

function PreviewCard({ children, height = 400 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{
      width: FRAME_W, height, flexShrink: 0,
      borderRadius: 16, border: `1px solid ${C.bds}`,
      background: C.bg, overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>
      <div style={{ overflow: 'hidden', height }}>
        <div style={{
          transform: `scale(${SCALE})`, transformOrigin: 'top left',
          width: INNER_W, pointerEvents: 'none', userSelect: 'none',
        }}>
          {/* wrapper centré ← c'est lui qui centre le contenu dans le frame */}
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '14px 8px' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Boutons (rounded-xl = 12px comme landing principale) ─────────────
function PrimaryBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      height: large ? 48 : 40, paddingLeft: large ? 26 : 20, paddingRight: large ? 26 : 20,
      background: hov ? C.tealH : C.teal, border: 'none', borderRadius: 12,
      color: '#000', fontSize: large ? 14 : 13, fontWeight: 600,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONT, transition: 'background 0.15s', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}
function OutlineBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      height: large ? 48 : 40, paddingLeft: large ? 24 : 18, paddingRight: large ? 24 : 18,
      background: hov ? 'rgba(255,255,255,0.05)' : 'transparent',
      border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 12,
      color: hov ? C.t1 : C.t2, fontSize: large ? 14 : 13, fontWeight: 500,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Layers,    title: 'Trésorerie multi-réseaux',    desc: 'Solde consolidé sur TRC-20, BEP-20 et ERC-20 avec verrouillage de taux en temps réel.' },
  { icon: Zap,       title: 'Paiements en quelques clics', desc: 'Sélectionnez le fournisseur, confirmez le montant. Le paiement part directement sur la blockchain.' },
  { icon: Code2,     title: 'API & Webhooks',              desc: 'Intégrez Terex Business dans votre ERP. Clé API en un clic, webhooks HMAC-SHA256.' },
  { icon: Globe,     title: 'Réseau de fournisseurs',      desc: 'Enregistrez vos contacts avec leur adresse wallet et réseau blockchain.' },
  { icon: BarChart2, title: 'Analytiques temps réel',      desc: 'Volumes, tendances et répartition par réseau. Tableaux de bord mis à jour automatiquement.' },
  { icon: Shield,    title: 'Conformité KYC / AML',        desc: 'Quatre niveaux de vérification. Cadre UEMOA / BCEAO. Déclarations CENTIF.' },
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
    <div style={{ display: 'flex', gap: 32, paddingTop: 24, borderTop: `1px solid ${C.bds}` }}>
      {items.map(([val, label]) => (
        <div key={val}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em' }}>{val}</div>
          <div style={{ fontSize: 12, color: C.t3, fontFamily: FONT, marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Use Cases data ───────────────────────────────────────────────────
const USE_CASE_TABS = ['Importateurs', 'Distributeurs', 'Services', 'E-commerce'] as const;
type UseCaseTab = typeof USE_CASE_TABS[number];

const USE_CASES: Record<UseCaseTab, { icon: React.ElementType; title: string; desc: string }[]> = {
  Importateurs: [
    { icon: ShoppingBag, title: 'Textile & Mode',           desc: 'Gérez vos achats de produits finis en Asie et au Moyen-Orient sans intermédiaire bancaire.' },
    { icon: Cpu,         title: 'Électronique',             desc: 'Payez vos fournisseurs de composants et produits tech dans les délais contractuels.' },
    { icon: Factory,     title: 'Agroalimentaire',          desc: 'Règlement des cargaisons importées avec confirmation blockchain sous 10 minutes.' },
    { icon: Truck,       title: 'Matériaux de construction',desc: 'Paiements sécurisés pour vos fournisseurs de matériaux sur tout le réseau UEMOA.' },
    { icon: Briefcase,   title: 'Équipements industriels',  desc: 'Financement et règlement de vos achats d\'équipements lourds et pièces détachées.' },
    { icon: Store,       title: 'Cosmétiques & Beauté',     desc: 'Approvisionnement USDT rapide pour vos produits de beauté et soins importés.' },
  ],
  Distributeurs: [
    { icon: Truck,       title: 'Grossiste alimentaire',    desc: 'Réglez vos fournisseurs internationaux et maintenez vos stocks sans rupture.' },
    { icon: ShoppingBag, title: 'Distribution textile',     desc: 'Paiements USDT multi-fournisseurs pour alimenter votre réseau de revendeurs.' },
    { icon: Cpu,         title: 'High-tech & Téléphonie',   desc: 'Gérez vos achats en volume avec des taux négociés et des frais optimisés.' },
    { icon: Factory,     title: 'Matériaux & Quincaillerie',desc: 'Consolidez vos paiements fournisseurs sur un seul tableau de bord.' },
    { icon: Store,       title: 'Pharmacie & Santé',        desc: 'Transactions sécurisées pour vos achats de médicaments et dispositifs médicaux.' },
    { icon: Briefcase,   title: 'Automobile & Pièces',      desc: 'Règlement rapide pour vos importations de pièces et véhicules neufs.' },
  ],
  Services: [
    { icon: Briefcase,   title: 'Cabinets de conseil',      desc: 'Facturez et encaissez vos honoraires en USDT depuis n\'importe quelle zone.' },
    { icon: Code2,       title: 'Agences digitales',        desc: 'Recevez vos paiements clients internationaux sans passer par des banques correspondantes.' },
    { icon: Shield,      title: 'Services juridiques',      desc: 'Transactions traçables et conformes pour vos honoraires et provisions.' },
    { icon: Globe,       title: 'Logistique & Fret',        desc: 'Réglez vos partenaires et sous-traitants de transport en USDT en temps réel.' },
    { icon: Factory,     title: 'BTP & Ingénierie',         desc: 'Paiements sécurisés pour vos sous-traitants et fournisseurs de chantier.' },
    { icon: BarChart2,   title: 'Finance & Comptabilité',   desc: 'Gestion des flux USDT avec export comptable pour vos clients entreprises.' },
  ],
  'E-commerce': [
    { icon: Store,       title: 'Marketplace B2B',          desc: 'Automatisez vos paiements fournisseurs via l\'API Terex intégrée à votre plateforme.' },
    { icon: ShoppingBag, title: 'Dropshipping',             desc: 'Réglez vos fournisseurs asiatiques dès la commande confirmée, sans délai bancaire.' },
    { icon: Truck,       title: 'Fulfillment & Logistique', desc: 'Paiements automatiques déclenchés à l\'expédition via webhooks en temps réel.' },
    { icon: Cpu,         title: 'Boutique en ligne',        desc: 'Intégrez Terex à votre stack e-commerce et automatisez le cycle d\'achat.' },
    { icon: Globe,       title: 'Abonnements & SaaS',       desc: 'Gérez la facturation récurrente de vos clients entreprises via l\'API Terex.' },
    { icon: Code2,       title: 'Intégrateurs ERP',         desc: 'Connectez votre ERP via notre API REST et gérez tout depuis un seul système.' },
  ],
};

// ── Code section data ────────────────────────────────────────────────
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

// ── FAQ data ─────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'Quelle est la différence entre Terex et Terex Business ?', a: "Terex standard est destiné aux particuliers souhaitant acheter ou vendre des USDT. Terex Business s'adresse aux entreprises : il ajoute la gestion de fournisseurs, les paiements récurrents, l'API webhook, les analytiques avancées et un onboarding KYC adapté aux entités légales (RCCM, NINEA)." },
  { q: 'Comment fonctionne le verrouillage de taux 15 minutes ?', a: 'Lorsque vous initiez un paiement, le taux de change USDT/XOF est figé pendant 15 minutes. Si vous confirmez dans ce délai, le montant débité correspond exactement au taux affiché. Passé ce délai, un nouveau taux est proposé.' },
  { q: 'Quels documents KYC sont requis pour le compte Business ?', a: 'Pour le niveau 2 (jusqu\'à 50 000 USDT/mois) : RCCM, NINEA, pièce d\'identité du dirigeant, justificatif de siège social. Pour les niveaux 3 et 4, des documents complémentaires (statuts notariés, états financiers) sont nécessaires. Le délai de traitement est de 24 à 48h ouvrées.' },
  { q: 'Comment intégrer Terex Business dans mon logiciel de comptabilité ?', a: "Terex Business propose une API REST avec export CSV/PDF depuis le tableau de bord Historique. L'API webhook permet de déclencher des événements dans votre ERP à chaque transaction complétée. Des connecteurs pour les principaux ERP africains sont en cours de développement." },
  { q: 'Quel est le délai de traitement des paiements ?', a: 'Les paiements sont confirmés sur la blockchain en moins de 10 minutes pour TRC-20 et BEP-20. La confirmation interne (crédit au destinataire) intervient après 15 à 30 confirmations blockchain selon le réseau. Les clients Business+ bénéficient d\'un traitement prioritaire.' },
  { q: 'Puis-je avoir plusieurs utilisateurs sur un même compte Business ?', a: "Oui, la fonctionnalité Équipe & Accès permet d'inviter des membres avec des rôles distincts (Admin, Opérateur, Comptable, Viewer). Chaque rôle a des permissions différentes sur les paiements, la trésorerie et les exports." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.bds}` }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 0', textAlign: 'left', fontFamily: FONT }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: open ? C.t1 : C.t2, transition: 'color 0.15s', lineHeight: 1.4 }}>{q}</span>
        {open
          ? <ChevronUp  style={{ width: 16, height: 16, color: C.t3, flexShrink: 0 }} />
          : <ChevronDown style={{ width: 16, height: 16, color: C.t3, flexShrink: 0 }} />}
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
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1 }}>

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(17,17,17,0.94)', backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.bds}`,
        padding: '0 48px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} />
            <span style={{ color: C.t1, fontSize: 15, fontWeight: 700 }}>Terex</span>
          </button>
          <div style={{ width: 1, height: 14, background: C.bds, margin: '0 4px' }} />
          <span style={{ color: C.t3, fontSize: 13 }}>Business</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <OutlineBtn onClick={() => navigate('/auth')}>Se connecter</OutlineBtn>
          <PrimaryBtn onClick={() => navigate('/auth')}>Commencer <ArrowRight style={{ width: 14, height: 14 }} /></PrimaryBtn>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ ...GRID_BG, padding: '108px 48px 120px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 58, fontWeight: 900, color: C.t1, margin: '0 0 22px', letterSpacing: '-0.045em', lineHeight: 1.04, fontFamily: FONT }}>
            Gérez vos paiements<br />USDT fournisseurs<br />à l'international
          </h1>
          <p style={{ fontSize: 17, color: C.t2, lineHeight: 1.75, margin: '0 0 44px', fontFamily: FONT }}>
            Trésorerie multi-réseaux, paiements sécurisés et API webhook<br />conçus pour les entreprises de la zone UEMOA.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <PrimaryBtn large onClick={() => navigate('/auth')}>
              Créer un compte <ArrowRight style={{ width: 15, height: 15 }} />
            </PrimaryBtn>
            <OutlineBtn large onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Voir les fonctionnalités
            </OutlineBtn>
          </div>
        </div>
      </div>

      {/* ── FEATURES 3-COL ───────────────────────────────────────── */}
      <div id="features" style={{ borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '72px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.t1, margin: '0 0 10px', letterSpacing: '-0.03em', fontFamily: FONT }}>
              Tout ce dont votre entreprise a besoin
            </h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>Un tableau de bord complet pour gérer vos flux USDT</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{
                  padding: '32px 34px',
                  borderRight: (i + 1) % 3 !== 0 ? `1px solid ${C.bds}` : 'none',
                  borderBottom: i < 3 ? `1px solid ${C.bds}` : 'none',
                }}>
                  <Icon style={{ width: 20, height: 20, color: C.t3, marginBottom: 18 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.t1, margin: '0 0 8px', fontFamily: FONT, letterSpacing: '-0.012em' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.65, margin: 0, fontFamily: FONT }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ALTERNATING SECTIONS ─────────────────────────────────── */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 48px' }}>

        {/* Trésorerie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 72, padding: '72px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Trésorerie" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>
              Votre solde USDT<br />en temps réel
            </h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>
              Visualisez votre solde consolidé sur TRC-20, BEP-20 et ERC-20. Verrouillez votre taux pendant 15 minutes et planifiez vos virements.
            </p>
            <SectionStats items={[['3 réseaux', 'TRC-20, BEP-20, ERC-20'], ['15 min', 'Verrouillage de taux'], ['Temps réel', 'Mise à jour']]} />
          </div>
          <PreviewCard height={400}><BusinessTreasury user={DEMO_USER} /></PreviewCard>
        </div>

        {/* Paiements */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 72, padding: '72px 0', borderBottom: `1px solid ${C.bds}`, flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Paiements" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>
              Payez vos fournisseurs<br />en quelques clics
            </h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>
              Saisissez le montant, sélectionnez votre fournisseur et confirmez. Les paiements supérieurs à 5 000 USDT déclenchent une validation renforcée.
            </p>
            <SectionStats items={[['100 USDT', 'Montant minimum'], ['1,5 %', 'Frais jusqu\'à 10K'], ['< 10 min', 'Confirmation blockchain']]} />
          </div>
          <PreviewCard height={420}><BusinessPayments user={DEMO_USER} onBack={() => {}} /></PreviewCard>
        </div>

        {/* Fournisseurs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 72, padding: '72px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Fournisseurs" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>
              Gérez votre réseau<br />de fournisseurs
            </h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>
              Enregistrez vos fournisseurs avec leur adresse wallet et réseau blockchain. Tous vos contacts sont disponibles immédiatement au paiement.
            </p>
            <SectionStats items={[['Illimité', 'Fournisseurs enregistrables'], ['TRC-20', 'Réseau recommandé'], ['CSV', 'Import & export']]} />
          </div>
          <PreviewCard height={420}><BusinessSuppliers user={DEMO_USER} /></PreviewCard>
        </div>

        {/* Analytiques */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 72, padding: '72px 0', flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Analytiques" />
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>
              Pilotez votre activité<br />avec des données précises
            </h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.8, margin: '0 0 28px', fontFamily: FONT }}>
              Suivez vos volumes, tendances et la répartition de vos paiements par réseau. Les indicateurs s'actualisent en temps réel.
            </p>
            <SectionStats items={[['Temps réel', 'Données actualisées'], ['3 réseaux', 'Répartition détaillée'], ['12 mois', 'Historique glissant']]} />
          </div>
          <PreviewCard height={420}><BusinessAnalytics user={DEMO_USER} /></PreviewCard>
        </div>
      </div>

      {/* ── USE CASES ────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.035em', fontFamily: FONT }}>
              Une solution, des cas d'usage illimités
            </h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>Quel que soit votre secteur, Terex Business s'adapte à vos flux de paiement</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: 4, width: 'fit-content', margin: '0 auto 36px' }}>
            {USE_CASE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: activeTab === tab ? C.l3 : 'transparent',
                color: activeTab === tab ? C.t1 : C.t3,
                fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                fontFamily: FONT, transition: 'all 0.15s',
                borderBottom: activeTab === tab ? `2px solid ${C.teal}` : '2px solid transparent',
              }}>{tab}</button>
            ))}
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {USE_CASES[activeTab].map((item, i) => {
              const Icon = item.icon;
              const isRight = (i + 1) % 3 === 0;
              const isBottom = i >= 3;
              return (
                <div key={i} style={{
                  padding: '28px 30px',
                  borderRight: !isRight ? `1px solid ${C.bds}` : 'none',
                  borderBottom: !isBottom ? `1px solid ${C.bds}` : 'none',
                  transition: 'background 0.15s',
                }}>
                  <Icon style={{ width: 22, height: 22, color: C.t3, marginBottom: 16 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.t1, margin: '0 0 10px', fontFamily: FONT }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.65, margin: 0, fontFamily: FONT }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── API CODE SECTION ─────────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '88px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.035em', fontFamily: FONT }}>
            Intégrez en moins de 10 lignes de code
          </h2>
          <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>
            Copiez l'exemple et envoyez votre premier paiement en quelques minutes
          </p>
        </div>

        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* Language tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.bds}` }}>
            {(['curl', 'node', 'python'] as const).map(l => (
              <button key={l} onClick={() => setCodeLang(l)} style={{
                padding: '12px 24px', border: 'none', cursor: 'pointer',
                background: codeLang === l ? C.l2 : 'transparent',
                color: codeLang === l ? C.t1 : C.t3,
                fontSize: 13, fontWeight: codeLang === l ? 600 : 400,
                fontFamily: FONT, transition: 'all 0.15s',
                borderBottom: codeLang === l ? `2px solid ${C.teal}` : '2px solid transparent',
              }}>
                {l === 'curl' ? 'cURL' : l === 'node' ? 'Node.js' : 'Python'}
              </button>
            ))}
          </div>

          {/* Code block */}
          <pre style={{ margin: 0, padding: '24px 28px', fontFamily: MONO, fontSize: 13, lineHeight: 1.75, color: '#d1d5db', overflowX: 'auto', whiteSpace: 'pre' }}>
            {CODE_EXAMPLES[codeLang]}
          </pre>

          {/* Copy button */}
          <button onClick={copyCode} style={{
            width: '100%', padding: '14px', background: C.l2, border: 'none',
            borderTop: `1px solid ${C.bds}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: C.t2, fontSize: 13, fontFamily: FONT, transition: 'color 0.15s',
          }} onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
             onMouseLeave={e => (e.currentTarget.style.color = C.t2)}>
            {codeCopied
              ? <><Check style={{ width: 14, height: 14 }} /> Copié !</>
              : <><Copy style={{ width: 14, height: 14 }} /> Copier le code</>}
          </button>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.035em', fontFamily: FONT }}>
              Questions fréquentes
            </h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>Tout ce que vous devez savoir avant de commencer</p>
          </div>
          {FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div style={{ ...GRID_BG, borderTop: `1px solid ${C.bds}`, padding: '100px 48px' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.04em', fontFamily: FONT }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: 16, color: C.t2, lineHeight: 1.8, margin: '0 0 40px', fontFamily: FONT }}>
            Créez votre compte Business en quelques minutes et commencez à envoyer des paiements USDT dès validation de votre dossier KYC.
          </p>
          <PrimaryBtn large onClick={() => navigate('/auth')}>
            Créer un compte Business <ArrowRight style={{ width: 15, height: 15 }} />
          </PrimaryBtn>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
          <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>© 2025 Terex Exchange. Tous droits réservés.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Accueil', '/'], ['Termes', '/terms'], ['Confidentialité', '/privacy'], ['Support', '/support']].map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.t3, fontFamily: FONT, padding: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.t2)}
              onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
