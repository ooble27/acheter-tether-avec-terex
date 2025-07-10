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
      
      {/* Desktop and Mobile layout - Better spacing and arrangement */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-20">
        
        {/* iMac mockup - visible on larger screens */}
        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-terex-accent/10 rounded-3xl blur-2xl scale-105 animate-pulse"></div>
          <IMacMockup currentSlide={currentSlide} />
        </div>
        
        {/* Mobile mockup - smaller on desktop */}
        <div className="relative scale-90 lg:scale-75">
          <div className="absolute inset-0 bg-terex-accent/10 rounded-full blur-2xl scale-105 animate-pulse"></div>
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

function IMacMockup({ currentSlide }: { currentSlide: number }) {
  return (
    <div className="relative mx-auto scale-90 xl:scale-100">
      {/* iMac Screen - More realistic proportions */}
      <div className="relative w-[520px] h-[390px] bg-gradient-to-b from-gray-50 to-gray-200 rounded-[2rem] p-3 shadow-2xl border border-gray-300">
        {/* Screen bezel with Apple-like styling */}
        <div className="w-full h-full bg-black rounded-[1.5rem] p-2 relative">
          {/* Apple logo area */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-700 rounded-full"></div>
          
          {/* Screen content */}
          <div className="w-full h-full bg-terex-dark rounded-xl overflow-hidden relative">
            <DesktopScreenContent currentSlide={currentSlide} />
          </div>
        </div>
      </div>
      
      {/* iMac Stand - More realistic */}
      <div className="flex flex-col items-center">
        {/* Neck - thinner and more elegant */}
        <div className="w-6 h-12 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-b-md shadow-lg"></div>
        {/* Base - Apple-like curved base */}
        <div className="w-40 h-4 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full"></div>
        </div>
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

// Desktop Screen Components - Real Terex platform pages
function DashboardScreen() {
  return (
    <div className="p-4 bg-terex-dark text-white h-full overflow-y-auto scrollbar-hide">
      {/* Header with Terex branding */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Dashboard Terex</h1>
            <p className="text-gray-400 text-xs">Plateforme USDT & Virements</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-terex-accent/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-terex-accent" />
        </div>
      </div>

      {/* Balance card */}
      <Card className="bg-gradient-to-r from-terex-accent/10 to-terex-accent/5 border-terex-accent/30 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Balance USDT</p>
              <p className="text-2xl font-bold text-terex-accent">1,247.50</p>
            </div>
            <TetherLogo className="w-8 h-8" />
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                <TetherLogo className="w-4 h-4" />
              </div>
              <h3 className="text-white text-sm font-medium">Acheter USDT</h3>
            </div>
            <p className="text-gray-400 text-xs">Achat rapide et sécurisé</p>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray hover:border-terex-accent/50 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-white text-sm font-medium">Virements</h3>
            </div>
            <p className="text-gray-400 text-xs">Transferts internationaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-3">
          <h3 className="text-white text-sm font-medium mb-3">Transactions récentes</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-terex-dark rounded">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-white text-xs">Achat USDT</span>
              </div>
              <span className="text-terex-accent text-xs font-medium">+500 USDT</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-terex-dark rounded">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-white text-xs">Virement Cameroun</span>
              </div>
              <span className="text-gray-400 text-xs">-200 CAD</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BuyUSDTScreen() {
  return (
    <div className="p-4 bg-terex-dark text-white h-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <ArrowUpDown className="w-5 h-5 text-terex-accent" />
        <h1 className="text-lg font-bold">Acheter USDT</h1>
      </div>

      {/* Amount input */}
      <Card className="bg-terex-darker border-terex-accent/30 mb-4">
        <CardContent className="p-4">
          <label className="text-sm text-gray-400 mb-2 block">Montant (CAD)</label>
          <input 
            type="text" 
            value="500.00"
            className="w-full bg-terex-dark border border-gray-600 rounded-lg px-3 py-2 text-white text-lg"
            readOnly
          />
          <div className="mt-3 p-3 bg-terex-dark rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Vous recevez</span>
              <div className="flex items-center space-x-2">
                <TetherLogo className="w-4 h-4" />
                <span className="text-terex-accent font-bold">500.00 USDT</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="bg-terex-darker border-terex-accent/30 mb-4">
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

      {/* Rate info */}
      <div className="bg-terex-accent/10 border border-terex-accent/30 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-terex-accent" />
          <span className="text-terex-accent text-sm font-medium">Taux avantageux • 1 CAD = 1 USDT</span>
        </div>
      </div>
    </div>
  );
}

function TransferScreen() {
  return (
    <div className="p-4 bg-terex-dark text-white h-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold">Virement International</h1>
      </div>

      {/* Destination */}
      <Card className="bg-terex-darker border-blue-500/30 mb-4">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Destination</h3>
          <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm">
              🇨🇲
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">Cameroun</p>
              <p className="text-sm text-gray-400">Mobile Money • MTN, Orange</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amount */}
      <Card className="bg-terex-darker border-blue-500/30 mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Montant</p>
              <p className="text-xl font-bold text-white">500.00 CAD</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Destinataire reçoit</p>
              <p className="text-xl font-bold text-blue-400">285,000 XAF</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">Transfert instantané</span>
        </div>
        <div className="flex items-center space-x-3 p-2 bg-terex-accent/10 border border-terex-accent/30 rounded-lg">
          <Shield className="w-4 h-4 text-terex-accent" />
          <span className="text-terex-accent text-sm">Frais gratuits avec Terex</span>
        </div>
      </div>
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
