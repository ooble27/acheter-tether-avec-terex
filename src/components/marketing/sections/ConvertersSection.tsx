
import { CurrencyConverter } from '../CurrencyConverter';
import { InternationalTransferConverter } from '../InternationalTransferConverter';

export function ConvertersSection() {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Découvrez nos <span className="text-terex-accent">services</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Utilisez nos convertisseurs pour connaître instantanément nos taux et frais
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                  alt="USDT" 
                  className="w-6 h-6 mr-2"
                />
                <h3 className="text-xl font-semibold text-white">Trading USDT</h3>
              </div>
              <p className="text-sm text-gray-400">Achetez et vendez des USDT</p>
            </div>
            <CurrencyConverter />
          </div>
          
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Virement International</h3>
              <p className="text-sm text-gray-400">Envoyez de l'argent vers l'Afrique</p>
            </div>
            <InternationalTransferConverter />
          </div>
        </div>
      </div>
    </section>
  );
}
