
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

export function TradingGraphMockup() {
  return (
    <div className="relative mx-auto max-w-2xl">
      {/* Main Container */}
      <div className="bg-gradient-to-br from-terex-darker/80 to-terex-gray/50 rounded-2xl p-6 border border-terex-accent/20 shadow-2xl backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-terex-accent" />
            </div>
            <div>
              <h3 className="text-white font-semibold">USDT/CAD</h3>
              <p className="text-xs text-gray-400">Taux en temps réel</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-terex-accent">1.37</div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+0.05 (3.7%)</span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative h-40 mb-6">
          {/* Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-12 opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-5 opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-white"></div>
            ))}
          </div>

          {/* Chart Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B968F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B968F" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Area under curve */}
            <path
              d="M 0 35 Q 20 30 40 25 T 80 20 L 100 15 V 40 H 0 Z"
              fill="url(#chartGradient)"
            />
            
            {/* Main line */}
            <path
              d="M 0 35 Q 20 30 40 25 T 80 20 L 100 15"
              stroke="#3B968F"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {[
              { x: 0, y: 35 },
              { x: 25, y: 28 },
              { x: 50, y: 22 },
              { x: 75, y: 19 },
              { x: 100, y: 15 }
            ].map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="2"
                fill="#3B968F"
                className="drop-shadow-sm"
              />
            ))}
          </svg>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Haut</span>
            </div>
            <div className="text-white font-semibold">1.42</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-red-400 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">Bas</span>
            </div>
            <div className="text-white font-semibold">1.31</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-terex-accent mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Volume</span>
            </div>
            <div className="text-white font-semibold">2.4M</div>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="flex justify-center space-x-2 mt-6">
          {['1H', '24H', '7D', '30D'].map((period, i) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                i === 1 
                  ? 'bg-terex-accent text-black' 
                  : 'bg-terex-gray text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
