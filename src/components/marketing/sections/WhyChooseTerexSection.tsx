import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const advantages = [
  {
    icon: TrendingDown,
    title: 'Taux compétitifs',
    description: 'Les meilleurs taux de change du marché ouest-africain.',
    stat: '-70%',
    statLabel: 'de frais',
  },
  {
    icon: Clock,
    title: 'Transferts instantanés',
    description: 'Transactions traitées et confirmées en moins de 5 minutes.',
    stat: '<5',
    statLabel: 'min',
  },
  {
    icon: Shield,
    title: 'Sécurité maximale',
    description: 'Protection des données certifiée et infrastructure fiable.',
    stat: '99.9%',
    statLabel: 'fiabilité',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Assistance disponible à tout moment en français.',
    stat: '24/7',
    statLabel: 'support',
  },
  {
    icon: Smartphone,
    title: 'Interface simple',
    description: 'Parcours clair et rapide, pensé pour tous.',
    stat: '3',
    statLabel: 'clics',
  },
  {
    icon: Globe,
    title: 'Couverture Afrique',
    description: 'Présence locale dans 6 pays d’Afrique de l’Ouest.',
    stat: '6',
    statLabel: 'pays',
  },
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14 sm:mb-16">
          <span className="text-terex-accent text-xs tracking-[0.25em] uppercase mb-4 block">Nos avantages</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-10 lg:gap-16 items-start">
          <AnimatedSection className="lg:sticky lg:top-28">
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-4">Performance</p>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-7xl sm:text-8xl font-extralight text-terex-accent leading-none">-70%</span>
              <span className="text-muted-foreground text-sm pb-2">de frais</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Une approche locale, rapide et sécurisée pour connecter la crypto à l’Afrique sans friction.
            </p>
          </AnimatedSection>

          <div className="divide-y divide-terex-gray/25 border-y border-terex-gray/25">
            {advantages.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedItem key={item.title} index={index}>
                  <div className="py-6 sm:py-7 flex items-start sm:items-center justify-between gap-4 sm:gap-8 group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full border border-terex-accent/25 bg-terex-accent/10 flex items-center justify-center flex-shrink-0 mt-1 sm:mt-0">
                        <Icon className="w-5 h-5 text-terex-accent" />
                      </div>
                      <div>
                        <h3 className="text-foreground text-lg sm:text-xl font-medium group-hover:text-terex-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base mt-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl sm:text-3xl font-extralight text-terex-accent leading-none">{item.stat}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.statLabel}</div>
                    </div>
                  </div>
                </AnimatedItem>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
