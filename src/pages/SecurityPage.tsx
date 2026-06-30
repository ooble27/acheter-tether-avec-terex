import { Lock, Shield, Eye, Server, FileCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BORDER = 'rgba(255,255,255,0.07)';

const SecurityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: "Déconnexion réussie", description: "À bientôt" }); window.location.reload(); }
  };

  const features = [
    { icon: Lock, title: "Chiffrement AES-256", desc: "Toutes vos données sont chiffrées avec le standard bancaire." },
    { icon: Shield, title: "Authentification 2FA", desc: "Protection supplémentaire avec codes SMS ou authenticator." },
    { icon: Server, title: "Cold Wallets", desc: "95% des fonds stockés hors ligne en multi-signatures." },
    { icon: Eye, title: "Surveillance 24/7", desc: "Détection automatique des activités suspectes." },
    { icon: FileCheck, title: "Conformité KYC/AML", desc: "Respect des réglementations financières internationales." },
    { icon: AlertTriangle, title: "Audits réguliers", desc: "Par des sociétés de cybersécurité reconnues." },
  ];

  const tips = {
    account: ["Mot de passe unique et complexe", "Authentification à deux facteurs", "Ne partagez jamais vos identifiants", "Déconnectez-vous après chaque session"],
    fraud: ["Vérifiez toujours l'URL officielle", "Méfiez-vous des emails de phishing", "Ne donnez jamais vos codes par téléphone", "Contactez-nous en cas de doute"]
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#141414', color: '#fff' }}>
      <style>{`
        @keyframes sec-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .sec-fade { animation: sec-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        @media (max-width: 1100px) { .sec-vline { display: none !important; } }
      `}</style>

      {/* Vertical guide lines */}
      <div className="sec-vline" style={{ position: 'fixed', top: 0, bottom: 0, left: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="sec-vline" style={{ position: 'fixed', top: 0, bottom: 0, right: 'calc(50% - 560px)', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0 }} />

      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div className="h-16 md:h-20" />

      {/* Hero */}
      <section className="relative z-[1] pt-12 pb-8 md:pt-24 md:pb-12">
        <div className="sec-fade max-w-[760px] mx-auto px-5 sm:px-6">
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', margin: '0 0 14px' }}>Sécurité</p>
          <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, color: '#fff', margin: '0 0 16px' }}>
            Sécurité &amp; Conformité
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
            Votre sécurité est notre priorité absolue. Découvrez nos mesures de protection.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '18px 0 0' }}>Dernière mise à jour : mars 2025</p>
        </div>
      </section>

      <div className="relative z-[1] max-w-[760px] mx-auto px-5 sm:px-6"><div style={{ borderTop: `1px solid ${BORDER}` }} /></div>

      {/* Key metrics */}
      <section className="relative z-[1] py-10 md:py-14">
        <div className="max-w-[760px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            {[{ v: "256-bit", l: "Chiffrement" }, { v: "95%", l: "Fonds hors ligne" }, { v: "24/7", l: "Surveillance" }].map((s, i) => (
              <div key={i} className="text-center" style={{ background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 12px' }}>
                <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{s.v}</p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, margin: '4px 0 0' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-[1] max-w-[760px] mx-auto px-5 sm:px-6"><div style={{ borderTop: `1px solid ${BORDER}` }} /></div>

      {/* Security features */}
      <section className="relative z-[1] py-12 md:py-16">
        <div className="max-w-[760px] mx-auto px-5 sm:px-6">
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', margin: '0 0 22px' }}>Mesures de sécurité</p>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-4" style={{ background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 20px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.85)' }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>{f.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="relative z-[1] max-w-[760px] mx-auto px-5 sm:px-6"><div style={{ borderTop: `1px solid ${BORDER}` }} /></div>

      {/* Certifications */}
      <section className="relative z-[1] py-12 md:py-16">
        <div className="max-w-[760px] mx-auto px-5 sm:px-6">
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', margin: '0 0 22px' }}>Certifications</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ name: "ISO 27001", desc: "Sécurité de l'information" }, { name: "SOC 2", desc: "Contrôles de sécurité" }, { name: "PCI DSS", desc: "Données de paiement" }].map((c, i) => (
              <div key={i} className="text-center" style={{ background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 14px' }}>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>{c.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11.5, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-[1] max-w-[760px] mx-auto px-5 sm:px-6"><div style={{ borderTop: `1px solid ${BORDER}` }} /></div>

      {/* Tips */}
      <section className="relative z-[1] py-12 md:py-16">
        <div className="max-w-[760px] mx-auto px-5 sm:px-6">
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', margin: '0 0 22px' }}>Conseils de sécurité</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div style={{ background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px' }}>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 14px' }}>Pour votre compte</p>
              <div className="space-y-2.5">
                {tips.account.map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#1e1e1e', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px' }}>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 14px' }}>Vigilance anti-fraude</p>
              <div className="space-y-2.5">
                {tips.fraud.map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                    {t}
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

export default SecurityPage;
