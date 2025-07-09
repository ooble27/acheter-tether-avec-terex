
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, Globe, ArrowUpRight, Activity, Zap } from 'lucide-react';

export function Dashboard3D() {
  return (
    <div className="relative w-full max-w-lg mx-auto perspective-1000">
      {/* Container 3D avec rotation automatique */}
      <div className="dashboard-3d-container relative w-full h-96 transform-style-3d animate-float-rotate">
        
        {/* Écran principal - Dashboard */}
        <div className="dashboard-screen absolute inset-0 bg-terex-darker/90 backdrop-blur-xl rounded-2xl border border-terex-accent/30 shadow-2xl transform rotateY-10 rotateX-5">
          <div className="p-4 h-full">
            {/* Header du dashboard */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Terex Dashboard</h3>
                  <p className="text-gray-400 text-xs">Trading Platform</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="bg-terex-dark/50 border-terex-gray">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">USDT Prix</p>
                      <p className="text-sm font-bold text-terex-accent animate-pulse">1.00€</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-terex-dark/50 border-terex-gray">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Volume 24h</p>
                      <p className="text-sm font-bold text-white">2.4M€</p>
                    </div>
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graph simulé */}
            <Card className="bg-terex-dark/50 border-terex-gray mb-3">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Trading Chart</p>
                  <ArrowUpRight className="w-3 h-3 text-green-400" />
                </div>
                <div className="h-16 flex items-end space-x-1">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-t from-terex-accent/20 to-terex-accent flex-1 rounded-t animate-grow-bar`}
                      style={{
                        height: `${Math.random() * 70 + 20}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-gradient-to-r from-terex-accent to-terex-accent/80 text-black text-xs font-medium py-2 px-3 rounded-lg hover:scale-105 transition-transform">
                Acheter USDT
              </button>
              <button className="bg-terex-darker border border-terex-accent/30 text-terex-accent text-xs font-medium py-2 px-3 rounded-lg hover:bg-terex-accent/10 transition-colors">
                Vendre USDT
              </button>
            </div>
          </div>
        </div>

        {/* Écran secondaire - Transferts */}
        <div className="dashboard-screen-2 absolute inset-0 bg-terex-dark/80 backdrop-blur-xl rounded-2xl border border-blue-400/30 shadow-xl transform rotateY-25 rotateX-10 translate-z-20 scale-90">
          <div className="p-4 h-full">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold text-sm">Transferts</h3>
                <p className="text-gray-400 text-xs">International</p>
              </div>
            </div>
            <div className="space-y-3">
              {['Sénégal', 'Côte d\'Ivoire', 'Mali'].map((country, i) => (
                <div key={country} className="flex items-center justify-between bg-terex-darker/50 p-2 rounded-lg">
                  <span className="text-white text-xs">{country}</span>
                  <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Particules flottantes USDT */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-terex-accent/20 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div className="w-full h-full bg-terex-accent/40 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-terex-accent/10 rounded-2xl blur-3xl scale-110 animate-pulse -z-10" />
    </div>
  );
}
