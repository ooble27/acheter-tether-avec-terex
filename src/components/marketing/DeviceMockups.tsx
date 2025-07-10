
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
    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
      <span className="transition-all duration-700 ease-in-out">
        {currentSlide < 1 ? (
          <>
            {titleMessages[currentSlide]}
            <br />
            <span className="text-terex-accent relative">vers l'Afrique</span>
          </>
        ) : (
          <span className="text-terex-accent relative">
            {titleMessages[currentSlide]}
          </span>
        )}
      </span>
    </h1>
  );
}
