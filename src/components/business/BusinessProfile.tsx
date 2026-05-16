import { useState, useEffect } from 'react';
import { Check, Building2, Globe, Phone, Mail, Briefcase, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  user: { email: string; name: string } | null;
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
  l1: '#141414', l2: '#191919', l3: '#1f1f1f', l4: '#242424',
  bd: '#2a2a2a', bds: '#1f1f1f', bdh: '#333333',
  teal: '#3B968F', tealH: '#2d7870', tealT: 'rgba(59,150,143,0.08)', tealB: 'rgba(59,150,143,0.20)',
  t1: '#f0f0f0', t2: '#888888', t3: '#555555',
  amber: '#f59e0b', amberT: 'rgba(245,158,11,0.08)', amberB: 'rgba(245,158,11,0.16)',
  em: '#22c55e', emT: 'rgba(34,197,94,0.08)', emB: 'rgba(34,197,94,0.16)',
};
const FONT = "'Inter', sans-serif";

// ── Pill selector ─────────────────────────────────────────────────
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

// ── Input ─────────────────────────────────────────────────────────
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

// ── Label ─────────────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────
export function BusinessProfile({ user }: Props) {
  const { session } = useAuth();
  const userId = session?.user?.id || user?.email || 'guest';
  const storageKey = `terex_b2b_${userId}_profile`;

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    businessType: '',
    sector: '',
    country: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (existing) setForm(existing);
      else if (user?.email) setForm(f => ({ ...f, email: user.email }));
    } catch {}
  }, [userId]);

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  // Calculate completion percentage
  const fields = ['companyName', 'businessType', 'sector', 'country', 'phone', 'email'] as const;
  const filled = fields.filter(f => form[f]).length;
  const pct = Math.round((filled / fields.length) * 100);
  const isComplete = pct === 100;

  const handleSave = () => {
    const data = { ...form, updatedAt: new Date().toISOString() };
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640, fontFamily: FONT }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ color: C.t1, fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
            Profil entreprise
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
            <Check style={{ width: 12, height: 12 }} /> Profil complet
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
      <div>
        <div style={{ height: 2, background: C.l3, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: C.teal, borderRadius: 99,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <p style={{ color: C.t3, fontSize: 11, marginTop: 6, margin: '6px 0 0' }}>
          {pct}% complété
        </p>
      </div>

      {/* Form card */}
      <div style={{
        background: C.l1, border: `1px solid ${C.bds}`,
        borderRadius: 12, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Raison sociale */}
        <div>
          <FieldLabel icon={<Building2 style={{ width: 12, height: 12 }} />}>
            Raison sociale
          </FieldLabel>
          <TextInput
            value={form.companyName}
            onChange={set('companyName')}
            placeholder="Nom officiel de votre entreprise"
          />
        </div>

        {/* Forme juridique pills */}
        <div>
          <FieldLabel icon={<Briefcase style={{ width: 12, height: 12 }} />}>
            Forme juridique
          </FieldLabel>
          <PillGroup options={BUSINESS_TYPES} value={form.businessType} onChange={set('businessType')} />
        </div>

        {/* Secteur pills */}
        <div>
          <FieldLabel>Secteur d'activité</FieldLabel>
          <PillGroup options={SECTORS} value={form.sector} onChange={set('sector')} />
        </div>

        {/* Pays pills */}
        <div>
          <FieldLabel icon={<Globe style={{ width: 12, height: 12 }} />}>
            Pays de résidence
          </FieldLabel>
          <PillGroup options={COUNTRIES} value={form.country} onChange={set('country')} />
        </div>

        {/* Téléphone + Email grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <FieldLabel icon={<Phone style={{ width: 12, height: 12 }} />}>Téléphone</FieldLabel>
            <TextInput
              value={form.phone}
              onChange={set('phone')}
              placeholder="+33 6 00 00 00 00"
              type="tel"
              icon={<Phone style={{ width: 14, height: 14 }} />}
            />
          </div>
          <div>
            <FieldLabel icon={<Mail style={{ width: 12, height: 12 }} />}>Email professionnel</FieldLabel>
            <TextInput
              value={form.email}
              onChange={set('email')}
              placeholder="contact@entreprise.com"
              type="email"
              icon={<Mail style={{ width: 14, height: 14 }} />}
            />
          </div>
        </div>

        {/* KYC info block */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: 14, borderRadius: 8,
          background: C.tealT, border: `1px solid ${C.tealB}`,
        }}>
          <Info style={{ width: 14, height: 14, color: C.t3, flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: C.t3, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            La vérification KYC entreprise sera demandée pour les volumes supérieurs à 10 000 USDT/mois.
            Notre équipe vous contactera pour vous guider dans les démarches.
          </p>
        </div>

        {/* Save button — teal → green on save */}
        <button
          onClick={handleSave}
          style={{
            height: 44, width: '100%', borderRadius: 8, border: 'none',
            background: saved ? '#16a34a' : C.teal,
            color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: FONT,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { if (!saved) e.currentTarget.style.background = C.tealH; }}
          onMouseLeave={e => { if (!saved) e.currentTarget.style.background = C.teal; }}
        >
          {saved ? (
            <><Check style={{ width: 15, height: 15 }} /> Profil enregistré</>
          ) : (
            'Enregistrer le profil'
          )}
        </button>
      </div>
    </div>
  );
}
