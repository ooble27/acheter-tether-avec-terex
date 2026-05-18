import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Layers, Zap, Globe, BarChart2, Shield, Code2 } from 'lucide-react';
import { BusinessTreasury } from '@/components/business/BusinessTreasury';
import { BusinessPayments } from '@/components/business/BusinessPayments';
import { BusinessSuppliers } from '@/components/business/BusinessSuppliers';
import { BusinessAnalytics } from '@/components/business/BusinessAnalytics';

const C = {
  bg: '#111111', l1: '#181818', l2: '#1f1f1f', l3: '#272727',
  bds: '#222222', bd: '#333333',
  teal: '#3B968F', tealH: '#2d7870',
  tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const DEMO_USER = { email: 'demo@terex.sn', name: 'Terex Business', id: 'demo' };

const HATCH = [
  'repeating-linear-gradient(45deg, transparent 0, transparent 28px, rgba(255,255,255,0.022) 28px, rgba(255,255,255,0.022) 29px)',
  'repeating-linear-gradient(-45deg, transparent 0, transparent 28px, rgba(255,255,255,0.022) 28px, rgba(255,255,255,0.022) 29px)',
].join(',');

const CARD_HATCH = [
  'repeating-linear-gradient(45deg, transparent 0, transparent 20px, rgba(255,255,255,0.018) 20px, rgba(255,255,255,0.018) 21px)',
  'repeating-linear-gradient(-45deg, transparent 0, transparent 20px, rgba(255,255,255,0.018) 20px, rgba(255,255,255,0.018) 21px)',
].join(',');

const SCALE = 0.44;
const FRAME_W = 580;
const INNER_W = Math.round(FRAME_W / SCALE);

function PreviewCard({ children, height = 440 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{
      width: FRAME_W, height,
      borderRadius: 20, border: `1px solid ${C.bds}`,
      overflow: 'hidden', flexShrink: 0,
      background: C.l1, backgroundImage: CARD_HATCH,
      boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
    }}>
      <div style={{ overflow: 'hidden', height }}>
        <div style={{
          transform: `scale(${SCALE})`, transformOrigin: 'top left',
          width: INNER_W, pointerEvents: 'none', userSelect: 'none',
          padding: 20,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function TealBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      height: large ? 52 : 42, paddingLeft: large ? 30 : 22, paddingRight: large ? 30 : 22,
      background: hov ? C.tealH : C.teal, border: 'none', borderRadius: 100,
      color: '#fff', fontSize: large ? 15 : 13, fontWeight: 600,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONT, transition: 'background 0.15s', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      height: large ? 52 : 42, paddingLeft: large ? 28 : 20, paddingRight: large ? 28 : 20,
      background: 'transparent', border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 100,
      color: hov ? C.t1 : C.t2, fontSize: large ? 15 : 13, fontWeight: 500,
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
    <div style={{ display: 'inline-flex', background: C.l2, border: `1px solid ${C.bd}`, padding: '5px 14px', borderRadius: 100, marginBottom: 22 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: C.t2, fontFamily: FONT }}>{label}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 34, fontWeight: 800, color: C.t1, margin: '0 0 18px', letterSpacing: '-0.035em', lineHeight: 1.15, fontFamily: FONT }}>
      {children}
    </h2>
  );
}

function SectionStats({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: 'flex', gap: 36, paddingTop: 24, borderTop: `1px solid ${C.bds}` }}>
      {items.map(([val, label]) => (
        <div key={val}>
          <div style={{ fontSize: 19, fontWeight: 800, color: C.t1, fontFamily: MONO, letterSpacing: '-0.02em' }}>{val}</div>
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
        background: 'rgba(17,17,17,0.93)', backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.bds}`,
        padding: '0 48px', height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} />
            <span style={{ color: C.t1, fontSize: 15, fontWeight: 700 }}>Terex</span>
          </button>
          <div style={{ width: 1, height: 16, background: C.bds, margin: '0 4px' }} />
          <span style={{ color: C.t3, fontSize: 13 }}>Business</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostBtn onClick={() => navigate('/auth')}>Se connecter</GhostBtn>
          <TealBtn onClick={() => navigate('/auth')}>Commencer <ArrowRight style={{ width: 14, height: 14 }} /></TealBtn>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ background: C.bg, backgroundImage: HATCH, padding: '112px 48px 124px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.tealT, border: `1px solid ${C.tealB}`,
            padding: '6px 16px', borderRadius: 100, marginBottom: 32,
          }}>
            <Building2 style={{ width: 13, height: 13, color: C.teal }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.teal, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Terex Business</span>
          </div>

          <h1 style={{ fontSize: 60, fontWeight: 900, color: C.t1, margin: '0 0 24px', letterSpacing: '-0.045em', lineHeight: 1.04, fontFamily: FONT }}>
            Gérez vos paiements<br />
            USDT fournisseurs<br />
            <span style={{ color: C.teal }}>à l'international</span>
          </h1>

          <p style={{ fontSize: 17, color: C.t2, lineHeight: 1.75, margin: '0 0 46px', fontFamily: FONT }}>
            Trésorerie multi-réseaux, paiements sécurisés et API webhook<br />conçus pour les entreprises de la zone UEMOA.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <TealBtn large onClick={() => navigate('/auth')}>
              Créer un compte <ArrowRight style={{ width: 15, height: 15 }} />
            </TealBtn>
            <GhostBtn large onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Voir les fonctionnalités
            </GhostBtn>
          </div>
        </div>
      </div>

      {/* ── FEATURES 3-COL GRID ──────────────────────────────────── */}
      <div id="features" style={{ borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 58 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.03em', fontFamily: FONT }}>
              Tout ce dont votre entreprise a besoin
            </h2>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, fontFamily: FONT }}>
              Un tableau de bord complet pour gérer vos flux USDT
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{
                  padding: '36px 38px',
                  borderRight: (i + 1) % 3 !== 0 ? `1px solid ${C.bds}` : 'none',
                  borderBottom: i < 3 ? `1px solid ${C.bds}` : 'none',
                }}>
                  <Icon style={{ width: 22, height: 22, color: C.t2, marginBottom: 20 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: '0 0 10px', fontFamily: FONT, letterSpacing: '-0.015em' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.7, margin: 0, fontFamily: FONT }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ALTERNATING SECTIONS ─────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>

        {/* Trésorerie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '80px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Trésorerie" />
            <SectionTitle>Votre solde USDT<br />en temps réel</SectionTitle>
            <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, margin: '0 0 32px', fontFamily: FONT }}>
              Visualisez votre solde consolidé sur TRC-20, BEP-20 et ERC-20. Verrouillez votre taux pendant 15 minutes et planifiez vos virements en toute sérénité.
            </p>
            <SectionStats items={[['3 réseaux', 'TRC-20, BEP-20, ERC-20'], ['15 min', 'Verrouillage de taux garanti'], ['Temps réel', 'Mise à jour du solde']]} />
          </div>
          <div style={{ flexShrink: 0 }}>
            <PreviewCard height={440}><BusinessTreasury user={DEMO_USER} /></PreviewCard>
          </div>
        </div>

        {/* Paiements */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '80px 0', borderBottom: `1px solid ${C.bds}`, flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Paiements" />
            <SectionTitle>Payez vos fournisseurs<br />en quelques clics</SectionTitle>
            <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, margin: '0 0 32px', fontFamily: FONT }}>
              Saisissez le montant, sélectionnez votre fournisseur et confirmez. Les paiements supérieurs à 5 000 USDT déclenchent une validation renforcée pour votre sécurité.
            </p>
            <SectionStats items={[['100 USDT', 'Montant minimum'], ['1,5 %', 'Frais jusqu\'à 10K USDT'], ['< 10 min', 'Confirmation blockchain']]} />
          </div>
          <div style={{ flexShrink: 0 }}>
            <PreviewCard height={460}><BusinessPayments user={DEMO_USER} onBack={() => {}} /></PreviewCard>
          </div>
        </div>

        {/* Fournisseurs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '80px 0', borderBottom: `1px solid ${C.bds}` }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Fournisseurs" />
            <SectionTitle>Gérez votre réseau<br />de fournisseurs</SectionTitle>
            <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, margin: '0 0 32px', fontFamily: FONT }}>
              Enregistrez vos fournisseurs avec leur adresse wallet et réseau blockchain. Tous vos contacts sont disponibles immédiatement au moment du paiement.
            </p>
            <SectionStats items={[['Illimité', 'Fournisseurs enregistrables'], ['TRC-20', 'Réseau recommandé'], ['CSV', 'Import & export']]} />
          </div>
          <div style={{ flexShrink: 0 }}>
            <PreviewCard height={460}><BusinessSuppliers user={DEMO_USER} /></PreviewCard>
          </div>
        </div>

        {/* Analytiques */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '80px 0', flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <Tag label="Analytiques" />
            <SectionTitle>Pilotez votre activité<br />avec des données précises</SectionTitle>
            <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.8, margin: '0 0 32px', fontFamily: FONT }}>
              Suivez vos volumes, vos tendances et la répartition de vos paiements par réseau. Les indicateurs s'actualisent en temps réel depuis votre historique.
            </p>
            <SectionStats items={[['Temps réel', 'Données actualisées'], ['3 réseaux', 'Répartition détaillée'], ['12 mois', 'Historique glissant']]} />
          </div>
          <div style={{ flexShrink: 0 }}>
            <PreviewCard height={460}><BusinessAnalytics user={DEMO_USER} /></PreviewCard>
          </div>
        </div>

      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div style={{ background: C.bg, backgroundImage: HATCH, borderTop: `1px solid ${C.bds}`, padding: '104px 48px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: C.t1, margin: '0 0 18px', letterSpacing: '-0.04em', fontFamily: FONT }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: 16, color: C.t2, lineHeight: 1.8, margin: '0 0 42px', fontFamily: FONT }}>
            Créez votre compte Business en quelques minutes et commencez à envoyer des paiements USDT dès validation de votre dossier KYC.
          </p>
          <TealBtn large onClick={() => navigate('/auth')}>
            Créer un compte Business <ArrowRight style={{ width: 15, height: 15 }} />
          </TealBtn>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" alt="Terex" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover' }} />
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
