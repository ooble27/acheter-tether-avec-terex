import { useState } from 'react';
import { X, Check } from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────
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
const MONO = '"JetBrains Mono", Consolas, monospace';

// ── Types ──────────────────────────────────────────────────────────
type Role = 'Propriétaire' | 'Admin' | 'Finance' | 'Observateur';
type MemberStatus = 'active' | 'suspended';

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  limit: string;
  lastActive: string;
  status: MemberStatus;
}

interface Invitation {
  id: string;
  email: string;
  role: Role;
  sentAgo: string;
}

// ── Role config ───────────────────────────────────────────────────
const ROLE_COLORS: Record<Role, { color: string; bg: string; border: string }> = {
  'Propriétaire': { color: C.purple, bg: C.purpleT, border: C.purpleB },
  'Admin': { color: C.amber, bg: C.amberT, border: C.amberB },
  'Finance': { color: C.blue, bg: C.blueT, border: C.blueB },
  'Observateur': { color: C.t3, bg: C.l3, border: C.bds },
};
const ALL_ROLES: Role[] = ['Propriétaire', 'Admin', 'Finance', 'Observateur'];

// ── Helpers ────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12,
      padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.08em',
      textTransform: 'uppercase', fontFamily: FONT, marginBottom: 12,
    }}>{children}</div>
  );
}

function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const colors = [C.teal, C.amber, C.blue, C.purple, C.red];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: colors[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: FONT,
    }}>{name.charAt(0).toUpperCase()}</div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const rc = ROLE_COLORS[role];
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
      background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`,
    }}>{role}</span>
  );
}

function TealBtn({ children, onClick, style, disabled }: {
  children: React.ReactNode; onClick?: () => void;
  style?: React.CSSProperties; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.l3 : hov ? C.tealH : C.teal,
      color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 8,
      padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: FONT, transition: 'all 0.12s', ...style,
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} style={{
      background: hov ? C.l3 : 'transparent', color: C.t2,
      border: `1px solid ${C.bd}`, borderRadius: 8,
      padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
      fontFamily: FONT, transition: 'all 0.12s', ...style,
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{children}</button>
  );
}

function Input({ value, onChange, placeholder, style, type }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  style?: React.CSSProperties; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type || 'text'} value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: C.l2,
        border: `1px solid ${focused ? 'rgba(59,150,143,0.35)' : C.bd}`,
        borderRadius: 8, padding: '10px 14px', color: C.t1,
        fontSize: 14, outline: 'none', fontFamily: FONT,
        boxSizing: 'border-box', transition: 'border-color 0.12s', ...style,
      }}
    />
  );
}

// ── Invite Modal ──────────────────────────────────────────────────
function InviteModal({ onClose, onInvite }: {
  onClose: () => void;
  onInvite: (inv: Invitation) => void;
}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<Role>('Finance');
  const [limit, setLimit] = useState('');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);

  const canSubmit = email.trim() && firstName.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onInvite({ id: Date.now().toString(), email, role, sentAgo: "À l'instant" });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: FONT,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12,
        padding: 28, width: 440, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>Inviter un membre</div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 4,
          }}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <SectionTitle>Email</SectionTitle>
            <Input value={email} onChange={setEmail} placeholder="contact@entreprise.com" type="email" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <SectionTitle>Prénom</SectionTitle>
              <Input value={firstName} onChange={setFirstName} placeholder="Prénom" />
            </div>
            <div style={{ flex: 1 }}>
              <SectionTitle>Nom</SectionTitle>
              <Input value={lastName} onChange={setLastName} placeholder="Nom" />
            </div>
          </div>

          <div>
            <SectionTitle>Rôle</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ALL_ROLES.filter(r => r !== 'Propriétaire').map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  border: `1px solid ${role === r ? ROLE_COLORS[r].border : C.bd}`,
                  background: role === r ? ROLE_COLORS[r].bg : C.l2,
                  color: role === r ? ROLE_COLORS[r].color : C.t2,
                  fontFamily: FONT, transition: 'all 0.12s',
                }}>{r}</button>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle>Limite d'envoi personnalisée (USDT/mois)</SectionTitle>
            <Input value={limit} onChange={setLimit} placeholder="Ex: 10000" type="number" />
          </div>

          <div>
            <SectionTitle>Message personnalisé (optionnel)</SectionTitle>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Un message d'accueil..."
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '100%', background: C.l2, minHeight: 72,
                border: `1px solid ${focused ? 'rgba(59,150,143,0.35)' : C.bd}`,
                borderRadius: 8, padding: '10px 14px', color: C.t1, fontSize: 14,
                outline: 'none', fontFamily: FONT, resize: 'vertical',
                boxSizing: 'border-box', transition: 'border-color 0.12s',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <GhostBtn onClick={onClose}>Annuler</GhostBtn>
            <TealBtn onClick={handleSubmit} disabled={!canSubmit}>
              Envoyer l'invitation
            </TealBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Edit Role Modal ────────────────────────────────────────────────
function EditModal({ member, onClose, onSave }: {
  member: Member;
  onClose: () => void;
  onSave: (id: string, role: Role, limit: string) => void;
}) {
  const [role, setRole] = useState<Role>(member.role);
  const [limit, setLimit] = useState(member.limit);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: FONT,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12,
        padding: 28, width: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>Modifier le rôle</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: C.l2, borderRadius: 8 }}>
          <Avatar name={member.name} size={32} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{member.name}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>{member.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <SectionTitle>Rôle</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ALL_ROLES.filter(r => r !== 'Propriétaire').map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  border: `1px solid ${role === r ? ROLE_COLORS[r].border : C.bd}`,
                  background: role === r ? ROLE_COLORS[r].bg : C.l2,
                  color: role === r ? ROLE_COLORS[r].color : C.t2,
                  fontFamily: FONT, transition: 'all 0.12s',
                }}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle>Limite d'envoi (USDT/mois)</SectionTitle>
            <Input value={limit} onChange={setLimit} placeholder="Ex: 10000 ou Illimitée" />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <GhostBtn onClick={onClose}>Annuler</GhostBtn>
            <TealBtn onClick={() => { onSave(member.id, role, limit); onClose(); }}>
              Enregistrer
            </TealBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Permission matrix ─────────────────────────────────────────────
const PERMISSIONS = [
  { label: 'Voir les transactions', owner: true, admin: true, finance: true, observer: true },
  { label: 'Envoyer < 2 000 USDT', owner: true, admin: true, finance: true, observer: false },
  { label: 'Envoyer < 50 000 USDT', owner: true, admin: true, finance: false, observer: false },
  { label: 'Envoyer > 50 000 USDT', owner: true, admin: false, finance: false, observer: false },
  { label: 'Gérer les fournisseurs', owner: true, admin: true, finance: true, observer: false },
  { label: 'Gérer l\'équipe', owner: true, admin: true, finance: false, observer: false },
  { label: 'Accès API', owner: true, admin: true, finance: false, observer: false },
  { label: 'KYC & Documents', owner: true, admin: true, finance: false, observer: false },
];

// ── Activity log ───────────────────────────────────────────────────
const ACTIVITY_LOG = [
  { id: 'al1', actor: 'Fatou Ndiaye', action: 'a envoyé 1,200 USDT à Shenzhen Electronics', time: 'Il y a 2h', color: C.teal },
  { id: 'al2', actor: 'Ahmed Diallo', action: 'a ajouté un fournisseur', time: 'Il y a 5h', color: C.amber },
  { id: 'al3', actor: 'Mamadou Ba', action: 'a soumis un paiement de 800 USDT', time: 'Il y a 1j', color: C.blue },
  { id: 'al4', actor: 'Fatou Ndiaye', action: 'a exporté le rapport mensuel', time: 'Il y a 1j', color: C.teal },
  { id: 'al5', actor: 'Ahmed Diallo', action: 'a approuvé le paiement de 12,500 USDT', time: 'Il y a 2j', color: C.em },
  { id: 'al6', actor: 'Mamadou Ba', action: 'a modifié un fournisseur : Dubai Trade Co.', time: 'Il y a 3j', color: C.blue },
  { id: 'al7', actor: 'Fatou Ndiaye', action: 'a créé un paiement récurrent mensuel', time: 'Il y a 4j', color: C.teal },
  { id: 'al8', actor: 'Ahmed Diallo', action: 'a mis à jour les paramètres du compte', time: 'Il y a 5j', color: C.amber },
];

// ── Main component ─────────────────────────────────────────────────
export function BusinessTeam({ user }: {
  user: { email: string; name: string; id?: string } | null;
}) {
  const [members, setMembers] = useState<Member[]>([
    { id: 'm1', name: 'Ahmed Diallo', email: 'ahmed@terex.io', role: 'Propriétaire', limit: 'Illimitée', lastActive: "Aujourd'hui", status: 'active' },
    { id: 'm2', name: 'Fatou Ndiaye', email: 'fatou@terex.io', role: 'Admin', limit: '50,000 USDT/mois', lastActive: 'Il y a 2h', status: 'active' },
    { id: 'm3', name: 'Mamadou Ba', email: 'mamadou@terex.io', role: 'Finance', limit: '2,000 USDT/mois', lastActive: 'Il y a 3j', status: 'active' },
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: 'inv1', email: 'contact@fournisseur.com', role: 'Finance', sentAgo: 'Envoyée il y a 2j' },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const handleSuspend = (id: string) => {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m));
  };

  const handleSaveEdit = (id: string, role: Role, limit: string) => {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, role, limit } : m));
  };

  const handleInvite = (inv: Invitation) => {
    setInvitations(i => [...i, inv]);
  };

  const cancelInvitation = (id: string) => setInvitations(i => i.filter(x => x.id !== id));

  const activeCount = members.filter(m => m.status === 'active').length;

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1000, margin: '0 auto', padding: '0 0 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero illustrated card */}
      <div style={{
        borderRadius: 14, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)',
        border: `1px solid ${C.bds}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        minHeight: 220,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* SVG illustration */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="480" height="200" viewBox="0 0 480 200" fill="none" style={{ display: 'block', opacity: 0.7 }}>
            {/* Central hub node */}
            <circle cx="240" cy="100" r="20" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
            <circle cx="240" cy="100" r="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
            <circle cx="240" cy="100" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
            {/* Person nodes around the hub */}
            <circle cx="100" cy="60" r="14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3"/>
            <circle cx="100" cy="60" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            <path d="M80 88 Q100 78 120 88" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="380" cy="60" r="14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3"/>
            <circle cx="380" cy="60" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            <path d="M360 88 Q380 78 400 88" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="100" cy="140" r="14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3"/>
            <circle cx="100" cy="140" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            <path d="M80 168 Q100 158 120 168" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="380" cy="140" r="14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3"/>
            <circle cx="380" cy="140" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            <path d="M360 168 Q380 158 400 168" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="60" cy="100" r="12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <circle cx="420" cy="100" r="12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            {/* Connection lines */}
            <path d="M113 67 L224 95" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3"/>
            <path d="M366 67 L256 95" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3"/>
            <path d="M113 133 L224 105" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3"/>
            <path d="M366 133 L256 105" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3"/>
            <path d="M72 100 L210 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3"/>
            <path d="M270 100 L408 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3"/>
            {/* Role badge shapes */}
            <rect x="76" y="38" width="48" height="14" rx="7" stroke="rgba(59,150,143,0.7)" strokeWidth="1"/>
            <rect x="356" y="38" width="48" height="14" rx="7" stroke="rgba(59,150,143,0.5)" strokeWidth="1"/>
            <rect x="76" y="118" width="48" height="14" rx="7" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <rect x="356" y="118" width="48" height="14" rx="7" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            {/* Floating dots */}
            <circle cx="170" cy="40" r="2.5" fill="rgba(255,255,255,0.25)"/>
            <circle cx="310" cy="160" r="2.5" fill="rgba(255,255,255,0.25)"/>
            <circle cx="200" cy="165" r="2" fill="rgba(255,255,255,0.2)"/>
            <circle cx="290" cy="35" r="2" fill="rgba(255,255,255,0.2)"/>
          </svg>
        </div>
        {/* Gradient overlay for text legibility */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(20,20,20,0.97) 0%, transparent 100%)',
        }} />
        {/* Text content */}
        <div style={{ position: 'relative', padding: '24px 28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.t1, letterSpacing: '-0.02em' }}>Équipe & Accès</div>
            <div style={{ fontSize: 13, color: 'rgba(240,240,240,0.55)', marginTop: 4 }}>Gérez les membres, rôles et permissions de votre organisation</div>
          </div>
          <TealBtn onClick={() => setShowInviteModal(true)}>
            + Inviter un membre
          </TealBtn>
        </div>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: `Membres actifs: ${activeCount}`, color: C.teal, bg: C.tealT, border: 'rgba(59,150,143,0.25)' },
          { label: 'Rôles: 4', color: C.t2, bg: 'rgba(255,255,255,0.04)', border: C.bds },
          { label: `Invitations en attente: ${invitations.length}`, color: C.t2, bg: 'rgba(255,255,255,0.04)', border: C.bds },
        ].map(s => (
          <div key={s.label} style={{
            padding: '8px 16px', background: s.bg, border: `1px solid ${s.border}`,
            borderRadius: 20, fontSize: 13, fontWeight: 600, color: s.color,
          }}>{s.label}</div>
        ))}
      </div>

      {/* Members table */}
      <Card>
        <SectionTitle>Membres de l'équipe</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                {['Membre', 'Rôle', "Limite d'envoi", 'Dernière activité', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '8px 14px', textAlign: 'left', fontSize: 10,
                    fontWeight: 600, color: C.t3, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} style={{
                  borderBottom: i < members.length - 1 ? `1px solid ${C.bds}` : 'none',
                  background: i % 2 === 0 ? 'transparent' : C.l2,
                }}>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={m.name} size={32} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: C.t3 }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px' }}><RoleBadge role={m.role} /></td>
                  <td style={{ padding: '14px 14px', fontSize: 12, color: C.t2, fontFamily: MONO }}>{m.limit}</td>
                  <td style={{ padding: '14px 14px', fontSize: 12, color: C.t3 }}>{m.lastActive}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: m.status === 'active' ? C.em : C.t3,
                      }} />
                      <span style={{ fontSize: 12, color: m.status === 'active' ? C.em : C.t3 }}>
                        {m.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    {m.role === 'Propriétaire' ? (
                      <span style={{ fontSize: 12, color: C.t3 }}>—</span>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditingMember(m)} style={{
                          padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                          border: `1px solid ${C.bd}`, background: 'transparent',
                          color: C.t2, fontFamily: FONT, transition: 'all 0.12s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; }}
                        >Modifier</button>
                        <button onClick={() => handleSuspend(m.id)} style={{
                          padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                          border: `1px solid ${C.bd}`, background: 'transparent',
                          color: C.t3, fontFamily: FONT, transition: 'all 0.12s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = m.status === 'active' ? C.amber : C.em; e.currentTarget.style.color = m.status === 'active' ? C.amber : C.em; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t3; }}
                        >{m.status === 'active' ? 'Suspendre' : 'Réactiver'}</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <Card>
          <SectionTitle>Invitations en attente</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {invitations.map(inv => (
              <div key={inv.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: C.l2, borderRadius: 8,
                border: `1px solid ${C.bds}`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: C.amberT,
                  border: `1px solid ${C.amberB}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 13, color: C.amber, flexShrink: 0,
                }}>✉</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{inv.email}</div>
                  <div style={{ fontSize: 11, color: C.t3 }}>{inv.role} · {inv.sentAgo}</div>
                </div>
                <button style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                  border: `1px solid ${C.bd}`, background: 'transparent',
                  color: C.t2, fontFamily: FONT, transition: 'all 0.12s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; }}
                >Renvoyer</button>
                <button onClick={() => cancelInvitation(inv.id)} style={{
                  padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                  border: `1px solid ${C.bd}`, background: 'transparent',
                  color: C.t3, fontFamily: FONT, transition: 'all 0.12s',
                  display: 'flex', alignItems: 'center',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t3; }}
                ><X size={13} /></button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Permissions matrix */}
      <Card>
        <SectionTitle>Matrice des permissions</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: C.t2, width: '40%' }}>Permission</th>
                {ALL_ROLES.map(r => (
                  <th key={r} style={{ padding: '8px 14px', textAlign: 'center', fontSize: 11 }}>
                    <RoleBadge role={r} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p, i) => {
                const vals = [p.owner, p.admin, p.finance, p.observer];
                return (
                  <tr key={i} style={{
                    borderBottom: i < PERMISSIONS.length - 1 ? `1px solid ${C.bds}` : 'none',
                    background: i % 2 === 0 ? 'transparent' : C.l2,
                  }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: C.t1 }}>{p.label}</td>
                    {vals.map((v, j) => (
                      <td key={j} style={{ padding: '10px 14px', textAlign: 'center' }}>
                        {v ? (
                          <Check size={16} color={C.teal} strokeWidth={3} style={{ display: 'inline-block' }} />
                        ) : (
                          <X size={16} color={C.red} strokeWidth={3} style={{ display: 'inline-block' }} />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Activity log */}
      <Card>
        <SectionTitle>Journal d'activité récente</SectionTitle>
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 14, top: 8, bottom: 8,
            width: 1, background: C.bds,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {ACTIVITY_LOG.map((ev, i) => (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 0', paddingLeft: 2,
                borderBottom: i < ACTIVITY_LOG.length - 1 ? `1px solid ${C.bds}` : 'none',
              }}>
                {/* Dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: ev.color,
                  flexShrink: 0, marginTop: 4, position: 'relative', zIndex: 1,
                  border: `2px solid ${C.l1}`, marginLeft: 11,
                }} />
                <Avatar name={ev.actor} size={26} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{ev.actor}</span>
                  <span style={{ fontSize: 13, color: C.t2 }}> {ev.action}</span>
                </div>
                <span style={{ fontSize: 11, color: C.t3, flexShrink: 0, marginTop: 2 }}>{ev.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Modals */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
        />
      )}
      {editingMember && (
        <EditModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
