
import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe } from 'lucide-react';

const advantages = [
  {
    icon: TrendingDown,
    title: "Taux compétitifs",
    description: "Les meilleurs taux du marché avec des frais transparents",
    highlight: "Jusqu'à 70% moins cher",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: Clock,
    title: "Transferts instantanés",
    description: "Vos transactions traitées en moins de 5 minutes",
    highlight: "24h/24, 7j/7",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Protection de vos données avec les plus hauts standards",
    highlight: "99.9% de fiabilité",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Headphones,
    title: "Support dédié",
    description: "Assistance en français par des experts disponibles 24/7",
    highlight: "Réponse < 30s",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    icon: Smartphone,
    title: "Interface simplifiée",
    description: "Plateforme intuitive pour débutants et experts",
    highlight: "3 clics pour transférer",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Globe,
    title: "Couverture Afrique",
    description: "Spécialisés sur les corridors africains",
    highlight: "6 pays couverts",
    gradient: "from-terex-accent to-terex-teal"
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-24 lg:py-32 bg-terex-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-terex-accent/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-terex-teal/5 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-terex-accent text-sm uppercase tracking-[0.2em] mb-4">
            Nos avantages
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            Pourquoi choisir{' '}
            <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
              Terex
            </span>
            {' '}?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Découvrez ce qui fait de Terex la plateforme de référence 
            pour vos échanges USDT et transferts vers l'Afrique
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-3xl`} />
                
                <div className="relative p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-500 bg-gradient-to-b from-white/[0.02] to-transparent">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${advantage.gradient} p-[1px] mb-6`}>
                    <div className="w-full h-full rounded-2xl bg-terex-dark flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl text-white mb-3 group-hover:text-terex-accent transition-colors duration-300">
                    {advantage.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-5 leading-relaxed">
                    {advantage.description}
                  </p>
                  
                  {/* Highlight tag */}
                  <span className={`inline-block text-sm px-4 py-1.5 rounded-full bg-gradient-to-r ${advantage.gradient} bg-opacity-10 text-white/80`}
                    style={{ background: `linear-gradient(135deg, rgba(59,150,143,0.15), rgba(91,193,184,0.1))` }}
                  >
                    {advantage.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Stats bar */}
        <div className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 lg:gap-24">
          <div className="text-center group">
            <div className="text-5xl lg:text-6xl text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">+1000</span>
            </div>
            <div className="text-gray-500 text-sm uppercase tracking-wider">Clients satisfaits</div>
          </div>
          
          <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-terex-accent/30 to-transparent" />
          
          <div className="text-center group">
            <div className="text-5xl lg:text-6xl text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">10M+</span>
            </div>
            <div className="text-gray-500 text-sm uppercase tracking-wider">CFA traités</div>
          </div>
          
          <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-terex-accent/30 to-transparent" />
          
          <div className="text-center group">
            <div className="text-5xl lg:text-6xl text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">4.9/5</span>
            </div>
            <div className="text-gray-500 text-sm uppercase tracking-wider">Note moyenne</div>
          </div>
        </div>
      </div>
    </section>
  );
}
