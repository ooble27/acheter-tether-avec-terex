import { TrendingUp, Users, Globe, Shield } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+",
    suffix: "CFA",
    label: "Volume mensuel",
  },
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Utilisateurs actifs",
  },
  {
    icon: Globe,
    value: "5",
    suffix: "pays",
    label: "Pays couverts",
  },
  {
    icon: Shield,
    value: "99.9",
    suffix: "%",
    label: "Disponibilité",
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-terex-dark relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#3B968F 1px, transparent 1px),
                          linear-gradient(90deg, #3B968F 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection className="text-center mb-16">
          <span className="text-terex-accent text-sm tracking-[0.2em] uppercase mb-4 block">En chiffres</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4">
            Une plateforme en <span className="text-terex-accent">croissance</span>
          </h2>
        </AnimatedSection>
        
        {/* Desktop: Inline with separator dots */}
        <div className="hidden md:block">
          <AnimatedSection>
            <div className="flex items-center justify-center">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const isLast = index === stats.length - 1;
                
                return (
                  <AnimatedItem key={index} index={index}>
                    <div className="flex items-center">
                      <div className="group text-center px-8 lg:px-12">
                        {/* Icon with subtle background */}
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-terex-accent/10 border border-terex-accent/20 mb-4 group-hover:bg-terex-accent/20 transition-colors">
                          <IconComponent className="w-5 h-5 text-terex-accent" />
                        </div>
                        
                        {/* Value */}
                        <div className="mb-2">
                          <span className="text-4xl lg:text-5xl font-light text-terex-accent">{stat.value}</span>
                          {stat.suffix && (
                            <span className="text-lg text-gray-400 ml-1 font-light">{stat.suffix}</span>
                          )}
                        </div>
                        
                        <span className="text-sm text-gray-400 font-light">{stat.label}</span>
                      </div>
                      
                      {/* Separator dot */}
                      {!isLast && (
                        <div className="w-1.5 h-1.5 rounded-full bg-terex-accent/30" />
                      )}
                    </div>
                  </AnimatedItem>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
        
        {/* Mobile: 2x2 grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              
              return (
                <AnimatedItem key={index} index={index}>
                  <div className="group text-center py-6 px-4 rounded-2xl bg-terex-darker/50 border border-terex-accent/10">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-terex-accent/10 mb-3">
                      <IconComponent className="w-4 h-4 text-terex-accent" />
                    </div>
                    
                    <div className="mb-1">
                      <span className="text-2xl font-light text-terex-accent">{stat.value}</span>
                      {stat.suffix && (
                        <span className="text-xs text-gray-400 ml-1">{stat.suffix}</span>
                      )}
                    </div>
                    
                    <span className="text-xs text-gray-400 font-light">{stat.label}</span>
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
