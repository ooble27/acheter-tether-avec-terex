import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Check } from 'lucide-react';
import { BusinessOverview } from '@/components/business/BusinessOverview';
import { BusinessTreasury } from '@/components/business/BusinessTreasury';
import { BusinessPayments } from '@/components/business/BusinessPayments';
import { BusinessSuppliers } from '@/components/business/BusinessSuppliers';
import { BusinessAnalytics } from '@/components/business/BusinessAnalytics';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828',
  bds: '#2a2a2a', bd: '#383838',
  teal: '#3B968F', tealH: '#2d7870',
  tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

const DEMO_USER = { email: 'demo@terex.sn', name: 'Terex Business', id: 'demo' };

const SCALE = 0.46;
const FRAME_W = 560;
const INNER_W = Math.round(FRAME_W / SCALE);

function BrowserFrame({ children, height = 420 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{
      width: FRAME_W, height, overflow: 'hidden',
      borderRadius: 14, border: `1px solid ${C.bds}`,
      background: C.bg, boxShadow: '0 12px 60px rgba(0,0,0,0.55)',
      flexShrink: 0,
    }}>
      <div style={{ height: 32, background: C.l1, borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: C.bd }} />)}
        <div style={{ flex: 1, height: 18, background: C.l2, borderRadius: 4, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
          <span style={{ fontSize: 10, color: C.t3, fontFamily: FONT }}>app.terex.sn/business</span>
        </div>
      </div>
      <div style={{ overflow: 'hidden', height: height - 32 }}>
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

function TealBtn({ children, onClick, large }: { children: React.ReactNode; onClick?: () => void; large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ height: large ? 46 : 40, paddingLeft: large ? 26 : 20, paddingRight: large ? 26 : 20, background: hov ? C.tealH : C.teal, border: 'none', borderRadius: 10, color: '#fff', fontSize: large ? 14 : 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FONT, transition: 'background 0.15s', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ height: 40, paddingLeft: 18, paddingRight: 18, background: 'transparent', border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 10, color: hov ? C.t1 : C.t2, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

function FeatureSection({
  title, desc, bullets, preview, reverse = false, frameHeight = 430,
}: {
  title: string; desc: string; bullets: string[];
  preview: React.ReactNode; reverse?: boolean; frameHeight?: number;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 72,
      flexDirection: reverse ? 'row-reverse' : 'row',
      padding: '72px 0', borderBottom: `1px solid ${C.bds}`,
    }}>
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2, fontFamily: FONT }}>
          {title}
        </h2>
        <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.75, margin: '0 0 28px', fontFamily: FONT }}>{desc}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 19, height: 19, borderRadius: 5, background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check style={{ width: 11, height: 11, color: C.teal }} />
              </div>
              <span style={{ fontSize: 13, color: C.t2, fontFamily: FONT }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <BrowserFrame height={frameHeight}>{preview}</BrowserFrame>
      </div>
    </div>
  );
}

export function BusinessLanding() {
  const navigate = useNavigate();

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FONT, color: C.t1 }}>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(26,26,26,0.92)', backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.bds}`,
        padding: '0 48px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, fontFamily: MONO }}>TX</span>
            </div>
            <span style={{ color: C.t1, fontSize: 14, fontWeight: 700 }}>Terex</span>
          </button>
          <div style={{ width: 1, height: 16, background: C.bds }} />
          <span style={{ color: C.t3, fontSize: 13 }}>Business</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostBtn onClick={() => navigate('/auth')}>Se connecter</GhostBtn>
          <TealBtn onClick={() => navigate('/auth')}>Commencer <ArrowRight style={{ width: 14, height: 14 }} /></TealBtn>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '88px 48px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 72 }}>

          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.tealT, border: `1px solid ${C.tealB}`, padding: '5px 14px', borderRadius: 20, marginBottom: 28 }}>
              <Building2 style={{ width: 13, height: 13, color: C.teal }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.09em', textTransform: 'uppercase' }}>Terex Business</span>
            </div>

            <h1 style={{ fontSize: 50, fontWeight: 900, color: C.t1, margin: '0 0 22px', letterSpacing: '-0.04em', lineHeight: 1.08, fontFamily: FONT }}>
              Gérez vos paiements<br />
              <span style={{ color: C.teal }}>USDT fournisseurs</span><br />
              à l'international
            </h1>

            <p style={{ fontSize: 16, color: C.t2, lineHeight: 1.75, margin: '0 0 40px', fontFamily: FONT, maxWidth: 440 }}>
              Trésorerie multi-réseaux, paiements sécurisés, API webhook et tableaux de bord analytiques — conçus pour les entreprises de la zone UEMOA.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <TealBtn large onClick={() => navigate('/auth')}>
                Créer un compte Business <ArrowRight style={{ width: 15, height: 15 }} />
              </TealBtn>
              <GhostBtn onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Voir les fonctionnalités
              </GhostBtn>
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <BrowserFrame height={480}>
              <BusinessOverview user={DEMO_USER} onNavigate={() => {}} />
            </BrowserFrame>
          </div>
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <div id="features" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px 88px' }}>

        <FeatureSection
          title="Trésorerie USDT en temps réel"
          desc="Visualisez votre solde consolidé sur TRC-20, BEP-20 et ERC-20. Verrouillez votre taux de change pendant 15 minutes et planifiez vos virements en toute sérénité."
          bullets={[
            "Solde multi-réseaux unifié",
            "Verrouillage de taux garanti 15 min",
            "Historique complet et export PDF",
          ]}
          preview={<BusinessTreasury user={DEMO_USER} />}
          frameHeight={440}
        />

        <FeatureSection
          title="Paiements fournisseurs en quelques clics"
          desc="Saisissez le montant, sélectionnez votre fournisseur et confirmez. Les paiements supérieurs à 5 000 USDT déclenchent une validation renforcée pour votre sécurité."
          bullets={[
            "Taux figé à la confirmation",
            "Modèles de paiement réutilisables",
            "Notifications webhook temps réel",
          ]}
          preview={<BusinessPayments user={DEMO_USER} onBack={() => {}} />}
          reverse
          frameHeight={460}
        />

        <FeatureSection
          title="Gérez votre réseau de fournisseurs"
          desc="Enregistrez vos fournisseurs avec leur adresse wallet et réseau blockchain. Tous vos contacts sont disponibles immédiatement au moment du paiement."
          bullets={[
            "Adresses wallet vérifiées avant enregistrement",
            "Catégorisation par secteur d'activité",
            "Import & export CSV",
          ]}
          preview={<BusinessSuppliers user={DEMO_USER} />}
          frameHeight={460}
        />

        <FeatureSection
          title="Pilotez votre activité avec des données précises"
          desc="Suivez vos volumes, vos tendances et la répartition de vos paiements par réseau. Les indicateurs s'actualisent en temps réel depuis votre historique de transactions."
          bullets={[
            "Volume mensuel et tendances glissantes",
            "Répartition TRC-20 / BEP-20 / ERC-20",
            "Taux de complétion et alertes",
          ]}
          preview={<BusinessAnalytics user={DEMO_USER} />}
          reverse
          frameHeight={460}
        />

      </div>

      {/* ── CTA FINAL ───────────────────────────────────────────────── */}
      <div style={{ background: '#141414', borderTop: `1px solid ${C.bds}`, padding: '88px 48px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: C.t1, margin: '0 0 18px', letterSpacing: '-0.03em', fontFamily: FONT }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.75, margin: '0 0 36px', fontFamily: FONT }}>
            Créez votre compte Business en quelques minutes. Soumettez vos documents KYC et commencez à envoyer des paiements USDT dès validation de votre dossier.
          </p>
          <TealBtn large onClick={() => navigate('/auth')}>
            Créer un compte Business <ArrowRight style={{ width: 15, height: 15 }} />
          </TealBtn>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.bds}`, padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>© 2025 Terex Exchange. Tous droits réservés.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Termes', '/terms'], ['Confidentialité', '/privacy'], ['Support', '/support']].map(([label, path]) => (
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
