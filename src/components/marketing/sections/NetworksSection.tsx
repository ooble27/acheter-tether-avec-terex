export function NetworksSection() {
  const networks = [
    { 
      name: 'Tron', 
      subtitle: 'TRC20',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png'
    },
    { 
      name: 'BSC', 
      subtitle: 'BEP20',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
    },
    { 
      name: 'Ethereum', 
      subtitle: 'ERC20',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
    },
    { 
      name: 'Polygon', 
      subtitle: 'MATIC',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
    },
    { 
      name: 'Solana', 
      subtitle: 'SOL',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'
    },
    { 
      name: 'Aptos', 
      subtitle: 'APT',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white text-center mb-20">
          Nous supportons les réseaux que vous <span className="text-terex-accent">connaissez et aimez</span>
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
          {/* Left side - USDT Circle */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-terex-accent flex flex-col items-center justify-center p-8 shadow-2xl">
                <div className="bg-white/10 rounded-full p-6 mb-6">
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                    alt="USDT" 
                    className="w-16 h-16 sm:w-20 sm:h-20"
                  />
                </div>
                <p className="text-white text-base sm:text-lg font-light text-center leading-relaxed max-w-xs">
                  <span className="font-semibold">USDT</span> est une cryptomonnaie stable indexée 1:1 sur le dollar américain
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Network logos */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            {networks.map((network, index) => (
              <div 
                key={index}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-terex-gray/20 border border-terex-gray/30 hover:border-terex-accent/50 hover:bg-terex-gray/30 transition-all duration-300"
              >
                <img 
                  src={network.logo} 
                  alt={network.name}
                  className="w-12 h-12 sm:w-14 sm:h-14"
                />
                <div className="text-center">
                  <p className="text-white text-base sm:text-lg font-medium">
                    {network.name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {network.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
