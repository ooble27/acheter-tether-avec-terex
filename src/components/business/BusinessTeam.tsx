import { useState, useRef } from 'react';
import {
  Check, Mail, Pencil, ShieldCheck, Users, Clock, X, Plus,
  TrendingUp, FileText, ArrowRight, User, ArrowLeft, BarChart2, Settings, Upload
} from 'lucide-react';

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
type PageView = 'main' | 'invite';

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

const ROLE_MODULES: Record<Role, { name: string; icon: React.ElementType; access: boolean }[]> = {
  'Propriétaire': [
    { name: 'Vue d\'ensemble', icon: BarChart2, access: true },
    { name: 'Paiements',       icon: ArrowRight, access: true },
    { name: 'Trésorerie',      icon: TrendingUp, access: true },
    { name: 'Fournisseurs',    icon: FileText,   access: true },
    { name: 'Historique',      icon: Clock,      access: true },
    { name: 'Équipe & Accès',  icon: Users,      access: true },
    { name: 'Paramètres',      icon: Settings,   access: true },
  ],
  'Administrateur': [
    { name: 'Vue d\'ensemble', icon: BarChart2, access: true },
    { name: 'Paiements',       icon: ArrowRight, access: true },
    { name: 'Trésorerie',      icon: TrendingUp, access: true },
    { name: 'Fournisseurs',    icon: FileText,   access: true },
    { name: 'Historique',      icon: Clock,      access: true },
    { name: 'Équipe & Accès',  icon: Users,      access: true },
    { name: 'Paramètres',      icon: Settings,   access: false },
  ],
  'Financier': [
    { name: 'Vue d\'ensemble', icon: BarChart2, access: true },
    { name: 'Paiements',       icon: ArrowRight, access: true },
    { name: 'Trésorerie',      icon: TrendingUp, access: true },
    { name: 'Fournisseurs',    icon: FileText,   access: true },
    { name: 'Historique',      icon: Clock,      access: true },
    { name: 'Équipe & Accès',  icon: Users,      access: false },
    { name: 'Paramètres',      icon: Settings,   access: false },
  ],
  'Comptable': [
    { name: 'Vue d\'ensemble', icon: BarChart2, access: true },
    { name: 'Paiements',       icon: ArrowRight, access: false },
    { name: 'Trésorerie',      icon: TrendingUp, access: false },
    { name: 'Fournisseurs',    icon: FileText,   access: true },
    { name: 'Historique',      icon: Clock,      access: true },
    { name: 'Équipe & Accès',  icon: Users,      access: false },
    { name: 'Paramètres',      icon: Settings,   access: false },
  ],
  'Opérateur': [
    { name: 'Vue d\'ensemble', icon: BarChart2, access: true },
    { name: 'Paiements',       icon: ArrowRight, access: true },
    { name: 'Trésorerie',      icon: TrendingUp, access: false },
    { name: 'Fournisseurs',    icon: FileText,   access: true },
    { name: 'Historique',      icon: Clock,      access: true },
    { name: 'Équipe & Accès',  icon: Users,      access: false },
    { name: 'Paramètres',      icon: Settings,   access: false },
  ],
};

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

const ACTIVITY: { id: string; actor: string; action: string; time: string; date: string; isoDate: string }[] = [
  { id: '1', actor: 'Fatou Ndiaye',  action: 'a envoyé 1 200 USDT à Shenzhen Electronics',   time: '10:34', date: '17 mai 2026', isoDate: '2026-05-17' },
  { id: '2', actor: 'Ahmed Diallo',  action: 'a ajouté un fournisseur : Lagos Imports Ltd',    time: '08:15', date: '17 mai 2026', isoDate: '2026-05-17' },
  { id: '3', actor: 'Mamadou Ba',    action: 'a soumis un paiement de 800 USDT (en attente)', time: '14:20', date: '16 mai 2026', isoDate: '2026-05-16' },
  { id: '4', actor: 'Fatou Ndiaye',  action: 'a exporté le rapport mensuel',                   time: '11:08', date: '16 mai 2026', isoDate: '2026-05-16' },
  { id: '5', actor: 'Ahmed Diallo',  action: 'a approuvé le paiement de 12 500 USDT',         time: '16:42', date: '15 mai 2026', isoDate: '2026-05-15' },
  { id: '6', actor: 'Mamadou Ba',    action: 'a modifié le fournisseur Dubai Trade Co.',       time: '09:55', date: '14 mai 2026', isoDate: '2026-05-14' },
  { id: '7', actor: 'Aïssatou Sow',  action: 'a téléchargé le rapport trimestriel',            time: '13:30', date: '13 mai 2026', isoDate: '2026-05-13' },
];

const LIMIT_PRESETS = ['5 000', '10 000', '25 000', '50 000', 'Illimitée'];

const fieldBase: React.CSSProperties = {
  height: 38, width: '100%', background: C.l2, border: `1px solid ${C.bd}`,
  borderRadius: 8, padding: '0 12px', color: C.t1, fontSize: 13,
  outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
};

// ── Base UI ──────────────────────────────────────────────────────────

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

function Avatar({ size = 36 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <User size={Math.round(size * 0.46)} color="rgba(255,255,255,0.28)" />
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
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, padding: 4, display: 'flex', borderRadius: 6 }}
        onMouseEnter={e => (e.currentTarget.style.color = C.t1)} onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
        <X size={16} />
      </button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10.5, color: C.t3, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{children}</p>;
}

// ── Carte de rôle ────────────────────────────────────────────────────

function RoleCard({ role, desc, icon: Icon, selected, onClick }: { role: Role; desc: string; icon: React.ElementType; selected: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px', borderRadius: 11, border: `1px solid ${selected ? C.teal : hov ? C.bd : C.bds}`, background: selected ? C.tealT : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.13s', fontFamily: FONT, width: '100%' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: selected ? C.tealB : 'rgba(255,255,255,0.06)', border: `1px solid ${selected ? C.tealB : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} color={selected ? C.teal : C.t3} />
      </div>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: selected ? C.t1 : C.t2, marginBottom: 4 }}>{role}</div>
        <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.45 }}>{desc}</div>
      </div>
    </button>
  );
}

// ── Sélecteur de limite ──────────────────────────────────────────────

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

// ── Aperçu dashboard (colonne droite InvitePage) ─────────────────────

function DashboardPreview({ role, name }: { role: Role; name: string }) {
  const modules = ROLE_MODULES[role];
  const BARS = [28, 52, 38, 74, 56, 82, 44, 68, 32, 88, 62, 84, 46, 72, 100];
  const TXS = [
    { dest: 'Shenzhen Electronics', amount: '-1 200', dir: 'out' as const, pending: false },
    { dest: 'Lagos Imports Ltd',    amount: '+4 500', dir: 'in'  as const, pending: false },
    { dest: 'Dubai Trade Co.',      amount: '-2 800', dir: 'out' as const, pending: true  },
    { dest: 'Cairo Textiles',       amount: '-650',   dir: 'out' as const, pending: false },
  ];
  const PROVIDERS = ['Shenzhen Elec.', 'Lagos Imports', 'Dubai Trade Co.'];

  const gridTexture: React.CSSProperties = {};

  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,0.09)' }}>

      {/* Browser chrome — gris neutre */}
      <div style={{ background: '#202020', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.65 }} />
          ))}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 5, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.25)', fontFamily: MONO }}>terex.io</span>
        </div>
      </div>

      {/* App header */}
      <div style={{ background: '#1d1d1d', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '9px 14px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: C.tealT, border: `1px solid ${C.tealB}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, fontFamily: MONO, letterSpacing: '0.14em' }}>TEREX</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ height: 19, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '0 8px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 8.5, color: C.t2, fontWeight: 600 }}>{role}</span>
          </div>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={11} color={C.t3} />
          </div>
        </div>
      </div>

      {/* App body */}
      <div style={{ display: 'flex', height: 540, background: '#1a1a1a' }}>

        {/* Sidebar — texture grise */}
        <div style={{ width: 54, background: '#181818', borderRight: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <div key={mod.name} title={mod.name}
                style={{ width: 33, height: 33, borderRadius: 9, background: mod.access ? 'rgba(59,150,143,0.1)' : 'transparent', border: `1px solid ${mod.access ? 'rgba(59,150,143,0.18)' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: mod.access ? 1 : 0.18, transition: 'opacity 0.2s' }}>
                <Icon size={13} color={mod.access ? C.teal : C.t2} />
              </div>
            );
          })}
        </div>

        {/* Main content — grille neutre en fond */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 9, ...gridTexture }}>

          {/* Titre + date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, letterSpacing: '-0.02em' }}>{name || 'Nouveau membre'}</div>
              <div style={{ fontSize: 8, color: C.t3, marginTop: 1 }}>{role} · Mai 2026</div>
            </div>
            <div style={{ padding: '4px 9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7 }}>
              <span style={{ fontSize: 8, color: C.t3, fontFamily: MONO }}>Mai 2026</span>
            </div>
          </div>

          {/* KPI — 3 cartes horizontales */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
            <div style={{ background: 'rgba(59,150,143,0.09)', border: '1px solid rgba(59,150,143,0.18)', borderRadius: 10, padding: '9px 10px' }}>
              <div style={{ fontSize: 7, color: C.teal, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Solde</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: MONO, lineHeight: 1 }}>12,450</div>
              <div style={{ fontSize: 7.5, color: C.teal, marginTop: 2, fontWeight: 600 }}>USDT</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '9px 10px' }}>
              <div style={{ fontSize: 7, color: C.t3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Ce mois</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: MONO, lineHeight: 1 }}>4,200</div>
              <div style={{ fontSize: 7.5, color: C.t3, marginTop: 2 }}>USDT</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '9px 10px' }}>
              <div style={{ fontSize: 7, color: C.t3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Paiements</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: MONO, lineHeight: 1 }}>8</div>
              <div style={{ fontSize: 7.5, color: C.t3, marginTop: 2 }}>ce mois</div>
            </div>
          </div>

          {/* Ligne intermédiaire — graphique + fournisseurs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 7 }}>
            {/* Graphique barres */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 11px' }}>
              <div style={{ fontSize: 7, color: C.t3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>Volume · 15 jours</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 44 }}>
                {BARS.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 2, background: i === BARS.length - 1 ? C.teal : 'rgba(255,255,255,0.11)' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 6.5, color: C.t3 }}>1 mai</span>
                <span style={{ fontSize: 6.5, color: C.teal, fontWeight: 600 }}>17 mai</span>
              </div>
            </div>

            {/* Fournisseurs */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 11px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 7, color: C.t3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>Fournisseurs</div>
              {PROVIDERS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: i < PROVIDERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: 17, height: 17, borderRadius: 5, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={7} color={C.t3} />
                  </div>
                  <span style={{ fontSize: 8, color: C.t2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions récentes */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '8px 11px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 7, color: C.t3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Transactions récentes</span>
            </div>
            {TXS.map((tx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 11px', borderBottom: i < TXS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: tx.dir === 'in' ? 'rgba(59,150,143,0.12)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ArrowRight size={8} color={tx.dir === 'in' ? C.teal : C.t3} style={{ transform: tx.dir === 'in' ? 'rotate(180deg)' : undefined }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 600, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.dest}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: tx.pending ? C.t3 : tx.dir === 'in' ? C.teal : C.t1, fontFamily: MONO }}>{tx.amount}</div>
                  {tx.pending && <div style={{ fontSize: 6.5, color: '#f59e0b', marginTop: 1 }}>En attente</div>}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Page d'invitation pleine largeur ────────────────────────────────

function InvitePage({ onBack, onInvite }: { onBack: () => void; onInvite: (inv: Invitation) => void }) {
  const [email, setEmail]         = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [role, setRole]           = useState<Role>('Financier');
  const [limit, setLimit]         = useState('Illimitée');
  const [message, setMessage]     = useState('');

  const displayName = [firstName, lastName].filter(Boolean).join(' ');
  const canSubmit   = email.includes('@') && firstName.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onInvite({ id: Date.now().toString(), email: email.trim(), role, sentAgo: "À l'instant" });
    onBack();
  };

  const inp: React.CSSProperties = {
    ...fieldBase, height: 44, fontSize: 13.5,
    background: C.l2,
    border: `1px solid ${C.bd}`,
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
        <button onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.t3, fontSize: 13, padding: '6px 8px 6px 4px', borderRadius: 8, fontFamily: FONT, transition: 'color 0.14s' }}
          onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
          onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
          <ArrowLeft size={15} /> Équipe & Accès
        </button>
        <span style={{ color: C.bds, fontSize: 18, lineHeight: 1 }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Inviter un membre</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 36, alignItems: 'start' }}>

        {/* ── Colonne gauche : formulaire ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Profile hero — texture grise neutre */}
          <div style={{ background: 'linear-gradient(150deg, #222222 0%, #1d1d1d 50%, #202020 100%)', border: `1px solid ${C.bds}`, borderRadius: '18px 18px 0 0', padding: '36px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
            {/* Avatar avec rings concentriques */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 130, height: 130 }}>
              {displayName && <>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(59,150,143,0.2)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1px solid rgba(59,150,143,0.12)', pointerEvents: 'none' }} />
              </>}
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: displayName ? 'radial-gradient(circle at 40% 35%, rgba(59,150,143,0.3) 0%, rgba(59,150,143,0.08) 100%)' : 'rgba(255,255,255,0.06)', border: `2px solid ${displayName ? C.teal : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', boxShadow: displayName ? '0 0 36px rgba(59,150,143,0.22)' : 'none', position: 'relative', zIndex: 1 }}>
                <User size={40} color={displayName ? C.teal : 'rgba(255,255,255,0.18)'} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: displayName ? C.t1 : 'rgba(255,255,255,0.22)', letterSpacing: '-0.025em', transition: 'color 0.2s', minHeight: 28 }}>
                {displayName || 'Nom du membre'}
              </div>
              <div style={{ fontSize: 13, color: email ? C.t2 : 'rgba(255,255,255,0.2)', marginTop: 5, transition: 'color 0.2s' }}>
                {email || 'email@exemple.com'}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, padding: '5px 14px', borderRadius: 20, background: C.tealT, border: `1px solid ${C.tealB}`, fontSize: 11.5, color: C.teal, fontWeight: 600 }}>
                {role}
              </div>
            </div>
          </div>

          {/* Form body — une seule carte continue */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderTop: 'none', borderRadius: '0 0 18px 18px', padding: '30px 32px' }}>

            {/* Coordonnées */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Coordonnées</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Adresse email *" type="email" style={inp} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom *" style={{ ...inp, flex: 1 }} />
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" style={{ ...inp, flex: 1 }} />
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

            {/* Rôle */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Rôle & permissions</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {SELECTABLE_ROLES.map(r => (
                  <RoleCard key={r.id} role={r.id} desc={r.desc} icon={r.icon} selected={role === r.id} onClick={() => setRole(r.id)} />
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

            {/* Limite */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Limite mensuelle</div>
              <LimitPicker value={limit} onChange={setLimit} />
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

            {/* Message */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Message d'accueil</div>
                <span style={{ fontSize: 10, color: C.t3 }}>Optionnel</span>
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Bienvenue dans l'équipe ! Voici votre accès à la plateforme Terex…"
                rows={3}
                style={{ ...inp, height: 'auto', padding: '12px', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box', width: '100%' }} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <GhostBtn onClick={onBack} style={{ flex: 1, height: 46 }}>Annuler</GhostBtn>
              <TealBtn onClick={handleSubmit} disabled={!canSubmit} style={{ flex: 2, height: 46, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Mail size={15} /> Envoyer l'invitation
              </TealBtn>
            </div>
          </div>
        </div>

        {/* ── Colonne droite : dashboard mockup sticky ── */}
        <div style={{ position: 'sticky', top: 24 }}>
          <DashboardPreview role={role} name={displayName} />
        </div>
      </div>
    </div>
  );
}

// ── Modal modification membre ────────────────────────────────────────

function EditModal({ member, onClose, onSave }: { member: Member; onClose: () => void; onSave: (id: string, role: Role, limit: string) => void }) {
  const [role, setRole] = useState<Role>(member.role === 'Propriétaire' ? 'Administrateur' : member.role);
  const initLimit = () => {
    const l = member.limit;
    if (!l || l === '—' || l === 'Illimitée') return 'Illimitée';
    return l.replace(/\s*USDT\/mois$/, '').trim();
  };
  const [limit, setLimit] = useState(initLimit());

  const handleSave = () => {
    const out = !limit || limit === 'Illimitée' ? 'Illimitée' : `${limit} USDT/mois`;
    onSave(member.id, role, out);
    onClose();
  };

  return (
    <ModalWrap onClose={onClose}>
      <ModalHeader title="Modifier les accès" onClose={onClose} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 10, marginBottom: 22 }}>
        <div style={{ position: 'relative' }}>
          <Avatar size={42} />
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: member.status === 'active' ? C.teal : C.t3, border: `2px solid ${C.l2}` }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{member.name}</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{member.email} · Depuis {member.joinedAt}</div>
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

// ── Modal modification invitation ────────────────────────────────────

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

// ── Carte membre ─────────────────────────────────────────────────────

function MemberCard({ member, onEdit, onToggle }: { member: Member; onEdit: () => void; onToggle: () => void }) {
  const [hov, setHov] = useState(false);
  const isOwner    = member.role === 'Propriétaire';
  const isSuspended = member.status === 'suspended';
  return (
    <div style={{ background: C.l1, border: `1px solid ${hov ? C.bd : C.bds}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar size={46} />
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

// ── Composant principal ──────────────────────────────────────────────

export function BusinessTeam({ user: _user }: { user: { email: string; name: string; id?: string } | null }) {
  const [pageView, setPageView]               = useState<PageView>('main');
  const [activeTab, setActiveTab]             = useState<Tab>('members');
  const [editingMember, setEditingMember]     = useState<Member | null>(null);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);
  const [activityDate, setActivityDate]       = useState<string | null>(null);
  const [teamLogo, setTeamLogo]               = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: 'm1', name: 'Ahmed Diallo',  email: 'ahmed@terex.io',    role: 'Propriétaire',   limit: 'Illimitée',         lastActive: "Aujourd'hui", status: 'active',    joinedAt: 'Jan 2024'  },
    { id: 'm2', name: 'Fatou Ndiaye',  email: 'fatou@terex.io',    role: 'Administrateur', limit: 'Illimitée',         lastActive: 'Il y a 2h',   status: 'active',    joinedAt: 'Mar 2024'  },
    { id: 'm3', name: 'Mamadou Ba',    email: 'mamadou@terex.io',  role: 'Financier',      limit: '10 000 USDT/mois', lastActive: 'Il y a 3j',   status: 'active',    joinedAt: 'Juin 2024' },
    { id: 'm4', name: 'Aïssatou Sow',  email: 'aissatou@terex.io', role: 'Comptable',      limit: 'Illimitée',         lastActive: 'Il y a 1sem', status: 'active',    joinedAt: 'Nov 2024'  },
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: 'inv1', email: 'hassan@export.ma', role: 'Financier', sentAgo: 'Envoyée il y a 2j' },
    { id: 'inv2', email: 'amina@trade.tn',   role: 'Opérateur', sentAgo: 'Envoyée il y a 5j' },
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

  const dateGroups = [...new Set(ACTIVITY.map(e => e.date))].map(date => ({
    date,
    isoDate: ACTIVITY.find(e => e.date === date)!.isoDate,
    entries: ACTIVITY.filter(e => e.date === date),
  }));
  const selectedEntries = activityDate ? ACTIVITY.filter(e => e.date === activityDate) : null;

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'members',     label: 'Membres',     icon: Users },
    { id: 'invitations', label: 'Invitations', icon: Mail,       count: invitations.length },
    { id: 'roles',       label: 'Rôles',       icon: ShieldCheck },
    { id: 'activity',    label: 'Activité',    icon: Clock },
  ];

  if (pageView === 'invite') {
    return (
      <div style={{ fontFamily: FONT, padding: '0 0 48px' }}>
        <InvitePage onBack={() => setPageView('main')} onInvite={handleInvite} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', padding: '0 0 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Modals */}
      {editingMember    && <EditModal member={editingMember} onClose={() => setEditingMember(null)} onSave={handleSaveEdit} />}
      {editingInvitation && <EditInviteModal invitation={editingInvitation} onSave={updateInvitationRole} onClose={() => setEditingInvitation(null)} />}

      {/* Logo input caché */}
      <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = ev => setTeamLogo(ev.target?.result as string);
          reader.readAsDataURL(file);
        }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '26px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <button onClick={() => logoRef.current?.click()}
              style={{ width: 56, height: 56, borderRadius: 14, background: teamLogo ? 'transparent' : 'rgba(255,255,255,0.06)', border: `1px dashed ${teamLogo ? 'transparent' : C.bds}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0, overflow: 'hidden', transition: 'border-color 0.15s' }}
              onMouseEnter={e => { if (!teamLogo) e.currentTarget.style.borderColor = C.teal; }}
              onMouseLeave={e => { if (!teamLogo) e.currentTarget.style.borderColor = C.bds; }}
              title="Uploader le logo de l'équipe">
              {teamLogo
                ? <img src={teamLogo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" />
                : <><Upload size={16} color={C.t3} /><span style={{ fontSize: 8, color: C.t3 }}>Logo</span></>
              }
            </button>
            <div>
              <h2 style={{ color: C.t1, fontSize: 21, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Équipe & Accès</h2>
              <p style={{ color: C.t3, fontSize: 12, margin: '5px 0 18px' }}>Gérez les membres, rôles et accès de votre organisation</p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'Membres actifs',        value: activeCount },
                  { label: 'Rôles disponibles',      value: 5 },
                  { label: 'Invitations en attente', value: invitations.length },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: C.t1, fontFamily: MONO, lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <TealBtn onClick={() => setPageView('invite')} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Plus size={14} /> Inviter un membre
          </TealBtn>
        </div>
      </div>

      {/* ── Onglets ───────────────────────────────────────────── */}
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

      {/* ── MEMBRES ───────────────────────────────────────────── */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 14 }}>
          {members.map(m => (
            <MemberCard key={m.id} member={m} onEdit={() => setEditingMember(m)} onToggle={() => handleToggle(m.id)} />
          ))}
          <button onClick={() => setPageView('invite')}
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

      {/* ── INVITATIONS ───────────────────────────────────────── */}
      {activeTab === 'invitations' && (
        <div>
          {invitations.length === 0 ? (
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={20} color={C.t3} />
              </div>
              <p style={{ color: C.t3, fontSize: 13, margin: '0 0 16px' }}>Aucune invitation en attente</p>
              <TealBtn onClick={() => setPageView('invite')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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

      {/* ── RÔLES ─────────────────────────────────────────────── */}
      {activeTab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 12 }}>
            {ALL_ROLE_DEFS.map(r => {
              const mc = members.filter(m => m.role === r.id).length;
              return (
                <div key={r.id} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: r.id === 'Propriétaire' ? C.teal : C.t1 }}>{r.id}</div>
                    <div style={{ fontSize: 10.5, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 7, padding: '2px 8px', marginLeft: 8, flexShrink: 0 }}>
                      {mc} {mc <= 1 ? 'membre' : 'membres'}
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

      {/* ── ACTIVITÉ ──────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div>
          {selectedEntries ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setActivityDate(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.t3, fontSize: 13, padding: '6px 8px 6px 4px', borderRadius: 8, fontFamily: FONT, transition: 'color 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
                  <ArrowLeft size={15} /> Journal
                </button>
                <span style={{ color: C.bds, fontSize: 18 }}>/</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{activityDate}</span>
                <span style={{ fontSize: 11, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 8, padding: '2px 9px', marginLeft: 2 }}>
                  {selectedEntries.length} action{selectedEntries.length > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
                {selectedEntries.map((ev, i) => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderBottom: i < selectedEntries.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                    <Avatar size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.t1 }}>{ev.actor}</span>
                      <span style={{ fontSize: 13.5, color: C.t2 }}> {ev.action}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.t3, flexShrink: 0, fontFamily: MONO }}>{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: 0 }}>Journal d'activité</p>
                <span style={{ fontSize: 11, color: C.t3 }}>Cliquez sur une date pour voir le détail</span>
              </div>
              {dateGroups.map(group => (
                <button key={group.date} onClick={() => setActivityDate(group.date)}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontFamily: FONT, transition: 'border-color 0.14s', width: '100%' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.bds)}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.l2, border: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={16} color={C.teal} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.t1 }}>{group.date}</div>
                    <div style={{ fontSize: 11.5, color: C.t3, marginTop: 3 }}>
                      {group.entries[0].actor}
                      {group.entries.length > 1 && <span> + {group.entries.length - 1} autre{group.entries.length > 2 ? 's' : ''}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: C.teal, fontFamily: MONO, fontWeight: 700, background: C.tealT, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.tealB}` }}>
                      {group.entries.length} action{group.entries.length > 1 ? 's' : ''}
                    </span>
                    <ArrowRight size={15} color={C.t3} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
