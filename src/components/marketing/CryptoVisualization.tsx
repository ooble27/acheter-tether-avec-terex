
import React from 'react';

export function CryptoVisualization() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Container principal */}
      <div className="crypto-visualization-container relative">
        
        {/* Cercles concentriques animés */}
        <div className="crypto-circles">
          <div className="crypto-circle circle-1"></div>
          <div className="crypto-circle circle-2"></div>
          <div className="crypto-circle circle-3"></div>
          <div className="crypto-circle circle-4"></div>
        </div>

        {/* Logo USDT central */}
        <div className="central-usdt-logo">
          <div className="usdt-glow-effect">
            <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Hexagones flottants avec icônes */}
        <div className="floating-hexagons">
          <div className="hexagon hex-1">
            <div className="hexagon-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="hexagon hex-2">
            <div className="hexagon-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#3B968F" strokeWidth="2"/>
                <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 9H9.01" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M15 9H15.01" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          
          <div className="hexagon hex-3">
            <div className="hexagon-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="#3B968F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B968F" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          <div className="hexagon hex-4">
            <div className="hexagon-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#3B968F" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="hexagon hex-5">
            <div className="hexagon-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6M6.41 6.41L9.18 9.18M2 12H6M6.41 17.59L9.18 14.82M12 18V22M17.59 17.59L14.82 14.82M22 12H18M17.59 6.41L14.82 9.18" stroke="#3B968F" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          
          <div className="hexagon hex-6">
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

        {/* Lignes de connexion animées */}
        <div className="connection-lines">
          <svg className="connections-svg" width="100%" height="100%" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B968F" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#4BA89F" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#5BC1B8" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            <path className="connection-line line-1" d="M200,200 Q150,100 100,150" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
            <path className="connection-line line-2" d="M200,200 Q300,100 350,150" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
            <path className="connection-line line-3" d="M200,200 Q100,300 150,350" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
            <path className="connection-line line-4" d="M200,200 Q300,300 250,350" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
            <path className="connection-line line-5" d="M200,200 Q200,100 200,50" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
            <path className="connection-line line-6" d="M200,200 Q200,300 200,350" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* Particules flottantes */}
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
          <div className="particle particle-7"></div>
          <div className="particle particle-8"></div>
        </div>

        {/* Données flottantes */}
        <div className="floating-data">
          <div className="data-point data-1">24/7</div>
          <div className="data-point data-2">0%</div>
          <div className="data-point data-3">5min</div>
          <div className="data-point data-4">6 pays</div>
        </div>
      </div>
    </div>
  );
}
