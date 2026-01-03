
import usdtLogo from '@/assets/usdt-logo.png';

const networks = [
  { 
    name: 'Tron (TRC20)', 
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
    popular: true
  },
  { 
    name: 'BSC (BEP20)', 
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    popular: true
  },
  { 
    name: 'Ethereum (ERC20)', 
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    popular: false
  },
  { 
    name: 'Polygon', 
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    popular: false
  },
  { 
    name: 'Solana', 
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    popular: false
  },
  { 
    name: 'Aptos', 
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
    popular: false
  }
];

export function NetworksSection() {
  return (
    <section className="py-24 lg:py-32 bg-terex-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terex-accent/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-terex-accent text-sm uppercase tracking-[0.2em] mb-4">
            Multi-réseaux
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 max-w-4xl mx-auto">
            Nous supportons les{' '}
            <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">
              réseaux blockchain
            </span>
            {' '}que vous connaissez
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - USDT central */}
          <div className="flex flex-col items-center">
            {/* USDT Logo with orbit effect */}
            <div className="relative mb-10">
              {/* Orbit rings */}
              <div className="absolute inset-0 -m-8 border border-terex-accent/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-0 -m-16 border border-terex-accent/5 rounded-full animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
              <div className="absolute inset-0 -m-24 border border-dashed border-terex-accent/5 rounded-full" />
              
              {/* Glow */}
              <div className="absolute inset-0 bg-terex-accent/20 blur-3xl scale-150" />
              
              <img 
                src={usdtLogo} 
                alt="USDT" 
                className="relative w-32 h-32 sm:w-40 sm:h-40 animate-float"
              />
            </div>
            
            <p className="text-white text-xl sm:text-2xl text-center leading-relaxed max-w-md">
              <span className="text-terex-accent font-medium">USDT</span> est une cryptomonnaie 
              stable adossée au dollar américain.{' '}
              <span className="text-terex-accent">1 USDT = 1 USD</span>
            </p>
          </div>
          
          {/* Right - Network logos */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {networks.map((network, index) => (
              <div 
                key={index}
                className="group relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-terex-accent/20 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-terex-accent/5 opacity-0 group-hover:opacity-100 blur-xl rounded-2xl transition-opacity duration-500" />
                
                {/* Logo */}
                <div className="relative">
                  <img 
                    src={network.logo} 
                    alt={network.name}
                    className="w-12 h-12 rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                  {network.popular && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-terex-accent rounded-full animate-pulse" />
                  )}
                </div>
                
                {/* Name */}
                <span className="relative text-white text-sm sm:text-base group-hover:text-terex-accent transition-colors duration-300">
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
