import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const sections = [
  { title: "1. Collecte des Données", content: "Nous collectons les informations suivantes :\n\n• Informations d'identification : Nom, prénom, date de naissance, adresse\n• Informations de contact : Email, numéro de téléphone\n• Documents KYC : Pièce d'identité, justificatif de domicile\n• Informations de transaction : Historique des échanges et transferts\n• Données techniques : Adresse IP, type de navigateur" },
  { title: "2. Utilisation des Données", content: "Vos données sont utilisées pour :\n\n• Vérifier votre identité (KYC/AML)\n• Traiter vos transactions et transferts\n• Prévenir la fraude et assurer la sécurité\n• Vous contacter concernant votre compte\n• Améliorer nos services\n• Respecter nos obligations légales" },
  { title: "3. Partage des Données", content: "Nous ne vendons jamais vos données. Nous les partageons uniquement avec :\n\n• Partenaires de confiance : Processeurs de paiement, fournisseurs KYC\n• Autorités compétentes : En cas d'obligation légale\n• Prestataires techniques : Hébergement sécurisé et maintenance" },
  { title: "4. Sécurité des Données", content: "Mesures de sécurité en place :\n\n• Chiffrement AES-256 pour toutes les données sensibles\n• Authentification à deux facteurs (2FA)\n• Surveillance 24/7 des systèmes\n• Audits de sécurité réguliers\n• Accès limité selon le principe du moindre privilège" },
  { title: "5. Conservation", content: "Durées de conservation :\n\n• Services actifs : Durée de la relation contractuelle\n• Obligations légales : 5 ans minimum après fin de relation\n• Prévention fraude : Jusqu'à 10 ans selon réglementations" },
  { title: "6. Vos Droits", content: "Conformément au RGPD :\n\n• Droit d'accès : Connaître les données détenues\n• Droit de rectification : Corriger les données inexactes\n• Droit d'effacement : Demander la suppression\n• Droit de portabilité : Récupérer vos données\n• Droit d'opposition : Refuser le traitement marketing" },
  { title: "7. Cookies", content: "Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences dans les paramètres de votre navigateur." },
  { title: "8. Transferts Internationaux", content: "Vos données peuvent être traitées hors de votre pays de résidence avec des garanties de protection appropriées." },
  { title: "9. Modifications", content: "Cette politique peut être mise à jour. Les modifications importantes vous seront communiquées par email." },
  { title: "10. Contact", content: "Email : terangaexchange@gmail.com\nWhatsApp : +1 (418) 261-9091\nAdresse : Plateau, Avenue Léopold Sédar Senghor, Dakar, Sénégal" },
];

const PrivacyPage = () => {
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
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">/ CONFIDENTIALITÉ</p>
          <h1 className="text-3xl md:text-5xl font-light text-foreground mb-3">Politique de Confidentialité</h1>
          <p className="text-muted-foreground text-sm">Dernière mise à jour : mars 2025</p>
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

export default PrivacyPage;
