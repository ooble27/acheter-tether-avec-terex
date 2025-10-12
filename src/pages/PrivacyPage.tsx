
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PrivacyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        className: "bg-green-600 text-white border-green-600",
      });
      window.location.reload();
    }
  };

  const handleShowDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      <HeaderSection 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        } : null}
        onShowDashboard={handleShowDashboard}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terex-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-8 border border-terex-accent/20">
              <Eye className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Politique de Confidentialité</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Politique de <span className="text-terex-accent">Confidentialité</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données personnelles.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Lock className="w-6 h-6 mr-3 text-terex-accent" />
                Protection de vos Données Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8 text-gray-300">
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">1. Collecte des Données</h2>
                    <p className="leading-relaxed mb-4">
                      Nous collectons les informations suivantes pour vous fournir nos services:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Informations d'identification:</strong> Nom, prénom, date de naissance, adresse</li>
                      <li><strong>Informations de contact:</strong> Email, numéro de téléphone</li>
                      <li><strong>Documents KYC:</strong> Pièce d'identité, justificatif de domicile</li>
                      <li><strong>Informations de transaction:</strong> Historique des échanges et transferts</li>
                      <li><strong>Données techniques:</strong> Adresse IP, type de navigateur, géolocalisation</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">2. Utilisation des Données</h2>
                    <p className="leading-relaxed mb-4">
                      Vos données personnelles sont utilisées pour:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Vérifier votre identité et respecter les obligations KYC/AML</li>
                      <li>Traiter vos transactions et transferts</li>
                      <li>Prévenir la fraude et assurer la sécurité</li>
                      <li>Vous contacter concernant votre compte</li>
                      <li>Améliorer nos services et l'expérience utilisateur</li>
                      <li>Respecter nos obligations légales et réglementaires</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">3. Partage des Données</h2>
                    <p className="leading-relaxed mb-4">
                      Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement avec:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Partenaires de confiance:</strong> Processeurs de paiement, fournisseurs de services KYC</li>
                      <li><strong>Autorités compétentes:</strong> En cas d'obligation légale ou d'enquête</li>
                      <li><strong>Prestataires techniques:</strong> Hébergement sécurisé et maintenance</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">4. Sécurité des Données</h2>
                    <p className="leading-relaxed mb-4">
                      Nous mettons en place des mesures de sécurité strictes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Chiffrement AES-256 pour toutes les données sensibles</li>
                      <li>Authentification à deux facteurs (2FA) obligatoire</li>
                      <li>Surveillance 24/7 des systèmes</li>
                      <li>Audits de sécurité réguliers</li>
                      <li>Accès limité aux données selon le principe du moindre privilège</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">5. Conservation des Données</h2>
                    <p className="leading-relaxed">
                      Nous conservons vos données personnelles pendant la durée nécessaire pour:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Fournir nos services: Durée de la relation contractuelle</li>
                      <li>Obligations légales: 5 ans minimum après la fin de la relation</li>
                      <li>Prévention de la fraude: Jusqu'à 10 ans selon les réglementations</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">6. Vos Droits</h2>
                    <p className="leading-relaxed mb-4">
                      Conformément au RGPD et aux lois applicables, vous disposez des droits suivants:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Droit d'accès:</strong> Connaître les données que nous détenons sur vous</li>
                      <li><strong>Droit de rectification:</strong> Corriger les données inexactes</li>
                      <li><strong>Droit d'effacement:</strong> Demander la suppression de vos données</li>
                      <li><strong>Droit de portabilité:</strong> Récupérer vos données dans un format structuré</li>
                      <li><strong>Droit d'opposition:</strong> Vous opposer au traitement à des fins de marketing</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">7. Cookies et Technologies Similaires</h2>
                    <p className="leading-relaxed">
                      Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme. 
                      Ces cookies nous aident à comprendre comment vous utilisez nos services et à personnaliser 
                      votre expérience. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">8. Transferts Internationaux</h2>
                    <p className="leading-relaxed">
                      Vos données peuvent être transférées et traitées dans des pays en dehors de votre pays de résidence. 
                      Nous nous assurons que ces transferts respectent les standards de protection des données applicables 
                      et que des garanties appropriées sont en place.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">9. Modifications de la Politique</h2>
                    <p className="leading-relaxed">
                      Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Les modifications 
                      importantes vous seront communiquées par email ou via notre plateforme. Nous vous encourageons 
                      à consulter régulièrement cette page.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">10. Contact</h2>
                    <p className="leading-relaxed mb-4">
                      Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits:
                    </p>
                    <div className="space-y-2">
                      <p><strong>Délégué à la Protection des Données:</strong></p>
                      <p>Email: contact@terex.app</p>
                      <p>Téléphone: +221 77 397 27 49</p>
                      <p>Adresse: Plateau, Avenue Léopold Sédar Senghor, Dakar, Sénégal</p>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default PrivacyPage;
