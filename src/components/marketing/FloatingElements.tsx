
import { useEffect, useState } from 'react';

interface FloatingElementsProps {
  count?: number;
}

export function FloatingElements({ count = 15 }: FloatingElementsProps) {
  const [elements, setElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));
    setElements(newElements);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-r from-terex-accent/40 to-transparent animate-float-random"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
