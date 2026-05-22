import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Check, ArrowLeft, ChevronRight, Building2, User, MapPin,
  FileText, Shield, Settings, CreditCard, Code,
  Key, Bell, Monitor, Clock, Copy, Eye, EyeOff,
  Plus, Trash2, Lock, Zap, X, AlertCircle, Edit3,
  Download, Send, Globe, Phone, Mail, Hash,
} from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────────
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.22)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';
const HERO_BG = 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)';

// ── Types ─────────────────────────────────────────────────────────────
type ProfilePage = 'main' | 'identity' | 'director' | 'address' | 'legal' | 'security' | 'preferences' | 'billing' | 'api';
type Lang = 'fr' | 'en';

interface ProfileData {
  companyName: string; businessType: string; sector: string;
  description: string; website: string;
  directorName: string; directorRole: string;
  directorEmail: string; directorPhone: string;
  address: string; city: string; postalCode: string; country: string;
  rccm: string; ninea: string; capital: string; foundedYear: string;
  companyPhone: string; companyEmail: string;
  language: string; currency: string; timezone: string;
  notifEmail: boolean; notifSms: boolean; notifPush: boolean;
  updatedAt?: string;
}

const EMPTY: ProfileData = {
  companyName: '', businessType: '', sector: '', description: '', website: '',
  directorName: '', directorRole: '', directorEmail: '', directorPhone: '',
  address: '', city: '', postalCode: '', country: '',
  rccm: '', ninea: '', capital: '', foundedYear: '',
  companyPhone: '', companyEmail: '',
  language: 'Français', currency: 'USDT', timezone: 'Africa/Dakar',
  notifEmail: true, notifSms: false, notifPush: true,
};

// ── i18n ──────────────────────────────────────────────────────────────
const I: Record<Lang, Record<string, string>> = {
  fr: {
    back: 'Profil entreprise', edit: 'Modifier le profil', save: 'Enregistrer',
    cancel: 'Annuler', unsaved: 'Modifications non enregistrées', saved: 'Modifications enregistrées',
    companyInfo: 'Informations entreprise', legalDocs: 'Documents légaux',
    accountSec: 'Compte & Sécurité', techBilling: 'Technique & Facturation',
    identity: "Identité de l'entreprise", identitySub: 'Raison sociale, forme juridique, secteur, contacts',
    director: 'Dirigeant & Représentant légal', directorSub: 'Nom, fonction, email, téléphone',
    address: 'Siège social', addressSub: 'Adresse officielle enregistrée au RCCM',
    legal: 'Informations légales & Fiscales', legalSub: 'RCCM, NINEA, capital, année de création',
    security: 'Sécurité', securitySub: 'Mot de passe, 2FA, sessions actives',
    prefs: 'Préférences', prefsSub: 'Langue, devise, fuseau, notifications',
    api: 'API & Intégrations', apiSub: 'Clés API, webhooks, utilisation',
    billing: 'Facturation & Abonnement', billingSub: 'Plan actuel, historique des factures',
    kyc: 'Niveau KYC', members: 'Membres équipe', since: 'Membre depuis', txMonth: 'Transactions/mois',
    kycVal: 'Niveau 1 · Basique', devices: '4 appareils', activeKeys: '2 clés actives',
    plan: 'Starter · Gratuit', yourCo: 'Votre entreprise', complete: 'Complétez votre profil',
    secBtn: 'Sécurité', apiBtn: 'Clés API',
  },
  en: {
    back: 'Business Profile', edit: 'Edit profile', save: 'Save',
    cancel: 'Cancel', unsaved: 'Unsaved changes', saved: 'Changes saved',
    companyInfo: 'Company Information', legalDocs: 'Legal Documents',
    accountSec: 'Account & Security', techBilling: 'Tech & Billing',
    identity: 'Company Identity', identitySub: 'Legal name, type, sector, contacts',
    director: 'Director & Legal Representative', directorSub: 'Name, role, email, phone',
    address: 'Registered Office', addressSub: 'Official address registered at RCCM',
    legal: 'Legal & Tax Information', legalSub: 'RCCM, NINEA, share capital, founding year',
    security: 'Security', securitySub: 'Password, 2FA, active sessions',
    prefs: 'Preferences', prefsSub: 'Language, currency, timezone, notifications',
    api: 'API & Integrations', apiSub: 'API keys, webhooks, usage',
    billing: 'Billing & Subscription', billingSub: 'Current plan, invoice history',
    kyc: 'KYC Level', members: 'Team members', since: 'Member since', txMonth: 'Transactions/month',
    kycVal: 'Level 1 · Basic', devices: '4 devices', activeKeys: '2 active keys',
    plan: 'Starter · Free', yourCo: 'Your company', complete: 'Complete your profile',
    secBtn: 'Security', apiBtn: 'API Keys',
  },
};

function getLang(language: string): Lang { return language === 'English' ? 'en' : 'fr'; }

// ── Constants ─────────────────────────────────────────────────────────
const BIZ_TYPES = ['SARL', 'SA', 'SAS', 'GIE', 'SUARL', 'Association', 'Autre'];
const SECTORS = ['Import / Export', 'Textile & Confection', 'Électronique & Tech', 'Agroalimentaire', 'Bâtiment & Matériaux', 'Logistique', 'Négoce international', 'Services financiers', 'Autre'];
const COUNTRIES = ["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Guinée", "Togo", "Bénin", "Niger", "Cameroun", "Autre"];
const DIR_ROLES = ['Directeur Général', 'Président-Directeur Général', 'Gérant', 'Administrateur', 'Associé gérant', 'Autre'];

// ── Atomic components ─────────────────────────────────────────────────

function TealBtn({ children, onClick, disabled, style }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; style?: React.CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 38, paddingLeft: 18, paddingRight: 18, background: disabled ? C.l3 : h ? C.tealH : C.teal, color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FONT, transition: 'background 0.13s', flexShrink: 0, ...style }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38, paddingLeft: 16, paddingRight: 16, background: h ? C.l3 : 'rgba(255,255,255,0.04)', color: C.t2, border: `1px solid ${C.bds}`, borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', flexShrink: 0, ...style }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick, style }: {
  children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 34, paddingLeft: 14, paddingRight: 14, background: h ? C.redT : 'transparent', color: h ? C.red : C.t3, border: `1px solid ${h ? C.redB : C.bds}`, borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.13s', ...style }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function Inp({ value, onChange, placeholder, type = 'text', disabled, mono }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  type?: string; disabled?: boolean; mono?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <input value={value} onChange={e => onChange(e.target.value)} type={type}
      placeholder={placeholder} disabled={disabled}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', background: disabled ? '#1e1e1e' : C.l2, border: `1px solid ${f ? 'rgba(59,150,143,0.4)' : C.bd}`, borderRadius: 9, padding: '10px 14px', color: disabled ? C.t3 : C.t1, fontSize: 13, outline: 'none', fontFamily: mono ? MONO : FONT, boxSizing: 'border-box', opacity: disabled ? 0.55 : 1, transition: 'border-color 0.15s' }} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  const [f, setF] = useState(false);
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', background: C.l2, border: `1px solid ${f ? 'rgba(59,150,143,0.4)' : C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', resize: 'none', lineHeight: 1.65, transition: 'border-color 0.15s' }} />
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 7 }}>{children}</div>;
}

function GroupHead({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{children}</div>;
}

function Pills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${value === o ? C.tealB : C.bds}`, background: value === o ? C.tealT : C.l2, color: value === o ? C.teal : C.t2, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s' }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      style={{ width: 36, height: 20, borderRadius: 10, background: on ? C.teal : C.l3, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.18s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.18s' }} />
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, width = 480 }: {
  title: string; onClose: () => void; children: React.ReactNode; width?: number;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: width, background: C.l1, border: `1px solid ${C.bd}`, borderRadius: 16, padding: '26px 28px', boxShadow: '0 32px 96px rgba(0,0,0,0.65)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.t1, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', padding: 4, borderRadius: 6, transition: 'color 0.12s' }}
            onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
            onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── BreadCrumb ────────────────────────────────────────────────────────

function BreadCrumb({ onBack, backLabel, label }: { onBack: () => void; backLabel: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 13px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }}
        onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
        <ArrowLeft size={13} /> {backLabel}
      </button>
      <ChevronRight size={12} color={C.t3} />
      <span style={{ fontSize: 13, color: C.t2 }}>{label}</span>
    </div>
  );
}

// ── SaveBar ───────────────────────────────────────────────────────────

function SaveBar({ dirty, onSave, onCancel, saveLabel, cancelLabel, msg }: {
  dirty: boolean; onSave: () => void; onCancel: () => void;
  saveLabel?: string; cancelLabel?: string; msg?: string;
}) {
  if (!dirty) return null;
  return (
    <div style={{ position: 'sticky', bottom: 0, zIndex: 10, marginTop: 16, background: 'rgba(33,33,33,0.95)', border: `1px solid ${C.bds}`, borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, backdropFilter: 'blur(12px)' }}>
      <span style={{ fontSize: 12, color: C.t3 }}>{msg || 'Modifications non enregistrées'}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <GhostBtn onClick={onCancel} style={{ height: 34, fontSize: 12 }}>{cancelLabel || 'Annuler'}</GhostBtn>
        <TealBtn onClick={onSave} style={{ height: 34, fontSize: 12 }}><Check size={12} /> {saveLabel || 'Enregistrer'}</TealBtn>
      </div>
    </div>
  );
}

// ── RowItem (sans boîte d'icône) ──────────────────────────────────────

function RowItem({ icon, label, sub, val, isLast, onClick }: {
  icon: React.ReactNode; label: string; sub: string; val: string; isLast: boolean; onClick: () => void;
}) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 22px', borderBottom: isLast ? 'none' : `1px solid ${C.bds}`, cursor: 'pointer', background: h ? 'rgba(255,255,255,0.025)' : 'transparent', transition: 'background 0.12s' }}>
      <span style={{ color: C.t3, flexShrink: 0, display: 'flex' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{label}</div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{sub}</div>
      </div>
      {val && <span style={{ fontSize: 12, color: C.t3, marginRight: 4, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', fontFamily: MONO }}>{val}</span>}
      <ChevronRight size={14} color={C.t3} style={{ flexShrink: 0 }} />
    </div>
  );
}

// ── NavCard (carte de navigation en grille) ───────────────────────────

function NavCard({ icon, label, sub, val, onClick }: {
  icon: React.ReactNode; label: string; sub: string; val?: string; onClick: () => void;
}) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? '#252525' : C.l1, border: `1px solid ${h ? C.bd : C.bds}`, borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.14s', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 110 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ color: C.t3, display: 'flex' }}>{icon}</span>
        <ChevronRight size={14} color={C.t3} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{sub}</div>
      </div>
      {val && <div style={{ fontSize: 11, color: C.t3, fontFamily: MONO, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 'auto' }}>{val}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────

function ProfileMain({ form, setPage, flash, lang }: {
  form: ProfileData; setPage: (p: ProfilePage) => void; flash: boolean; lang: Lang;
}) {
  const T = I[lang];
  const location = [form.city, form.country].filter(Boolean).join(', ');
  const fr = lang === 'fr';

  const navCards = [
    { id: 'identity'    as ProfilePage, icon: <Building2 size={16} />, label: T.identity,  sub: T.identitySub,  val: form.companyName || undefined },
    { id: 'director'    as ProfilePage, icon: <User      size={16} />, label: T.director,  sub: T.directorSub,  val: form.directorName || undefined },
    { id: 'address'     as ProfilePage, icon: <MapPin    size={16} />, label: T.address,   sub: T.addressSub,   val: location || undefined },
    { id: 'legal'       as ProfilePage, icon: <FileText  size={16} />, label: T.legal,     sub: T.legalSub,     val: form.rccm || undefined },
    { id: 'security'    as ProfilePage, icon: <Shield    size={16} />, label: T.security,  sub: T.securitySub,  val: T.devices },
    { id: 'preferences' as ProfilePage, icon: <Settings  size={16} />, label: T.prefs,     sub: T.prefsSub,     val: form.language },
    { id: 'api'         as ProfilePage, icon: <Code      size={16} />, label: T.api,       sub: T.apiSub,       val: T.activeKeys },
    { id: 'billing'     as ProfilePage, icon: <CreditCard size={16} />,label: T.billing,   sub: T.billingSub,   val: T.plan },
  ];

  const kycLevels = [
    { n: 1, label: fr ? 'Basique'    : 'Basic',    limit: '5 000 USDT',    state: 'done'   as const },
    { n: 2, label: fr ? 'Entreprise' : 'Business', limit: '50 000 USDT',   state: 'active' as const },
    { n: 3, label: fr ? 'Avancé'    : 'Advanced',  limit: '200 000 USDT',  state: 'locked' as const },
    { n: 4, label: 'Premium',                       limit: fr ? 'Illimitée' : 'Unlimited', state: 'locked' as const },
  ];

  return (
    <div style={{ fontFamily: FONT, color: C.t1 }}>
      {flash && (
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(59,150,143,0.07)', border: `1px solid rgba(59,150,143,0.2)`, borderRadius: 10, fontSize: 13, color: C.t2 }}>
          <Check size={13} color={C.teal} /> {T.saved}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* ══ COLONNE GAUCHE ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Héro — style Conformité / Trésorerie */}
          <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '28px 28px 24px', boxShadow: '0 4px 32px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
              <Building2 size={15} color={C.t3} />
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{T.back}</span>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 6 }}>{fr ? 'Raison sociale' : 'Legal name'}</div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: form.companyName ? C.t1 : C.t3, marginBottom: 8 }}>
                {form.companyName || T.yourCo}
              </div>
              <div style={{ fontSize: 13, color: C.t3 }}>
                {[form.businessType, form.sector].filter(Boolean).join(' · ') || T.complete}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              {[
                { v: '4',      l: T.members },
                { v: '27',     l: T.txMonth },
                { v: '6 mois', l: T.since },
              ].map((s, i, arr) => (
                <div key={s.l} style={{ paddingRight: i < arr.length - 1 ? 24 : 0, borderRight: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontFamily: MONO, marginBottom: 3 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: C.t3 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <TealBtn onClick={() => setPage('identity')} style={{ height: 36, fontSize: 12 }}>
                <Edit3 size={13} /> {T.edit}
              </TealBtn>
              <GhostBtn onClick={() => setPage('security')} style={{ height: 36, fontSize: 12 }}>
                <Shield size={13} /> {T.secBtn}
              </GhostBtn>
              <GhostBtn onClick={() => setPage('api')} style={{ height: 36, fontSize: 12 }}>
                <Code size={13} /> {T.apiBtn}
              </GhostBtn>
            </div>
          </div>

          {/* Grille 2 colonnes de cartes de navigation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {navCards.map(c => (
              <NavCard key={c.id} icon={c.icon} label={c.label} sub={c.sub} val={c.val} onClick={() => setPage(c.id)} />
            ))}
          </div>
        </div>

        {/* ══ COLONNE DROITE (sticky) ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>

          {/* Carte identité */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '22px 22px 18px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: HERO_BG, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={20} color={C.t3} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: form.companyName ? C.t1 : C.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {form.companyName || T.yourCo}
                </div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
                  {[form.businessType, form.sector].filter(Boolean).join(' · ') || '—'}
                </div>
              </div>
            </div>
            <div style={{ padding: '4px 0' }}>
              {[
                { l: fr ? 'Dirigeant'    : 'Director',    v: form.directorName  || '—' },
                { l: fr ? 'Localisation' : 'Location',    v: location            || '—' },
                { l: 'RCCM',                               v: form.rccm          || '—' },
                { l: 'NINEA',                              v: form.ninea         || '—' },
                { l: fr ? 'Capital'      : 'Share capital',v: form.capital ? `${form.capital} FCFA` : '—' },
              ].map((r, i, arr) => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 22px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>{r.l}</span>
                  <span style={{ fontSize: 12, color: r.v === '—' ? C.t3 : C.t2, fontFamily: MONO, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Niveaux KYC */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <GroupHead>{fr ? 'Niveaux KYC' : 'KYC Levels'}</GroupHead>
            </div>
            {kycLevels.map((lv, i, arr) => (
              <div key={lv.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none', opacity: lv.state === 'locked' ? 0.4 : 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: lv.state === 'done' ? 'rgba(255,255,255,0.06)' : lv.state === 'active' ? C.tealT : C.l2, border: `1px solid ${lv.state === 'done' ? C.bd : lv.state === 'active' ? C.tealB : C.bds}`, flexShrink: 0 }}>
                  {lv.state === 'done'   && <Check size={12} color={C.t2} strokeWidth={2.5} />}
                  {lv.state === 'active' && <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, fontFamily: MONO }}>{lv.n}</span>}
                  {lv.state === 'locked' && <Lock size={11} color={C.t3} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: lv.state === 'active' ? C.t1 : C.t2 }}>
                    {fr ? `Niveau ${lv.n}` : `Level ${lv.n}`} — {lv.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>{lv.limit}{fr ? '/mois' : '/month'}</div>
                </div>
                {lv.state === 'active' && (
                  <span style={{ fontSize: 10, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 5, padding: '2px 8px', flexShrink: 0 }}>
                    {fr ? 'Actif' : 'Active'}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Contact rapide */}
          {(form.companyEmail || form.companyPhone || form.website) && (
            <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.bds}` }}>
                <GroupHead>{fr ? 'Contact' : 'Contact'}</GroupHead>
              </div>
              {[
                form.companyEmail && { icon: <Mail size={13} color={C.t3} />, v: form.companyEmail },
                form.companyPhone && { icon: <Phone size={13} color={C.t3} />, v: form.companyPhone },
                form.website      && { icon: <Globe size={13} color={C.t3} />, v: form.website },
              ].filter(Boolean).map((r: any, i, arr) => (
                <div key={r.v} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  {r.icon}
                  <span style={{ fontSize: 12, color: C.t2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// IDENTITÉ
// ─────────────────────────────────────────────────────────────────────

function IdentityPage({ form, onBack, onSave, lang }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void; lang: Lang }) {
  const T = I[lang];
  const [d, setD] = useState({ companyName: form.companyName, businessType: form.businessType, sector: form.sector, description: form.description, website: form.website, companyPhone: form.companyPhone, companyEmail: form.companyEmail });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const init = d.companyName ? d.companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'TS';
  const orig = { companyName: form.companyName, businessType: form.businessType, sector: form.sector, description: form.description, website: form.website, companyPhone: form.companyPhone, companyEmail: form.companyEmail };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={T.back} label={T.identity} />

      {/* Héro */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', boxShadow: '0 4px 32px rgba(0,0,0,0.35)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(145deg, #2a2a2a, #1c1c1c)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>{init}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: d.companyName ? C.t1 : C.t3, letterSpacing: '-0.025em', marginBottom: 5 }}>{d.companyName || T.yourCo}</div>
          <div style={{ fontSize: 13, color: C.t3 }}>{[d.businessType, d.sector].filter(Boolean).join(' · ') || T.complete}</div>
        </div>
        {(d.companyPhone || d.companyEmail) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            {d.companyPhone && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.t3 }}><Phone size={11} color={C.t3} /> {d.companyPhone}</div>}
            {d.companyEmail && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.t3 }}><Mail size={11} color={C.t3} /> {d.companyEmail}</div>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
            <GroupHead>{lang === 'en' ? 'Legal name & Contacts' : 'Raison sociale & Contacts'}</GroupHead>
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>{lang === 'en' ? 'Official legal name' : 'Raison sociale officielle'}</Lbl>
                <Inp value={d.companyName} onChange={set('companyName')} placeholder="Ex : Terex International SARL" />
              </div>
              <div><Lbl>{lang === 'en' ? 'Business phone' : 'Téléphone professionnel'}</Lbl><Inp value={d.companyPhone} onChange={set('companyPhone')} placeholder="+221 77 000 00 00" type="tel" /></div>
              <div><Lbl>{lang === 'en' ? 'Business email' : 'Email professionnel'}</Lbl><Inp value={d.companyEmail} onChange={set('companyEmail')} placeholder="contact@entreprise.sn" type="email" /></div>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Website</Lbl>
                <Inp value={d.website} onChange={set('website')} placeholder="https://entreprise.sn" type="url" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>{lang === 'en' ? 'Business description' : "Description de l'activité"}</Lbl>
                <Textarea value={d.description} onChange={set('description')} placeholder={lang === 'en' ? 'Describe your main activity, markets, products or services…' : 'Décrivez votre activité principale, vos marchés et vos produits ou services…'} rows={4} />
              </div>
            </div>
          </div>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px' }}>
            <GroupHead>{lang === 'en' ? 'Legal type' : 'Forme juridique'}</GroupHead>
            <div style={{ marginTop: 14 }}><Pills options={BIZ_TYPES} value={d.businessType} onChange={set('businessType')} /></div>
          </div>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px' }}>
            <GroupHead>{lang === 'en' ? 'Business sector' : "Secteur d'activité"}</GroupHead>
            <div style={{ marginTop: 14 }}><Pills options={SECTORS} value={d.sector} onChange={set('sector')} /></div>
          </div>
        </div>

        {/* Droite — aperçu + conseils */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 22px' }}>
            <GroupHead>{lang === 'en' ? 'Public profile preview' : 'Aperçu du profil public'}</GroupHead>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: `1px solid ${C.bds}`, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(145deg, #2a2a2a, #1c1c1c)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>{init}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.companyName ? C.t1 : C.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.companyName || (lang === 'en' ? 'Legal name' : 'Raison sociale')}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{[d.businessType, d.sector].filter(Boolean).join(' · ') || '—'}</div>
              </div>
            </div>
            {[
              { k: lang === 'en' ? 'Website' : 'Site web', v: d.website || '—' },
              { k: lang === 'en' ? 'Phone' : 'Téléphone', v: d.companyPhone || '—' },
              { k: 'Email', v: d.companyEmail || '—' },
            ].map((r, i, a) => (
              <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < a.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.k}</span>
                <span style={{ fontSize: 12, color: r.v === '—' ? C.t3 : C.t2, fontFamily: MONO, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t2, marginBottom: 10 }}>{lang === 'en' ? 'Good to know' : 'À savoir'}</div>
            <ul style={{ color: C.t3, fontSize: 12, margin: 0, padding: '0 0 0 16px', lineHeight: 2.1 }}>
              <li>{lang === 'en' ? 'Legal name must match your RCCM exactly' : 'La raison sociale doit correspondre exactement à votre RCCM'}</li>
              <li>{lang === 'en' ? 'Business email receives all confirmations' : "L'email professionnel reçoit toutes les confirmations"}</li>
              <li>{lang === 'en' ? 'Description improves your Terex trust score' : 'La description améliore votre score de confiance Terex'}</li>
            </ul>
          </div>
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} saveLabel={T.save} cancelLabel={T.cancel} msg={T.unsaved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// DIRIGEANT
// ─────────────────────────────────────────────────────────────────────

function DirectorPage({ form, onBack, onSave, lang }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void; lang: Lang }) {
  const T = I[lang];
  const [d, setD] = useState({ directorName: form.directorName, directorRole: form.directorRole, directorEmail: form.directorEmail, directorPhone: form.directorPhone });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const orig = { directorName: form.directorName, directorRole: form.directorRole, directorEmail: form.directorEmail, directorPhone: form.directorPhone };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);
  const initials = d.directorName ? d.directorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={T.back} label={T.director} />

      {/* Héro */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '28px 32px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap', boxShadow: '0 4px 32px rgba(0,0,0,0.35)' }}>
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(145deg, #2a2a2a, #1c1c1c)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: d.directorName ? C.t1 : C.t3, letterSpacing: '-0.025em', marginBottom: 5 }}>{d.directorName || (lang === 'en' ? 'Director name' : 'Nom du dirigeant')}</div>
          <div style={{ fontSize: 13, color: C.t3 }}>{d.directorRole || (lang === 'en' ? 'Position' : 'Fonction')}{d.directorPhone ? ` · ${d.directorPhone}` : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { l: lang === 'en' ? 'Terex Role' : 'Rôle Terex',   v: lang === 'en' ? 'Owner' : 'Propriétaire' },
            { l: lang === 'en' ? 'Identity KYC' : 'KYC identité', v: lang === 'en' ? 'Submitted' : 'Soumise' },
          ].map((s, i, arr) => (
            <div key={s.l} style={{ textAlign: 'center', paddingRight: i < arr.length - 1 ? 24 : 0, borderRight: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
              <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>{s.l}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]" style={{ gap: 14, alignItems: 'start' }}>
        {/* Gauche — statuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.bds}` }}>
              <GroupHead>{lang === 'en' ? 'Access & Verification' : 'Accès & Vérification'}</GroupHead>
            </div>
            {[
              { label: lang === 'en' ? 'Terex role'        : 'Rôle sur Terex',    value: lang === 'en' ? 'Owner'    : 'Propriétaire',  ok: true  },
              { label: lang === 'en' ? 'Identity KYC'      : 'KYC identité',      value: lang === 'en' ? 'ID submitted' : 'CNI soumise', ok: true  },
              { label: lang === 'en' ? 'Email verified'    : 'Email vérifié',     value: d.directorEmail || '—',                        ok: !!d.directorEmail },
              { label: lang === 'en' ? 'Phone verified'    : 'Téléphone vérifié', value: d.directorPhone || '—',                        ok: !!d.directorPhone },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 22px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.ok && <Check size={11} color={C.t3} strokeWidth={2.5} />}
                  <span style={{ fontSize: 12, color: r.ok ? C.t2 : C.t3, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10 }}>
            <AlertCircle size={13} color={C.t3} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.7 }}>
              {lang === 'en'
                ? 'The legal representative is responsible for all KYC procedures. Their identity must match submitted documents.'
                : 'Le représentant légal est responsable de toute procédure KYC. Son identité doit correspondre aux documents soumis.'}
            </p>
          </div>
        </div>

        {/* Droite — formulaire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>{lang === 'en' ? 'Full name' : 'Nom complet'}</Lbl>
                <Inp value={d.directorName} onChange={set('directorName')} placeholder={lang === 'en' ? 'First Last' : 'Prénom Nom'} />
              </div>
              <div><Lbl>Email</Lbl><Inp value={d.directorEmail} onChange={set('directorEmail')} placeholder="prenom@entreprise.sn" type="email" /></div>
              <div><Lbl>{lang === 'en' ? 'Direct phone' : 'Téléphone direct'}</Lbl><Inp value={d.directorPhone} onChange={set('directorPhone')} placeholder="+221 77 000 00 00" type="tel" /></div>
            </div>
          </div>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px' }}>
            <Lbl>{lang === 'en' ? 'Position / Role' : 'Fonction / Poste'}</Lbl>
            <div style={{ marginTop: 4 }}><Pills options={DIR_ROLES} value={d.directorRole} onChange={set('directorRole')} /></div>
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} saveLabel={T.save} cancelLabel={T.cancel} msg={T.unsaved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SIÈGE SOCIAL
// ─────────────────────────────────────────────────────────────────────

function AddressPage({ form, onBack, onSave, lang }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void; lang: Lang }) {
  const T = I[lang];
  const [d, setD] = useState({ address: form.address, city: form.city, postalCode: form.postalCode, country: form.country });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const orig = { address: form.address, city: form.city, postalCode: form.postalCode, country: form.country };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);
  const full = [d.address, d.postalCode, d.city, d.country].filter(Boolean).join(', ');

  return (
    <div style={{ fontFamily: FONT, maxWidth: 720, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={T.back} label={T.address} />

      {/* Héro adresse */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 32px rgba(0,0,0,0.35)' }}>
        <MapPin size={22} color={C.t3} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: full ? C.t1 : C.t3, lineHeight: 1.5, marginBottom: 4 }}>{full || (lang === 'en' ? 'No address entered' : 'Adresse non renseignée')}</div>
          <div style={{ fontSize: 11, color: C.t3 }}>{lang === 'en' ? 'Reference address for RCCM and supporting documents' : 'Adresse de référence pour le RCCM et les justificatifs'}</div>
        </div>
      </div>

      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 24px', marginBottom: 14 }}>
        <Lbl>{lang === 'en' ? 'Country' : 'Pays'}</Lbl>
        <Pills options={COUNTRIES} value={d.country} onChange={set('country')} />
      </div>

      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <Lbl>{lang === 'en' ? 'Street and number' : 'Rue et numéro'}</Lbl>
            <Inp value={d.address} onChange={set('address')} placeholder={lang === 'en' ? 'Ex: 45 Léopold Sédar Senghor Ave.' : 'Ex : 45 Avenue Léopold Sédar Senghor'} />
          </div>
          <div><Lbl>{lang === 'en' ? 'City' : 'Ville'}</Lbl><Inp value={d.city} onChange={set('city')} placeholder="Dakar, Abidjan…" /></div>
          <div><Lbl>{lang === 'en' ? 'Postal code' : 'Code postal'}</Lbl><Inp value={d.postalCode} onChange={set('postalCode')} placeholder="10700" /></div>
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} saveLabel={T.save} cancelLabel={T.cancel} msg={T.unsaved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// LÉGAL & FISCAL
// ─────────────────────────────────────────────────────────────────────

function LegalPage({ form, onBack, onSave, lang }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void; lang: Lang }) {
  const T = I[lang];
  const [d, setD] = useState({ rccm: form.rccm, ninea: form.ninea, capital: form.capital, foundedYear: form.foundedYear });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const orig = { rccm: form.rccm, ninea: form.ninea, capital: form.capital, foundedYear: form.foundedYear };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);

  const cards = [
    { title: 'RCCM',    value: d.rccm    || '—', sub: 'Registre de Commerce (OHADA)', ok: !!d.rccm    },
    { title: 'NINEA',   value: d.ninea   || '—', sub: lang === 'en' ? 'Senegalese tax identifier' : 'Identifiant fiscal Sénégal', ok: !!d.ninea   },
    { title: lang === 'en' ? 'Share capital' : 'Capital', value: d.capital ? `${d.capital} FCFA` : '—', sub: lang === 'en' ? 'Declared share capital' : 'Capital social déclaré', ok: !!d.capital },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={T.back} label={T.legal} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
        {cards.map(s => (
          <div key={s.title} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 13, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{s.title}</span>
              {s.ok && <Check size={12} color={C.t3} strokeWidth={2.5} />}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.ok ? C.t1 : C.t3, fontFamily: MONO, letterSpacing: '0.01em', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px', marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <Lbl>RCCM — {lang === 'en' ? 'Commercial & Mobile Credit Register' : 'Registre du Commerce et du Crédit Mobilier'}</Lbl>
            <Inp value={d.rccm} onChange={set('rccm')} placeholder="Ex : SN-DKR-2021-B-12345" mono />
            <div style={{ fontSize: 10, color: C.t3, marginTop: 5 }}>{lang === 'en' ? 'Issued by the Commercial Court of Dakar or competent region' : 'Délivré par le Tribunal de Commerce de Dakar ou la région compétente'}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Lbl>NINEA — {lang === 'en' ? 'National Business & Association Identifier' : "Numéro d'Identification Nationale des Entreprises et Associations"}</Lbl>
            <Inp value={d.ninea} onChange={set('ninea')} placeholder="Ex : 007654321 2Z3" mono />
            <div style={{ fontSize: 10, color: C.t3, marginTop: 5 }}>{lang === 'en' ? 'Obtained from the General Directorate of Taxes (DGID)' : 'Obtenu auprès de la Direction Générale des Impôts et Domaines (DGID)'}</div>
          </div>
          <div>
            <Lbl>{lang === 'en' ? 'Share capital (FCFA)' : 'Capital social (FCFA)'}</Lbl>
            <Inp value={d.capital} onChange={set('capital')} placeholder="Ex : 1 000 000" />
          </div>
          <div>
            <Lbl>{lang === 'en' ? 'Founding year' : 'Année de création'}</Lbl>
            <Inp value={d.foundedYear} onChange={set('foundedYear')} placeholder="Ex : 2019" />
          </div>
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} saveLabel={T.save} cancelLabel={T.cancel} msg={T.unsaved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SÉCURITÉ
// ─────────────────────────────────────────────────────────────────────

function SecurityPage({ onBack, lang }: { onBack: () => void; lang: Lang }) {
  const [twofa, setTwofa]   = useState(false);
  const [setup, setSetup]   = useState(false);
  const [oldPwd, setOld]    = useState('');
  const [newPwd, setNew]    = useState('');
  const [showO, setShowO]   = useState(false);
  const [showN, setShowN]   = useState(false);
  const [pwdOk, setPwdOk]   = useState(false);

  const sessions = [
    { device: 'Chrome · macOS 14',    ip: '41.82.xxx.xxx',   loc: 'Dakar, SN',   when: lang === 'en' ? 'Now'       : 'Maintenant',     cur: true  },
    { device: 'Safari · iPhone 14',   ip: '41.82.xxx.xxx',   loc: 'Dakar, SN',   when: lang === 'en' ? '2h ago'    : 'Il y a 2h',       cur: false },
    { device: 'Firefox · Windows 11', ip: '154.12.xxx.xxx',  loc: 'Abidjan, CI', when: lang === 'en' ? '3 days ago': 'Il y a 3 jours',  cur: false },
    { device: 'Chrome · Android',     ip: '197.234.xxx.xxx', loc: 'Dakar, SN',   when: lang === 'en' ? '5 days ago': 'Il y a 5 jours',  cur: false },
  ];

  const fr = lang === 'fr';

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={I[lang].back} label={I[lang].security} />

      {/* Héro sécurité */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 32px rgba(0,0,0,0.35)' }}>
        <Shield size={24} color={C.t3} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.t1, letterSpacing: '-0.02em', marginBottom: 4 }}>{fr ? 'Sécurité du compte' : 'Account Security'}</div>
          <div style={{ fontSize: 12, color: C.t3 }}>{fr ? `${sessions.length} appareils actifs · Dernière connexion : Maintenant` : `${sessions.length} active devices · Last sign-in: Now`}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Mot de passe */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Lock size={16} color={C.t3} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{fr ? 'Mot de passe' : 'Password'}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>{fr ? 'Modifié il y a 3 mois' : 'Last changed 3 months ago'}</div>
            </div>
          </div>
          {pwdOk ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'rgba(59,150,143,0.07)', borderRadius: 9, border: `1px solid rgba(59,150,143,0.2)` }}>
              <Check size={13} color={C.teal} />
              <span style={{ fontSize: 13, color: C.t2 }}>{fr ? 'Mot de passe mis à jour' : 'Password updated'}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Lbl>{fr ? 'Mot de passe actuel' : 'Current password'}</Lbl>
                <div style={{ position: 'relative' }}>
                  <Inp value={oldPwd} onChange={setOld} placeholder="••••••••" type={showO ? 'text' : 'password'} />
                  <button onClick={() => setShowO(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                    {showO ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div>
                <Lbl>{fr ? 'Nouveau mot de passe' : 'New password'}</Lbl>
                <div style={{ position: 'relative' }}>
                  <Inp value={newPwd} onChange={setNew} placeholder={fr ? '8 caractères minimum' : 'At least 8 characters'} type={showN ? 'text' : 'password'} />
                  <button onClick={() => setShowN(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                    {showN ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {newPwd.length > 0 && newPwd.length < 8 && (
                  <div style={{ fontSize: 11, color: C.red, marginTop: 5 }}>{fr ? 'Minimum 8 caractères' : 'Minimum 8 characters'}</div>
                )}
              </div>
              <TealBtn onClick={() => { if (oldPwd && newPwd.length >= 8) { setPwdOk(true); setOld(''); setNew(''); setTimeout(() => setPwdOk(false), 3000); } }} disabled={!oldPwd || newPwd.length < 8} style={{ alignSelf: 'flex-start', fontSize: 12, height: 34 }}>
                {fr ? 'Mettre à jour' : 'Update password'}
              </TealBtn>
            </div>
          )}
        </div>

        {/* 2FA */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Zap size={16} color={C.t3} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{fr ? 'Authentification 2FA' : '2FA Authentication'}</div>
                <div style={{ fontSize: 11, color: twofa ? C.t2 : C.t3, marginTop: 1 }}>{twofa ? (fr ? 'Activée — application OTP' : 'Enabled — OTP app') : (fr ? 'Désactivée' : 'Disabled')}</div>
              </div>
            </div>
            <Toggle on={twofa} onChange={v => { setTwofa(v); setSetup(v); }} />
          </div>
          {setup ? (
            <div style={{ background: C.l2, borderRadius: 10, padding: '16px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.t2, margin: '0 0 12px' }}>{fr ? 'Configurer via Google Authenticator ou Authy' : 'Set up via Google Authenticator or Authy'}</p>
              <div style={{ width: 88, height: 88, background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Hash size={28} color={C.t3} />
              </div>
              <Lbl>{fr ? 'Code de vérification' : 'Verification code'}</Lbl>
              <div style={{ display: 'flex', gap: 8 }}>
                <Inp value="" onChange={() => {}} placeholder="000000" mono />
                <TealBtn style={{ flexShrink: 0, fontSize: 12, height: 38 }}>OK</TealBtn>
              </div>
            </div>
          ) : (
            <div style={{ padding: '14px 16px', background: C.l2, borderRadius: 9, fontSize: 12, color: C.t3, lineHeight: 1.7 }}>
              {fr ? 'Activez la 2FA pour sécuriser votre compte contre les accès non autorisés. Fortement recommandée pour les comptes à haut volume.' : 'Enable 2FA to secure your account against unauthorized access. Strongly recommended for high-volume accounts.'}
            </div>
          )}
        </div>
      </div>

      {/* Sessions */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Monitor size={15} color={C.t3} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{fr ? 'Sessions actives' : 'Active sessions'}</span>
          </div>
          <span style={{ fontSize: 11, color: C.t3 }}>{sessions.length} {fr ? 'appareils connectés' : 'connected devices'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 24px', borderBottom: i < sessions.length - 2 ? `1px solid ${C.bds}` : 'none', borderRight: i % 2 === 0 ? `1px solid ${C.bds}` : 'none' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.cur ? C.teal : C.l3, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.device}</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{s.loc} · {s.ip} · {s.when}</div>
              </div>
              {s.cur
                ? <span style={{ fontSize: 11, color: C.t3, flexShrink: 0 }}>{fr ? 'Actuelle' : 'Current'}</span>
                : <DangerBtn onClick={() => {}} style={{ padding: '0 10px', height: 28, fontSize: 11 }}>{fr ? 'Révoquer' : 'Revoke'}</DangerBtn>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PRÉFÉRENCES
// ─────────────────────────────────────────────────────────────────────

function PreferencesPage({ form, onBack, onSave, lang: currentLang }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void; lang: Lang }) {
  const [d, setD] = useState({ language: form.language, currency: form.currency, timezone: form.timezone, notifEmail: form.notifEmail, notifSms: form.notifSms, notifPush: form.notifPush });
  const orig = { language: form.language, currency: form.currency, timezone: form.timezone, notifEmail: form.notifEmail, notifSms: form.notifSms, notifPush: form.notifPush };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);
  const fr = currentLang === 'fr';
  const T = I[currentLang];

  const notifs = [
    { k: 'notifEmail' as const, label: 'Email', sub: fr ? 'Confirmations, alertes, récapitulatifs mensuels' : 'Confirmations, alerts, monthly summaries' },
    { k: 'notifSms'   as const, label: 'SMS',   sub: fr ? 'Codes 2FA et alertes critiques uniquement' : '2FA codes and critical alerts only' },
    { k: 'notifPush'  as const, label: 'Push',  sub: fr ? "Notifications en temps réel sur l'appareil" : 'Real-time device notifications' },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 720, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={T.back} label={T.prefs} />

      {/* Héro préférences */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '22px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.35)' }}>
        <Settings size={22} color={C.t3} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{fr ? 'Préférences de l\'interface' : 'Interface preferences'}</div>
          <div style={{ fontSize: 12, color: C.t3 }}>{d.language} · {d.currency} · {d.timezone.split('/')[1]}</div>
        </div>
        {d.language !== form.language && (
          <div style={{ fontSize: 11, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, borderRadius: 6, padding: '3px 10px' }}>
            {fr ? 'Langue modifiée — rechargez après sauvegarde' : 'Language changed — reload after saving'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Interface */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 22px', borderBottom: `1px solid ${C.bds}` }}>
            <GroupHead>{fr ? 'Interface' : 'Display'}</GroupHead>
          </div>
          {[
            { label: fr ? 'Langue' : 'Language', sub: fr ? "Langue de l'interface Terex" : 'Terex interface language', options: ['Français', 'English'], k: 'language' as const },
            { label: fr ? "Devise d'affichage" : 'Display currency', sub: fr ? 'Devise principale pour les montants' : 'Primary currency for amounts', options: ['USDT', 'FCFA', 'EUR', 'USD'], k: 'currency' as const },
          ].map((row, ri, rarr) => (
            <div key={row.k} style={{ padding: '18px 22px', borderBottom: ri < rarr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 13 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{row.sub}</div>
                </div>
                <span style={{ fontSize: 12, color: C.t2, fontFamily: MONO }}>{d[row.k]}</span>
              </div>
              <Pills options={row.options} value={d[row.k]} onChange={v => setD(p => ({ ...p, [row.k]: v }))} />
            </div>
          ))}
        </div>

        {/* Fuseau */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 13 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{fr ? 'Fuseau horaire' : 'Timezone'}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{fr ? 'Utilisé pour les horodatages des transactions' : 'Used for transaction timestamps'}</div>
            </div>
            <span style={{ fontSize: 12, color: C.t2 }}>{d.timezone.split('/')[1]}</span>
          </div>
          <Pills options={['Africa/Dakar', 'Africa/Abidjan', 'Africa/Bamako', 'Africa/Lagos', 'Europe/Paris']} value={d.timezone} onChange={v => setD(p => ({ ...p, timezone: v }))} />
        </div>

        {/* Notifications */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 22px', borderBottom: `1px solid ${C.bds}` }}>
            <GroupHead>{fr ? 'Notifications' : 'Notifications'}</GroupHead>
          </div>
          {notifs.map((n, i) => (
            <div key={n.k} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderBottom: i < notifs.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{n.sub}</div>
              </div>
              <Toggle on={d[n.k]} onChange={v => setD(p => ({ ...p, [n.k]: v }))} />
            </div>
          ))}
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} saveLabel={T.save} cancelLabel={T.cancel} msg={T.unsaved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FACTURATION
// ─────────────────────────────────────────────────────────────────────

function BillingPage({ onBack, lang }: { onBack: () => void; lang: Lang }) {
  const fr = lang === 'fr';
  const invoices = [
    { ref: 'TRX-2025-042', date: fr ? 'Avr 2025' : 'Apr 2025', plan: 'Starter', amount: '0 FCFA', status: fr ? 'Payée' : 'Paid' },
    { ref: 'TRX-2025-031', date: fr ? 'Mar 2025' : 'Mar 2025', plan: 'Starter', amount: '0 FCFA', status: fr ? 'Payée' : 'Paid' },
    { ref: 'TRX-2025-020', date: fr ? 'Fév 2025' : 'Feb 2025', plan: 'Starter', amount: '0 FCFA', status: fr ? 'Payée' : 'Paid' },
  ];

  const plans = [
    { name: 'Starter',    price: fr ? 'Gratuit' : 'Free',    limit: fr ? '5 000 USDT/mois' : '5,000 USDT/month', features: [fr ? '3 membres' : '3 members', fr ? 'KYC Niveau 1' : 'KYC Level 1', fr ? 'Support email' : 'Email support'],   current: true  },
    { name: 'Business',   price: fr ? '25 000 FCFA/mois' : '25,000 FCFA/mo', limit: fr ? '100 000 USDT/mois' : '100,000 USDT/month', features: [fr ? '10 membres' : '10 members', fr ? 'KYC Niveaux 2–3' : 'KYC Levels 2–3', fr ? 'Support prioritaire' : 'Priority support'], current: false },
    { name: 'Enterprise', price: fr ? 'Sur devis' : 'Custom', limit: fr ? 'Illimitée' : 'Unlimited', features: [fr ? 'Membres illimités' : 'Unlimited members', fr ? 'SLA garanti' : 'Guaranteed SLA', fr ? 'Gestionnaire dédié' : 'Dedicated manager'], current: false },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={I[lang].back} label={I[lang].billing} />

      {/* Héro */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 32px rgba(0,0,0,0.35)' }}>
        <CreditCard size={22} color={C.t3} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{fr ? 'Plan actuel — Starter' : 'Current plan — Starter'}</div>
          <div style={{ fontSize: 12, color: C.t3 }}>{fr ? 'Gratuit · Renouvelé automatiquement chaque mois' : 'Free · Automatically renewed each month'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.t1, fontFamily: MONO }}>0 FCFA</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{fr ? 'ce mois' : 'this month'}</div>
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
        {plans.map(p => (
          <div key={p.name} style={{ background: p.current ? HERO_BG : C.l1, border: `1px solid ${p.current ? C.bd : C.bds}`, borderRadius: 14, padding: '22px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{p.name}</span>
              {p.current && <span style={{ fontSize: 10, color: C.t2, background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.bds}`, padding: '3px 8px', borderRadius: 6 }}>{fr ? 'Actuel' : 'Current'}</span>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: p.current ? C.t1 : C.t2, fontFamily: MONO, marginBottom: 3 }}>{p.price}</div>
            <div style={{ fontSize: 11, color: C.t3, marginBottom: 20 }}>{p.limit}</div>
            <div style={{ flex: 1 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <Check size={11} color={C.t3} strokeWidth={2.5} />
                  <span style={{ fontSize: 12, color: C.t3 }}>{f}</span>
                </div>
              ))}
            </div>
            {!p.current && (
              <button style={{ width: '100%', marginTop: 18, padding: '9px 0', background: 'transparent', border: `1px solid ${C.bds}`, borderRadius: 9, color: C.t2, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.13s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
                {fr ? `Passer à ${p.name}` : `Upgrade to ${p.name}`}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Factures */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{fr ? 'Historique des factures' : 'Invoice history'}</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}
            onMouseEnter={e => (e.currentTarget.style.color = C.t2)}
            onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
            <Download size={12} /> {fr ? 'Tout exporter' : 'Export all'}
          </button>
        </div>
        {invoices.map((inv, i) => (
          <div key={inv.ref} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 24px', borderBottom: i < invoices.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{inv.plan} · {inv.date}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2, fontFamily: MONO }}>{inv.ref}</div>
            </div>
            <span style={{ fontSize: 13, fontFamily: MONO, color: C.t2 }}>{inv.amount}</span>
            <span style={{ fontSize: 11, color: C.t3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, borderRadius: 5, padding: '2px 8px' }}>{inv.status}</span>
            <button style={{ display: 'flex', alignItems: 'center', color: C.t3, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.t2)}
              onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
              <Download size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// API & INTÉGRATIONS
// ─────────────────────────────────────────────────────────────────────

function ApiPage({ onBack, lang }: { onBack: () => void; lang: Lang }) {
  const fr = lang === 'fr';
  const [keys, setKeys] = useState([
    { id: 'k1', name: 'Production', key: 'trx_live_4k2j9xa8x1mz3p', requests: 1847, lastUsed: fr ? 'il y a 2 min' : '2 min ago',  active: true  },
    { id: 'k2', name: 'Test',       key: 'trx_test_9m1c4z2r7qp6wv', requests: 342,  lastUsed: fr ? 'il y a 1h'    : '1h ago',      active: true  },
  ]);
  const [show, setShow]       = useState<Record<string, boolean>>({});
  const [copied, setCopied]   = useState<string | null>(null);
  const [modalKey, setModalKey]     = useState(false);
  const [modalWebhook, setModalWebhook] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEnv, setNewEnv]   = useState('production');
  const [webhookUrl, setWhUrl] = useState('');

  function copy(k: string, id: string) {
    navigator.clipboard.writeText(k).catch(() => {});
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  }

  function createKey() {
    if (!newName.trim()) return;
    const prefix = newEnv === 'production' ? 'trx_live_' : 'trx_test_';
    setKeys(p => [...p, { id: `k${Date.now()}`, name: newName.trim(), key: `${prefix}${Math.random().toString(36).slice(2, 16)}`, requests: 0, lastUsed: fr ? 'jamais' : 'never', active: true }]);
    setNewName(''); setModalKey(false);
  }

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      <BreadCrumb onBack={onBack} backLabel={I[lang].back} label={I[lang].api} />

      {/* Héro */}
      <div style={{ background: HERO_BG, border: `1px solid ${C.bds}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', boxShadow: '0 4px 32px rgba(0,0,0,0.35)' }}>
        <Code size={22} color={C.t3} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{fr ? 'API Terex Business' : 'Terex Business API'}</div>
          <div style={{ fontSize: 12, color: C.t3 }}>{fr ? `${keys.length} clés actives · 2 189 requêtes ce mois` : `${keys.length} active keys · 2,189 requests this month`}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <GhostBtn onClick={() => setModalWebhook(true)} style={{ height: 34, fontSize: 12 }}>
            <Zap size={13} /> Webhook
          </GhostBtn>
          <TealBtn onClick={() => setModalKey(true)} style={{ height: 34, fontSize: 12 }}>
            <Plus size={13} /> {fr ? 'Nouvelle clé' : 'New key'}
          </TealBtn>
        </div>
      </div>

      {/* Clés API */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '14px 24px', borderBottom: `1px solid ${C.bds}` }}>
          <GroupHead>{fr ? 'Clés API' : 'API Keys'}</GroupHead>
        </div>
        {keys.map((k, i) => (
          <div key={k.id} style={{ padding: '20px 24px', borderBottom: i < keys.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: k.active ? C.teal : C.l3 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{k.name}</span>
                <span style={{ fontSize: 11, color: C.t3 }}>{k.requests.toLocaleString(fr ? 'fr-FR' : 'en-US')} {fr ? 'requêtes' : 'requests'} · {fr ? 'Dernière utilisation' : 'Last used'} : {k.lastUsed}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => copy(k.key, k.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: copied === k.id ? C.teal : C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, transition: 'color 0.12s' }}>
                  {copied === k.id ? <><Check size={11} /> {fr ? 'Copié' : 'Copied'}</> : <><Copy size={11} /> {fr ? 'Copier' : 'Copy'}</>}
                </button>
                <DangerBtn onClick={() => setKeys(p => p.filter(x => x.id !== k.id))} style={{ height: 28, padding: '0 10px', fontSize: 11 }}>
                  <Trash2 size={11} /> {fr ? 'Supprimer' : 'Delete'}
                </DangerBtn>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: C.l2, borderRadius: 9, border: `1px solid ${C.bds}` }}>
              <Key size={12} color={C.t3} style={{ flexShrink: 0 }} />
              <code style={{ flex: 1, fontSize: 12, color: C.t2, fontFamily: MONO, letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {show[k.id] ? k.key : k.key.slice(0, 16) + '•'.repeat(6)}
              </code>
              <button onClick={() => setShow(p => ({ ...p, [k.id]: !p[k.id] }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', transition: 'color 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.t2)}
                onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
                {show[k.id] ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        ))}
        {keys.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: C.t3, fontSize: 13 }}>
            {fr ? 'Aucune clé API — créez-en une pour commencer' : 'No API keys — create one to get started'}
          </div>
        )}
      </div>

      {/* Stats + infos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 22px', borderBottom: `1px solid ${C.bds}` }}>
            <GroupHead>{fr ? 'Utilisation ce mois' : 'Usage this month'}</GroupHead>
          </div>
          {[
            { label: fr ? 'Requêtes totales'  : 'Total requests',   value: '2 189' },
            { label: fr ? 'Limite mensuelle'  : 'Monthly limit',    value: '100 000' },
            { label: fr ? 'Webhooks envoyés'  : 'Webhooks sent',    value: '847' },
            { label: fr ? "Taux d'erreur"     : 'Error rate',       value: '0.14 %' },
            { label: fr ? 'Latence moyenne'   : 'Avg. latency',     value: '120 ms' },
          ].map((r, i, arr) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 22px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
              <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
              <span style={{ fontSize: 12, fontFamily: MONO, color: C.t1 }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 22px', borderBottom: `1px solid ${C.bds}` }}>
            <GroupHead>{fr ? 'Événements webhook' : 'Webhook events'}</GroupHead>
          </div>
          <div style={{ padding: '16px 22px' }}>
            <div style={{ fontSize: 12, color: C.t3, marginBottom: 14 }}>
              {fr ? 'Recevez les mises à jour en temps réel dans votre serveur.' : 'Receive real-time updates to your server.'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {['transaction.created', 'transaction.completed', 'kyc.updated', 'limit.changed', 'payment.failed'].map(e => (
                <span key={e} style={{ fontSize: 11, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, padding: '4px 9px', borderRadius: 6, fontFamily: MONO }}>{e}</span>
              ))}
            </div>
            <GhostBtn onClick={() => setModalWebhook(true)} style={{ width: '100%', height: 34, fontSize: 12 }}>
              <Zap size={12} /> {fr ? 'Configurer le webhook' : 'Configure webhook'}
            </GhostBtn>
          </div>
        </div>
      </div>

      {/* Modal : Nouvelle clé */}
      {modalKey && (
        <Modal title={fr ? 'Nouvelle clé API' : 'New API key'} onClose={() => setModalKey(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Lbl>{fr ? 'Nom de la clé' : 'Key name'}</Lbl>
              <Inp value={newName} onChange={setNewName} placeholder={fr ? 'Ex : Application mobile, ERP, Shopify…' : 'Ex: Mobile app, ERP, Shopify…'} />
              <div style={{ fontSize: 11, color: C.t3, marginTop: 6 }}>{fr ? 'Choisissez un nom descriptif pour retrouver facilement cette clé.' : 'Choose a descriptive name to easily identify this key.'}</div>
            </div>
            <div>
              <Lbl>{fr ? 'Environnement' : 'Environment'}</Lbl>
              <Pills options={['production', 'test']} value={newEnv} onChange={setNewEnv} />
            </div>
            <div style={{ background: C.l2, borderRadius: 10, padding: '12px 14px', fontSize: 12, color: C.t3, lineHeight: 1.7 }}>
              <AlertCircle size={12} color={C.t3} style={{ marginRight: 6, display: 'inline', verticalAlign: 'middle' }} />
              {fr ? 'La clé sera affichée une seule fois à la création. Conservez-la en lieu sûr.' : 'The key will be shown only once upon creation. Store it securely.'}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <GhostBtn onClick={() => setModalKey(false)} style={{ height: 36, fontSize: 12 }}>{fr ? 'Annuler' : 'Cancel'}</GhostBtn>
              <TealBtn onClick={createKey} disabled={!newName.trim()} style={{ height: 36, fontSize: 12 }}><Key size={13} /> {fr ? 'Créer la clé' : 'Create key'}</TealBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal : Webhook */}
      {modalWebhook && (
        <Modal title={fr ? 'Configurer le webhook' : 'Configure webhook'} onClose={() => setModalWebhook(false)} width={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Lbl>{fr ? 'URL du serveur' : 'Server URL'}</Lbl>
              <Inp value={webhookUrl} onChange={setWhUrl} placeholder="https://votre-serveur.com/webhook" type="url" mono />
            </div>
            <div>
              <Lbl>{fr ? 'Événements à écouter' : 'Events to listen'}</Lbl>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['transaction.created', 'transaction.completed', 'transaction.failed', 'kyc.updated', 'limit.changed'].map(e => (
                  <span key={e} style={{ fontSize: 11, color: C.teal, background: C.tealT, border: `1px solid ${C.tealB}`, padding: '4px 9px', borderRadius: 6, fontFamily: MONO, cursor: 'pointer' }}>{e}</span>
                ))}
              </div>
            </div>
            <div style={{ background: C.l2, borderRadius: 10, padding: '12px 14px', fontSize: 12, color: C.t3, lineHeight: 1.7 }}>
              {fr ? 'Les requêtes sont signées avec un secret HMAC-SHA256. Vérifiez la signature avant de traiter les données.' : 'Requests are signed with an HMAC-SHA256 secret. Verify the signature before processing data.'}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <GhostBtn onClick={() => setModalWebhook(false)} style={{ height: 36, fontSize: 12 }}>{fr ? 'Annuler' : 'Cancel'}</GhostBtn>
              <TealBtn onClick={() => setModalWebhook(false)} disabled={!webhookUrl} style={{ height: 36, fontSize: 12 }}><Send size={13} /> {fr ? 'Enregistrer' : 'Save'}</TealBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────

export function BusinessProfile({
  user,
  onLangChange,
}: {
  user: { id?: string; email: string; name: string } | null;
  onLangChange?: (language: string) => void;
}) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';
  const storKey = `terex_b2b_${userId}_profile4`;

  const [page, setPage]   = useState<ProfilePage>('main');
  const [form, setForm]   = useState<ProfileData>(EMPTY);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(storKey) || 'null');
      if (s) setForm(s);
      else if (user?.email) setForm(f => ({ ...f, directorEmail: user.email, directorName: user.name || '' }));
    } catch {}
  }, [userId]);

  const lang = getLang(form.language);

  function save(partial: Partial<ProfileData>) {
    const next = { ...form, ...partial, updatedAt: new Date().toISOString() };
    setForm(next);
    localStorage.setItem(storKey, JSON.stringify(next));
    // Propagate language change to entire dashboard
    if (partial.language && partial.language !== form.language) {
      localStorage.setItem('terex_b2b_lang', partial.language);
      onLangChange?.(partial.language);
    }
    setFlash(true);
    setPage('main');
    setTimeout(() => setFlash(false), 2500);
  }

  if (page === 'identity')    return <IdentityPage    form={form} onBack={() => setPage('main')} onSave={save} lang={lang} />;
  if (page === 'director')    return <DirectorPage    form={form} onBack={() => setPage('main')} onSave={save} lang={lang} />;
  if (page === 'address')     return <AddressPage     form={form} onBack={() => setPage('main')} onSave={save} lang={lang} />;
  if (page === 'legal')       return <LegalPage       form={form} onBack={() => setPage('main')} onSave={save} lang={lang} />;
  if (page === 'security')    return <SecurityPage    onBack={() => setPage('main')} lang={lang} />;
  if (page === 'preferences') return <PreferencesPage form={form} onBack={() => setPage('main')} onSave={save} lang={lang} />;
  if (page === 'billing')     return <BillingPage     onBack={() => setPage('main')} lang={lang} />;
  if (page === 'api')         return <ApiPage         onBack={() => setPage('main')} lang={lang} />;

  return <ProfileMain form={form} setPage={setPage} flash={flash} lang={lang} />;
}
