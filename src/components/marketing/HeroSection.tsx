import { Button } from '@/components/ui/button';
import { Shield, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceMockups } from './DeviceMockups';
import { HeroBuyForm } from './HeroBuyForm';
import { AnimatedSection } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleGetStarted = () => navigate('/auth');
  const handleDashboard = () => onShowDashboard?.();

  const handleHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-terex-dark min-h-[90vh] lg:min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 overflow-hidden">
        
        {/* ===== MOBILE ONLY — Attio-style minimal ===== */}
        {isMobile && (
          <div className="flex flex-col items-center text-center pt-12 pb-8">
            <AnimatedSection className="w-full mb-8" delay={100}>
              <h1 className="text-[2.25rem] leading-[1.12] font-bold text-foreground tracking-[-0.02em] mb-4">
                Achetez et vendez<br />
                des{' '}
                <span className="inline-flex items-center gap-1.5">
                  USDT
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                    alt="USDT" 
                    className="w-7 h-7 inline-block"
                  />
                </span>
              </h1>
              <p className="text-[15px] text-muted-foreground/70 font-normal tracking-[-0.01em] max-w-[280px] mx-auto leading-relaxed">
                Échange de stablecoins simple et sécurisé.
              </p>
            </AnimatedSection>

            <AnimatedSection className="w-full flex justify-center" delay={250}>
              <HeroBuyForm />
            </AnimatedSection>
          </div>
        )}

        {/* ===== TABLET & DESKTOP — Side by side layout ===== */}
        {!isMobile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[500px] lg:min-h-[600px]">
            <AnimatedSection className="text-left" delay={100}>
              <DeviceMockups />
              <p className="text-base lg:text-lg xl:text-xl text-muted-foreground mb-8 lg:mb-10 max-w-2xl leading-relaxed font-light">
                Achetez et vendez des USDT facilement, 
                effectuez des transferts d'argent vers l'Afrique instantanément. Rapide, sécurisé et sans commission.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                {user ? (
                  <Button onClick={handleDashboard} size="lg" className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-semibold px-6 lg:px-8 py-4 h-12 lg:h-14 min-w-[140px] lg:min-w-[220px] rounded-xl text-base lg:text-lg shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-[1.02] group">
                    Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-semibold px-6 lg:px-8 py-4 h-12 lg:h-14 min-w-[140px] lg:min-w-[220px] rounded-xl text-base lg:text-lg shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-[1.02] group">
                    Commencer
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
                <Button onClick={handleHowItWorks} variant="outline" size="lg" className="border-terex-gray/50 text-foreground hover:bg-terex-gray/20 px-6 lg:px-8 py-4 h-12 lg:h-14 min-w-[180px] lg:min-w-[220px] rounded-xl text-base lg:text-lg backdrop-blur-sm transition-all duration-300 hover:border-terex-accent/40">
                  Comment ça marche
                </Button>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="flex justify-center" delay={300} direction="right">
              <HeroBuyForm />
            </AnimatedSection>
          </div>
        )}
        
        {/* Floating cards — Desktop & Tablet only */}
        {!isMobile && (
          <AnimatedSection className="mt-20 lg:mt-32" delay={400}>
            <div className="relative max-w-4xl mx-auto">
              <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
                <line x1="200" y1="100" x2="400" y2="100" stroke="hsl(var(--terex-accent))" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
                <line x1="400" y1="100" x2="600" y2="100" stroke="hsl(var(--terex-accent))" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
                <circle cx="200" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
                <circle cx="400" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
                <circle cx="600" cy="100" r="4" fill="hsl(var(--terex-accent))" opacity="0.5" />
              </svg>

              <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-gray/25 p-5 lg:p-6 shadow-xl hover:border-terex-accent/30 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-7 h-7 lg:w-8 lg:h-8" />
                    <span className="text-foreground font-medium text-sm lg:text-base">Échange USDT</span>
                  </div>
                  <div className="space-y-2 text-xs lg:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Achat instantané</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Vente rapide</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Meilleur taux CFA</span></div>
                  </div>
                  <div className="mt-4 text-[10px] lg:text-xs text-muted-foreground/60">+ 3 réseaux supportés</div>
                </div>

                <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-accent/25 p-5 lg:p-6 shadow-xl lg:-translate-y-3 hover:border-terex-accent/40 transition-all duration-500 hover:-translate-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 lg:w-7 lg:h-7 text-terex-accent" />
                    <span className="text-foreground font-medium text-sm lg:text-base">Transferts</span>
                    <span className="ml-auto text-[9px] lg:text-[10px] px-2 py-0.5 rounded-full border border-terex-accent/30 text-terex-accent">Live</span>
                  </div>
                  <div className="space-y-2 text-xs lg:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>6 pays d'Afrique</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Mobile Money</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>En moins de 5 min</span></div>
                  </div>
                  <div className="mt-4 text-[10px] lg:text-xs text-muted-foreground/60">+ Suivi en temps réel</div>
                </div>

                <div className="relative bg-terex-darker/80 backdrop-blur-md rounded-2xl border border-terex-gray/25 p-5 lg:p-6 shadow-xl hover:border-terex-accent/30 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-terex-accent" />
                    <span className="text-foreground font-medium text-sm lg:text-base">Sécurité</span>
                  </div>
                  <div className="space-y-2 text-xs lg:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Chiffrement 256-bit</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>Non-custodial</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-terex-accent" /><span>KYC vérifié</span></div>
                  </div>
                  <div className="mt-4 text-[10px] lg:text-xs text-muted-foreground/60">+ Conformité réglementaire</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
