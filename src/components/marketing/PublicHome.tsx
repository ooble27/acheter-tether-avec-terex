
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Smartphone, CreditCard, Banknote } from 'lucide-react';

interface PublicHomeProps {
  onGetStarted: () => void;
}

export function PublicHome({ onGetStarted }: PublicHomeProps) {
  return (
    <div className="min-h-screen bg-terex-dark">
      <HeroSection />
      
      {/* Section Comment ça marche */}
      <section className="py-20 bg-terex-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Comment ça <span className="text-terex-accent">marche</span> ?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Trois étapes simples pour commencer vos échanges et virements
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-terex-dark border-terex-gray/30 hover:border-terex-accent/30 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-terex-accent">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Inscription gratuite</h3>
                <p className="text-gray-300 mb-6">
                  Créez votre compte en moins de 2 minutes. Processus de vérification KYC simple et rapide.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">100% gratuit</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-dark border-terex-gray/30 hover:border-terex-accent/30 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-terex-accent">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Choisissez votre service</h3>
                <p className="text-gray-300 mb-6">
                  Achat/vente d'USDT ou virement international. Interface intuitive pour tous vos besoins.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Taux en temps réel</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-dark border-terex-gray/30 hover:border-terex-accent/30 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-terex-accent">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Transaction sécurisée</h3>
                <p className="text-gray-300 mb-6">
                  Confirmez et finalisez votre transaction. Suivi en temps réel jusqu'à la réception.
                </p>
                <div className="flex items-center justify-center space-x-2 text-terex-accent">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">3-5 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <StatsSection />
      
      {/* Section Méthodes de paiement */}
      <section className="py-20 bg-terex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Méthodes de <span className="text-terex-accent">paiement</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Plusieurs options sécurisées pour vos transactions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-terex-darker border-terex-gray/30 text-center hover:border-terex-accent/30 transition-all duration-300">
              <CardContent className="p-8">
                <CreditCard className="w-12 h-12 text-terex-accent mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Virement bancaire</h3>
                <p className="text-gray-400 text-sm">Virements SEPA et internationaux</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker border-terex-gray/30 text-center hover:border-terex-accent/30 transition-all duration-300">
              <CardContent className="p-8">
                <Smartphone className="w-12 h-12 text-terex-accent mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Mobile Money</h3>
                <p className="text-gray-400 text-sm">Orange Money, Wave, Free Money</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker border-terex-gray/30 text-center hover:border-terex-accent/30 transition-all duration-300">
              <CardContent className="p-8">
                <Banknote className="w-12 h-12 text-terex-accent mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Espèces</h3>
                <p className="text-gray-400 text-sm">Points de retrait partenaires</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      
      {/* Section CTA finale */}
      <section className="py-20 bg-gradient-to-br from-terex-darker to-terex-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à commencer avec <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs échanges crypto et virements internationaux.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-gray-400 text-sm mt-4">
            Inscription gratuite • Vérification en 24h • Support 24/7
          </p>
        </div>
      </section>
    </div>
  );
}
