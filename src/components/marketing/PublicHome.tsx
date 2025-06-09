
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

  return (
    <div className="min-h-screen bg-terex-dark">
      <HeroSection />
      
      {/* Section Comment ça marche avec effets blockchain */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker relative overflow-hidden">
        {/* Background tech pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(94,234,212,0.02)_50%,transparent_50%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(94,234,212,0.02)_50%,transparent_50%)] bg-[length:20px_20px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Comment ça <span className="text-terex-accent relative">
                marche
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-terex-accent rounded-full"></div>
              </span> ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Trois étapes simples pour commencer vos échanges et virements
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-gradient-to-br from-terex-dark/80 to-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                  <span className="text-2xl font-bold text-terex-accent">1</span>
                  <div className="absolute -inset-2 bg-terex-accent/10 rounded-2xl blur"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Inscription gratuite</h3>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">
                  Créez votre compte en moins de 2 minutes. Processus de vérification KYC simple et rapide.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm">100% gratuit</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-terex-dark/80 to-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                  <span className="text-2xl font-bold text-terex-accent">2</span>
                  <div className="absolute -inset-2 bg-terex-accent/10 rounded-2xl blur"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Choisissez votre service</h3>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">
                  Achat/vente d'USDT ou virement international. Interface intuitive pour tous vos besoins.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm">Taux en temps réel</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-terex-dark/80 to-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                  <span className="text-2xl font-bold text-terex-accent">3</span>
                  <div className="absolute -inset-2 bg-terex-accent/10 rounded-2xl blur"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Transaction sécurisée</h3>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">
                  Confirmez et finalisez votre transaction. Suivi en temps réel jusqu'à la réception.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm">3-5 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <StatsSection />
      
      {/* Section Méthodes de paiement optimisée mobile */}
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
            <Card className="bg-gradient-to-br from-terex-darker/80 to-terex-dark/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-terex-accent mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">Virement bancaire</h3>
                <p className="text-gray-400 text-sm">Virements SEPA et internationaux</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-terex-darker/80 to-terex-dark/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-terex-accent mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">Mobile Money</h3>
                <p className="text-gray-400 text-sm">Orange Money, Wave, Free Money</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-terex-darker/80 to-terex-dark/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 sm:p-8">
                <Banknote className="w-10 h-10 sm:w-12 sm:h-12 text-terex-accent mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">Espèces</h3>
                <p className="text-gray-400 text-sm">Points de retrait partenaires</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      
      {/* Section CTA finale optimisée mobile */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-terex-darker via-terex-dark to-terex-darker relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(94,234,212,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(94,234,212,0.05),transparent_50%)]"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à commencer avec <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges crypto et virements internationaux.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <p className="text-gray-400 text-sm mt-4">
            Inscription gratuite • Vérification en 24h • Support 24/7
          </p>
        </div>
      </section>
    </div>
  );
}
