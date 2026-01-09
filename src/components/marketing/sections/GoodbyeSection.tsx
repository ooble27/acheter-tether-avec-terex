import { useEffect, useState } from 'react';
import { AnimatedSection } from '@/hooks/useScrollAnimation';

const painPoints = [
  { text: "frais excessifs", color: "text-red-400" },
  { text: "délais interminables", color: "text-orange-400" },
  { text: "procédures complexes", color: "text-yellow-400" },
  { text: "taux cachés", color: "text-pink-400" },
  { text: "transferts bloqués", color: "text-purple-400" },
];

export function GoodbyeSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % painPoints.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          {/* Main text */}
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              Dites adieu aux
            </span>
            {/* Decorative arrow */}
            <svg 
              className="w-8 h-8 md:w-12 md:h-12 text-terex-teal hidden md:block" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path 
                d="M4 12C4 12 8 4 12 4C16 4 20 12 20 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M12 4V20M12 20L8 16M12 20L16 16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Scrolling pain points */}
          <div className="relative h-16 md:h-20 flex items-center justify-center md:justify-start min-w-[280px] md:min-w-[350px]">
            {painPoints.map((point, index) => (
              <span
                key={index}
                className={`absolute text-3xl md:text-5xl lg:text-6xl font-bold transition-all duration-500 whitespace-nowrap ${point.color} ${
                  index === activeIndex
                    ? 'opacity-100 translate-y-0'
                    : index === (activeIndex - 1 + painPoints.length) % painPoints.length
                    ? 'opacity-0 -translate-y-8'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {point.text}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* Faded background pain points */}
        <div className="mt-12 md:mt-16 flex flex-col items-center md:items-end gap-2 md:gap-3 max-w-4xl mx-auto">
          {painPoints.map((point, index) => (
            <span
              key={index}
              className={`text-xl md:text-3xl lg:text-4xl font-bold transition-all duration-500 ${
                index === activeIndex
                  ? point.color
                  : 'text-gray-700'
              }`}
            >
              {point.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
