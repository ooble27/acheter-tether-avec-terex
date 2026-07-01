import { AnimatedSection } from '@/hooks/useScrollAnimation';

const stats = [
  { value: '6', label: 'pays couverts' },
  { value: '2%', label: 'commission unique' },
  { value: '<5 min', label: 'temps de transfert' },
  { value: '24/7', label: 'disponibilité' },
];

export function StatsSection() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h2
            className="font-bold tracking-tight text-white max-w-4xl"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', lineHeight: 1.12 }}
          >
            Nous connectons la crypto à toute l'Afrique.
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mt-5"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Une infrastructure simple et fiable pour acheter, vendre et
            transférer des USDT partout en Afrique de l'Ouest.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-16 sm:mt-20 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.07)' }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-8 sm:p-10"
              style={{ backgroundColor: '#1e1e1e' }}
            >
              <div className="text-4xl sm:text-5xl font-light text-white leading-none mb-3">
                {stat.value}
              </div>
              <div
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
