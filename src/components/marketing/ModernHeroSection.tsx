
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Zap, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ModernHeroSectionProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function ModernHeroSection({ user, onShowDashboard }: ModernHeroSectionProps) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-terex-accent/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-terex-accent/10 to-green-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-terex-accent/60 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terex-accent/10 border border-terex-accent/20 rounded-full backdrop-blur-sm">
              <Star className="w-4 h-4 text-terex-accent" />
              <span className="text-terex-accent text-sm font-medium">Plateforme #1 en Afrique</span>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1]">
                L'échange
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-terex-accent via-green-400 to-terex-accent bg-clip-text text-transparent animate-pulse">
                    USDT Tether
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-terex-accent/20 to-green-400/20 blur-lg -z-10" />
                </span>
                <br />
                vers l'Afrique
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Échangez vos USDT et effectuez des transferts instantanés vers l'Afrique. 
                <span className="text-terex-accent font-semibold"> Rapide, sécurisé et sans commission.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="group bg-gradient-to-r from-terex-accent to-green-500 hover:from-green-500 hover:to-terex-accent text-black font-bold px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-terex-accent/25 transition-all duration-500 hover:shadow-terex-accent/50 hover:scale-105 transform"
                >
                  Aller au Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="group bg-gradient-to-r from-terex-accent to-green-500 hover:from-green-500 hover:to-terex-accent text-black font-bold px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-terex-accent/25 transition-all duration-500 hover:shadow-terex-accent/50 hover:scale-105 transform"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg"
                className="group border-terex-accent/30 bg-white/5 backdrop-blur-sm text-white hover:bg-terex-accent/10 hover:border-terex-accent px-8 py-6 text-lg rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Comment ça marche
                <div className="ml-2 w-5 h-5 border border-current rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform">
                  <div className="w-2 h-2 bg-current rounded-full" />
                </div>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: "5min", label: "Transfert rapide" },
                { value: "6", label: "Pays supportés" },
                { value: "24/7", label: "Disponibilité" }
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-black bg-gradient-to-r from-terex-accent to-green-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - 3D Visual Elements */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-[600px] flex items-center justify-center">
              
              {/* Central USDT Logo */}
              <div className="relative z-20">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/50 animate-float">
                  <svg className="w-20 h-20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                    <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                  </svg>
                </div>
              </div>

              {/* Floating Cards */}
              {[
                { icon: Shield, label: "Sécurisé", position: "top-left", delay: "0s" },
                { icon: Globe, label: "Global", position: "top-right", delay: "1s" },
                { icon: Zap, label: "Rapide", position: "bottom-left", delay: "2s" },
                { icon: TrendingUp, label: "Rentable", position: "bottom-right", delay: "3s" }
              ].map((item, index) => (
                <Card 
                  key={index}
                  className={`absolute w-24 h-24 bg-white/10 border-white/20 backdrop-blur-lg shadow-xl animate-float-slow ${
                    item.position === 'top-left' ? '-top-12 -left-12' :
                    item.position === 'top-right' ? '-top-12 -right-12' :
                    item.position === 'bottom-left' ? '-bottom-12 -left-12' :
                    '-bottom-12 -right-12'
                  }`}
                  style={{ animationDelay: item.delay }}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                    <item.icon className="w-6 h-6 text-terex-accent mb-1" />
                    <span className="text-white text-xs font-medium">{item.label}</span>
                  </CardContent>
                </Card>
              ))}

              {/* Orbital Rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-full h-full border-2 border-dashed border-terex-accent/30 rounded-full" />
              </div>
              <div className="absolute inset-8 animate-spin-reverse">
                <div className="w-full h-full border border-dashed border-blue-400/20 rounded-full" />
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B968F" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#3B968F" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                {[...Array(6)].map((_, i) => (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + 40 * Math.cos(i * Math.PI / 3)}%`}
                    y2={`${50 + 40 * Math.sin(i * Math.PI / 3)}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
