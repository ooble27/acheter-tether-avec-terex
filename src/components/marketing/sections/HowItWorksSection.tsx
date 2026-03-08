import { Button } from '@/components/ui/button';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';
import { ShieldCheck, Wallet, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

const features = [
  {
    icon: Wallet,
    title: 'Inscription rapide et compte sécurisé',
    description: 'Créez votre compte en 2 minutes avec un parcours KYC fluide, pensé mobile-first.',
    highlight: 'Onboarding express',
  },
  {
    icon: ArrowLeftRight,
    title: 'Échange et transfert en un seul flux',
    description: 'Choisissez achat, vente ou transfert international avec des taux en temps réel.',
    highlight: 'Processus unifié',
  },
  {
    icon: ShieldCheck,
    title: 'Validation et exécution instantanées',
    description: 'Confirmation claire, suivi temps réel et exécution sécurisée de bout en bout.',
    highlight: 'Fiabilité opérationnelle',
  },
];

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-24 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,hsl(var(--primary)/0.12),transparent_35%)]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="mb-14 sm:mb-16">
          <div className="max-w-3xl">
            <span className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-4 block">Comment ça marche</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight">
              Un parcours clair, <span className="text-terex-accent">sans friction</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedItem key={item.title} index={index}>
                <article className="group relative h-full rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-6 sm:p-7 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-terex-accent/40">
                  <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-terex-accent/10 blur-2xl group-hover:bg-terex-accent/20 transition-colors" />

                  <div className="relative flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-background/50 border border-border/60 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-terex-accent" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/40 px-3 py-1 text-[11px] text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-terex-accent" />
                        {item.highlight}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-light text-foreground mb-3 leading-snug">{item.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </article>
              </AnimatedItem>
            );
          })}
        </div>

        <AnimatedSection className="text-center mt-14" delay={250}>
          <Button
            onClick={onBlockchainInfoClick}
            variant="outline"
            className="rounded-xl border-border/80 bg-card/20 text-foreground hover:bg-card/50 px-7 py-5"
          >
            En savoir plus sur la blockchain
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
