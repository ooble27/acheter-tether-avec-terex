import { Button } from '@/components/ui/button';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/i18n/LanguageContext';

interface HowItWorksSectionProps {
  onBlockchainInfoClick: () => void;
}

export function HowItWorksSection({ onBlockchainInfoClick }: HowItWorksSectionProps) {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      title: t.howItWorks.step1Title,
      titleHighlight: t.howItWorks.step1Highlight,
      description: t.howItWorks.step1Desc,
    },
    {
      number: '02',
      title: t.howItWorks.step2Title,
      titleHighlight: t.howItWorks.step2Highlight,
      description: t.howItWorks.step2Desc,
    },
    {
      number: '03',
      title: t.howItWorks.step3Title,
      titleHighlight: t.howItWorks.step3Highlight,
      description: t.howItWorks.step3Desc,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-16 sm:mb-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight">
              {t.howItWorks.title} <span className="text-terex-accent">{t.howItWorks.titleHighlight}</span> {t.howItWorks.questionMark}
            </h2>
          </div>
        </AnimatedSection>

        <div className="space-y-0 divide-y divide-terex-gray/30">
          {steps.map((step, index) => (
            <AnimatedItem key={step.number} index={index}>
              <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[100px_1fr_1fr] gap-4 sm:gap-8 py-12 sm:py-16 items-center">
                <span className="text-5xl sm:text-8xl font-extralight text-terex-gray/60 select-none">
                  {step.number}
                </span>
                <h3 className="text-xl sm:text-3xl font-light text-foreground leading-snug">
                  <span className="border-b-2 border-terex-accent pb-0.5">{step.title}</span>{' '}
                  <span className="text-muted-foreground">{step.titleHighlight}</span>
                </h3>
                <p className="col-span-2 sm:col-span-1 text-sm sm:text-base text-muted-foreground font-light leading-relaxed sm:text-right">
                  {step.description}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>

        <div className="border-t border-terex-gray/30" />

        <AnimatedSection className="text-center mt-14" delay={250}>
          <Button
            onClick={onBlockchainInfoClick}
            variant="outline"
            className="rounded-full border-terex-gray/40 text-foreground hover:bg-terex-gray/20 px-8 py-5 text-sm"
          >
            {t.howItWorks.learnMore}
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
