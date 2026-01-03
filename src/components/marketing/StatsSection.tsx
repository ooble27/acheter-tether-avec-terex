
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Globe, Shield } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+ CFA",
    label: "Volume traité mensuellement",
    description: "Transactions sécurisées chaque mois",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    icon: Users,
    value: "500+",
    label: "Utilisateurs actifs",
    description: "Nous font confiance pour leurs échanges",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Globe,
    value: "5",
    label: "Pays couverts",
    description: "Transferts vers l'Afrique disponibles",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Taux de disponibilité",
    description: "Service fiable et sécurisé",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600"
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Une plateforme de confiance <span className="text-terex-accent">en croissance</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Terex démarre avec des bases solides pour servir la communauté africaine
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-center rounded-2xl">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <div className="text-4xl font-medium text-gray-900 mb-2">{stat.value}</div>
                  <h3 className="text-lg font-medium text-terex-accent mb-2">{stat.label}</h3>
                  <p className="text-gray-500 text-sm font-light">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Badges de confiance */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-medium text-gray-900 mb-8">Certifié et réglementé</h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-xl px-6 py-3">
              <Shield className="w-5 h-5 text-terex-accent" />
              <span className="text-gray-700 font-light text-sm">SSL 256-bit</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-xl px-6 py-3">
              <Shield className="w-5 h-5 text-terex-accent" />
              <span className="text-gray-700 font-light text-sm">Conformité KYC/AML</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-xl px-6 py-3">
              <Shield className="w-5 h-5 text-terex-accent" />
              <span className="text-gray-700 font-light text-sm">Régulé au Sénégal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
