
import React from 'react';

export function SimpleVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
      {/* Container principal */}
      <div className="relative w-80 h-80 lg:w-96 lg:h-96">
        
        {/* Cercle central principal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-terex-accent via-terex-accent/80 to-terex-accent/60 shadow-lg animate-pulse-slow flex items-center justify-center">
            {/* Logo USDT */}
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 lg:w-10 lg:h-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Première orbite - rotation avec logos crypto */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-full h-full relative">
            {/* Bitcoin */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-orange-500/80 shadow-md flex items-center justify-center animate-wave">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="white">
                  <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z" />
                  <path d="M17.708 10.772c.239-1.598-.98-2.459-2.645-3.031l.54-2.167-1.32-.33-.527 2.11c-.347-.086-.703-.168-1.058-.247l.531-2.127-1.32-.33-.54 2.165c-.287-.065-.569-.13-.844-.198l.002-.007-1.821-.455-.351 1.408s.98.224.959.238c.535.133.632.487.616.768l-.617 2.474c.037.009.085.022.138.043l-.14-.035-.864 3.463c-.066.162-.23.405-.602.313.013.019-.959-.239-.959-.239l-.656 1.51 1.72.428c.32.08.634.164.943.242l-.546 2.19 1.32.33.54-2.166c.36.098.708.188 1.05.272l-.538 2.158 1.32.33.546-2.188c2.248.425 3.937.254 4.65-1.777.574-1.635-.028-2.578-1.21-3.192.86-.198 1.508-.765 1.682-1.933z" fill="#f7931a"/>
                </svg>
              </div>
            </div>
            
            {/* Ethereum */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-500/80 shadow-md flex items-center justify-center animate-wave-delay-1">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1.5L5.25 12.75L12 16.5l6.75-3.75L12 1.5z"/>
                  <path d="M5.25 13.5L12 22.5l6.75-9L12 17.25L5.25 13.5z"/>
                </svg>
              </div>
            </div>
            
            {/* BNB */}
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-500/80 shadow-md flex items-center justify-center animate-wave-delay-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="white">
                  <polygon points="12,2 22,12 12,22 2,12"/>
                  <polygon points="12,6 18,12 12,18 6,12"/>
                </svg>
              </div>
            </div>
            
            {/* Cardano */}
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-600/80 shadow-md flex items-center justify-center animate-wave-delay-3">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="3"/>
                  <circle cx="8" cy="16" r="2"/>
                  <circle cx="16" cy="16" r="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième orbite - rotation inverse avec plus de cryptos */}
        <div className="absolute inset-6 animate-spin-reverse">
          <div className="w-full h-full relative">
            {/* Solana */}
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-purple-500/60 flex items-center justify-center animate-wave-delay-4">
                <svg className="w-3 h-3 lg:w-4 lg:h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M4 8l16-4v4L4 12V8z"/>
                  <path d="M4 16l16-4v4L4 20v-4z"/>
                </svg>
              </div>
            </div>
            
            {/* Polygon */}
            <div className="absolute bottom-4 left-4">
              <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-purple-600/60 flex items-center justify-center animate-wave-delay-5">
                <svg className="w-3 h-3 lg:w-4 lg:h-4" viewBox="0 0 24 24" fill="white">
                  <polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/>
                </svg>
              </div>
            </div>
            
            {/* Chainlink */}
            <div className="absolute top-4 left-4">
              <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-blue-400/60 flex items-center justify-center animate-wave">
                <svg className="w-3 h-3 lg:w-4 lg:h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l8 5v10l-8 5-8-5V7l8-5z"/>
                </svg>
              </div>
            </div>
            
            {/* Litecoin */}
            <div className="absolute bottom-4 right-4">
              <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-gray-400/60 flex items-center justify-center animate-wave-delay-2">
                <svg className="w-3 h-3 lg:w-4 lg:h-4" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14h8M10 18h6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Anneaux décoratifs avec effet wave */}
        <div className="absolute inset-0">
          <div className="w-full h-full border-2 border-terex-accent/20 rounded-full animate-pulse-wave"></div>
        </div>
        <div className="absolute inset-8">
          <div className="w-full h-full border border-terex-accent/30 rounded-full animate-pulse-wave-reverse"></div>
        </div>

        {/* Particules flottantes avec effet wave */}
        <div className="absolute -top-8 -left-8 w-2 h-2 bg-terex-accent/60 rounded-full animate-float-wave-1"></div>
        <div className="absolute -top-4 -right-12 w-3 h-3 bg-terex-accent/40 rounded-full animate-float-wave-2"></div>
        <div className="absolute -bottom-6 -left-10 w-2 h-2 bg-terex-accent/50 rounded-full animate-float-wave-3"></div>
        <div className="absolute -bottom-8 -right-6 w-2 h-2 bg-terex-accent/60 rounded-full animate-float-wave-1"></div>
        <div className="absolute top-8 -right-16 w-1 h-1 bg-terex-accent/70 rounded-full animate-float-wave-2"></div>
        <div className="absolute bottom-12 -left-14 w-1 h-1 bg-terex-accent/50 rounded-full animate-float-wave-3"></div>

        {/* Effet de lueur avec wave */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-terex-accent/5 via-transparent to-transparent blur-xl animate-glow-wave"></div>
      </div>
    </div>
  );
}
