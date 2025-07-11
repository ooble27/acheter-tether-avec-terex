
import React, { useState, useEffect } from 'react';

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Messages qui changent pour le titre principal
  const titleMessages = [
    "L'échange USDT Tether et les transferts vers l'Afrique",
    "Achetez des USDT facilement avec Terex",
    "Vendez vos stablecoins en toute sécurité", 
    "Envoyez de l'argent à vos proches en Afrique",
    "Plateforme 100% sécurisée et réglementée"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % titleMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [titleMessages.length]);

  return (
    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
      <span className="transition-all duration-700 ease-in-out">
        {currentSlide === 0 ? (
          <>
            L'échange USDT Tether et les transferts vers l'<span className="text-terex-accent">Afrique</span>
          </>
        ) : currentSlide === 1 ? (
          <>
            Achetez des USDT facilement avec <span className="text-terex-accent">Terex</span>
          </>
        ) : currentSlide === 2 ? (
          <>
            Vendez vos stablecoins en toute <span className="text-terex-accent">sécurité</span>
          </>
        ) : currentSlide === 3 ? (
          <>
            Envoyez de l'argent à vos proches en <span className="text-terex-accent">Afrique</span>
          </>
        ) : (
          <>
            Plateforme 100% sécurisée et <span className="text-terex-accent">réglementée</span>
          </>
        )}
      </span>
    </h1>
  );
}
