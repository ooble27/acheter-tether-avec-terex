
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Smartphone, CreditCard, Banknote, Zap, Lock, Globe2 } from 'lucide-react';
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
    <div className="min-h-screen bg-black">
      <HeroSection />
      
      {/* Section Comment ça marche avec design Web3 */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-terex-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-terex-accent/10 border border-terex-accent/30 rounded-full px-6 py-2 mb-6">
              <Zap className="w-4 h-4 text-terex-accent" />
              <span className="text-terex-accent text-sm font-medium">Processus simplifié</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Comment ça <span className="text-terex-accent relative">
                marche
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent to-transparent opacity-50"></div>
              </span> ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Trois étapes simples pour commencer vos échanges et virements
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-black/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 border-2 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terex-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-4 sm:p-6 text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-terex-accent/20 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-terex-accent">1</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Inscription gratuite</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Créez votre compte en moins de 2 minutes. Processus de vérification KYC simple et rapide.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">100% gratuit</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 border-2 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-4 sm:p-6 text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/30 to-blue-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-400/20 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Choisissez votre service</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Achat/vente USDT ou virement international. Interface intuitive pour tous vos besoins.
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Taux en temps réel</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 border-2 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-4 sm:p-6 text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/30 to-green-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-400/20 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-green-400">3</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Transaction sécurisée</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Confirmez et finalisez votre transaction. Suivi en temps réel jusqu'à la réception.
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">3-5 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={handleBlockchainInfo}
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl backdrop-blur-sm w-full sm:w-auto border-2 hover:border-terex-accent/50"
            >
              <Lock className="w-4 h-4 mr-2" />
              En savoir plus sur la blockchain
            </Button>
          </div>
        </div>
      </section>

      <StatsSection />
      
      {/* Section Méthodes de paiement avec design modernisé */}
      <section className="py-16 sm:py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/30 rounded-full px-6 py-2 mb-6">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Solutions de paiement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Méthodes de <span className="text-terex-accent">paiement</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Plusieurs options sécurisées pour vos transactions
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-black/80 border-blue-400/30 text-center hover:border-blue-400/50 transition-all duration-300 hover:scale-105 border-2 group">
              <CardContent className="p-4 sm:p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-blue-400/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-400/20">
                  <CreditCard className="w-8 h-8 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Virement bancaire</h3>
                <p className="text-gray-400 text-xs">Virements SEPA et internationaux</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-green-400/30 text-center hover:border-green-400/50 transition-all duration-300 hover:scale-105 border-2 group">
              <CardContent className="p-4 sm:p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-400/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-green-400/20">
                  <Smartphone className="w-8 h-8 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Mobile Money</h3>
                <p className="text-gray-400 text-xs">Orange Money, Wave, Free Money</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-terex-accent/30 text-center hover:border-terex-accent/50 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1 border-2 group">
              <CardContent className="p-4 sm:p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terex-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-terex-accent/20">
                  <Banknote className="w-8 h-8 sm:w-6 sm:h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Espèces</h3>
                <p className="text-gray-400 text-xs">Points de retrait partenaires</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      
      {/* Section CTA finale modernisée */}
      <section className="py-16 sm:py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-terex-accent/10 border border-terex-accent/30 rounded-full px-6 py-2 mb-8">
            <Globe2 className="w-4 h-4 text-terex-accent" />
            <span className="text-terex-accent text-sm font-medium">Rejoignez la révolution</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à commencer avec <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges USDT et virements internationaux.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto"
            >
              <Zap className="mr-2 w-4 h-4" />
              Créer mon compte gratuitement
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Inscription gratuite</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Vérification en 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
