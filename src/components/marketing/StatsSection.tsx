import { AnimatedSection } from '@/hooks/useScrollAnimation';

export function StatsSection() {
  return (
    <section className="py-32 sm:py-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-6xl lg:text-[5rem] font-light text-foreground leading-[1.1] tracking-tight">
            Nous connectons{' '}
            <span className="text-terex-accent">la crypto</span>{' '}
            à toute l'Afrique.
          </h2>
        </AnimatedSection>
      </div>
    </section>
  );
}
