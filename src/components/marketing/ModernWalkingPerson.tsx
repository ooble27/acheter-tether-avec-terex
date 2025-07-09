
import React from 'react';

export function ModernWalkingPerson() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000">
      {/* Animation container */}
      <div className="relative w-96 h-96 transform-gpu">
        
        {/* Walking person with 3D effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Person figure */}
          <div className="relative person-walking">
            
            {/* Head */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 shadow-lg head-animation">
              {/* Hair */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-14 h-8 bg-gray-900 rounded-t-full"></div>
              {/* Beard */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-gray-800 rounded-b-full"></div>
            </div>
            
            {/* Body */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-28 bg-gradient-to-b from-terex-accent to-green-600 rounded-t-lg shadow-lg body-animation">
              {/* Terex logo on shirt */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-terex-accent">
                T
              </div>
            </div>
            
            {/* Arms */}
            <div className="absolute top-20 left-2 w-4 h-16 bg-gradient-to-b from-terex-accent to-green-600 rounded-full arm-left-animation shadow-md"></div>
            
            {/* Right arm holding phone */}
            <div className="absolute top-20 right-2 w-4 h-16 bg-gradient-to-b from-terex-accent to-green-600 rounded-full arm-right-animation shadow-md">
              {/* Phone */}
              <div className="absolute -bottom-2 -right-2 w-6 h-10 bg-gray-900 rounded-lg shadow-lg phone-glow">
                <div className="absolute inset-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded phone-screen">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold">$</div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-terex-accent rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Legs */}
            <div className="absolute top-44 left-1/2 transform -translate-x-1/2 w-20 h-20">
              {/* Left leg */}
              <div className="absolute left-2 w-6 h-16 bg-gray-700 rounded-full leg-left-animation shadow-md">
                {/* Shoe */}
                <div className="absolute -bottom-2 -left-1 w-8 h-4 bg-terex-accent rounded-full shadow-md"></div>
              </div>
              {/* Right leg */}
              <div className="absolute right-2 w-6 h-16 bg-gray-700 rounded-full leg-right-animation shadow-md">
                {/* Shoe */}
                <div className="absolute -bottom-2 -left-1 w-8 h-4 bg-terex-accent rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* USDT particles flowing from phone */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute usdt-particle"
              style={{
                top: `${40 + Math.sin(i) * 10}%`,
                right: `${15 + i * 3}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                  <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        {/* Shadow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-black/20 rounded-full blur-md shadow-animation"></div>
        
        {/* Floating particles for depth */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-terex-accent/30 rounded-full floating-particle"
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
