import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const sections = [
  { title: "1. Acceptation", content: "En utilisant Terex, vous acceptez ces conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser nos services." },
  { title: "2. Description du Service", content: "Terex est une plateforme d'échange crypto-fiat permettant de :\n\n• Acheter et vendre des USDT\n• Effectuer des transferts vers l'Afrique\n• Accéder à des services de change\n• Utiliser des outils de trading" },
  { title: "3. Éligibilité", content: "Vous devez :\n\n• Être âgé d'au moins 18 ans\n• Avoir la capacité juridique de contracter\n• Ne pas résider dans un pays où nos services sont interdits\n• Fournir des informations exactes et à jour" },
  { title: "4. Vérification KYC", content: "Conformément aux réglementations, une vérification d'identité est requise. Elle inclut la fourniture de documents d'identité valides et peut prendre jusqu'à 24 heures." },
  { title: "5. Frais et Commissions", content: "Nos frais sont transparents :\n\n• Échange USDT : 0.5% par transaction\n• Transferts internationaux : 2-3% selon la destination\n• Frais de réseau blockchain variables" },
  { title: "6. Sécurité", content: "Nous mettons en œuvre des mesures de sécurité robustes. Vous êtes responsable de la sécurité de votre compte, mot de passe et authentification 2FA." },
  { title: "7. Interdictions", content: "Il est interdit d'utiliser nos services pour :\n\n• Le blanchiment d'argent ou financement du terrorisme\n• Toute activité illégale ou frauduleuse\n• La manipulation des marchés\n• L'accès non autorisé à nos systèmes" },
  { title: "8. Résiliation", content: "Nous pouvons suspendre ou fermer votre compte en cas de violation, activité suspecte ou conformité réglementaire." },
  { title: "9. Limitation de Responsabilité", content: "Terex ne peut être tenu responsable des pertes indirectes ou dommages consécutifs. Notre responsabilité est limitée aux frais payés pour le service concerné." },
  { title: "10. Modifications", content: "Ces conditions peuvent être modifiées à tout moment. Les changements entrent en vigueur 30 jours après publication." },
  { title: "11. Droit Applicable", content: "Ces conditions sont régies par le droit sénégalais. Les litiges relèvent de la juridiction des tribunaux de Dakar." },
  { title: "12. Contact", content: "Email : terangaexchange@gmail.com\nWhatsApp : +1 (418) 261-9091\nAdresse : Plateau, Avenue Léopold Sédar Senghor, Dakar, Sénégal" },
];

const TermsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { toast({ title: "Déconnexion réussie", description: "À bientôt", className: "bg-green-600 text-white border-green-600" }); window.location.reload(); }
  };

  return (
    <div className="min-h-screen bg-terex-dark relative overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <HeaderSection user={user ? { email: user.email || '', name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur' } : null} onShowDashboard={() => navigate('/')} onLogout={handleLogout} />
      <div className="h-16 md:h-20" />

      <section className="pt-12 pb-6 md:pt-24 md:pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ CONDITIONS</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-3">Conditions d'Utilisation</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <span>Dernière mise à jour : janvier 2024</span>
            <span>Version 2.1</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4"><div className="border-t border-dashed border-white/10" /></div>

      <section className="py-8 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-foreground font-medium text-sm md:text-base mb-2">{s.title}</h2>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              {i < sections.length - 1 && <div className="border-t border-dashed border-white/[0.06] mt-6" />}
            </div>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default TermsPage;
