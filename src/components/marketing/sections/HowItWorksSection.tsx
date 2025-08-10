
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Send, Shield } from 'lucide-react';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  return (
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
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/partners/tether-logo.png" 
                  alt="USDT Tether Logo" 
                  className="w-10 h-10"
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">Échanger USDT-Tether</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Achetez et vendez vos USDT au meilleur taux du marché avec des frais transparents.
              </p>
              <div className="flex items-center justify-center space-x-2 text-terex-accent">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Meilleurs taux</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">Transférer l'argent</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Envoyez de l'argent rapidement vers l'Afrique avec notre réseau de partenaires locaux.
              </p>
              <div className="flex items-center justify-center space-x-2 text-terex-accent">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Réseau étendu</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">100% sécurisé</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Vos transactions sont protégées par la technologie blockchain et nos protocoles de sécurité.
              </p>
              <div className="flex items-center justify-center space-x-2 text-terex-accent">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Blockchain sécurisée</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={onBlockchainInfoClick}
            variant="outline" 
            size="lg"
            className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-6 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-64 sm:w-auto mx-auto h-12 sm:h-auto"
          >
            En savoir plus sur la blockchain
          </Button>
        </div>
      </div>
    </section>
  );
}
