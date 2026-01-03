
import { UnifiedConverter } from '../UnifiedConverter';
import { TrendingUp } from 'lucide-react';

export function CurrencyConverterSection() {
  return (
    <section className="py-24 lg:py-32 bg-terex-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-terex-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-terex-teal/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terex-accent/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-terex-accent/20">
              <TrendingUp className="w-5 h-5 text-terex-accent" />
            </div>
            <img 
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
              alt="USDT" 
              className="w-10 h-10"
            />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            Découvrez nos{' '}
            <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
              taux en temps réel
            </span>
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Utilisez nos convertisseurs pour connaître instantanément nos taux USDT et virements internationaux
          </p>
        </div>
        
        <UnifiedConverter />
      </div>
    </section>
  );
}
