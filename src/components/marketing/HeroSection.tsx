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
        
        {/* Floating interactive visual — Attio-inspired connected objects */}
        <AnimatedSection className="mt-24 lg:mt-32" delay={400}>
          <div className="relative max-w-4xl mx-auto">
            {/* Connection lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
              <line x1="200" y1="100" x2="400" y2="100" stroke="hsl(var(--terex-accent))" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
              <line x1="400" y1="100" x2="600" y2="100" stroke="hsl(var(--terex-accent))" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
              <circle cx="200" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
              <circle cx="400" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
              <circle cx="600" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
            </svg>

            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
              {/* Object 1 — Floating card style */}
              <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-gray/25 p-5 sm:p-6 shadow-xl hover:border-terex-accent/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-8 h-8" />
                  <span className="text-foreground font-medium">Échange USDT</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>Achat instantané</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>Vente rapide</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>Meilleur taux CFA</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground/60">+ 3 réseaux supportés</div>
              </div>

              {/* Object 2 — Central, slightly elevated */}
              <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-accent/25 p-5 sm:p-6 shadow-xl sm:-translate-y-3 hover:border-terex-accent/40 transition-all duration-500 hover:-translate-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-7 h-7 text-terex-accent" />
                  <span className="text-foreground font-medium">Transferts</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-terex-accent/30 text-terex-accent">Live</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>6 pays d'Afrique</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>Mobile Money</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>En moins de 5 min</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground/60">+ Suivi en temps réel</div>
              </div>

              {/* Object 3 */}
              <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-gray/25 p-5 sm:p-6 shadow-xl hover:border-terex-accent/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-7 h-7 text-terex-accent" />
                  <span className="text-foreground font-medium">Sécurité</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>Chiffrement 256-bit</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>Non-custodial</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-terex-accent" />
                    <span>KYC vérifié</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground/60">+ Conformité réglementaire</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

