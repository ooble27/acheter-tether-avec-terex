
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PhoneMockup } from './PhoneMockup';
import { DeviceMockups } from './DeviceMockups';

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
    <div className="relative min-h-screen bg-terex-dark overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-terex-accent/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-terex-teal/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-terex-accent/5 to-transparent rounded-full" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,150,143,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,150,143,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Mobile mockup */}
            <div className="lg:hidden mb-8">
              <DeviceMockups />
            </div>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terex-accent/10 border border-terex-accent/20 mb-8">
              <Zap className="w-4 h-4 text-terex-accent" />
              <span className="text-terex-accent text-sm">La plateforme #1 en Afrique</span>
            </div>
            
            <div className="hidden lg:block">
              <DeviceMockups />
            </div>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Achetez, vendez des USDT et envoyez de l'argent vers l'Afrique
              <span className="text-terex-accent"> instantanément</span>. 
              Rapide, sécurisé, sans commission cachée.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center lg:justify-start">
              {user ? (
                <Button 
                  onClick={handleDashboard}
                  size="lg" 
                  className="group bg-terex-accent hover:bg-terex-accent/90 text-black px-8 py-6 text-lg rounded-2xl shadow-[0_0_40px_rgba(59,150,143,0.3)] hover:shadow-[0_0_60px_rgba(59,150,143,0.5)] transition-all duration-500"
                >
                  Aller au Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="group bg-terex-accent hover:bg-terex-accent/90 text-black px-8 py-6 text-lg rounded-2xl shadow-[0_0_40px_rgba(59,150,143,0.3)] hover:shadow-[0_0_60px_rgba(59,150,143,0.5)] transition-all duration-500"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              <Button 
                onClick={handleHowItWorks}
                variant="ghost" 
                size="lg"
                className="text-gray-300 hover:text-white hover:bg-white/5 px-8 py-6 text-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                Comment ça marche ?
              </Button>
            </div>
            
            {/* Stats inline */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12">
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl text-white mb-1">
                  <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">5</span>
                  <span className="text-gray-400 text-lg ml-1">min</span>
                </div>
                <div className="text-sm text-gray-500">Transfert rapide</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-terex-accent/30 to-transparent hidden sm:block" />
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl text-white mb-1">
                  <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">6</span>
                  <span className="text-gray-400 text-lg ml-1">pays</span>
                </div>
                <div className="text-sm text-gray-500">Supportés</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-terex-accent/30 to-transparent hidden sm:block" />
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl text-white mb-1">
                  <span className="bg-gradient-to-r from-terex-accent to-terex-teal bg-clip-text text-transparent">24/7</span>
                </div>
                <div className="text-sm text-gray-500">Disponibilité</div>
              </div>
            </div>
          </div>
          
          {/* Right - Phone Mockup (Desktop only) */}
          <div className="hidden lg:flex justify-center order-1 lg:order-2">
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-gradient-to-b from-terex-accent/20 to-terex-teal/20 blur-[100px] scale-150" />
              <PhoneMockup />
            </div>
          </div>
        </div>
        
        {/* Features ribbon */}
        <div className="mt-20 lg:mt-32">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 lg:gap-20">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terex-accent/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                  alt="USDT" 
                  className="w-8 h-8"
                />
              </div>
              <div>
                <div className="text-white text-lg">Échange USDT</div>
                <div className="text-gray-500 text-sm">Meilleurs taux</div>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terex-accent/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7 text-terex-accent" />
              </div>
              <div>
                <div className="text-white text-lg">Transferts Afrique</div>
                <div className="text-gray-500 text-sm">6 pays couverts</div>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terex-accent/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-terex-accent" />
              </div>
              <div>
                <div className="text-white text-lg">100% Sécurisé</div>
                <div className="text-gray-500 text-sm">Chiffrement 256-bit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
