
import React, { useState, useEffect } from 'react';
import { ScreenSlides } from './ScreenSlides';

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = 5; // Dashboard, Buy USDT, Sell USDT, International Transfer, Profile

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  return (
    <div 
      className="relative flex items-center justify-center min-h-[600px] lg:min-h-[700px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-terex-accent/20 via-transparent to-terex-accent/20 blur-3xl"></div>
      
      {/* Desktop mockup */}
      <div className="relative z-10 hidden lg:block">
        <MacBookMockup currentSlide={currentSlide} />
      </div>
      
      {/* Mobile mockup for smaller screens */}
      <div className="relative z-10 lg:hidden">
        <IPhoneMockup currentSlide={currentSlide} />
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-terex-accent scale-110' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function MacBookMockup({ currentSlide }: { currentSlide: number }) {
  return (
    <div className="relative">
      {/* MacBook frame */}
      <div className="relative bg-gray-800 rounded-t-2xl p-4 shadow-2xl">
        {/* Top bar with camera */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full"></div>
        
        {/* Screen */}
        <div className="w-[800px] h-[500px] bg-terex-dark rounded-lg overflow-hidden relative">
          <ScreenSlides currentSlide={currentSlide} deviceType="desktop" />
        </div>
      </div>
      
      {/* MacBook base */}
      <div className="w-[900px] h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-2xl mx-auto shadow-lg"></div>
    </div>
  );
}

function IPhoneMockup({ currentSlide }: { currentSlide: number }) {
  return (
    <div className="relative">
      {/* iPhone frame */}
      <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10"></div>
        
        {/* Screen */}
        <div className="w-[300px] h-[600px] bg-terex-dark rounded-[2rem] overflow-hidden relative">
          <ScreenSlides currentSlide={currentSlide} deviceType="mobile" />
        </div>
      </div>
    </div>
  );
}
