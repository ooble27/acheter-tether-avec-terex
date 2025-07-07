
import { CurrencyConverter } from '../CurrencyConverter';
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react';

export function CurrencyConverterSection() {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-terex-accent/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-terex-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating icons */}
        <div className="absolute top-20 right-20 opacity-10">
          <TrendingUp className="w-8 h-8 text-terex-accent animate-bounce" />
        </div>
        <div className="absolute bottom-32 left-16 opacity-10">
          <BarChart3 className="w-6 h-6 text-terex-accent animate-bounce" style={{animationDelay: '1s'}} />
        </div>
        <div className="absolute top-1/2 right-12 opacity-10">
          <DollarSign className="w-10 h-10 text-terex-accent animate-spin" style={{animationDuration: '6s'}} />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-terex-accent/10 rounded-full px-6 py-3 mb-6 border border-terex-accent/20">
            <TrendingUp className="w-5 h-5 text-terex-accent mr-2 animate-pulse" />
            <span className="text-terex-accent font-medium">Taux en Temps Réel</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 relative">
            Découvrez nos <span className="text-terex-accent relative">
              taux en temps réel
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent/50 to-transparent"></div>
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Utilisez notre convertisseur pour connaître instantanément nos taux d'achat et de vente USDT
          </p>
          
          {/* Stats banner */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent mb-1">0.5%</div>
              <div className="text-sm text-gray-400">Frais minimum</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent mb-1">3-5min</div>
              <div className="text-sm text-gray-400">Temps moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terex-accent mb-1">24/7</div>
              <div className="text-sm text-gray-400">Disponible</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-md mx-auto relative">
          {/* Decorative elements around converter */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-terex-accent/20 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 border-2 border-terex-accent/20 rounded-full animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-terex-accent/10 via-terex-accent/20 to-terex-accent/10 rounded-2xl blur-lg opacity-50"></div>
            <div className="relative z-10">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
