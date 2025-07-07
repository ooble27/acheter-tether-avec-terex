
import { CurrencyConverter } from '../CurrencyConverter';

export function CurrencyConverterSection() {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Découvrez nos <span className="text-terex-accent">taux en temps réel</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Utilisez notre convertisseur pour connaître instantanément nos taux d'achat et de vente USDT
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <CurrencyConverter />
        </div>
      </div>
    </section>
  );
}
