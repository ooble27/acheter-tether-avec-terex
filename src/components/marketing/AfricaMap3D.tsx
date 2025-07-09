
import React from 'react';

export function AfricaMap3D() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
      {/* Container principal avec perspective 3D */}
      <div className="africa-map-container relative">
        {/* Carte de l'Afrique stylisée */}
        <div className="africa-map">
          <svg
            viewBox="0 0 400 500"
            className="w-80 h-96 lg:w-96 lg:h-[480px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gradient définitions */}
            <defs>
              <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B968F" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#4BA89F" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#5BC1B8" stopOpacity="0.4"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Vraie forme de l'Afrique - silhouette reconnaissable */}
            <path
              d="M200 20
                 C210 18, 225 20, 240 25
                 L250 30
                 C270 35, 285 45, 295 60
                 L300 70
                 C305 85, 310 100, 315 115
                 L320 130
                 C325 145, 330 160, 335 175
                 L340 190
                 C345 210, 350 230, 355 250
                 L360 270
                 C365 290, 370 310, 375 330
                 L380 350
                 C385 370, 380 390, 370 410
                 L360 430
                 C350 445, 335 455, 320 460
                 L300 465
                 C280 470, 260 475, 240 480
                 L220 485
                 C200 490, 180 485, 160 480
                 L140 475
                 C120 470, 100 465, 85 455
                 L70 445
                 C55 430, 45 410, 40 390
                 L35 370
                 C30 350, 25 330, 20 310
                 L15 290
                 C10 270, 15 250, 20 230
                 L25 210
                 C30 190, 35 170, 45 150
                 L55 130
                 C65 110, 80 95, 100 85
                 L120 75
                 C140 65, 160 60, 180 55
                 L200 50
                 C205 45, 202 32, 200 20 Z
                 
                 M120 180
                 C110 185, 105 195, 110 205
                 L115 215
                 C120 225, 130 230, 140 225
                 L150 220
                 C160 215, 165 205, 160 195
                 L155 185
                 C150 175, 140 170, 130 175
                 L120 180 Z"
              fill="url(#africaGradient)"
              stroke="#3B968F"
              strokeWidth="2"
              filter="url(#glow)"
              className="africa-continent"
            />
            
            {/* Ajout du Sahara pour plus de réalisme */}
            <path
              d="M180 80
                 C200 75, 220 80, 240 85
                 L260 90
                 C270 95, 275 105, 270 115
                 L265 125
                 C260 135, 250 140, 240 135
                 L220 130
                 C200 125, 180 120, 165 115
                 L150 110
                 C140 105, 135 95, 140 85
                 L145 75
                 C150 65, 160 60, 170 65
                 L180 70
                 C185 75, 182 78, 180 80 Z"
              fill="rgba(59, 150, 143, 0.2)"
              className="sahara-region"
            />
          </svg>
          
          {/* Points lumineux pour les pays avec positionnement plus réaliste */}
          <div className="absolute inset-0">
            {/* Sénégal - côte ouest */}
            <div className="country-point senegal">
              <div className="pulse-dot"></div>
              <span className="country-label">Sénégal</span>
            </div>
            
            {/* Côte d'Ivoire - côte ouest plus au sud */}
            <div className="country-point ivory-coast">
              <div className="pulse-dot"></div>
              <span className="country-label">Côte d'Ivoire</span>
            </div>
            
            {/* Mali - intérieur ouest */}
            <div className="country-point mali">
              <div className="pulse-dot"></div>
              <span className="country-label">Mali</span>
            </div>
            
            {/* Burkina Faso - centre-ouest */}
            <div className="country-point burkina">
              <div className="pulse-dot"></div>
              <span className="country-label">Burkina Faso</span>
            </div>
            
            {/* Niger - centre-nord */}
            <div className="country-point niger">
              <div className="pulse-dot"></div>
              <span className="country-label">Niger</span>
            </div>
            
            {/* Nigeria - centre côte sud */}
            <div className="country-point nigeria">
              <div className="pulse-dot"></div>
              <span className="country-label">Nigeria</span>
            </div>
          </div>
          
          {/* Flux d'USDT animés avec vrai logo */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Flux 1 */}
            <div className="usdt-flow flow-1">
              <div className="usdt-particle">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* Flux 2 */}
            <div className="usdt-flow flow-2">
              <div className="usdt-particle">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* Flux 3 */}
            <div className="usdt-flow flow-3">
              <div className="usdt-particle">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* Flux 4 */}
            <div className="usdt-flow flow-4">
              <div className="usdt-particle">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Effet de base avec ombre */}
        <div className="africa-shadow"></div>
      </div>
      
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-particle particle-1"></div>
        <div className="floating-particle particle-2"></div>
        <div className="floating-particle particle-3"></div>
        <div className="floating-particle particle-4"></div>
        <div className="floating-particle particle-5"></div>
      </div>
    </div>
  );
}
