import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Check, X, Upload, ArrowLeft, ChevronRight, ShieldCheck,
  FileText, TrendingUp, Clock, AlertCircle, Plus, Send, Lock,
  BookOpen, Users, Database, Bell, Scale,
} from 'lucide-react';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.22)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

type DocStatus = 'required' | 'submitted' | 'verified' | 'expired';
type SubPage   = 'main' | 'limit-request' | 'verify-next' | 'compliance-policy';

interface Doc { id: string; name: string; desc: string; status: DocStatus; level: 1 | 2 | 3; }

const LEVEL_INFO = [
  { n: 1, label: 'Basique',  limit: '5 000 USDT/mois',   state: 'done'   as const },
  { n: 2, label: 'Entreprise', limit: '50 000 USDT/mois', state: 'active' as const },
  { n: 3, label: 'Avancé',  limit: '200 000 USDT/mois',  state: 'locked' as const },
  { n: 4, label: 'Premium', limit: 'Illimitée',           state: 'locked' as const },
];

// Niveau 1 : vérification identité personnelle uniquement (déjà complété)
// Niveau 2 : documents entreprise (RCCM, NINEA, etc. — zone OHADA/Sénégal)
// Niveau 3 : structure avancée (statuts, bilan, actionnaires)
const INITIAL_DOCS: Doc[] = [
  // Niveau 1 — identité personnelle (déjà validé)
  { id: 'cni-perso',   name: 'CNI ou Passeport',           desc: "Pièce d'identité nationale en cours de validité",           status: 'verified', level: 1 },
  { id: 'tel',         name: 'Numéro de téléphone',         desc: 'Vérification par SMS effectuée',                            status: 'verified', level: 1 },
  { id: 'email-verif', name: 'Adresse e-mail',              desc: 'Confirmation par lien email',                               status: 'verified', level: 1 },

  // Niveau 2 — entité commerciale (marché sénégalais / UEMOA)
  { id: 'rccm',    name: 'RCCM',                          desc: "Registre du Commerce et du Crédit Mobilier — immatriculation OHADA",    status: 'submitted', level: 2 },
  { id: 'ninea',   name: 'NINEA',                         desc: "Numéro d'Identification Nationale des Entreprises et Associations",     status: 'required',  level: 2 },
  { id: 'cni-dir', name: 'CNI ou Passeport du dirigeant', desc: 'Représentant légal de la société, en cours de validité',               status: 'required',  level: 2 },
  { id: 'siege',   name: 'Justificatif du siège social',  desc: 'Bail commercial ou attestation de domiciliation, moins de 3 mois',     status: 'required',  level: 2 },

  // Niveau 3 — structure avancée
  { id: 'statuts',  name: 'Statuts notariés de la société', desc: 'Version signée et enregistrée, à jour',                           status: 'required', level: 3 },
  { id: 'pv-ag',   name: "PV d'assemblée générale récent",  desc: 'Dernière AGO ou AGE avec liste des dirigeants',                   status: 'required', level: 3 },
  { id: 'bilan',   name: 'États financiers certifiés',      desc: 'Dernier exercice clos, certifié par un expert-comptable',          status: 'required', level: 3 },
  { id: 'ube',     name: 'Registre des bénéficiaires',      desc: 'Bénéficiaires effectifs détenant > 25 % du capital',              status: 'required', level: 3 },
  { id: 'contrat', name: 'Contrat cadre Terex',             desc: 'Convention de services signée par les deux parties',              status: 'required', level: 3 },
];

// ── Bouton fantôme ────────────────────────────────────────────────────

function GhostBtn({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{ background: hov ? C.l3 : 'rgba(255,255,255,0.04)', color: C.t2, border: `1px solid ${C.bds}`, borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

// ── Ligne de document ─────────────────────────────────────────────────

function DocItem({ doc, onSubmit }: { doc: Doc; onSubmit: (id: string) => void }) {
  const [modal, setModal] = useState(false);

  const ST: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
    required:  { label: 'Requis',          color: C.t3,  bg: 'rgba(255,255,255,0.04)', border: C.bds },
    submitted: { label: 'En vérification', color: C.t2,  bg: 'rgba(255,255,255,0.06)', border: C.bd  },
    verified:  { label: 'Approuvé',        color: C.t2,  bg: 'rgba(255,255,255,0.06)', border: C.bd  },
    expired:   { label: 'Expiré',          color: C.red, bg: C.redT,                   border: C.redB },
  };
  const s = ST[doc.status];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, border: `1px solid ${s.border}` }}>
          {doc.status === 'verified'  && <Check size={14} color={C.t2} strokeWidth={2.5} />}
          {doc.status === 'submitted' && <Clock size={13} color={C.t3} />}
          {doc.status === 'required'  && <FileText size={13} color={C.t3} />}
          {doc.status === 'expired'   && <AlertCircle size={13} color={C.red} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: doc.status === 'required' ? C.t2 : C.t1 }}>{doc.name}</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{doc.desc}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {s.label}
        </span>
        {(doc.status === 'required' || doc.status === 'expired') && (
          <button onClick={() => setModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t3, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.13s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
            <Upload size={11} /> Soumettre
          </button>
        )}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bd}`, borderRadius: 18, padding: 28, width: 420, boxShadow: '0 28px 70px rgba(0,0,0,0.65)', fontFamily: FONT }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ color: C.t1, fontSize: 15, fontWeight: 700, margin: 0 }}>Soumettre un document</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: C.t3, cursor: 'pointer', display: 'flex', borderRadius: 6 }}><X size={16} /></button>
            </div>
            <p style={{ color: C.t3, fontSize: 12, margin: '0 0 20px' }}>{doc.name} — {doc.desc}</p>
            <div style={{ border: `1px dashed ${C.bd}`, borderRadius: 12, padding: '36px 20px', textAlign: 'center', background: C.l2, marginBottom: 16, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.bd)}>
              <Upload size={24} color={C.t3} style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ color: C.t2, fontSize: 13, margin: '0 0 4px', fontWeight: 500 }}>Glissez votre fichier ici</p>
              <p style={{ color: C.t3, fontSize: 11, margin: 0 }}>PDF, JPG, PNG · max 10 Mo</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <GhostBtn onClick={() => setModal(false)} style={{ flex: 1 }}>Annuler</GhostBtn>
              <button onClick={() => { onSubmit(doc.id); setModal(false); }}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: C.teal, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                <Send size={13} /> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sous-page : Passer au Niveau 2 ────────────────────────────────────

function VerifyNextPage({ onBack, docs, onSubmit }: {
  onBack: () => void;
  docs: Doc[];
  onSubmit: (id: string) => void;
}) {
  const level2 = docs.filter(d => d.level === 2);
  const done   = level2.filter(d => d.status !== 'required').length;
  const allDone = done === level2.length;

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>

      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 12px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
            <ArrowLeft size={13} /> Conformité
          </button>
          <span style={{ color: C.t3, fontSize: 13 }}>/</span>
          <h2 style={{ color: C.t1, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Passer au Niveau 2 — Entreprise
          </h2>
        </div>
        {allDone && (
          <button style={{ height: 38, paddingLeft: 18, paddingRight: 18, background: C.teal, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: FONT }}>
            <Send size={13} /> Soumettre le dossier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* Gauche — documents requis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Documents Niveau 2 — Entité commerciale</span>
              <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>{done}/{level2.length}</span>
            </div>
            <div style={{ padding: '0 22px' }}>
              {level2.map(d => <DocItem key={d.id} doc={d} onSubmit={onSubmit} />)}
            </div>
          </div>
        </div>

        {/* Droite — infos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Ce que ça débloque */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 14px' }}>Ce que vous débloquez</p>
            {[
              { label: 'Limite mensuelle',       value: '50 000 USDT' },
              { label: 'Limite par transaction', value: '20 000 USDT' },
              { label: 'Délai de virement',      value: 'T+1 ouvré' },
              { label: 'Accès API',              value: 'Inclus' },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Documents acceptés */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 12px' }}>À savoir</p>
            <ul style={{ color: C.t3, fontSize: 12, margin: 0, padding: '0 0 0 16px', lineHeight: 2.1 }}>
              <li>Le RCCM est délivré par le tribunal de commerce</li>
              <li>Le NINEA est obtenu auprès de la DGID (Sénégal)</li>
              <li>Le justificatif de siège doit dater de moins de 3 mois</li>
              <li>Tous les documents doivent être lisibles et en couleur</li>
              <li>Formats acceptés : PDF, JPG, PNG — max 10 Mo</li>
            </ul>
          </div>

          {/* Délai */}
          <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Clock size={14} color={C.t3} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.6 }}>
              Une fois tous les documents soumis, notre équipe KYC procède à la vérification sous <strong style={{ color: C.t2 }}>24 à 72 heures ouvrées</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sous-page : Demande d'augmentation de limite ──────────────────────

function LimitRequestPage({ onBack }: { onBack: () => void }) {
  const [desired, setDesired]    = useState('');
  const [volume, setVolume]      = useState('');
  const [sector, setSector]      = useState('');
  const [justification, setJust] = useState('');
  const [sent, setSent]          = useState(false);

  const canSend = desired.trim() && volume.trim() && justification.trim().length > 20;

  const inp: React.CSSProperties = {
    width: '100%', background: C.l2, border: `1px solid ${C.bd}`, borderRadius: 9,
    padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none',
    fontFamily: FONT, boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 700, color: C.t3,
    textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 7, fontFamily: FONT,
  };
  const card: React.CSSProperties = {
    background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px',
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 12px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
            <ArrowLeft size={13} /> Conformité
          </button>
          <span style={{ color: C.t3, fontSize: 13 }}>/</span>
          <h2 style={{ color: C.t1, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Augmentation de limite</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <GhostBtn onClick={onBack}>Annuler</GhostBtn>
          {!sent && (
            <button onClick={() => { if (canSend) setSent(true); }} disabled={!canSend}
              style={{ height: 38, paddingLeft: 18, paddingRight: 18, background: canSend ? C.teal : C.l3, color: canSend ? '#fff' : C.t3, border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: canSend ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 7, fontFamily: FONT }}>
              <Send size={13} /> Envoyer la demande
            </button>
          )}
        </div>
      </div>

      {sent ? (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '56px 32px', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={22} color={C.t2} strokeWidth={2.5} />
          </div>
          <h3 style={{ color: C.t1, fontSize: 18, fontWeight: 700, margin: 0 }}>Demande envoyée</h3>
          <p style={{ color: C.t3, fontSize: 13, margin: 0, maxWidth: 400, lineHeight: 1.6 }}>
            Notre équipe conformité examinera votre dossier et vous contactera par email sous 24 à 48 heures ouvrées.
          </p>
          <button onClick={onBack}
            style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 7, background: C.teal, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
            <ArrowLeft size={13} /> Retour à la conformité
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 14, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={card}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 16px' }}>Limite souhaitée</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Mensuelle (USDT)</label>
                  <input value={desired} onChange={e => setDesired(e.target.value)} placeholder="Ex : 100 000" type="number" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Volume actuel</label>
                  <input value={volume} onChange={e => setVolume(e.target.value)} placeholder="Ex : 40 000" type="number" style={inp} />
                </div>
              </div>
              {desired && volume && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: C.l2, borderRadius: 9, border: `1px solid ${C.bds}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: C.t3 }}>Augmentation demandée</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.t1, fontFamily: MONO }}>
                      +{(Number(desired) - 5000).toLocaleString()} USDT
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div style={card}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 16px' }}>Activité</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={lbl}>Secteur d'activité</label>
                  <input value={sector} onChange={e => setSector(e.target.value)} placeholder="Import/export, Commerce de gros, Négoce…" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Justification</label>
                  <textarea value={justification} onChange={e => setJust(e.target.value)}
                    placeholder="Décrivez votre activité et la raison de cette demande. Minimum 20 caractères."
                    rows={5} style={{ ...inp, resize: 'none', lineHeight: 1.6 }} />
                  <div style={{ textAlign: 'right', fontSize: 10, color: C.t3, marginTop: 4 }}>{justification.length} / 20 min</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={card}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 4px' }}>Situation actuelle</p>
              {[
                { label: 'Niveau',                value: 'Niveau 1 — Basique' },
                { label: 'Limite mensuelle',      value: '5 000 USDT' },
                { label: 'Limite par transaction',value: '2 000 USDT' },
                { label: 'Prochain palier',       value: '50 000 USDT' },
              ].map((r, i, arr) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div style={{ ...card, background: C.l2 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <ShieldCheck size={16} color={C.t3} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.t2, margin: '0 0 8px' }}>Processus de validation</p>
                  <ul style={{ color: C.t3, fontSize: 12, margin: 0, padding: '0 0 0 14px', lineHeight: 2 }}>
                    <li>Vérification de votre dossier KYC</li>
                    <li>Analyse du volume mensuel déclaré</li>
                    <li>Validation par l'équipe conformité</li>
                    <li>Réponse par email sous 24–48h ouvrées</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={card}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 10px' }}>Documents complémentaires</p>
              <p style={{ color: C.t3, fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>Des justificatifs pourront être demandés après examen de votre dossier.</p>
              <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 9, border: `1px dashed ${C.bds}`, background: 'transparent', color: C.t3, fontSize: 12, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.13s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
                <Plus size={13} /> Ajouter un fichier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sous-page : Politique de conformité ──────────────────────────────

function CompliancePolicyPage({ onBack }: { onBack: () => void }) {

  const sectionTitle: React.CSSProperties = {
    fontSize: 15, fontWeight: 700, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.015em',
  };
  const body: React.CSSProperties = {
    fontSize: 13, color: C.t2, lineHeight: 1.75, margin: 0,
  };
  const card: React.CSSProperties = {
    background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '24px 26px',
  };

  const sections = [
    {
      icon: Scale,
      title: 'Cadre réglementaire',
      content: [
        "Terex Exchange opère en conformité avec les directives de l'Union Économique et Monétaire Ouest-Africaine (UEMOA) et les recommandations de la Banque Centrale des États de l'Afrique de l'Ouest (BCEAO).",
        "Notre politique de lutte contre le blanchiment de capitaux et le financement du terrorisme (LCB-FT) s'appuie sur la Directive N°02/2015/CM/UEMOA relative aux systèmes de paiement, ainsi que sur le droit des affaires OHADA applicable aux entités commerciales de la zone.",
        "Toute transaction dépassant les seuils réglementaires est soumise à une déclaration auprès de la CENTIF (Cellule Nationale de Traitement des Informations Financières) conformément à la loi sénégalaise N°2018-03.",
      ],
    },
    {
      icon: Users,
      title: 'Vérification d\'identité (KYC)',
      content: [
        "Notre processus KYC (Know Your Customer) est structuré en quatre niveaux progressifs, chacun débloquant des limites de transaction supérieures. Ce système garantit que les capacités accordées sont proportionnelles au niveau de vérification effectué.",
        "Niveau 1 — Basique (5 000 USDT/mois) : vérification de l'identité personnelle du titulaire du compte (CNI, passeport), du numéro de téléphone et de l'adresse e-mail.",
        "Niveau 2 — Entreprise (50 000 USDT/mois) : vérification de l'entité commerciale incluant le RCCM (Registre du Commerce et du Crédit Mobilier), le NINEA (Numéro d'Identification Nationale des Entreprises), la pièce d'identité du dirigeant et le justificatif de siège social.",
        "Niveau 3 — Avancé (200 000 USDT/mois) : vérification approfondie incluant les statuts notariés, les états financiers certifiés, le registre des bénéficiaires effectifs (UBE > 25 %) et le contrat cadre Terex.",
        "Niveau 4 — Premium (Illimité) : audit complet de conformité mené par notre équipe dédiée, incluant une visite sur site si nécessaire.",
      ],
    },
    {
      icon: TrendingUp,
      title: 'Limites et surveillance des transactions',
      content: [
        "Les limites de transaction sont fixées par niveau de vérification et s'appliquent sur une base mensuelle calendaire. Le dépassement d'un seuil entraîne le blocage temporaire des opérations jusqu'au renouvellement de la période ou à l'obtention d'un niveau supérieur.",
        "Chaque transaction est analysée en temps réel par notre système de détection des anomalies. Les transactions inhabituelles — par leur montant, leur fréquence ou leur destination — font l'objet d'une révision manuelle par notre équipe conformité.",
        "En cas de suspicion d'opération illicite, Terex Exchange se réserve le droit de suspendre temporairement le compte concerné, de demander des justificatifs complémentaires et, si nécessaire, de procéder à une déclaration de soupçon auprès de la CENTIF.",
      ],
    },
    {
      icon: Database,
      title: 'Conservation des données',
      content: [
        "Les documents et données collectés dans le cadre du processus KYC sont conservés pendant une durée minimale de cinq (5) ans à compter de la clôture du compte, conformément aux obligations légales en vigueur en zone UEMOA.",
        "L'ensemble des documents sensibles est chiffré en transit et au repos selon les standards AES-256. Nos serveurs sont hébergés dans des datacenters certifiés ISO 27001, avec réplication géographique pour assurer la continuité de service.",
        "Terex Exchange est enregistré auprès de la Commission des Données Personnelles (CDP) du Sénégal. Nous ne partageons vos données qu'avec les autorités compétentes sur réquisition légale, ou avec nos partenaires de vérification dans le strict cadre des obligations KYC.",
      ],
    },
    {
      icon: Bell,
      title: 'Obligations de déclaration',
      content: [
        "Conformément à la législation sénégalaise et aux directives UEMOA, Terex Exchange est tenu de déclarer à la CENTIF toute opération dont les caractéristiques laissent supposer une origine illicite des fonds ou un risque de financement du terrorisme.",
        "Les seuils déclenchant une déclaration systématique sont alignés sur les recommandations du GAFI (Groupe d'Action Financière) et incluent notamment les virements internationaux supérieurs à 5 000 000 FCFA (≈ 7 650 EUR) effectués par un même client sur une période de 30 jours.",
        "En cas de gel d'avoirs ordonné par les autorités compétentes (BCEAO, ministère des Finances, décision de justice), Terex Exchange exécutera la mesure dans les délais légaux et en informera le titulaire du compte dans les limites permises par la loi.",
      ],
    },
    {
      icon: BookOpen,
      title: 'Vos droits',
      content: [
        "Conformément à la loi N°2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel et aux prérogatives de la CDP, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.",
        "Pour exercer ces droits ou pour toute question relative à notre politique de conformité, vous pouvez contacter notre équipe dédiée à l'adresse compliance@terex.sn ou par courrier à l'adresse du siège social de Terex Exchange, Dakar, Sénégal.",
        "Toute réclamation non résolue peut être adressée à la Commission des Données Personnelles (CDP) du Sénégal, autorité de contrôle compétente.",
      ],
    },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 900, margin: '0 auto', paddingBottom: 56 }}>

      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 12px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
          <ArrowLeft size={13} /> Conformité
        </button>
        <span style={{ color: C.t3, fontSize: 13 }}>/</span>
        <span style={{ color: C.t2, fontSize: 13 }}>Politique de conformité</span>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '32px 32px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <ShieldCheck size={16} color={C.t3} />
          <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Terex Exchange</span>
        </div>
        <h1 style={{ color: C.t1, fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 10px', lineHeight: 1.2 }}>
          Politique de conformité<br />
          <span style={{ color: C.t3, fontWeight: 400, fontSize: 18 }}>& Règlement intérieur KYC / LCB-FT</span>
        </h1>
        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          <div style={{ paddingRight: 24, borderRight: `1px solid ${C.bds}` }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>Dernière mise à jour</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t2 }}>15 janvier 2025</div>
          </div>
          <div style={{ paddingRight: 24, borderRight: `1px solid ${C.bds}` }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>Zone de couverture</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t2 }}>UEMOA / Zone OHADA</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>Version</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t2, fontFamily: MONO }}>v2.1</div>
          </div>
        </div>
      </div>

      {/* Sommaire */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px', marginBottom: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 12px' }}>Sommaire</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
          {sections.map((s, i) => (
            <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO, width: 18 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 12, color: C.t2 }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={C.t3} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 10, color: C.t3, fontFamily: MONO }}>{String(i + 1).padStart(2, '0')}</span>
                  <h2 style={sectionTitle}>{s.title}</h2>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 46 }}>
                {s.content.map((para, j) => (
                  <p key={j} style={body}>{para}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, padding: '16px 24px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: C.t3 }}>Des questions sur notre politique ? Contactez-nous à <strong style={{ color: C.t2 }}>compliance@terex.sn</strong></span>
        <button onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 14px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
          <ArrowLeft size={13} /> Retour à la conformité
        </button>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────

export function BusinessCompliance({ user: _user }: { user: { email: string; name: string; id?: string } | null }) {
  useAuth();

  const [subPage, setSubPage] = useState<SubPage>('main');
  const [docs, setDocs]       = useState<Doc[]>(INITIAL_DOCS);

  const handleSubmitDoc = (id: string) =>
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'submitted' } : d));

  if (subPage === 'limit-request')     return <LimitRequestPage onBack={() => setSubPage('main')} />;
  if (subPage === 'verify-next')       return <VerifyNextPage onBack={() => setSubPage('main')} docs={docs} onSubmit={handleSubmitDoc} />;
  if (subPage === 'compliance-policy') return <CompliancePolicyPage onBack={() => setSubPage('main')} />;

  const cardSt: React.CSSProperties = {
    background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden',
  };

  const level1 = docs.filter(d => d.level === 1);
  const level2 = docs.filter(d => d.level === 2);
  const l2Done = level2.filter(d => d.status !== 'required').length;

  const totalDone   = docs.filter(d => d.status === 'verified').length;
  const totalSubmit = docs.filter(d => d.status === 'submitted').length;
  const totalReq    = docs.filter(d => d.status === 'required').length;

  return (
    <div style={{ fontFamily: FONT, color: C.t1 }}>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* ══ COLONNE GAUCHE ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Héro */}
          <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '28px 28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
              <ShieldCheck size={15} color={C.t3} />
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Conformité KYC</span>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 6 }}>Limite mensuelle actuelle</div>
              <div style={{ fontSize: 38, fontWeight: 700, fontFamily: MONO, letterSpacing: '-0.04em', lineHeight: 1, color: C.t1 }}>
                5 000
                <span style={{ fontSize: 16, color: C.t3, fontWeight: 400, marginLeft: 8, letterSpacing: 0 }}>USDT/mois</span>
              </div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 6 }}>Niveau 1 — Basique</div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              <div style={{ paddingRight: 24, borderRight: `1px solid ${C.bds}` }}>
                <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>Vérifiés</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontFamily: MONO }}>{totalDone}</div>
              </div>
              <div style={{ paddingRight: 24, borderRight: `1px solid ${C.bds}` }}>
                <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>En cours</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.t2, fontFamily: MONO }}>{totalSubmit}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>En attente</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.t3, fontFamily: MONO }}>{totalReq}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSubPage('limit-request')}
                style={{ height: 36, paddingLeft: 16, paddingRight: 16, background: 'transparent', border: `1px solid ${C.bd}`, borderRadius: 9, color: C.t2, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; }}>
                <TrendingUp size={13} /> Augmenter la limite
              </button>
              <button onClick={() => setSubPage('verify-next')}
                style={{ height: 36, paddingLeft: 18, paddingRight: 18, background: C.teal, border: 'none', borderRadius: 9, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
                onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
                <ChevronRight size={13} /> Niveau suivant
              </button>
            </div>
          </div>

          {/* Niveau 1 — collapsé */}
          <div style={{ ...cardSt, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bd}` }}>
              <Check size={13} color={C.t2} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t2 }}>Niveau 1 — Identité personnelle</span>
              <span style={{ fontSize: 11, color: C.t3, marginLeft: 10 }}>{level1.length}/{level1.length} documents</span>
            </div>
            <span style={{ fontSize: 11, color: C.t3, fontWeight: 500 }}>Complété</span>
          </div>

          {/* Niveau 2 — actif */}
          <div style={cardSt}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Niveau 2 — Entité commerciale</span>
                <span style={{ fontSize: 11, color: C.t3, marginLeft: 10 }}>50 000 USDT/mois</span>
              </div>
              <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>{l2Done}/{level2.length}</span>
            </div>
            <div style={{ padding: '0 22px' }}>
              {level2.map(d => <DocItem key={d.id} doc={d} onSubmit={handleSubmitDoc} />)}
            </div>
          </div>

          {/* Niveau 3 — verrouillé */}
          <div style={{ ...cardSt, opacity: 0.45 }}>
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.l2, border: `1px solid ${C.bds}` }}>
                <Lock size={12} color={C.t3} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.t3 }}>Niveau 3 — Structure avancée</span>
                <span style={{ fontSize: 11, color: C.t3, marginLeft: 10 }}>200 000 USDT/mois</span>
              </div>
              <span style={{ fontSize: 11, color: C.t3 }}>Après Niveau 2</span>
            </div>
          </div>
        </div>

        {/* ══ COLONNE DROITE ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Progression — numéros au lieu de points */}
          <div style={cardSt}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Progression</span>
            </div>
            <div style={{ padding: '6px 0' }}>
              {LEVEL_INFO.map((lv, i) => {
                const done   = lv.state === 'done';
                const active = lv.state === 'active';
                const locked = lv.state === 'locked';
                return (
                  <div key={lv.n} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px', borderBottom: i < LEVEL_INFO.length - 1 ? `1px solid ${C.bds}` : 'none', opacity: locked ? 0.38 : 1 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(255,255,255,0.07)' : C.l2, border: `1px solid ${active ? C.bd : C.bds}` }}>
                      {done   && <Check size={12} color={C.t2} strokeWidth={2.5} />}
                      {!done  && <span style={{ fontSize: 11, fontWeight: 700, color: active ? C.t2 : C.t3, fontFamily: MONO }}>{lv.n}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: active ? 600 : 500, color: active ? C.t1 : C.t2 }}>
                        Niveau {lv.n} · {lv.label}
                      </div>
                      <div style={{ fontSize: 11, color: C.t3, marginTop: 1, fontFamily: MONO }}>{lv.limit}</div>
                    </div>
                    {active && <ChevronRight size={12} color={C.t3} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Limites */}
          <div style={cardSt}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Limites en vigueur</span>
            </div>
            <div style={{ padding: '6px 0' }}>
              {[
                { label: 'Par mois',        value: '5 000 USDT' },
                { label: 'Par transaction', value: '2 000 USDT' },
                { label: 'Prochain palier', value: '50 000 USDT' },
              ].map((r, i, arr) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.t1, fontFamily: MONO }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={cardSt}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Actions</span>
            </div>
            <div style={{ padding: '6px 0' }}>
              {[
                { icon: TrendingUp,  label: 'Augmenter la limite',     sub: 'Demande de relèvement',       action: () => setSubPage('limit-request') },
                { icon: FileText,    label: 'Historique des demandes', sub: 'Voir les soumissions passées', action: () => {} },
                { icon: ShieldCheck, label: 'Politique de conformité', sub: 'Règlement intérieur KYC',      action: () => setSubPage('compliance-policy') },
              ].map((a, i, arr) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={a.action}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: FONT, textAlign: 'left', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={13} color={C.t3} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.t1 }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>{a.sub}</div>
                    </div>
                    <ChevronRight size={12} color={C.t3} />
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Check size={13} color={C.t3} />
            <span style={{ fontSize: 12, color: C.t3 }}>Aucun document n'expire prochainement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
