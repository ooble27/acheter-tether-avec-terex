import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const advantages = [
  {
    icon: TrendingDown,
    title: "Taux compétitifs",
    description: "Les meilleurs taux de change du marché avec des frais transparents et réduits",
    stat: "-70%",
    statLabel: "de frais"
  },
  {
    icon: Clock,
    title: "Transferts instantanés",
    description: "Vos transactions USDT et virements internationaux traités en moins de 5 minutes",
    stat: "<5",
    statLabel: "minutes"
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Plateforme sécurisée avec les plus hauts standards de protection des données",
    stat: "99.9%",
    statLabel: "fiabilité"
  },
  {
    icon: Headphones,
    title: "Support client dédié",
    description: "Assistance en français par des experts disponibles 24/7 via chat, email ou téléphone",
    stat: "24/7",
    statLabel: "disponible"
  },
  {
    icon: Smartphone,
    title: "Interface simplifiée",
    description: "Plateforme intuitive conçue pour les utilisateurs débutants comme experts",
    stat: "3",
    statLabel: "clics"
  },
  {
    icon: Globe,
    title: "Couverture Afrique",
    description: "Spécialisés sur les corridors africains avec une expertise locale unique",
    stat: "6",
    statLabel: "pays"
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-24 bg-terex-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-20">
          <span className="text-terex-accent text-sm tracking-[0.2em] uppercase mb-4 block">Nos avantages</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            La plateforme de référence pour vos échanges USDT et transferts vers l'Afrique
          </p>
        </AnimatedSection>
        
        {/* Desktop: Horizontal flowing design with connecting lines */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-x-12 gap-y-16">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              
              return (
                <AnimatedItem key={index} index={index}>
                  <div className="group relative">
                    {/* Top line connecting to icon */}
                    <div className="absolute -top-8 left-8 w-px h-8 bg-gradient-to-b from-transparent to-terex-accent/30" />
                    
                    {/* Icon container with ring */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-terex-darker/80 border border-terex-accent/20 flex items-center justify-center group-hover:border-terex-accent/50 transition-colors duration-300">
                        <IconComponent className="w-7 h-7 text-terex-accent" />
                      </div>
                      
                      {/* Stat badge floating */}
                      <div className="absolute -right-2 -top-2 bg-terex-dark border border-terex-accent/30 rounded-lg px-2 py-1">
                        <span className="text-terex-accent text-sm font-medium">{advantage.stat}</span>
                        <span className="text-gray-500 text-[10px] ml-1">{advantage.statLabel}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-light text-white mb-3 group-hover:text-terex-accent transition-colors">
                      {advantage.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {advantage.description}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className="mt-4 h-px w-12 bg-terex-accent/20 group-hover:w-full group-hover:bg-terex-accent/40 transition-all duration-500" />
                  </div>
                </AnimatedItem>
              );
            })}
          </div>
        </div>
        
        {/* Mobile: Minimal list with accent numbers */}
        <div className="lg:hidden space-y-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group flex gap-4">
                  {/* Number indicator */}
                  <div className="flex-shrink-0 relative">
                    <span className="text-4xl text-terex-accent/10 font-bold">{String(index + 1).padStart(2, '0')}</span>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-terex-darker/80 border border-terex-accent/20 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-terex-accent" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-light">{advantage.title}</h3>
                      <span className="text-terex-accent text-xs bg-terex-accent/10 px-2 py-0.5 rounded-full">
                        {advantage.stat} {advantage.statLabel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {advantage.description}
                    </p>
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
