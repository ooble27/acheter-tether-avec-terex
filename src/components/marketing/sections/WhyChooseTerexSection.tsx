import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const advantages = [
  {
    icon: TrendingDown,
    title: "Taux compétitifs",
    description: "Les meilleurs taux de change du marché",
    stat: "-70%",
    statLabel: "de frais"
  },
  {
    icon: Clock,
    title: "Transferts instantanés",
    description: "Transactions traitées en moins de 5 min",
    stat: "<5",
    statLabel: "min"
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Protection des données certifiée",
    stat: "99.9%",
    statLabel: "fiabilité"
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Assistance en français disponible",
    stat: "24/7",
    statLabel: "support"
  },
  {
    icon: Smartphone,
    title: "Interface simple",
    description: "Plateforme intuitive pour tous",
    stat: "3",
    statLabel: "clics"
  },
  {
    icon: Globe,
    title: "Couverture Afrique",
    description: "Expertise locale unique",
    stat: "6",
    statLabel: "pays"
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="text-terex-accent text-xs tracking-[0.2em] uppercase mb-3 block">Nos avantages</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
        </AnimatedSection>
        
        {/* Grid layout avec cartes compactes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group relative bg-terex-darker/40 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:border-terex-accent/30 transition-all duration-300 hover:bg-terex-darker/60">
                  {/* Header avec icône et stat */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-terex-accent/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-terex-accent" />
                    </div>
                    <div className="text-right">
                      <span className="text-terex-accent text-lg font-semibold leading-none">{advantage.stat}</span>
                      <span className="text-gray-500 text-[10px] block">{advantage.statLabel}</span>
                    </div>
                  </div>
                  
                  {/* Titre et description */}
                  <h3 className="text-sm font-medium text-white mb-1 group-hover:text-terex-accent transition-colors">
                    {advantage.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </AnimatedItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
