import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Zap, Globe, BarChart2, Shield, Code2 } from 'lucide-react';
import { BusinessTreasury } from '@/components/business/BusinessTreasury';
import { BusinessPayments } from '@/components/business/BusinessPayments';
import { BusinessSuppliers } from '@/components/business/BusinessSuppliers';
import { BusinessAnalytics } from '@/components/business/BusinessAnalytics';

const C = {
  bg: '#111111', l1: '#181818', l2: '#202020',
  bds: '#222222', bd: '#333333',
  teal: '#3B968F', tealH: '#2d7870',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const DEMO_USER = { email: 'demo@terex.sn', name: 'Terex Business', id: 'demo' };

// Square grid — same as ApiFlow
const GRID_BG_STYLE = {
  background: C.bg,
  backgroundImage: [
    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
  ].join(','),
  backgroundSize: '44px 44px',
};

// Preview frame dimensions
const SCALE = 0.42;
const FRAME_W = 460;
const INNER_W = Math.round(FRAME_W / SCALE);

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
          padding: 16,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Boutons identiques au style de la landing principale (rounded-xl = 12px)
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

export function BusinessLanding() {
  const navigate = useNavigate();

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
      <div style={{ ...GRID_BG_STYLE, padding: '108px 48px 120px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 58, fontWeight: 900, color: C.t1, margin: '0 0 22px', letterSpacing: '-0.045em', lineHeight: 1.04, fontFamily: FONT }}>
            Gérez vos paiements<br />
            USDT fournisseurs<br />à l'international
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
            <SectionStats items={[['3 réseaux', 'TRC-20, BEP-20, ERC-20'], ['15 min', 'Verrouillage de taux'], ['Temps réel', 'Mise à jour du solde']]} />
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
              Suivez vos volumes, tendances et la répartition de vos paiements par réseau. Les indicateurs s'actualisent en temps réel depuis votre historique.
            </p>
            <SectionStats items={[['Temps réel', 'Données actualisées'], ['3 réseaux', 'Répartition détaillée'], ['12 mois', 'Historique glissant']]} />
          </div>
          <PreviewCard height={420}><BusinessAnalytics user={DEMO_USER} /></PreviewCard>
        </div>

      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div style={{ ...GRID_BG_STYLE, borderTop: `1px solid ${C.bds}`, padding: '100px 48px' }}>
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
