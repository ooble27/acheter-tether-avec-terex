
import React from 'react';

export function CryptoVisualization() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000">
      {/* Main container with 3D perspective */}
      <div className="crypto-visualization-container">
        
        {/* Ambient lighting effects */}
        <div className="ambient-lights">
          <div className="light-orb light-1"></div>
          <div className="light-orb light-2"></div>
          <div className="light-orb light-3"></div>
        </div>
        
        {/* Central concentric circles with 3D depth */}
        <div className="crypto-circles">
          <div className="crypto-circle circle-1"></div>
          <div className="crypto-circle circle-2"></div>
          <div className="crypto-circle circle-3"></div>
          <div className="crypto-circle circle-4"></div>
        </div>
        
        {/* Central USDT logo with advanced 3D glow */}
        <div className="central-usdt-logo">
          <div className="usdt-glow-effect">
            <svg className="w-16 h-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.145 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
        </div>
        
        {/* Floating hexagons with 3D transforms */}
        <div className="floating-hexagons">
          <div className="hexagon hex-1">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg className="w-6 h-6 text-terex-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-2">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg className="w-6 h-6 text-terex-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-3">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg className="w-6 h-6 text-terex-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-4">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg className="w-6 h-6 text-terex-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-5">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg className="w-6 h-6 text-terex-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hexagon hex-6">
            <div className="hexagon-inner">
              <div className="hexagon-face hexagon-face-front">
                <div className="hexagon-content">
                  <svg className="w-6 h-6 text-terex-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Connection lines with SVG */}
        <div className="connection-lines">
          <svg className="connections-svg" width="400" height="400" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 150, 143, 0.8)" />
                <stop offset="50%" stopColor="rgba(75, 168, 159, 0.6)" />
                <stop offset="100%" stopColor="rgba(91, 193, 184, 0.4)" />
              </linearGradient>
            </defs>
            
            <line className="connection-line line-1" x1="80" y1="120" x2="200" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line className="connection-line line-2" x1="320" y1="140" x2="200" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line className="connection-line line-3" x1="80" y1="280" x2="200" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line className="connection-line line-4" x1="320" y1="300" x2="200" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line className="connection-line line-5" x1="40" y1="200" x2="200" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line className="connection-line line-6" x1="140" y1="80" x2="200" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
          </svg>
        </div>
        
        {/* 3D floating particles */}
        <div className="floating-particles">
          <div className="particle-3d particle-1"></div>
          <div className="particle-3d particle-2"></div>
          <div className="particle-3d particle-3"></div>
          <div className="particle-3d particle-4"></div>
          <div className="particle-3d particle-5"></div>
          <div className="particle-3d particle-6"></div>
          <div className="particle-3d particle-7"></div>
          <div className="particle-3d particle-8"></div>
        </div>
        
        {/* Data points with glassmorphism */}
        <div className="floating-data">
          <div className="glass-morphism data-1">$1.00</div>
          <div className="glass-morphism data-2">24/7</div>
          <div className="glass-morphism data-3">0.1%</div>
          <div className="glass-morphism data-4">Instant</div>
        </div>
      </div>
    </div>
  );
}
