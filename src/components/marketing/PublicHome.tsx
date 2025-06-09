
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Smartphone, CreditCard, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PublicHomeProps {
  onGetStarted: () => void;
}

export function PublicHome({ onGetStarted }: PublicHomeProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleBlockchainInfo = () => {
    navigate('/blockchain');
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      <HeroSection />
      
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
              Trois étapes simples pour commencer vos échanges et virements
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
                  Achat/vente USDT ou virement international. Interface intuitive pour tous vos besoins.
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
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base rounded-xl backdrop-blur-sm max-w-xs sm:max-w-none"
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
                <p className="text-gray-400 text-xs">Virements SEPA et internationaux</p>
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
            Prêt à commencer avec <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges USDT et virements internationaux.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-3 sm:px-8 py-2 sm:py-4 text-xs sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 max-w-xs sm:max-w-none mx-auto"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <p className="text-gray-400 text-sm mt-4">
            Inscription gratuite • Vérification en 24h • Support 24/7
          </p>
        </div>
      </section>
    </div>
  );
}
