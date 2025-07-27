
import { ArrowRightLeft, Shield, Clock, Zap, Users, Globe } from 'lucide-react';

export function TwitterBanner() {
  return (
    <div className="w-[1500px] h-[500px] bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-12 right-12 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 left-12 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* Floating coins */}
      <div className="absolute top-16 right-32 w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent-light rounded-full flex items-center justify-center shadow-lg">
        <ArrowRightLeft className="w-8 h-8 text-white" />
      </div>
      <div className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <Globe className="w-6 h-6 text-white" />
      </div>
      <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
        <Shield className="w-5 h-5 text-white" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 h-full flex items-center justify-between px-16">
        {/* Left section - QR Code */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-2xl p-4 shadow-xl">
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-8 gap-1">
                {/* QR Code pattern simulation */}
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 ${
                      Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 text-black font-semibold text-sm">
            Scanner pour télécharger
          </div>
        </div>

        {/* Center section - Main content */}
        <div className="flex-1 text-center px-8">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-12 h-12 rounded-xl shadow-lg"
              />
              <h1 className="text-2xl font-black text-black tracking-tight">TEREX</h1>
            </div>
          </div>

          <h2 className="text-5xl font-black text-black mb-2 leading-tight">
            Obtenez l'App
          </h2>
          <h3 className="text-5xl font-black text-black mb-8 leading-tight">
            Terex
          </h3>

          {/* App Store buttons */}
          <div className="flex justify-center space-x-4">
            <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg">
              <div className="text-xs">
                <div className="text-gray-300">Télécharger sur l'</div>
                <div className="font-semibold">App Store</div>
              </div>
            </div>
            <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg">
              <div className="text-xs">
                <div className="text-gray-300">Disponible sur</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex justify-center space-x-6 mt-8">
            <div className="text-center">
              <div className="text-black font-bold text-lg">Échange USDT</div>
              <div className="text-black/70 text-sm">Instantané</div>
            </div>
            <div className="text-center">
              <div className="text-black font-bold text-lg">6 Pays</div>
              <div className="text-black/70 text-sm">Disponible</div>
            </div>
            <div className="text-center">
              <div className="text-black font-bold text-lg">24/7</div>
              <div className="text-black/70 text-sm">Support</div>
            </div>
          </div>
        </div>

        {/* Right section - Phone mockup */}
        <div className="relative">
          <div className="w-48 h-80 bg-black rounded-3xl p-2 shadow-2xl">
            <div className="w-full h-full bg-gray-900 rounded-2xl relative overflow-hidden">
              {/* Phone screen content */}
              <div className="absolute top-0 left-0 w-full h-8 bg-gray-800 rounded-t-2xl"></div>
              
              {/* App content */}
              <div className="p-4 mt-8">
                <div className="text-white text-sm font-semibold mb-4">TEREX</div>
                
                <div className="space-y-3">
                  <div className="bg-terex-accent/20 rounded-lg p-3">
                    <div className="text-terex-accent font-bold text-lg">16,530</div>
                    <div className="text-gray-400 text-xs">USDT Balance</div>
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-3">
                    <div className="text-blue-400 font-bold">Acheter USDT</div>
                    <div className="text-gray-400 text-xs">avec Mobile Money</div>
                  </div>
                  
                  <div className="bg-green-500/20 rounded-lg p-3">
                    <div className="text-green-400 font-bold">Vendre USDT</div>
                    <div className="text-gray-400 text-xs">Conversion rapide</div>
                  </div>
                  
                  <div className="bg-orange-500/20 rounded-lg p-3">
                    <div className="text-orange-400 font-bold">Transferts</div>
                    <div className="text-gray-400 text-xs">Internationaux</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom contact */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="text-black/80 text-sm font-medium">
          📧 lomohamed834@gmail.com • L'Afrique connectée au monde digital
        </div>
      </div>
    </div>
  );
}
