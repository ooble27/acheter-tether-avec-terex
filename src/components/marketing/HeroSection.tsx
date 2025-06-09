
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
    <div className="bg-terex-dark min-h-screen">
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
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-3 text-sm sm:text-base rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto"
            >
              Commencer maintenant
            </Button>
            <Button 
              onClick={handleHowItWorks}
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-6 py-3 text-sm sm:text-base rounded-xl backdrop-blur-sm w-full sm:w-auto"
            >
              Voir comment ça marche
            </Button>
          </div>
          
          {/* Cartes des fonctionnalités */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {/* Logo USDT intégré en SVG */}
                  <svg className="w-6 h-6" viewBox="0 0 339 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M169.5 0L339 295H0L169.5 0Z" fill="#50AF95"/>
                    <path d="M169.5 65L169.5 230" stroke="#FFFFFF" strokeWidth="8"/>
                    <path d="M169.5 65L240 185" stroke="#FFFFFF" strokeWidth="8"/>
                    <path d="M169.5 65L99 185" stroke="#FFFFFF" strokeWidth="8"/>
                    <circle cx="169.5" cy="147.5" r="50" fill="#FFFFFF"/>
                    <text x="169.5" y="157" textAnchor="middle" fill="#50AF95" fontSize="20" fontWeight="bold">₮</text>
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Échange USDT Tether</h3>
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
            
            <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group sm:col-span-2 lg:col-span-1">
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
