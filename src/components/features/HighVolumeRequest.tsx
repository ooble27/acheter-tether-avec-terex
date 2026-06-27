import { useState } from 'react';
import { ArrowLeft, Handshake, Mail, MessageCircle, Clock, Star, ShieldCheck, Phone, CheckCircle2, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface HighVolumeRequestProps {
  onBack: () => void;
  requestedAmount: string;
  currency?: string;
}

type Step = 'amount' | 'details' | 'contact' | 'review' | 'done';

const BG = '#141414';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
  borderRadius: '12px', padding: '13px 14px', color: '#fff', fontSize: '15px',
  outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px',
};
const ctaStyle = (enabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
  background: enabled ? '#ffffff' : 'rgba(255,255,255,0.08)',
  color: enabled ? '#141414' : '#6b7280',
  fontSize: '15px', fontWeight: 700, cursor: enabled ? 'pointer' : 'not-allowed',
});

// Défini au niveau module pour éviter le remontage des inputs (perte de focus).
function Shell({ title, subtitle, onBackStep, children, footer }: {
  title: string; subtitle?: string; onBackStep: () => void;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '620px', width: '100%', margin: '0 auto', padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: 'calc(env(safe-area-inset-top, 0px) + 14px) 0 18px' }}>
          <button onClick={onBackStep}
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={17} color="#fff" />
          </button>
          <div>
            <h1 style={{ color: '#fff', fontSize: '21px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>{title}</h1>
            {subtitle && <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
        {footer && <div style={{ marginTop: '20px' }}>{footer}</div>}
      </div>
    </div>
  );
}

function Progress({ idx }: { idx: number }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ height: '3px', flex: 1, borderRadius: '999px', background: i <= idx ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.10)' }} />
      ))}
    </div>
  );
}

export function HighVolumeRequest({ onBack, requestedAmount, currency = 'CFA' }: HighVolumeRequestProps) {
  const [step, setStep] = useState<Step>('amount');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    amount: requestedAmount, currency, purpose: '', additionalInfo: '',
  });
  const { toast } = useToast();
  const { sendAdminNotification } = useAdminNotifications();
  const { user } = useAuth();

  const set = (patch: Partial<typeof data>) => setData(prev => ({ ...prev, ...patch }));
  const getMinAmount = (curr: string) => (curr === 'CAD' ? 5001 : 2000001);

  const amountValid = !!data.amount && parseFloat(data.amount) >= getMinAmount(data.currency);
  const detailsValid = data.purpose.trim().length > 0;
  const contactValid = data.firstName && data.lastName && data.email && data.phone;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await sendAdminNotification('high_volume_request', {
        userId: user?.id, clientInfo: data, requestType: 'high_volume_purchase',
        timestamp: new Date().toISOString(),
      });
      setStep('done');
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible d'envoyer votre demande. Veuillez réessayer.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1 : Montant ──────────────────────────────────────────────────────
  if (step === 'amount') {
    return (
      <Shell title="OTC · Gros volumes" subtitle="Étape 1 sur 4 · Montant" onBackStep={onBack}
        footer={<button disabled={!amountValid} onClick={() => setStep('details')} style={ctaStyle(amountValid)}>Continuer</button>}>
        <Progress idx={0} />
        {/* Hero */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Handshake size={22} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
          </div>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Taux préférentiels et support VIP pour vos transactions de gros volume.</p>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
          <label style={labelStyle}>Devise</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            {[{ v: 'CFA', l: 'Franc CFA' }, { v: 'CAD', l: 'Dollar canadien' }].map(({ v, l }) => {
              const sel = data.currency === v;
              return (
                <button key={v} onClick={() => set({ currency: v })}
                  style={{ flex: 1, padding: '13px', borderRadius: '12px', cursor: 'pointer',
                    border: `1px solid ${sel ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.14)'}`,
                    background: sel ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: '14px', fontWeight: 600, outline: 'none' }}>
                  {v}<span style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: 500, marginTop: '2px' }}>{l}</span>
                </button>
              );
            })}
          </div>
          <label style={labelStyle}>Montant souhaité</label>
          <input type="number" value={data.amount} onChange={e => set({ amount: e.target.value })}
            placeholder={data.currency === 'CAD' ? '6 000' : '3 000 000'} min={getMinAmount(data.currency)} style={inputStyle} />
          <p style={{ color: amountValid || !data.amount ? '#4b5563' : '#f87171', fontSize: '11px', margin: '7px 0 0' }}>
            Minimum : {getMinAmount(data.currency).toLocaleString('fr-FR')} {data.currency}
          </p>
        </div>
      </Shell>
    );
  }

  // ── Step 2 : Détails ──────────────────────────────────────────────────────
  if (step === 'details') {
    return (
      <Shell title="Détails de la demande" subtitle="Étape 2 sur 4 · Votre projet" onBackStep={() => setStep('amount')}
        footer={<button disabled={!detailsValid} onClick={() => setStep('contact')} style={ctaStyle(detailsValid)}>Continuer</button>}>
        <Progress idx={1} />
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
          <label style={labelStyle}>Objectif de la transaction</label>
          <input value={data.purpose} onChange={e => set({ purpose: e.target.value })}
            placeholder="Ex : Investissement, commerce international…" style={inputStyle} />
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Informations complémentaires <span style={{ textTransform: 'none', color: '#4b5563' }}>(optionnel)</span></label>
            <textarea value={data.additionalInfo} onChange={e => set({ additionalInfo: e.target.value })}
              placeholder="Décrivez votre projet ou ajoutez des détails…" style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }} />
          </div>
        </div>
      </Shell>
    );
  }

  // ── Step 3 : Coordonnées ──────────────────────────────────────────────────
  if (step === 'contact') {
    return (
      <Shell title="Vos coordonnées" subtitle="Étape 3 sur 4 · Contact" onBackStep={() => setStep('details')}
        footer={<button disabled={!contactValid} onClick={() => setStep('review')} style={ctaStyle(!!contactValid)}>Continuer</button>}>
        <Progress idx={2} />
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', gap: '14px' }}>
            <div style={{ minWidth: 0 }}><label style={labelStyle}>Prénom</label>
              <input value={data.firstName} onChange={e => set({ firstName: e.target.value })} placeholder="Votre prénom" style={inputStyle} /></div>
            <div style={{ minWidth: 0 }}><label style={labelStyle}>Nom</label>
              <input value={data.lastName} onChange={e => set({ lastName: e.target.value })} placeholder="Votre nom" style={inputStyle} /></div>
          </div>
          <div style={{ marginTop: '14px' }}><label style={labelStyle}>Email</label>
            <input type="email" value={data.email} onChange={e => set({ email: e.target.value })} placeholder="votre@email.com" style={inputStyle} /></div>
          <div style={{ marginTop: '14px' }}><label style={labelStyle}>Téléphone</label>
            <input type="tel" value={data.phone} onChange={e => set({ phone: e.target.value })} placeholder="+221 XX XXX XX XX" style={inputStyle} /></div>
        </div>
      </Shell>
    );
  }

  // ── Step 4 : Récapitulatif ────────────────────────────────────────────────
  if (step === 'review') {
    const rows: { label: string; value: string; goto: Step }[] = [
      { label: 'Montant', value: `${parseFloat(data.amount || '0').toLocaleString('fr-FR')} ${data.currency}`, goto: 'amount' },
      { label: 'Objectif', value: data.purpose, goto: 'details' },
      ...(data.additionalInfo ? [{ label: 'Détails', value: data.additionalInfo, goto: 'details' as Step }] : []),
      { label: 'Nom complet', value: `${data.firstName} ${data.lastName}`, goto: 'contact' },
      { label: 'Email', value: data.email, goto: 'contact' },
      { label: 'Téléphone', value: data.phone, goto: 'contact' },
    ];
    return (
      <Shell title="Récapitulatif" subtitle="Étape 4 sur 4 · Vérifiez votre demande" onBackStep={() => setStep('contact')}
        footer={<button disabled={loading} onClick={handleSubmit} style={ctaStyle(!loading)}>{loading ? 'Envoi en cours…' : 'Envoyer ma demande'}</button>}>
        <Progress idx={3} />
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ padding: '14px 18px', borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{r.label}</p>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: 0, wordBreak: 'break-word' }}>{r.value || '—'}</p>
              </div>
              <button onClick={() => setStep(r.goto)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', flexShrink: 0, padding: '2px' }}>
                <Pencil size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Ce qui va se passer */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '18px' }}>
          <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, margin: '0 0 12px' }}>Ce qui va se passer ensuite</p>
          {[
            { Icon: Clock, text: 'Analyse de votre demande sous 24h' },
            { Icon: Phone, text: 'Appel ou email pour discuter des conditions' },
            { Icon: Star, text: 'Taux préférentiels et support VIP' },
            { Icon: ShieldCheck, text: 'Processus sécurisé et vérifié' },
          ].map(({ Icon, text }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < 3 ? '10px' : 0 }}>
              <Icon size={15} color="rgba(255,255,255,0.6)" />
              <span style={{ color: '#d1d5db', fontSize: '12.5px' }}>{text}</span>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={34} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>Demande envoyée !</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 28px', lineHeight: 1.6 }}>
          Notre équipe analysera votre demande et vous contactera par appel ou email sous 24h pour discuter des conditions.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={onBack} style={ctaStyle(true)}>Retour à l'accueil</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <a href="mailto:terangaexchange@gmail.com" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', background: '#2d2d2d', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
              <Mail size={15} /> Email
            </a>
            <a href="https://wa.me/+14182619091" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', background: '#2d2d2d', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
