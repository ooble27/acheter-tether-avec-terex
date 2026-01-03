
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, Clock, Shield, Headphones, Smartphone, Globe } from 'lucide-react';

const advantages = [
  {
    icon: TrendingDown,
    title: "Taux compétitifs",
    description: "Les meilleurs taux de change du marché avec des frais transparents et réduits",
    highlight: "Frais jusqu'à 70% moins cher",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    icon: Clock,
    title: "Transferts instantanés",
    description: "Vos transactions USDT et virements internationaux traités en moins de 5 minutes",
    highlight: "Disponible 24h/24",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Plateforme sécurisée avec les plus hauts standards de protection des données",
    highlight: "99.9% de fiabilité",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    icon: Headphones,
    title: "Support client dédié",
    description: "Assistance en français par des experts disponibles 24/7 via chat, email ou téléphone",
    highlight: "Réponse < 30 secondes",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    icon: Smartphone,
    title: "Interface simplifiée",
    description: "Plateforme intuitive conçue pour les utilisateurs débutants comme experts",
    highlight: "3 clics pour transférer",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600"
  },
  {
    icon: Globe,
    title: "Couverture Afrique",
    description: "Spécialisés sur les corridors africains avec une expertise locale unique",
    highlight: "6 pays couverts",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600"
  }
];

export function WhyChooseTerexSection() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Pourquoi choisir <span className="text-terex-accent">Terex</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto font-light">
            Découvrez les avantages uniques qui font de Terex la plateforme de référence 
            pour vos échanges USDT et transferts d'argent vers l'Afrique
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <Card 
                key={index} 
                className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group rounded-2xl"
              >
                <CardContent className="p-8">
                  <div className={`w-14 h-14 ${advantage.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-7 h-7 ${advantage.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{advantage.title}</h3>
                  
                  <p className="text-gray-500 mb-4 leading-relaxed font-light">
                    {advantage.description}
                  </p>
                  
                  <div className="inline-flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                    <span className="text-terex-accent font-medium text-sm">{advantage.highlight}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Stats bottom - Attio style */}
        <div className="text-center mt-16">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-4xl mx-auto shadow-sm">
            {/* Desktop */}
            <div className="hidden md:flex items-center justify-center space-x-12">
              <div className="text-center">
                <div className="text-3xl font-medium text-gray-900 mb-2">+1000</div>
                <div className="text-sm text-gray-500 font-light">Clients satisfaits</div>
              </div>
              <div className="w-px h-12 bg-gray-100"></div>
              <div className="text-center">
                <div className="text-3xl font-medium text-gray-900 mb-2">10M+ CFA</div>
                <div className="text-sm text-gray-500 font-light">Volume mensuel</div>
              </div>
              <div className="w-px h-12 bg-gray-100"></div>
              <div className="text-center">
                <div className="text-3xl font-medium text-gray-900 mb-2">4.9/5</div>
                <div className="text-sm text-gray-500 font-light">Note moyenne</div>
              </div>
            </div>
            
            {/* Mobile */}
            <div className="md:hidden grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-medium text-gray-900 mb-1">+1000</div>
                <div className="text-xs text-gray-500 font-light">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-medium text-gray-900 mb-1">10M+ CFA</div>
                <div className="text-xs text-gray-500 font-light">Volume mensuel</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-medium text-gray-900 mb-1">4.9/5</div>
                <div className="text-xs text-gray-500 font-light">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
