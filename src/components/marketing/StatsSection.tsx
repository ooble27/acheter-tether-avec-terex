import { TrendingUp, Users, Globe, Shield } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+",
    suffix: "CFA",
    label: "Volume traité mensuellement",
    description: "Transactions sécurisées chaque mois",
    color: "from-emerald-400 to-teal-500"
  },
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Utilisateurs actifs",
    description: "Nous font confiance pour leurs échanges",
    color: "from-blue-400 to-indigo-500"
  },
  {
    icon: Globe,
    value: "5",
    suffix: "pays",
    label: "Pays couverts",
    description: "Transferts vers l'Afrique disponibles",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Shield,
    value: "99.9",
    suffix: "%",
    label: "Taux de disponibilité",
    description: "Service fiable et sécurisé",
    color: "from-amber-400 to-orange-500"
  }
];

export function StatsSection() {
  return (
    <section className="py-24 bg-terex-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-terex-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Une plateforme de confiance <span className="text-terex-accent">en croissance</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Terex démarre avec des bases solides pour servir la communauté africaine
          </p>
        </AnimatedSection>
        
        {/* Horizontal scrolling stats - Desktop */}
        <div className="hidden md:flex items-stretch justify-center gap-0">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const isFirst = index === 0;
            const isLast = index === stats.length - 1;
            
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group relative flex flex-col items-center px-10 py-8">
                  {/* Connecting line between items */}
                  {!isLast && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-terex-gray/30 to-transparent" />
                  )}
                  
                  {/* Floating icon */}
                  <div className={`relative mb-6`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity`} />
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-xl`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Value with animated underline */}
                  <div className="relative mb-4">
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className={`text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-xl text-gray-400 font-light">{stat.suffix}</span>
                      )}
                    </div>
                    <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${stat.color} transition-all duration-500 mx-auto mt-2`} />
                  </div>
                  
                  <h3 className="text-sm font-medium text-white mb-1 text-center">{stat.label}</h3>
                  <p className="text-xs text-gray-500 font-light text-center max-w-[140px]">{stat.description}</p>
                </div>
              </AnimatedItem>
            );
          })}
        </div>
        
        {/* Mobile: Circular/radial layout */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              
              return (
                <AnimatedItem key={index} index={index}>
                  <div className="group relative text-center">
                    {/* Background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-2xl transition-opacity duration-300`} />
                    
                    <div className="relative py-6">
                      {/* Circular progress-like design */}
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        {/* Outer ring */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.color} opacity-20`} />
                        <div className="absolute inset-1 rounded-full bg-terex-dark" />
                        
                        {/* Inner content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-0.5 justify-center mb-2">
                        <span className={`text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                          {stat.value}
                        </span>
                        {stat.suffix && (
                          <span className="text-sm text-gray-400">{stat.suffix}</span>
                        )}
                      </div>
                      
                      <h3 className="text-xs font-medium text-white">{stat.label}</h3>
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
