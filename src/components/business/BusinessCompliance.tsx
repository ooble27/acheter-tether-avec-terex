import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.16)',
  purple: '#a855f7', purpleT: 'rgba(168,85,247,0.08)', purpleB: 'rgba(168,85,247,0.20)',
};
const FONT = "'Inter', sans-serif";

type DocStatus = 'required' | 'submitted' | 'verified' | 'expired';

interface Document {
  id: string;
  name: string;
  status: DocStatus;
  submittedAt?: Date;
}

const STEPS = [
  { label: 'Non vérifié', sublabel: '0 USDT' },
  { label: 'En cours', sublabel: '5k USDT/mois' },
  { label: 'Vérifié', sublabel: '50k USDT/mois' },
  { label: 'Premium', sublabel: 'Illimitée' },
];

const CURRENT_STEP = 1; // "En cours"

function StatusPill({ status }: { status: DocStatus }) {
  const cfg: Record<DocStatus, { bg: string; border: string; color: string; label: string }> = {
    required:  { bg: 'rgba(104,104,104,0.10)', border: 'rgba(104,104,104,0.20)', color: C.t3,   label: 'Requis' },
    submitted: { bg: C.amberT,                 border: C.amberB,                 color: C.amber, label: 'Soumis' },
    verified:  { bg: C.emT,                    border: C.emB,                    color: C.em,    label: 'Vérifié' },
    expired:   { bg: C.redT,                   border: C.redB,                   color: C.red,   label: 'Expiré' },
  };
  const { bg, border, color, label } = cfg[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: bg, border: `1px solid ${border}`, color, fontFamily: FONT, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.bds}` }}>
      <div style={{ position: 'relative' }}>
        {/* Connecting lines */}
        <div style={{ position: 'absolute', top: 14, left: '12.5%', right: '12.5%', height: 2, display: 'flex' }}>
          {STEPS.slice(0, -1).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              background: i < currentStep ? C.teal : C.l4,
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '25%' }}>
                {/* Circle */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: done ? C.teal : active ? 'transparent' : C.l4,
                  border: active ? `2px solid ${C.teal}` : done ? 'none' : `2px solid ${C.l4}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 1,
                  boxShadow: active ? `0 0 0 4px ${C.tealT}` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {done && (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {active && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.teal }} />
                  )}
                </div>
                {/* Label */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 12, fontWeight: active || done ? 600 : 400,
                    color: active ? C.teal : done ? C.t1 : C.t3,
                    fontFamily: FONT,
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 10, color: C.t3, marginTop: 2, fontFamily: FONT }}>{step.sublabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DocumentRow({
  doc,
  onSubmit,
}: {
  doc: Document;
  onSubmit: (id: string) => void;
}) {
  const [showUpload, setShowUpload] = useState(false);
  const [hovered, setHovered] = useState(false);

  const iconMap: Record<DocStatus, string> = {
    required: '○', submitted: '◑', verified: '●', expired: '⚠',
  };
  const iconColor: Record<DocStatus, string> = {
    required: C.t3, submitted: C.amber, verified: C.em, expired: C.red,
  };

  return (
    <>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
          borderBottom: `1px solid ${C.bds}`,
          background: hovered ? 'rgba(255,255,255,0.01)' : 'transparent',
          transition: 'background 0.15s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{ fontSize: 14, color: iconColor[doc.status], flexShrink: 0 }}>{iconMap[doc.status]}</span>
        <span style={{ flex: 1, fontSize: 13, color: C.t1, fontFamily: FONT }}>{doc.name}</span>
        <StatusPill status={doc.status} />
        {doc.status === 'required' || doc.status === 'expired' ? (
          <button
            onClick={() => setShowUpload(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
              border: `1px dashed ${C.bd}`, background: 'transparent',
              color: C.t3, cursor: 'pointer', fontFamily: FONT,
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t3; }}
          >
            ↑ Soumettre
          </button>
        ) : doc.status === 'submitted' ? (
          <span style={{ fontSize: 11, color: C.amber, fontFamily: FONT, whiteSpace: 'nowrap' }}>En cours de vérification</span>
        ) : (
          <span style={{ fontSize: 11, color: C.em, fontFamily: FONT, whiteSpace: 'nowrap' }}>✓ Approuvé</span>
        )}
      </div>

      {/* Upload overlay */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowUpload(false)} />
          <div style={{
            position: 'relative', zIndex: 10, background: C.l1, border: `1px solid ${C.bd}`,
            borderRadius: 14, padding: 28, width: 380,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: 0 }}>Soumettre un document</h3>
              <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', color: C.t3, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
            <p style={{ color: C.t2, fontSize: 13, marginBottom: 20, fontFamily: FONT }}>{doc.name}</p>
            <div style={{
              border: `2px dashed ${C.bd}`, borderRadius: 10, padding: '32px 20px',
              textAlign: 'center', background: C.l2, marginBottom: 16,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
              <p style={{ color: C.t2, fontSize: 13, margin: 0, fontFamily: FONT }}>Glissez votre fichier ici ou</p>
            </div>
            <button
              onClick={() => { onSubmit(doc.id); setShowUpload(false); }}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: C.teal, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: FONT,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
              onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
            >
              Simuler l'upload
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function DocSection({
  title, limit, docs, onSubmit,
}: {
  title: string; limit: string; docs: Document[]; onSubmit: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <h3 style={{ color: C.t1, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: FONT }}>{title}</h3>
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 4,
          background: C.tealT, color: C.teal, fontFamily: FONT, border: `1px solid ${C.tealB}`,
        }}>
          {limit}
        </span>
      </div>
      <div>
        {docs.map(doc => (
          <DocumentRow key={doc.id} doc={doc} onSubmit={onSubmit} />
        ))}
      </div>
    </div>
  );
}

export function BusinessCompliance({ user }: { user: { email: string; name: string; id?: string } | null }) {
  useAuth();

  const [docs, setDocs] = useState<Document[]>([
    // Level 1
    { id: 'siret', name: 'SIRET / Numéro RC', status: 'required' },
    { id: 'kbis', name: 'Extrait Kbis (< 3 mois)', status: 'required' },
    // Level 2
    { id: 'id-dirigeant', name: "Pièce d'identité dirigeant", status: 'submitted', submittedAt: new Date() },
    { id: 'domicile', name: 'Justificatif domicile (< 3 mois)', status: 'required' },
    // Level 3
    { id: 'statuts', name: 'Statuts de la société', status: 'required' },
    { id: 'rapport', name: 'Rapport financier annuel', status: 'required' },
    { id: 'contrat', name: 'Contrat cadre signé', status: 'required' },
  ]);

  const [showLimitForm, setShowLimitForm] = useState(false);
  const [limitValue, setLimitValue] = useState('');
  const [justification, setJustification] = useState('');
  const [limitSent, setLimitSent] = useState(false);
  const [limitFocused, setLimitFocused] = useState(false);
  const [justFocused, setJustFocused] = useState(false);

  const handleSubmit = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'submitted', submittedAt: new Date() } : d));
  };

  const level1Docs = docs.filter(d => ['siret', 'kbis'].includes(d.id));
  const level2Docs = docs.filter(d => ['id-dirigeant', 'domicile'].includes(d.id));
  const level3Docs = docs.filter(d => ['statuts', 'rapport', 'contrat'].includes(d.id));

  const level2Submitted = level2Docs.filter(d => d.status === 'submitted' || d.status === 'verified').length;
  const level2Missing = level2Docs.filter(d => d.status === 'required').length;

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%', background: C.l2, border: `1px solid ${focused ? C.teal : C.bd}`,
    borderRadius: 8, padding: '10px 12px', color: C.t1, fontSize: 13,
    outline: 'none', fontFamily: FONT, boxSizing: 'border-box', transition: 'border-color 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontFamily: FONT }}>

      {/* Hero illustrated card */}
      <div style={{
        borderRadius: 14, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1520 60%, #0a1018 100%)',
        border: `1px solid rgba(59,130,246,0.18)`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        minHeight: 200,
        marginBottom: 24,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* SVG shield/compliance illustration */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="480" height="180" viewBox="0 0 480 180" fill="none" style={{ display: 'block', opacity: 0.7 }}>
            {/* Central shield */}
            <path d="M240 20 L270 32 L270 72 Q270 100 240 116 Q210 100 210 72 L210 32 Z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M240 36 L258 46 L258 72 Q258 90 240 100 Q222 90 222 72 L222 46 Z" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
            {/* Checkmark inside shield */}
            <path d="M228 68 L236 76 L252 58" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Document stacks left */}
            <rect x="100" y="35" width="64" height="82" rx="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
            <rect x="106" y="42" width="40" height="5" rx="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            <rect x="106" y="52" width="32" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="106" y="60" width="36" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="106" y="68" width="28" height="4" rx="2" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="128" cy="96" r="10" stroke="rgba(34,197,94,0.6)" strokeWidth="1.3"/>
            <path d="M123 96 L126 99 L133 93" stroke="rgba(34,197,94,0.8)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Document stack right */}
            <rect x="316" y="35" width="64" height="82" rx="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
            <rect x="322" y="42" width="40" height="5" rx="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            <rect x="322" y="52" width="32" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="322" y="60" width="36" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="322" y="68" width="28" height="4" rx="2" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="344" cy="96" r="10" stroke="rgba(245,158,11,0.6)" strokeWidth="1.3"/>
            <path d="M344 91 L344 101 M339 96 L349 96" stroke="rgba(245,158,11,0.8)" strokeWidth="1.3" strokeLinecap="round"/>
            {/* Connecting lines from docs to shield */}
            <path d="M164 76 L208 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3"/>
            <path d="M316 76 L272 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3"/>
            {/* Progress steps bottom */}
            <circle cx="180" cy="148" r="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <path d="M176 148 L179 151 L184 145" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M188 148 L220 148" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="228" cy="148" r="8" stroke="rgba(245,158,11,0.6)" strokeWidth="1.2"/>
            <circle cx="228" cy="148" r="3" fill="rgba(245,158,11,0.5)"/>
            <path d="M236 148 L268 148" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 2"/>
            <circle cx="276" cy="148" r="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <path d="M284 148 L308 148" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
            <circle cx="316" cy="148" r="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            {/* Floating dots */}
            <circle cx="80" cy="130" r="2.5" fill="rgba(255,255,255,0.18)"/>
            <circle cx="400" cy="130" r="2.5" fill="rgba(255,255,255,0.18)"/>
            <circle cx="60" cy="55" r="2" fill="rgba(255,255,255,0.15)"/>
            <circle cx="420" cy="55" r="2" fill="rgba(255,255,255,0.15)"/>
          </svg>
        </div>
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
          background: 'linear-gradient(to top, rgba(10,16,24,0.95) 0%, transparent 100%)',
        }} />
        {/* Text */}
        <div style={{ position: 'relative', padding: '20px 28px' }}>
          <h2 style={{ color: C.t1, fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 4px' }}>
            Conformité KYC
          </h2>
          <p style={{ color: 'rgba(240,240,240,0.5)', fontSize: 13, margin: 0 }}>Vérification et documents réglementaires</p>
        </div>
      </div>

      {/* Progress bar card */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, marginBottom: 20, overflow: 'hidden' }}>
        <ProgressBar currentStep={CURRENT_STEP} />
        <div style={{ padding: '14px 28px', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: C.t2, fontFamily: FONT }}>Niveau actuel :</span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: C.amber,
            background: C.amberT, border: `1px solid ${C.amberB}`,
            padding: '2px 8px', borderRadius: 5,
          }}>En cours de vérification — 5,000 USDT/mois</span>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* LEFT — Document checklist */}
        <div style={{ flex: '0 0 55%', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '24px 28px' }}>
          <h3 style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: '0 0 24px', fontFamily: FONT }}>
            Documents requis
          </h3>

          <DocSection
            title="Niveau 1 — Identité entreprise"
            limit="5,000 USDT/mois"
            docs={level1Docs}
            onSubmit={handleSubmit}
          />
          <DocSection
            title="Niveau 2 — Dirigeant"
            limit="50,000 USDT/mois"
            docs={level2Docs}
            onSubmit={handleSubmit}
          />
          <DocSection
            title="Niveau 3 — Premium"
            limit="Illimitée"
            docs={level3Docs}
            onSubmit={handleSubmit}
          />
        </div>

        {/* RIGHT — Status summary */}
        <div style={{ flex: '0 0 calc(45% - 20px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Current level card */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.amber }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Niveau actuel</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.t1, marginBottom: 16, fontFamily: FONT }}>
              Niveau 1 — Basique
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Limite mensuelle', value: '5,000 USDT/mois', color: C.t1 },
                { label: 'Limite par transaction', value: '2,000 USDT', color: C.t1 },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: C.t3, fontFamily: FONT }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: row.color, fontFamily: FONT }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowLimitForm(true); setLimitSent(false); }}
              style={{
                marginTop: 16, width: '100%', padding: '9px 0', borderRadius: 8, fontSize: 12, fontWeight: 500,
                background: 'transparent', border: `1px solid ${C.bd}`, color: C.t2,
                cursor: 'pointer', fontFamily: FONT, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; }}
            >
              Demander une augmentation →
            </button>
          </div>

          {/* Next level card */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.teal }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Niveau suivant</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.t1, marginBottom: 4, fontFamily: FONT }}>
              Niveau 2 — Vérifié
            </div>
            <div style={{ fontSize: 12, color: C.t3, marginBottom: 16, fontFamily: FONT }}>Limite : 50,000 USDT/mois</div>
            <div style={{ fontSize: 12, color: C.amber, marginBottom: 12, fontFamily: FONT }}>
              ⚠ {level2Missing} document{level2Missing !== 1 ? 's' : ''} manquant{level2Missing !== 1 ? 's' : ''}
            </div>
            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.t3, fontFamily: FONT }}>Documents soumis</span>
                <span style={{ fontSize: 11, color: C.t2, fontFamily: FONT }}>{level2Submitted}/{level2Docs.length}</span>
              </div>
              <div style={{ height: 4, background: C.l3, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: C.teal, borderRadius: 2,
                  width: `${(level2Submitted / level2Docs.length) * 100}%`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          </div>

          {/* Expiry alerts */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13 }}>⚠</span>
              <span style={{ fontSize: 13, color: C.t3, fontFamily: FONT }}>Aucun document n'expire prochainement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Limit increase form */}
      {showLimitForm && (
        <div style={{
          marginTop: 20, background: C.l1, border: `1px solid ${C.bd}`,
          borderRadius: 12, padding: '24px 28px',
          animation: 'slideDown 0.2s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ color: C.t1, fontSize: 15, fontWeight: 600, margin: 0, fontFamily: FONT }}>
              Demande d'augmentation de limite
            </h3>
            <button
              onClick={() => setShowLimitForm(false)}
              style={{ background: 'none', border: 'none', color: C.t3, cursor: 'pointer', fontSize: 16 }}
            >×</button>
          </div>

          {limitSent ? (
            <div style={{
              padding: '18px 20px', borderRadius: 10,
              background: C.emT, border: `1px solid ${C.emB}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>✓</span>
              <span style={{ color: C.em, fontSize: 13, fontFamily: FONT }}>
                Demande envoyée — notre équipe vous contactera sous 24h.
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.t3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: FONT }}>
                  Limite souhaitée (USDT/mois)
                </label>
                <input
                  type="number"
                  value={limitValue}
                  onChange={e => setLimitValue(e.target.value)}
                  onFocus={() => setLimitFocused(true)}
                  onBlur={() => setLimitFocused(false)}
                  placeholder="Ex: 100,000"
                  style={inputStyle(limitFocused)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.t3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: FONT }}>
                  Justification
                </label>
                <textarea
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  onFocus={() => setJustFocused(true)}
                  onBlur={() => setJustFocused(false)}
                  placeholder="Décrivez votre activité et le volume mensuel attendu…"
                  rows={4}
                  style={{ ...inputStyle(justFocused), resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
              <button
                onClick={() => { if (limitValue && justification) setLimitSent(true); }}
                style={{
                  alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: C.teal, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: FONT,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
                onMouseLeave={e => (e.currentTarget.style.background = C.teal)}
              >
                Envoyer la demande
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
