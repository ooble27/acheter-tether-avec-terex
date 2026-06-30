import usdtLogo from '@/assets/usdt-logo.png';
import { AnimatedSection, AnimatedItem } from '@/hooks/useScrollAnimation';

export function NetworksSection() {
  const networks = [
    {
      name: 'Tron',
      sub: 'TRC20',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png'
    },
    {
      name: 'BSC',
      sub: 'BEP20',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
    },
    {
      name: 'Ethereum',
      sub: 'ERC20',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
    },
    {
      name: 'Polygon',
      sub: 'MATIC',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
    },
    {
      name: 'Solana',
      sub: 'SPL',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'
    },
    {
      name: 'Aptos',
      sub: 'APT',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png'
    }
  ];

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: '#141414' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span
            className="block text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Réseaux
          </span>
          <h2
            className="font-bold text-white tracking-tight"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)' }}
          >
            Tous les réseaux blockchain que vous connaissez
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - USDT */}
          <AnimatedSection className="flex justify-center lg:justify-start" direction="left">
            <div
              className="flex flex-col items-center text-center rounded-2xl p-10 w-full max-w-md"
              style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src={usdtLogo}
                alt="USDT"
                className="w-28 h-28 sm:w-32 sm:h-32 mb-8"
              />
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                <span className="font-semibold text-white">USDT</span> est une cryptomonnaie
                stable adossée au dollar américain.{' '}
                <span className="whitespace-nowrap text-white">1 USDT = 1 USD</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Right side - Network cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {networks.map((network, index) => (
              <AnimatedItem key={index} index={index} baseDelay={200}>
                <div
                  className="flex items-center gap-4 p-5 rounded-2xl transition-colors duration-300"
                  style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <img
                      src={network.logo}
                      alt={network.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm sm:text-base font-medium">
                      {network.name}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {network.sub}
                    </span>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
