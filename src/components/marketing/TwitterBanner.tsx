
import { Globe, ArrowRightLeft, Shield, Clock } from 'lucide-react';

export function TwitterBanner() {
  return (
    <div className="w-[1500px] h-[500px] bg-gradient-to-r from-terex-dark via-terex-darker to-terex-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Geometric shapes */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-terex-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-terex-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-terex-accent/15 rounded-full blur-2xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-terex-accent/20 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-between h-full px-16">
        {/* Left section - Brand and main message */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
              alt="Terex Logo" 
              className="w-16 h-16 rounded-xl shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-white">TEREX</h1>
              <p className="text-terex-accent text-lg font-medium">Digital Finance</p>
            </div>
          </div>

          {/* Vertical separator */}
          <div className="h-20 w-px bg-terex-accent/30"></div>

          {/* Main message */}
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">
              Connecter l'Afrique au monde digital
            </h2>
            <p className="text-gray-300 text-lg">
              Échange USDT • Transferts vers l'Afrique • 24/7
            </p>
          </div>
        </div>

        {/* Right section - Features and contact */}
        <div className="text-right space-y-6">
          {/* Features grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-terex-accent" />
              </div>
              <span className="text-sm font-medium">Échange USDT</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-terex-accent" />
              </div>
              <span className="text-sm font-medium">6 Pays</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-terex-accent" />
              </div>
              <span className="text-sm font-medium">100% Sécurisé</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-terex-accent" />
              </div>
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>

          {/* Contact and CTA */}
          <div className="space-y-3">
            <div className="text-gray-300 text-sm">
              📧 lomohamed834@gmail.com
            </div>
            <div className="bg-terex-accent text-black px-6 py-2 rounded-lg font-bold text-sm inline-block">
              Commencer maintenant
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-terex-accent via-terex-accent-light to-terex-accent"></div>
    </div>
  );
}
