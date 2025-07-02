import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { CurrencyConverter } from './CurrencyConverter';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Smartphone, CreditCard, Banknote, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PublicHomeProps {
  onGetStarted: () => void;
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function PublicHome({ onGetStarted, user, onShowDashboard }: PublicHomeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleBlockchainInfo = () => {
    navigate('/blockchain');
  };

  const handleMarketplace = () => {
    navigate('/marketplace');
  };

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
      // Recharger la page pour réinitialiser l'état
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      <PWAInstallPrompt />
      
      {/* Header avec menu utilisateur si connecté */}
      {user && (
        <header className="bg-terex-darker border-b border-terex-accent/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-white">
                  <span className="text-terex-accent">Terex</span> Exchange
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleMarketplace}
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Boutique
                </Button>
                <Button
                  onClick={onShowDashboard}
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <div className="flex items-center space-x-2 text-gray-300">
                  <span className="text-sm">{user.name}</span>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <HeroSection />
      
      {/* Section Marketplace Crypto */}
      <section className="py-16 sm:py-20 bg-terex-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Boutique <span className="text-terex-accent">Crypto</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Découvrez notre sélection de wallets hardware, accessoires crypto et formations pour sécuriser vos investissements
            </p>
          </div>
          
          {/* Image du Trezor Safe 5 en PNG pur */}
          <div className="flex justify-center mb-12">
            <img 
              src="/lovable-uploads/631f288e-7499-4396-b3dc-936d11ae8c00.png" 
              alt="Trezor Safe 5 - Wallet Hardware Sécurisé"
              className="w-auto h-64 object-contain"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-terex-dark border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-white font-semibold mb-2">Wallets Hardware</h3>
                <p className="text-gray-400 text-sm">Trezor Safe 5, Ledger et autres portefeuilles sécurisés</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-dark border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-white font-semibold mb-2">Formations</h3>
                <p className="text-gray-400 text-sm">Guides complets pour maîtriser la crypto</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-dark border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-white font-semibold mb-2">Accessoires</h3>
                <p className="text-gray-400 text-sm">Cartes crypto et gadgets essentiels</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleMarketplace}
              size="lg"
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
            >
              <span>Découvrir la boutique</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Section Convertisseur */}
      <section className="py-16 sm:py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Découvrez nos <span className="text-terex-accent">taux en temps réel</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Utilisez notre convertisseur pour connaître instantanément nos taux d'achat et de vente USDT
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <CurrencyConverter />
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Comment ça <span className="text-terex-accent relative">
                marche
              </span> ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Trois étapes simples pour commencer vos échanges et transferts vers l'Afrique
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-terex-accent">1</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Inscription gratuite</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Créez votre compte en moins de 2 minutes. Processus de vérification KYC simple et rapide.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">100% gratuit</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-terex-accent">2</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Choisissez votre service</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Achat/vente USDT ou transfert vers l'Afrique. Interface intuitive pour tous vos besoins.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Taux en temps réel</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-terex-accent">3</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Transaction sécurisée</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Confirmez et finalisez votre transaction. Suivi en temps réel jusqu'à la réception.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">3-5 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={handleBlockchainInfo}
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-6 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-64 sm:w-auto mx-auto h-12 sm:h-auto"
            >
              En savoir plus sur la blockchain
            </Button>
          </div>
        </div>
      </section>

      <StatsSection />
      
      {/* Section Méthodes de paiement */}
      <section className="py-16 sm:py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Méthodes de <span className="text-terex-accent">paiement</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Plusieurs options sécurisées pour vos transactions
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6">
                <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-terex-accent mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Virement bancaire</h3>
                <p className="text-gray-400 text-xs">Virements SEPA et vers l'Afrique</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6">
                <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-terex-accent mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Mobile Money</h3>
                <p className="text-gray-400 text-xs">Orange Money, Wave, Free Money</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <Banknote className="w-8 h-8 sm:w-10 sm:h-10 text-terex-accent mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Espèces</h3>
                <p className="text-gray-400 text-xs">Points de retrait partenaires</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      
      {/* Section CTA finale */}
      <section className="py-16 sm:py-20 bg-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {user ? (
              <>Continuez votre expérience avec <span className="text-terex-accent">Terex</span></>
            ) : (
              <>Prêt à commencer avec <span className="text-terex-accent">Terex</span> ?</>
            )}
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            {user ? (
              "Explorez nos services d'échange USDT et de transferts vers l'Afrique, ou découvrez notre boutique crypto."
            ) : (
              "Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges USDT et transferts vers l'Afrique."
            )}
          </p>
          {!user && (
            <>
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full max-w-80 sm:max-w-none sm:w-auto mx-auto"
              >
                <span className="truncate">Créer mon compte gratuitement</span>
                <ArrowRight className="ml-2 w-4 h-4 flex-shrink-0" />
              </Button>
              <p className="text-gray-400 text-sm mt-4">
                Inscription gratuite • Vérification en 24h • Support 24/7
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
