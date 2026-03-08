import { Button } from '@/components/ui/button';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';
import { UserPlus, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Inscription gratuite",
    description: "Créez votre compte en moins de 2 minutes. Processus de vérification KYC simple et rapide.",
    detail: "100% gratuit"
  },
  {
    number: "02",
    icon: ArrowRightLeft,
    title: "Choisissez votre service",
    description: "Achat/vente USDT ou transfert vers l'Afrique. Interface intuitive pour tous vos besoins.",
    detail: "Taux en temps réel"
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Transaction sécurisée",
    description: "Confirmez et finalisez votre transaction. Suivi en temps réel jusqu'à la réception.",
    detail: "3-5 minutes"
  }
];

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <span className="text-terex-accent text-xs tracking-[0.3em] uppercase mb-6 block">Processus</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-5">
            Comment ça <span className="text-terex-accent">marche</span> ?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-base sm:text-lg">
            Trois étapes simples pour commencer vos échanges et transferts vers l'Afrique
          </p>
        </AnimatedSection>
        
        {/* Timeline-style steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-terex-accent/30 via-terex-accent/10 to-transparent hidden sm:block" />
          
          <div className="space-y-8 sm:space-y-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <AnimatedItem key={index} index={index}>
                  <div className="group relative flex gap-6 sm:gap-10 items-start">
                    {/* Step number circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-2xl bg-terex-darker border border-white/10 flex items-center justify-center group-hover:border-terex-accent/30 transition-all duration-500">
                        <span className="text-xs sm:text-sm text-gray-500 font-mono group-hover:text-terex-accent transition-colors">{step.number}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-8 sm:pb-0">
                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className="w-4 h-4 text-terex-accent" />
                            <span className="text-[10px] sm:text-xs text-terex-accent/70 uppercase tracking-wider">{step.detail}</span>
                          </div>
                          <h3 className="text-lg sm:text-2xl font-light text-white mb-2 group-hover:text-terex-accent/90 transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-gray-500 font-light text-sm sm:text-base leading-relaxed max-w-lg">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              );
            })}
          </div>
        </div>
        
        <AnimatedSection className="text-center mt-16" delay={300}>
          <Button 
            onClick={onBlockchainInfoClick}
            variant="outline" 
            className="border-white/10 text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/20 px-8 py-5 text-sm rounded-xl transition-all duration-300"
          >
            En savoir plus sur la blockchain
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
