
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Globe, Handshake, Star, Zap, Clock, Activity, Shield, Users, Award, ArrowUpDown, Send, User, CreditCard, CheckCircle, Smartphone } from 'lucide-react';

const TetherLogo = ({ className }: { className?: string }) => (
  <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="Tether Logo" className={className} />
);

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = 3; // Dashboard, Buy USDT, International Transfer

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  return (
    <div 
      className="relative flex items-center justify-center min-h-[600px] lg:min-h-[700px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/20 via-transparent to-terex-accent/20 blur-3xl"></div>
      
      {/* Mobile mockup - centered */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-terex-accent/10 rounded-full blur-2xl scale-105 animate-pulse"></div>
        <IPhoneMockup currentSlide={currentSlide} />
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-terex-accent scale-110' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function IPhoneMockup({ currentSlide }: { currentSlide: number }) {
  return (
    <div className="relative mx-auto">
      {/* Phone Frame - More realistic iPhone styling */}
      <div className="relative w-[260px] h-[520px] bg-gradient-to-br from-gray-800 to-black rounded-[2.8rem] p-2 shadow-2xl border border-gray-700">
        {/* Screen bezel */}
        <div className="w-full h-full bg-black rounded-[2.3rem] p-1 relative">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 border border-gray-800"></div>
          
          {/* Screen content */}
          <div className="w-full h-full bg-terex-dark rounded-[2rem] overflow-hidden relative">
            <MobileScreenContent currentSlide={currentSlide} />
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white rounded-full opacity-60"></div>
      </div>
    </div>
  );
}

function MobileScreenContent({ currentSlide }: { currentSlide: number }) {
  const screens = [
    <MobileDashboardScreen key="dashboard" />,
    <MobileBuyUSDTScreen key="buy" />,
    <MobileTransferScreen key="transfer" />
  ];

  return (
    <div className="relative w-full h-full">
      {/* Status bar */}
      <div className="h-8 bg-terex-darker flex items-center justify-between px-4 text-xs text-white">
        <span>9:41</span>
        <div className="flex space-x-1 items-center">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="w-6 h-3 bg-green-400 rounded-sm ml-2"></div>
        </div>
      </div>

      {screens.map((screen, index) => (
        <div
          key={index}
          className={`absolute inset-0 top-8 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 transform translate-x-0'
              : index < currentSlide
              ? 'opacity-0 transform -translate-x-full'
              : 'opacity-0 transform translate-x-full'
          }`}
        >
          {screen}
        </div>
      ))}
    </div>
  );
}

// Mobile Screen Components - Real Terex mobile pages
function MobileDashboardScreen() {
  return (
    <div className="p-3 space-y-3 text-xs overflow-y-auto h-full pb-8 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
          <Activity className="w-3 h-3 text-black" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">
            Salut, <span className="text-terex-accent">Mohamed</span>
          </h1>
          <p className="text-gray-400 text-xs">Plateforme Terex</p>
        </div>
      </div>

      {/* Balance */}
      <Card className="bg-gradient-to-r from-terex-accent/15 to-terex-accent/5 border-terex-accent/30">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Balance USDT</p>
              <p className="text-lg font-bold text-terex-accent">1,247.50</p>
            </div>
            <TetherLogo className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-2">
            <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center mb-1">
              <TetherLogo className="w-4 h-4" />
            </div>
            <h3 className="text-white text-xs font-medium">Acheter</h3>
            <p className="text-gray-400 text-xs">USDT</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-2">
            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center mb-1">
              <Globe className="w-3 h-3 text-blue-400" />
            </div>
            <h3 className="text-white text-xs font-medium">Virement</h3>
            <p className="text-gray-400 text-xs">International</p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-2">
          <h3 className="text-white text-xs font-medium mb-2 flex items-center">
            <Star className="w-3 h-3 mr-1 text-terex-accent" />
            Avantages Terex
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-terex-accent" />
              <span className="text-white text-xs">Frais gratuits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-green-400" />
              <span className="text-white text-xs">Transferts instantanés</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileBuyUSDTScreen() {
  return (
    <div className="p-3 bg-terex-dark text-white h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <ArrowUpDown className="w-4 h-4 text-terex-accent" />
        <h1 className="text-sm font-bold">Acheter USDT</h1>
      </div>

      {/* Amount */}
      <Card className="bg-terex-darker border-terex-accent/30 mb-3">
        <CardContent className="p-3">
          <label className="text-xs text-gray-400 mb-1 block">Montant (CAD)</label>
          <input 
            type="text" 
            value="500.00"
            className="w-full bg-terex-dark border border-gray-600 rounded px-2 py-2 text-white text-sm"
            readOnly
          />
          <div className="mt-2 p-2 bg-terex-dark rounded">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Vous recevez</span>
              <div className="flex items-center space-x-1">
                <TetherLogo className="w-3 h-3" />
                <span className="text-terex-accent font-bold">500.00 USDT</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="bg-terex-darker border-terex-accent/30">
        <CardContent className="p-3">
          <h3 className="text-xs font-medium mb-2">Paiement</h3>
          <div className="flex items-center space-x-2 p-2 bg-terex-accent/10 border border-terex-accent/30 rounded">
            <CreditCard className="w-3 h-3 text-terex-accent" />
            <span className="text-white text-xs">Carte bancaire</span>
            <CheckCircle className="w-3 h-3 text-terex-accent ml-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileTransferScreen() {
  return (
    <div className="p-3 bg-terex-dark text-white h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="w-4 h-4 text-blue-400" />
        <h1 className="text-sm font-bold">Virement</h1>
      </div>

      {/* Destination */}
      <Card className="bg-terex-darker border-blue-500/30 mb-3">
        <CardContent className="p-3">
          <h3 className="text-xs font-medium mb-2">Destination</h3>
          <div className="flex items-center space-x-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
            <span className="text-sm">🇨🇲</span>
            <div>
              <p className="text-white text-xs font-medium">Cameroun</p>
              <p className="text-gray-400 text-xs">Mobile Money</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amount */}
      <Card className="bg-terex-darker border-blue-500/30 mb-3">
        <CardContent className="p-3">
          <div className="flex justify-between text-xs">
            <div>
              <p className="text-gray-400">Envoi</p>
              <p className="font-bold text-white">500 CAD</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Reçoit</p>
              <p className="font-bold text-blue-400">285,000 XAF</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs">
          <Zap className="w-3 h-3 text-green-400" />
          <span className="text-green-400">Instantané</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-terex-accent/10 border border-terex-accent/30 rounded text-xs">
          <Shield className="w-3 h-3 text-terex-accent" />
          <span className="text-terex-accent">Sans frais</span>
        </div>
      </div>
    </div>
  );
}
