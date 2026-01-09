import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe } from 'lucide-react';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

const advantages = [
  {
    icon: TrendingDown,
    title: "Taux compétitifs",
    description: "Les meilleurs taux de change du marché avec des frais transparents et réduits",
    highlight: "Frais jusqu'à 70% moins cher",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: Clock,
    title: "Transferts instantanés",
    description: "Vos transactions USDT et virements internationaux traités en moins de 5 minutes",
    highlight: "Disponible 24h/24",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Plateforme sécurisée avec les plus hauts standards de protection des données",
    highlight: "99.9% de fiabilité",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Headphones,
    title: "Support client dédié",
    description: "Assistance en français par des experts disponibles 24/7 via chat, email ou téléphone",
    highlight: "Réponse < 30 secondes",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    icon: Smartphone,
    title: "Interface simplifiée",
    description: "Plateforme intuitive conçue pour les utilisateurs débutants comme experts",
    highlight: "3 clics pour transférer",
    gradient: "from-rose-500 to-red-500"
  },
  {
    icon: Globe,
    title: "Couverture Afrique",
    description: "Spécialisés sur les corridors africains avec une expertise locale unique",
    highlight: "6 pays couverts",
    gradient: "from-indigo-500 to-violet-500"
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-20 bg-terex-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Découvrez les avantages uniques qui font de Terex la plateforme de référence 
            pour vos échanges USDT et transferts d'argent vers l'Afrique
          </p>
        </AnimatedSection>
        
        {/* Timeline Design - Desktop */}
        <div className="hidden lg:block relative">
          {/* Central vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-terex-accent/0 via-terex-accent/50 to-terex-accent/0" />
          
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            const isLeft = index % 2 === 0;
            
            return (
              <AnimatedItem key={index} index={index}>
                <div className={`relative flex items-center mb-12 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                  {/* Content */}
                  <div className={`w-5/12 ${isLeft ? 'pr-16 text-right' : 'pl-16 text-left'}`}>
                    <div className={`inline-flex items-center gap-3 mb-3 ${isLeft ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${advantage.gradient} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-medium text-white">{advantage.title}</h3>
                    </div>
                    <p className="text-gray-400 mb-3 font-light leading-relaxed">
                      {advantage.description}
                    </p>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${advantage.gradient} text-white shadow-lg`}>
                      {advantage.highlight}
                    </span>
                  </div>
                  
                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-terex-accent shadow-[0_0_20px_rgba(14,165,233,0.5)]" />
                </div>
              </AnimatedItem>
            );
          })}
        </div>
        
        {/* Accordion/Stacked Design - Mobile & Tablet */}
        <div className="lg:hidden space-y-4">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            
            return (
              <AnimatedItem key={index} index={index}>
                <div className="group relative">
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${advantage.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                  
                  <div className="relative bg-terex-darker/80 backdrop-blur-sm rounded-2xl p-6 border border-terex-gray/20 group-hover:border-transparent transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${advantage.gradient} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-white mb-2">{advantage.title}</h3>
                        <p className="text-gray-400 text-sm font-light leading-relaxed mb-3">
                          {advantage.description}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${advantage.gradient} text-white`}>
                          {advantage.highlight}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            );
          })}
        </div>
        
        {/* Stats banner */}
        <AnimatedSection className="mt-20" delay={400}>
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/10 via-purple-500/10 to-terex-accent/10 rounded-3xl blur-2xl" />
            
            <div className="relative bg-terex-darker/50 backdrop-blur-sm border border-terex-gray/20 rounded-3xl p-8 md:p-10">
              <div className="grid grid-cols-3 gap-8 md:gap-12">
                <div className="text-center group">
                  <div className="text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                    +1000
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-light">Clients satisfaits</div>
                </div>
                
                <div className="text-center relative group">
                  {/* Decorative lines */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-terex-accent/30 to-transparent" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-terex-accent/30 to-transparent" />
                  
                  <div className="text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 group-hover:scale-110 transition-transform">
                    10M+
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-light">Volume CFA/mois</div>
                </div>
                
                <div className="text-center group">
                  <div className="text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2 group-hover:scale-110 transition-transform">
                    4.9/5
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-light">Note moyenne</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
