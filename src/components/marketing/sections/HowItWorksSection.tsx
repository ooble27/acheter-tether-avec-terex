
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Comment ça <span className="text-terex-accent">marche</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Trois étapes simples pour commencer vos échanges et transferts vers l'Afrique
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="bg-white border border-gray-100 hover:border-terex-accent/30 hover:shadow-lg transition-all duration-300 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-terex-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-medium text-terex-accent">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Inscription gratuite</h3>
              <p className="text-gray-500 mb-4 text-sm font-light leading-relaxed">
                Créez votre compte en moins de 2 minutes. Processus de vérification KYC simple et rapide.
              </p>
              <div className="flex items-center justify-center space-x-2 text-terex-accent">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">100% gratuit</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 hover:border-terex-accent/30 hover:shadow-lg transition-all duration-300 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-terex-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-medium text-terex-accent">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Choisissez votre service</h3>
              <p className="text-gray-500 mb-4 text-sm font-light leading-relaxed">
                Achat/vente USDT ou transfert vers l'Afrique. Interface intuitive pour tous vos besoins.
              </p>
              <div className="flex items-center justify-center space-x-2 text-terex-accent">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Taux en temps réel</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 hover:border-terex-accent/30 hover:shadow-lg transition-all duration-300 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-terex-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-medium text-terex-accent">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Transaction sécurisée</h3>
              <p className="text-gray-500 mb-4 text-sm font-light leading-relaxed">
                Confirmez et finalisez votre transaction. Suivi en temps réel jusqu'à la réception.
              </p>
              <div className="flex items-center justify-center space-x-2 text-terex-accent">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">3-5 minutes</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={onBlockchainInfoClick}
            variant="outline" 
            size="lg"
            className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 px-6 py-4 text-base rounded-xl w-64 sm:w-auto mx-auto h-12 sm:h-auto group"
          >
            En savoir plus sur la blockchain
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
