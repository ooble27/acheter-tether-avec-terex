
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FooterSection } from '@/components/marketing/sections/FooterSection';
import { HeaderSection } from '@/components/marketing/sections/HeaderSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TermsPage = () => {
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
              <FileText className="w-5 h-5 text-terex-accent mr-2" />
              <span className="text-terex-accent font-medium">Conditions d'Utilisation</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Conditions <span className="text-terex-accent">d'Utilisation</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Veuillez lire attentivement ces conditions avant d'utiliser nos services.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Dernière mise à jour: 15 janvier 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Version 2.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="py-24 bg-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Shield className="w-6 h-6 mr-3 text-terex-accent" />
                Conditions Générales d'Utilisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8 text-gray-300">
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">1. Acceptation des Conditions</h2>
                    <p className="leading-relaxed">
                      En accédant et en utilisant la plateforme Terex, vous acceptez d'être lié par ces conditions d'utilisation. 
                      Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">2. Description du Service</h2>
                    <p className="leading-relaxed mb-4">
                      Terex est une plateforme d'échange crypto-fiat qui permet aux utilisateurs de:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Acheter et vendre des USDT (Tether)</li>
                      <li>Effectuer des transferts d'argent vers l'Afrique</li>
                      <li>Accéder à des services de change de devises</li>
                      <li>Utiliser des outils de trading et d'analyse</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">3. Éligibilité</h2>
                    <p className="leading-relaxed">
                      Pour utiliser nos services, vous devez:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Être âgé d'au moins 18 ans</li>
                      <li>Avoir la capacité juridique de contracter</li>
                      <li>Ne pas être résident d'un pays où nos services sont interdits</li>
                      <li>Fournir des informations exactes et à jour</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">4. Vérification d'Identité (KYC)</h2>
                    <p className="leading-relaxed">
                      Conformément aux réglementations en vigueur, nous exigeons une vérification d'identité (KYC) pour tous les utilisateurs. 
                      Cette procédure inclut la fourniture de documents d'identité valides et peut prendre jusqu'à 24 heures.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">5. Frais et Commissions</h2>
                    <p className="leading-relaxed mb-4">
                      Nos frais sont transparents et affichés avant chaque transaction:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Échange USDT: 0.5% par transaction</li>
                      <li>Transferts internationaux: 2-3% selon la destination</li>
                      <li>Frais de réseau blockchain variables</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">6. Sécurité</h2>
                    <p className="leading-relaxed">
                      Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos fonds et vos données. 
                      Cependant, vous êtes responsable de la sécurité de votre compte, notamment de votre mot de passe 
                      et de l'authentification à deux facteurs.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">7. Interdictions</h2>
                    <p className="leading-relaxed mb-4">
                      Il est strictement interdit d'utiliser nos services pour:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Le blanchiment d'argent ou le financement du terrorisme</li>
                      <li>Toute activité illégale ou frauduleuse</li>
                      <li>La manipulation des marchés</li>
                      <li>L'accès non autorisé à nos systèmes</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">8. Résiliation</h2>
                    <p className="leading-relaxed">
                      Nous nous réservons le droit de suspendre ou de fermer votre compte en cas de violation de ces conditions, 
                      d'activité suspecte ou pour des raisons de conformité réglementaire.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">9. Limitation de Responsabilité</h2>
                    <p className="leading-relaxed">
                      Terex ne peut être tenu responsable des pertes indirectes, des dommages consécutifs ou de la perte de profits 
                      résultant de l'utilisation de nos services. Notre responsabilité est limitée au montant des frais payés 
                      pour le service concerné.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">10. Modifications</h2>
                    <p className="leading-relaxed">
                      Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront communiquées 
                      via notre plateforme et entreront en vigueur 30 jours après leur publication.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">11. Droit Applicable</h2>
                    <p className="leading-relaxed">
                      Ces conditions sont régies par le droit sénégalais. Tout litige sera soumis à la juridiction exclusive 
                      des tribunaux de Dakar, Sénégal.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4">12. Contact</h2>
                    <p className="leading-relaxed">
                      Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à:
                    </p>
                    <div className="mt-4 space-y-2">
                      <p>Email: terangaexchange@gmail.com</p>
                      <p>Téléphone: +1 4182619091</p>
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

export default TermsPage;
