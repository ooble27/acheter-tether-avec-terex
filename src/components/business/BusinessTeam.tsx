import { useState } from 'react';
import { Check, Mail, Pencil, ShieldCheck, Users, Activity, X, Plus } from 'lucide-react';

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

const SELECTABLE_ROLES: { id: Role; desc: string }[] = [
  { id: 'Administrateur', desc: 'Gère l\'équipe, paramètres et approuve tous les paiements' },
  { id: 'Financier',      desc: 'Crée et approuve les paiements dans sa limite mensuelle' },
  { id: 'Comptable',      desc: 'Consultation de l\'historique et export des rapports uniquement' },
  { id: 'Opérateur',      desc: 'Crée des paiements qui nécessitent une approbation' },
];

const ALL_ROLE_DEFS: { id: Role; desc: string; perms: string[] }[] = [
  { id: 'Propriétaire',  desc: 'Accès complet sans restriction. Seul à pouvoir fermer le compte.',       perms: ['Approuver tous les paiements', 'Gérer l\'équipe', 'Accès API', 'Paiements illimités'] },
  { id: 'Administrateur',desc: 'Gère l\'équipe et approuve tous les paiements sans limite de clôture.',  perms: ['Approuver tous les paiements', 'Gérer l\'équipe', 'Accès API', 'Exporter'] },
  { id: 'Financier',     desc: 'Crée et valide les paiements dans sa limite mensuelle définie.',          perms: ['Créer des paiements', 'Approuver < limite', 'Gérer fournisseurs', 'Exporter'] },
  { id: 'Comptable',     desc: 'Consultation de l\'historique et génération des rapports financiers.',    perms: ['Voir les transactions', 'Exporter les rapports'] },
  { id: 'Opérateur',     desc: 'Soumet des paiements pour validation par un Financier ou Admin.',         perms: ['Créer des paiements', 'Voir les transactions'] },
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

const ACTIVITY: { id: string; actor: string; action: string; time: string }[] = [
  { id: '1', actor: 'Fatou Ndiaye',   action: 'a envoyé 1 200 USDT à Shenzhen Electronics',            time: 'Il y a 2h'  },
  { id: '2', actor: 'Ahmed Diallo',   action: 'a ajouté un fournisseur : Lagos Imports Ltd',             time: 'Il y a 5h'  },
  { id: '3', actor: 'Mamadou Ba',     action: 'a soumis un paiement de 800 USDT (en attente)',           time: 'Il y a 1j'  },
  { id: '4', actor: 'Fatou Ndiaye',   action: 'a exporté le rapport mensuel',                            time: 'Il y a 1j'  },
  { id: '5', actor: 'Ahmed Diallo',   action: 'a approuvé le paiement de 12 500 USDT',                  time: 'Il y a 2j'  },
  { id: '6', actor: 'Mamadou Ba',     action: 'a modifié le fournisseur Dubai Trade Co.',                time: 'Il y a 3j'  },
  { id: '7', actor: 'Aïssatou Sow',   action: 'a téléchargé le rapport trimestriel',                     time: 'Il y a 4j'  },
];

const fieldBase: React.CSSProperties = {
  height: 38, width: '100%', background: C.l2, border: `1px solid ${C.bd}`,
  borderRadius: 8, padding: '0 12px', color: C.t1, fontSize: 13,
  outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
};

// ── Composants de base ─────────────────────────────────────────────

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

function ModalWrap({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 28, width: 460, maxWidth: 'calc(100vw - 32px)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)', fontFamily: FONT, maxHeight: '90vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h3 style={{ color: C.t1, fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ color: C.t3, fontSize: 12, margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.12s', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = C.t1} onMouseLeave={e => e.currentTarget.style.color = C.t3}>
        <X size={16} />
      </button>
    </div>
  );
}

function FieldWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 10.5, color: C.t3, fontWeight: 700, margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      {children}
    </div>
  );
}

function RoleSelector({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {SELECTABLE_ROLES.map(r => (
        <button key={r.id} onClick={() => onChange(r.id)}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 14px', borderRadius: 9, border: `1px solid ${value === r.id ? C.teal : C.bds}`, background: value === r.id ? C.tealT : 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.12s', fontFamily: FONT }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${value === r.id ? C.teal : C.t3}`, background: value === r.id ? C.teal : 'transparent', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>
            {value === r.id && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: value === r.id ? C.t1 : C.t2, marginBottom: 2 }}>{r.id}</div>
            <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.4 }}>{r.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Carte membre ──────────────────────────────────────────────────

function MemberCard({ member, onEdit, onToggle }: { member: Member; onEdit: () => void; onToggle: () => void }) {
  const [hov, setHov] = useState(false);
  const isOwner = member.role === 'Propriétaire';
  const isSuspended = member.status === 'suspended';

  return (
    <div
      style={{ background: C.l1, border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* En-tête */}
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

      {/* Stats */}
      <div style={{ display: 'flex', gap: 0, padding: '12px 0', borderTop: `1px solid ${C.bds}`, borderBottom: `1px solid ${C.bds}`, marginBottom: 14 }}>
        {[
          { lbl: 'Limite', val: member.limit },
          { lbl: 'Dernière activité', val: member.lastActive },
          { lbl: 'Membre depuis', val: member.joinedAt },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, paddingLeft: i > 0 ? 14 : 0, borderLeft: i > 0 ? `1px solid ${C.bds}` : 'none' }}>
            <div style={{ fontSize: 9.5, color: C.t3, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 4 }}>{s.lbl}</div>
            <div style={{ fontSize: 11.5, color: C.t2, fontFamily: i === 0 ? MONO : FONT }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {isOwner ? (
        <div style={{ fontSize: 11, color: C.t3, textAlign: 'center', padding: '4px 0' }}>Propriétaire du compte</div>
      ) : (
        <div style={{ display: 'flex', gap: 7 }}>
          <button onClick={onEdit}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', borderRadius: 8, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t2, fontSize: 12, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
            <Pencil size={11} /> Modifier
          </button>
          <button onClick={onToggle}
            style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t3, fontSize: 12, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = isSuspended ? C.teal : C.red; e.currentTarget.style.color = isSuspended ? C.teal : C.red; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
            {isSuspended ? 'Réactiver' : 'Suspendre'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Modal invitation ──────────────────────────────────────────────

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (inv: Invitation) => void }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<Role>('Financier');
  const [limit, setLimit] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = email.trim() && firstName.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onInvite({ id: Date.now().toString(), email: email.trim(), role, sentAgo: "À l'instant" });
    onClose();
  };

  return (
    <ModalWrap onClose={onClose}>
      <ModalHeader title="Inviter un membre" subtitle="Un email d'invitation sera envoyé à l'adresse indiquée." onClose={onClose} />

      <FieldWrap label="Adresse email">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@entreprise.com" type="email" style={fieldBase} />
      </FieldWrap>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10.5, color: C.t3, fontWeight: 700, margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prénom</p>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" style={fieldBase} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10.5, color: C.t3, fontWeight: 700, margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nom</p>
          <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" style={fieldBase} />
        </div>
      </div>

      <FieldWrap label="Rôle attribué">
        <RoleSelector value={role} onChange={setRole} />
      </FieldWrap>

      <FieldWrap label="Limite mensuelle (USDT)">
        <input value={limit} onChange={e => setLimit(e.target.value)} placeholder="Laisser vide = illimité" type="number" style={{ ...fieldBase, fontFamily: MONO }} />
      </FieldWrap>

      <FieldWrap label="Message d'accueil (optionnel)">
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Bienvenue dans l'équipe…" rows={3}
          style={{ ...fieldBase, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box', width: '100%' }} />
      </FieldWrap>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <GhostBtn onClick={onClose} style={{ flex: 1 }}>Annuler</GhostBtn>
        <TealBtn onClick={handleSubmit} disabled={!canSubmit} style={{ flex: 1 }}>Envoyer l'invitation</TealBtn>
      </div>
    </ModalWrap>
  );
}

// ── Modal édition ─────────────────────────────────────────────────

function EditModal({ member, onClose, onSave }: { member: Member; onClose: () => void; onSave: (id: string, role: Role, limit: string) => void }) {
  const [role, setRole] = useState<Role>(member.role === 'Propriétaire' ? 'Administrateur' : member.role);
  const [limit, setLimit] = useState(member.limit === '—' || member.limit === 'Illimitée' ? '' : member.limit.replace(/\s*USDT\/mois$/, ''));

  return (
    <ModalWrap onClose={onClose}>
      <ModalHeader title="Modifier les accès" subtitle="Ajustez le rôle et la limite mensuelle." onClose={onClose} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, marginBottom: 22 }}>
        <Avatar name={member.name} size={40} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{member.name}</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{member.email}</div>
        </div>
      </div>

      <FieldWrap label="Nouveau rôle">
        <RoleSelector value={role} onChange={setRole} />
      </FieldWrap>

      <FieldWrap label="Limite mensuelle (USDT)">
        <input value={limit} onChange={e => setLimit(e.target.value)} placeholder="Laisser vide = illimité" type="number" style={{ ...fieldBase, fontFamily: MONO }} />
      </FieldWrap>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <GhostBtn onClick={onClose} style={{ flex: 1 }}>Annuler</GhostBtn>
        <TealBtn onClick={() => { onSave(member.id, role, limit ? `${parseInt(limit).toLocaleString('fr-FR')} USDT/mois` : 'Illimitée'); onClose(); }} style={{ flex: 1 }}>Enregistrer</TealBtn>
      </div>
    </ModalWrap>
  );
}

// ── Composant principal ───────────────────────────────────────────

export function BusinessTeam({ user }: { user: { email: string; name: string; id?: string } | null }) {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [showInvite, setShowInvite] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: 'm1', name: 'Ahmed Diallo',   email: 'ahmed@terex.io',    role: 'Propriétaire',   limit: 'Illimitée',           lastActive: "Aujourd'hui", status: 'active',    joinedAt: 'Jan 2024' },
    { id: 'm2', name: 'Fatou Ndiaye',   email: 'fatou@terex.io',    role: 'Administrateur', limit: 'Illimitée',           lastActive: 'Il y a 2h',   status: 'active',    joinedAt: 'Mar 2024' },
    { id: 'm3', name: 'Mamadou Ba',     email: 'mamadou@terex.io',  role: 'Financier',      limit: '10 000 USDT/mois',   lastActive: 'Il y a 3j',   status: 'active',    joinedAt: 'Juin 2024' },
    { id: 'm4', name: 'Aïssatou Sow',   email: 'aissatou@terex.io', role: 'Comptable',      limit: '—',                  lastActive: 'Il y a 1sem', status: 'active',    joinedAt: 'Nov 2024' },
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

  const activeCount = members.filter(m => m.status === 'active').length;

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'members',      label: 'Membres',     icon: Users },
    { id: 'invitations',  label: 'Invitations', icon: Mail, count: invitations.length },
    { id: 'roles',        label: 'Rôles',       icon: ShieldCheck },
    { id: 'activity',     label: 'Activité',    icon: Activity },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', padding: '0 0 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Modals */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
      {editingMember && <EditModal member={editingMember} onClose={() => setEditingMember(null)} onSave={handleSaveEdit} />}

      {/* ── Hero ────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '26px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: C.t1, fontSize: 21, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Équipe & Accès</h2>
            <p style={{ color: C.t3, fontSize: 12, margin: '5px 0 18px' }}>Gérez les membres, rôles et accès de votre organisation</p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Membres actifs',           value: activeCount },
                { label: 'Rôles disponibles',         value: 5 },
                { label: 'Invitations en attente',    value: invitations.length },
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
                <span style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 10, padding: '1px 6px', fontSize: 10, color: C.t3, lineHeight: '15px' }}>
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
                <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={17} color={C.t3} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.t1, marginBottom: 3 }}>{inv.email}</div>
                    <div style={{ fontSize: 11, color: C.t3 }}>{inv.role} · {inv.sentAgo}</div>
                  </div>
                  <button style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t2, fontSize: 11.5, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
                    Renvoyer
                  </button>
                  <button onClick={() => cancelInvitation(inv.id)} style={{ padding: '5px 8px', borderRadius: 7, border: `1px solid ${C.bds}`, background: 'transparent', color: C.t3, fontSize: 11.5, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t3; }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RÔLES ───────────────────────────────────────────── */}
      {activeTab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cartes de définition des rôles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 12 }}>
            {ALL_ROLE_DEFS.map(r => {
              const memberCount = members.filter(m => m.role === r.id).length;
              return (
                <div key={r.id} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: r.id === 'Propriétaire' ? C.teal : C.t1 }}>{r.id}</div>
                    <div style={{ fontSize: 10.5, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 7, padding: '2px 8px', flexShrink: 0, marginLeft: 10 }}>
                      {memberCount} {memberCount <= 1 ? 'membre' : 'membres'}
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.t3, lineHeight: 1.5, marginBottom: 12 }}>{r.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {r.perms.map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: C.t2 }}>
                        <Check size={10} color={C.teal} strokeWidth={3} style={{ flexShrink: 0 }} />
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrice complète */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: 22 }}>
            <Label>Matrice complète des permissions</Label>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.bds}` }}>
                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.t3, width: '32%' }}>Permission</th>
                    {['Propriétaire', 'Administrateur', 'Financier', 'Comptable', 'Opérateur'].map(r => (
                      <th key={r} style={{ padding: '8px 10px', textAlign: 'center', fontSize: 10.5, fontWeight: 600, color: r === 'Propriétaire' ? C.teal : C.t3, whiteSpace: 'nowrap' }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map((p, i) => {
                    const vals = [p.owner, p.admin, p.financier, p.comptable, p.operateur];
                    return (
                      <tr key={i} style={{ borderBottom: i < PERMISSIONS.length - 1 ? `1px solid ${C.bds}` : 'none', background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                        <td style={{ padding: '11px 14px', fontSize: 12.5, color: C.t1 }}>{p.label}</td>
                        {vals.map((v, j) => (
                          <td key={j} style={{ padding: '11px 10px', textAlign: 'center' }}>
                            {v
                              ? <Check size={14} color={C.teal} strokeWidth={3} style={{ display: 'inline-block' }} />
                              : <span style={{ fontSize: 16, color: C.t3, lineHeight: 1 }}>—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVITÉ ────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: 22 }}>
          <Label>Journal d'activité récente</Label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACTIVITY.map((ev, i) => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <Avatar name={ev.actor} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{ev.actor}</span>
                  <span style={{ fontSize: 13, color: C.t2 }}> {ev.action}</span>
                </div>
                <span style={{ fontSize: 11, color: C.t3, flexShrink: 0 }}>{ev.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
