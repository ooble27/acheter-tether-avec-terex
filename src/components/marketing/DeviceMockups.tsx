import React, { useState, useEffect, useRef } from 'react';

function useTypewriter(texts: string[], typingSpeed = 40, pauseDuration = 3000) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const charIndex = useRef(0);

  useEffect(() => {
    const text = texts[currentIndex];

    if (isTyping) {
      if (charIndex.current < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(text.slice(0, charIndex.current + 1));
          charIndex.current += 1;
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Done typing, pause
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
        return () => clearTimeout(timer);
      }
    } else {
      // Move to next text
      charIndex.current = 0;
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setDisplayText('');
      setIsTyping(true);
    }
  }, [displayText, isTyping, currentIndex, texts, typingSpeed, pauseDuration]);

  return displayText;
}

const titles = [
  "Échange USDT et transferts vers l'Afrique",
  "Achetez des USDT facilement avec Terex",
  "Vendez vos stablecoins en toute sécurité",
  "Envoyez de l'argent à vos proches",
  "Plateforme sécurisée et réglementée",
];

export function DeviceMockups() {
  const displayText = useTypewriter(titles, 35, 2500);

  return (
    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light text-foreground mb-6 leading-tight min-h-[2.5em] sm:min-h-[2em]">
      <span>{displayText}</span>
      <span className="inline-block w-[2px] h-[1em] bg-terex-accent ml-1 animate-pulse align-baseline" />
    </h1>
  );
}
