
import React from 'react';
import './SimpleCrypto3D.css';

export function SimpleCrypto3D() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      <div className="simple-crypto-container">
        
        {/* Logo USDT central */}
        <div className="central-usdt">
          <div className="usdt-glow">
            <svg width="100" height="100" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Cercles concentriques */}
        <div className="crypto-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>

        {/* Icônes crypto flottantes */}
        <div className="floating-cryptos">
          <div className="crypto-icon crypto-1">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#F7931A"/>
              <path d="M20.7 16.5c.3-2.1-.5-3.2-1.4-4l.6-2.4-1.5-.4-.6 2.3c-.4-.1-.8-.2-1.2-.3l.6-2.4-1.5-.4-.6 2.4c-.3-.1-.7-.1-1-.2l0 0-2.1-.5-.4 1.6s1.1.3 1.1.3c.6.1.7.6.7.9l-.7 2.8c0 0 0 .1.1.1l-.1-.1-.9 3.8c-.1.2-.3.5-.8.4 0 0-1.1-.3-1.1-.3l-.7 1.7 2 .5c.4.1.7.2 1.1.3l-.6 2.5 1.5.4.6-2.4c.4.1.8.2 1.2.3l-.6 2.4 1.5.4.6-2.5c2.6.5 4.5.3 5.3-2.1.7-1.9-.0-3.0-1.4-3.7 1-.2 1.7-1 1.9-2.5zm-3.4 4.8c-.5 1.8-3.6.8-4.6.6l.8-3.3c1 .2 4.2.7 3.8 2.7zm.5-4.9c-.4 1.7-3.2.8-4.1.6l.7-3c.9.2 3.8.6 3.4 2.4z" fill="white"/>
            </svg>
          </div>
          
          <div className="crypto-icon crypto-2">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#627EEA"/>
              <path d="M16.5 4l-.5.8v12.3l.5.5 7.5-4.4zm0 0L9 13.2l7.5 4.4V4zm0 15.2l-.3.4v5.7l.3.1 7.5-10.5zm0 6.2v-6.2L9 17.8zm0-7.7l7.5-4.4-7.5-4.4v8.8zm-7.5-4.4l7.5 4.4v-8.8z" fill="white"/>
            </svg>
          </div>
          
          <div className="crypto-icon crypto-3">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#FFD700"/>
              <path d="M16 6C10.5 6 6 10.5 6 16s4.5 10 10 10 10-4.5 10-10S21.5 6 16 6zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="white"/>
              <path d="M20 16c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" fill="white"/>
            </svg>
          </div>
          
          <div className="crypto-icon crypto-4">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#00D4AA"/>
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm6.8 13.2l-6.8 6.8-6.8-6.8L16 10.4l6.8 6.8z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Stats flottantes */}
        <div className="floating-stats">
          <div className="stat-bubble stat-1">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Disponible</div>
          </div>
          
          <div className="stat-bubble stat-2">
            <div className="stat-value">0%</div>
            <div className="stat-label">Commission</div>
          </div>
          
          <div className="stat-bubble stat-3">
            <div className="stat-value">5min</div>
            <div className="stat-label">Transfert</div>
          </div>
          
          <div className="stat-bubble stat-4">
            <div className="stat-value">6</div>
            <div className="stat-label">Pays</div>
          </div>
        </div>

        {/* Particules flottantes */}
        <div className="floating-particles">
          <div className="particle p-1"></div>
          <div className="particle p-2"></div>
          <div className="particle p-3"></div>
          <div className="particle p-4"></div>
          <div className="particle p-5"></div>
          <div className="particle p-6"></div>
        </div>
      </div>
    </div>
  );
}
