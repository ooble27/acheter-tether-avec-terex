import { Card, CardContent } from '@/components/ui/card';
import { Globe, Handshake, Star, Zap, Clock, Shield, Users, Award } from 'lucide-react';

const BitcoinLogo = ({ className }: { className?: string }) => (
  <img src="/bitcoin-logo.png" alt="Bitcoin Logo" className={className} />
);

const TetherLogo = ({ className }: { className?: string }) => (
  <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="Tether Logo" className={className} />
);
export function PhoneMockup() {
  return <div className="relative mx-auto">
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] bg-gradient-to-br from-white/20 to-white/10 rounded-[3rem] p-2 shadow-2xl border border-white/30">
        {/* Screen bezel */}
        <div className="w-full h-full bg-black rounded-[2.5rem] p-1">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20"></div>
          
          {/* Screen content */}
          <div className="w-full h-full bg-terex-dark rounded-[2.2rem] overflow-hidden relative">
            {/* Status bar */}
            <div className="h-8 bg-terex-darker flex items-center justify-between px-4 text-xs text-white">
              <span>9:41</span>
              <div className="flex space-x-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-3 space-y-3 text-xs overflow-y-auto h-full pb-8 scrollbar-hide">
              {/* Header with Bitcoin Logo */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <BitcoinLogo className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white">
                    Bienvenue, <span className="text-terex-accent">Mohamed</span>
                  </h1>
                  <p className="text-gray-400 text-xs text-left">Plateforme USDT</p>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <TetherLogo className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-white text-xs font-medium text-left">Acheter USDT</h3>
                    <p className="text-gray-400 text-xs text-left">Achat rapide</p>
                  </CardContent>
                </Card>

                <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <TetherLogo className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-white text-xs font-medium text-left">Vendre USDT</h3>
                    <p className="text-gray-400 text-xs text-left">Vente rapide</p>
                  </CardContent>
                </Card>

                <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Handshake className="w-3 h-3 text-purple-400" />
                      </div>
                    </div>
                    <h3 className="text-white text-xs font-medium text-left">Trading OTC</h3>
                    <p className="text-gray-400 text-xs text-left">Gros volumes</p>
                  </CardContent>
                </Card>

                <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-6 h-6 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                        <Globe className="w-3 h-3 text-terex-accent" />
                      </div>
                    </div>
                    <h3 className="text-white text-xs font-medium text-left">Virements</h3>
                    <p className="text-gray-400 text-xs text-left">International</p>
                  </CardContent>
                </Card>
              </div>

              {/* Avantages Terex */}
              <Card className="bg-terex-darker border-terex-gray mb-3">
                <CardContent className="p-2">
                  <h3 className="text-white text-xs font-medium mb-2 flex items-center">
                    <Star className="w-3 h-3 mr-1 text-terex-accent" />
                    Avantages Terex
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-terex-accent/20 rounded flex items-center justify-center flex-shrink-0">
                        <Star className="w-2 h-2 text-terex-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs text-left">Frais gratuits</p>
                        <p className="text-gray-400 text-xs text-left">0% de frais</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0">
                        <Zap className="w-2 h-2 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs text-left">Rapide</p>
                        <p className="text-gray-400 text-xs text-left">Instantané</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                        <Clock className="w-2 h-2 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs text-left">24/7</p>
                        <p className="text-gray-400 text-xs text-left">Toujours disponible</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Sécurité et Confiance */}
              <Card className="bg-terex-darker border-terex-gray">
                <CardContent className="p-2">
                  <h3 className="text-white text-xs font-medium mb-2 flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-blue-400" />
                    Sécurité & Confiance
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                        <Shield className="w-2 h-2 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs text-left">Sécurisé</p>
                        <p className="text-gray-400 text-xs text-left">Cryptage SSL</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500/20 rounded flex items-center justify-center flex-shrink-0">
                        <Award className="w-2 h-2 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs text-left">Certifié</p>
                        <p className="text-gray-400 text-xs text-left">Plateforme agréée</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-terex-accent/20 rounded flex items-center justify-center flex-shrink-0">
                        <Users className="w-2 h-2 text-terex-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs text-left">Support</p>
                        <p className="text-gray-400 text-xs text-left">Équipe dédiée</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
      </div>
    </div>;
}
