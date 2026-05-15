import { useState, useEffect } from 'react';
import { Check, Building2, Globe, Phone, Mail, Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  'France', 'Sénégal', 'Côte d\'Ivoire', 'Maroc', 'Belgique',
  'Suisse', 'Canada', 'Autre',
];

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
  const isComplete = form.companyName && form.businessType && form.sector && form.country;

  const handleSave = () => {
    const data = { ...form, createdAt: new Date().toISOString() };
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-bold">Profil entreprise</h2>
          <p className="text-gray-600 text-sm mt-0.5">Informations de votre société</p>
        </div>
        {isComplete && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 rounded-lg">
            <Check className="w-3 h-3" /> Profil complet
          </span>
        )}
        {!isComplete && (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 border border-amber-500/20 bg-amber-500/8 px-3 py-1.5 rounded-lg">
            <AlertCircle className="w-3 h-3" /> Incomplet
          </span>
        )}
      </div>

      {/* Form */}
      <div className="rounded-xl bg-[#111] border border-[#1c1c1c] p-6 space-y-6">
        {/* Company name */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" /> Raison sociale
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={e => set('companyName')(e.target.value)}
            placeholder="Nom officiel de votre entreprise"
            className="w-full bg-[#161616] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
          />
        </div>

        {/* Business type */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" /> Forme juridique
          </label>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_TYPES.map(t => (
              <button
                key={t}
                onClick={() => set('businessType')(t)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                  form.businessType === t
                    ? 'bg-[#3B968F]/10 border-[#3B968F]/30 text-[#3B968F]'
                    : 'bg-[#161616] border-[#222] text-gray-500 hover:border-[#2a2a2a] hover:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider block">
            Secteur d'activité
          </label>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map(s => (
              <button
                key={s}
                onClick={() => set('sector')(s)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                  form.sector === s
                    ? 'bg-[#3B968F]/10 border-[#3B968F]/30 text-[#3B968F]'
                    : 'bg-[#161616] border-[#222] text-gray-500 hover:border-[#2a2a2a] hover:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" /> Pays de résidence
          </label>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <button
                key={c}
                onClick={() => set('country')(c)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                  form.country === c
                    ? 'bg-[#3B968F]/10 border-[#3B968F]/30 text-[#3B968F]'
                    : 'bg-[#161616] border-[#222] text-gray-500 hover:border-[#2a2a2a] hover:text-gray-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" /> Téléphone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone')(e.target.value)}
              placeholder="+33 6 00 00 00 00"
              className="w-full bg-[#161616] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Email professionnel
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email')(e.target.value)}
              placeholder="contact@entreprise.com"
              className="w-full bg-[#161616] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#3B968F]/50"
            />
          </div>
        </div>

        {/* Note KYC */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-[#3B968F]/5 border border-[#3B968F]/15">
          <AlertCircle className="w-4 h-4 text-[#3B968F]/60 flex-shrink-0 mt-0.5" />
          <p className="text-gray-500 text-xs leading-relaxed">
            La vérification KYC entreprise sera demandée pour les volumes supérieurs à 10 000 USDT/mois.
            Notre équipe vous contactera pour vous guider dans les démarches.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className={`w-full h-11 text-sm transition-all ${
            saved
              ? 'bg-emerald-600 hover:bg-emerald-600 text-white gap-2'
              : 'bg-[#3B968F] hover:bg-[#3B968F]/90 text-white'
          }`}
        >
          {saved ? (
            <><Check className="w-4 h-4" /> Profil enregistré</>
          ) : (
            'Enregistrer le profil'
          )}
        </Button>
      </div>
    </div>
  );
}
