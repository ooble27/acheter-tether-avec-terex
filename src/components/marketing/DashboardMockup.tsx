
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Users, Globe } from 'lucide-react';

export function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Desktop Frame */}
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-3 shadow-2xl border border-white/20">
        {/* Screen bezel */}
        <div className="w-full bg-terex-darker rounded-xl overflow-hidden">
          {/* Top bar */}
          <div className="h-8 bg-terex-dark flex items-center justify-between px-4 text-xs text-white">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400">Terex Dashboard</span>
            <div className="flex space-x-1">
              <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
              <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 space-y-6 bg-terex-dark min-h-96">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Bonjour, <span className="text-terex-accent">Ahmed</span>
                </h1>
                <p className="text-gray-400">Votre activité aujourd'hui</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-terex-accent">2,450 CAD</div>
                  <div className="text-xs text-gray-400">Solde disponible</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-terex-darker border-terex-gray">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-xl font-bold text-white">1,250</div>
                  <div className="text-xs text-gray-400">USDT Achetés</div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-terex-gray">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-terex-accent" />
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-xl font-bold text-white">850</div>
                  <div className="text-xs text-gray-400">USDT Vendus</div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-terex-gray">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-xl font-bold text-white">15</div>
                  <div className="text-xs text-gray-400">Transferts</div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-terex-gray">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-xl font-bold text-white">95%</div>
                  <div className="text-xs text-gray-400">Satisfaction</div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Area */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Évolution USDT/CAD</h3>
                  <div className="flex items-center space-x-2 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+2.4%</span>
                  </div>
                </div>
                
                {/* Simple Chart Visualization */}
                <div className="h-32 flex items-end space-x-1">
                  {[65, 45, 78, 52, 90, 67, 85, 72, 95, 80, 88, 92].map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${
                        i === 11 ? 'bg-terex-accent' : 'bg-terex-accent/30'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Jan</span>
                  <span>Fév</span>
                  <span>Mar</span>
                  <span>Avr</span>
                  <span>Mai</span>
                  <span>Jun</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
