import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Check, X, Upload, ArrowLeft, ChevronRight, ShieldCheck,
  FileText, TrendingUp, Clock, AlertCircle, Plus, Send, Lock,
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
type SubPage   = 'main' | 'limit-request' | 'history';

interface Doc { id: string; name: string; desc: string; status: DocStatus; level: 1 | 2 | 3; }

const LEVEL_INFO = [
  { n: 1, label: 'Basique',   limit: '5 000 USDT/mois',    state: 'done'   as const },
  { n: 2, label: 'Vérifié',  limit: '50 000 USDT/mois',   state: 'active' as const },
  { n: 3, label: 'Avancé',   limit: '200 000 USDT/mois',  state: 'locked' as const },
  { n: 4, label: 'Premium',  limit: 'Illimitée',           state: 'locked' as const },
];

const INITIAL_DOCS: Doc[] = [
  { id: 'rccm',    name: 'RCCM / Registre de Commerce', desc: 'Registre du Commerce et du Crédit Mobilier', status: 'verified',  level: 1 },
  { id: 'nif',     name: 'NIF / Identifiant fiscal',     desc: "Numéro d'Identification Fiscale",           status: 'verified',  level: 1 },
  { id: 'cni',     name: 'CNI ou Passeport dirigeant',   desc: "Pièce d'identité en cours de validité",    status: 'submitted', level: 2 },
  { id: 'domicile',name: 'Attestation de résidence',     desc: 'Moins de 3 mois, au nom du dirigeant',     status: 'required',  level: 2 },
  { id: 'statuts', name: 'Statuts de la société',        desc: 'Version signée, à jour',                   status: 'required',  level: 3 },
  { id: 'rapport', name: 'Rapport financier annuel',     desc: 'Dernier exercice clos certifié',            status: 'required',  level: 3 },
  { id: 'contrat', name: 'Contrat cadre Terex signé',   desc: 'Document fourni et signé par les deux parties', status: 'required', level: 3 },
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

// ── Ligne de document — badges neutres, teal uniquement sur hover ─────

function DocItem({ doc, onSubmit }: { doc: Doc; onSubmit: (id: string) => void }) {
  const [modal, setModal] = useState(false);

  const ST: Record<DocStatus, { label: string; color: string; bg: string; border: string; iconColor: string }> = {
    required:  { label: 'Requis',          color: C.t3,  bg: 'rgba(255,255,255,0.04)', border: C.bds, iconColor: C.t3 },
    submitted: { label: 'En vérification', color: C.t2,  bg: 'rgba(255,255,255,0.06)', border: C.bd,  iconColor: C.t3 },
    verified:  { label: 'Approuvé',        color: C.t2,  bg: 'rgba(255,255,255,0.06)', border: C.bd,  iconColor: C.t2 },
    expired:   { label: 'Expiré',          color: C.red, bg: C.redT,                   border: C.redB, iconColor: C.red },
  };
  const s = ST[doc.status];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: `1px solid ${C.bds}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, border: `1px solid ${s.border}` }}>
          {doc.status === 'verified'  && <Check size={14} color={s.iconColor} strokeWidth={2.5} />}
          {doc.status === 'submitted' && <Clock size={13} color={s.iconColor} />}
          {doc.status === 'required'  && <FileText size={13} color={s.iconColor} />}
          {doc.status === 'expired'   && <AlertCircle size={13} color={s.iconColor} />}
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
    fontFamily: FONT, boxSizing: 'border-box', transition: 'border-color 0.14s',
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

      {/* En-tête simple — pas de carte héro */}
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
            Augmentation de limite
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <GhostBtn onClick={onBack}>Annuler</GhostBtn>
          {!sent && (
            <button onClick={() => { if (canSend) setSent(true); }} disabled={!canSend}
              style={{ height: 38, paddingLeft: 18, paddingRight: 18, background: canSend ? C.teal : C.l3, color: canSend ? '#fff' : C.t3, border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: canSend ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 7, fontFamily: FONT, transition: 'background 0.14s' }}>
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

          {/* Colonne gauche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Limite souhaitée */}
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

            {/* Activité */}
            <div style={card}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 16px' }}>Activité</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={lbl}>Secteur d'activité</label>
                  <input value={sector} onChange={e => setSector(e.target.value)} placeholder="Import/export, Commerce de gros, Négoce international…" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Justification</label>
                  <textarea value={justification} onChange={e => setJust(e.target.value)}
                    placeholder="Décrivez votre activité et la raison de cette demande. Minimum 20 caractères."
                    rows={5} style={{ ...inp, resize: 'none', lineHeight: 1.6 }} />
                  <div style={{ textAlign: 'right', fontSize: 10, color: justification.length > 20 ? C.t3 : C.t3, marginTop: 4 }}>
                    {justification.length} / 20 min
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Situation actuelle */}
            <div style={card}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 4px' }}>Situation actuelle</p>
              {[
                { label: 'Niveau',               value: 'Niveau 1 — Basique' },
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

            {/* Processus de validation — neutre, pas teal */}
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

            {/* Documents complémentaires */}
            <div style={card}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 10px' }}>Documents complémentaires</p>
              <p style={{ color: C.t3, fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>
                Des justificatifs pourront être demandés après examen de votre dossier.
              </p>
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

// ── Composant principal ───────────────────────────────────────────────

export function BusinessCompliance({ user: _user }: { user: { email: string; name: string; id?: string } | null }) {
  useAuth();

  const [subPage, setSubPage] = useState<SubPage>('main');
  const [docs, setDocs]       = useState<Doc[]>(INITIAL_DOCS);

  const handleSubmitDoc = (id: string) =>
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'submitted' } : d));

  if (subPage === 'limit-request') {
    return <LimitRequestPage onBack={() => setSubPage('main')} />;
  }

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

          {/* Héro — limite & statut */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)',
            border: `1px solid ${C.bds}`, borderRadius: 16, padding: '28px 28px 24px',
          }}>
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

            {/* Stats — tout neutre */}
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
              <button
                style={{ height: 36, paddingLeft: 18, paddingRight: 18, background: C.teal, border: 'none', borderRadius: 9, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.tealH)}
                onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
                <ChevronRight size={13} /> Niveau suivant
              </button>
            </div>
          </div>

          {/* Niveau 1 — collapsé, résumé simple */}
          <div style={{ ...cardSt, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bd}` }}>
              <Check size={13} color={C.t2} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t2 }}>Niveau 1 — Identité entreprise</span>
              <span style={{ fontSize: 11, color: C.t3, marginLeft: 10 }}>{level1.length}/{level1.length} documents</span>
            </div>
            <span style={{ fontSize: 11, color: C.t3, fontWeight: 500 }}>Complété</span>
          </div>

          {/* Niveau 2 — actif, pleinement affiché */}
          <div style={cardSt}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Niveau 2 — Dirigeant</span>
                <span style={{ fontSize: 11, color: C.t3, marginLeft: 10 }}>50 000 USDT/mois</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ height: 3, width: 64, background: C.l3, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((l2Done / level2.length) * 100)}%`, background: C.teal, borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
                <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>{l2Done}/{level2.length}</span>
              </div>
            </div>
            <div style={{ padding: '0 22px' }}>
              {level2.map(d => <DocItem key={d.id} doc={d} onSubmit={handleSubmitDoc} />)}
            </div>
          </div>

          {/* Niveau 3 — verrouillé, sans documents */}
          <div style={{ ...cardSt, opacity: 0.5 }}>
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

          {/* Progression niveaux — timeline verticale épurée */}
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
                  <div key={lv.n} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px', borderBottom: i < LEVEL_INFO.length - 1 ? `1px solid ${C.bds}` : 'none', opacity: locked ? 0.4 : 1 }}>
                    {/* Indicateur */}
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(255,255,255,0.07)' : C.l2, border: `1px solid ${active ? C.bd : C.bds}` }}>
                      {done   && <Check size={12} color={C.t2} strokeWidth={2.5} />}
                      {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal }} />}
                      {locked && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.t3 }} />}
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

          {/* Limites en vigueur */}
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
                { icon: TrendingUp,   label: 'Augmenter la limite',     sub: 'Demande de relèvement',     action: () => setSubPage('limit-request') },
                { icon: FileText,     label: 'Historique des demandes', sub: 'Voir les soumissions passées', action: () => {} },
                { icon: ShieldCheck,  label: 'Politique de conformité', sub: 'Règlement intérieur KYC',   action: () => {} },
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

          {/* Aucune expiration */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Check size={13} color={C.t3} />
            <span style={{ fontSize: 12, color: C.t3 }}>Aucun document n'expire prochainement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
