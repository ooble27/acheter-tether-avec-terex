
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
      {/* Contenu principal */}
      <div className="relative z-10 text-center">
        {/* Logo container avec animation */}
        <div className="mb-8 animate-bounce">
          <div className="relative">
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
        </div>
      </div>
    </div>
  );
};
