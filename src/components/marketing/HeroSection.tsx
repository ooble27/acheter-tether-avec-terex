
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hero3DScene } from './Hero3DScene';

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
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        {/* Layout principal en grid pour desktop, stack pour mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
          
          {/* Colonne de gauche - Contenu textuel */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Badge technologique */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-terex-accent/10 border border-terex-accent/30 backdrop-blur-sm">
              <span className="text-terex-accent text-sm font-semibold">🚀 Powered by Web3 Technology</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              L'échange USDT Tether et les transferts
              <br />
              <span className="text-terex-accent relative bg-gradient-to-r from-terex-accent to-terex-accent-light bg-clip-text text-transparent">
                vers l'Afrique
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Découvrez l'avenir des transferts financiers avec notre plateforme 3D interactive. 
              Achetez et vendez des USDT facilement, effectuez des transferts d'argent vers l'Afrique instantanément. 
              <span className="text-terex-accent font-semibold">Rapide, sécurisé et sans commission.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent/90 hover:to-terex-accent-light/70 text-black font-bold px-8 py-6 text-base sm:text-lg rounded-xl shadow-xl shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto h-auto border-0"
                >
                  ✨ Aller au Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-terex-accent to-terex-accent-light hover:from-terex-accent/90 hover:to-terex-accent-light/70 text-black font-bold px-8 py-6 text-base sm:text-lg rounded-xl shadow-xl shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 w-full sm:w-auto h-auto border-0"
                >
                  🚀 Commencer maintenant
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="border-terex-accent/50 text-terex-accent hover:bg-terex-accent/10 hover:border-terex-accent px-8 py-6 text-base sm:text-lg rounded-xl backdrop-blur-sm w-full sm:w-auto h-auto transition-all duration-300 hover:scale-105"
              >
                🔍 Voir comment ça marche
              </Button>
            </div>
            
            {/* Stats rapides améliorées */}
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div className="p-4 rounded-xl bg-terex-darker/60 border border-terex-accent/20 backdrop-blur-sm">
                <div className="text-2xl font-bold text-terex-accent mb-1">5min</div>
                <div className="text-sm text-gray-400">Transfert rapide</div>
              </div>
              <div className="p-4 rounded-xl bg-terex-darker/60 border border-terex-accent/20 backdrop-blur-sm">
                <div className="text-2xl font-bold text-terex-accent mb-1">6</div>
                <div className="text-sm text-gray-400">Pays supportés</div>
              </div>
              <div className="p-4 rounded-xl bg-terex-darker/60 border border-terex-accent/20 backdrop-blur-sm">
                <div className="text-2xl font-bold text-terex-accent mb-1">24/7</div>
                <div className="text-sm text-gray-400">Disponibilité</div>
              </div>
            </div>
          </div>
          
          {/* Colonne de droite - Scène 3D */}
          <div className="order-1 lg:order-2 h-[500px] lg:h-[600px] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent rounded-3xl"></div>
            <Hero3DScene className="rounded-3xl" />
            
            {/* Overlay d'informations */}
            <div className="absolute bottom-4 left-4 right-4 bg-terex-darker/80 backdrop-blur-md rounded-xl p-4 border border-terex-accent/30">
              <p className="text-white text-sm font-medium mb-2">🌍 Explorez l'Afrique financière</p>
              <p className="text-gray-300 text-xs">Faites glisser pour interagir avec le globe 3D</p>
            </div>
          </div>
        </div>
        
        {/* Cartes des fonctionnalités modernisées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 lg:mt-32">
          <Card className="bg-terex-darker/80 border-terex-accent/30 backdrop-blur-lg hover:bg-terex-darker/90 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-terex-accent/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-3 text-lg">Échange USDT Tether</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Achetez et vendez vos USDT au meilleur taux avec notre technologie blockchain avancée</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 backdrop-blur-lg hover:bg-terex-darker/90 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-terex-accent/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-3 text-lg">Transferts vers l'Afrique</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Transférez de l'argent partout en Afrique avec notre réseau 3D interactif</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/80 border-terex-accent/30 backdrop-blur-lg hover:bg-terex-darker/90 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-terex-accent/20 group relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-3 text-lg">100% Sécurisé</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Chiffrement 256-bit et conformité réglementaire pour votre sécurité</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Particles d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-terex-accent/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
