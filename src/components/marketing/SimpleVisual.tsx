
import React from 'react';

export function SimpleVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Container principal avec design moderne */}
      <div className="relative w-full h-full max-w-lg lg:max-w-xl flex items-center justify-center">
        
        {/* Carte principale avec glassmorphism */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
          {/* En-tête avec icône USDT */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-terex-accent to-terex-accent/80 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-10 h-10 lg:w-12 lg:h-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
              {/* Cercles décoratifs */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-terex-accent/30 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-terex-accent/50 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Titre */}
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">USDT Exchange</h3>
            <p className="text-gray-300 text-sm lg:text-base">Sécurisé • Rapide • Fiable</p>
          </div>

          {/* Métriques avec design moderne */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl lg:text-2xl font-bold text-terex-accent mb-1">1.00</div>
              <div className="text-xs text-gray-400">USDT/USD</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl lg:text-2xl font-bold text-green-400 mb-1">0%</div>
              <div className="text-xs text-gray-400">Frais</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl lg:text-2xl font-bold text-blue-400 mb-1">5min</div>
              <div className="text-xs text-gray-400">Transfert</div>
            </div>
          </div>

          {/* Indicateur de transaction */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-terex-accent rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-terex-accent/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-terex-accent/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-gray-400 ml-2">Transaction en cours...</span>
          </div>

          {/* Bouton d'action */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-terex-accent/25">
              Échanger maintenant
            </button>
          </div>
        </div>

        {/* Éléments décoratifs flottants */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-terex-accent/20 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-4 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-8 w-14 h-14 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* Grille de fond subtile */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Particules flottantes */}
        <div className="absolute top-16 right-16 w-1 h-1 bg-terex-accent rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-16 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-1/3 right-4 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '2.1s' }}></div>
        <div className="absolute bottom-1/3 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
      </div>
    </div>
  );
}
