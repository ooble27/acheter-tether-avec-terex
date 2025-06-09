
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Globe, Shield } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+ CFA",
    label: "Volume traité mensuellement",
    description: "Transactions sécurisées chaque mois"
  },
  {
    icon: Users,
    value: "500+",
    label: "Utilisateurs actifs",
    description: "Nous font confiance pour leurs échanges"
  },
  {
    icon: Globe,
    value: "5",
    label: "Pays couverts",
    description: "Transferts vers l'Afrique disponibles"
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Taux de disponibilité",
    description: "Service fiable et sécurisé"
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Une plateforme de confiance <span className="text-terex-accent">en croissance</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Terex démarre avec des bases solides pour servir la communauté africaine
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-terex-darker/50 border-terex-gray/30 hover:border-terex-accent/30 transition-all duration-300 hover:scale-105 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-terex-accent" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <h3 className="text-lg font-semibold text-terex-accent mb-2">{stat.label}</h3>
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Badges de confiance */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Certifié et réglementé</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center space-x-2 bg-terex-darker/50 border border-terex-gray/20 rounded-lg px-6 py-3">
              <Shield className="w-6 h-6 text-terex-accent" />
              <span className="text-white font-medium">SSL 256-bit</span>
            </div>
            <div className="flex items-center space-x-2 bg-terex-darker/50 border border-terex-gray/20 rounded-lg px-6 py-3">
              <Shield className="w-6 h-6 text-terex-accent" />
              <span className="text-white font-medium">Conformité KYC/AML</span>
            </div>
            <div className="flex items-center space-x-2 bg-terex-darker/50 border border-terex-gray/20 rounded-lg px-6 py-3">
              <Shield className="w-6 h-6 text-terex-accent" />
              <span className="text-white font-medium">Régulé au Sénégal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
