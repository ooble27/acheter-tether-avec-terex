
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
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
    <div className="bg-terex-dark min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-terex-accent rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-terex-accent rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-16 w-3 h-3 bg-terex-accent/50 rounded-full animate-pulse opacity-30" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-64 left-1/3 w-1 h-1 bg-terex-accent rounded-full animate-pulse opacity-50" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-terex-accent/40 rounded-full animate-pulse opacity-40" style={{animationDelay: '1.5s'}}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-1/4 w-20 h-20 border border-terex-accent/20 rotate-45 animate-spin opacity-10" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 border border-terex-accent/15 rotate-12 animate-spin opacity-10" style={{animationDuration: '25s', animationDirection: 'reverse'}}></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-terex-accent/5 via-terex-accent/10 to-transparent rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-terex-accent/8 via-transparent to-terex-accent/5 rounded-full blur-3xl animate-pulse opacity-20" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div className="text-center">
          {/* Logo et titre principal - masqués si l'utilisateur est connecté */}
          {!user && (
            <>
              <div className="flex justify-center items-center space-x-4 mb-8">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-terex-accent/20 via-terex-accent/10 to-terex-accent/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60"></div>
                  <img 
                    src="/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png" 
                    alt="Terex Logo" 
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                    loading="eager"
                    style={{
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                  />
                </div>
                <div className="relative">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-terex-accent via-terex-accent/80 to-terex-accent bg-clip-text text-transparent animate-pulse">
                      TEREX
                    </span>
                  </h1>
                  <div className="absolute -inset-2 bg-gradient-to-r from-terex-accent/10 to-transparent blur-sm opacity-30 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-center items-center space-x-3 mb-6">
                <div className="w-2 h-2 bg-terex-accent rounded-full animate-bounce"></div>
                <p className="text-lg text-terex-accent/80 font-medium uppercase tracking-wider">
                  Teranga Exchange
                </p>
                <div className="w-2 h-2 bg-terex-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </>
          )}
          
          <div className="relative">
            <h2 className={`text-3xl sm:text-4xl lg:text-6xl font-bold text-white ${user ? 'mb-8 mt-16' : 'mb-6'} leading-tight`}>
              L'échange USDT Tether et les transferts
              <br />
              <span className="text-terex-accent relative">
                vers l'Afrique
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terex-accent/50 to-transparent animate-pulse"></div>
              </span>
            </h2>
            <div className="absolute -top-4 -right-4 hidden lg:block">
              <Sparkles className="w-8 h-8 text-terex-accent/60 animate-spin" style={{animationDuration: '4s'}} />
            </div>
          </div>
          
          <div className="relative">
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Achetez et vendez des USDT facilement, 
              effectuez des transferts d'argent vers l'Afrique instantanément. 
              <span className="text-terex-accent font-semibold">Rapide, sécurisé et sans commission.</span>
            </p>
            
            {/* Decorative elements */}
            <div className="absolute -left-8 top-4 hidden md:block">
              <div className="w-1 h-8 bg-gradient-to-b from-terex-accent to-transparent opacity-50"></div>
            </div>
            <div className="absolute -right-8 bottom-4 hidden md:block">
              <div className="w-1 h-8 bg-gradient-to-t from-terex-accent to-transparent opacity-50"></div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16">
            {user ? (
              <Button 
                onClick={handleDashboard}
                size="lg" 
                className="group bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto relative overflow-hidden"
              >
                <span className="relative z-10">Aller au Dashboard</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            ) : (
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="group bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-6 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto relative overflow-hidden"
              >
                <span className="relative z-10">Commencer maintenant</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            )}
            <Button 
              onClick={handleHowItWorks}
              variant="outline" 
              size="lg"
              className="group border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 px-6 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-64 sm:w-auto mx-auto h-12 sm:h-auto relative overflow-hidden"
            >
              <span className="relative z-10">Voir comment ça marche</span>
              <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/0 via-terex-accent/10 to-terex-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </div>
          
          {/* Enhanced feature cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${user ? 'lg:mt-20' : ''}`}>
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 to-terex-accent/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <Card className="relative bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group rounded-xl">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative">
                    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                      <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                    </svg>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full opacity-75 animate-ping"></div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base group-hover:text-terex-accent transition-colors">Échange USDT Tether</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Achetez et vendez vos USDT au meilleur taux</p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">Taux en temps réel</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-terex-accent/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <Card className="relative bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group rounded-xl">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative">
                    <Globe className="w-6 h-6 text-terex-accent group-hover:rotate-12 transition-transform duration-300" />
                    <div className="absolute -inset-2 border-2 border-terex-accent/20 rounded-full animate-spin opacity-50" style={{animationDuration: '8s'}}></div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base group-hover:text-terex-accent transition-colors">Transferts vers l'Afrique</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Transférez de l'argent partout en Afrique</p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
                    <span className="text-xs text-terex-accent font-medium">25+ pays</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group relative sm:col-span-2 lg:col-span-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-terex-accent/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <Card className="relative bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-300 hover:scale-105 group rounded-xl">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative">
                    <Shield className="w-6 h-6 text-terex-accent group-hover:rotate-6 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-green-500/10 rounded-lg animate-pulse"></div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base group-hover:text-terex-accent transition-colors">100% Sécurisé</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Chiffrement 256-bit et conformité réglementaire</p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-500 font-medium">Certifié ISO</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
