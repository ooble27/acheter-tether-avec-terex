
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function HeroSection({ user, onShowDashboard }: HeroSectionProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleDashboard = () => {
    if (onShowDashboard) {
      onShowDashboard();
    }
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
          {/* Logo et titre principal - masqués si l'utilisateur est connecté */}
          {!user && (
            <>
              <div className="flex justify-center items-center space-x-4 mb-8">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                    alt="Terex Logo" 
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl shadow-2xl"
                    loading="eager"
                    fetchPriority="high"
                    style={{
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
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
            </>
          )}
          
          <h2 className={`text-3xl sm:text-4xl lg:text-6xl font-bold text-white ${user ? 'mb-8 mt-16' : 'mb-6'} leading-tight`}>
            L'échange USDT Tether et les transferts
            <br />
            <span className="text-terex-accent relative">
              vers l'Afrique
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Achetez et vendez des USDT facilement, 
            effectuez des transferts d'argent vers l'Afrique instantanément. Rapide, sécurisé et sans commission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16">
            {user ? (
              <Button 
                onClick={handleDashboard}
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto"
              >
                Aller au Dashboard
              </Button>
            ) : (
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto"
              >
                Commencer maintenant
              </Button>
            )}
            <Button 
              onClick={handleHowItWorks}
              variant="outline" 
              size="lg"
              className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-6 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-64 sm:w-auto mx-auto h-12 sm:h-auto"
            >
              Voir comment ça marche
            </Button>
          </div>
          
          {/* Cartes des fonctionnalités - espacées différemment selon l'état de connexion */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${user ? 'lg:mt-20' : ''}`}>
            <Card className="bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {/* Logo USDT correct */}
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                    <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
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
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Transferts vers l'Afrique</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Transférez de l'argent partout en Afrique</p>
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
