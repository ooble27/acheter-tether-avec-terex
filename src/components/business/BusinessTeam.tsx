import { useState } from 'react';
import { Check, Mail, Pencil, ShieldCheck, Users, Clock, X, Plus, TrendingUp, FileText, ArrowRight } from 'lucide-react';

const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.10)', tealB: 'rgba(59,150,143,0.25)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

type Role = 'Propriétaire' | 'Administrateur' | 'Financier' | 'Comptable' | 'Opérateur';
type MemberStatus = 'active' | 'suspended';
type Tab = 'members' | 'invitations' | 'roles' | 'activity';

interface Member {
  id: string; name: string; email: string; role: Role;
  limit: string; lastActive: string; status: MemberStatus; joinedAt: string;
}
interface Invitation { id: string; email: string; role: Role; sentAgo: string; }

const SELECTABLE_ROLES: { id: Role; desc: string; icon: React.ElementType }[] = [
  { id: 'Administrateur', desc: 'Gère l\'équipe, paramètres et approuve tous les paiements', icon: ShieldCheck },
  { id: 'Financier',      desc: 'Crée et approuve les paiements dans sa limite mensuelle',   icon: TrendingUp  },
  { id: 'Comptable',      desc: 'Consultation de l\'historique et export des rapports',       icon: FileText    },
  { id: 'Opérateur',      desc: 'Crée des paiements qui nécessitent une approbation',         icon: ArrowRight  },
];

const ALL_ROLE_DEFS: { id: Role; desc: string; perms: string[] }[] = [
  { id: 'Propriétaire',   desc: 'Accès complet sans restriction. Seul à pouvoir fermer le compte.',       perms: ['Approuver tous les paiements', 'Gérer l\'équipe', 'Accès API', 'Paiements illimités'] },
  { id: 'Administrateur', desc: 'Gère l\'équipe et approuve tous les paiements sans limite de clôture.',  perms: ['Approuver tous les paiements', 'Gérer l\'équipe', 'Accès API', 'Exporter'] },
  { id: 'Financier',      desc: 'Crée et valide les paiements dans sa limite mensuelle définie.',          perms: ['Créer des paiements', 'Approuver < limite', 'Gérer fournisseurs', 'Exporter'] },
  { id: 'Comptable',      desc: 'Consultation de l\'historique et génération des rapports financiers.',    perms: ['Voir les transactions', 'Exporter les rapports'] },
  { id: 'Opérateur',      desc: 'Soumet des paiements pour validation par un Financier ou Admin.',         perms: ['Créer des paiements', 'Voir les transactions'] },
];

const PERMISSIONS: { label: string; owner: boolean; admin: boolean; financier: boolean; comptable: boolean; operateur: boolean }[] = [
  { label: 'Voir les transactions',   owner: true,  admin: true,  financier: true,  comptable: true,  operateur: true  },
  { label: 'Créer un paiement',       owner: true,  admin: true,  financier: true,  comptable: false, operateur: true  },
  { label: 'Approuver un paiement',   owner: true,  admin: true,  financier: true,  comptable: false, operateur: false },
  { label: 'Paiement > 10 000 USDT',  owner: true,  admin: true,  financier: false, comptable: false, operateur: false },
  { label: 'Gérer les fournisseurs',  owner: true,  admin: true,  financier: true,  comptable: false, operateur: false },
  { label: 'Gérer l\'équipe',         owner: true,  admin: true,  financier: false, comptable: false, operateur: false },
  { label: 'Exporter les rapports',   owner: true,  admin: true,  financier: true,  comptable: true,  operateur: false },
  { label: 'Accès API',               owner: true,  admin: true,  financier: false, comptable: false, operateur: false },
];

const ACTIVITY: { id: string; actor: string; action: string; time: string; day: string }[] = [
  { id: '1', actor: 'Fatou Ndiaye',   action: 'a envoyé 1 200 USDT à Shenzhen Electronics',   time: '10h34', day: "Aujourd'hui" },
  { id: '2', actor: 'Ahmed Diallo',   action: 'a ajouté un fournisseur : Lagos Imports Ltd',    time: '08h15', day: "Aujourd'hui" },
  { id: '3', actor: 'Mamadou Ba',     action: 'a soumis un paiement de 800 USDT (en attente)', time: '14h20', day: 'Hier' },
  { id: '4', actor: 'Fatou Ndiaye',   action: 'a exporté le rapport mensuel',                   time: '11h08', day: 'Hier' },
  { id: '5', actor: 'Ahmed Diallo',   action: 'a approuvé le paiement de 12 500 USDT',         time: '16h42', day: 'Il y a 2 jours' },
  { id: '6', actor: 'Mamadou Ba',     action: 'a modifié le fournisseur Dubai Trade Co.',       time: '09h55', day: 'Il y a 3 jours' },
  { id: '7', actor: 'Aïssatou Sow',   action: 'a téléchargé le rapport trimestriel',            time: '13h30', day: 'Il y a 4 jours' },
];
const ACTIVITY_DAYS = ["Aujourd'hui", 'Hier', 'Il y a 2 jours', 'Il y a 3 jours', 'Il y a 4 jours'];

const LIMIT_PRESETS = ['5 000', '10 000', '25 000', '50 000', 'Illimitée'];

const fieldBase: React.CSSProperties = {
  height: 38, width: '100%', background: C.l2, border: `1px solid ${C.bd}`,
  borderRadius: 8, padding: '0 12px', color: C.t1, fontSize: 13,
  outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
};

// ── Composants de base ──────────────────────────────────────────────

function TealBtn({ children, onClick, style, disabled }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; disabled?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? C.l3 : hov ? C.tealH : C.teal, color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FONT, transition: 'all 0.12s', ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{ background: hov ? C.l3 : 'rgba(255,255,255,0.04)', color: C.t2, border: `1px solid ${C.bds}`, borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const parts = (name || 'U').split(' ').filter(Boolean);
  const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 600, color: C.t2, flexShrink: 0, fontFamily: FONT }}>
      {initials}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 14px', fontFamily: FONT }}>
      {children}
    </p>
  );
}

function ModalWrap({ onClose, children, width = 500 }: { onClose: () => void; children: React.ReactNode; width?: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: 28, width, maxWidth: 'calc(100vw - 32px)', boxShadow: '0 28px 70px rgba(0,0,0,0.75)', fontFamily: FONT, maxHeight: '92vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <h3 style={{ color: C.t1, fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.12s' }}
        onMouseEnter={e => e.currentTarget.style.color = C.t1} onMouseLeave={e => e.currentTarget.style.color = C.t3}>
        <X size={16} />
      </button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10.5, color: C.t3, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{children}</p>;
}

// ── Carte visuelle de rôle ──────────────────────────────────────────

function RoleCard({ role, desc, icon: Icon, selected, onClick }: { role: Role; desc: string; icon: React.ElementType; selected: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px', borderRadius: 11, border: `1px solid ${selected ? C.teal : hov ? C.bd : C.bds}`, background: selected ? C.tealT : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.13s', fontFamily: FONT, width: '100%' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: selected ? C.tealB : 'rgba(255,255,255,0.06)', border: `1px solid ${selected ? C.tealB : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.13s', flexShrink: 0 }}>
        <Icon size={15} color={selected ? C.teal : C.t3} />
      </div>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: selected ? C.t1 : C.t2, marginBottom: 4 }}>{role}</div>
        <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.45 }}>{desc}</div>
      </div>
    </button>
  );
}

// ── Sélecteur de limite mensuelle ───────────────────────────────────

function LimitPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isPreset = LIMIT_PRESETS.includes(value);
  const [sel, setSel] = useState<string>(isPreset ? value : value ? 'custom' : 'Illimitée');
  const [customVal, setCustomVal] = useState(isPreset || !value ? '' : value);

  const pick = (p: string) => { setSel(p); onChange(p); };
  const goCustom = () => { setSel('custom'); onChange(customVal); };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: sel === 'custom' ? 10 : 0 }}>
        {LIMIT_PRESETS.map(p => (
          <button key={p} onClick={() => pick(p)}
            style={{ padding: '6px 13px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1px solid ${sel === p ? C.teal : C.bds}`, background: sel === p ? C.tealT : 'transparent', color: sel === p ? C.teal : C.t2, fontFamily: p === 'Illimitée' ? FONT : MONO, transition: 'all 0.12s', fontWeight: sel === p ? 600 : 400 }}>
            {p}
          </button>
        ))}
        <button onClick={goCustom}
          style={{ padding: '6px 13px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1px solid ${sel === 'custom' ? C.teal : C.bds}`, background: sel === 'custom' ? C.tealT : 'transparent', color: sel === 'custom' ? C.teal : C.t2, fontFamily: FONT, transition: 'all 0.12s', fontWeight: sel === 'custom' ? 600 : 400 }}>
          Personnalisé
        </button>
      </div>
      {sel === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input value={customVal} onChange={e => { setCustomVal(e.target.value); onChange(e.target.value); }}
            placeholder="Ex : 15 000" type="number"
            style={{ ...fieldBase, fontFamily: MONO, flex: 1 }} />
          <span style={{ fontSize: 12, color: C.t3, flexShrink: 0 }}>USDT / mois</span>
        </div>
      )}
    </div>
  );
}

// ── Indicateur de progression ───────────────────────────────────────

function StepBar({ step }: { step: 1 | 2 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 28 }}>
      {[{ n: 1, label: 'Identité' }, { n: 2, label: 'Rôle & Accès' }].map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s.n ? C.teal : C.l2, border: `1px solid ${step >= s.n ? C.teal : C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: step >= s.n ? '#fff' : C.t3, transition: 'all 0.2s' }}>
              {step > s.n ? <Check size={13} strokeWidth={3} /> : s.n}
            </div>
            <span style={{ fontSize: 10.5, color: step === s.n ? C.t2 : C.t3, fontWeight: 600 }}>{s.label}</span>
          </div>
          {i === 0 && (
            <div style={{ width: 72, height: 1, background: step >= 2 ? C.teal : C.bds, marginTop: 14, transition: 'background 0.25s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Carte membre ────────────────────────────────────────────────────

function MemberCard({ member, onEdit, onToggle }: { member: Member; onEdit: () => void; onToggle: () => void }) {
  const [hov, setHov] = useState(false);
  const isOwner = member.role === 'Propriétaire';
  const isSuspended = member.status === 'suspended';
  return (
    <div style={{ background: C.l1, border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar name={member.name} size={46} />
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: isSuspended ? C.t3 : C.teal, border: `2px solid ${C.l1}` }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: isSuspended ? C.t3 : C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</div>
          <div style={{ fontSize: 11.5, color: C.t3, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</div>
          <div style={{ fontSize: 12, fontWeight: isOwner ? 600 : 500, color: isOwner ? C.teal : C.t2, marginTop: 7 }}>{member.role}</div>
        </div>
        {isSuspended && (
          <div style={{ fontSize: 10, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 6, padding: '3px 8px', flexShrink: 0 }}>Suspendu</div>
        )}
      </div>
      <div style={{ display: 'flex', padding: '12px 0', borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}`, marginBottom: 14 }}>
        {[{ lbl: 'Limite', val: member.limit }, { lbl: 'Dernière activité', val: member.lastActive }, { lbl: 'Depuis', val: member.joinedAt }].map((s, i) => (
          <div key={i} style={{ flex: 1, paddingLeft: i > 0 ? 14 : 0, borderLeft: i > 0 ? `1px solid ${C.bds}` : 'none' }}>
            <div style={{ fontSize: 9.5, color: C.t3, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 4 }}>{s.lbl}</div>
            <div style={{ fontSize: 11.5, color: C.t2, fontFamily: i === 0 ? MONO : FONT }}>{s.val}</div>
          </div>
        ))}
      </div>
      {isOwner ? (
        <div style={{ fontSize: 11, color: C.t3, textAlign: 'center', padding: '4px 0' }}>Propriétaire du compte</div>
      ) : (
        <div style={{ display: 'flex', gap: 7 }}>
          <button onClick={onEdit} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', borderRadius: 8, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t2, fontSize: 12, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
            <Pencil size={11} /> Modifier
          </button>
          <button onClick={onToggle} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t3, fontSize: 12, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = isSuspended ? C.teal : C.red; e.currentTarget.style.color = isSuspended ? C.teal : C.red; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
            {isSuspended ? 'Réactiver' : 'Suspendre'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Modal invitation — 2 étapes ─────────────────────────────────────

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (inv: Invitation) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<Role>('Financier');
  const [limit, setLimit] = useState('Illimitée');
  const [message, setMessage] = useState('');

  const displayName = [firstName, lastName].filter(Boolean).join(' ');
  const canStep1 = email.includes('@') && firstName.trim().length > 0;

  const handleSubmit = () => {
    if (!canStep1) return;
    onInvite({ id: Date.now().toString(), email: email.trim(), role, sentAgo: "À l'instant" });
    onClose();
  };

  return (
    <ModalWrap onClose={onClose}>
      <ModalHeader title="Inviter un membre" onClose={onClose} />
      <StepBar step={step} />

      {step === 1 && (
        <>
          {/* Avatar dynamique */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, gap: 8 }}>
            <Avatar name={displayName || '?'} size={72} />
            <span style={{ fontSize: 13, color: displayName ? C.t1 : C.t3, fontWeight: displayName ? 600 : 400, transition: 'color 0.15s' }}>
              {displayName || 'Renseignez le prénom'}
            </span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <FieldLabel>Adresse email *</FieldLabel>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@entreprise.com" type="email" style={fieldBase} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
            <div style={{ flex: 1 }}>
              <FieldLabel>Prénom *</FieldLabel>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" style={fieldBase} />
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>Nom</FieldLabel>
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" style={fieldBase} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <GhostBtn onClick={onClose} style={{ flex: 1 }}>Annuler</GhostBtn>
            <TealBtn onClick={() => setStep(2)} disabled={!canStep1} style={{ flex: 1 }}>
              Suivant →
            </TealBtn>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {/* Récap identité */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, marginBottom: 22 }}>
            <Avatar name={displayName || email} size={38} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{displayName || email}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{email}</div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Rôle attribué</FieldLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SELECTABLE_ROLES.map(r => (
                <RoleCard key={r.id} role={r.id} desc={r.desc} icon={r.icon} selected={role === r.id} onClick={() => setRole(r.id)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Limite mensuelle</FieldLabel>
            <LimitPicker value={limit} onChange={setLimit} />
          </div>

          <div style={{ marginBottom: 22 }}>
            <FieldLabel>Message d'accueil (optionnel)</FieldLabel>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Bienvenue dans l'équipe…" rows={2}
              style={{ ...fieldBase, height: 'auto', padding: '10px 12px', resize: 'none', lineHeight: 1.5, boxSizing: 'border-box', width: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <GhostBtn onClick={() => setStep(1)} style={{ flex: 1 }}>← Retour</GhostBtn>
            <TealBtn onClick={handleSubmit} style={{ flex: 1 }}>Envoyer l'invitation</TealBtn>
          </div>
        </>
      )}
    </ModalWrap>
  );
}

// ── Modal édition membre ────────────────────────────────────────────

function EditModal({ member, onClose, onSave }: { member: Member; onClose: () => void; onSave: (id: string, role: Role, limit: string) => void }) {
  const [role, setRole] = useState<Role>(member.role === 'Propriétaire' ? 'Administrateur' : member.role);
  const initLimit = () => {
    const l = member.limit;
    if (!l || l === '—' || l === 'Illimitée') return 'Illimitée';
    const clean = l.replace(/\s*USDT\/mois$/, '').trim();
    return LIMIT_PRESETS.includes(clean) ? clean : clean;
  };
  const [limit, setLimit] = useState(initLimit());

  const handleSave = () => {
    const out = !limit || limit === 'Illimitée' ? 'Illimitée' : LIMIT_PRESETS.includes(limit) ? `${limit} USDT/mois` : `${limit} USDT/mois`;
    onSave(member.id, role, out);
    onClose();
  };

  return (
    <ModalWrap onClose={onClose}>
      <ModalHeader title="Modifier les accès" onClose={onClose} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, marginBottom: 22 }}>
        <div style={{ position: 'relative' }}>
          <Avatar name={member.name} size={42} />
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: member.status === 'active' ? C.teal : C.t3, border: `2px solid ${C.l2}` }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{member.name}</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{member.email} · Membre depuis {member.joinedAt}</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Nouveau rôle</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SELECTABLE_ROLES.map(r => (
            <RoleCard key={r.id} role={r.id} desc={r.desc} icon={r.icon} selected={role === r.id} onClick={() => setRole(r.id)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <FieldLabel>Limite mensuelle</FieldLabel>
        <LimitPicker value={limit} onChange={setLimit} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <GhostBtn onClick={onClose} style={{ flex: 1 }}>Annuler</GhostBtn>
        <TealBtn onClick={handleSave} style={{ flex: 1 }}>Enregistrer</TealBtn>
      </div>
    </ModalWrap>
  );
}

// ── Modal modification d'invitation ────────────────────────────────

function EditInviteModal({ invitation, onSave, onClose }: { invitation: Invitation; onSave: (id: string, role: Role) => void; onClose: () => void }) {
  const [role, setRole] = useState<Role>(invitation.role);
  return (
    <ModalWrap onClose={onClose} width={480}>
      <ModalHeader title="Modifier l'invitation" onClose={onClose} />
      <div style={{ padding: '10px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 9, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: C.t2 }}>{invitation.email}</div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{invitation.sentAgo}</div>
      </div>
      <div style={{ marginBottom: 22 }}>
        <FieldLabel>Nouveau rôle</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SELECTABLE_ROLES.map(r => (
            <RoleCard key={r.id} role={r.id} desc={r.desc} icon={r.icon} selected={role === r.id} onClick={() => setRole(r.id)} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <GhostBtn onClick={onClose} style={{ flex: 1 }}>Annuler</GhostBtn>
        <TealBtn onClick={() => { onSave(invitation.id, role); onClose(); }} style={{ flex: 1 }}>Enregistrer</TealBtn>
      </div>
    </ModalWrap>
  );
}

// ── Composant principal ─────────────────────────────────────────────

export function BusinessTeam({ user }: { user: { email: string; name: string; id?: string } | null }) {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [showInvite, setShowInvite] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: 'm1', name: 'Ahmed Diallo',   email: 'ahmed@terex.io',    role: 'Propriétaire',   limit: 'Illimitée',           lastActive: "Aujourd'hui", status: 'active',    joinedAt: 'Jan 2024' },
    { id: 'm2', name: 'Fatou Ndiaye',   email: 'fatou@terex.io',    role: 'Administrateur', limit: 'Illimitée',           lastActive: 'Il y a 2h',   status: 'active',    joinedAt: 'Mar 2024' },
    { id: 'm3', name: 'Mamadou Ba',     email: 'mamadou@terex.io',  role: 'Financier',      limit: '10 000 USDT/mois',   lastActive: 'Il y a 3j',   status: 'active',    joinedAt: 'Juin 2024' },
    { id: 'm4', name: 'Aïssatou Sow',   email: 'aissatou@terex.io', role: 'Comptable',      limit: 'Illimitée',           lastActive: 'Il y a 1sem', status: 'active',    joinedAt: 'Nov 2024' },
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: 'inv1', email: 'hassan@export.ma',  role: 'Financier',  sentAgo: 'Envoyée il y a 2j' },
    { id: 'inv2', email: 'amina@trade.tn',    role: 'Opérateur',  sentAgo: 'Envoyée il y a 5j' },
  ]);

  const handleSaveEdit = (id: string, role: Role, limit: string) =>
    setMembers(ms => ms.map(m => m.id === id ? { ...m, role, limit } : m));

  const handleToggle = (id: string) =>
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m));

  const handleInvite = (inv: Invitation) => setInvitations(i => [...i, inv]);
  const cancelInvitation = (id: string) => setInvitations(i => i.filter(x => x.id !== id));
  const updateInvitationRole = (id: string, role: Role) =>
    setInvitations(i => i.map(x => x.id === id ? { ...x, role } : x));

  const activeCount = members.filter(m => m.status === 'active').length;

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'members',     label: 'Membres',     icon: Users },
    { id: 'invitations', label: 'Invitations', icon: Mail,  count: invitations.length },
    { id: 'roles',       label: 'Rôles',       icon: ShieldCheck },
    { id: 'activity',    label: 'Activité',    icon: Clock },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', padding: '0 0 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Modals */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
      {editingMember && <EditModal member={editingMember} onClose={() => setEditingMember(null)} onSave={handleSaveEdit} />}
      {editingInvitation && <EditInviteModal invitation={editingInvitation} onSave={updateInvitationRole} onClose={() => setEditingInvitation(null)} />}

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '26px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: C.t1, fontSize: 21, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Équipe & Accès</h2>
            <p style={{ color: C.t3, fontSize: 12, margin: '5px 0 18px' }}>Gérez les membres, rôles et accès de votre organisation</p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Membres actifs', value: activeCount },
                { label: 'Rôles disponibles', value: 5 },
                { label: 'Invitations en attente', value: invitations.length },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: C.t1, fontFamily: MONO, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: C.t3 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <TealBtn onClick={() => setShowInvite(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Plus size={14} /> Inviter un membre
          </TealBtn>
        </div>
      </div>

      {/* ── Barre d'onglets ──────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: C.l2, borderRadius: 12, border: `1px solid ${C.bds}` }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', background: isActive ? C.l3 : 'transparent', color: isActive ? C.t1 : C.t3, fontSize: 12.5, fontWeight: isActive ? 600 : 400, fontFamily: FONT, transition: 'all 0.12s' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.t2; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.t3; }}>
              <Icon size={13} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10, padding: '1px 6px', fontSize: 10, color: C.t3 }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── MEMBRES ─────────────────────────────────────────── */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 14 }}>
          {members.map(m => (
            <MemberCard key={m.id} member={m} onEdit={() => setEditingMember(m)} onToggle={() => handleToggle(m.id)} />
          ))}
          <button onClick={() => setShowInvite(true)}
            style={{ background: 'transparent', border: `1px dashed ${C.bds}`, borderRadius: 14, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: C.t3, fontSize: 13, fontFamily: FONT, transition: 'all 0.15s', minHeight: 160 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px dashed currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={18} />
            </div>
            Inviter un nouveau membre
          </button>
        </div>
      )}

      {/* ── INVITATIONS ─────────────────────────────────────── */}
      {activeTab === 'invitations' && (
        <div>
          {invitations.length === 0 ? (
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={20} color={C.t3} />
              </div>
              <p style={{ color: C.t3, fontSize: 13, margin: '0 0 16px' }}>Aucune invitation en attente</p>
              <TealBtn onClick={() => setShowInvite(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Plus size={13} /> Inviter un membre
              </TealBtn>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {invitations.map(inv => (
                <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={17} color={C.t3} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.t1, marginBottom: 3 }}>{inv.email}</div>
                    <div style={{ fontSize: 11, color: C.t3 }}>{inv.role} · {inv.sentAgo}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditingInvitation(inv)}
                      style={{ padding: '5px 11px', borderRadius: 7, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t2, fontSize: 11.5, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', display: 'flex', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
                      <Pencil size={11} /> Modifier
                    </button>
                    <button style={{ padding: '5px 11px', borderRadius: 7, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t2, fontSize: 11.5, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
                      Renvoyer
                    </button>
                    <button onClick={() => cancelInvitation(inv.id)}
                      style={{ padding: '5px 8px', borderRadius: 7, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t3, fontSize: 11.5, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.12s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RÔLES ───────────────────────────────────────────── */}
      {activeTab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 12 }}>
            {ALL_ROLE_DEFS.map(r => {
              const memberCount = members.filter(m => m.role === r.id).length;
              return (
                <div key={r.id} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: r.id === 'Propriétaire' ? C.teal : C.t1 }}>{r.id}</div>
                    <div style={{ fontSize: 10.5, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 7, padding: '2px 8px', flexShrink: 0, marginLeft: 8 }}>
                      {memberCount} {memberCount <= 1 ? 'membre' : 'membres'}
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.t3, lineHeight: 1.5, marginBottom: 12 }}>{r.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {r.perms.map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: C.t2 }}>
                        <Check size={10} color={C.teal} strokeWidth={3} style={{ flexShrink: 0 }} /> {p}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: 22 }}>
            <Label>Matrice complète des permissions</Label>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.t3, width: '30%' }}>Permission</th>
                    {['Propriétaire', 'Administrateur', 'Financier', 'Comptable', 'Opérateur'].map(r => (
                      <th key={r} style={{ padding: '8px 10px', textAlign: 'center', fontSize: 10.5, fontWeight: 600, color: r === 'Propriétaire' ? C.teal : C.t3, whiteSpace: 'nowrap' }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map((p, i) => (
                    <tr key={i} style={{ borderBottom: i < PERMISSIONS.length - 1 ? `1px solid ${C.bds}` : 'none', background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      <td style={{ padding: '11px 14px', fontSize: 12.5, color: C.t1 }}>{p.label}</td>
                      {[p.owner, p.admin, p.financier, p.comptable, p.operateur].map((v, j) => (
                        <td key={j} style={{ padding: '11px 10px', textAlign: 'center' }}>
                          {v ? <Check size={14} color={C.teal} strokeWidth={3} style={{ display: 'inline-block' }} /> : <span style={{ fontSize: 16, color: C.t3, lineHeight: 1 }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVITÉ ────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: 22 }}>
          <Label>Journal d'activité</Label>
          {ACTIVITY_DAYS.map(day => {
            const entries = ACTIVITY.filter(e => e.day === day);
            if (entries.length === 0) return null;
            return (
              <div key={day} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, color: C.t3, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>{day}</span>
                  <div style={{ flex: 1, height: 1, background: C.bds }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {entries.map((ev, i) => (
                    <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < entries.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                      <Avatar name={ev.actor} size={34} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{ev.actor}</span>
                        <span style={{ fontSize: 13, color: C.t2 }}> {ev.action}</span>
                      </div>
                      <span style={{ fontSize: 11, color: C.t3, flexShrink: 0, fontFamily: MONO }}>{ev.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
