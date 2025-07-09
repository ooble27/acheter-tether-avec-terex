
import React from 'react';

export function AirplaneMockup() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* Arrière-plan avec dégradé et particules */}
      <div className="absolute inset-0 bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
        {/* Particules flottantes */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-terex-accent rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-terex-accent rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-terex-accent rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
        <div className="absolute top-60 left-60 w-1 h-1 bg-terex-accent rounded-full animate-pulse opacity-30 animation-delay-3000"></div>
      </div>

      {/* Container de l'avion */}
      <div className="relative">
        
        {/* Trails de l'avion */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-32">
          <div className="flex space-x-2">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-terex-accent opacity-60 animate-pulse"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-terex-accent opacity-40 animate-pulse animation-delay-500"></div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-terex-accent opacity-30 animate-pulse animation-delay-1000"></div>
          </div>
        </div>

        {/* SVG de l'avion */}
        <div className="airplane-container transform hover:scale-110 transition-transform duration-500 cursor-pointer">
          <svg 
            width="300" 
            height="200" 
            viewBox="0 0 300 200" 
            className="airplane-svg filter drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="airplaneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B968F" />
                <stop offset="50%" stopColor="#4BA89F" />
                <stop offset="100%" stopColor="#5BC1B8" />
              </linearGradient>
              <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2D7A73" />
                <stop offset="100%" stopColor="#3B968F" />
              </linearGradient>
            </defs>
            
            {/* Corps de l'avion */}
            <ellipse cx="180" cy="100" rx="80" ry="12" fill="url(#airplaneGradient)" />
            
            {/* Nez de l'avion */}
            <ellipse cx="250" cy="100" rx="20" ry="8" fill="#5BC1B8" />
            
            {/* Ailes principales */}
            <ellipse cx="150" cy="100" rx="60" ry="6" fill="url(#wingGradient)" />
            
            {/* Ailes arrière */}
            <ellipse cx="120" cy="100" rx="30" ry="4" fill="url(#wingGradient)" />
            
            {/* Queue */}
            <ellipse cx="100" cy="100" rx="15" ry="8" fill="url(#airplaneGradient)" />
            
            {/* Fenêtres */}
            <circle cx="200" cy="100" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="190" cy="100" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="180" cy="100" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="170" cy="100" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="160" cy="100" r="3" fill="#ffffff" opacity="0.8" />
            
            {/* Hélice (optionnel, pour un effet rétro) */}
            <g className="propeller animate-spin" style={{ transformOrigin: '250px 100px' }}>
              <line x1="250" y1="92" x2="250" y2="108" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
              <line x1="242" y1="100" x2="258" y2="100" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            </g>
          </svg>
        </div>

        {/* Nuages décoratifs */}
        <div className="absolute -top-10 -right-20 opacity-20">
          <svg width="80" height="40" viewBox="0 0 80 40">
            <ellipse cx="20" cy="25" rx="15" ry="8" fill="#ffffff" />
            <ellipse cx="35" cy="20" rx="20" ry="12" fill="#ffffff" />
            <ellipse cx="55" cy="25" rx="18" ry="10" fill="#ffffff" />
          </svg>
        </div>
        
        <div className="absolute -bottom-16 -left-16 opacity-15">
          <svg width="60" height="30" viewBox="0 0 60 30">
            <ellipse cx="15" cy="20" rx="12" ry="6" fill="#ffffff" />
            <ellipse cx="28" cy="16" rx="16" ry="9" fill="#ffffff" />
            <ellipse cx="45" cy="20" rx="14" ry="8" fill="#ffffff" />
          </svg>
        </div>

        {/* Destinations - Points flottants */}
        <div className="absolute -top-8 right-16 text-terex-accent text-sm font-semibold animate-bounce">
          ✈️ Sénégal
        </div>
        <div className="absolute top-20 -right-12 text-terex-accent text-sm font-semibold animate-bounce animation-delay-1000">
          ✈️ Mali  
        </div>
        <div className="absolute -bottom-8 right-8 text-terex-accent text-sm font-semibold animate-bounce animation-delay-2000">
          ✈️ Burkina
        </div>
        <div className="absolute bottom-16 -left-8 text-terex-accent text-sm font-semibold animate-bounce animation-delay-3000">
          ✈️ Nigeria
        </div>
      </div>

      {/* Effet de lueur */}
      <div className="absolute inset-0 bg-gradient-radial from-terex-accent/10 via-transparent to-transparent opacity-50"></div>
    </div>
  );
}
