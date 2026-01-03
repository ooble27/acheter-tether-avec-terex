

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceMockups } from './DeviceMockups';
import { PhoneMockup } from './PhoneMockup';

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
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
          
          {/* Colonne de gauche - Contenu textuel */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Titre mobile */}
            <div className="lg:hidden">
              <DeviceMockups />
            </div>
            
            {/* Mockup téléphone mobile */}
            <div className="lg:hidden flex justify-center my-8">
              <div className="relative scale-75">
                <PhoneMockup />
              </div>
            </div>
            
            {/* DeviceMockups desktop */}
            <div className="hidden lg:block">
              <DeviceMockups />
            </div>
            
            <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-light">
              Achetez et vendez des USDT facilement, 
              effectuez des transferts d'argent vers l'Afrique instantanément. <span className="text-terex-accent">Rapide, sécurisé et sans commission.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 justify-center lg:justify-start">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white font-light px-6 py-4 text-base sm:text-lg rounded-lg transition-all duration-300 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto group"
                >
                  Aller au Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white font-light px-6 py-4 text-base sm:text-lg rounded-lg transition-all duration-300 hover:scale-105 w-64 sm:w-auto mx-auto h-12 sm:h-auto group"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 px-6 py-4 text-base sm:text-lg rounded-lg w-64 sm:w-auto mx-auto h-12 sm:h-auto"
              >
                Voir comment ça marche
              </Button>
            </div>
            
            {/* Stats rapides - Style Attio */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="text-2xl font-medium text-gray-900">5min</div>
                <div className="text-sm text-gray-500">Transfert rapide</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="text-2xl font-medium text-gray-900">6</div>
                <div className="text-sm text-gray-500">Pays supportés</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="text-2xl font-medium text-gray-900">24/7</div>
                <div className="text-sm text-gray-500">Disponibilité</div>
              </div>
            </div>
          </div>
          
          {/* Colonne de droite - PhoneMockup desktop */}
          <div className="order-1 lg:order-2 hidden lg:flex justify-center">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              <PhoneMockup />
            </div>
          </div>
        </div>
        
        {/* Cartes des fonctionnalités - Style Attio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-16 lg:mt-24">
          <Card className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                  alt="USDT Tether" 
                  className="w-7 h-7"
                />
              </div>
              <h3 className="text-gray-900 font-medium mb-2 text-sm sm:text-base">Échange USDT Tether</h3>
              <p className="text-gray-500 text-xs sm:text-sm font-light">Achetez et vendez vos USDT au meilleur taux</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 font-medium mb-2 text-sm sm:text-base">Transferts vers l'Afrique</h3>
              <p className="text-gray-500 text-xs sm:text-sm font-light">Transférez de l'argent partout en Afrique</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group sm:col-span-2 lg:col-span-1 rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-900 font-medium mb-2 text-sm sm:text-base">100% Sécurisé</h3>
              <p className="text-gray-500 text-xs sm:text-sm font-light">Chiffrement 256-bit et conformité réglementaire</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
