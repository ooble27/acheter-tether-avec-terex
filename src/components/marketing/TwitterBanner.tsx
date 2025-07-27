
import { Globe, ArrowRightLeft, Shield, Clock, Zap, Users } from 'lucide-react';

export function TwitterBanner() {
  return (
    <div className="w-[1500px] h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(59,150,143,0.3)_0%,_transparent_50%)]"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-terex-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 h-full flex items-center justify-between px-20">
        {/* Left section - Logo and branding */}
        <div className="flex items-center space-x-12">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-20 h-20 rounded-2xl shadow-2xl border-2 border-terex-accent/30"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tight">TEREX</h1>
              <p className="text-terex-accent text-xl font-semibold tracking-wide">DIGITAL FINANCE</p>
            </div>
          </div>

          <div className="h-24 w-px bg-gradient-to-b from-transparent via-terex-accent to-transparent"></div>

          <div className="max-w-lg">
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              L'Afrique connectée au<br />
              <span className="text-terex-accent">monde digital</span>
            </h2>
            <p className="text-gray-300 text-lg font-medium">
              Échange USDT • Transferts internationaux • Support 24/7
            </p>
          </div>
        </div>

        {/* Right section - Features and CTA */}
        <div className="text-right space-y-8">
          {/* Stats */}
          <div className="flex items-center space-x-8 justify-end">
            <div className="text-center">
              <div className="text-3xl font-bold text-terex-accent">6</div>
              <div className="text-sm text-gray-400 font-medium">PAYS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-terex-accent">24/7</div>
              <div className="text-sm text-gray-400 font-medium">SUPPORT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-terex-accent">100%</div>
              <div className="text-sm text-gray-400 font-medium">SÉCURISÉ</div>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3 max-w-sm ml-auto">
            <div className="flex items-center space-x-2 text-white bg-white/5 rounded-lg p-3 backdrop-blur-sm">
              <div className="w-8 h-8 bg-terex-accent rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold">Échange USDT</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white bg-white/5 rounded-lg p-3 backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold">Multi-pays</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white bg-white/5 rounded-lg p-3 backdrop-blur-sm">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold">Sécurisé</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white bg-white/5 rounded-lg p-3 backdrop-blur-sm">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold">Instantané</span>
            </div>
          </div>

          {/* Contact and CTA */}
          <div className="space-y-4">
            <div className="text-gray-300 text-base font-medium">
              📧 lomohamed834@gmail.com
            </div>
            
            <div className="flex items-center space-x-4 justify-end">
              <div className="bg-gradient-to-r from-terex-accent to-terex-accent-light text-black px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow">
                Commencer maintenant →
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">+10k utilisateurs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-terex-accent via-blue-500 to-terex-accent-light"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-8 right-8 w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
  );
}
