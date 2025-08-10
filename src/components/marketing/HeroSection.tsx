

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, ArrowRightLeft, Send, Banknote, TrendingUp, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceMockups } from './DeviceMockups';
import { PhoneMockup } from './PhoneMockup';
import { useState, useEffect } from 'react';

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
        {/* Layout principal en grid pour desktop, stack pour mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
          
          {/* Colonne de gauche - Contenu textuel */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Titre centré sur mobile */}
            <div className="lg:hidden">
              <DeviceMockups />
            </div>
            
            {/* Mockup téléphone visible uniquement sur mobile entre titre et sous-titre */}
            <div className="lg:hidden flex justify-center my-8">
              <div className="relative scale-75">
                <PhoneMockup />
              </div>
            </div>
            
            {/* DeviceMockups pour desktop seulement */}
            <div className="hidden lg:block">
              <DeviceMockups />
            </div>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Achetez et vendez des USDT facilement, 
              effectuez des transferts d'argent vers l'Afrique instantanément. Rapide, sécurisé et sans commission.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 justify-center lg:justify-start">
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
                className="border-gray-600 text-gray-300 hover:bg-terex-gray px-6 py-4 text-base sm:text-lg rounded-xl backdrop-blur-sm w-64 sm:w-auto mx-auto h-12 sm:h-auto"
              >
                Voir comment ça marche
              </Button>
            </div>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-terex-accent">5min</div>
                <div className="text-sm text-gray-400">Transfert rapide</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-terex-accent">6</div>
                <div className="text-sm text-gray-400">Pays supportés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-terex-accent">24/7</div>
                <div className="text-sm text-gray-400">Disponibilité</div>
              </div>
            </div>
          </div>
          
          {/* Colonne de droite - PhoneMockup visible uniquement sur desktop */}
          <div className="order-1 lg:order-2 hidden lg:flex justify-center">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              <PhoneMockup />
            </div>
          </div>
        </div>
        
        {/* Cartes des fonctionnalités - en bas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-16 lg:mt-24">
          <Card className="bg-terex-darker border-terex-accent/20 backdrop-blur-sm hover:bg-terex-gray transition-all duration-300 hover:scale-105 group shadow-lg">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {/* Logo USDT de CoinMarketCap */}
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                  alt="USDT Tether" 
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Échange USDT Tether</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Achetez et vendez vos USDT au meilleur taux</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker border-terex-accent/20 backdrop-blur-sm hover:bg-terex-gray transition-all duration-300 hover:scale-105 group shadow-lg">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-terex-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Transferts vers l'Afrique</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Transférez de l'argent partout en Afrique</p>
            </CardContent>
          </Card>
          
          <Card className="bg-terex-darker border-terex-accent/20 backdrop-blur-sm hover:bg-terex-gray transition-all duration-300 hover:scale-105 group sm:col-span-2 lg:col-span-1 shadow-lg">
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
  );
}

