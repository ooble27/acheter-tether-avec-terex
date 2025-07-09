
import React, { useRef, useEffect, useState } from 'react';

export function InteractiveGlobe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] lg:h-[700px] perspective-1000 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-terex-accent/5 via-transparent to-transparent" />
      
      {/* Main Interactive Globe */}
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
        style={{
          transform: `translate(-50%, -50%) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg) ${
            isHovered ? 'scale(1.1)' : 'scale(1)'
          }`
        }}
      >
        {/* Central Sphere with Terex Ecosystem */}
        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
          
          {/* Core Sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark border-2 border-terex-accent/30 shadow-2xl">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-terex-accent/10 to-transparent backdrop-blur-sm" />
            
            {/* Central Terex Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-full flex items-center justify-center shadow-lg shadow-terex-accent/50">
                <span className="text-black font-bold text-xl">T</span>
              </div>
            </div>
            
            {/* Energy Waves */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-terex-accent" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 rounded-full animate-ping opacity-15 bg-terex-accent" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
          
          {/* Orbital Rings */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute inset-0 rounded-full border border-terex-accent/20 animate-pulse" />
            <div className="absolute inset-8 rounded-full border border-terex-accent/15 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-16 rounded-full border border-terex-accent/10 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
        
        {/* Orbiting Currency Elements */}
        <div className="absolute inset-0">
          {/* USDT Orbit */}
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -ml-[250px] -mt-[250px] animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="usdt-particle">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* EUR Orbit */}
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[400px] -ml-[300px] -mt-[200px] animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="currency-particle">
                <span className="text-terex-accent font-bold text-lg">€</span>
              </div>
            </div>
          </div>
          
          {/* CFA Orbit */}
          <div className="absolute top-1/2 left-1/2 w-[450px] h-[600px] -ml-[225px] -mt-[300px] animate-spin" style={{ animationDuration: '30s' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="currency-particle">
                <span className="text-terex-accent font-bold text-sm">CFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Service Hexagons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="service-hexagon hex-position-1">
          <div className="hexagon-content">
            <div className="text-terex-accent text-xs font-semibold">Achat</div>
            <div className="text-terex-accent text-xs">USDT</div>
          </div>
        </div>
        
        <div className="service-hexagon hex-position-2">
          <div className="hexagon-content">
            <div className="text-terex-accent text-xs font-semibold">Vente</div>
            <div className="text-terex-accent text-xs">USDT</div>
          </div>
        </div>
        
        <div className="service-hexagon hex-position-3">
          <div className="hexagon-content">
            <div className="text-terex-accent text-xs font-semibold">Transfert</div>
            <div className="text-terex-accent text-xs">Afrique</div>
          </div>
        </div>
        
        <div className="service-hexagon hex-position-4">
          <div className="hexagon-content">
            <div className="text-terex-accent text-xs font-semibold">Échange</div>
            <div className="text-terex-accent text-xs">Rapide</div>
          </div>
        </div>
      </div>
      
      {/* Performance Indicators */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="performance-indicator">
          <div className="text-terex-accent text-xs font-semibold">Taux USDT</div>
          <div className="text-white text-sm">$1,00</div>
        </div>
        <div className="performance-indicator">
          <div className="text-terex-accent text-xs font-semibold">Volume 24h</div>
          <div className="text-white text-sm">2.4M€</div>
        </div>
      </div>
      
      {/* Transaction Timeline */}
      <div className="absolute bottom-4 right-4">
        <div className="transaction-timeline">
          <div className="timeline-item">
            <div className="timeline-dot animate-pulse" />
            <div className="text-terex-accent text-xs">Transfert vers Mali</div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="text-terex-accent text-xs">Achat USDT</div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="text-terex-accent text-xs">Échange EUR</div>
          </div>
        </div>
      </div>
      
      {/* Interactive Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 150, 143, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 150, 143, 0.2)" />
          </linearGradient>
        </defs>
        <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="url(#connectionGrad)" strokeWidth="1" className="animate-pulse" />
        <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="url(#connectionGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }} />
        <line x1="70%" y1="80%" x2="50%" y2="50%" stroke="url(#connectionGrad)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '2s' }} />
        <line x1="30%" y1="70%" x2="50%" y2="50%" stroke="url(#connectionGrad)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
      </svg>
      
      {/* Floating Data Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="data-particle particle-1">0.1%</div>
        <div className="data-particle particle-2">24/7</div>
        <div className="data-particle particle-3">Instant</div>
        <div className="data-particle particle-4">Sécurisé</div>
      </div>
    </div>
  );
}
