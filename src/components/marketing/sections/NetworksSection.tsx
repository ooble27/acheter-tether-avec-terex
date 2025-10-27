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
    <section className="py-16 sm:py-24 bg-terex-dark relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white text-center mb-16">
          Nous supportons les <span className="text-terex-accent">réseaux blockchain</span> que vous connaissez
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - USDT Circle */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Orange circle */}
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-terex-accent flex flex-col items-center justify-center p-8 shadow-2xl">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                  alt="USDT" 
                  className="w-16 h-16 sm:w-20 sm:h-20 mb-6"
                />
                <p className="text-white text-lg sm:text-xl font-light text-center leading-relaxed">
                  <span className="font-semibold">USDT</span> est une cryptomonnaie stable indexée 1:1 sur le dollar américain
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Network logos */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            {networks.map((network, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-terex-gray/30 hover:bg-terex-gray/50 transition-all duration-300 hover:scale-105"
              >
                <img 
                  src={network.logo} 
                  alt={network.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
                <span className="text-white text-sm sm:text-base font-medium">
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
