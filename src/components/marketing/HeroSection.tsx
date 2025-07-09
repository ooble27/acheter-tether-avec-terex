import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InteractiveGlobe3D } from './InteractiveGlobe3D';
import { Globe3D } from './Globe3D';

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
        
        {/* New Hero Layout with 3D Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[700px]">
          
          {/* Left Column - Content */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
                L'échange USDT
                <br />
                <span className="text-terex-accent relative bg-gradient-to-r from-terex-accent to-terex-accent/80 bg-clip-text text-transparent">
                  et les transferts
                </span>
                <br />
                vers l'Afrique
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
                Découvrez l'avenir des échanges USDT Tether et des transferts d'argent vers l'Afrique. 
                Une plateforme révolutionnaire qui connecte le monde entier.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto"
                >
                  Accéder au Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto"
                >
                  Commencer maintenant
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="border-terex-accent/40 text-terex-accent hover:bg-terex-accent/10 px-8 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-full sm:w-auto"
              >
                Comment ça marche
              </Button>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-terex-accent mb-1">24/7</div>
                <div className="text-sm text-gray-400">Support actif</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-terex-accent mb-1">0.1%</div>
                <div className="text-sm text-gray-400">Frais réduits</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-terex-accent mb-1">15+</div>
                <div className="text-sm text-gray-400">Pays africains</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - 3D Globe */}
          <div className="order-1 lg:order-2 flex justify-center">
            <Globe3D />
          </div>
        </div>
        
        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          <Card className="group bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-500 hover:scale-105 hover:border-terex-accent/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657" fill="white"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-3 text-lg">Achat USDT</h3>
              <p className="text-gray-400 text-sm">Échangez vos euros contre des USDT Tether au meilleur taux</p>
            </CardContent>
          </Card>
          
          <Card className="group bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-500 hover:scale-105 hover:border-terex-accent/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-3 text-lg">Transferts Afrique</h3>
              <p className="text-gray-400 text-sm">Envoyez de l'argent instantanément vers 15+ pays africains</p>
            </CardContent>
          </Card>
          
          <Card className="group bg-terex-darker/60 border-terex-accent/30 backdrop-blur-sm hover:bg-terex-darker/80 transition-all duration-500 hover:scale-105 hover:border-terex-accent/60 relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-3 text-lg">Sécurité maximale</h3>
              <p className="text-gray-400 text-sm">Vos transactions sont protégées par une sécurité de niveau bancaire</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
