import { TrendingUp, Users, Globe, Shield, Sparkles } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const stats = [
  {
    icon: TrendingUp,
    value: '10M+',
    suffix: 'CFA',
    label: 'Volume mensuel',
    description: 'Traités chaque mois',
    glow: 'from-terex-accent/20 to-transparent',
  },
  {
    icon: Users,
    value: '500+',
    suffix: '',
    label: 'Utilisateurs actifs',
    description: 'Font confiance à Terex',
    glow: 'from-primary/30 to-transparent',
  },
  {
    icon: Globe,
    value: '6',
    suffix: 'pays',
    label: 'Pays couverts',
    description: "En Afrique de l'Ouest",
    glow: 'from-secondary/50 to-transparent',
  },
  {
    icon: Shield,
    value: '99.9',
    suffix: '%',
    label: 'Disponibilité',
    description: 'Uptime garanti',
    glow: 'from-terex-accent/20 to-transparent',
  },
];

export function StatsSection() {
  return (
    <section className="py-24 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.12),transparent_40%)]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/30 px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-terex-accent" />
            <span className="text-xs tracking-[0.18em] uppercase text-muted-foreground">En chiffres</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
            Une plateforme en <span className="text-terex-accent">croissance</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 auto-rows-[180px]">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const areaClass =
              index === 0
                ? 'md:col-span-7'
                : index === 1
                  ? 'md:col-span-5'
                  : index === 2
                    ? 'md:col-span-5'
                    : 'md:col-span-7';

            return (
              <AnimatedItem key={stat.label} index={index} className={areaClass}>
                <article className="group relative h-full rounded-3xl border border-border/60 bg-card/30 backdrop-blur-xl p-5 sm:p-7 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-terex-accent/40">
                  <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${stat.glow} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-background/50 border border-border/60 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-terex-accent" />
                      </div>
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>

                    <div>
                      <div className="mb-2">
                        <span className="text-4xl sm:text-5xl font-light text-foreground">{stat.value}</span>
                        {stat.suffix && <span className="text-sm text-muted-foreground ml-1">{stat.suffix}</span>}
                      </div>
                      <h3 className="text-base sm:text-lg text-foreground font-medium">{stat.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                  </div>
                </article>
              </AnimatedItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
