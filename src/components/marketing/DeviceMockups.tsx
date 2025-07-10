
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Globe, Handshake, Star, Zap, Clock, Activity, Shield, Users, Award, ArrowUpDown, Send, User, CreditCard, CheckCircle, Smartphone, DollarSign, Coins, Building2 } from 'lucide-react';

const TetherLogo = ({ className }: { className?: string }) => (
  <img src="https://coin-images.coingecko.com/coins/images/325/large/Tether.png" alt="Tether Logo" className={className} />
);

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Messages explicatifs pour chaque slide
  const slides = [
    {
      title: "Achetez des USDT facilement",
      subtitle: "Convertissez vos CAD en USDT en quelques clics",
      icon: <Coins className="w-8 h-8 text-terex-accent" />,
      component: <BuyUSDTExplanation />
    },
    {
      title: "Vendez vos USDT rapidement", 
      subtitle: "Reconvertissez vos USDT en CAD instantanément",
      icon: <DollarSign className="w-8 h-8 text-green-400" />,
      component: <SellUSDTExplanation />
    },
    {
      title: "Virements internationaux",
      subtitle: "Envoyez de l'argent vers l'Afrique sans frais",
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      component: <TransferExplanation />
    },
    {
      title: "Plateforme sécurisée",
      subtitle: "Vos transactions sont protégées et vérifiées",
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      component: <SecurityExplanation />
    }
  ];

  const totalSlides = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-[600px] lg:min-h-[700px] gap-8 lg:gap-16">
      {/* Text Section */}
      <div className="flex-1 text-center lg:text-left order-2 lg:order-1 px-4">
        <div className="transition-all duration-700 ease-in-out">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            {slides[currentSlide].icon}
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            {slides[currentSlide].title}
          </h3>
          <p className="text-lg text-gray-300 mb-6">
            {slides[currentSlide].subtitle}
          </p>
        </div>
      </div>
      
      {/* Mobile mockup - centered */}
      <div className="relative order-1 lg:order-2">
        <IPhoneMockup currentSlide={currentSlide} slides={slides} />
      </div>
    </div>
  );
}

function IPhoneMockup({ currentSlide, slides }: { currentSlide: number, slides: any[] }) {
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
            <MobileScreenContent currentSlide={currentSlide} slides={slides} />
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white rounded-full opacity-60"></div>
      </div>
    </div>
  );
}

function MobileScreenContent({ currentSlide, slides }: { currentSlide: number, slides: any[] }) {
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

      {slides.map((slide, index) => (
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
          {slide.component}
        </div>
      ))}
    </div>
  );
}

// Composants d'explication pour chaque service
function BuyUSDTExplanation() {
  return (
    <div className="p-4 space-y-4 text-xs overflow-y-auto h-full pb-8 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-terex-accent/20 rounded-lg flex items-center justify-center">
          <Coins className="w-4 h-4 text-terex-accent" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Achat USDT</h1>
          <p className="text-gray-400 text-xs">Simple et rapide</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <Card className="bg-terex-darker border-terex-accent/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center text-black font-bold text-xs">1</div>
              <div>
                <p className="text-white text-xs font-medium">Choisissez le montant</p>
                <p className="text-gray-400 text-xs">En dollars canadiens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-accent/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center text-black font-bold text-xs">2</div>
              <div>
                <p className="text-white text-xs font-medium">Payez par carte</p>
                <p className="text-gray-400 text-xs">Visa ou Mastercard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-accent/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-terex-accent rounded-full flex items-center justify-center text-black font-bold text-xs">3</div>
              <div>
                <p className="text-white text-xs font-medium">Recevez vos USDT</p>
                <p className="text-gray-400 text-xs">Dans votre portefeuille</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <div className="mt-4">
        <h3 className="text-white text-xs font-medium mb-2">Avantages</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 text-terex-accent" />
            <span className="text-white text-xs">Transaction instantanée</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-3 h-3 text-green-400" />
            <span className="text-white text-xs">100% sécurisé</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SellUSDTExplanation() {
  return (
    <div className="p-4 space-y-4 text-xs overflow-y-auto h-full pb-8 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Vente USDT</h1>
          <p className="text-gray-400 text-xs">Convertissez en CAD</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <Card className="bg-terex-darker border-green-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
              <div>
                <p className="text-white text-xs font-medium">Envoyez vos USDT</p>
                <p className="text-gray-400 text-xs">Vers notre adresse</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-green-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
              <div>
                <p className="text-white text-xs font-medium">Confirmation rapide</p>
                <p className="text-gray-400 text-xs">Vérification automatique</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-green-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
              <div>
                <p className="text-white text-xs font-medium">Recevez vos CAD</p>
                <p className="text-gray-400 text-xs">Virement Interac</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate display */}
      <Card className="bg-terex-darker border-green-500/30">
        <CardContent className="p-3">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Taux actuel</p>
            <p className="text-green-400 font-bold">1 USDT = 1.00 CAD</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransferExplanation() {
  return (
    <div className="p-4 space-y-4 text-xs overflow-y-auto h-full pb-8 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Globe className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Virements</h1>
          <p className="text-gray-400 text-xs">Vers l'Afrique</p>
        </div>
      </div>

      {/* Destinations */}
      <div className="space-y-2">
        <h3 className="text-white text-xs font-medium">Destinations disponibles</h3>
        
        <Card className="bg-terex-darker border-blue-500/30">
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🇨🇲</span>
              <div>
                <p className="text-white text-xs font-medium">Cameroun</p>
                <p className="text-gray-400 text-xs">Mobile Money, Banque</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-blue-500/30">
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🇸🇳</span>
              <div>
                <p className="text-white text-xs font-medium">Sénégal</p>
                <p className="text-gray-400 text-xs">Wave, Orange Money</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-blue-500/30">
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🇨🇮</span>
              <div>
                <p className="text-white text-xs font-medium">Côte d'Ivoire</p>
                <p className="text-gray-400 text-xs">Mobile Money</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs">
          <Zap className="w-3 h-3 text-blue-400" />
          <span className="text-blue-400">Transfert instantané</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-terex-accent/10 border border-terex-accent/30 rounded text-xs">
          <DollarSign className="w-3 h-3 text-terex-accent" />
          <span className="text-terex-accent">Frais réduits</span>
        </div>
      </div>
    </div>
  );
}

function SecurityExplanation() {
  return (
    <div className="p-4 space-y-4 text-xs overflow-y-auto h-full pb-8 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Sécurité</h1>
          <p className="text-gray-400 text-xs">Protection maximale</p>
        </div>
      </div>

      {/* Security features */}
      <div className="space-y-3">
        <Card className="bg-terex-darker border-purple-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-white text-xs font-medium">KYC vérifié</p>
                <p className="text-gray-400 text-xs">Identité confirmée</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-purple-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-white text-xs font-medium">Chiffrement SSL</p>
                <p className="text-gray-400 text-xs">Données protégées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-purple-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-white text-xs font-medium">Réglementé</p>
                <p className="text-gray-400 text-xs">Conforme aux lois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust indicators */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-green-400" />
          <div>
            <p className="font-medium text-green-400 text-xs">Plateforme de confiance</p>
            <p className="text-gray-400 text-xs">Plus de 10,000 utilisateurs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
