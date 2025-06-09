
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Globe, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleHowItWorks = () => {
    // Scroll to "Comment ça marche" section
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-terex-darker to-terex-dark min-h-screen">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(94,234,212,0.02)_50%,transparent_50%)] bg-[length:20px_20px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(94,234,212,0.02)_50%,transparent_50%)] bg-[length:20px_20px]"></div>
      
      {/* Floating USDT logos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-12 h-12 opacity-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-full h-full" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 opacity-10 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-full h-full" />
        </div>
        <div className="absolute bottom-1/3 left-1/6 w-10 h-10 opacity-10 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}>
          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-full h-full" />
        </div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-terex-accent/30 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-terex-accent/40 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-terex-accent/20 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center">
          {/* Logo et titre principal avec effets blockchain */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl shadow-2xl"
              />
              <div className="absolute -inset-3 bg-gradient-to-r from-terex-accent/30 via-terex-accent/10 to-transparent rounded-xl blur-lg opacity-60 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-xl"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-terex-accent via-terex-accent/80 to-terex-accent bg-clip-text text-transparent animate-pulse">
                TEREX
              </span>
            </h1>
          </div>
          
          <div className="flex justify-center items-center space-x-3 mb-6">
            <p className="text-lg text-terex-accent/80 font-medium uppercase tracking-wider">
              Teranga Exchange
            </p>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            L'échange crypto et les virements
            <br />
            <span className="text-terex-accent relative">
              sans frontières
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-terex-accent/50 via-terex-accent to-terex-accent/50 rounded-full"></div>
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Achetez et vendez des <span className="text-terex-accent font-semibold">USDT (Tether)</span> facilement, 
            effectuez des virements internationaux instantanés. Rapide, sécurisé et sans commission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105"
            >
              Commencer maintenant
            </Button>
            <Button 
              onClick={handleHowItWorks}
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg rounded-xl backdrop-blur-sm"
            >
              Voir comment ça marche
            </Button>
          </div>
          
          {/* Cartes des fonctionnalités avec USDT prominents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Échange USDT</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Achetez et vendez vos USDT au meilleur taux</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Virements internationaux</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Transférez de l'argent partout dans le monde</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Instantané</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Transactions rapides en 3-5 minutes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">100% Sécurisé</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Chiffrement 256-bit et conformité réglementaire</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
