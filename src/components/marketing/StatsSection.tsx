import { TrendingUp, Users, Globe, Shield } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+",
    suffix: "CFA",
    label: "Volume mensuel",
    trend: "+45%"
  },
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Utilisateurs actifs",
    trend: "+120%"
  },
  {
    icon: Globe,
    value: "6",
    suffix: "pays",
    label: "Pays couverts",
    trend: "+2"
  },
  {
    icon: Shield,
    value: "99.9",
    suffix: "%",
    label: "Disponibilité",
    trend: "24/7"
  }
];

export function StatsSection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4">
            Terex en <span className="text-terex-accent">chiffres</span>
          </h2>
          <p className="text-gray-400 font-light max-w-lg mx-auto">
            Des performances qui témoignent de la confiance de nos utilisateurs
          </p>
        </AnimatedSection>

        {/* Clean horizontal stat rows — no boxes */}
        <div className="space-y-0">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group flex items-center justify-between py-6 sm:py-8 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-200 px-2 sm:px-4 rounded-xl">
                  {/* Left: icon + label */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-terex-accent/10 flex items-center justify-center group-hover:bg-terex-accent/20 transition-colors flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-terex-accent" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-400 font-light">{stat.label}</span>
                  </div>

                  {/* Right: value + trend */}
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="text-right">
                      <span className="text-2xl sm:text-4xl font-light text-white tabular-nums">{stat.value}</span>
                      {stat.suffix && (
                        <span className="text-xs sm:text-sm text-gray-500 ml-1 font-light">{stat.suffix}</span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs text-terex-accent bg-terex-accent/10 px-2 py-1 rounded-full font-medium min-w-[44px] text-center">
                      {stat.trend}
                    </span>
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
