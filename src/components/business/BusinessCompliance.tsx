import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, ChevronRight, Upload, ShieldCheck, AlertCircle } from 'lucide-react';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.20)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

type DocStatus = 'required' | 'submitted' | 'verified' | 'expired';

interface Document {
  id: string;
  name: string;
  desc: string;
  status: DocStatus;
}

const LEVELS = [
  { n: 1, label: 'Basique',  limit: '5 000 USDT/mois',  state: 'done'   as const },
  { n: 2, label: 'Vérifié', limit: '50 000 USDT/mois', state: 'active' as const },
  { n: 3, label: 'Avancé',  limit: '200 000 USDT/mois',state: 'locked' as const },
  { n: 4, label: 'Premium', limit: 'Illimitée',          state: 'locked' as const },
];

function LevelCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
      {LEVELS.map(lv => {
        const done   = lv.state === 'done';
        const active = lv.state === 'active';
        const locked = lv.state === 'locked';
        return (
          <div key={lv.n} style={{
            background: active ? 'rgba(59,150,143,0.06)' : C.l1,
            border: `1px solid ${active ? C.tealB : C.bds}`,
            borderRadius: 12, padding: '16px 18px',
            opacity: locked ? 0.5 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                Niveau {lv.n}
              </span>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? C.teal : active ? 'transparent' : C.l3,
                border: active ? `1.5px solid ${C.teal}` : 'none',
              }}>
                {done   && <Check size={11} color="#fff" strokeWidth={3} />}
                {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal }} />}
                {locked && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.t3 }} />}
              </div>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? C.teal : done ? C.t1 : C.t2, marginBottom: 4 }}>
              {lv.label}
            </div>
            <div style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>{lv.limit}</div>
          </div>
        );
      })}
    </div>
  );
}

function DocRow({ doc, onSubmit }: { doc: Document; onSubmit: (id: string) => void }) {
  const [showModal, setShowModal] = useState(false);

  const statusCfg: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
    required:  { label: 'Requis',        color: C.t3,    bg: 'rgba(255,255,255,0.04)', border: C.bds },
    submitted: { label: 'En vérification', color: C.teal, bg: C.tealT,               border: C.tealB },
    verified:  { label: 'Approuvé',      color: C.teal,  bg: C.tealT,                border: C.tealB },
    expired:   { label: 'Expiré',        color: C.red,   bg: C.redT,                 border: C.redB },
  };
  const s = statusCfg[doc.status];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: `1px solid ${C.bds}` }}>

        {/* Icône statut */}
        <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, border: `1px solid ${s.border}` }}>
          {doc.status === 'verified'  && <Check size={14} color={C.teal} strokeWidth={2.5} />}
          {doc.status === 'submitted' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.teal }} />}
          {doc.status === 'required'  && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.t3 }} />}
          {doc.status === 'expired'   && <AlertCircle size={14} color={C.red} />}
        </div>

        {/* Texte */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{doc.name}</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{doc.desc}</div>
        </div>

        {/* Badge statut */}
        <span style={{ fontSize: 11, fontWeight: 500, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {s.label}
        </span>

        {/* Action */}
        {(doc.status === 'required' || doc.status === 'expired') && (
          <button onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, fontSize: 12, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t2, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.13s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
            <Upload size={11} /> Soumettre
          </button>
        )}
      </div>

      {/* Modal upload */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bd}`, borderRadius: 16, padding: 28, width: 380, boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h3 style={{ color: C.t1, fontSize: 15, fontWeight: 700, margin: 0 }}>Soumettre un document</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: C.t3, cursor: 'pointer', display: 'flex', borderRadius: 6 }}><X size={16} /></button>
            </div>
            <p style={{ color: C.t3, fontSize: 12, margin: '0 0 20px' }}>{doc.name}</p>
            <div style={{ border: `1px dashed ${C.bd}`, borderRadius: 10, padding: '32px 20px', textAlign: 'center', background: C.l2, marginBottom: 16 }}>
              <Upload size={22} color={C.t3} style={{ margin: '0 auto 8px' }} />
              <p style={{ color: C.t3, fontSize: 12, margin: 0 }}>Glissez votre fichier ici</p>
              <p style={{ color: C.t3, fontSize: 11, margin: '4px 0 0', opacity: 0.6 }}>PDF, JPG, PNG — max 10 Mo</p>
            </div>
            <button onClick={() => { onSubmit(doc.id); setShowModal(false); }}
              style={{ width: '100%', padding: '11px 0', borderRadius: 9, fontSize: 13, fontWeight: 600, background: C.teal, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: FONT, transition: 'background 0.13s' }}
              onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
              onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
              Simuler l'envoi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function BusinessCompliance({ user: _user }: { user: { email: string; name: string; id?: string } | null }) {
  useAuth();

  const [docs, setDocs] = useState<Document[]>([
    { id: 'siret',       name: 'SIRET / Numéro RC',            desc: 'Identifiant officiel de l\'entreprise',      status: 'verified'  },
    { id: 'kbis',        name: 'Extrait Kbis',                 desc: 'Moins de 3 mois',                           status: 'verified'  },
    { id: 'id-dir',      name: "Pièce d'identité dirigeant",   desc: 'Passeport ou CNI en cours de validité',     status: 'submitted' },
    { id: 'domicile',    name: 'Justificatif de domicile',     desc: 'Moins de 3 mois',                           status: 'required'  },
    { id: 'statuts',     name: 'Statuts de la société',        desc: 'Version signée et à jour',                  status: 'required'  },
    { id: 'rapport',     name: 'Rapport financier annuel',     desc: 'Dernier exercice clos',                     status: 'required'  },
    { id: 'contrat',     name: 'Contrat cadre signé',          desc: 'Document fourni par Terex',                 status: 'required'  },
  ]);

  const [showLimitForm, setShowLimitForm] = useState(false);
  const [limitValue, setLimitValue]       = useState('');
  const [justification, setJustification] = useState('');
  const [limitSent, setLimitSent]         = useState(false);

  const handleSubmit = (id: string) =>
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'submitted' } : d));

  const level1 = docs.filter(d => ['siret', 'kbis'].includes(d.id));
  const level2 = docs.filter(d => ['id-dir', 'domicile'].includes(d.id));
  const level3 = docs.filter(d => ['statuts', 'rapport', 'contrat'].includes(d.id));

  const l2Done   = level2.filter(d => d.status === 'submitted' || d.status === 'verified').length;
  const l2Total  = level2.length;
  const l2Pct    = Math.round((l2Done / l2Total) * 100);

  const inp: React.CSSProperties = {
    width: '100%', background: C.l2, border: `1px solid ${C.bd}`,
    borderRadius: 8, padding: '10px 12px', color: C.t1, fontSize: 13,
    outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontFamily: FONT }}>

      {/* ── Hero ── (inchangé) */}
      <div style={{
        borderRadius: 14, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)',
        border: `1px solid ${C.bds}`,
        minHeight: 200, marginBottom: 20,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="480" height="180" viewBox="0 0 480 180" fill="none" style={{ display: 'block', opacity: 0.7 }}>
            <path d="M240 20 L270 32 L270 72 Q270 100 240 116 Q210 100 210 72 L210 32 Z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M240 36 L258 46 L258 72 Q258 90 240 100 Q222 90 222 72 L222 46 Z" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
            <path d="M228 68 L236 76 L252 58" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="100" y="35" width="64" height="82" rx="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
            <rect x="106" y="42" width="40" height="5" rx="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            <rect x="106" y="52" width="32" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="106" y="60" width="36" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="106" y="68" width="28" height="4" rx="2" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="128" cy="96" r="10" stroke="rgba(59,150,143,0.7)" strokeWidth="1.3"/>
            <path d="M123 96 L126 99 L133 93" stroke="rgba(59,150,143,0.9)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="316" y="35" width="64" height="82" rx="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
            <rect x="322" y="42" width="40" height="5" rx="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            <rect x="322" y="52" width="32" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="322" y="60" width="36" height="4" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <rect x="322" y="68" width="28" height="4" rx="2" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="344" cy="96" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3"/>
            <path d="M344 91 L344 101 M339 96 L349 96" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M164 76 L208 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3"/>
            <path d="M316 76 L272 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3"/>
            <circle cx="180" cy="148" r="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <path d="M176 148 L179 151 L184 145" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M188 148 L220 148" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="228" cy="148" r="8" stroke="rgba(59,150,143,0.6)" strokeWidth="1.2"/>
            <circle cx="228" cy="148" r="3" fill="rgba(59,150,143,0.5)"/>
            <path d="M236 148 L268 148" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 2"/>
            <circle cx="276" cy="148" r="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <path d="M284 148 L308 148" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
            <circle cx="316" cy="148" r="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="80" cy="130" r="2.5" fill="rgba(255,255,255,0.18)"/>
            <circle cx="400" cy="130" r="2.5" fill="rgba(255,255,255,0.18)"/>
            <circle cx="60" cy="55" r="2" fill="rgba(255,255,255,0.15)"/>
            <circle cx="420" cy="55" r="2" fill="rgba(255,255,255,0.15)"/>
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(20,20,20,0.97) 0%, transparent 100%)' }} />
        <div style={{ position: 'relative', padding: '20px 28px' }}>
          <h2 style={{ color: C.t1, fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 4px' }}>Conformité KYC</h2>
          <p style={{ color: 'rgba(240,240,240,0.5)', fontSize: 13, margin: 0 }}>Vérification et documents réglementaires</p>
        </div>
      </div>

      {/* ── Niveaux de vérification ── */}
      <LevelCards />

      {/* ── Contenu principal ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, alignItems: 'start' }}>

        {/* LEFT — Documents */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '22px 26px' }}>
          <h3 style={{ color: C.t1, fontSize: 14, fontWeight: 700, margin: '0 0 22px', letterSpacing: '-0.01em' }}>
            Documents requis
          </h3>

          {/* Niveau 1 */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Niveau 1 — Identité entreprise</span>
              <span style={{ fontSize: 10, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, padding: '1px 7px', borderRadius: 10 }}>5 000 USDT/mois</span>
            </div>
            {level1.map(d => <DocRow key={d.id} doc={d} onSubmit={handleSubmit} />)}
          </div>

          {/* Niveau 2 */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Niveau 2 — Dirigeant</span>
              <span style={{ fontSize: 10, color: C.t3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, padding: '1px 7px', borderRadius: 10 }}>50 000 USDT/mois</span>
            </div>
            {level2.map(d => <DocRow key={d.id} doc={d} onSubmit={handleSubmit} />)}
          </div>

          {/* Niveau 3 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Niveau 3 — Premium</span>
              <span style={{ fontSize: 10, color: C.t3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, padding: '1px 7px', borderRadius: 10 }}>Illimitée</span>
            </div>
            {level3.map(d => <DocRow key={d.id} doc={d} onSubmit={handleSubmit} />)}
          </div>
        </div>

        {/* RIGHT — Statut + actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Niveau actuel */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <ShieldCheck size={15} color={C.teal} />
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.09em' }}>Niveau actuel</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 14 }}>Niveau 1 — Basique</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { label: 'Limite mensuelle',      value: '5 000 USDT' },
                { label: 'Limite par transaction', value: '2 000 USDT' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{r.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowLimitForm(!showLimitForm); setLimitSent(false); }}
              style={{ marginTop: 16, width: '100%', padding: '9px 0', borderRadius: 9, fontSize: 12, fontWeight: 500, background: 'transparent', border: `1px solid ${C.bds}`, color: C.t2, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.13s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
              Demander une augmentation <ChevronRight size={12} />
            </button>
          </div>

          {/* Niveau suivant */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${C.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.09em' }}>Niveau suivant</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 3 }}>Niveau 2 — Vérifié</div>
            <div style={{ fontSize: 11, color: C.t3, marginBottom: 16, fontFamily: MONO }}>50 000 USDT/mois</div>

            {/* Progression */}
            <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: C.t3 }}>Documents soumis</span>
              <span style={{ fontSize: 11, color: C.t2, fontFamily: MONO }}>{l2Done}/{l2Total}</span>
            </div>
            <div style={{ height: 3, background: C.l3, borderRadius: 2, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', background: C.teal, borderRadius: 2, width: `${l2Pct}%`, transition: 'width 0.4s ease' }} />
            </div>

            {/* Documents manquants */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {level2.filter(d => d.status === 'required').map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: C.t3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.t3, flexShrink: 0 }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          {/* Info expiration */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Check size={14} color={C.teal} />
            <span style={{ fontSize: 12, color: C.t3 }}>Aucun document n'expire prochainement</span>
          </div>
        </div>
      </div>

      {/* ── Formulaire augmentation de limite ── */}
      {showLimitForm && (
        <div style={{ marginTop: 16, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '24px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ color: C.t1, fontSize: 14, fontWeight: 700, margin: 0 }}>Demande d'augmentation de limite</h3>
            <button onClick={() => setShowLimitForm(false)} style={{ background: 'none', border: 'none', color: C.t3, cursor: 'pointer', display: 'flex', borderRadius: 6 }}>
              <X size={15} />
            </button>
          </div>

          {limitSent ? (
            <div style={{ padding: '16px 18px', borderRadius: 10, background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Check size={15} color={C.teal} />
              <span style={{ color: C.teal, fontSize: 13 }}>Demande envoyée — notre équipe vous contactera sous 24h.</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: C.t3, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                  Limite souhaitée (USDT/mois)
                </label>
                <input type="number" value={limitValue} onChange={e => setLimitValue(e.target.value)} placeholder="100 000" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: C.t3, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                  Justification
                </label>
                <textarea value={justification} onChange={e => setJustification(e.target.value)} placeholder="Décrivez votre activité et le volume mensuel attendu…" rows={1} style={{ ...inp, resize: 'none', lineHeight: 1.5 }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => { if (limitValue && justification) setLimitSent(true); }}
                  style={{ padding: '10px 22px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: C.teal, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: FONT, transition: 'background 0.13s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
                  Envoyer la demande
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
