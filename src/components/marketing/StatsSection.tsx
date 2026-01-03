
import { TrendingUp, Users, Globe, Shield } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: "10M+",
    suffix: "CFA",
    label: "Volume traité",
    description: "Transactions sécurisées"
  },
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Utilisateurs actifs",
    description: "Nous font confiance"
  },
  {
    icon: Globe,
    value: "6",
    suffix: "",
    label: "Pays couverts",
    description: "En Afrique"
  },
  {
    icon: Shield,
    value: "99.9",
    suffix: "%",
    label: "Disponibilité",
    description: "Service fiable"
  }
];

const trustBadges = [
  { icon: Shield, label: "SSL 256-bit" },
  { icon: Shield, label: "Conformité KYC/AML" },
  { icon: Shield, label: "Régulé au Sénégal" }
];

export function StatsSection() {
  return (
    <section className="py-24 lg:py-32 bg-terex-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terex-accent/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terex-accent/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-terex-accent text-sm uppercase tracking-[0.2em] mb-4">
            Nos chiffres
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            Une plateforme de confiance{' '}
            <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
              en croissance
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Terex démarre avec des bases solides pour servir la communauté africaine
          </p>
        </div>
        
        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="group text-center relative"
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-terex-accent/5 opacity-0 group-hover:opacity-100 blur-2xl rounded-3xl transition-opacity duration-500" />
                
                <div className="relative p-8">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-terex-accent/20 to-terex-teal/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-terex-accent" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-5xl lg:text-6xl text-white mb-2">
                    <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    <span className="text-2xl text-gray-400 ml-1">{stat.suffix}</span>
                  </div>
                  
                  {/* Label */}
                  <h3 className="text-lg text-white mb-1">{stat.label}</h3>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 hover:border-terex-accent/20 transition-all duration-300"
              >
                <IconComponent className="w-5 h-5 text-terex-accent" />
                <span className="text-white text-sm">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
