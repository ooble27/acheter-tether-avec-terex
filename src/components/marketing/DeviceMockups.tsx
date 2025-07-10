
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Globe, Shield, Zap, Clock, CheckCircle, Smartphone, DollarSign, Coins, Building2 } from 'lucide-react';

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Messages rotatifs pour le titre principal
  const titleMessages = [
    "Achetez des USDT facilement avec Terex",
    "Vendez vos stablecoins en toute sécurité",
    "Envoyez de l'argent à vos proches en Afrique",
    "Échangez vos cryptomonnaies rapidement",
    "Transférez sans frais vers 6 pays africains"
  ];

  const slides = [
    {
      component: <ProfessionalUSDTBuy />
    },
    {
      component: <ProfessionalUSDTSell />
    },
    {
      component: <ProfessionalTransfer />
    },
    {
      component: <ProfessionalSecurity />
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
    <div className="relative flex items-center justify-center min-h-[600px] lg:min-h-[700px]">
      {/* Titre principal qui change */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center z-10 mb-8">
        <h2 className="text-2xl lg:text-4xl font-bold text-white transition-all duration-700 ease-in-out">
          {titleMessages[currentSlide]}
        </h2>
      </div>
      
      {/* Mobile mockup - plus grand sur desktop */}
      <div className="relative mt-16">
        <IPhoneMockup currentSlide={currentSlide} slides={slides} />
      </div>
    </div>
  );
}

function IPhoneMockup({ currentSlide, slides }: { currentSlide: number, slides: any[] }) {
  return (
    <div className="relative mx-auto">
      {/* Phone Frame - Plus grand sur desktop */}
      <div className="relative w-[280px] h-[560px] lg:w-[320px] lg:h-[640px] bg-gradient-to-br from-gray-800 to-black rounded-[2.8rem] p-2 shadow-2xl border border-gray-700">
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

// Composants professionnels redesignés
function ProfessionalUSDTBuy() {
  return (
    <div className="p-6 h-full bg-gradient-to-br from-terex-dark to-terex-darker">
      {/* Header professionnel */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-terex-accent to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Coins className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Achat USDT</h2>
        <p className="text-gray-300 text-sm">Convertissez vos CAD en USDT</p>
      </div>

      {/* Process steps */}
      <div className="space-y-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
            <div>
              <p className="text-white font-medium">Saisissez le montant</p>
              <p className="text-gray-400 text-xs">En dollars canadiens</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
            <div>
              <p className="text-white font-medium">Effectuez le paiement</p>
              <p className="text-gray-400 text-xs">Carte Visa ou Mastercard</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-terex-accent rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
            <div>
              <p className="text-white font-medium">Recevez vos USDT</p>
              <p className="text-gray-400 text-xs">Dans votre portefeuille</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-6 bg-gradient-to-r from-terex-accent/10 to-blue-500/10 rounded-xl p-4 border border-terex-accent/20">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-terex-accent" />
          <span className="text-terex-accent font-medium text-sm">Transaction instantanée</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium text-sm">100% sécurisé</span>
        </div>
      </div>
    </div>
  );
}

function ProfessionalUSDTSell() {
  return (
    <div className="p-6 h-full bg-gradient-to-br from-terex-dark to-terex-darker">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Vente USDT</h2>
        <p className="text-gray-300 text-sm">Convertissez en CAD rapidement</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <div>
              <p className="text-white font-medium">Envoyez vos USDT</p>
              <p className="text-gray-400 text-xs">Vers notre adresse sécurisée</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <div>
              <p className="text-white font-medium">Vérification automatique</p>
              <p className="text-gray-400 text-xs">Confirmation en temps réel</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <div>
              <p className="text-white font-medium">Recevez vos CAD</p>
              <p className="text-gray-400 text-xs">Virement Interac instantané</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">Taux de change actuel</p>
          <p className="text-green-400 font-bold text-lg">1 USDT = 1.35 CAD</p>
          <p className="text-green-400 text-xs">Mis à jour en temps réel</p>
        </div>
      </div>
    </div>
  );
}

function ProfessionalTransfer() {
  return (
    <div className="p-6 h-full bg-gradient-to-br from-terex-dark to-terex-darker">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Virements Afrique</h2>
        <p className="text-gray-300 text-sm">Envoyez de l'argent facilement</p>
      </div>

      <div className="space-y-3">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🇨🇲</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Cameroun</p>
              <p className="text-gray-400 text-xs">MTN • Orange Money</p>
            </div>
            <div className="text-right">
              <p className="text-blue-400 text-xs">≈ 5 min</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🇸🇳</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Sénégal</p>
              <p className="text-gray-400 text-xs">Wave • Orange Money</p>
            </div>
            <div className="text-right">
              <p className="text-blue-400 text-xs">≈ 5 min</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🇨🇮</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Côte d'Ivoire</p>
              <p className="text-gray-400 text-xs">Mobile Money</p>
            </div>
            <div className="text-right">
              <p className="text-blue-400 text-xs">≈ 5 min</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Instantané</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-3 h-3 text-terex-accent" />
              <span className="text-terex-accent text-xs font-medium">Sans frais</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalSecurity() {
  return (
    <div className="p-6 h-full bg-gradient-to-br from-terex-dark to-terex-darker">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sécurité Maximale</h2>
        <p className="text-gray-300 text-sm">Vos fonds sont protégés</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-medium text-sm">KYC Vérifié</p>
              <p className="text-gray-400 text-xs">Identité confirmée et sécurisée</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-white font-medium text-sm">Chiffrement SSL</p>
              <p className="text-gray-400 text-xs">Protection 256-bit de vos données</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-medium text-sm">Réglementé</p>
              <p className="text-gray-400 text-xs">Conforme aux normes canadiennes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium text-sm">Plateforme de confiance</span>
          </div>
          <p className="text-gray-400 text-xs">Plus de 10,000 utilisateurs actifs</p>
        </div>
      </div>
    </div>
  );
}
