
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

        {/* Cercles orbitaux */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-full h-full relative">
            {/* Orbite 1 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-terex-accent/60 shadow-md"></div>
            </div>
            {/* Orbite 2 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-terex-accent/60 shadow-md"></div>
            </div>
            {/* Orbite 3 */}
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-terex-accent/60 shadow-md"></div>
            </div>
            {/* Orbite 4 */}
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-terex-accent/60 shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Deuxième orbite - rotation inverse */}
        <div className="absolute inset-4 animate-spin-reverse">
          <div className="w-full h-full relative">
            {/* Points diagonaux */}
            <div className="absolute top-4 right-4">
              <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-terex-accent/40"></div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-terex-accent/40"></div>
            </div>
            <div className="absolute top-4 left-4">
              <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-terex-accent/40"></div>
            </div>
            <div className="absolute bottom-4 right-4">
              <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-terex-accent/40"></div>
            </div>
          </div>
        </div>

        {/* Anneaux décoratifs */}
        <div className="absolute inset-0">
          <div className="w-full h-full border-2 border-terex-accent/20 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute inset-8">
          <div className="w-full h-full border border-terex-accent/30 rounded-full animate-pulse-reverse"></div>
        </div>

        {/* Particules flottantes */}
        <div className="absolute -top-8 -left-8 w-2 h-2 bg-terex-accent/60 rounded-full animate-float-1"></div>
        <div className="absolute -top-4 -right-12 w-3 h-3 bg-terex-accent/40 rounded-full animate-float-2"></div>
        <div className="absolute -bottom-6 -left-10 w-2 h-2 bg-terex-accent/50 rounded-full animate-float-3"></div>
        <div className="absolute -bottom-8 -right-6 w-2 h-2 bg-terex-accent/60 rounded-full animate-float-1"></div>
        <div className="absolute top-8 -right-16 w-1 h-1 bg-terex-accent/70 rounded-full animate-float-2"></div>
        <div className="absolute bottom-12 -left-14 w-1 h-1 bg-terex-accent/50 rounded-full animate-float-3"></div>

        {/* Effet de lueur */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-terex-accent/5 via-transparent to-transparent blur-xl"></div>
      </div>
    </div>
  );
}
