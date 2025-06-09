
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe } from 'lucide-react';
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
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center">
          {/* Logo et titre principal */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl shadow-2xl"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-terex-accent via-terex-accent/80 to-terex-accent bg-clip-text text-transparent">
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
            L'échange USDT Tether et les virements
            <br />
            <span className="text-terex-accent relative">
              sans frontières
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Achetez et vendez des USDT facilement, 
            effectuez des virements internationaux instantanés. Rapide, sécurisé et sans commission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-auto sm:w-auto"
            >
              Commencer maintenant
            </Button>
            <Button 
              onClick={handleHowItWorks}
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl backdrop-blur-sm w-auto sm:w-auto"
            >
              Voir comment ça marche
            </Button>
          </div>
          
          {/* Cartes des fonctionnalités */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="bg-gray-900/60 border-terex-accent/30 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 339 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M206.9 134.9C206.9 134.9 223.4 134.9 239.9 134.9C256.4 134.9 272.9 134.9 272.9 134.9C272.9 134.9 272.9 151.4 272.9 167.9C272.9 184.4 272.9 200.9 272.9 200.9C272.9 200.9 256.4 200.9 239.9 200.9C223.4 200.9 206.9 200.9 206.9 200.9V134.9Z" fill="#50C878"/>
                    <path d="M99.9 134.9C99.9 134.9 116.4 134.9 132.9 134.9C149.4 134.9 165.9 134.9 165.9 134.9C165.9 134.9 165.9 151.4 165.9 167.9C165.9 184.4 165.9 200.9 165.9 200.9C165.9 200.9 149.4 200.9 132.9 200.9C116.4 200.9 99.9 200.9 99.9 200.9V134.9Z" fill="#50C878"/>
                    <text x="169.5" y="175" textAnchor="middle" dominantBaseline="middle" className="fill-white text-xs font-bold">USDT</text>
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Échange USDT Tether</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Achetez et vendez vos USDT au meilleur taux</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/60 border-terex-accent/30 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-terex-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Virements internationaux</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Transférez de l'argent partout dans le monde</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/60 border-terex-accent/30 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 hover:scale-105 group sm:col-span-2 lg:col-span-1">
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
