
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
      
      {/* Desktop and Mobile layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        
        {/* Desktop mockup - visible on larger screens */}
        <div className="hidden lg:block relative scale-75 xl:scale-90">
          <div className="absolute inset-0 bg-terex-accent/20 rounded-3xl blur-3xl scale-110 animate-pulse"></div>
          <MacBookMockup currentSlide={currentSlide} />
        </div>
        
        {/* Mobile mockup - always visible, larger on mobile */}
        <div className="relative scale-90 lg:scale-75 xl:scale-85">
          <div className="absolute inset-0 bg-terex-accent/20 rounded-full blur-3xl scale-110 animate-pulse"></div>
          <IPhoneMockup currentSlide={currentSlide} />
        </div>
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

function MacBookMockup({ currentSlide }: { currentSlide: number }) {
  return (
    <div className="relative mx-auto">
      {/* MacBook Frame */}
      <div className="relative w-[400px] h-[280px] bg-gradient-to-br from-gray-200 to-gray-400 rounded-t-2xl p-3 shadow-2xl border border-gray-300">
        {/* Screen bezel */}
        <div className="w-full h-full bg-black rounded-xl p-1">
          {/* Camera */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full z-20"></div>
          
          {/* Screen content */}
          <div className="w-full h-full bg-terex-dark rounded-lg overflow-hidden relative">
            <DesktopScreenContent currentSlide={currentSlide} />
          </div>
        </div>
      </div>
      
      {/* MacBook base */}
      <div className="w-[450px] h-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-b-2xl mx-auto shadow-lg"></div>
    </div>
  );
}

function IPhoneMockup({ currentSlide }: { currentSlide: number }) {
  return (
    <div className="relative mx-auto">
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] bg-gradient-to-br from-white/20 to-white/10 rounded-[3rem] p-2 shadow-2xl border border-white/30">
        {/* Screen bezel */}
        <div className="w-full h-full bg-black rounded-[2.5rem] p-1">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20"></div>
          
          {/* Screen content */}
          <div className="w-full h-full bg-terex-dark rounded-[2.2rem] overflow-hidden relative">
            <MobileScreenContent currentSlide={currentSlide} />
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
      </div>
    </div>
  );
}

function DesktopScreenContent({ currentSlide }: { currentSlide: number }) {
  const screens = [
    <DashboardScreen key="dashboard" />,
    <BuyUSDTScreen key="buy" />,
    <TransferScreen key="transfer" />
  ];

  return (
    <div className="relative w-full h-full">
      {screens.map((screen, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
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
        <div className="flex space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
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

// Desktop Screen Components
function DashboardScreen() {
  return (
    <div className="p-6 bg-terex-dark text-white h-full overflow-y-auto scrollbar-hide">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard Terex</h1>
          <p className="text-gray-400 text-sm">Plateforme USDT</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TetherLogo className="w-5 h-5" />
              </div>
              <h3 className="text-white font-medium">Acheter USDT</h3>
            </div>
            <p className="text-gray-400 text-sm">Achat rapide et sécurisé</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-terex-accent" />
              </div>
              <h3 className="text-white font-medium">Virements</h3>
            </div>
            <p className="text-gray-400 text-sm">Transferts internationaux</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-4">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Star className="w-4 h-4 mr-2 text-terex-accent" />
            Avantages Terex
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-terex-accent/20 rounded flex items-center justify-center">
                <Zap className="w-3 h-3 text-terex-accent" />
              </div>
              <span className="text-white text-sm">Frais gratuits</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                <Clock className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-white text-sm">Transferts instantanés</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BuyUSDTScreen() {
  return (
    <div className="p-6 bg-terex-dark text-white h-full">
      <div className="flex items-center space-x-3 mb-6">
        <ArrowUpDown className="w-6 h-6 text-terex-accent" />
        <h1 className="text-xl font-bold">Acheter USDT</h1>
      </div>

      <div className="space-y-4">
        <Card className="bg-terex-darker border-terex-accent/30">
          <CardContent className="p-4">
            <label className="text-sm text-gray-400 mb-2 block">Montant (CAD)</label>
            <input 
              type="text" 
              value="500.00"
              className="w-full bg-terex-dark border border-gray-600 rounded-lg px-3 py-2 text-white"
              readOnly
            />
            <div className="mt-3 p-3 bg-terex-dark rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-400">Vous recevez</span>
                <span className="text-terex-accent font-bold">≈ 500.00 USDT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-accent/30">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Méthode de paiement</h3>
            <div className="flex items-center space-x-3 p-3 bg-terex-accent/10 border border-terex-accent/30 rounded-lg">
              <CreditCard className="w-5 h-5 text-terex-accent" />
              <div className="flex-1">
                <p className="font-medium text-white">Carte bancaire</p>
                <p className="text-sm text-gray-400">Visa, Mastercard</p>
              </div>
              <CheckCircle className="w-5 h-5 text-terex-accent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TransferScreen() {
  return (
    <div className="p-6 bg-terex-dark text-white h-full">
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-bold">Virement International</h1>
      </div>

      <div className="space-y-4">
        <Card className="bg-terex-darker border-blue-500/30">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Destination</h3>
            <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">🇨🇲</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Cameroun</p>
                <p className="text-sm text-gray-400">Mobile Money • MTN, Orange</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Montant</p>
                <p className="text-lg font-bold text-white">500.00 CAD</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Destinataire reçoit</p>
                <p className="text-lg font-bold text-blue-400">≈ 285,000 XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Mobile Screen Components (similar content but optimized for mobile)
function MobileDashboardScreen() {
  return (
    <div className="p-3 space-y-3 text-xs overflow-y-auto h-full pb-8 scrollbar-hide">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
          <Activity className="w-3 h-3 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">
            Bienvenue, <span className="text-terex-accent">Mohamed</span>
          </h1>
          <p className="text-gray-400 text-xs">Plateforme USDT</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-2">
            <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center mb-1">
              <TetherLogo className="w-4 h-4" />
            </div>
            <h3 className="text-white text-xs font-medium">Acheter USDT</h3>
            <p className="text-gray-400 text-xs">Achat rapide</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-2">
            <div className="w-6 h-6 bg-terex-accent/20 rounded-lg flex items-center justify-center mb-1">
              <Globe className="w-3 h-3 text-terex-accent" />
            </div>
            <h3 className="text-white text-xs font-medium">Virements</h3>
            <p className="text-gray-400 text-xs">International</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-2">
          <h3 className="text-white text-xs font-medium mb-2 flex items-center">
            <Star className="w-3 h-3 mr-1 text-terex-accent" />
            Avantages Terex
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-terex-accent/20 rounded flex items-center justify-center">
                <Zap className="w-2 h-2 text-terex-accent" />
              </div>
              <span className="text-white text-xs">Frais gratuits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500/20 rounded flex items-center justify-center">
                <Clock className="w-2 h-2 text-green-400" />
              </div>
              <span className="text-white text-xs">Instantané</span>
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
      <div className="flex items-center space-x-2 mb-4">
        <ArrowUpDown className="w-4 h-4 text-terex-accent" />
        <h1 className="text-sm font-bold">Acheter USDT</h1>
      </div>

      <div className="space-y-3">
        <Card className="bg-terex-darker border-terex-accent/30">
          <CardContent className="p-3">
            <label className="text-xs text-gray-400 mb-1 block">Montant (CAD)</label>
            <input 
              type="text" 
              value="500.00"
              className="w-full bg-terex-dark border border-gray-600 rounded px-2 py-1 text-white text-sm"
              readOnly
            />
            <div className="mt-2 p-2 bg-terex-dark rounded">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Vous recevez</span>
                <span className="text-terex-accent font-bold">≈ 500.00 USDT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-accent/30">
          <CardContent className="p-3">
            <h3 className="text-xs font-medium mb-2">Paiement</h3>
            <div className="flex items-center space-x-2 p-2 bg-terex-accent/10 border border-terex-accent/30 rounded">
              <CreditCard className="w-3 h-3 text-terex-accent" />
              <span className="text-white text-xs">Carte bancaire</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MobileTransferScreen() {
  return (
    <div className="p-3 bg-terex-dark text-white h-full overflow-y-auto scrollbar-hide">
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="w-4 h-4 text-blue-400" />
        <h1 className="text-sm font-bold">Virement</h1>
      </div>

      <div className="space-y-3">
        <Card className="bg-terex-darker border-blue-500/30">
          <CardContent className="p-3">
            <h3 className="text-xs font-medium mb-2">Destination</h3>
            <div className="flex items-center space-x-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
              <span className="text-xs">🇨🇲</span>
              <div>
                <p className="text-white text-xs font-medium">Cameroun</p>
                <p className="text-gray-400 text-xs">Mobile Money</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-blue-500/30">
          <CardContent className="p-3">
            <div className="flex justify-between text-xs">
              <div>
                <p className="text-gray-400">Montant</p>
                <p className="font-bold text-white">500 CAD</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Reçoit</p>
                <p className="font-bold text-blue-400">285,000 XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
