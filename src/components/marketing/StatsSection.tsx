import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const stats = [
  {
    value: '10M+',
    suffix: 'CFA',
    label: 'Volume mensuel',
    description: 'Traités chaque mois sur notre plateforme',
  },
  {
    value: '500+',
    suffix: '',
    label: 'Utilisateurs actifs',
    description: 'Font confiance à Terex au quotidien',
  },
  {
    value: '6',
    suffix: 'pays',
    label: 'Pays couverts',
    description: "Présents en Afrique de l'Ouest",
  },
  {
    value: '99.9',
    suffix: '%',
    label: 'Disponibilité',
    description: 'Uptime garanti 24h/24, 7j/7',
  },
];

const tags = [
  'Mobile Money',
  'USDT',
  'Transferts',
  'Blockchain',
  'KYC rapide',
  'Multi-réseau',
  'Temps réel',
  'Sécurisé',
];

export function StatsSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big headline - Ooble style */}
        <AnimatedSection className="mb-16 sm:mb-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-light text-foreground leading-[1.15]">
              Nous connectons{' '}
              <span className="text-muted-foreground">la crypto à l'Afrique</span>{' '}
              et on simplifie tout.
            </h2>
            <p className="text-muted-foreground font-light mt-6 text-base sm:text-lg max-w-lg">
              Pas de complexité inutile. On s'intègre aux outils que vous utilisez déjà — Mobile Money, Binance, wallets crypto.
            </p>
          </div>
        </AnimatedSection>

        {/* Tags row */}
        <AnimatedSection delay={100}>
          <div className="flex flex-wrap gap-2.5 mb-20 sm:mb-24">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full border border-terex-gray/40 px-4 py-2 text-sm text-muted-foreground hover:border-terex-accent/50 hover:text-foreground transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* Divider */}
        <div className="border-t border-terex-gray/30 mb-16 sm:mb-20" />

        {/* Stats - large numbers, clean rows */}
        <div className="space-y-0 divide-y divide-terex-gray/30">
          {stats.map((stat, index) => (
            <AnimatedItem key={stat.label} index={index}>
              <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[200px_1fr_auto] gap-4 sm:gap-8 py-8 sm:py-10 items-center">
                {/* Label */}
                <h3 className="text-sm sm:text-base text-foreground font-medium">
                  {stat.label}
                </h3>

                {/* Description - hidden on mobile */}
                <p className="hidden sm:block text-sm text-muted-foreground font-light">
                  {stat.description}
                </p>

                {/* Value */}
                <div className="text-right">
                  <span className="text-3xl sm:text-5xl font-extralight text-foreground tabular-nums">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-sm text-muted-foreground ml-1.5">{stat.suffix}</span>
                  )}
                </div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
