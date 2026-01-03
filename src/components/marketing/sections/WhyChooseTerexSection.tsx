
import { Card, CardContent } from '@/components/ui/card';
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
    description: "Plateforme sécurisée avec les plus hauts standards de protection des données",
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
    description: "Spécialisés sur les corridors africains avec une expertise locale unique",
    highlight: "6 pays couverts"
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Découvrez les avantages uniques qui font de Terex la plateforme de référence 
            pour vos échanges USDT et transferts d'argent vers l'Afrique
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <Card 
                key={index} 
                className="bg-terex-darker/50 border-terex-gray/30 hover:border-terex-accent/30 transition-all duration-300 hover:scale-105 group shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-terex-accent" />
                  </div>
                  
                  <h3 className="text-xl font-light text-white mb-3">{advantage.title}</h3>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed font-light">
                    {advantage.description}
                  </p>
                  
                  <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-4 py-2 border border-terex-accent/20">
                    <span className="text-terex-accent font-light text-sm">{advantage.highlight}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Call to action bottom - version responsive */}
        <div className="text-center mt-16">
          <div className="bg-terex-darker/50 border border-terex-gray/30 rounded-2xl p-6 max-w-4xl mx-auto">
            {/* Version desktop */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-light text-terex-accent mb-2">+1000</div>
                <div className="text-sm text-gray-400 font-light">Clients satisfaits</div>
              </div>
              <div className="w-px h-12 bg-terex-gray/30"></div>
              <div className="text-center">
                <div className="text-3xl font-light text-terex-accent mb-2">10M+ CFA</div>
                <div className="text-sm text-gray-400 font-light">Volume mensuel</div>
              </div>
              <div className="w-px h-12 bg-terex-gray/30"></div>
              <div className="text-center">
                <div className="text-3xl font-light text-terex-accent mb-2">4.9/5</div>
                <div className="text-sm text-gray-400 font-light">Note moyenne</div>
              </div>
            </div>
            
            {/* Version mobile */}
            <div className="md:hidden grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-light text-terex-accent mb-1">+1000</div>
                <div className="text-xs text-gray-400 font-light">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-light text-terex-accent mb-1">10M+ CFA</div>
                <div className="text-xs text-gray-400 font-light">Volume mensuel</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-light text-terex-accent mb-1">4.9/5</div>
                <div className="text-xs text-gray-400 font-light">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
