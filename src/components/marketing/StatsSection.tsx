import { TrendingUp, Users, Globe, Shield, ArrowUpRight } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+",
    suffix: "CFA",
    label: "Volume mensuel",
    description: "Traités chaque mois",
    trend: "+45%"
  },
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Utilisateurs actifs",
    description: "Font confiance à Terex",
    trend: "+120%"
  },
  {
    icon: Globe,
    value: "6",
    suffix: "pays",
    label: "Pays couverts",
    description: "En Afrique de l'Ouest",
    trend: "+2"
  },
  {
    icon: Shield,
    value: "99.9",
    suffix: "%",
    label: "Disponibilité",
    description: "Uptime garanti",
    trend: "24/7"
  }
];

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="text-terex-accent text-sm tracking-[0.2em] uppercase mb-4 block">En chiffres</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4">
            Une plateforme en <span className="text-terex-accent">croissance</span>
          </h2>
          <p className="text-gray-400 font-light max-w-xl mx-auto">
            Des performances qui témoignent de la confiance de nos utilisateurs
          </p>
        </AnimatedSection>
        
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group relative bg-white/5 border border-terex-gray/20 rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-terex-accent/5 rounded-full blur-2xl group-hover:bg-terex-accent/10 transition-colors" />
                  
                  {/* Trend badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-terex-accent bg-terex-accent/10 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{stat.trend}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-terex-accent" />
                  </div>
                  
                  {/* Value */}
                  <div className="mb-1">
                    <span className="text-3xl sm:text-4xl font-light text-white">{stat.value}</span>
                    {stat.suffix && (
                      <span className="text-sm sm:text-base text-gray-400 ml-1.5 font-light">{stat.suffix}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <h3 className="text-sm sm:text-base text-white font-medium mb-1">{stat.label}</h3>
                  
                  {/* Description - Hidden on mobile */}
                  <p className="hidden sm:block text-xs text-gray-500 font-light">{stat.description}</p>
                </div>
              </AnimatedItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
