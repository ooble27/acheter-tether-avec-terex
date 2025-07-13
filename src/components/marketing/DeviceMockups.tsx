
import React, { useState, useEffect } from 'react';

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Messages plus courts pour éviter les décalages
  const titleMessages = [
    "Échange USDT et transferts Afrique",
    "Achetez des USDT avec Terex",
    "Vendez vos stablecoins facilement", 
    "Envoyez de l'argent en Afrique",
    "Plateforme sécurisée et réglementée"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % titleMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [titleMessages.length]);

  return (
    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
      <span className="transition-all duration-700 ease-in-out">
        {currentSlide === 0 ? (
          <>
            Échange USDT et transferts <span className="text-terex-accent">Afrique</span>
          </>
        ) : currentSlide === 1 ? (
          <>
            Achetez des USDT avec <span className="text-terex-accent">Terex</span>
          </>
        ) : currentSlide === 2 ? (
          <>
            Vendez vos stablecoins <span className="text-terex-accent">facilement</span>
          </>
        ) : currentSlide === 3 ? (
          <>
            Envoyez de l'argent en <span className="text-terex-accent">Afrique</span>
          </>
        ) : (
          <>
            Plateforme sécurisée et <span className="text-terex-accent">réglementée</span>
          </>
        )}
      </span>
    </h1>
  );
}
