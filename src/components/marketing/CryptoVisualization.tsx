
import React from 'react';

export function CryptoVisualization() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Container principal avec perspective 3D */}
      <div className="crypto-visualization-container relative transform-gpu">
        
        {/* Fond dégradé radial */}
        <div className="absolute inset-0 bg-gradient-radial from-terex-accent/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        
        {/* Cercles concentriques animés avec profondeur */}
        <div className="crypto-circles">
          <div className="crypto-circle circle-1 shadow-lg shadow-terex-accent/20"></div>
          <div className="crypto-circle circle-2 shadow-md shadow-terex-accent/15"></div>
          <div className="crypto-circle circle-3 shadow-sm shadow-terex-accent/10"></div>
          <div className="crypto-circle circle-4 shadow-xs shadow-terex-accent/5"></div>
        </div>

        {/* Logo USDT central avec effet 3D */}
        <div className="central-usdt-logo">
          <div className="usdt-glow-effect shadow-2xl shadow-terex-accent/30">
            <div className="relative">
              {/* Ombre portée du logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-terex-accent/20 to-transparent rounded-full blur-xl transform translate-y-2"></div>
              <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-lg">
                <defs>
                  <linearGradient id="usdtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#26A17B"/>
                    <stop offset="50%" stopColor="#2EBF91"/>
                    <stop offset="100%" stopColor="#26A17B"/>
                  </linearGradient>
                  <filter id="usdtShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#26A17B" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#usdtGradient)" filter="url(#usdtShadow)"/>
                <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white" filter="url(#textShadow)"/>
                <filter id="textShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
                </filter>
              </svg>
            </div>
          </div>
        </div>

        {/* Hexagones flottants avec effet 3D */}
        <div className="floating-hexagons">
          <div className="hexagon hex-1 transform-gpu">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-2 transform-gpu">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#3B968F" strokeWidth="2"/>
                    <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 9H9.01" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15 9H15.01" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-3 transform-gpu">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="#3B968F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B968F" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-4 transform-gpu">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-5 transform-gpu">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6M6.41 6.41L9.18 9.18M2 12H6M6.41 17.59L9.18 14.82M12 18V22M17.59 17.59L14.82 14.82M22 12H18M17.59 6.41L14.82 9.18" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-6 transform-gpu">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="7" height="7" rx="1" stroke="#3B968F" strokeWidth="2"/>
                    <rect x="14" y="4" width="7" height="7" rx="1" stroke="#3B968F" strokeWidth="2"/>
                    <rect x="14" y="13" width="7" height="7" rx="1" stroke="#3B968F" strokeWidth="2"/>
                    <rect x="3" y="13" width="7" height="7" rx="1" stroke="#3B968F" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lignes de connexion 3D animées */}
        <div className="connection-lines">
          <svg className="connections-svg" width="100%" height="100%" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="lineGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B968F" stopOpacity="0.9"/>
                <stop offset="30%" stopColor="#4BA89F" stopOpacity="0.7"/>
                <stop offset="70%" stopColor="#5BC1B8" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#6DD5CC" stopOpacity="0.2"/>
              </linearGradient>
              <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <path className="connection-line line-1" d="M200,200 Q150,100 100,150" stroke="url(#lineGradient3D)" strokeWidth="3" fill="none" filter="url(#lineGlow)"/>
            <path className="connection-line line-2" d="M200,200 Q300,100 350,150" stroke="url(#lineGradient3D)" strokeWidth="3" fill="none" filter="url(#lineGlow)"/>
            <path className="connection-line line-3" d="M200,200 Q100,300 150,350" stroke="url(#lineGradient3D)" strokeWidth="3" fill="none" filter="url(#lineGlow)"/>
            <path className="connection-line line-4" d="M200,200 Q300,300 250,350" stroke="url(#lineGradient3D)" strokeWidth="3" fill="none" filter="url(#lineGlow)"/>
            <path className="connection-line line-5" d="M200,200 Q200,100 200,50" stroke="url(#lineGradient3D)" strokeWidth="3" fill="none" filter="url(#lineGlow)"/>
            <path className="connection-line line-6" d="M200,200 Q200,300 200,350" stroke="url(#lineGradient3D)" strokeWidth="3" fill="none" filter="url(#lineGlow)"/>
          </svg>
        </div>

        {/* Particules flottantes 3D */}
        <div className="floating-particles">
          <div className="particle particle-1 particle-3d"></div>
          <div className="particle particle-2 particle-3d"></div>
          <div className="particle particle-3 particle-3d"></div>
          <div className="particle particle-4 particle-3d"></div>
          <div className="particle particle-5 particle-3d"></div>
          <div className="particle particle-6 particle-3d"></div>
          <div className="particle particle-7 particle-3d"></div>
          <div className="particle particle-8 particle-3d"></div>
        </div>

        {/* Données flottantes avec style glassmorphism */}
        <div className="floating-data">
          <div className="data-point data-1 glass-morphism">24/7</div>
          <div className="data-point data-2 glass-morphism">0%</div>
          <div className="data-point data-3 glass-morphism">5min</div>
          <div className="data-point data-4 glass-morphism">6 pays</div>
        </div>

        {/* Effets de lumière ambiante */}
        <div className="ambient-lights">
          <div className="light-orb light-1"></div>
          <div className="light-orb light-2"></div>
          <div className="light-orb light-3"></div>
        </div>
      </div>
    </div>
  );
}
