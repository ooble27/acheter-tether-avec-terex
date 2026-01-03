
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Zap, Smartphone, Headphones, TrendingUp } from 'lucide-react';

const features = [
  {
    id: 'usdt',
    title: 'Échange USDT',
    description: 'Achetez et vendez des USDT instantanément avec les meilleurs taux du marché. Interface simplifiée pour tous les niveaux.',
    icon: TrendingUp,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    size: 'large',
  },
  {
    id: 'transfer',
    title: 'Transferts Internationaux',
    description: 'Envoyez de l\'argent vers l\'Afrique en quelques minutes. Mobile Money, virement bancaire et plus encore.',
    icon: Globe,
    gradient: 'from-pink-500/20 to-purple-500/10',
    iconColor: 'text-pink-400',
    size: 'large',
  },
  {
    id: 'security',
    title: 'Sécurité Maximale',
    description: 'Chiffrement 256-bit, KYC vérifié et protection anti-fraude pour toutes vos transactions.',
    icon: Shield,
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconColor: 'text-blue-400',
    size: 'medium',
  },
  {
    id: 'speed',
    title: 'Rapidité',
    description: 'Transactions traitées en moins de 5 minutes, disponible 24h/24.',
    icon: Zap,
    gradient: 'from-yellow-500/20 to-orange-500/10',
    iconColor: 'text-yellow-400',
    size: 'medium',
  },
  {
    id: 'mobile',
    title: 'Application Mobile',
    description: 'Gérez vos transactions depuis votre smartphone avec notre PWA.',
    icon: Smartphone,
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
    size: 'medium',
  },
  {
    id: 'support',
    title: 'Support 24/7',
    description: 'Assistance en français par des experts disponibles à tout moment.',
    icon: Headphones,
    gradient: 'from-rose-500/20 to-red-500/10',
    iconColor: 'text-rose-400',
    size: 'medium',
  },
];

export function SpiceFeatures() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-6 italic">
            Fonctionnalités clés
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Échange crypto, transferts internationaux, sécurité maximale. 
            Tout ce dont vous avez besoin pour gérer votre argent facilement.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Large cards - first two */}
          {features.slice(0, 2).map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                className={`bg-gradient-to-br ${feature.gradient} border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-300 lg:col-span-1`}
              >
                <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl text-white mb-3 font-medium">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  {/* Decorative element */}
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${feature.iconColor.replace('text-', 'bg-')}`} />
                      <span className="text-xs text-gray-500">En savoir plus →</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Third large card spanning full width on tablet */}
          {(() => {
            const feature = features[2];
            const IconComponent = feature.icon;
            return (
              <Card 
                className={`bg-gradient-to-br ${feature.gradient} border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-300 md:col-span-2 lg:col-span-1`}
              >
                <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl text-white mb-3 font-medium">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${feature.iconColor.replace('text-', 'bg-')}`} />
                      <span className="text-xs text-gray-500">En savoir plus →</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Smaller cards */}
          {features.slice(3).map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                className={`bg-gradient-to-br ${feature.gradient} border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-300`}
              >
                <CardContent className="p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-lg text-white mb-2 font-medium">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
