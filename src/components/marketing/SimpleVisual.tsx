
import React from 'react';

export function SimpleVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Container principal */}
      <div className="relative w-full h-full max-w-2xl flex items-center justify-center">
        
        {/* Fusée centrale */}
        <div className="relative z-10">
          {/* Corps de la fusée */}
          <div className="relative mx-auto">
            {/* Partie haute de la fusée (cône) */}
            <div className="w-16 h-20 bg-gradient-to-t from-terex-accent to-terex-accent/80 rounded-t-full mx-auto relative overflow-hidden">
              <div className="absolute inset-2 bg-gradient-to-t from-terex-accent/50 to-white/20 rounded-t-full"></div>
              {/* Étoiles sur le cône */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            
            {/* Corps principal de la fusée */}
            <div className="w-20 h-32 bg-gradient-to-b from-gray-300 to-gray-200 mx-auto relative">
              {/* Hublot avec logo Bitcoin */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#F7931A"/>
                  <path d="M20.1 14.7c.3-2-1.2-3.1-3.2-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.4-.3l.7-2.6-1.7-.4-.7 2.7c-.4-.1-.7-.1-1.1-.2v0l-2.3-.6-.4 1.9s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.1c0 .1.1.1.1.1h-.1l-1.1 4.4c-.1.2-.3.6-.8.4 0 0-1.2-.3-1.2-.3l-.9 2 2.2.5c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.8c.5.1 1 .2 1.4.3l-.7 2.7 1.7.4.7-2.8c3 .6 5.2.3 6.1-2.4.7-2.2-.4-3.5-1.6-4.3 1.1-.3 2-1.1 2.2-2.8zm-3.9 5.5c-.5 2.1-4.1.9-5.3.7l.9-3.7c1.2.3 4.9.9 4.4 3zm.5-5.5c-.5 1.9-3.5.9-4.5.7l.8-3.3c1 .2 4.2.7 3.7 2.6z" fill="white"/>
                </svg>
              </div>
              
              {/* Deuxième hublot avec logo USDT */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
              
              {/* Détails de la fusée */}
              <div className="absolute left-0 top-1/2 w-2 h-8 bg-red-500 rounded-l-full"></div>
              <div className="absolute right-0 top-1/2 w-2 h-8 bg-red-500 rounded-r-full"></div>
            </div>
            
            {/* Ailerons */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-8 h-12 bg-gradient-to-r from-gray-400 to-gray-300 transform -skew-x-12"></div>
              <div className="absolute -right-4 -top-4 w-8 h-12 bg-gradient-to-l from-gray-400 to-gray-300 transform skew-x-12"></div>
            </div>
            
            {/* Flammes de propulsion */}
            <div className="flex justify-center -mt-2">
              <div className="w-3 h-12 bg-gradient-to-b from-orange-400 to-red-600 rounded-b-full animate-pulse mx-1"></div>
              <div className="w-4 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-b-full animate-pulse mx-1"></div>
              <div className="w-3 h-12 bg-gradient-to-b from-orange-400 to-red-600 rounded-b-full animate-pulse mx-1"></div>
            </div>
          </div>
        </div>

        {/* Étoiles et particules flottantes */}
        <div className="absolute top-16 left-16 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-24 right-20 w-1 h-1 bg-terex-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-12 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-16 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-32 left-24 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>

        {/* Planètes en arrière-plan */}  
        <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-12 left-8 w-12 h-12 bg-gradient-to-br from-red-300 to-red-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 right-4 w-8 h-8 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full opacity-35 animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

        {/* Trajectoire de la fusée */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-t from-terex-accent/50 to-transparent opacity-30"></div>
        
        {/* Particules de traînée */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping mx-2" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-orange-400 rounded-full animate-ping mx-2" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-1 h-1 bg-red-400 rounded-full animate-ping mx-2" style={{ animationDelay: '0.6s' }}></div>
        </div>

        {/* Texte d'accompagnement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-white text-lg font-bold mb-1">🚀 To the Moon!</div>
          <div className="text-terex-accent text-sm">Bitcoin & USDT</div>
        </div>

        {/* Effet de lueur autour de la fusée */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-terex-accent/10 rounded-full blur-xl animate-pulse"></div>
      </div>
    </div>
  );
}
