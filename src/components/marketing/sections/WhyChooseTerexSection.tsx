
import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe } from 'lucide-react';

const advantages = [
  {
    icon: TrendingDown,
    title: "Taux compétitifs",
    description: "Les meilleurs taux de change du marché avec des frais transparents et réduits",
    highlight: "Frais jusqu'à 70% moins cher"
  },
  {
    icon: Clock,
    title: "Transferts instantanés",
    description: "Vos transactions USDT et virements internationaux traités en moins de 5 minutes",
    highlight: "Disponible 24h/24"
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Chiffrement 256-bit, conformité KYC/AML et régulation BCEAO",
    highlight: "99.9% de fiabilité"
  },
  {
    icon: Headphones,
    title: "Support client dédié",
    description: "Assistance en français par des experts disponibles 24/7 via chat, email ou téléphone",
    highlight: "Réponse < 30 secondes"
  },
  {
    icon: Smartphone,
    title: "Interface simplifiée",
    description: "Plateforme intuitive conçue pour les utilisateurs débutants comme experts",
    highlight: "3 clics pour transférer"
  },
  {
    icon: Globe,
    title: "Couverture Afrique",
    description: "Spécialisés sur les corridors Afrique-Canada avec une expertise locale unique",
    highlight: "6 pays couverts"
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-terex-dark to-terex-darker relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,150,143,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,150,143,0.08)_0%,transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-terex-accent/10 rounded-full px-4 py-2 mb-6 border border-terex-accent/20">
            <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
            <span className="text-terex-accent text-sm font-medium">Pourquoi nous choisir</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            L'excellence au service de vos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-terex-accent-light">
              transferts d'argent
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez une plateforme pensée pour simplifier vos échanges avec l'Afrique, 
            alliant technologie de pointe et service humain exceptionnel
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div 
                key={index} 
                className="group relative"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent rounded-3xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative p-8 text-center">
                  {/* Icon container with floating effect */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-terex-accent/20 via-terex-accent/10 to-transparent rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="w-10 h-10 text-terex-accent" />
                    </div>
                    {/* Floating dots */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-terex-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-terex-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-terex-accent-light transition-colors duration-300">
                    {advantage.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                    {advantage.description}
                  </p>
                  
                  {/* Highlight badge with improved styling */}
                  <div className="inline-flex items-center bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 rounded-full px-6 py-3 border border-terex-accent/20 group-hover:border-terex-accent/40 transition-all duration-300">
                    <div className="w-2 h-2 bg-terex-accent rounded-full mr-3 group-hover:animate-pulse"></div>
                    <span className="text-terex-accent font-semibold text-sm">{advantage.highlight}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Enhanced stats section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-terex-darker/80 via-terex-gray/40 to-terex-darker/80 border border-terex-gray/20 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-terex-accent-light mb-2 group-hover:scale-110 transition-transform">
                  +1000
                </div>
                <div className="text-sm text-gray-400 font-medium">Clients satisfaits</div>
              </div>
              
              <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-terex-gray/30 to-transparent"></div>
              
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-terex-accent-light mb-2 group-hover:scale-110 transition-transform">
                  10M+ CFA
                </div>
                <div className="text-sm text-gray-400 font-medium">Volume mensuel</div>
              </div>
              
              <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-terex-gray/30 to-transparent"></div>
              
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terex-accent to-terex-accent-light mb-2 group-hover:scale-110 transition-transform">
                  4.9/5
                </div>
                <div className="text-sm text-gray-400 font-medium">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
