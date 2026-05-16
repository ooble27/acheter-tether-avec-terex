import { useState, useEffect } from 'react';
import {
  Check, Building2, Globe, Phone, Mail, Briefcase, AlertCircle,
  Info, BarChart2, FileText, Receipt, Shield, Link, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { id?: string; email: string; name: string } | null;
}

interface ProfileData {
  companyName: string;
  businessType: string;
  sector: string;
  country: string;
  city: string;
  website: string;
  phone: string;
  email: string;
  siret: string;
  vatNumber: string;
  updatedAt?: string;
}

const BUSINESS_TYPES = ['SARL / SA', 'SAS / SASU', 'Auto-entrepreneur', 'Association', 'Autre'];
const SECTORS = [
  'Import / Export', 'Textile & Confection', 'Électronique & Tech',
  'Alimentaire', 'Bâtiment & Matériaux', 'Logistique', 'Négoce', 'Autre',
];
const COUNTRIES = [
  'France', 'Sénégal', "Côte d'Ivoire", 'Maroc', 'Belgique',
  'Suisse', 'Canada', 'Autre',
];

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  bg: '#1a1a1a', l1: '#212121', l2: '#282828', l3: '#303030', l4: '#383838',
  bd: '#383838', bds: '#2a2a2a', bdh: '#484848',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#686868',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
  purple: '#a855f7', purpleT: 'rgba(168,85,247,0.08)', purpleB: 'rgba(168,85,247,0.20)',
  blue: '#3b82f6', blueT: 'rgba(59,130,246,0.08)', blueB: 'rgba(59,130,246,0.16)',
};
const FONT = "'Inter', sans-serif";

// ── PillGroup ─────────────────────────────────────────────────────
function PillGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            border: `1px solid ${value === opt ? C.tealB : C.bd}`,
            background: value === opt ? C.tealT : C.l2,
            color: value === opt ? C.teal : C.t3,
            cursor: 'pointer', fontFamily: FONT, transition: 'all 0.1s',
          }}
          onMouseEnter={e => { if (value !== opt) e.currentTarget.style.borderColor = C.bdh; }}
          onMouseLeave={e => { if (value !== opt) e.currentTarget.style.borderColor = C.bd; }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── TextInput ─────────────────────────────────────────────────────
function TextInput({
  value, onChange, placeholder, type = 'text', icon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <div style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: C.t3, display: 'flex', pointerEvents: 'none',
        }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%', background: C.l2,
          border: `1px solid ${focused ? 'rgba(59,150,143,0.35)' : C.bd}`,
          borderRadius: 8,
          paddingLeft: icon ? 36 : 14, paddingRight: 14, paddingTop: 11, paddingBottom: 11,
          color: C.t1, fontSize: 13, outline: 'none', fontFamily: FONT,
          boxSizing: 'border-box', transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}

// ── FieldLabel ────────────────────────────────────────────────────
function FieldLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 10, fontWeight: 600, color: C.t3,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 8, fontFamily: FONT,
    }}>
      {icon}
      {children}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <span style={{
        fontSize: 11, fontWeight: 600, color: C.t3,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: C.bds }} />
    </div>
  );
}

// ── SettingsCard ──────────────────────────────────────────────────
function SettingsCard({
  icon, iconBg, iconBorder, iconColor,
  title, subtitle, onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.l1,
        border: `1px solid ${hovered ? C.bdh : C.bds}`,
        borderRadius: 12, padding: 20,
        cursor: 'pointer', transition: 'border-color 0.15s',
        display: 'flex', flexDirection: 'column', gap: 12,
        fontFamily: FONT,
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: iconBg, border: `1px solid ${iconBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ color: iconColor }}>{icon}</div>
      </div>
      {/* Text */}
      <div>
        <p style={{ color: C.t1, fontSize: 14, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.2 }}>
          {title}
        </p>
        <p style={{
          color: C.t3, fontSize: 12, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ── Edit panel views ───────────────────────────────────────────────
type EditSection = 'identity' | 'juridique' | 'sector' | 'location' | 'contacts' | 'website' | 'siret' | 'vat' | 'kyc' | null;

function EditPanel({
  section, form, setForm, onBack, onSave,
}: {
  section: EditSection;
  form: ProfileData;
  setForm: React.Dispatch<React.SetStateAction<ProfileData>>;
  onBack: () => void;
  onSave: () => void;
}) {
  const set = (k: keyof ProfileData) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const titles: Record<string, string> = {
    identity: 'Raison sociale',
    juridique: 'Forme juridique',
    sector: "Secteur d'activité",
    location: 'Localisation',
    contacts: 'Téléphone & Email',
    website: 'Site web',
    siret: 'SIRET / RC',
    vat: 'Numéro TVA',
    kyc: 'KYC Statut',
  };

  return (
    <div style={{ maxWidth: 640, fontFamily: FONT }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: C.t3, background: 'none', border: 'none',
          cursor: 'pointer', fontSize: 13, marginBottom: 24, padding: 0,
          fontFamily: FONT,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
        onMouseLeave={e => (e.currentTarget.style.color = C.t3)}
      >
        <ArrowLeft style={{ width: 15, height: 15 }} />
        Paramètres
      </button>

      <h3 style={{ color: C.t1, fontSize: 16, fontWeight: 600, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
        {section ? titles[section] : ''}
      </h3>

      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 12, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* identity */}
        {section === 'identity' && (
          <div>
            <FieldLabel icon={<Building2 style={{ width: 12, height: 12 }} />}>Raison sociale</FieldLabel>
            <TextInput value={form.companyName} onChange={set('companyName')} placeholder="Nom officiel de votre entreprise" />
          </div>
        )}

        {/* juridique */}
        {section === 'juridique' && (
          <div>
            <FieldLabel icon={<Briefcase style={{ width: 12, height: 12 }} />}>Forme juridique</FieldLabel>
            <PillGroup options={BUSINESS_TYPES} value={form.businessType} onChange={set('businessType')} />
          </div>
        )}

        {/* sector */}
        {section === 'sector' && (
          <div>
            <FieldLabel>Secteur d'activité</FieldLabel>
            <PillGroup options={SECTORS} value={form.sector} onChange={set('sector')} />
          </div>
        )}

        {/* location */}
        {section === 'location' && (
          <>
            <div>
              <FieldLabel icon={<Globe style={{ width: 12, height: 12 }} />}>Pays</FieldLabel>
              <PillGroup options={COUNTRIES} value={form.country} onChange={set('country')} />
            </div>
            <div>
              <FieldLabel>Ville</FieldLabel>
              <TextInput value={form.city} onChange={set('city')} placeholder="Paris, Dakar, Casablanca…" />
            </div>
          </>
        )}

        {/* contacts */}
        {section === 'contacts' && (
          <>
            <div>
              <FieldLabel icon={<Phone style={{ width: 12, height: 12 }} />}>Téléphone</FieldLabel>
              <TextInput
                value={form.phone} onChange={set('phone')}
                placeholder="+33 6 00 00 00 00" type="tel"
                icon={<Phone style={{ width: 14, height: 14 }} />}
              />
            </div>
            <div>
              <FieldLabel icon={<Mail style={{ width: 12, height: 12 }} />}>Email professionnel</FieldLabel>
              <TextInput
                value={form.email} onChange={set('email')}
                placeholder="contact@entreprise.com" type="email"
                icon={<Mail style={{ width: 14, height: 14 }} />}
              />
            </div>
          </>
        )}

        {/* website */}
        {section === 'website' && (
          <div>
            <FieldLabel icon={<Link style={{ width: 12, height: 12 }} />}>URL du site web</FieldLabel>
            <TextInput value={form.website} onChange={set('website')} placeholder="https://entreprise.com" type="url" />
          </div>
        )}

        {/* siret */}
        {section === 'siret' && (
          <div>
            <FieldLabel icon={<FileText style={{ width: 12, height: 12 }} />}>SIRET / Registre du commerce</FieldLabel>
            <TextInput value={form.siret} onChange={set('siret')} placeholder="Ex : 123 456 789 00012" />
          </div>
        )}

        {/* vat */}
        {section === 'vat' && (
          <div>
            <FieldLabel icon={<Receipt style={{ width: 12, height: 12 }} />}>Numéro de TVA intracommunautaire</FieldLabel>
            <TextInput value={form.vatNumber} onChange={set('vatNumber')} placeholder="Ex : FR12345678901" />
          </div>
        )}

        {/* kyc */}
        {section === 'kyc' && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: 14, borderRadius: 8,
            background: C.tealT, border: `1px solid ${C.tealB}`,
          }}>
            <Info style={{ width: 14, height: 14, color: C.teal, flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: C.t3, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              La vérification KYC entreprise sera demandée pour les volumes supérieurs à 10 000 USDT/mois.
              Notre équipe vous contactera pour vous guider dans les démarches.
            </p>
          </div>
        )}

        {/* Save button */}
        {section !== 'kyc' && (
          <button
            onClick={onSave}
            style={{
              height: 44, width: '100%', borderRadius: 8, border: 'none',
              background: C.teal, color: '#fff', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.tealH; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.teal; }}
          >
            <Check style={{ width: 15, height: 15 }} />
            Enregistrer les modifications
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export function BusinessProfile({ user }: Props) {
  const { session } = useAuth();
  const userId = user?.id || session?.user?.id || user?.email || 'guest';
  const storageKey = `terex_b2b_${userId}_profile`;

  const [editSection, setEditSection] = useState<EditSection>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<ProfileData>({
    companyName: '', businessType: '', sector: '',
    country: '', city: '', website: '',
    phone: '', email: '', siret: '', vatNumber: '',
  });

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (existing) setForm(existing);
      else if (user?.email) setForm(f => ({ ...f, email: user.email }));
    } catch {}
  }, [userId]);

  // Completion calc (6 core fields)
  const coreFields: (keyof ProfileData)[] = ['companyName', 'businessType', 'sector', 'country', 'phone', 'email'];
  const filled = coreFields.filter(f => form[f]).length;
  const pct = Math.round((filled / coreFields.length) * 100);
  const isComplete = pct === 100;

  const handleSave = () => {
    const data = { ...form, updatedAt: new Date().toISOString() };
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSaved(true);
    setEditSection(null);
    setTimeout(() => setSaved(false), 2500);
  };

  // If editing a section, show edit panel
  if (editSection !== null) {
    return (
      <EditPanel
        section={editSection}
        form={form}
        setForm={setForm}
        onBack={() => setEditSection(null)}
        onSave={handleSave}
      />
    );
  }

  const kycComplete = !!(form.siret && form.vatNumber);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: FONT }}>
      {/* Page header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
          <div>
            <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
              Paramètres entreprise
            </h2>
            <p style={{ color: C.t3, fontSize: 12, marginTop: 4, margin: '4px 0 0' }}>
              Informations de votre société
            </p>
          </div>
          {isComplete ? (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 500, color: C.em,
              border: `1px solid ${C.emB}`, background: C.emT,
              padding: '5px 10px', borderRadius: 7, flexShrink: 0,
            }}>
              <Check style={{ width: 12, height: 12 }} /> Complet
            </span>
          ) : (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 500, color: C.amber,
              border: `1px solid ${C.amberB}`, background: C.amberT,
              padding: '5px 10px', borderRadius: 7, flexShrink: 0,
            }}>
              <AlertCircle style={{ width: 12, height: 12 }} /> Incomplet
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: C.l3, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: C.teal, borderRadius: 99,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <p style={{ color: C.t3, fontSize: 11, marginTop: 6, margin: '6px 0 0' }}>
          {pct}% complété — {filled}/{coreFields.length} informations essentielles renseignées
        </p>
      </div>

      {/* Save feedback */}
      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 8,
          background: C.emT, border: `1px solid ${C.emB}`,
          fontSize: 13, color: C.em,
        }}>
          <Check style={{ width: 14, height: 14 }} />
          Modifications enregistrées
        </div>
      )}

      {/* Section: Identité & Activité */}
      <div>
        <SectionHeader>Identité &amp; Activité</SectionHeader>
        <div style={{
          display: 'grid',
          gap: 12,
        }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <SettingsCard
            icon={<Building2 style={{ width: 18, height: 18 }} />}
            iconBg={C.tealT} iconBorder={C.tealB} iconColor={C.teal}
            title="Raison sociale"
            subtitle={form.companyName || 'Non renseigné'}
            onClick={() => setEditSection('identity')}
          />
          <SettingsCard
            icon={<Briefcase style={{ width: 18, height: 18 }} />}
            iconBg={C.purpleT} iconBorder={C.purpleB} iconColor={C.purple}
            title="Forme juridique"
            subtitle={form.businessType || 'Non renseigné'}
            onClick={() => setEditSection('juridique')}
          />
          <SettingsCard
            icon={<BarChart2 style={{ width: 18, height: 18 }} />}
            iconBg={C.blueT} iconBorder={C.blueB} iconColor={C.blue}
            title="Secteur d'activité"
            subtitle={form.sector || 'Non renseigné'}
            onClick={() => setEditSection('sector')}
          />
        </div>
      </div>

      {/* Section: Coordonnées */}
      <div>
        <SectionHeader>Coordonnées</SectionHeader>
        <div style={{
          display: 'grid',
          gap: 12,
        }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <SettingsCard
            icon={<Globe style={{ width: 18, height: 18 }} />}
            iconBg={C.amberT} iconBorder={C.amberB} iconColor={C.amber}
            title="Localisation"
            subtitle={[form.city, form.country].filter(Boolean).join(', ') || 'Non renseigné'}
            onClick={() => setEditSection('location')}
          />
          <SettingsCard
            icon={<Phone style={{ width: 18, height: 18 }} />}
            iconBg={C.tealT} iconBorder={C.tealB} iconColor={C.teal}
            title="Contacts"
            subtitle={form.phone || form.email || 'Non renseigné'}
            onClick={() => setEditSection('contacts')}
          />
          <SettingsCard
            icon={<Link style={{ width: 18, height: 18 }} />}
            iconBg={C.emT} iconBorder={C.emB} iconColor={C.em}
            title="Site web"
            subtitle={form.website || 'Non renseigné'}
            onClick={() => setEditSection('website')}
          />
        </div>
      </div>

      {/* Section: Documents & KYC */}
      <div>
        <SectionHeader>Documents &amp; KYC</SectionHeader>
        <div style={{
          display: 'grid',
          gap: 12,
        }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <SettingsCard
            icon={<FileText style={{ width: 18, height: 18 }} />}
            iconBg={C.amberT} iconBorder={C.amberB} iconColor={C.amber}
            title="SIRET / RC"
            subtitle={form.siret || 'Non renseigné'}
            onClick={() => setEditSection('siret')}
          />
          <SettingsCard
            icon={<Receipt style={{ width: 18, height: 18 }} />}
            iconBg={C.blueT} iconBorder={C.blueB} iconColor={C.blue}
            title="N° TVA"
            subtitle={form.vatNumber || 'Non renseigné'}
            onClick={() => setEditSection('vat')}
          />
          <SettingsCard
            icon={<Shield style={{ width: 18, height: 18 }} />}
            iconBg={kycComplete ? C.emT : C.amberT}
            iconBorder={kycComplete ? C.emB : C.amberB}
            iconColor={kycComplete ? C.em : C.amber}
            title="KYC Statut"
            subtitle={kycComplete ? 'Vérifié' : 'Vérification requise'}
            onClick={() => setEditSection('kyc')}
          />
        </div>
      </div>
    </div>
  );
}
