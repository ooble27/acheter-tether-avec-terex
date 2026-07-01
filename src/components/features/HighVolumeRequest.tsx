import { useState } from 'react';
import { ArrowLeft, Handshake, Mail, MessageCircle, Clock, Star, ShieldCheck, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface HighVolumeRequestProps {
  onBack: () => void;
  requestedAmount: string;
  currency?: string;
}

const BG = '#1a1a1a';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const MIN_AMOUNT = 2000001;

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
  borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '15px',
  outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '7px',
};
const boxStyle: React.CSSProperties = {
  background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '20px',
};

export function HighVolumeRequest({ onBack, requestedAmount }: HighVolumeRequestProps) {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    amount: requestedAmount, purpose: '', additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { sendAdminNotification } = useAdminNotifications();
  const { user } = useAuth();

  const set = (patch: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...patch }));
  const canSubmit = formData.firstName && formData.lastName && formData.email && formData.phone && formData.amount && formData.purpose;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendAdminNotification('high_volume_request', {
        userId: user?.id,
        clientInfo: { ...formData, currency: 'CFA' },
        requestType: 'high_volume_purchase',
        timestamp: new Date().toISOString(),
      });
      toast({ title: 'Demande envoyée !', description: 'Notre équipe analysera votre demande et vous contactera par appel ou email.' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', amount: '', purpose: '', additionalInfo: '' });
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible d'envoyer votre demande. Veuillez réessayer.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: '110px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: 'calc(env(safe-area-inset-top, 0px) + 14px) 0 18px' }}>
          <button onClick={onBack}
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={17} color="#fff" />
          </button>
          <div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>OTC · Gros volumes</h1>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0' }}>Au-delà de 2 000 000 CFA, accompagnement personnalisé</p>
          </div>
        </div>

        {/* Hero */}
        <div style={{ ...boxStyle, display: 'flex', alignItems: 'center', gap: '16px', padding: '22px', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Handshake size={24} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: '16px', fontWeight: 600, margin: '0 0 3px' }}>Service OTC dédié</p>
            <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Taux préférentiels et support VIP pour vos transactions de gros volume.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Boxes réparties sur la largeur (mobile = 1 colonne, desktop = 2 colonnes) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

            {/* Informations personnelles */}
            <div style={boxStyle}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Informations personnelles</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', gap: '14px' }}>
                <div style={{ minWidth: 0 }}><label style={labelStyle}>Prénom *</label>
                  <input value={formData.firstName} onChange={e => set({ firstName: e.target.value })} placeholder="Votre prénom" style={inputStyle} required /></div>
                <div style={{ minWidth: 0 }}><label style={labelStyle}>Nom *</label>
                  <input value={formData.lastName} onChange={e => set({ lastName: e.target.value })} placeholder="Votre nom" style={inputStyle} required /></div>
              </div>
              <div style={{ marginTop: '14px' }}><label style={labelStyle}>Email *</label>
                <input type="email" value={formData.email} onChange={e => set({ email: e.target.value })} placeholder="votre@email.com" style={inputStyle} required /></div>
              <div style={{ marginTop: '14px' }}><label style={labelStyle}>Téléphone *</label>
                <input type="tel" value={formData.phone} onChange={e => set({ phone: e.target.value })} placeholder="+221 XX XXX XX XX" style={inputStyle} required /></div>
            </div>

            {/* Détails de la demande */}
            <div style={boxStyle}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Détails de votre demande</p>
              <div><label style={labelStyle}>Montant souhaité (CFA) *</label>
                <input type="number" value={formData.amount} onChange={e => set({ amount: e.target.value })} placeholder="3 000 000" min={MIN_AMOUNT} style={inputStyle} required />
                <p style={{ color: '#4b5563', fontSize: '11px', margin: '6px 0 0' }}>Minimum : {MIN_AMOUNT.toLocaleString('fr-FR')} CFA</p>
              </div>
              <div style={{ marginTop: '14px' }}><label style={labelStyle}>Objectif de la transaction *</label>
                <input value={formData.purpose} onChange={e => set({ purpose: e.target.value })} placeholder="Ex : Investissement, commerce international…" style={inputStyle} required /></div>
              <div style={{ marginTop: '14px' }}><label style={labelStyle}>Informations complémentaires</label>
                <textarea value={formData.additionalInfo} onChange={e => set({ additionalInfo: e.target.value })} placeholder="Décrivez votre projet ou ajoutez des détails…" style={{ ...inputStyle, minHeight: '92px', resize: 'vertical' }} /></div>
            </div>

            {/* Ce qui va se passer */}
            <div style={{ ...boxStyle, background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 14px' }}>Ce qui va se passer ensuite</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { Icon: Clock, text: 'Notre équipe analyse votre demande sous 24h' },
                  { Icon: Phone, text: 'Vous recevez un appel ou un email pour les conditions' },
                  { Icon: Star, text: 'Taux préférentiels et support VIP gros volumes' },
                  { Icon: ShieldCheck, text: 'Processus sécurisé avec vérifications renforcées' },
                ].map(({ Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="rgba(255,255,255,0.7)" />
                    </div>
                    <span style={{ color: '#d1d5db', fontSize: '13px' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact direct */}
            <div style={boxStyle}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 14px' }}>Besoin d'aide immédiate ?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="mailto:terangaexchange@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', minWidth: 0 }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={16} color="rgba(255,255,255,0.7)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: '#6b7280', fontSize: '11px', margin: '0 0 1px' }}>Email</p>
                    <p style={{ color: '#fff', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>terangaexchange@gmail.com</p>
                  </div>
                </a>
                <a href="https://wa.me/+14182619091" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', minWidth: 0 }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={16} color="rgba(255,255,255,0.7)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: '#6b7280', fontSize: '11px', margin: '0 0 1px' }}>WhatsApp</p>
                    <p style={{ color: '#fff', fontSize: '13px', margin: 0 }}>+1 418-261-9091</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bouton — petit, aligné à droite, pas pleine largeur */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
            <button type="submit" disabled={loading || !canSubmit}
              style={{
                padding: '12px 28px', borderRadius: '12px', border: 'none',
                background: (loading || !canSubmit) ? 'rgba(255,255,255,0.08)' : '#ffffff',
                color: (loading || !canSubmit) ? '#6b7280' : '#141414',
                fontSize: '14px', fontWeight: 700, cursor: (loading || !canSubmit) ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
