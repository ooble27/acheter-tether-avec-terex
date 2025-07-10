
import React from 'react';

export function SimpleVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Container 3D principal */}
      <div className="relative w-full h-full max-w-md lg:max-w-lg" style={{ 
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}>
        
        {/* USDT Logo central en 3D */}
        <div className="absolute top-1/2 left-1/2 z-30" style={{
          transform: 'translate(-50%, -50%) rotateX(20deg) rotateY(-10deg)',
          transformStyle: 'preserve-3d',
          animation: 'float3D 4s ease-in-out infinite'
        }}>
          <div className="relative">
            {/* Face principale */}
            <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-terex-accent via-terex-accent/90 to-terex-accent/70 rounded-2xl flex items-center justify-center shadow-2xl shadow-terex-accent/50" style={{
              transform: 'translateZ(20px)'
            }}>
              <svg className="w-12 h-12 lg:w-14 lg:h-14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
              </svg>
            </div>
            {/* Faces latérales pour effet 3D */}
            <div className="absolute top-0 left-0 w-24 h-24 lg:w-28 lg:h-28 bg-terex-accent/40 rounded-2xl" style={{
              transform: 'translateZ(-10px)',
              zIndex: -1
            }}></div>
            <div className="absolute top-0 left-0 w-24 h-24 lg:w-28 lg:h-28 bg-terex-accent/60 rounded-2xl" style={{
              transform: 'rotateY(90deg) translateZ(12px)',
              zIndex: -1
            }}></div>
          </div>
        </div>

        {/* Formes géométriques flottantes en 3D */}
        <div className="absolute top-16 left-8" style={{
          transform: 'rotateX(45deg) rotateY(30deg)',
          transformStyle: 'preserve-3d',
          animation: 'geometric3DFloat 8s ease-in-out infinite'
        }}>
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-terex-accent/40 to-terex-accent/20 rounded-xl border border-terex-accent/30" style={{
              transform: 'translateZ(15px)'
            }}></div>
            <div className="absolute top-0 left-0 w-16 h-16 bg-terex-accent/20 rounded-xl" style={{
              transform: 'translateZ(-5px)'
            }}></div>
          </div>
        </div>

        <div className="absolute top-20 right-8" style={{
          transform: 'rotateX(-30deg) rotateY(-45deg)',
          transformStyle: 'preserve-3d',
          animation: 'geometric3DFloat 6s ease-in-out infinite 1s'
        }}>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-terex-accent/35 to-terex-accent/15 rounded-lg border border-terex-accent/25" style={{
              transform: 'translateZ(12px)'
            }}></div>
            <div className="absolute top-0 left-0 w-12 h-12 bg-terex-accent/15 rounded-lg" style={{
              transform: 'translateZ(-8px)'
            }}></div>
          </div>
        </div>

        <div className="absolute bottom-20 left-12" style={{
          transform: 'rotateX(60deg) rotateY(20deg)',
          transformStyle: 'preserve-3d',
          animation: 'geometric3DFloat 10s ease-in-out infinite 2s'
        }}>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-terex-accent/30 to-terex-accent/10 rounded border border-terex-accent/20" style={{
              transform: 'translateZ(8px)'
            }}></div>
            <div className="absolute top-0 left-0 w-10 h-10 bg-terex-accent/10 rounded" style={{
              transform: 'translateZ(-6px)'
            }}></div>
          </div>
        </div>

        <div className="absolute bottom-16 right-16" style={{
          transform: 'rotateX(-20deg) rotateY(50deg)',
          transformStyle: 'preserve-3d',
          animation: 'geometric3DFloat 7s ease-in-out infinite 3s'
        }}>
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-terex-accent/25 to-terex-accent/10 rounded-xl border border-terex-accent/20" style={{
              transform: 'translateZ(10px)'
            }}></div>
            <div className="absolute top-0 left-0 w-14 h-14 bg-terex-accent/10 rounded-xl" style={{
              transform: 'translateZ(-7px)'
            }}></div>
          </div>
        </div>

        {/* Lignes de connexion 3D */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" style={{ zIndex: 20 }}>
          <defs>
            <linearGradient id="connection3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 150, 143, 0.8)" />
              <stop offset="50%" stopColor="rgba(59, 150, 143, 0.2)" />
              <stop offset="100%" stopColor="rgba(59, 150, 143, 0.8)" />
            </linearGradient>
          </defs>
          
          <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#connection3D)" strokeWidth="2" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="url(#connection3D)" strokeWidth="2" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="25%" y2="80%" stroke="url(#connection3D)" strokeWidth="2" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="85%" y2="75%" stroke="url(#connection3D)" strokeWidth="2" className="animate-pulse" />
        </svg>

        {/* Particules 3D */}
        <div className="absolute top-12 left-16 w-2 h-2 bg-terex-accent rounded-full opacity-80" style={{
          transform: 'translateZ(30px)',
          animation: 'particle3DMove 12s linear infinite'
        }}></div>
        <div className="absolute top-32 right-12 w-1 h-1 bg-terex-accent/80 rounded-full" style={{
          transform: 'translateZ(25px)',
          animation: 'particle3DMove 15s linear infinite reverse'
        }}></div>
        <div className="absolute bottom-24 left-8 w-3 h-3 bg-terex-accent/60 rounded-full" style={{
          transform: 'translateZ(20px)',
          animation: 'particle3DMove 10s linear infinite 2s'
        }}></div>

        {/* Labels de données flottants */}
        <div className="absolute top-8 right-4 text-xs text-terex-accent/90 font-mono backdrop-blur-sm bg-terex-dark/20 px-2 py-1 rounded" style={{
          transform: 'translateZ(15px)',
          animation: 'dataLabel3D 8s ease-in-out infinite'
        }}>
          USDT
        </div>
        <div className="absolute bottom-8 left-4 text-xs text-terex-accent/90 font-mono backdrop-blur-sm bg-terex-dark/20 px-2 py-1 rounded" style={{
          transform: 'translateZ(18px)',
          animation: 'dataLabel3D 10s ease-in-out infinite 1s'
        }}>
          TRC20
        </div>
        <div className="absolute top-16 left-4 text-xs text-terex-accent/90 font-mono backdrop-blur-sm bg-terex-dark/20 px-2 py-1 rounded" style={{
          transform: 'translateZ(12px)',
          animation: 'dataLabel3D 6s ease-in-out infinite 2s'
        }}>
          ERC20
        </div>

        {/* Effet de lueur d'arrière-plan */}
        <div className="absolute inset-0 bg-gradient-radial from-terex-accent/10 via-transparent to-transparent blur-2xl opacity-60"></div>
      </div>
    </div>
  );
}
