import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/i18n/LanguageContext';

export function WhyChooseTerexSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-20 sm:mb-28">
          <span className="text-terex-accent text-xs tracking-[0.25em] uppercase mb-6 block">{t.whyChoose.label}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-light text-foreground leading-[1.12] max-w-4xl">
            {t.whyChoose.title}{' '}
            <span className="relative inline-block">
              <span className="text-terex-accent">2%</span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-terex-accent/50" />
            </span>
            {t.whyChoose.deliverIn}{' '}
            <span className="text-terex-accent">{t.whyChoose.minutes}</span>
            {t.whyChoose.andCover}{' '}
            <span className="text-terex-accent">{t.whyChoose.countries}</span>
            {' '}{t.whyChoose.inWestAfrica}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AnimatedItem index={0}>
            <div className="group relative rounded-2xl bg-terex-darker/60 backdrop-blur-sm border border-terex-gray/20 overflow-hidden hover:border-terex-accent/30 transition-all duration-500">
              <div className="h-32 sm:h-56 flex items-center justify-center relative overflow-hidden">
                <div className="relative text-center">
                  <div className="text-7xl sm:text-8xl font-extralight text-terex-accent leading-none mb-1">2%</div>
                  <div className="text-muted-foreground text-sm">{t.whyChoose.uniqueCommission}</div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <h3 className="text-foreground text-lg font-medium mb-2">{t.whyChoose.transparentFees}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.whyChoose.transparentFeesDesc}</p>
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem index={1}>
            <div className="group relative rounded-2xl bg-terex-darker/60 backdrop-blur-sm border border-terex-gray/20 overflow-hidden hover:border-terex-accent/30 transition-all duration-500">
              <div className="h-32 sm:h-56 flex items-center justify-center relative overflow-hidden">
                <div className="relative text-center">
                  <div className="text-7xl sm:text-8xl font-extralight text-terex-accent leading-none mb-1">&lt;5</div>
                  <div className="text-muted-foreground text-sm">{t.whyChoose.minutesLabel}</div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <h3 className="text-foreground text-lg font-medium mb-2">{t.whyChoose.instantExecution}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.whyChoose.instantExecutionDesc}</p>
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem index={2}>
            <div className="group relative rounded-2xl bg-terex-darker/60 backdrop-blur-sm border border-terex-gray/20 overflow-hidden hover:border-terex-accent/30 transition-all duration-500">
              <div className="h-32 sm:h-56 flex items-center justify-center relative overflow-hidden">
                <div className="relative text-center">
                  <div className="text-7xl sm:text-8xl font-extralight text-terex-accent leading-none mb-1">6</div>
                  <div className="text-muted-foreground text-sm">{t.whyChoose.countriesCovered}</div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <h3 className="text-foreground text-lg font-medium mb-2">{t.whyChoose.westAfricaCoverage}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.whyChoose.westAfricaCoverageDesc}</p>
              </div>
            </div>
          </AnimatedItem>
        </div>
      </div>
    </section>
  );
}
