import { Button } from '@/components/ui/button';
import { Shield, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceMockups } from './DeviceMockups';
import { PhoneMockup } from './PhoneMockup';
import { AnimatedSection } from '@/hooks/useScrollAnimation';

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
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-terex-dark min-h-[90vh] lg:min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 overflow-hidden">
        
        {/* ===== MOBILE LAYOUT ===== */}
        <div className="lg:hidden flex flex-col items-center text-center">
          <AnimatedSection delay={100}>
            {/* Typewriter title */}
            <div className="mb-6">
              <DeviceMockups />
            </div>

            {/* CTA buttons — pill style, compact */}
            <div className="flex gap-3 justify-center mb-8">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-6 h-11 rounded-full text-sm shadow-lg shadow-terex-accent/20 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-[1.02]"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-6 h-11 rounded-full text-sm shadow-lg shadow-terex-accent/20 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-[1.02]"
                >
                  Commencer
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                className="border-terex-gray/40 text-muted-foreground hover:bg-terex-gray/20 px-5 h-11 rounded-full text-sm backdrop-blur-sm"
              >
                Comment ça marche
              </Button>
            </div>

            {/* Phone mockup — centered, compact */}
            <div className="flex justify-center mb-8">
              <div className="relative scale-[0.7]">
                <PhoneMockup />
              </div>
            </div>
          </AnimatedSection>

          {/* Floating cards — compact horizontal scroll on mobile */}
          <AnimatedSection className="w-full" delay={300}>
            <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-hide">
              {/* Card 1 */}
              <div className="snap-center shrink-0 w-[260px] bg-terex-darker/80 backdrop-blur-md rounded-xl border border-terex-gray/25 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-6 h-6" />
                  <span className="text-foreground text-sm font-medium">Échange USDT</span>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>Achat instantané</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>Vente rapide</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>Meilleur taux CFA</span></div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="snap-center shrink-0 w-[260px] bg-terex-darker/80 backdrop-blur-md rounded-xl border border-terex-accent/25 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <Globe className="w-5 h-5 text-terex-accent" />
                  <span className="text-foreground text-sm font-medium">Transferts</span>
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full border border-terex-accent/30 text-terex-accent">Live</span>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>6 pays d'Afrique</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>Mobile Money</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>En moins de 5 min</span></div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="snap-center shrink-0 w-[260px] bg-terex-darker/80 backdrop-blur-md rounded-xl border border-terex-gray/25 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <Shield className="w-5 h-5 text-terex-accent" />
                  <span className="text-foreground text-sm font-medium">Sécurité</span>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>Chiffrement 256-bit</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>Non-custodial</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-terex-accent" /><span>KYC vérifié</span></div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="hidden lg:grid grid-cols-2 gap-16 items-center min-h-[600px]">
          {/* Left — Text */}
          <AnimatedSection className="text-left" delay={100}>
            <DeviceMockups />
            
            <p className="text-lg xl:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed font-light">
              Achetez et vendez des USDT facilement, 
              effectuez des transferts d'argent vers l'Afrique instantanément. Rapide, sécurisé et sans commission.
            </p>
            
            <div className="flex gap-4">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-8 h-13 rounded-full text-base shadow-lg shadow-terex-accent/20 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-[1.02] group"
                >
                  Aller au Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-terex-accent hover:bg-terex-accent/90 text-black font-medium px-8 h-13 rounded-full text-base shadow-lg shadow-terex-accent/20 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-[1.02] group"
                >
                  Commencer maintenant
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="border-terex-gray/40 text-muted-foreground hover:bg-terex-gray/20 px-8 h-13 rounded-full text-base backdrop-blur-sm transition-all duration-300 hover:border-terex-accent/30"
              >
                Comment ça marche
              </Button>
            </div>
          </AnimatedSection>
          
          {/* Right — Phone */}
          <AnimatedSection className="flex justify-center" delay={300} direction="right">
            <div className="relative">
              <PhoneMockup />
            </div>
          </AnimatedSection>
        </div>
        
        {/* Floating cards — Desktop only, with SVG lines */}
        <AnimatedSection className="mt-24 lg:mt-32 hidden sm:block" delay={400}>
          <div className="relative max-w-4xl mx-auto">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
              <line x1="200" y1="100" x2="400" y2="100" stroke="hsl(var(--terex-accent))" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
              <line x1="400" y1="100" x2="600" y2="100" stroke="hsl(var(--terex-accent))" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
              <circle cx="200" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
              <circle cx="400" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
              <circle cx="600" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
            </svg>

            <div className="relative grid grid-cols-3 gap-4">
              <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-gray/25 p-6 shadow-xl hover:border-terex-accent/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-8 h-8" />
                  <span className="text-foreground font-medium">Échange USDT</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Achat instantané</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Vente rapide</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Meilleur taux CFA</span></div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground/60">+ 3 réseaux supportés</div>
              </div>

              <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-accent/25 p-6 shadow-xl -translate-y-3 hover:border-terex-accent/40 transition-all duration-500 hover:-translate-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-7 h-7 text-terex-accent" />
                  <span className="text-foreground font-medium">Transferts</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-terex-accent/30 text-terex-accent">Live</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>6 pays d'Afrique</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Mobile Money</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>En moins de 5 min</span></div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground/60">+ Suivi en temps réel</div>
              </div>

              <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-gray/25 p-6 shadow-xl hover:border-terex-accent/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-7 h-7 text-terex-accent" />
                  <span className="text-foreground font-medium">Sécurité</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Chiffrement 256-bit</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Non-custodial</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>KYC vérifié</span></div>
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
