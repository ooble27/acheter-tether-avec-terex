
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Zap, TrendingUp } from 'lucide-react';
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
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-terex-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div className="text-center">
          {/* Logo et titre principal */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-terex-accent/20 rounded-xl blur-xl"></div>
              <img 
                src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                alt="Terex Logo" 
                className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl shadow-2xl border border-terex-accent/30"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-terex-accent via-white to-terex-accent bg-clip-text text-transparent animate-pulse">
                TEREX
              </span>
            </h1>
          </div>
          
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
            <p className="text-lg text-terex-accent/80 font-medium uppercase tracking-wider">
              Teranga Exchange
            </p>
            <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse delay-300"></div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            L'échange USDT Tether et les virements
            <br />
            <span className="text-terex-accent relative">
              sans frontières
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent to-transparent opacity-50"></div>
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Achetez et vendez des USDT facilement, 
            effectuez des virements internationaux instantanés. 
            <span className="text-terex-accent font-semibold">Rapide, sécurisé et sans commission.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 mr-2" />
              Commencer maintenant
            </Button>
            <Button 
              onClick={handleHowItWorks}
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl backdrop-blur-sm w-full sm:w-auto border-2 hover:border-terex-accent/50"
            >
              Voir comment ça marche
            </Button>
          </div>
          
          {/* Cartes des fonctionnalités modernisées */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="bg-black/60 border-terex-accent/30 backdrop-blur-sm hover:bg-black/80 transition-all duration-300 hover:scale-105 group hover:border-terex-accent/50 border-2">
              <CardContent className="p-4 sm:p-6 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terex-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-terex-accent/20">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    className="text-terex-accent"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568h-2.568V9.568h2.568v8zm-3.568 0H8.432V6.432H14v11.136z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Échange USDT Tether</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Achetez et vendez vos USDT au meilleur taux du marché</p>
                <div className="flex items-center justify-center mt-3">
                  <TrendingUp className="w-4 h-4 text-terex-accent mr-1" />
                  <span className="text-terex-accent text-xs">Taux en temps réel</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-terex-accent/30 backdrop-blur-sm hover:bg-black/80 transition-all duration-300 hover:scale-105 group hover:border-terex-accent/50 border-2">
              <CardContent className="p-4 sm:p-6 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-blue-400/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-blue-400/20">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Virements internationaux</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Transférez de l'argent partout dans le monde en 3-5 minutes</p>
                <div className="flex items-center justify-center mt-3">
                  <Zap className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-xs">Instantané</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-terex-accent/30 backdrop-blur-sm hover:bg-black/80 transition-all duration-300 hover:scale-105 group sm:col-span-2 lg:col-span-1 hover:border-terex-accent/50 border-2">
              <CardContent className="p-4 sm:p-6 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/30 to-green-400/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-green-400/20">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">100% Sécurisé</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Chiffrement 256-bit et conformité réglementaire KYC/AML</p>
                <div className="flex items-center justify-center mt-3">
                  <Shield className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-xs">Certifié</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
