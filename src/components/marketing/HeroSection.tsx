import { Button } from '@/components/ui/button';
import { Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceMockups } from './DeviceMockups';
import { PhoneMockup } from './PhoneMockup';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleDashboard = () => {
    if (onShowDashboard) {
      onShowDashboard();
    }
  };

  const handleHowItWorks = () => {
    // Scroll to "Comment ça marche" section
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-terex-dark min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 overflow-hidden">
        {/* Layout principal en grid pour desktop, stack pour mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
          
          {/* Colonne de gauche - Contenu textuel */}
          <AnimatedSection className="order-2 lg:order-1 text-center lg:text-left" delay={100}>
            {/* Titre centré sur mobile */}
            <div className="lg:hidden">
              <DeviceMockups />
            </div>
            
            {/* Mockup téléphone visible uniquement sur mobile entre titre et sous-titre */}
            <div className="lg:hidden flex justify-center my-8">
              <div className="relative scale-75">
                <PhoneMockup />
              </div>
            </div>
            
            {/* DeviceMockups pour desktop seulement */}
            <div className="hidden lg:block">
              <DeviceMockups />
            </div>
            
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-light">
              Achetez et vendez des USDT facilement, 
              effectuez des transferts d'argent vers l'Afrique instantanément. Rapide, sécurisé et sans commission.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 justify-center lg:justify-start">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-light px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto"
                >
                  Aller au Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-light px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto"
                >
                  Commencer maintenant
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-terex-gray px-6 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-64 sm:w-auto mx-auto h-12 sm:h-auto"
              >
                Voir comment ça marche
              </Button>
            </div>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-light text-terex-accent">5min</div>
                <div className="text-sm text-gray-400">Transfert rapide</div>
              </div>
              <div>
                <div className="text-2xl font-light text-terex-accent">6</div>
                <div className="text-sm text-gray-400">Pays supportés</div>
              </div>
              <div>
                <div className="text-2xl font-light text-terex-accent">24/7</div>
                <div className="text-sm text-gray-400">Disponibilité</div>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Colonne de droite - PhoneMockup visible uniquement sur desktop */}
          <AnimatedSection className="order-1 lg:order-2 hidden lg:flex justify-center" delay={300} direction="right">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              <PhoneMockup />
            </div>
          </AnimatedSection>
        </div>
        
        {/* Feature strip - editorial horizontal layout */}
        <div className="mt-20 lg:mt-28 border-t border-terex-gray/20 pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-terex-gray/20">
            {[
              {
                icon: <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-7 h-7" />,
                title: 'Échange USDT',
                subtitle: 'Achat & vente au meilleur taux',
              },
              {
                icon: <Globe className="w-6 h-6 text-terex-accent" />,
                title: 'Transferts Afrique',
                subtitle: '6 pays couverts, en 5 min',
              },
              {
                icon: <Shield className="w-6 h-6 text-terex-accent" />,
                title: '100% Sécurisé',
                subtitle: 'Chiffrement 256-bit, non-custodial',
              },
            ].map((item, index) => (
              <AnimatedItem key={index} index={index}>
                <div className="flex items-center gap-5 py-6 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-terex-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-terex-accent/15 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium text-sm sm:text-base">{item.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm font-light">{item.subtitle}</p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

