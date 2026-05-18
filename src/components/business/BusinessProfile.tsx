import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Check, ArrowLeft, ChevronRight, Building2, User, MapPin,
  FileText, Shield, Settings, CreditCard, Globe, Phone, Mail,
  Briefcase, Key, Bell, Monitor, Clock, Copy, Eye, EyeOff,
  Plus, Trash2, RefreshCw, Lock, Zap, Code, Hash, Download,
  X, Send, AlertCircle,
} from 'lucide-react';

// ── Design tokens ────────────────────────────────────────────────────
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030',
  bd: '#383838', bds: '#2a2a2a',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.22)',
  t1: '#f0f0f0', t2: '#999999', t3: '#686868',
  red: '#ef4444', redT: 'rgba(239,68,68,0.08)', redB: 'rgba(239,68,68,0.22)',
};
const FONT = "'Inter', sans-serif";
const MONO = '"JetBrains Mono", Consolas, monospace';

// Texture icône — même dégradé que les héros
const ICON_BOX: React.CSSProperties = {
  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
  background: 'linear-gradient(145deg, #262626 0%, #1e1e1e 50%, #1a1a1a 100%)',
  border: '1px solid #2e2e2e',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

type ProfilePage =
  | 'main' | 'identity' | 'director' | 'address'
  | 'legal' | 'security' | 'preferences' | 'billing' | 'api';

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

const BUSINESS_TYPES = ['SARL', 'SA', 'SAS', 'GIE', 'SUARL', 'Association', 'Autre'];
const SECTORS = ['Import / Export', 'Textile & Confection', 'Électronique & Tech', 'Agroalimentaire', 'Bâtiment & Matériaux', 'Logistique', 'Négoce international', 'Services financiers', 'Autre'];
const COUNTRIES = ["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Guinée", "Togo", "Bénin", "Niger", "Cameroun", "Autre"];

// ── Composants de base ───────────────────────────────────────────────

function TealBtn({ children, onClick, disabled, style }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; style?: React.CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 38, paddingLeft: 18, paddingRight: 18, background: disabled ? C.l3 : h ? C.tealH : C.teal, color: disabled ? C.t3 : '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FONT, transition: 'background 0.13s', ...style }}
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
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38, paddingLeft: 16, paddingRight: 16, background: h ? C.l3 : 'rgba(255,255,255,0.04)', color: C.t2, border: `1px solid ${C.bds}`, borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.12s', ...style }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function Inp({ value, onChange, placeholder, type = 'text', disabled }: {
  value: string; onChange: (v: string) => void; placeholder: string; type?: string; disabled?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder} disabled={disabled}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', background: disabled ? C.l3 : C.l2, border: `1px solid ${f ? 'rgba(59,150,143,0.3)' : C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', opacity: disabled ? 0.6 : 1 }} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  const [f, setF] = useState(false);
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', background: C.l2, border: `1px solid ${f ? 'rgba(59,150,143,0.3)' : C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', resize: 'none', lineHeight: 1.65 }} />
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 7, fontFamily: FONT }}>{children}</div>;
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
      style={{ width: 38, height: 22, borderRadius: 11, background: on ? C.teal : C.l3, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </button>
  );
}

function SubHeader({ onBack, section, title, subtitle }: {
  onBack: () => void; section: string; title: string; subtitle: string;
}) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 12px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
          <ArrowLeft size={13} /> Profil entreprise
        </button>
        <span style={{ color: C.t3, fontSize: 13 }}>/</span>
        <span style={{ color: C.t2, fontSize: 13 }}>{section}</span>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
        <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 6px' }}>{title}</h2>
        <p style={{ color: C.t3, fontSize: 13, margin: 0 }}>{subtitle}</p>
      </div>
    </>
  );
}

function SaveBar({ onSave, onCancel, dirty }: { onSave: () => void; onCancel: () => void; dirty: boolean }) {
  if (!dirty) return null;
  return (
    <div style={{ position: 'sticky', bottom: 0, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
      <span style={{ fontSize: 12, color: C.t3 }}>Modifications non enregistrées</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <GhostBtn onClick={onCancel} style={{ height: 34 }}>Annuler</GhostBtn>
        <TealBtn onClick={onSave} style={{ height: 34 }}><Check size={13} /> Enregistrer</TealBtn>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' };
const cardP: React.CSSProperties = { background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' };

// ── Sous-page : Identité de l'entreprise ─────────────────────────────

function IdentityPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ companyName: form.companyName, businessType: form.businessType, sector: form.sector, description: form.description, website: form.website, companyPhone: form.companyPhone, companyEmail: form.companyEmail });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const dirty = JSON.stringify(d) !== JSON.stringify({ companyName: form.companyName, businessType: form.businessType, sector: form.sector, description: form.description, website: form.website, companyPhone: form.companyPhone, companyEmail: form.companyEmail });
  const initials = d.companyName ? d.companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'TS';

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="Identité" title="Identité de l'entreprise" subtitle="Raison sociale, secteur, coordonnées commerciales" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(145deg, #242424, #1a1a1a)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: d.companyName ? C.t1 : C.t3 }}>{d.companyName || 'Nom de l\'entreprise'}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 3 }}>{d.sector || d.businessType || 'Secteur non défini'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Raison sociale</Lbl>
                <Inp value={d.companyName} onChange={set('companyName')} placeholder="Ex : Terex SARL" />
              </div>
              <div>
                <Lbl>Téléphone professionnel</Lbl>
                <Inp value={d.companyPhone} onChange={set('companyPhone')} placeholder="+221 77 000 00 00" type="tel" />
              </div>
              <div>
                <Lbl>Email professionnel</Lbl>
                <Inp value={d.companyEmail} onChange={set('companyEmail')} placeholder="contact@entreprise.sn" type="email" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Site web</Lbl>
                <Inp value={d.website} onChange={set('website')} placeholder="https://entreprise.sn" type="url" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Description de l'activité</Lbl>
                <Textarea value={d.description} onChange={set('description')} placeholder="Décrivez brièvement votre activité, vos marchés cibles et vos produits ou services principaux…" />
              </div>
            </div>
          </div>

          <div style={cardP}>
            <Lbl>Forme juridique</Lbl>
            <Pills options={BUSINESS_TYPES} value={d.businessType} onChange={set('businessType')} />
          </div>

          <div style={cardP}>
            <Lbl>Secteur d'activité</Lbl>
            <Pills options={SECTORS} value={d.sector} onChange={set('sector')} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 14px' }}>Aperçu du profil</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: C.l2, borderRadius: 11, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: 'linear-gradient(145deg, #262626, #1a1a1a)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: d.companyName ? C.t1 : C.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.companyName || '—'}</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{d.businessType || '—'} · {d.sector || '—'}</div>
              </div>
            </div>
            {[
              { label: 'Site web', value: d.website || '—' },
              { label: 'Téléphone', value: d.companyPhone || '—' },
              { label: 'Email', value: d.companyEmail || '—' },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <span style={{ fontSize: 12, color: r.value === '—' ? C.t3 : C.t1, fontFamily: r.value !== '—' ? MONO : FONT, textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 160, textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div style={{ ...cardP, background: C.l2 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.t2, margin: '0 0 10px' }}>À savoir</p>
            <ul style={{ color: C.t3, fontSize: 12, margin: 0, padding: '0 0 0 16px', lineHeight: 2 }}>
              <li>La raison sociale doit correspondre exactement à votre RCCM</li>
              <li>L'email professionnel reçoit les confirmations de transactions</li>
              <li>Le site web améliore votre score de confiance</li>
            </ul>
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} onSave={() => { onSave(d); }} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Dirigeant ─────────────────────────────────────────────

function DirectorPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ directorName: form.directorName, directorRole: form.directorRole, directorEmail: form.directorEmail, directorPhone: form.directorPhone });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const dirty = JSON.stringify(d) !== JSON.stringify({ directorName: form.directorName, directorRole: form.directorRole, directorEmail: form.directorEmail, directorPhone: form.directorPhone });
  const initials = d.directorName ? d.directorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const ROLES = ['Directeur Général', 'Président', 'Gérant', 'Administrateur', 'Associé gérant', 'Autre'];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="Dirigeant" title="Représentant légal" subtitle="Identité et coordonnées du dirigeant du compte" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(145deg, #262626, #1a1a1a)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>{initials}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: d.directorName ? C.t1 : C.t3 }}>{d.directorName || 'Nom du dirigeant'}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 3 }}>{d.directorRole || 'Fonction non définie'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Nom complet du dirigeant</Lbl>
                <Inp value={d.directorName} onChange={set('directorName')} placeholder="Ex : Moussa Diallo" />
              </div>
              <div>
                <Lbl>Email du dirigeant</Lbl>
                <Inp value={d.directorEmail} onChange={set('directorEmail')} placeholder="moussa@entreprise.sn" type="email" />
              </div>
              <div>
                <Lbl>Téléphone direct</Lbl>
                <Inp value={d.directorPhone} onChange={set('directorPhone')} placeholder="+221 77 000 00 00" type="tel" />
              </div>
            </div>
          </div>

          <div style={cardP}>
            <Lbl>Fonction / Poste</Lbl>
            <Pills options={ROLES} value={d.directorRole} onChange={set('directorRole')} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 14px' }}>Accès & Vérification</p>
            {[
              { label: 'Rôle sur Terex', value: 'Propriétaire', ok: true },
              { label: 'Identité KYC',   value: 'CNI soumise', ok: true },
              { label: 'Email vérifié',  value: d.directorEmail || '—', ok: !!d.directorEmail },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.ok && <Check size={11} color={C.t3} />}
                  <span style={{ fontSize: 12, color: r.ok ? C.t2 : C.t3 }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardP, background: C.l2 }}>
            <AlertCircle size={14} color={C.t3} style={{ marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.65 }}>
              Le dirigeant est le représentant légal pour toute procédure KYC. Son identité doit correspondre aux documents soumis en section Conformité.
            </p>
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Siège social ──────────────────────────────────────────

function AddressPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ address: form.address, city: form.city, postalCode: form.postalCode, country: form.country });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const dirty = JSON.stringify(d) !== JSON.stringify({ address: form.address, city: form.city, postalCode: form.postalCode, country: form.country });
  const fullAddress = [d.address, d.postalCode, d.city, d.country].filter(Boolean).join(', ');

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="Siège social" title="Siège social" subtitle="Adresse officielle enregistrée au RCCM" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Adresse (rue, numéro)</Lbl>
                <Inp value={d.address} onChange={set('address')} placeholder="Ex : 45 Avenue Léopold Sédar Senghor" />
              </div>
              <div>
                <Lbl>Ville</Lbl>
                <Inp value={d.city} onChange={set('city')} placeholder="Dakar, Abidjan, Bamako…" />
              </div>
              <div>
                <Lbl>Code postal</Lbl>
                <Inp value={d.postalCode} onChange={set('postalCode')} placeholder="10700" />
              </div>
            </div>
          </div>
          <div style={cardP}>
            <Lbl>Pays</Lbl>
            <Pills options={COUNTRIES} value={d.country} onChange={set('country')} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 14px' }}>Adresse enregistrée</p>
            <div style={{ padding: '14px', background: C.l2, borderRadius: 10, fontSize: 13, color: fullAddress ? C.t1 : C.t3, lineHeight: 1.6 }}>
              {fullAddress || 'Aucune adresse renseignée'}
            </div>
          </div>
          <div style={{ ...cardP, background: C.l2 }}>
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.65 }}>
              L'adresse du siège doit être identique à celle figurant sur votre RCCM et votre justificatif de domiciliation.
            </p>
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Informations légales ─────────────────────────────────

function LegalPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ rccm: form.rccm, ninea: form.ninea, capital: form.capital, foundedYear: form.foundedYear });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const dirty = JSON.stringify(d) !== JSON.stringify({ rccm: form.rccm, ninea: form.ninea, capital: form.capital, foundedYear: form.foundedYear });

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="Informations légales" title="Informations légales & Fiscales" subtitle="RCCM, NINEA, capital social — documents OHADA" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>RCCM — Registre du Commerce et du Crédit Mobilier</Lbl>
                <Inp value={d.rccm} onChange={set('rccm')} placeholder="Ex : SN-DKR-2021-B-12345" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>NINEA — Numéro d'Identification Nationale</Lbl>
                <Inp value={d.ninea} onChange={set('ninea')} placeholder="Ex : 007654321 2Z3" />
              </div>
              <div>
                <Lbl>Capital social (FCFA)</Lbl>
                <Inp value={d.capital} onChange={set('capital')} placeholder="Ex : 1 000 000" />
              </div>
              <div>
                <Lbl>Année de création</Lbl>
                <Inp value={d.foundedYear} onChange={set('foundedYear')} placeholder="Ex : 2019" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 4px' }}>Statut des informations</p>
            {[
              { label: 'RCCM', value: d.rccm || 'Non renseigné', ok: !!d.rccm },
              { label: 'NINEA', value: d.ninea || 'Non renseigné', ok: !!d.ninea },
              { label: 'Capital', value: d.capital ? `${d.capital} FCFA` : 'Non renseigné', ok: !!d.capital },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.ok && <Check size={11} color={C.t3} />}
                  <span style={{ fontSize: 12, color: r.ok ? C.t2 : C.t3, fontFamily: r.ok ? MONO : FONT, maxWidth: 140, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...cardP, background: C.l2 }}>
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.65 }}>
              Le RCCM au Sénégal est délivré par le Tribunal de Commerce de Dakar. Le NINEA est obtenu auprès de la Direction Générale des Impôts et Domaines (DGID).
            </p>
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Sécurité ──────────────────────────────────────────────

function SecurityPage({ onBack }: { onBack: () => void }) {
  const [twofa, setTwofa] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [oldPwd, setOldPwd]     = useState('');
  const [newPwd, setNewPwd]     = useState('');
  const [showOld, setShowOld]   = useState(false);
  const [showNew, setShowNew]   = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);

  const sessions = [
    { device: 'Chrome · macOS',    ip: '41.82.xxx.xxx',  location: 'Dakar, SN',     time: 'Maintenant',    current: true  },
    { device: 'Safari · iPhone 14',ip: '41.82.xxx.xxx',  location: 'Dakar, SN',     time: 'Il y a 2h',     current: false },
    { device: 'Chrome · Windows',  ip: '154.12.xxx.xxx', location: 'Abidjan, CI',   time: 'Il y a 3 jours',current: false },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="Sécurité" title="Sécurité du compte" subtitle="Mot de passe, double authentification, sessions actives" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Mot de passe */}
          <div style={cardP}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={ICON_BOX}><Lock size={16} color={C.t3} /></div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Mot de passe</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Dernière modification : il y a 3 mois</div>
                </div>
              </div>
            </div>
            {pwdSaved ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, borderRadius: 9 }}>
                <Check size={14} color={C.t2} />
                <span style={{ fontSize: 13, color: C.t2 }}>Mot de passe mis à jour</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <Lbl>Mot de passe actuel</Lbl>
                  <div style={{ position: 'relative' }}>
                    <Inp value={oldPwd} onChange={setOldPwd} placeholder="••••••••" type={showOld ? 'text' : 'password'} />
                    <button onClick={() => setShowOld(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                      {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <Lbl>Nouveau mot de passe</Lbl>
                  <div style={{ position: 'relative' }}>
                    <Inp value={newPwd} onChange={setNewPwd} placeholder="Minimum 8 caractères" type={showNew ? 'text' : 'password'} />
                    <button onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {newPwd.length > 0 && newPwd.length < 8 && (
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 5 }}>Trop court — 8 caractères minimum</div>
                  )}
                </div>
                <TealBtn onClick={() => { if (oldPwd && newPwd.length >= 8) { setPwdSaved(true); setOldPwd(''); setNewPwd(''); setTimeout(() => setPwdSaved(false), 3000); } }} disabled={!oldPwd || newPwd.length < 8} style={{ alignSelf: 'flex-start' }}>
                  <Check size={13} /> Mettre à jour
                </TealBtn>
              </div>
            )}
          </div>

          {/* 2FA */}
          <div style={cardP}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: twofa && !showSetup ? 0 : 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={ICON_BOX}><Zap size={16} color={C.t3} /></div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Double authentification (2FA)</div>
                  <div style={{ fontSize: 11, color: twofa ? C.t2 : C.t3, marginTop: 2 }}>{twofa ? 'Activée — application OTP' : 'Non activée — fortement recommandée'}</div>
                </div>
              </div>
              <Toggle on={twofa} onChange={v => { setTwofa(v); setShowSetup(v); }} />
            </div>
            {showSetup && (
              <div style={{ marginTop: 18, padding: '16px', background: C.l2, borderRadius: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.t2, margin: '0 0 8px' }}>Configuration via application OTP</p>
                <p style={{ fontSize: 12, color: C.t3, margin: '0 0 14px', lineHeight: 1.6 }}>
                  Scannez le QR code avec Google Authenticator, Authy ou toute application compatible TOTP.
                </p>
                <div style={{ width: 100, height: 100, background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Hash size={32} color={C.t3} />
                </div>
                <Lbl>Code de vérification</Lbl>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Inp value="" onChange={() => {}} placeholder="000000" />
                  <TealBtn style={{ flexShrink: 0 }}>Confirmer</TealBtn>
                </div>
              </div>
            )}
          </div>

          {/* Sessions */}
          <div style={card}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ ...ICON_BOX, width: 32, height: 32, borderRadius: 8 }}><Monitor size={13} color={C.t3} /></div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Sessions actives</span>
              </div>
              <span style={{ fontSize: 11, color: C.t3 }}>{sessions.length} appareils</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {sessions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderBottom: i < sessions.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.current ? C.teal : C.l3, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.t1 }}>{s.device}</div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{s.location} · {s.ip} · {s.time}</div>
                  </div>
                  {s.current ? (
                    <span style={{ fontSize: 11, color: C.t2 }}>Session actuelle</span>
                  ) : (
                    <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.red)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
                      <Trash2 size={11} /> Révoquer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 4px' }}>Score de sécurité</p>
            {[
              { label: 'Mot de passe fort',     ok: true  },
              { label: 'Double authentification',ok: twofa },
              { label: 'Email vérifié',          ok: true  },
              { label: 'Téléphone vérifié',      ok: true  },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <span style={{ fontSize: 11, color: r.ok ? C.t2 : C.t3 }}>{r.ok ? '✓' : '○'}</span>
              </div>
            ))}
          </div>
          <div style={{ ...cardP, background: C.l2 }}>
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.65 }}>
              Activez la 2FA pour protéger votre compte contre les accès non autorisés. En cas de compromission, contactez-nous à <strong style={{ color: C.t2 }}>security@terex.sn</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sous-page : Préférences ───────────────────────────────────────────

function PreferencesPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ language: form.language, currency: form.currency, timezone: form.timezone, notifEmail: form.notifEmail, notifSms: form.notifSms, notifPush: form.notifPush });
  const dirty = JSON.stringify(d) !== JSON.stringify({ language: form.language, currency: form.currency, timezone: form.timezone, notifEmail: form.notifEmail, notifSms: form.notifSms, notifPush: form.notifPush });

  const LANGS = ['Français', 'English', 'Wolof'];
  const CURRENCIES = ['USDT', 'FCFA', 'EUR', 'USD'];
  const ZONES = ['Africa/Dakar', 'Africa/Abidjan', 'Africa/Bamako', 'Europe/Paris'];

  const notifs = [
    { key: 'notifEmail' as const, label: 'Notifications par email', sub: 'Confirmations de transactions, alertes', icon: Mail },
    { key: 'notifSms'   as const, label: 'Notifications par SMS',   sub: 'Codes de vérification, alertes critiques', icon: Zap },
    { key: 'notifPush'  as const, label: 'Notifications push',      sub: 'Alertes en temps réel sur l\'appareil', icon: Bell },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="Préférences" title="Préférences" subtitle="Langue, devise d'affichage, notifications" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 16px' }}>Interface</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><Lbl>Langue</Lbl><Pills options={LANGS} value={d.language} onChange={v => setD(p => ({ ...p, language: v }))} /></div>
              <div><Lbl>Devise d'affichage</Lbl><Pills options={CURRENCIES} value={d.currency} onChange={v => setD(p => ({ ...p, currency: v }))} /></div>
              <div><Lbl>Fuseau horaire</Lbl><Pills options={ZONES} value={d.timezone} onChange={v => setD(p => ({ ...p, timezone: v }))} /></div>
            </div>
          </div>

          <div style={card}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Notifications</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {notifs.map((n, i) => {
                const Icon = n.icon;
                return (
                  <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: i < notifs.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                    <div style={{ ...ICON_BOX, width: 34, height: 34, borderRadius: 9 }}><Icon size={14} color={C.t3} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{n.label}</div>
                      <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{n.sub}</div>
                    </div>
                    <Toggle on={d[n.key]} onChange={v => setD(p => ({ ...p, [n.key]: v }))} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 4px' }}>Résumé</p>
            {[
              { label: 'Langue',  value: d.language },
              { label: 'Devise',  value: d.currency },
              { label: 'Fuseau',  value: d.timezone.split('/')[1] },
              { label: 'Notifications', value: [d.notifEmail && 'Email', d.notifSms && 'SMS', d.notifPush && 'Push'].filter(Boolean).join(', ') || 'Aucune' },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <span style={{ fontSize: 12, color: C.t2 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Facturation ───────────────────────────────────────────

function BillingPage({ onBack }: { onBack: () => void }) {
  const invoices = [
    { ref: 'TRX-2025-042', date: 'Avr 2025', amount: '0 FCFA', plan: 'Starter', status: 'Payée' },
    { ref: 'TRX-2025-031', date: 'Mar 2025', amount: '0 FCFA', plan: 'Starter', status: 'Payée' },
    { ref: 'TRX-2025-020', date: 'Fév 2025', amount: '0 FCFA', plan: 'Starter', status: 'Payée' },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="Facturation" title="Facturation & Abonnement" subtitle="Plan actuel, historique des factures" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Plan actuel */}
          <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 100%)', border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 6 }}>Plan actuel</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.t1, letterSpacing: '-0.03em' }}>Starter</div>
                <div style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>Gratuit · Renouvelé automatiquement</div>
              </div>
              <span style={{ fontSize: 11, color: C.t2, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bds}`, padding: '4px 10px', borderRadius: 8 }}>Actif</span>
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
              {[['5 000 USDT', 'Limite mensuelle'], ['0 FCFA', 'Coût mensuel'], ['∞', 'Transactions']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, fontFamily: MONO }}>{v}</div>
                  <div style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <GhostBtn style={{ fontSize: 12 }}>Passer au plan Entreprise</GhostBtn>
          </div>

          {/* Factures */}
          <div style={card}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Historique des factures</span>
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                <Download size={11} /> Tout exporter
              </button>
            </div>
            <div style={{ padding: '4px 0' }}>
              {invoices.map((inv, i) => (
                <div key={inv.ref} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderBottom: i < invoices.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.t1 }}>{inv.plan} · {inv.date}</div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2, fontFamily: MONO }}>{inv.ref}</div>
                  </div>
                  <span style={{ fontSize: 12, fontFamily: MONO, color: C.t2 }}>{inv.amount}</span>
                  <span style={{ fontSize: 11, color: C.t3 }}>{inv.status}</span>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                    <Download size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 14px' }}>Plans disponibles</p>
            {[
              { name: 'Starter',    price: 'Gratuit',      limit: '5 000 USDT/mois', current: true },
              { name: 'Business',   price: '25 000 FCFA/mois', limit: '100 000 USDT/mois', current: false },
              { name: 'Enterprise', price: 'Sur devis',    limit: 'Illimitée',       current: false },
            ].map((p, i, arr) => (
              <div key={p.name} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none', opacity: p.current ? 1 : 0.65 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: p.current ? C.t1 : C.t2 }}>{p.name}</span>
                  {p.current && <span style={{ fontSize: 10, color: C.t2 }}>Actuel</span>}
                </div>
                <div style={{ fontSize: 11, color: C.t3 }}>{p.limit} · {p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sous-page : API & Intégrations ────────────────────────────────────

function ApiPage({ onBack }: { onBack: () => void }) {
  const [keys, setKeys] = useState([
    { id: 'k1', name: 'Production', key: 'trx_live_4k2j9...a8x1', requests: 1847, lastUsed: 'il y a 2 min', active: true },
    { id: 'k2', name: 'Test',       key: 'trx_test_9m1c4...z2r7', requests: 342,  lastUsed: 'il y a 1h',    active: true },
  ]);
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  function copyKey(k: string, id: string) {
    navigator.clipboard.writeText(k).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <SubHeader onBack={onBack} section="API" title="API & Intégrations" subtitle="Clés d'accès, requêtes, webhooks" />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Clés API */}
          <div style={card}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Clés API</span>
              <button onClick={() => setCreating(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, paddingLeft: 12, paddingRight: 12, background: C.teal, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                <Plus size={12} /> Nouvelle clé
              </button>
            </div>

            {creating && (
              <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.bds}`, background: C.l2 }}>
                <Lbl>Nom de la clé</Lbl>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Inp value={newName} onChange={setNewName} placeholder="Ex : Mobile App, ERP, Comptabilité…" />
                  <TealBtn onClick={() => { if (newName.trim()) { setKeys(p => [...p, { id: `k${Date.now()}`, name: newName.trim(), key: `trx_live_${Math.random().toString(36).slice(2,8)}...${Math.random().toString(36).slice(2,6)}`, requests: 0, lastUsed: 'jamais', active: true }]); setNewName(''); setCreating(false); } }} style={{ flexShrink: 0 }}><Check size={13} /></TealBtn>
                  <GhostBtn onClick={() => setCreating(false)} style={{ flexShrink: 0 }}><X size={13} /></GhostBtn>
                </div>
              </div>
            )}

            <div style={{ padding: '4px 0' }}>
              {keys.map((k, i) => (
                <div key={k.id} style={{ padding: '16px 22px', borderBottom: i < keys.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: k.active ? C.teal : C.t3 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{k.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => copyKey(k.key, k.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: copied === k.id ? C.t2 : C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                        {copied === k.id ? <><Check size={11} /> Copié</> : <><Copy size={11} /> Copier</>}
                      </button>
                      <button onClick={() => setKeys(p => p.filter(x => x.id !== k.id))}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.red)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
                        <Trash2 size={11} /> Supprimer
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: C.l2, borderRadius: 8 }}>
                    <code style={{ flex: 1, fontSize: 12, color: C.t2, fontFamily: MONO, letterSpacing: '0.03em' }}>
                      {show[k.id] ? k.key : k.key.replace(/[^.]/g, '·').slice(0, 24) + '...'}
                    </code>
                    <button onClick={() => setShow(p => ({ ...p, [k.id]: !p[k.id] }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                      {show[k.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: C.t3 }}>{k.requests.toLocaleString()} requêtes</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>Dernière utilisation : {k.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook */}
          <div style={cardP}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={ICON_BOX}><Zap size={16} color={C.t3} /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Webhook endpoint</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Recevez des événements en temps réel sur votre serveur</div>
              </div>
            </div>
            <Lbl>URL du webhook</Lbl>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Inp value="" onChange={() => {}} placeholder="https://votre-serveur.com/webhook/terex" type="url" />
              <TealBtn style={{ flexShrink: 0 }}><Send size={13} /></TealBtn>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['transaction.created', 'transaction.completed', 'kyc.updated', 'limit.changed'].map(e => (
                <span key={e} style={{ fontSize: 11, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, padding: '3px 9px', borderRadius: 6, fontFamily: MONO }}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={cardP}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 4px' }}>Utilisation ce mois</p>
            {[
              { label: 'Requêtes API',  value: '2 189' },
              { label: 'Limite mensuelle', value: '100 000' },
              { label: 'Webhooks envoyés', value: '847' },
              { label: 'Erreurs',       value: '3' },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                <span style={{ fontSize: 12, fontFamily: MONO, color: C.t1 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{ ...cardP, background: C.l2 }}>
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.65 }}>
              La documentation complète de l'API Terex est disponible sur <strong style={{ color: C.t2 }}>docs.terex.sn</strong>. Support technique : <strong style={{ color: C.t2 }}>api@terex.sn</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page principale — Hero + Bento grid ──────────────────────────────

export function BusinessProfile({ user }: { user: { id?: string; email: string; name: string } | null }) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';
  const key = `terex_b2b_${userId}_profile2`;

  const [page, setPage]   = useState<ProfilePage>('main');
  const [form, setForm]   = useState<ProfileData>(EMPTY);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(key) || 'null');
      if (s) setForm(s);
      else if (user?.email) setForm(f => ({ ...f, directorEmail: user.email, directorName: user.name || '' }));
    } catch {}
  }, [userId]);

  function save(partial: Partial<ProfileData>) {
    const next = { ...form, ...partial, updatedAt: new Date().toISOString() };
    setForm(next);
    localStorage.setItem(key, JSON.stringify(next));
    setFlash(true);
    setPage('main');
    setTimeout(() => setFlash(false), 2500);
  }

  // Score complétion
  const fields: (keyof ProfileData)[] = ['companyName', 'businessType', 'sector', 'directorName', 'directorEmail', 'rccm', 'ninea', 'address', 'country'];
  const filled  = fields.filter(f => form[f]).length;
  const pct     = Math.round((filled / fields.length) * 100);
  const initials = form.companyName ? form.companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : (form.directorName ? form.directorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'TS');

  // Navigation vers les sous-pages
  if (page === 'identity')    return <IdentityPage     form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'director')    return <DirectorPage     form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'address')     return <AddressPage      form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'legal')       return <LegalPage        form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'security')    return <SecurityPage     onBack={() => setPage('main')} />;
  if (page === 'preferences') return <PreferencesPage form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'billing')     return <BillingPage      onBack={() => setPage('main')} />;
  if (page === 'api')         return <ApiPage          onBack={() => setPage('main')} />;

  // Tiles du bento grid
  const tiles = [
    {
      id: 'identity' as ProfilePage, wide: true,
      icon: Building2, title: "Identité de l'entreprise",
      lines: [
        form.companyName || 'Raison sociale non renseignée',
        [form.businessType, form.sector].filter(Boolean).join(' · ') || 'Forme juridique & secteur',
        form.website || form.companyEmail || 'Site web & contact',
      ],
      complete: !!(form.companyName && form.businessType && form.sector),
    },
    {
      id: 'director' as ProfilePage, wide: false,
      icon: User, title: 'Dirigeant',
      lines: [
        form.directorName || 'Nom non renseigné',
        form.directorRole || 'Fonction',
        form.directorPhone || form.directorEmail || 'Contact',
      ],
      complete: !!(form.directorName && form.directorRole),
    },
    {
      id: 'security' as ProfilePage, wide: false,
      icon: Shield, title: 'Sécurité',
      lines: ['Mot de passe · ••••••••', '2FA : non activée', '3 sessions actives'],
      complete: false,
    },
    {
      id: 'address' as ProfilePage, wide: false,
      icon: MapPin, title: 'Siège social',
      lines: [
        form.city || 'Ville non renseignée',
        form.country || 'Pays',
        form.address || 'Adresse complète',
      ],
      complete: !!(form.city && form.country),
    },
    {
      id: 'legal' as ProfilePage, wide: false,
      icon: FileText, title: 'Informations légales',
      lines: [
        form.rccm ? `RCCM : ${form.rccm}` : 'RCCM non renseigné',
        form.ninea ? `NINEA : ${form.ninea}` : 'NINEA non renseigné',
        form.capital ? `Capital : ${form.capital} FCFA` : 'Capital social',
      ],
      complete: !!(form.rccm && form.ninea),
    },
    {
      id: 'preferences' as ProfilePage, wide: false,
      icon: Settings, title: 'Préférences',
      lines: [
        `Langue : ${form.language}`,
        `Devise : ${form.currency}`,
        `Fuseau : ${form.timezone.split('/')[1]}`,
      ],
      complete: true,
    },
    {
      id: 'api' as ProfilePage, wide: true,
      icon: Code, title: 'API & Intégrations',
      lines: ['2 clés actives', '2 189 requêtes ce mois', 'Webhook : non configuré'],
      complete: false,
    },
    {
      id: 'billing' as ProfilePage, wide: false,
      icon: CreditCard, title: 'Facturation',
      lines: ['Plan Starter · Gratuit', 'Limite 5 000 USDT/mois', '3 factures disponibles'],
      complete: true,
    },
  ];

  return (
    <div style={{ fontFamily: FONT, color: C.t1 }}>

      {/* Flash save */}
      {flash && (
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, borderRadius: 10, fontSize: 13, color: C.t2 }}>
          <Check size={13} color={C.t2} /> Modifications enregistrées
        </div>
      )}

      {/* ── HÉRO ── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 18, padding: '28px 32px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar entreprise */}
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)', border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0, letterSpacing: '-0.02em' }}>
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: form.companyName ? C.t1 : C.t3, letterSpacing: '-0.025em', margin: 0 }}>
                {form.companyName || 'Votre entreprise'}
              </h2>
              <span style={{ fontSize: 11, color: C.t3, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.bds}`, padding: '3px 9px', borderRadius: 6 }}>
                Niveau 1 · Basique
              </span>
            </div>
            <div style={{ fontSize: 13, color: C.t3, marginBottom: 18 }}>
              {[form.businessType, form.sector, [form.city, form.country].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || 'Complétez votre profil pour apparaître ici'}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { v: '4',      l: 'Membres équipe'     },
                { v: '27',     l: 'Transactions/mois'  },
                { v: '6 mois', l: 'Membre depuis'      },
                { v: `${pct}%`,l: 'Profil complété'    },
              ].map((s, i, arr) => (
                <div key={s.l} style={{ paddingRight: i < arr.length - 1 ? 28 : 0, borderRight: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontFamily: MONO }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'center' }}>
            <TealBtn onClick={() => setPage('identity')}><RefreshCw size={13} /> Modifier le profil</TealBtn>
            {pct < 100 && <GhostBtn onClick={() => setPage(tiles.find(t => !t.complete)?.id || 'identity')}><Zap size={13} /> Compléter ({pct}%)</GhostBtn>}
          </div>
        </div>

        {/* Barre de complétion */}
        {pct < 100 && (
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.bds}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.t3 }}>Complétion du profil</span>
              <span style={{ fontSize: 11, color: C.t3, fontFamily: MONO }}>{filled}/{fields.length} champs</span>
            </div>
            <div style={{ height: 3, background: C.l3, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: C.teal, borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
          </div>
        )}
      </div>

      {/* ── BENTO GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {tiles.map(tile => {
          const Icon = tile.icon;
          return (
            <Tile key={tile.id} wide={tile.wide} complete={tile.complete} onClick={() => setPage(tile.id)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={ICON_BOX}><Icon size={17} color={C.t3} /></div>
                {!tile.complete && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.t3, marginTop: 4 }} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 10, letterSpacing: '-0.01em' }}>{tile.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {tile.lines.map((l, i) => (
                  <div key={i} style={{ fontSize: 11, color: i === 0 ? C.t2 : C.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l}</div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: tile.complete ? C.t3 : C.t3 }}>
                  {tile.complete ? 'À jour' : 'À compléter'}
                </span>
                <ChevronRight size={13} color={C.t3} />
              </div>
            </Tile>
          );
        })}
      </div>
    </div>
  );
}

// ── Tile du bento grid ───────────────────────────────────────────────

function Tile({ children, wide, complete, onClick }: {
  children: React.ReactNode; wide: boolean; complete: boolean; onClick: () => void;
}) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ gridColumn: wide ? 'span 2' : 'span 1', background: h ? '#242424' : C.l1, border: `1px solid ${h ? C.bd : C.bds}`, borderRadius: 14, padding: '20px 20px 18px', cursor: 'pointer', transition: 'all 0.14s', display: 'flex', flexDirection: 'column', minHeight: 170, fontFamily: "'Inter', sans-serif", opacity: complete ? 1 : 0.88 }}>
      {children}
    </div>
  );
}
