
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  minDuration = 2000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Attendre que l'animation de sortie se termine
      setTimeout(onComplete, 500);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [onComplete, minDuration]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-terex-dark via-terex-dark to-gray-900 transition-all duration-500 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-terex-primary/10 rounded-full blur-3xl animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-terex-primary/5 rounded-full blur-3xl animate-pulse -bottom-48 -right-48" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center">
        {/* Logo container avec animation */}
        <div className="mb-8 animate-bounce">
          <div className="relative">
            {/* Cercle de fond animé */}
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-terex-primary to-terex-primary/80 rounded-full animate-pulse"></div>
            
            {/* Logo Terex */}
            <div className="relative z-10 w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
              <img 
                src="/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png" 
                alt="Terex" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Nom de l'application */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            Terex
          </h1>
          <p className="text-terex-primary text-lg font-medium opacity-90">
            Échange & Transferts
          </p>
        </div>

        {/* Indicateur de chargement */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="w-32 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-terex-primary to-terex-primary/80 rounded-full animate-pulse" style={{
              animation: 'loadingBar 2s ease-in-out infinite'
            }}></div>
          </div>
        </div>
      </div>

      {/* Animation CSS personnalisée */}
      <style>{`
        @keyframes loadingBar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 50%;
            margin-left: 25%;
          }
          100% {
            width: 100%;
            margin-left: 0%;
          }
        }
      `}</style>
    </div>
  );
};
