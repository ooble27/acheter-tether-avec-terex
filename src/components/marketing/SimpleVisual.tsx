
import React from 'react';

export function SimpleVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Container 3D avec perspective */}
      <div className="relative w-80 h-80 lg:w-96 lg:h-96" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
        
        {/* Logo USDT central en 3D */}
        <div className="absolute top-1/2 left-1/2 z-20" style={{ 
          transform: 'translate(-50%, -50%) rotateX(15deg) rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}>
          <div className="relative">
            {/* Face avant */}
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-xl flex items-center justify-center shadow-2xl shadow-terex-accent/40 animate-pulse">
              <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
              </svg>
            </div>
            {/* Face arrière pour effet 3D */}
            <div className="absolute top-0 left-0 w-20 h-20 lg:w-24 lg:h-24 bg-terex-accent/40 rounded-xl" style={{
              transform: 'translateZ(-8px)',
              zIndex: -1
            }}></div>
          </div>
        </div>

        {/* Cubes flottants en 3D */}
        <div className="absolute top-16 left-16" style={{
          transform: 'rotateX(45deg) rotateY(45deg)',
          transformStyle: 'preserve-3d',
          animation: 'float3D 6s ease-in-out infinite'
        }}>
          <div className="relative">
            {/* Face avant */}
            <div className="w-12 h-12 bg-terex-accent/30 border border-terex-accent/50 rounded-lg"></div>
            {/* Face droite */}
            <div className="absolute top-0 left-12 w-12 h-12 bg-terex-accent/20 border border-terex-accent/50 rounded-lg origin-left" style={{
              transform: 'rotateY(90deg)'
            }}></div>
            {/* Face haut */}
            <div className="absolute -top-12 left-0 w-12 h-12 bg-terex-accent/40 border border-terex-accent/50 rounded-lg origin-bottom" style={{
              transform: 'rotateX(90deg)'
            }}></div>
          </div>
        </div>

        <div className="absolute top-16 right-16" style={{
          transform: 'rotateX(-30deg) rotateY(-45deg)',
          transformStyle: 'preserve-3d',
          animation: 'float3D 8s ease-in-out infinite 1s'
        }}>
          <div className="relative">
            {/* Face avant */}
            <div className="w-10 h-10 bg-terex-accent/25 border border-terex-accent/40 rounded-md"></div>
            {/* Face droite */}
            <div className="absolute top-0 left-10 w-10 h-10 bg-terex-accent/15 border border-terex-accent/40 rounded-md origin-left" style={{
              transform: 'rotateY(90deg)'
            }}></div>
            {/* Face haut */}
            <div className="absolute -top-10 left-0 w-10 h-10 bg-terex-accent/35 border border-terex-accent/40 rounded-md origin-bottom" style={{
              transform: 'rotateX(90deg)'
            }}></div>
          </div>
        </div>

        <div className="absolute bottom-16 left-20" style={{
          transform: 'rotateX(60deg) rotateY(30deg)',
          transformStyle: 'preserve-3d',
          animation: 'float3D 7s ease-in-out infinite 2s'
        }}>
          <div className="relative">
            {/* Face avant */}
            <div className="w-8 h-8 bg-terex-accent/35 border border-terex-accent/60 rounded"></div>
            {/* Face droite */}
            <div className="absolute top-0 left-8 w-8 h-8 bg-terex-accent/25 border border-terex-accent/60 rounded origin-left" style={{
              transform: 'rotateY(90deg)'
            }}></div>
            {/* Face haut */}
            <div className="absolute -top-8 left-0 w-8 h-8 bg-terex-accent/45 border border-terex-accent/60 rounded origin-bottom" style={{
              transform: 'rotateX(90deg)'
            }}></div>
          </div>
        </div>

        <div className="absolute bottom-20 right-20" style={{
          transform: 'rotateX(-45deg) rotateY(60deg)',
          transformStyle: 'preserve-3d',
          animation: 'float3D 9s ease-in-out infinite 3s'
        }}>
          <div className="relative">
            {/* Face avant */}
            <div className="w-14 h-14 bg-terex-accent/20 border border-terex-accent/30 rounded-lg"></div>
            {/* Face droite */}
            <div className="absolute top-0 left-14 w-14 h-14 bg-terex-accent/10 border border-terex-accent/30 rounded-lg origin-left" style={{
              transform: 'rotateY(90deg)'
            }}></div>
            {/* Face haut */}
            <div className="absolute -top-14 left-0 w-14 h-14 bg-terex-accent/30 border border-terex-accent/30 rounded-lg origin-bottom" style={{
              transform: 'rotateX(90deg)'
            }}></div>
          </div>
        </div>

        {/* Lignes de connexion 3D */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <linearGradient id="line3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 150, 143, 0.8)" />
              <stop offset="50%" stopColor="rgba(59, 150, 143, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 150, 143, 0.8)" />
            </linearGradient>
          </defs>
          
          <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="url(#line3D)" strokeWidth="2" opacity="0.6" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="url(#line3D)" strokeWidth="2" opacity="0.6" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="30%" y2="75%" stroke="url(#line3D)" strokeWidth="2" opacity="0.6" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="url(#line3D)" strokeWidth="2" opacity="0.6" className="animate-pulse" />
        </svg>

        {/* Particules 3D flottantes */}
        <div className="absolute top-8 left-12 w-2 h-2 bg-terex-accent rounded-full" style={{
          transform: 'translateZ(50px)',
          animation: 'particle3D 12s linear infinite'
        }}></div>
        <div className="absolute top-20 right-8 w-1 h-1 bg-terex-accent rounded-full" style={{
          transform: 'translateZ(30px)',
          animation: 'particle3D 15s linear infinite reverse'
        }}></div>
        <div className="absolute bottom-12 left-8 w-3 h-3 bg-terex-accent/70 rounded-full" style={{
          transform: 'translateZ(40px)',
          animation: 'particle3D 10s linear infinite'
        }}></div>

        {/* Effet de lueur d'arrière-plan */}
        <div className="absolute inset-0 bg-gradient-radial from-terex-accent/10 via-transparent to-transparent blur-3xl"></div>

        {/* Informations flottantes en 3D */}
        <div className="absolute top-6 right-6 text-xs text-terex-accent/80 font-mono" style={{
          transform: 'translateZ(20px)',
          animation: 'dataFloat3D 8s ease-in-out infinite'
        }}>
          USDT
        </div>
        <div className="absolute bottom-6 left-6 text-xs text-terex-accent/80 font-mono" style={{
          transform: 'translateZ(25px)',
          animation: 'dataFloat3D 10s ease-in-out infinite 2s'
        }}>
          TRC20
        </div>
        <div className="absolute top-12 left-6 text-xs text-terex-accent/80 font-mono" style={{
          transform: 'translateZ(15px)',
          animation: 'dataFloat3D 6s ease-in-out infinite 1s'
        }}>
          ERC20
        </div>
      </div>

      <style jsx>{`
        @keyframes float3D {
          0%, 100% {
            transform: rotateX(45deg) rotateY(45deg) translateY(0px) translateZ(0px);
          }
          33% {
            transform: rotateX(60deg) rotateY(60deg) translateY(-15px) translateZ(20px);
          }
          66% {
            transform: rotateX(30deg) rotateY(30deg) translateY(-8px) translateZ(-10px);
          }
        }

        @keyframes particle3D {
          0% {
            transform: translateZ(50px) translateY(0px) translateX(0px) rotateY(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateZ(100px) translateY(-20px) translateX(10px) rotateY(180deg);
            opacity: 1;
          }
          100% {
            transform: translateZ(50px) translateY(0px) translateX(0px) rotateY(360deg);
            opacity: 0.8;
          }
        }

        @keyframes dataFloat3D {
          0%, 100% {
            transform: translateZ(20px) translateY(0px);
            opacity: 0.8;
          }
          50% {
            transform: translateZ(40px) translateY(-12px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
