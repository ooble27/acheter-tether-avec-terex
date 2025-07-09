
import React from 'react';

export function AfricaMap3D() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
      {/* Container principal avec perspective 3D */}
      <div className="africa-map-container relative">
        {/* Carte de l'Afrique stylisée */}
        <div className="africa-map">
          <svg
            viewBox="0 0 400 500"
            className="w-80 h-96 lg:w-96 lg:h-[480px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gradient définitions */}
            <defs>
              <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B968F" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#4BA89F" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#5BC1B8" stopOpacity="0.4"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Forme simplifiée de l'Afrique */}
            <path
              d="M200 50 
                 C220 45, 240 50, 260 65
                 C280 80, 300 100, 310 130
                 C320 160, 325 200, 330 240
                 C335 280, 340 320, 335 360
                 C330 400, 320 440, 300 470
                 C280 485, 250 490, 220 485
                 C190 480, 160 470, 140 450
                 C120 430, 100 400, 85 360
                 C70 320, 65 280, 70 240
                 C75 200, 85 160, 100 130
                 C115 100, 135 80, 160 65
                 C180 50, 190 48, 200 50 Z"
              fill="url(#africaGradient)"
              stroke="#3B968F"
              strokeWidth="2"
              filter="url(#glow)"
              className="africa-continent"
            />
          </svg>
          
          {/* Points lumineux pour les pays */}
          <div className="absolute inset-0">
            {/* Sénégal */}
            <div className="country-point senegal">
              <div className="pulse-dot"></div>
              <span className="country-label">Sénégal</span>
            </div>
            
            {/* Côte d'Ivoire */}
            <div className="country-point ivory-coast">
              <div className="pulse-dot"></div>
              <span className="country-label">Côte d'Ivoire</span>
            </div>
            
            {/* Mali */}
            <div className="country-point mali">
              <div className="pulse-dot"></div>
              <span className="country-label">Mali</span>
            </div>
            
            {/* Burkina Faso */}
            <div className="country-point burkina">
              <div className="pulse-dot"></div>
              <span className="country-label">Burkina Faso</span>
            </div>
            
            {/* Niger */}
            <div className="country-point niger">
              <div className="pulse-dot"></div>
              <span className="country-label">Niger</span>
            </div>
          </div>
          
          {/* Flux d'USDT animés */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Flux 1 */}
            <div className="usdt-flow flow-1">
              <div className="usdt-particle">USDT</div>
            </div>
            
            {/* Flux 2 */}
            <div className="usdt-flow flow-2">
              <div className="usdt-particle">USDT</div>
            </div>
            
            {/* Flux 3 */}
            <div className="usdt-flow flow-3">
              <div className="usdt-particle">USDT</div>
            </div>
            
            {/* Flux 4 */}
            <div className="usdt-flow flow-4">
              <div className="usdt-particle">USDT</div>
            </div>
          </div>
        </div>
        
        {/* Effet de base avec ombre */}
        <div className="africa-shadow"></div>
      </div>
      
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-particle particle-1"></div>
        <div className="floating-particle particle-2"></div>
        <div className="floating-particle particle-3"></div>
        <div className="floating-particle particle-4"></div>
        <div className="floating-particle particle-5"></div>
      </div>
    </div>
  );
}
