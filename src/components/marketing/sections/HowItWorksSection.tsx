import { Button } from '@/components/ui/button';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

const steps = [
  {
    number: '01',
    title: 'Inscription',
    titleHighlight: 'rapide',
    description: 'Créez votre compte en 2 minutes. Vérification KYC simple, rapide — commencez à trader immédiatement.',
  },
  {
    number: '02',
    title: 'Échange',
    titleHighlight: 'intelligent',
    description: 'Achat, vente USDT ou transfert international. Taux en temps réel, interface intuitive — tout en un seul flux.',
  },
  {
    number: '03',
    title: 'Exécution',
    titleHighlight: 'sécurisée',
    description: 'Transaction confirmée et exécutée en quelques minutes. Suivi en temps réel jusqu\'à la réception.',
  },
];

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-16 sm:mb-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight">
              Comment ça <span className="text-terex-accent">marche</span> ?
            </h2>
          </div>
        </AnimatedSection>

        {/* Steps - Ooble-inspired layout */}
        <div className="space-y-0 divide-y divide-terex-gray/30">
          {steps.map((step, index) => (
            <AnimatedItem key={step.number} index={index}>
              <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[100px_1fr_1fr] gap-4 sm:gap-8 py-12 sm:py-16 items-center">
                {/* Big number */}
                <span className="text-5xl sm:text-8xl font-extralight text-terex-gray/60 select-none">
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="text-xl sm:text-3xl font-light text-foreground leading-snug">
                  <span className="border-b-2 border-terex-accent pb-0.5">{step.title}</span>{' '}
                  <span className="text-muted-foreground">{step.titleHighlight}</span>
                </h3>

                {/* Description - below on mobile, right on desktop */}
                <p className="col-span-2 sm:col-span-1 text-sm sm:text-base text-muted-foreground font-light leading-relaxed sm:text-right">
                  {step.description}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-terex-gray/30" />

        <AnimatedSection className="text-center mt-14" delay={250}>
          <Button
            onClick={onBlockchainInfoClick}
            variant="outline"
            className="rounded-full border-terex-gray/40 text-foreground hover:bg-terex-gray/20 px-8 py-5 text-sm"
          >
            En savoir plus sur la blockchain
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
