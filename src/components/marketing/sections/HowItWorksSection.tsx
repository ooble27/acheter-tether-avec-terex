
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  const { t } = useTranslation();
  
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Trois étapes simples pour commencer vos échanges et transferts vers l'Afrique
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="bg-terex-darker/80 border-terex-accent/30 hover:border-terex-accent/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-light text-terex-accent">1</span>
              </div>
              <h3 className="text-base sm:text-lg font-light text-white mb-3">{t('howItWorks.step1.title')}</h3>
              <p className="text-gray-400 mb-4 text-sm font-light">
                {t('howItWorks.step1.description')}
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
                <span className="text-xl font-light text-terex-accent">2</span>
              </div>
              <h3 className="text-base sm:text-lg font-light text-white mb-3">{t('howItWorks.step2.title')}</h3>
              <p className="text-gray-400 mb-4 text-sm font-light">
                {t('howItWorks.step2.description')}
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
                <span className="text-xl font-light text-terex-accent">3</span>
              </div>
              <h3 className="text-base sm:text-lg font-light text-white mb-3">{t('howItWorks.step3.title')}</h3>
              <p className="text-gray-400 mb-4 text-sm font-light">
                {t('howItWorks.step3.description')}
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
