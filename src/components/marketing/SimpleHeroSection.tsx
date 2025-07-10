
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SimpleHeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function SimpleHeroSection({ user, onShowDashboard }: SimpleHeroSectionProps) {
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
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-terex-dark min-h-screen relative overflow-hidden">
      {/* Gradient de fond simple */}
      <div className="absolute inset-0 bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark"></div>
      
      {/* Éléments décoratifs subtils */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-terex-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-terex-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Titre principal */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">Échangez vos</span>
              <span className="text-terex-accent block relative">
                USDT Tether
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-terex-accent/60 rounded-full"></div>
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-4 text-gray-300">
                vers l'Afrique instantanément
              </span>
            </h1>
          </div>
          
          {/* Sous-titre */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            La plateforme la plus simple pour acheter, vendre des USDT et effectuer des transferts d'argent vers l'Afrique. 
            <span className="text-terex-accent font-semibold"> Rapide, sécurisé et sans commission.</span>
          </p>
          
          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Button 
                onClick={handleDashboard}
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-2xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 min-w-64"
              >
                Accéder au Dashboard
              </Button>
            ) : (
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold px-8 py-4 text-lg rounded-2xl shadow-lg shadow-terex-accent/25 transition-all duration-300 hover:shadow-terex-accent/40 hover:scale-105 min-w-64"
              >
                Commencer maintenant
              </Button>
            )}
            <Button 
              onClick={handleHowItWorks}
              variant="outline" 
              size="lg"
              className="border-2 border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10 hover:border-terex-accent/50 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm min-w-64 transition-all duration-300"
            >
              Comment ça marche ?
            </Button>
          </div>
          
          {/* Statistiques simples */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-terex-accent mb-2">5min</div>
              <div className="text-gray-400">Transfert rapide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-terex-accent mb-2">24/7</div>
              <div className="text-gray-400">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-terex-accent mb-2">0%</div>
              <div className="text-gray-400">Commission</div>
            </div>
          </div>
          
          {/* Logo USDT central simple */}
          <div className="flex justify-center mb-16">
            <div className="w-24 h-24 bg-gradient-to-br from-terex-accent/20 to-terex-accent/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-terex-accent/20 shadow-2xl">
              <svg className="w-12 h-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Cartes des fonctionnalités en bas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-terex-darker/40 border-terex-accent/20 backdrop-blur-sm hover:bg-terex-darker/60 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Échange USDT</h3>
              <p className="text-gray-400 text-sm">Achetez et vendez vos USDT au meilleur taux du marché</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/40 border-terex-accent/20 backdrop-blur-sm hover:bg-terex-darker/60 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">Transferts Afrique</h3>
              <p className="text-gray-400 text-sm">Envoyez de l'argent instantanément partout en Afrique</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker/40 border-terex-accent/20 backdrop-blur-sm hover:bg-terex-darker/60 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">Sécurisé</h3>
              <p className="text-gray-400 text-sm">Chiffrement 256-bit et conformité réglementaire</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
