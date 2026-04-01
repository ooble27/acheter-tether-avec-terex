import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

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
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
        return () => clearTimeout(timer);
      }
    } else {
      charIndex.current = 0;
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setDisplayText('');
      setIsTyping(true);
    }
  }, [displayText, isTyping, currentIndex, texts, typingSpeed, pauseDuration]);

  return displayText;
}

export function DeviceMockups() {
  const { t } = useLanguage();
  const displayText = useTypewriter(t.typewriter, 35, 2500);

  return (
    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light text-foreground mb-6 leading-tight h-[4.5em] sm:h-[4em] lg:h-[3.5em]">
      <span>{displayText}</span>
      <span className="inline-block w-[2px] h-[1em] bg-terex-accent ml-1 animate-pulse align-baseline" />
    </h1>
  );
}
