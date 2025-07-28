import { UnifiedConverter } from '../UnifiedConverter';
export function CurrencyConverterSection() {
  return <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-8 h-8 mr-3 hidden sm:block" style={{
            filter: 'none'
          }} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Découvrez nos <span className="text-terex-accent">Taux en temps réel</span>
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Utilisez nos convertisseurs pour connaître instantanément nos taux USDT et virements internationaux
          </p>
        </div>
        
        <UnifiedConverter />
      </div>
    </section>;
}