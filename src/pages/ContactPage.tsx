import { Phone, Mail, Send, ShieldCheck, Clock, Users, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useContactMessages } from '@/hooks/useContactMessages';
import { useTerexRates } from '@/hooks/useTerexRates';

const BG = '#141414';
const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';
const MUTED = 'rgba(255,255,255,0.55)';
const MUTED2 = 'rgba(255,255,255,0.4)';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid rgba(255,255,255,0.08)`,
  borderRadius: 12,
  color: '#fff',
  fontSize: 14,
  padding: '0 14px',
  height: 46,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: 7,
};

const WhatsAppIcon = ({ size = 19 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = ({ size = 19 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const ContactPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { sendMessage, loading } = useContactMessages();
  const { terexRateCfa, loading: rateLoading } = useTerexRates(2);
  const rateDisplay = !rateLoading && terexRateCfa ? terexRateCfa.toLocaleString('fr-FR') : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: '',
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({ title: 'Déconnexion réussie', description: 'À bientôt' });
      window.location.reload();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs obligatoires', variant: 'destructive' });
      return;
    }
    const result = await sendMessage({
      subject: formData.subject,
      message: formData.message,
      user_email: formData.email,
      user_name: `${formData.firstName} ${formData.lastName}`,
      user_phone: formData.phone || undefined,
    });
    if (!result.error) {
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const channels = [
    { Icon: WhatsAppIcon, label: 'WhatsApp', value: '+1 (418) 261-9091', meta: '~2 min', online: true, href: 'https://wa.me/+14182619091', external: true },
    { Icon: () => <Phone size={18} strokeWidth={1.8} />, label: 'Téléphone', value: '+1 (418) 261-9091', meta: '9h–20h', online: true, href: 'tel:+14182619091', external: false },
    { Icon: () => <Mail size={18} strokeWidth={1.8} />, label: 'Email', value: 'terangaexchange@gmail.com', meta: '~2 h', online: true, href: 'mailto:terangaexchange@gmail.com', external: false },
    { Icon: TelegramIcon, label: 'Telegram', value: '@teraborange', meta: '~10 min', online: false, href: 'https://t.me/teraborange', external: true },
  ];

  const trust = [
    { Icon: Users, t: '+2 000 utilisateurs' },
    { Icon: ShieldCheck, t: 'KYC & conformité' },
    { Icon: Clock, t: 'Support 24/7' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @keyframes tx-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .tx-fade { animation: tx-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .tx-fade-2 { animation: tx-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .tx-tile { transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease; }
        .tx-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.16) !important; }
        .tx-input:focus { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.06) !important; }
        .tx-input::placeholder { color: rgba(255,255,255,0.3); }
        .tx-cta { transition: transform 0.15s ease; }
        .tx-cta:hover { transform: translateY(-1px); }
        @keyframes tx-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.85); } }
        .tx-live-dot { animation: tx-pulse 1.6s ease-in-out infinite; }
        @keyframes tx-ring { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(2.2); opacity: 0; } }
        .tx-ring { animation: tx-ring 2.6s ease-out infinite; }
        @keyframes tx-grow { from { width: 0; } }
        .tx-bar { animation: tx-grow 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        @media (max-width: 1100px) { .tx-vline { display: none !important; } }
        @media (max-width: 900px) { .tx-two { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) {
          .tx-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .tx-names { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="tx-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      <HeaderSection
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur',
        } : null}
        onShowDashboard={() => navigate('/')}
        onLogout={handleLogout}
      />

      <div style={{ height: 72 }} />

      {/* HERO */}
      <header className="tx-pad tx-fade" style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 32px 8px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 12px' }}>Contact</p>
        <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 14px' }}>
          Contactez notre équipe
        </h1>
        <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          Une question sur l'achat, la vente ou les transferts ? Nous vous aiderons à trouver la solution adaptée à vos besoins.
        </p>
      </header>

      {/* BODY */}
      <section className="tx-pad" style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 32px 88px', position: 'relative', zIndex: 1 }}>
        <div className="tx-two" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 28, alignItems: 'start' }}>

          {/* Left: Form card */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 'clamp(22px,3vw,34px)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Envoyez-nous un message</h2>
            <p style={{ fontSize: 13.5, color: MUTED, margin: '0 0 26px' }}>Nous répondons généralement sous quelques heures.</p>

            <form onSubmit={handleSubmit}>
              <div className="tx-names" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Prénom *</label>
                  <input className="tx-input" style={inputStyle} placeholder="Prénom" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input className="tx-input" style={inputStyle} placeholder="Nom" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} required />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email *</label>
                <input className="tx-input" type="email" style={inputStyle} placeholder="votre@email.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} required />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Téléphone</label>
                <input className="tx-input" style={inputStyle} placeholder="+1 (418) 261-9091" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Sujet *</label>
                <input className="tx-input" style={inputStyle} placeholder="Objet de votre message" value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} required />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Message *</label>
                <textarea className="tx-input" style={{ ...inputStyle, height: 'auto', minHeight: 130, padding: '12px 14px', resize: 'vertical', lineHeight: 1.55 }} placeholder="Décrivez votre demande..." value={formData.message} onChange={e => handleInputChange('message', e.target.value)} required />
              </div>

              <button type="submit" disabled={loading} className="tx-cta" style={{ width: '100%', background: '#fff', color: '#141414', border: 'none', borderRadius: 12, height: 50, fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Right: canaux de contact — simple & cohérent */}
          <div className="tx-fade-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '20px 22px 6px' }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED2, margin: '0 0 4px' }}>Nous joindre</p>
                <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>Une équipe disponible 24/7.</p>
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                {channels.map(({ Icon, label, value, href, external }) => (
                  <a key={label} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, borderRadius: 14, padding: '13px 12px', textDecoration: 'none', color: '#fff', transition: 'background 0.18s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.9)', flexShrink: 0 }}>
                      <Icon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                      <p style={{ fontSize: 12.5, color: MUTED, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                    </div>
                    <ArrowUpRight size={16} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Live rate card */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED2, margin: '0 0 8px' }}>Taux USDT / CFA · en direct</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, minHeight: 34 }}>
                    {rateDisplay ? (
                      <>
                        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>{rateDisplay}</span>
                        <span style={{ color: MUTED2, fontSize: 13, fontWeight: 600 }}>CFA</span>
                      </>
                    ) : (
                      <span style={{ display: 'inline-block', width: 110, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
                    )}
                  </div>
                </div>
                <span style={{ position: 'relative', width: 9, height: 9 }}>
                  <span className="tx-live-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 4px rgba(255,255,255,0.08)' }} />
                </span>
              </div>
            </div>

            {/* Trust */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px' }}>
              <p style={{ fontSize: 14.5, fontWeight: 600, margin: '0 0 4px' }}>La plateforme de confiance</p>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: '0 0 16px' }}>
                Pour acheter, vendre et transférer de l'USDT en Afrique.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {trust.map(({ Icon, t }) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ContactPage;
