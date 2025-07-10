
import React from 'react';

export function SimpleVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Container principal */}
      <div className="relative w-80 h-80 lg:w-96 lg:h-96">
        
        {/* Hexagone central USDT */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-terex-accent/30 animate-pulse">
            <div className="w-16 h-16 lg:w-18 lg:h-18 bg-white/10 backdrop-blur-sm rounded-xl -rotate-45 flex items-center justify-center">
              <svg className="w-8 h-8 lg:w-10 lg:h-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Grille hexagonale */}
        <div className="absolute inset-0">
          {/* Hexagones de niveau 1 */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-terex-accent/20 border border-terex-accent/40 rounded-lg rotate-45 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-terex-accent/20 border border-terex-accent/40 rounded-lg rotate-45 animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-12 transform -translate-y-1/2">
            <div className="w-12 h-12 bg-terex-accent/20 border border-terex-accent/40 rounded-lg rotate-45 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-12 transform -translate-y-1/2">
            <div className="w-12 h-12 bg-terex-accent/20 border border-terex-accent/40 rounded-lg rotate-45 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-2 h-2 bg-terex-accent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Hexagones de niveau 2 */}
          <div className="absolute top-20 left-20">
            <div className="w-8 h-8 bg-terex-accent/15 border border-terex-accent/30 rounded-md rotate-45 animate-pulse" style={{animationDelay: '1.5s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-1 h-1 bg-terex-accent/70 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-20 right-20">
            <div className="w-8 h-8 bg-terex-accent/15 border border-terex-accent/30 rounded-md rotate-45 animate-pulse" style={{animationDelay: '2.5s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-1 h-1 bg-terex-accent/70 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-20 left-20">
            <div className="w-8 h-8 bg-terex-accent/15 border border-terex-accent/30 rounded-md rotate-45 animate-pulse" style={{animationDelay: '3s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-1 h-1 bg-terex-accent/70 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-20 right-20">
            <div className="w-8 h-8 bg-terex-accent/15 border border-terex-accent/30 rounded-md rotate-45 animate-pulse" style={{animationDelay: '0.8s'}}>
              <div className="w-full h-full flex items-center justify-center -rotate-45">
                <div className="w-1 h-1 bg-terex-accent/70 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lignes de connexion */}
        <svg className="absolute inset-0 w-full h-full" style={{zIndex: 1}}>
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 150, 143, 0.6)" />
              <stop offset="50%" stopColor="rgba(59, 150, 143, 0.2)" />
              <stop offset="100%" stopColor="rgba(59, 150, 143, 0.6)" />
            </linearGradient>
          </defs>
          
          {/* Connexions depuis le centre */}
          <line x1="50%" y1="50%" x2="50%" y2="12%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.7" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="50%" y2="88%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.7" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="12%" y2="50%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.7" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="88%" y2="50%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.7" className="animate-pulse" />
          
          {/* Connexions diagonales */}
          <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className="animate-pulse" />
        </svg>

        {/* Particules flottantes */}
        <div className="absolute top-8 left-8 w-1 h-1 bg-terex-accent rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-16 right-12 w-1 h-1 bg-terex-accent rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-10 left-16 w-1 h-1 bg-terex-accent rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-8 right-8 w-1 h-1 bg-terex-accent rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 left-4 w-1 h-1 bg-terex-accent rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 right-4 w-1 h-1 bg-terex-accent rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>

        {/* Effet de lueur d'arrière-plan */}
        <div className="absolute inset-0 bg-gradient-radial from-terex-accent/5 via-transparent to-transparent blur-2xl"></div>
        
        {/* Données flottantes */}
        <div className="absolute top-4 right-4 text-xs text-terex-accent/60 font-mono animate-pulse" style={{animationDelay: '0s'}}>
          $1.00
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-terex-accent/60 font-mono animate-pulse" style={{animationDelay: '2s'}}>
          24/7
        </div>
        <div className="absolute top-4 left-4 text-xs text-terex-accent/60 font-mono animate-pulse" style={{animationDelay: '1s'}}>
          5min
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-terex-accent/60 font-mono animate-pulse" style={{animationDelay: '3s'}}>
          6 pays
        </div>
      </div>
    </div>
  );
}
