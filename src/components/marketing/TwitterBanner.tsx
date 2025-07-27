
import { ArrowRightLeft, Shield, Zap, Globe, Users, Clock } from 'lucide-react';

export function TwitterBanner() {
  return (
    <div className="w-[1500px] h-[500px] bg-gradient-to-br from-terex-dark via-terex-darker to-black relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-terex-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-terex-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-terex-accent/20 rounded-full blur-xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-8 h-full">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="bg-terex-accent/30 rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-16 right-32 w-20 h-20 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl backdrop-blur-sm border border-terex-accent/20 flex items-center justify-center">
        <ArrowRightLeft className="w-8 h-8 text-terex-accent" />
      </div>
      <div className="absolute bottom-24 right-20 w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-xl backdrop-blur-sm border border-terex-accent/20 flex items-center justify-center">
        <Shield className="w-6 h-6 text-terex-accent" />
      </div>
      <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-terex-accent/25 to-terex-accent/10 rounded-lg backdrop-blur-sm border border-terex-accent/20 flex items-center justify-center">
        <Globe className="w-5 h-5 text-terex-accent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-12 flex items-center justify-between w-full">
          
          {/* Left section - Brand and message */}
          <div className="flex-1 max-w-2xl">
            {/* Logo and brand */}
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <img 
                  src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                  alt="Terex Logo" 
                  className="w-10 h-10 rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">TEREX</h1>
                <p className="text-terex-accent font-medium text-sm">L'Afrique connectée au monde digital</p>
              </div>
            </div>

            {/* Main message */}
            <div className="mb-8">
              <h2 className="text-5xl font-black text-white mb-2 leading-tight">
                Échangez vos
              </h2>
              <h3 className="text-5xl font-black text-terex-accent mb-4 leading-tight">
                USDT
              </h3>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                La plateforme de référence pour acheter, vendre et transférer des USDT en Afrique
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-terex-accent/10 rounded-xl border border-terex-accent/20 backdrop-blur-sm">
                <Zap className="w-6 h-6 text-terex-accent mx-auto mb-2" />
                <div className="text-white font-bold text-sm">Instantané</div>
                <div className="text-gray-400 text-xs">Transactions rapides</div>
              </div>
              <div className="text-center p-4 bg-terex-accent/10 rounded-xl border border-terex-accent/20 backdrop-blur-sm">
                <Shield className="w-6 h-6 text-terex-accent mx-auto mb-2" />
                <div className="text-white font-bold text-sm">Sécurisé</div>
                <div className="text-gray-400 text-xs">100% fiable</div>
              </div>
              <div className="text-center p-4 bg-terex-accent/10 rounded-xl border border-terex-accent/20 backdrop-blur-sm">
                <Users className="w-6 h-6 text-terex-accent mx-auto mb-2" />
                <div className="text-white font-bold text-sm">24/7</div>
                <div className="text-gray-400 text-xs">Support client</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-terex-accent to-terex-accent/90 hover:from-terex-accent/90 hover:to-terex-accent/80 text-black font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-terex-accent/30">
                Commencer maintenant
              </button>
              <div className="text-gray-400 text-sm">
                📧 lomohamed834@gmail.com
              </div>
            </div>
          </div>

          {/* Right section - Visual elements */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              {/* Main circle */}
              <div className="w-80 h-80 bg-gradient-to-br from-terex-accent/20 to-terex-accent/5 rounded-full backdrop-blur-sm border border-terex-accent/30 flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full backdrop-blur-sm border border-terex-accent/40 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-terex-accent/40 to-terex-accent/20 rounded-full backdrop-blur-sm border border-terex-accent/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-black text-white mb-2">USDT</div>
                      <div className="text-terex-accent font-medium text-lg">Trading</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting elements */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-full flex items-center justify-center shadow-lg">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-full flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-full flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terex-accent to-transparent"></div>
    </div>
  );
}
