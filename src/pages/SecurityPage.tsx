import { Lock, Shield, Eye, Server, FileCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SecurityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" }); window.location.reload(); }
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
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div className="h-16 md:h-20" />

      {/* Hero */}
      <section className="pt-12 pb-6 md:pt-24 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ SÉCURITÉ</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-3">
            Sécurité & Conformité
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Votre sécurité est notre priorité absolue. Découvrez nos mesures de protection.
          </p>
          <p className="text-muted-foreground text-xs mt-4">Dernière mise à jour : mars 2025</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Key metrics */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            {[{ v: "256-bit", l: "Chiffrement" }, { v: "95%", l: "Fonds hors ligne" }, { v: "24/7", l: "Surveillance" }].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                <p className="text-terex-accent text-lg md:text-xl font-semibold">{s.v}</p>
                <p className="text-muted-foreground text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Security features */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Mesures de sécurité</p>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-4 md:p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <Icon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-foreground text-sm font-medium mb-0.5">{f.title}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Certifications */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Certifications</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ name: "ISO 27001", desc: "Sécurité de l'information" }, { name: "SOC 2", desc: "Contrôles de sécurité" }, { name: "PCI DSS", desc: "Données de paiement" }].map((c, i) => (
              <div key={i} className="p-4 md:p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                <p className="text-foreground font-medium text-sm mb-1">{c.name}</p>
                <p className="text-muted-foreground text-[11px]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      {/* Tips */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.15em] mb-6">Conseils de sécurité</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-foreground text-sm font-medium mb-3">Pour votre compte</p>
              <div className="space-y-2">
                {tips.account.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground text-xs">
                    <div className="w-1 h-1 bg-terex-accent rounded-full flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-foreground text-sm font-medium mb-3">Vigilance anti-fraude</p>
              <div className="space-y-2">
                {tips.fraud.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground text-xs">
                    <div className="w-1 h-1 bg-terex-accent rounded-full flex-shrink-0" />
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
