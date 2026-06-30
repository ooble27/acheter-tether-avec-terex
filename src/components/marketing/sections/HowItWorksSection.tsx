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
    <section id="how-it-works" className="py-20 sm:py-28" style={{ backgroundColor: '#141414' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <span
            className="block text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Processus
          </span>
          <h2
            className="font-bold text-white tracking-tight"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)' }}
          >
            Comment ça marche ?
          </h2>
          <p
            className="max-w-2xl mx-auto mt-4 text-base sm:text-lg"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Trois étapes simples, de l'inscription à la réception.
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <AnimatedItem key={step.number} index={index}>
              <div
                className="h-full rounded-2xl p-8 transition-colors duration-300"
                style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                {/* Step number badge */}
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-6 text-lg font-bold text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}{' '}
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{step.titleHighlight}</span>
                </h3>

                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  {step.description}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>

        <AnimatedSection className="text-center mt-16" delay={250}>
          <Button
            onClick={onBlockchainInfoClick}
            className="rounded-full px-8 py-5 text-sm hover:opacity-90"
            style={{ backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }}
          >
            En savoir plus sur la blockchain
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
