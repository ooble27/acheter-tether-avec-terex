
import React, { useState, useEffect } from 'react';

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Messages harmonisés pour avoir la même longueur et éviter les décalages
  const titleMessages = [
    "Échange USDT et transferts vers l'Afrique",
    "Achetez des USDT facilement avec Terex", 
    "Vendez vos stablecoins en sécurité totale",
    "Envoyez de l'argent à vos proches sans frais",
    "Plateforme sécurisée et réglementée 100%"
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
            <div className="sm:inline">Échange USDT et transferts</div>
            <div className="sm:inline"> vers l'<span className="text-terex-accent">Afrique</span></div>
          </>
        ) : currentSlide === 1 ? (
          <>
            <div className="sm:inline">Achetez des USDT</div>
            <div className="sm:inline"> facilement avec <span className="text-terex-accent">Terex</span></div>
          </>
        ) : currentSlide === 2 ? (
          <>
            <div className="sm:inline">Vendez vos stablecoins</div>
            <div className="sm:inline"> en <span className="text-terex-accent">sécurité</span> totale</div>
          </>
        ) : currentSlide === 3 ? (
          <>
            <div className="sm:inline">Envoyez de l'argent</div>
            <div className="sm:inline"> à vos proches <span className="text-terex-accent">sans frais</span></div>
          </>
        ) : (
          <>
            <div className="sm:inline">Plateforme <span className="text-terex-accent">sécurisée</span></div>
            <div className="sm:inline"> et réglementée 100%</div>
          </>
        )}
      </span>
    </h1>
  );
}
