
import { useEffect, useState } from 'react';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: '1,000', label: 'utilisateurs actifs', suffix: '+' },
  { value: '10M', label: 'volume échangé (CFA)', suffix: '+' },
  { value: '6', label: 'pays couverts', suffix: '' },
  { value: '4.9', label: 'note moyenne', suffix: '/5' },
];

export function SpiceStats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 sm:py-32 bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-light mb-2 tracking-tight">
                {stat.value}
                <span className="text-gray-500">{stat.suffix}</span>
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA line */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-lg">
            Des questions ? {' '}
            <a 
              href="/contact" 
              className="text-white underline underline-offset-4 hover:text-gray-300 transition-colors"
            >
              Contactez notre équipe
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
