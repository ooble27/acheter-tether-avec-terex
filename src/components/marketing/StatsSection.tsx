import { TrendingUp, Users, Globe, Shield } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+",
    suffix: "CFA",
    label: "Volume mensuel",
    description: "Traités chaque mois sur notre plateforme",
    trend: "+45%"
  },
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Utilisateurs actifs",
    description: "Font confiance à Terex au quotidien",
    trend: "+120%"
  },
  {
    icon: Globe,
    value: "6",
    suffix: "pays",
    label: "Pays couverts",
    description: "Présents en Afrique de l'Ouest",
    trend: "+2"
  },
  {
    icon: Shield,
    value: "99.9",
    suffix: "%",
    label: "Disponibilité",
    description: "Uptime garanti 24h/24, 7j/7",
    trend: "24/7"
  }
];

export function StatsSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terex-accent/[0.02] to-transparent" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <span className="text-terex-accent text-xs tracking-[0.3em] uppercase mb-6 block">En chiffres</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-5">
            Une plateforme en <span className="text-terex-accent">croissance</span>
          </h2>
          <div className="w-12 h-px bg-terex-accent/40 mx-auto" />
        </AnimatedSection>
        
        {/* Horizontal stat items - editorial style */}
        <div className="space-y-0 divide-y divide-white/[0.06]">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[60px_1fr_200px_auto] items-center gap-4 sm:gap-8 py-6 sm:py-8 hover:bg-white/[0.02] transition-all duration-300 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl cursor-default">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-terex-accent/10 flex items-center justify-center group-hover:bg-terex-accent/20 transition-colors duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-terex-accent" />
                  </div>
                  
                  {/* Label + description */}
                  <div className="min-w-0">
                    <h3 className="text-white text-sm sm:text-base font-medium">{stat.label}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm font-light mt-0.5 hidden sm:block">{stat.description}</p>
                  </div>
                  
                  {/* Value - large */}
                  <div className="text-right sm:text-left">
                    <span className="text-2xl sm:text-4xl font-light text-white tabular-nums">{stat.value}</span>
                    {stat.suffix && (
                      <span className="text-xs sm:text-sm text-gray-500 ml-1">{stat.suffix}</span>
                    )}
                  </div>
                  
                  {/* Trend badge - hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-1 text-xs text-terex-accent bg-terex-accent/10 px-2.5 py-1 rounded-full">
                    <span>{stat.trend}</span>
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
