import { Button } from '@/components/ui/button';
import { CheckCircle, UserPlus, Repeat, ShieldCheck, ArrowRight } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Inscription gratuite',
    description: 'Créez votre compte en moins de 2 minutes avec vérification KYC rapide.',
    detail: '100% gratuit',
  },
  {
    number: '02',
    icon: Repeat,
    title: 'Choisissez votre service',
    description: 'Achat/vente USDT ou transfert vers l\'Afrique avec taux en temps réel.',
    detail: 'Taux en temps réel',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Transaction sécurisée',
    description: 'Confirmez et suivez votre transaction en temps réel jusqu\'à réception.',
    detail: '3-5 minutes',
  },
];

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-terex-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4">
            Comment ça <span className="text-terex-accent">marche</span>
          </h2>
          <p className="text-gray-400 font-light max-w-lg mx-auto">
            Trois étapes simples pour commencer
          </p>
        </AnimatedSection>

        {/* Clean vertical list — no boxes */}
        <div className="space-y-0">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group flex items-start gap-5 sm:gap-8 py-8 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-200 px-2 sm:px-4 rounded-xl">
                  {/* Number + icon */}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono text-gray-500 tracking-widest">{step.number}</span>
                    <div className="w-11 h-11 rounded-2xl bg-terex-accent/10 flex items-center justify-center group-hover:bg-terex-accent/20 transition-colors">
                      <IconComponent className="w-5 h-5 text-terex-accent" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-1.5">{step.title}</h3>
                    <p className="text-sm text-gray-400 font-light leading-relaxed mb-2">{step.description}</p>
                    <div className="flex items-center gap-1.5 text-terex-accent">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{step.detail}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-gray-600 mt-3 flex-shrink-0 group-hover:text-terex-accent group-hover:translate-x-1 transition-all" />
                </div>
              </AnimatedItem>
            );
          })}
        </div>

        <AnimatedSection className="text-center mt-12" delay={300}>
          <Button 
            onClick={onBlockchainInfoClick}
            variant="outline" 
            size="lg"
            className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20 px-6 py-4 text-sm rounded-xl backdrop-blur-sm"
          >
            En savoir plus sur la blockchain
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
