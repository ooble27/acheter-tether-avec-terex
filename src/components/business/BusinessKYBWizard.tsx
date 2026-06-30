import { useState, useRef } from 'react';
import { useBusinessKYB, BusinessKYBData } from '@/hooks/useBusinessKYB';

// ─── Step Progress Bar ─────────────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
              i + 1 < current
                ? 'bg-[#ffffff] text-black'
                : i + 1 === current
                ? 'bg-[#ffffff] text-black ring-2 ring-[#ffffff] ring-offset-2 ring-offset-[#111111]'
                : 'bg-[#222] text-[#555]'
            }`}
          >
            {i + 1 < current ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 flex-1 transition-colors ${i + 1 < current ? 'bg-[#ffffff]' : 'bg-[#222]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#888] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#ffffff] transition-colors placeholder-[#444]';

const selectClass =
  'bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#ffffff] transition-colors appearance-none cursor-pointer';

// ─── File Upload Field ─────────────────────────────────────────────────────────
function FileUploadField({
  label,
  value,
  uploading,
  onFile,
  accept = 'image/*,.pdf',
}: {
  label: string;
  value: string;
  uploading: boolean;
  onFile: (file: File) => void;
  accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const uploaded = !!value;

  return (
    <Field label={label}>
      <div
        onClick={() => !uploading && ref.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          uploaded
            ? 'border-[#ffffff] bg-[#ffffff]/5'
            : uploading
            ? 'border-[#ffffff]/50 bg-[#181818]'
            : 'border-[#333] bg-[#181818] hover:border-[#ffffff]'
        }`}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#888] text-xs">Téléchargement…</p>
          </div>
        ) : uploaded ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#ffffff]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#ffffff] text-xs font-medium">Document chargé</p>
            <p className="text-[#555] text-xs">Cliquer pour remplacer</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-[#888] text-xs">Cliquer pour importer</p>
            <p className="text-[#555] text-xs">PDF, JPG, PNG acceptés</p>
          </div>
        )}
      </div>
    </Field>
  );
}

// ─── Step 1: Company Info ──────────────────────────────────────────────────────
function Step1({
  draft,
  onChange,
}: {
  draft: BusinessKYBData;
  onChange: (k: keyof BusinessKYBData, v: string) => void;
}) {
  const legalForms = ['SARL', 'SA', 'SNC', 'GIE', 'ONG', 'Autre'];
  const sectors = ['Import/Export', 'Distribution', 'Services', 'E-commerce', 'Industrie', 'Construction', 'Agriculture', 'Autre'];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Raison sociale *">
          <input
            className={inputClass}
            placeholder="Nom officiel de l'entreprise"
            value={draft.company_name}
            onChange={e => onChange('company_name', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Forme juridique *">
        <select className={selectClass} value={draft.legal_form} onChange={e => onChange('legal_form', e.target.value)}>
          <option value="">Sélectionner…</option>
          {legalForms.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Field>
      <Field label="Secteur d'activité *">
        <select className={selectClass} value={draft.sector} onChange={e => onChange('sector', e.target.value)}>
          <option value="">Sélectionner…</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Numéro RCCM">
        <input
          className={inputClass}
          placeholder="SN-DKR-2024-B-12345"
          value={draft.rccm_number}
          onChange={e => onChange('rccm_number', e.target.value)}
        />
      </Field>
      <Field label="Numéro NINEA">
        <input
          className={inputClass}
          placeholder="00000000 0A0"
          value={draft.ninea_number}
          onChange={e => onChange('ninea_number', e.target.value)}
        />
      </Field>
      <Field label="Pays">
        <input
          className={inputClass}
          value={draft.country}
          onChange={e => onChange('country', e.target.value)}
        />
      </Field>
      <Field label="Ville *">
        <input
          className={inputClass}
          placeholder="Dakar"
          value={draft.city}
          onChange={e => onChange('city', e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Adresse complète *">
          <input
            className={inputClass}
            placeholder="Rue, quartier, BP…"
            value={draft.address}
            onChange={e => onChange('address', e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Step 2: Legal Representative ─────────────────────────────────────────────
function Step2({
  draft,
  onChange,
  onFile,
  uploading,
}: {
  draft: BusinessKYBData;
  onChange: (k: keyof BusinessKYBData, v: string) => void;
  onFile: (field: keyof BusinessKYBData, file: File) => void;
  uploading: Record<string, boolean>;
}) {
  const roles = ['Directeur Général', 'PDG', 'Gérant', 'Directeur', 'Fondateur', 'Autre'];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Nom complet du représentant *">
          <input
            className={inputClass}
            placeholder="Prénom NOM"
            value={draft.rep_name}
            onChange={e => onChange('rep_name', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Fonction *">
        <select className={selectClass} value={draft.rep_role} onChange={e => onChange('rep_role', e.target.value)}>
          <option value="">Sélectionner…</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Téléphone *">
        <input
          className={inputClass}
          placeholder="+221 77 000 00 00"
          value={draft.rep_phone}
          onChange={e => onChange('rep_phone', e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <FileUploadField
          label="Pièce d'identité du représentant *"
          value={draft.rep_id_document_url}
          uploading={!!uploading['rep_id_document_url']}
          onFile={file => onFile('rep_id_document_url', file)}
        />
      </div>
    </div>
  );
}

// ─── Step 3: Company Documents ────────────────────────────────────────────────
function Step3({
  draft,
  onFile,
  uploading,
}: {
  draft: BusinessKYBData;
  onFile: (field: keyof BusinessKYBData, file: File) => void;
  uploading: Record<string, boolean>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <p className="text-[#888] text-sm mb-4">
          Veuillez importer des copies lisibles des documents officiels de votre entreprise.
        </p>
      </div>
      <div className="sm:col-span-2">
        <FileUploadField
          label="Registre du Commerce (RCCM) *"
          value={draft.rccm_document_url}
          uploading={!!uploading['rccm_document_url']}
          onFile={file => onFile('rccm_document_url', file)}
        />
      </div>
      <div className="sm:col-span-2">
        <FileUploadField
          label="Document NINEA *"
          value={draft.ninea_document_url}
          uploading={!!uploading['ninea_document_url']}
          onFile={file => onFile('ninea_document_url', file)}
        />
      </div>
      <div className="sm:col-span-2">
        <FileUploadField
          label="Justificatif de domicile professionnel *"
          value={draft.address_proof_url}
          uploading={!!uploading['address_proof_url']}
          onFile={file => onFile('address_proof_url', file)}
        />
      </div>
    </div>
  );
}

// ─── Step 4: Summary ──────────────────────────────────────────────────────────
function Step4({ draft }: { draft: BusinessKYBData }) {
  const docStatus = (url: string) =>
    url ? (
      <span className="text-[#ffffff] text-xs font-medium">✓ Fourni</span>
    ) : (
      <span className="text-[#888] text-xs">Non fourni</span>
    );

  return (
    <div className="space-y-4">
      <p className="text-[#888] text-sm">
        Vérifiez les informations avant de soumettre votre dossier.
      </p>

      {/* Company info */}
      <div className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider">Entreprise</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="text-[#666]">Raison sociale</span><p className="text-white truncate">{draft.company_name || '—'}</p></div>
          <div><span className="text-[#666]">Forme juridique</span><p className="text-white">{draft.legal_form || '—'}</p></div>
          <div><span className="text-[#666]">Secteur</span><p className="text-white">{draft.sector || '—'}</p></div>
          <div><span className="text-[#666]">Ville</span><p className="text-white">{draft.city || '—'}</p></div>
          <div><span className="text-[#666]">RCCM</span><p className="text-white">{draft.rccm_number || '—'}</p></div>
          <div><span className="text-[#666]">NINEA</span><p className="text-white">{draft.ninea_number || '—'}</p></div>
        </div>
      </div>

      {/* Rep info */}
      <div className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider">Représentant légal</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="text-[#666]">Nom</span><p className="text-white">{draft.rep_name || '—'}</p></div>
          <div><span className="text-[#666]">Fonction</span><p className="text-white">{draft.rep_role || '—'}</p></div>
          <div><span className="text-[#666]">Téléphone</span><p className="text-white">{draft.rep_phone || '—'}</p></div>
          <div><span className="text-[#666]">Pièce d'identité</span>{docStatus(draft.rep_id_document_url)}</div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider">Documents</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center"><span className="text-[#666]">RCCM</span>{docStatus(draft.rccm_document_url)}</div>
          <div className="flex justify-between items-center"><span className="text-[#666]">NINEA</span>{docStatus(draft.ninea_document_url)}</div>
          <div className="flex justify-between items-center"><span className="text-[#666]">Justificatif domicile</span>{docStatus(draft.address_proof_url)}</div>
        </div>
      </div>

      <p className="text-[#555] text-xs leading-relaxed">
        En soumettant ce dossier, vous certifiez l'exactitude des informations fournies. Notre équipe
        examinera votre dossier sous 24 à 48 heures ouvrables.
      </p>
    </div>
  );
}

// ─── Pending Screen ────────────────────────────────────────────────────────────
function PendingScreen({ companyName, onComplete }: { companyName: string; onComplete: () => void }) {
  const checks = [
    'Informations de l\'entreprise',
    'Identité du représentant légal',
    'Documents RCCM & NINEA',
    'Justificatif de domicile',
  ];

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#ffffff]/15 border border-[#ffffff]/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Dossier soumis avec succès</h1>
          <p className="text-[#888] text-sm leading-relaxed">
            Notre équipe examine votre dossier. Vous serez notifié par email sous 24–48h.
          </p>
        </div>

        {/* Company badge */}
        {companyName && (
          <div className="bg-[#181818] border border-[#222] rounded-xl px-4 py-3 inline-block">
            <p className="text-xs text-[#666] mb-0.5">Entreprise</p>
            <p className="text-white font-semibold">{companyName}</p>
          </div>
        )}

        {/* Checklist */}
        <div className="bg-[#181818] border border-[#222] rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider mb-3">Ce qui sera vérifié</p>
          {checks.map(item => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#ffffff]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[#ccc] text-sm">{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onComplete}
          className="bg-[#ffffff] hover:bg-[#2d7870] text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors w-full"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

// ─── Step titles ───────────────────────────────────────────────────────────────
const STEP_TITLES = [
  'Informations de l\'entreprise',
  'Représentant légal',
  'Documents officiels',
  'Récapitulatif',
];

// ─── Main Wizard ───────────────────────────────────────────────────────────────
export function BusinessKYBWizard({ userId, onComplete }: { userId: string; onComplete: () => void }) {
  const { data, loading, saving, save, uploadDocument, submit } = useBusinessKYB(userId);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BusinessKYBData | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sync draft from fetched data
  const activeDraft = draft ?? data;

  const onChange = (k: keyof BusinessKYBData, v: string) => {
    setDraft(prev => ({ ...(prev ?? data), [k]: v }));
  };

  const onFile = async (field: keyof BusinessKYBData, file: File) => {
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const url = await uploadDocument(file, field as string);
      setDraft(prev => ({ ...(prev ?? data), [field]: url }));
    } catch (e: any) {
      console.error('Upload failed:', e.message);
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleNext = async () => {
    await save(activeDraft);
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await save(activeDraft);
      await submit();
      setSubmitted(true);
    } catch (e: any) {
      console.error('Submit failed:', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // If KYB already submitted/reviewed show pending
  const isAlreadySubmitted = ['submitted', 'under_review'].includes(data.status);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#ffffff] flex items-center justify-center">
            <span className="text-black font-black text-xs">TB</span>
          </div>
          <p className="text-[#666] text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (submitted || isAlreadySubmitted) {
    return (
      <PendingScreen
        companyName={activeDraft.company_name}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ffffff] flex items-center justify-center">
              <span className="text-black font-black text-xs">TB</span>
            </div>
            <span className="text-white font-bold text-base">Terex Business</span>
          </div>
          <span className="text-[#888] text-sm">Étape {step} sur 4</span>
        </div>

        {/* Card */}
        <div className="bg-[#181818] border border-[#222222] rounded-xl p-6">
          {/* Step progress */}
          <StepBar current={step} total={4} />

          {/* Step title */}
          <h2 className="text-white font-bold text-lg mb-5">{STEP_TITLES[step - 1]}</h2>

          {/* Step content */}
          {step === 1 && <Step1 draft={activeDraft} onChange={onChange} />}
          {step === 2 && <Step2 draft={activeDraft} onChange={onChange} onFile={onFile} uploading={uploading} />}
          {step === 3 && <Step3 draft={activeDraft} onFile={onFile} uploading={uploading} />}
          {step === 4 && <Step4 draft={activeDraft} />}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-[#222]">
            {step > 1 ? (
              <button
                onClick={handleBack}
                disabled={saving}
                className="bg-[#181818] border border-[#333] text-[#888] px-6 py-2.5 rounded-xl text-sm hover:border-[#444] transition-colors disabled:opacity-50"
              >
                Retour
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={saving || Object.values(uploading).some(Boolean)}
                className="bg-[#ffffff] hover:bg-[#2d7870] text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && (
                  <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                )}
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || saving || Object.values(uploading).some(Boolean)}
                className="bg-[#ffffff] hover:bg-[#2d7870] text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {(submitting || saving) && (
                  <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                )}
                Soumettre le dossier
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[#444] text-xs mt-4">
          Vos données sont chiffrées et sécurisées • Terex Business
        </p>
      </div>
    </div>
  );
}
