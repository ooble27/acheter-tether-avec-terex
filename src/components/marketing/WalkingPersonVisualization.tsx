
import React from 'react';

export function WalkingPersonVisualization() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Container principal avec perspective 3D */}
      <div className="walking-person-container relative transform-gpu">
        
        {/* Fond avec effet de mouvement */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-800/10 to-yellow-900/20 rounded-3xl"></div>
        
        {/* Lignes de mouvement en arrière-plan */}
        <div className="movement-lines">
          <div className="movement-line line-1"></div>
          <div className="movement-line line-2"></div>
          <div className="movement-line line-3"></div>
          <div className="movement-line line-4"></div>
        </div>

        {/* Personne qui marche */}
        <div className="walking-person">
          {/* Corps de la personne */}
          <div className="person-body">
            {/* Tête */}
            <div className="person-head"></div>
            
            {/* Torse */}
            <div className="person-torso"></div>
            
            {/* Bras gauche */}
            <div className="person-arm person-arm-left"></div>
            
            {/* Bras droit tenant le téléphone */}
            <div className="person-arm person-arm-right">
              {/* Téléphone */}
              <div className="phone">
                <div className="phone-screen">
                  <div className="app-interface">
                    <div className="balance-display">$1,250</div>
                    <div className="transaction-button">Envoyer</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Jambe gauche */}
            <div className="person-leg person-leg-left"></div>
            
            {/* Jambe droite */}
            <div className="person-leg person-leg-right"></div>
          </div>
        </div>

        {/* USDT qui sortent du téléphone */}
        <div className="usdt-particles">
          <div className="usdt-particle particle-1">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
          <div className="usdt-particle particle-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
          <div className="usdt-particle particle-3">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
          <div className="usdt-particle particle-4">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
          <div className="usdt-particle particle-5">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
          <div className="usdt-particle particle-6">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Effet de sol/ombre */}
        <div className="ground-shadow"></div>

        {/* Particules d'ambiance */}
        <div className="ambient-particles">
          <div className="ambient-particle particle-ambient-1"></div>
          <div className="ambient-particle particle-ambient-2"></div>
          <div className="ambient-particle particle-ambient-3"></div>
          <div className="ambient-particle particle-ambient-4"></div>
        </div>
      </div>
    </div>
  );
}
