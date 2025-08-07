
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
    <section className="py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez les avantages uniques qui font de Terex la plateforme de référence 
            pour vos échanges USDT et transferts d'argent vers l'Afrique
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div 
                key={index} 
                className="text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-terex-accent" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{advantage.title}</h3>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {advantage.description}
                </p>
                
                <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 py-2 border border-terex-accent/20">
                  <span className="text-terex-accent font-semibold text-sm">{advantage.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to action bottom */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-8 bg-terex-darker/50 border border-terex-gray/30 rounded-2xl px-8 py-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-terex-accent mb-2">+1000</div>
              <div className="text-sm text-gray-400">Clients satisfaits</div>
            </div>
            <div className="w-px h-12 bg-terex-gray/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-terex-accent mb-2">10M+ CFA</div>
              <div className="text-sm text-gray-400">Volume mensuel</div>
            </div>
            <div className="w-px h-12 bg-terex-gray/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-terex-accent mb-2">4.9/5</div>
              <div className="text-sm text-gray-400">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
