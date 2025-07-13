
import React, { useState, useEffect } from 'react';

export function DeviceMockups() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Messages harmonisés pour avoir la même longueur et éviter les décalages
  const titleMessages = [
    "Échange USDT et transferts vers l'Afrique",
    "Achetez des USDT facilement avec Terex", 
    "Vendez vos stablecoins en sécurité totale",
    "Envoyez de l'argent à vos proches vite",
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
            Échange USDT et transferts vers l'<span className="text-terex-accent">Afrique</span>
          </>
        ) : currentSlide === 1 ? (
          <>
            Achetez des USDT facilement avec <span className="text-terex-accent">Terex</span>
          </>
        ) : currentSlide === 2 ? (
          <>
            Vendez vos stablecoins en <span className="text-terex-accent">sécurité</span> totale
          </>
        ) : currentSlide === 3 ? (
          <>
            Envoyez de l'argent à vos proches <span className="text-terex-accent">vite</span>
          </>
        ) : (
          <>
            Plateforme <span className="text-terex-accent">sécurisée</span> et réglementée 100%
          </>
        )}
      </span>
    </h1>
  );
}
