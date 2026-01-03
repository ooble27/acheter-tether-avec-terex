import usdtLogo from '@/assets/usdt-logo.png';

export function NetworksSection() {
  const networks = [
    { 
      name: 'Tron (TRC20)', 
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png'
    },
    { 
      name: 'BSC (BEP20)', 
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
    },
    { 
      name: 'Ethereum (ERC20)', 
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
    },
    { 
      name: 'Polygon', 
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
    },
    { 
      name: 'Solana', 
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'
    },
    { 
      name: 'Aptos', 
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gray-50 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 text-center mb-16">
          Nous supportons les <span className="text-terex-accent">réseaux blockchain</span> que vous connaissez
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left side - USDT Logo */}
          <div className="flex justify-center lg:justify-start lg:pl-12">
            <div className="relative flex flex-col items-center">
              <img 
                src={usdtLogo} 
                alt="USDT" 
                className="w-32 h-32 sm:w-40 sm:h-40 mb-8"
              />
              <p className="text-gray-600 text-lg sm:text-xl font-light text-center leading-relaxed max-w-md">
                <span className="font-medium text-terex-accent">USDT</span> est une cryptomonnaie stable adossée au dollar américain. <span className="whitespace-nowrap">1 USDT = 1 USD</span>
              </p>
            </div>
          </div>
          
          {/* Right side - Network logos */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {networks.map((network, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <img 
                  src={network.logo} 
                  alt={network.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
                <span className="text-gray-900 text-sm sm:text-base font-medium">
                  {network.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
