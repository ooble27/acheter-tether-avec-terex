import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Check, ArrowLeft, ChevronRight, Building2, User, MapPin,
  FileText, Shield, Settings, CreditCard, Globe, Phone, Mail,
  Key, Bell, Monitor, Clock, Copy, Eye, EyeOff,
  Plus, Trash2, RefreshCw, Lock, Zap, Code, Hash, Download,
  X, Send, AlertCircle, Briefcase, Edit3,
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
const GRAD = 'linear-gradient(145deg, #262626 0%, #1e1e1e 50%, #1a1a1a 100%)';

type ProfilePage = 'main' | 'identity' | 'director' | 'address' | 'legal' | 'security' | 'preferences' | 'billing' | 'api';

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

const BIZ_TYPES = ['SARL', 'SA', 'SAS', 'GIE', 'SUARL', 'Association', 'Autre'];
const SECTORS   = ['Import / Export', 'Textile & Confection', 'Électronique & Tech', 'Agroalimentaire', 'Bâtiment & Matériaux', 'Logistique', 'Négoce international', 'Services financiers', 'Autre'];
const COUNTRIES = ["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Guinée", "Togo", "Bénin", "Niger", "Cameroun", "Autre"];
const DIR_ROLES = ['Directeur Général', 'Président-Directeur Général', 'Gérant', 'Administrateur', 'Associé gérant', 'Autre'];

// ── Composants atomiques ──────────────────────────────────────────────

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
      style={{ width: '100%', background: disabled ? '#1e1e1e' : C.l2, border: `1px solid ${f ? 'rgba(59,150,143,0.3)' : C.bd}`, borderRadius: 9, padding: '10px 14px', color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT, boxSizing: 'border-box', opacity: disabled ? 0.5 : 1 }} />
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
      style={{ width: 36, height: 20, borderRadius: 10, background: on ? C.teal : C.l3, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.18s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.18s' }} />
    </button>
  );
}

// Retour en haut de page, breadcrumb simple
function BreadCrumb({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, cursor: 'pointer', color: C.t3, fontSize: 12, padding: '7px 12px', borderRadius: 9, fontFamily: FONT, transition: 'all 0.13s' }}
        onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.bd; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.bds; }}>
        <ArrowLeft size={13} /> Profil entreprise
      </button>
      <ChevronRight size={12} color={C.t3} />
      <span style={{ fontSize: 13, color: C.t2 }}>{label}</span>
    </div>
  );
}

// Barre de sauvegarde sticky en bas
function SaveBar({ dirty, onSave, onCancel }: { dirty: boolean; onSave: () => void; onCancel: () => void }) {
  if (!dirty) return null;
  return (
    <div style={{ position: 'sticky', bottom: 0, zIndex: 10, marginTop: 16, background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, backdropFilter: 'blur(8px)' }}>
      <span style={{ fontSize: 12, color: C.t3 }}>Modifications non enregistrées</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <GhostBtn onClick={onCancel} style={{ height: 34, fontSize: 12 }}>Annuler</GhostBtn>
        <TealBtn onClick={onSave} style={{ height: 34, fontSize: 12 }}><Check size={12} /> Enregistrer</TealBtn>
      </div>
    </div>
  );
}

// ── Sous-page : Identité ──────────────────────────────────────────────
// Layout : 2 colonnes — formulaire gauche + aperçu + conseils droite

function IdentityPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ companyName: form.companyName, businessType: form.businessType, sector: form.sector, description: form.description, website: form.website, companyPhone: form.companyPhone, companyEmail: form.companyEmail });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const init = d.companyName ? d.companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'TS';
  const orig = { companyName: form.companyName, businessType: form.businessType, sector: form.sector, description: form.description, website: form.website, companyPhone: form.companyPhone, companyEmail: form.companyEmail };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="Identité de l'entreprise" />

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]" style={{ gap: 14, alignItems: 'start' }}>
        {/* Gauche — formulaire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Nom + contacts */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 18 }}>Raison sociale & Contacts</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Raison sociale officielle</Lbl>
                <Inp value={d.companyName} onChange={set('companyName')} placeholder="Ex : Terex International SARL" />
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
                <Textarea value={d.description} onChange={set('description')} placeholder="Décrivez votre activité principale, vos marchés et vos produits ou services…" rows={4} />
              </div>
            </div>
          </div>

          {/* Forme juridique */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 14 }}>Forme juridique</div>
            <Pills options={BIZ_TYPES} value={d.businessType} onChange={set('businessType')} />
          </div>

          {/* Secteur */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 14 }}>Secteur d'activité</div>
            <Pills options={SECTORS} value={d.sector} onChange={set('sector')} />
          </div>
        </div>

        {/* Droite — aperçu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Carte aperçu */}
          <div style={{ background: 'linear-gradient(145deg, #1e1e1e 0%, #181818 100%)', border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 22px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 18 }}>Aperçu du profil public</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.bds}` }}>
              <div style={{ width: 52, height: 52, borderRadius: 13, background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>{init}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: d.companyName ? C.t1 : C.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.companyName || 'Raison sociale'}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{[d.businessType, d.sector].filter(Boolean).join(' · ') || '—'}</div>
              </div>
            </div>
            {[
              { k: 'Site web',   v: d.website  || '—' },
              { k: 'Téléphone', v: d.companyPhone || '—' },
              { k: 'Email',     v: d.companyEmail || '—' },
            ].map((r, i, a) => (
              <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < a.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{r.k}</span>
                <span style={{ fontSize: 12, color: r.v === '—' ? C.t3 : C.t2, fontFamily: MONO, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{r.v}</span>
              </div>
            ))}
          </div>

          {/* Conseils */}
          <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t2, marginBottom: 10 }}>À savoir</div>
            <ul style={{ color: C.t3, fontSize: 12, margin: 0, padding: '0 0 0 16px', lineHeight: 2 }}>
              <li>La raison sociale doit correspondre exactement à votre RCCM</li>
              <li>L'email professionnel reçoit toutes les confirmations</li>
              <li>La description améliore votre score de confiance Terex</li>
            </ul>
          </div>
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Dirigeant ─────────────────────────────────────────────
// Layout inversé : infos de vérification à GAUCHE, formulaire à DROITE

function DirectorPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ directorName: form.directorName, directorRole: form.directorRole, directorEmail: form.directorEmail, directorPhone: form.directorPhone });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const orig = { directorName: form.directorName, directorRole: form.directorRole, directorEmail: form.directorEmail, directorPhone: form.directorPhone };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);
  const initials = d.directorName ? d.directorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="Dirigeant & Représentant légal" />

      {/* Hero horizontal — pas en haut en pleine largeur, mais intégré dans le contenu */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '24px 28px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: C.t2, fontFamily: MONO, flexShrink: 0 }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: d.directorName ? C.t1 : C.t3, letterSpacing: '-0.02em' }}>{d.directorName || 'Nom du dirigeant'}</div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>{d.directorRole || 'Fonction'}{d.directorPhone ? ` · ${d.directorPhone}` : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>Rôle Terex</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t2 }}>Propriétaire</div>
          </div>
          <div style={{ width: 1, background: C.bds }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>KYC identité</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t2 }}>Soumise</div>
          </div>
        </div>
      </div>

      {/* 2 colonnes INVERSÉES : droite = formulaire */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* Gauche — accès et statuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14 }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bds}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Accès & Vérification</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {[
                { label: 'Rôle sur Terex',    value: 'Propriétaire',  ok: true },
                { label: 'KYC identité',      value: 'CNI soumise',   ok: true },
                { label: 'Email vérifié',     value: d.directorEmail || '—', ok: !!d.directorEmail },
                { label: 'Téléphone vérifié', value: d.directorPhone || '—', ok: !!d.directorPhone },
              ].map((r, i, arr) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.ok && <Check size={11} color={C.t3} strokeWidth={2.5} />}
                    <span style={{ fontSize: 12, color: r.ok ? C.t2 : C.t3, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{r.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.l2, border: `1px solid ${C.bds}`, borderRadius: 12, padding: '14px 16px' }}>
            <AlertCircle size={13} color={C.t3} style={{ marginBottom: 7 }} />
            <p style={{ fontSize: 12, color: C.t3, margin: 0, lineHeight: 1.65 }}>
              Le représentant légal est responsable de toute procédure KYC. Son identité doit correspondre aux documents soumis en Conformité.
            </p>
          </div>
        </div>

        {/* Droite — formulaire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Lbl>Nom complet</Lbl>
                <Inp value={d.directorName} onChange={set('directorName')} placeholder="Prénom Nom" />
              </div>
              <div>
                <Lbl>Email</Lbl>
                <Inp value={d.directorEmail} onChange={set('directorEmail')} placeholder="prenom@entreprise.sn" type="email" />
              </div>
              <div>
                <Lbl>Téléphone direct</Lbl>
                <Inp value={d.directorPhone} onChange={set('directorPhone')} placeholder="+221 77 000 00 00" type="tel" />
              </div>
            </div>
          </div>
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 24px' }}>
            <Lbl>Fonction / Poste</Lbl>
            <Pills options={DIR_ROLES} value={d.directorRole} onChange={set('directorRole')} />
          </div>
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Siège social ──────────────────────────────────────────
// Layout : colonne unique + pays en haut (pills) + adresse en dessous

function AddressPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ address: form.address, city: form.city, postalCode: form.postalCode, country: form.country });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const orig = { address: form.address, city: form.city, postalCode: form.postalCode, country: form.country };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);
  const full = [d.address, d.postalCode, d.city, d.country].filter(Boolean).join(', ');

  return (
    <div style={{ fontFamily: FONT, maxWidth: 720, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="Siège social" />

      {/* Carte adresse complète en haut */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #141414 100%)', border: `1px solid ${C.bds}`, borderRadius: 16, padding: '22px 26px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MapPin size={18} color={C.t3} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: full ? C.t1 : C.t3, lineHeight: 1.5, marginBottom: 3 }}>{full || 'Adresse non renseignée'}</div>
          <div style={{ fontSize: 11, color: C.t3 }}>Adresse de référence pour le RCCM et les justificatifs</div>
        </div>
      </div>

      {/* Pays d'abord */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 24px', marginBottom: 14 }}>
        <Lbl>Pays</Lbl>
        <Pills options={COUNTRIES} value={d.country} onChange={set('country')} />
      </div>

      {/* Adresse détaillée */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <Lbl>Rue et numéro</Lbl>
            <Inp value={d.address} onChange={set('address')} placeholder="Ex : 45 Avenue Léopold Sédar Senghor" />
          </div>
          <div>
            <Lbl>Ville</Lbl>
            <Inp value={d.city} onChange={set('city')} placeholder="Dakar, Abidjan…" />
          </div>
          <div>
            <Lbl>Code postal</Lbl>
            <Inp value={d.postalCode} onChange={set('postalCode')} placeholder="10700" />
          </div>
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Légal & Fiscal ────────────────────────────────────────
// Layout : 3 cartes de statut en haut, formulaire en-dessous

function LegalPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ rccm: form.rccm, ninea: form.ninea, capital: form.capital, foundedYear: form.foundedYear });
  const set = (k: keyof typeof d) => (v: string) => setD(p => ({ ...p, [k]: v }));
  const orig = { rccm: form.rccm, ninea: form.ninea, capital: form.capital, foundedYear: form.foundedYear };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);

  const statCards = [
    { title: 'RCCM',   value: d.rccm || '—',  sub: 'Registre de Commerce (OHADA)', ok: !!d.rccm  },
    { title: 'NINEA',  value: d.ninea || '—', sub: 'Identifiant fiscal Sénégal',   ok: !!d.ninea },
    { title: 'Capital',value: d.capital ? `${d.capital} FCFA` : '—', sub: 'Capital social déclaré', ok: !!d.capital },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="Informations légales & Fiscales" />

      {/* 3 cartes de statut en haut */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
        {statCards.map(s => (
          <div key={s.title} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 13, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{s.title}</span>
              {s.ok && <Check size={12} color={C.t3} strokeWidth={2.5} />}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: s.ok ? C.t1 : C.t3, fontFamily: MONO, letterSpacing: '0.01em', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Formulaire en 2 colonnes */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px', marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <Lbl>RCCM — Registre du Commerce et du Crédit Mobilier</Lbl>
            <Inp value={d.rccm} onChange={set('rccm')} placeholder="Ex : SN-DKR-2021-B-12345" />
            <div style={{ fontSize: 10, color: C.t3, marginTop: 5 }}>Délivré par le Tribunal de Commerce de Dakar ou la région compétente</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Lbl>NINEA — Numéro d'Identification Nationale des Entreprises et Associations</Lbl>
            <Inp value={d.ninea} onChange={set('ninea')} placeholder="Ex : 007654321 2Z3" />
            <div style={{ fontSize: 10, color: C.t3, marginTop: 5 }}>Obtenu auprès de la Direction Générale des Impôts et Domaines (DGID)</div>
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

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Sécurité ──────────────────────────────────────────────
// Layout : Mot de passe + 2FA côte à côte, sessions en-dessous full-width

function SecurityPage({ onBack }: { onBack: () => void }) {
  const [twofa, setTwofa]     = useState(false);
  const [showSetup, setSetup] = useState(false);
  const [oldPwd, setOld]      = useState('');
  const [newPwd, setNew]      = useState('');
  const [showO, setShowO]     = useState(false);
  const [showN, setShowN]     = useState(false);
  const [pwdOk, setPwdOk]     = useState(false);

  const sessions = [
    { device: 'Chrome · macOS 14',   ip: '41.82.xxx.xxx',  loc: 'Dakar, SN',    when: 'Maintenant',     cur: true  },
    { device: 'Safari · iPhone 14',  ip: '41.82.xxx.xxx',  loc: 'Dakar, SN',    when: 'Il y a 2h',      cur: false },
    { device: 'Firefox · Windows 11',ip: '154.12.xxx.xxx', loc: 'Abidjan, CI',  when: 'Il y a 3 jours', cur: false },
    { device: 'Chrome · Android',    ip: '197.234.xxx.xxx',loc: 'Dakar, SN',    when: 'Il y a 5 jours', cur: false },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="Sécurité du compte" />

      {/* Mot de passe + 2FA côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Mot de passe */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={15} color={C.t3} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Mot de passe</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>Modifié il y a 3 mois</div>
            </div>
          </div>
          {pwdOk ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 9, border: `1px solid ${C.bds}` }}>
              <Check size={13} color={C.t2} />
              <span style={{ fontSize: 13, color: C.t2 }}>Mot de passe mis à jour</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Lbl>Mot de passe actuel</Lbl>
                <div style={{ position: 'relative' }}>
                  <Inp value={oldPwd} onChange={setOld} placeholder="••••••••" type={showO ? 'text' : 'password'} />
                  <button onClick={() => setShowO(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                    {showO ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div>
                <Lbl>Nouveau mot de passe</Lbl>
                <div style={{ position: 'relative' }}>
                  <Inp value={newPwd} onChange={setNew} placeholder="8 caractères minimum" type={showN ? 'text' : 'password'} />
                  <button onClick={() => setShowN(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                    {showN ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <TealBtn onClick={() => { if (oldPwd && newPwd.length >= 8) { setPwdOk(true); setOld(''); setNew(''); setTimeout(() => setPwdOk(false), 3000); } }} disabled={!oldPwd || newPwd.length < 8} style={{ alignSelf: 'flex-start', fontSize: 12, height: 34 }}>
                Mettre à jour
              </TealBtn>
            </div>
          )}
        </div>

        {/* 2FA */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={15} color={C.t3} /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Authentification 2FA</div>
                <div style={{ fontSize: 11, color: twofa ? C.t2 : C.t3, marginTop: 1 }}>{twofa ? 'Activée — application OTP' : 'Désactivée'}</div>
              </div>
            </div>
            <Toggle on={twofa} onChange={v => { setTwofa(v); setSetup(v); }} />
          </div>
          {showSetup ? (
            <div style={{ background: C.l2, borderRadius: 10, padding: '16px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.t2, margin: '0 0 8px' }}>Configurer via Google Authenticator ou Authy</p>
              <div style={{ width: 88, height: 88, background: C.l3, border: `1px solid ${C.bd}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Hash size={28} color={C.t3} />
              </div>
              <Lbl>Code de vérification</Lbl>
              <div style={{ display: 'flex', gap: 8 }}>
                <Inp value="" onChange={() => {}} placeholder="000000" />
                <TealBtn style={{ flexShrink: 0, fontSize: 12, height: 38 }}>OK</TealBtn>
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px', background: C.l2, borderRadius: 9, fontSize: 12, color: C.t3, lineHeight: 1.6 }}>
              Activez la 2FA pour sécuriser votre compte contre les accès non autorisés. Fortement recommandée pour les comptes à haut volume.
            </div>
          )}
        </div>
      </div>

      {/* Sessions actives — pleine largeur */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Monitor size={13} color={C.t3} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Sessions actives</span>
          </div>
          <span style={{ fontSize: 11, color: C.t3 }}>{sessions.length} appareils connectés</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: i < sessions.length - 2 ? `1px solid ${C.bds}` : 'none', borderRight: i % 2 === 0 ? `1px solid ${C.bds}` : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.cur ? C.teal : C.l3, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.device}</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{s.loc} · {s.ip} · {s.when}</div>
              </div>
              {s.cur ? <span style={{ fontSize: 11, color: C.t3, flexShrink: 0 }}>Actuelle</span> : (
                <button style={{ fontSize: 11, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
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
  );
}

// ── Sous-page : Préférences ───────────────────────────────────────────
// Layout : liste de sections (pas de 2 colonnes) — style paramètres macOS

function PreferencesPage({ form, onBack, onSave }: { form: ProfileData; onBack: () => void; onSave: (p: Partial<ProfileData>) => void }) {
  const [d, setD] = useState({ language: form.language, currency: form.currency, timezone: form.timezone, notifEmail: form.notifEmail, notifSms: form.notifSms, notifPush: form.notifPush });
  const orig = { language: form.language, currency: form.currency, timezone: form.timezone, notifEmail: form.notifEmail, notifSms: form.notifSms, notifPush: form.notifPush };
  const dirty = JSON.stringify(d) !== JSON.stringify(orig);

  const notifs: Array<{ k: 'notifEmail' | 'notifSms' | 'notifPush'; label: string; sub: string }> = [
    { k: 'notifEmail', label: 'Email', sub: 'Confirmations, alertes, récapitulatifs mensuels' },
    { k: 'notifSms',   label: 'SMS',   sub: 'Codes 2FA et alertes critiques uniquement' },
    { k: 'notifPush',  label: 'Push',  sub: 'Notifications en temps réel sur l\'appareil' },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 720, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="Préférences" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Interface */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.bds}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Interface</span>
          </div>
          {[
            { label: 'Langue', sub: 'Langue de l\'interface Terex', options: ['Français', 'English', 'Wolof'], k: 'language' as const },
            { label: 'Devise d\'affichage', sub: 'Devise principale pour les montants', options: ['USDT', 'FCFA', 'EUR', 'USD'], k: 'currency' as const },
          ].map((row, ri, rarr) => (
            <div key={row.k} style={{ padding: '18px 22px', borderBottom: ri < rarr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>Fuseau horaire</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Utilisé pour les horodatages des transactions</div>
            </div>
            <span style={{ fontSize: 12, color: C.t2 }}>{d.timezone.split('/')[1]}</span>
          </div>
          <Pills options={['Africa/Dakar', 'Africa/Abidjan', 'Africa/Bamako', 'Europe/Paris']} value={d.timezone} onChange={v => setD(p => ({ ...p, timezone: v }))} />
        </div>

        {/* Notifications */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.bds}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Notifications</span>
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

      <SaveBar dirty={dirty} onSave={() => onSave(d)} onCancel={onBack} />
    </div>
  );
}

// ── Sous-page : Facturation ───────────────────────────────────────────
// Layout : 3 plans en haut + factures en-dessous

function BillingPage({ onBack }: { onBack: () => void }) {
  const invoices = [
    { ref: 'TRX-2025-042', date: 'Avr 2025', plan: 'Starter', amount: '0 FCFA' },
    { ref: 'TRX-2025-031', date: 'Mar 2025', plan: 'Starter', amount: '0 FCFA' },
    { ref: 'TRX-2025-020', date: 'Fév 2025', plan: 'Starter', amount: '0 FCFA' },
  ];

  const plans = [
    { name: 'Starter',    price: 'Gratuit',      limit: '5 000 USDT/mois', features: ['3 membres', 'KYC Niveau 1', 'Support email'], current: true  },
    { name: 'Business',   price: '25 000 FCFA/mois', limit: '100 000 USDT/mois', features: ['10 membres', 'KYC Niveau 2–3', 'Support prioritaire'], current: false },
    { name: 'Enterprise', price: 'Sur devis',    limit: 'Illimitée',       features: ['Membres illimités', 'SLA garanti', 'Dédié'], current: false },
  ];

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="Facturation & Abonnement" />

      {/* 3 plans côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
        {plans.map(p => (
          <div key={p.name} style={{ background: p.current ? 'linear-gradient(145deg, #1e1e1e, #181818)' : C.l1, border: `1px solid ${p.current ? C.bd : C.bds}`, borderRadius: 14, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{p.name}</span>
              {p.current && <span style={{ fontSize: 10, color: C.t2, background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.bds}`, padding: '3px 8px', borderRadius: 6 }}>Actuel</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: p.current ? C.t1 : C.t2, fontFamily: MONO, marginBottom: 4 }}>{p.price}</div>
            <div style={{ fontSize: 11, color: C.t3, marginBottom: 18 }}>{p.limit}</div>
            <div style={{ flex: 1 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <Check size={11} color={C.t3} strokeWidth={2.5} />
                  <span style={{ fontSize: 12, color: C.t3 }}>{f}</span>
                </div>
              ))}
            </div>
            {!p.current && (
              <button style={{ width: '100%', marginTop: 18, padding: '9px 0', background: 'transparent', border: `1px solid ${C.bds}`, borderRadius: 9, color: C.t2, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.13s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bds; e.currentTarget.style.color = C.t2; }}>
                Passer à {p.name}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Historique factures */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Historique des factures</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>
            <Download size={12} /> Tout exporter
          </button>
        </div>
        {invoices.map((inv, i) => (
          <div key={inv.ref} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: i < invoices.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{inv.plan} · {inv.date}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2, fontFamily: MONO }}>{inv.ref}</div>
            </div>
            <span style={{ fontSize: 13, fontFamily: MONO, color: C.t2 }}>{inv.amount}</span>
            <span style={{ fontSize: 11, color: C.t3 }}>Payée</span>
            <button style={{ display: 'flex', alignItems: 'center', color: C.t3, background: 'none', border: 'none', cursor: 'pointer' }}><Download size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sous-page : API & Intégrations ────────────────────────────────────
// Layout : gestion des clés full-width en haut + stats + webhook en 2 cols

function ApiPage({ onBack }: { onBack: () => void }) {
  const [keys, setKeys] = useState([
    { id: 'k1', name: 'Production', key: 'trx_live_4k2j9xa8x1mz', requests: 1847, lastUsed: 'il y a 2 min', active: true },
    { id: 'k2', name: 'Test',       key: 'trx_test_9m1c4z2r7qp6', requests: 342,  lastUsed: 'il y a 1h',    active: true },
  ]);
  const [show, setShow]     = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  function copy(k: string, id: string) {
    navigator.clipboard.writeText(k).catch(() => {});
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1040, margin: '0 auto', paddingBottom: 48 }}>
      <BreadCrumb onBack={onBack} label="API & Intégrations" />

      {/* Clés — pleine largeur */}
      <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.bds}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Clés API</span>
            <span style={{ fontSize: 11, color: C.t3, marginLeft: 10 }}>{keys.length} clé{keys.length > 1 ? 's' : ''} active{keys.length > 1 ? 's' : ''}</span>
          </div>
          <button onClick={() => setCreating(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, paddingLeft: 14, paddingRight: 14, background: C.teal, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
            <Plus size={12} /> Nouvelle clé
          </button>
        </div>

        {creating && (
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.bds}`, background: C.l2 }}>
            <Lbl>Nom de la clé</Lbl>
            <div style={{ display: 'flex', gap: 8 }}>
              <Inp value={newName} onChange={setNewName} placeholder="Ex : Mobile App, ERP, Shopify…" />
              <TealBtn onClick={() => { if (newName.trim()) { setKeys(p => [...p, { id: `k${Date.now()}`, name: newName.trim(), key: `trx_live_${Math.random().toString(36).slice(2, 14)}`, requests: 0, lastUsed: 'jamais', active: true }]); setNewName(''); setCreating(false); } }} style={{ flexShrink: 0, height: 38 }}><Check size={13} /></TealBtn>
              <GhostBtn onClick={() => setCreating(false)} style={{ flexShrink: 0, height: 38 }}><X size={13} /></GhostBtn>
            </div>
          </div>
        )}

        {keys.map((k, i) => (
          <div key={k.id} style={{ padding: '18px 24px', borderBottom: i < keys.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: k.active ? C.teal : C.t3 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{k.name}</span>
                <span style={{ fontSize: 11, color: C.t3 }}>{k.requests.toLocaleString()} requêtes · Dernière utilisation : {k.lastUsed}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => copy(k.key, k.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: copied === k.id ? C.t2 : C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                  {copied === k.id ? <><Check size={11} /> Copié</> : <><Copy size={11} /> Copier</>}
                </button>
                <button onClick={() => setKeys(p => p.filter(x => x.id !== k.id))}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.red)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.t3)}>
                  <Trash2 size={11} /> Supprimer
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: C.l2, borderRadius: 9, border: `1px solid ${C.bds}` }}>
              <code style={{ flex: 1, fontSize: 12, color: C.t2, fontFamily: MONO, letterSpacing: '0.04em' }}>
                {show[k.id] ? k.key : k.key.slice(0, 14) + '•'.repeat(8)}
              </code>
              <button onClick={() => setShow(p => ({ ...p, [k.id]: !p[k.id] }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex' }}>
                {show[k.id] ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats + Webhook en 2 colonnes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Stats */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14 }}>
          <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.bds}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Utilisation ce mois</span>
          </div>
          {[
            { label: 'Requêtes totales',   value: '2 189' },
            { label: 'Limite mensuelle',   value: '100 000' },
            { label: 'Webhooks envoyés',   value: '847' },
            { label: 'Taux d\'erreur',     value: '0.14 %' },
            { label: 'Temps moyen',        value: '120 ms' },
          ].map((r, i, arr) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 22px', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
              <span style={{ fontSize: 12, color: C.t3 }}>{r.label}</span>
              <span style={{ fontSize: 12, fontFamily: MONO, color: C.t1 }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Webhook */}
        <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '22px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={14} color={C.t3} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Webhook endpoint</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>Événements en temps réel</div>
            </div>
          </div>
          <Lbl>URL du serveur</Lbl>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Inp value="" onChange={() => {}} placeholder="https://serveur.com/webhook" type="url" />
            <TealBtn style={{ flexShrink: 0, height: 38 }}><Send size={13} /></TealBtn>
          </div>
          <Lbl>Événements</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['transaction.created', 'transaction.completed', 'kyc.updated', 'limit.changed'].map(e => (
              <span key={e} style={{ fontSize: 11, color: C.t3, background: C.l2, border: `1px solid ${C.bds}`, padding: '3px 9px', borderRadius: 6, fontFamily: MONO }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composant principal — page principale ─────────────────────────────

export function BusinessProfile({ user }: { user: { id?: string; email: string; name: string } | null }) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';
  const storKey = `terex_b2b_${userId}_profile3`;

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

  function save(partial: Partial<ProfileData>) {
    const next = { ...form, ...partial, updatedAt: new Date().toISOString() };
    setForm(next);
    localStorage.setItem(storKey, JSON.stringify(next));
    setFlash(true);
    setPage('main');
    setTimeout(() => setFlash(false), 2500);
  }

  // Sous-pages
  if (page === 'identity')    return <IdentityPage    form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'director')    return <DirectorPage    form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'address')     return <AddressPage     form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'legal')       return <LegalPage       form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'security')    return <SecurityPage    onBack={() => setPage('main')} />;
  if (page === 'preferences') return <PreferencesPage form={form} onBack={() => setPage('main')} onSave={save} />;
  if (page === 'billing')     return <BillingPage     onBack={() => setPage('main')} />;
  if (page === 'api')         return <ApiPage         onBack={() => setPage('main')} />;

  // Infos pour la page principale
  const initials = form.companyName
    ? form.companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (form.directorName ? form.directorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'TS');

  const scoreFields: (keyof ProfileData)[] = ['companyName', 'businessType', 'sector', 'directorName', 'directorEmail', 'rccm', 'ninea', 'address', 'country'];
  const filled = scoreFields.filter(f => form[f]).length;
  const pct    = Math.round((filled / scoreFields.length) * 100);

  // Groupes de navigation
  const groups = [
    {
      title: "Informations entreprise",
      items: [
        { id: 'identity'    as ProfilePage, icon: Building2,  label: "Identité de l'entreprise", sub: 'Raison sociale, forme juridique, secteur, contacts', val: form.companyName || '—' },
        { id: 'director'    as ProfilePage, icon: User,        label: 'Dirigeant & Représentant légal', sub: 'Nom, fonction, email, téléphone', val: form.directorName || '—' },
        { id: 'address'     as ProfilePage, icon: MapPin,      label: 'Siège social',            sub: 'Adresse officielle enregistrée au RCCM', val: [form.city, form.country].filter(Boolean).join(', ') || '—' },
      ],
    },
    {
      title: 'Documents légaux',
      items: [
        { id: 'legal'       as ProfilePage, icon: FileText,    label: 'Informations légales & Fiscales', sub: 'RCCM, NINEA, capital social, année de création', val: form.rccm || '—' },
      ],
    },
    {
      title: 'Compte & Sécurité',
      items: [
        { id: 'security'    as ProfilePage, icon: Shield,      label: 'Sécurité',                sub: 'Mot de passe, 2FA, sessions actives', val: '4 appareils' },
        { id: 'preferences' as ProfilePage, icon: Settings,    label: 'Préférences',             sub: 'Langue, devise, fuseau, notifications', val: form.language },
      ],
    },
    {
      title: 'Technique & Facturation',
      items: [
        { id: 'api'         as ProfilePage, icon: Code,        label: 'API & Intégrations',      sub: 'Clés API, webhooks, utilisation', val: '2 clés actives' },
        { id: 'billing'     as ProfilePage, icon: CreditCard,  label: 'Facturation & Abonnement',sub: 'Plan actuel, historique des factures', val: 'Starter · Gratuit' },
      ],
    },
  ];

  return (
    <div style={{ fontFamily: FONT, color: C.t1 }}>
      {flash && (
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.bds}`, borderRadius: 10, fontSize: 13, color: C.t2 }}>
          <Check size={13} /> Modifications enregistrées
        </div>
      )}

      {/* Layout principal : gauche = sections navigables, droite = carte identité */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]" style={{ gap: 14, alignItems: 'start' }}>

        {/* GAUCHE — sections horizontales (style Réglages) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {groups.map(g => (
            <div key={g.title} style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '10px 20px', borderBottom: `1px solid ${C.bds}` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{g.title}</span>
              </div>
              {g.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <RowItem key={item.id} icon={<Icon size={15} color={C.t3} />} label={item.label} sub={item.sub} val={item.val} isLast={i === g.items.length - 1} onClick={() => setPage(item.id)} />
                );
              })}
            </div>
          ))}
        </div>

        {/* DROITE — carte identité (sticky) + score complétion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 0 }}>

          {/* Carte identité */}
          <div style={{ background: 'linear-gradient(145deg, #1e1e1e 0%, #181818 100%)', border: `1px solid ${C.bds}`, borderRadius: 14, padding: '24px 22px' }}>
            {/* Avatar + nom centré */}
            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: `1px solid ${C.bds}`, marginBottom: 16 }}>
              <div style={{ width: 68, height: 68, borderRadius: 18, margin: '0 auto 14px', background: GRAD, border: `1px solid ${C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: C.t2, fontFamily: MONO }}>
                {initials}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: form.companyName ? C.t1 : C.t3, letterSpacing: '-0.02em', marginBottom: 4 }}>
                {form.companyName || 'Votre entreprise'}
              </div>
              <div style={{ fontSize: 12, color: C.t3 }}>
                {[form.businessType, form.sector].filter(Boolean).join(' · ') || 'Complétez votre profil'}
              </div>
            </div>

            {/* Stats */}
            {[
              { label: 'Niveau KYC',    value: 'Niveau 1 — Basique' },
              { label: 'Membres',       value: '4' },
              { label: 'Transactions',  value: '27 ce mois' },
              { label: 'Membre depuis', value: '6 mois' },
              { label: 'Pays',          value: form.country || '—' },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.bds}` : 'none' }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: C.t2 }}>{s.value}</span>
              </div>
            ))}

            <TealBtn onClick={() => setPage('identity')} style={{ width: '100%', marginTop: 16 }}>
              <Edit3 size={13} /> Modifier le profil
            </TealBtn>
          </div>

          {/* Score complétion */}
          <div style={{ background: C.l1, border: `1px solid ${C.bds}`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t2 }}>Complétion du profil</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontFamily: MONO }}>{pct}%</span>
            </div>
            <div style={{ height: 3, background: C.l3, borderRadius: 2, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: C.teal, borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
            {scoreFields.filter(f => !form[f]).slice(0, 3).map(f => {
              const labels: Record<string, string> = { companyName: 'Raison sociale', businessType: 'Forme juridique', sector: "Secteur d'activité", directorName: 'Nom du dirigeant', directorEmail: 'Email du dirigeant', rccm: 'RCCM', ninea: 'NINEA', address: 'Adresse', country: 'Pays' };
              return (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.t3, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: C.t3 }}>{labels[f] || f}</span>
                </div>
              );
            })}
            {filled === scoreFields.length && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Check size={12} color={C.t2} />
                <span style={{ fontSize: 12, color: C.t2 }}>Profil complet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Item de navigation horizontal
function RowItem({ icon, label, sub, val, isLast, onClick }: {
  icon: React.ReactNode; label: string; sub: string; val: string; isLast: boolean; onClick: () => void;
}) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: isLast ? 'none' : `1px solid ${C.bds}`, cursor: 'pointer', background: h ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.12s' }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: GRAD, border: `1px solid #2e2e2e`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{label}</div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{sub}</div>
      </div>
      <span style={{ fontSize: 12, color: C.t3, marginRight: 8, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', fontFamily: MONO }}>{val}</span>
      <ChevronRight size={14} color={C.t3} style={{ flexShrink: 0 }} />
    </div>
  );
}
