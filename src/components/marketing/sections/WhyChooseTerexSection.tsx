import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const advantages = [
  {
    icon: TrendingDown,
    title: "Taux compétitifs",
    description: "Les meilleurs taux de change du marché ouest-africain. Économisez jusqu'à 70% sur les frais.",
    stat: "-70%",
    statLabel: "de frais",
    accent: true,
  },
  {
    icon: Clock,
    title: "Transferts instantanés",
    description: "Vos transactions traitées et confirmées en moins de 5 minutes, 24h/24.",
    stat: "<5",
    statLabel: "min",
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Protection des données certifiée. Infrastructure blockchain de confiance.",
    stat: "99.9%",
    statLabel: "fiabilité",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Assistance en français disponible à tout moment, partout.",
    stat: "24/7",
    statLabel: "support",
  },
  {
    icon: Smartphone,
    title: "Interface simple",
    description: "Plateforme intuitive pour tous. Trois clics suffisent.",
    stat: "3",
    statLabel: "clics",
  },
  {
    icon: Globe,
    title: "Couverture Afrique",
    description: "Présents dans 6 pays d'Afrique de l'Ouest avec une expertise locale unique.",
    stat: "6",
    statLabel: "pays",
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-16 sm:mb-20">
          <span className="text-terex-accent text-xs tracking-[0.25em] uppercase mb-4 block font-medium">Nos avantages</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight max-w-2xl">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
        </AnimatedSection>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Featured card - spans 8 cols */}
          <AnimatedItem index={0} className="md:col-span-8">
            <div className="group relative h-full rounded-2xl border border-terex-gray/20 p-8 sm:p-10 overflow-hidden hover:border-terex-accent/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-terex-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-terex-accent/10 transition-colors duration-500" />
              <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-terex-accent/10 flex items-center justify-center mb-6">
                    <TrendingDown className="w-6 h-6 text-terex-accent" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium text-foreground mb-3">
                    {advantages[0].title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
                    {advantages[0].description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-5xl sm:text-6xl font-extralight text-terex-accent leading-none">{advantages[0].stat}</span>
                  <span className="text-muted-foreground text-xs block mt-1">{advantages[0].statLabel}</span>
                </div>
              </div>
            </div>
          </AnimatedItem>

          {/* Second card - spans 4 cols */}
          <AnimatedItem index={1} className="md:col-span-4">
            <div className="group h-full rounded-2xl border border-terex-gray/20 p-6 sm:p-8 hover:border-terex-accent/30 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-terex-accent/10 flex items-center justify-center mb-5">
                  <Clock className="w-5 h-5 text-terex-accent" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">{advantages[1].title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{advantages[1].description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-terex-gray/15">
                <span className="text-3xl font-extralight text-terex-accent">{advantages[1].stat}</span>
                <span className="text-muted-foreground text-xs ml-1">{advantages[1].statLabel}</span>
              </div>
            </div>
          </AnimatedItem>

          {/* Row 2: 3 equal cards */}
          {advantages.slice(2).map((adv, i) => {
            const IconComponent = adv.icon;
            return (
              <AnimatedItem key={i + 2} index={i + 2} className="md:col-span-4">
                <div className="group h-full rounded-2xl border border-terex-gray/20 p-6 sm:p-8 hover:border-terex-accent/30 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-terex-accent/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-terex-accent" />
                      </div>
                      <span className="text-2xl font-extralight text-terex-accent">{adv.stat}</span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-terex-accent transition-colors">{adv.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{adv.description}</p>
                  </div>
                </div>
              </AnimatedItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
