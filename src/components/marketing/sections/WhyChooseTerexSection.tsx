import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

export function WhyChooseTerexSection() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big statement headline */}
        <AnimatedSection className="mb-20 sm:mb-28">
          <span className="text-terex-accent text-xs tracking-[0.25em] uppercase mb-6 block">Nos avantages</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-light text-foreground leading-[1.12] max-w-4xl">
            Nous réduisons vos frais à{' '}
            <span className="relative inline-block">
              <span className="text-terex-accent">2%</span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-terex-accent/50" />
            </span>
            , livrons en{' '}
            <span className="text-terex-accent">5 min</span>
            , et couvrons{' '}
            <span className="text-terex-accent">6 pays</span>
            {' '}en Afrique de l'Ouest.
          </h2>
        </AnimatedSection>

        {/* Visual showcase panels — Claude.com inspired */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Panel 1 — Commission */}
          <AnimatedItem index={0}>
            <div className="group relative rounded-2xl bg-terex-darker/60 backdrop-blur-sm border border-terex-gray/20 overflow-hidden hover:border-terex-accent/30 transition-all duration-500">
              {/* Visual header zone */}
              <div className="h-32 sm:h-56 flex items-center justify-center relative overflow-hidden">
                <div className="relative text-center">
                  <div className="text-7xl sm:text-8xl font-extralight text-terex-accent leading-none mb-1">2%</div>
                  <div className="text-muted-foreground text-sm">commission unique</div>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 pt-0">
                <h3 className="text-foreground text-lg font-medium mb-2">Frais transparents</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Pas de frais cachés, pas de surprises. Un taux fixe de 2% sur chaque transaction, parmi les plus bas du marché.
                </p>
              </div>
            </div>
          </AnimatedItem>

          {/* Panel 2 — Speed */}
          <AnimatedItem index={1}>
            <div className="group relative rounded-2xl bg-terex-darker/60 backdrop-blur-sm border border-terex-gray/20 overflow-hidden hover:border-terex-accent/30 transition-all duration-500">
              <div className="h-32 sm:h-56 flex items-center justify-center relative overflow-hidden">
                <div className="relative text-center">
                  <div className="text-7xl sm:text-8xl font-extralight text-terex-accent leading-none mb-1">&lt;5</div>
                  <div className="text-muted-foreground text-sm">minutes</div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <h3 className="text-foreground text-lg font-medium mb-2">Exécution instantanée</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  De la confirmation à la réception, vos transactions sont complétées en quelques minutes, 24h/24.
                </p>
              </div>
            </div>
          </AnimatedItem>

          {/* Panel 3 — Coverage */}
          <AnimatedItem index={2}>
            <div className="group relative rounded-2xl bg-terex-darker/60 backdrop-blur-sm border border-terex-gray/20 overflow-hidden hover:border-terex-accent/30 transition-all duration-500">
              <div className="h-48 sm:h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-terex-accent/5 to-transparent" />
                <div className="relative text-center">
                  <div className="text-7xl sm:text-8xl font-extralight text-terex-accent leading-none mb-1">6</div>
                  <div className="text-muted-foreground text-sm">pays couverts</div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <h3 className="text-foreground text-lg font-medium mb-2">Couverture Afrique de l'Ouest</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sénégal, Côte d'Ivoire, Mali, Burkina Faso, Niger et Guinée. Mobile Money & virements bancaires.
                </p>
              </div>
            </div>
          </AnimatedItem>
        </div>

        {/* Bottom feature row — minimal */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-terex-gray/20 border-y border-terex-gray/20">
          {[
            { label: 'Support', value: '24/7', desc: 'Assistance en français' },
            { label: 'Sécurité', value: '99.9%', desc: 'Uptime & chiffrement' },
            { label: 'Interface', value: '3 clics', desc: 'Pour chaque opération' },
          ].map((item, i) => (
            <AnimatedItem key={i} index={i + 3}>
              <div className="py-6 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex items-center justify-between sm:flex-col sm:items-start sm:gap-1">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                  <div className="text-2xl font-extralight text-terex-accent mt-1">{item.value}</div>
                </div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
}
