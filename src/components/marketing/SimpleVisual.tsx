
import React from 'react';

export function SimpleVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark">
      {/* Conteneur 3D avec perspective */}
      <div className="relative w-full h-full max-w-2xl flex items-center justify-center" style={{ perspective: '1000px' }}>
        
        {/* Arrière-plan 3D avec étoiles et planètes */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* Étoiles lointaines */}
          <div className="absolute top-16 left-16 w-1 h-1 bg-white rounded-full animate-pulse" style={{ transform: 'translateZ(-200px)' }}></div>
          <div className="absolute top-24 right-20 w-2 h-2 bg-terex-accent rounded-full animate-ping" style={{ transform: 'translateZ(-150px)', animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-20 left-12 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{ transform: 'translateZ(-180px)', animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 right-16 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ transform: 'translateZ(-120px)', animationDelay: '1.5s' }}></div>
          
          {/* Planètes 3D */}
          <div 
            className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-600 rounded-full opacity-60 shadow-2xl"
            style={{ 
              transform: 'translateZ(-100px) rotateY(45deg)',
              boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.3)',
              animation: 'float3D 6s ease-in-out infinite'
            }}
          ></div>
          <div 
            className="absolute bottom-12 left-8 w-16 h-16 bg-gradient-to-br from-red-300 to-red-600 rounded-full opacity-70 shadow-2xl"
            style={{ 
              transform: 'translateZ(-80px) rotateX(30deg)',
              boxShadow: 'inset -6px -6px 16px rgba(0,0,0,0.3), 0 0 25px rgba(239,68,68,0.3)',
              animation: 'float3D 8s ease-in-out infinite reverse'
            }}
          ></div>
        </div>

        {/* Fusée 3D principale */}
        <div className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            className="relative mx-auto"
            style={{ 
              transform: 'rotateX(15deg) rotateY(-10deg) translateZ(50px)',
              animation: 'geometric3DFloat 4s ease-in-out infinite'
            }}
          >
            {/* Cône de la fusée avec effet 3D */}
            <div 
              className="w-16 h-20 bg-gradient-to-t from-terex-accent to-terex-accent/90 mx-auto relative overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                boxShadow: 'inset -4px -4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(52,211,153,0.4)',
                transform: 'translateZ(20px)'
              }}
            >
              <div className="absolute inset-2 bg-gradient-to-t from-terex-accent/60 to-white/30 rounded-t-full"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
            </div>
            
            {/* Corps principal de la fusée avec relief 3D */}
            <div 
              className="w-20 h-32 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 mx-auto relative"
              style={{
                boxShadow: 'inset -6px -6px 20px rgba(0,0,0,0.2), inset 6px 6px 20px rgba(255,255,255,0.3), 0 0 30px rgba(0,0,0,0.3)',
                transform: 'translateZ(30px)',
                borderRadius: '4px'
              }}
            >
              {/* Hublot Bitcoin avec effet 3D */}
              <div 
                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 border-gray-500 flex items-center justify-center"
                style={{
                  boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.3), inset 3px 3px 8px rgba(255,255,255,0.8), 0 0 15px rgba(247,147,26,0.5)',
                  transform: 'translateZ(10px)'
                }}
              >
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#F7931A"/>
                  <path d="M20.1 14.7c.3-2-1.2-3.1-3.2-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.4-.3l.7-2.6-1.7-.4-.7 2.7c-.4-.1-.7-.1-1.1-.2v0l-2.3-.6-.4 1.9s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.1c0 .1.1.1.1.1h-.1l-1.1 4.4c-.1.2-.3.6-.8.4 0 0-1.2-.3-1.2-.3l-.9 2 2.2.5c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.8c.5.1 1 .2 1.4.3l-.7 2.7 1.7.4.7-2.8c3 .6 5.2.3 6.1-2.4.7-2.2-.4-3.5-1.6-4.3 1.1-.3 2-1.1 2.2-2.8zm-3.9 5.5c-.5 2.1-4.1.9-5.3.7l.9-3.7c1.2.3 4.9.9 4.4 3zm.5-5.5c-.5 1.9-3.5.9-4.5.7l.8-3.3c1 .2 4.2.7 3.7 2.6z" fill="white"/>
                </svg>
              </div>
              
              {/* Hublot USDT avec effet 3D */}
              <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 border-gray-500 flex items-center justify-center"
                style={{
                  boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.3), inset 3px 3px 8px rgba(255,255,255,0.8), 0 0 15px rgba(38,161,123,0.5)',
                  transform: 'translateZ(10px)'
                }}
              >
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
              
              {/* Détails 3D de la fusée */}
              <div 
                className="absolute left-0 top-1/2 w-3 h-8 bg-gradient-to-r from-red-600 to-red-400 rounded-l-full"
                style={{
                  transform: 'translateZ(5px) rotateY(-10deg)',
                  boxShadow: '0 0 10px rgba(220,38,38,0.5)'
                }}
              ></div>
              <div 
                className="absolute right-0 top-1/2 w-3 h-8 bg-gradient-to-l from-red-600 to-red-400 rounded-r-full"
                style={{
                  transform: 'translateZ(5px) rotateY(10deg)',
                  boxShadow: '0 0 10px rgba(220,38,38,0.5)'
                }}
              ></div>
            </div>
            
            {/* Ailerons 3D */}
            <div className="relative">
              <div 
                className="absolute -left-6 -top-4 w-10 h-12 bg-gradient-to-br from-gray-500 to-gray-600"
                style={{
                  transform: 'translateZ(15px) rotateY(-20deg) skewX(-15deg)',
                  clipPath: 'polygon(0 0, 80% 0, 100% 100%, 20% 100%)',
                  boxShadow: 'inset -3px -3px 10px rgba(0,0,0,0.4), 0 0 15px rgba(0,0,0,0.3)'
                }}
              ></div>
              <div 
                className="absolute -right-6 -top-4 w-10 h-12 bg-gradient-to-bl from-gray-500 to-gray-600"
                style={{
                  transform: 'translateZ(15px) rotateY(20deg) skewX(15deg)',
                  clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)',
                  boxShadow: 'inset -3px -3px 10px rgba(0,0,0,0.4), 0 0 15px rgba(0,0,0,0.3)'
                }}
              ></div>
            </div>
            
            {/* Flammes 3D de propulsion */}
            <div className="flex justify-center -mt-2" style={{ transformStyle: 'preserve-3d' }}>
              <div 
                className="w-3 h-12 bg-gradient-to-b from-orange-400 to-red-600 rounded-b-full animate-pulse mx-1"
                style={{
                  transform: 'translateZ(8px) rotateZ(-5deg)',
                  boxShadow: '0 0 15px rgba(251,146,60,0.8)',
                  animation: 'particle3DMove 2s ease-in-out infinite'
                }}
              ></div>
              <div 
                className="w-4 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-b-full animate-pulse mx-1"
                style={{
                  transform: 'translateZ(12px)',
                  boxShadow: '0 0 20px rgba(251,191,36,0.9)',
                  animation: 'particle3DMove 2.2s ease-in-out infinite reverse'
                }}
              ></div>
              <div 
                className="w-3 h-12 bg-gradient-to-b from-orange-400 to-red-600 rounded-b-full animate-pulse mx-1"
                style={{
                  transform: 'translateZ(8px) rotateZ(5deg)',
                  boxShadow: '0 0 15px rgba(251,146,60,0.8)',
                  animation: 'particle3DMove 2.4s ease-in-out infinite'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Particules 3D flottantes */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            className="absolute top-32 left-24 w-2 h-2 bg-terex-accent rounded-full"
            style={{
              transform: 'translateZ(60px)',
              boxShadow: '0 0 10px rgba(52,211,153,0.8)',
              animation: 'particle3DMove 3s ease-in-out infinite'
            }}
          ></div>
          <div 
            className="absolute bottom-24 right-32 w-3 h-3 bg-yellow-400 rounded-full"
            style={{
              transform: 'translateZ(40px)',
              boxShadow: '0 0 12px rgba(251,191,36,0.8)',
              animation: 'particle3DMove 3.5s ease-in-out infinite reverse'
            }}
          ></div>
          <div 
            className="absolute top-1/2 right-16 w-2 h-2 bg-purple-400 rounded-full"
            style={{
              transform: 'translateZ(80px)',
              boxShadow: '0 0 8px rgba(168,85,247,0.8)',
              animation: 'particle3DMove 4s ease-in-out infinite'
            }}
          ></div>
        </div>

        {/* Trajectoire 3D */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-t from-terex-accent/60 to-transparent opacity-40"
          style={{
            transform: 'translateX(-50%) translateZ(-20px) rotateX(10deg)',
            boxShadow: '0 0 20px rgba(52,211,153,0.4)'
          }}
        ></div>

        {/* Texte 3D d'accompagnement */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          style={{
            transform: 'translateZ(30px)',
            animation: 'dataLabel3D 2s ease-in-out infinite'
          }}
        >
          <div className="text-white text-lg font-bold mb-1 drop-shadow-lg">🚀 To the Moon!</div>
          <div className="text-terex-accent text-sm drop-shadow-lg">Bitcoin & USDT</div>
        </div>

        {/* Effet de lueur 3D */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-terex-accent/10 rounded-full blur-xl animate-pulse"
          style={{ transform: 'translate(-50%, -50%) translateZ(-10px)' }}
        ></div>
      </div>
    </div>
  );
}
